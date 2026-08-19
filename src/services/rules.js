import { normalizeCommand } from './command.js'
import { categorize } from './categorize.js'

/**
 * Rule-based intent parser (SP-008, FR-2.2/2.3/2.5).
 *
 * Fast, offline, and deterministic. Handles the common phrasings; emits a
 * `confidence` score so the orchestrator (parser.js) knows when to escalate
 * to the LLM (docs/02-technical-architecture.md §4).
 *
 * It never throws — worst case it returns an `unknown` command with low
 * confidence, and the UI asks the user to rephrase.
 */

const NUMBER_WORDS = {
  a: 1, an: 1, one: 1, two: 2, three: 3, four: 4, five: 5, six: 6, seven: 7,
  eight: 8, nine: 9, ten: 10, eleven: 11, twelve: 12, dozen: 12, couple: 2,
  few: 3, several: 3, half: 1,
}

const UNITS = new Set([
  'bottle', 'bottles', 'can', 'cans', 'box', 'boxes', 'bag', 'bags', 'carton',
  'cartons', 'pack', 'packs', 'packet', 'packets', 'jar', 'jars', 'loaf',
  'loaves', 'bunch', 'bunches', 'dozen', 'kg', 'kilogram', 'kilograms', 'kilo',
  'kilos', 'g', 'gram', 'grams', 'gm', 'l', 'litre', 'litres', 'liter',
  'liters', 'ml', 'lb', 'lbs', 'pound', 'pounds', 'piece', 'pieces', 'pcs',
  'slice', 'slices', 'cup', 'cups', 'tin', 'tins', 'roll', 'rolls', 'bar',
  'bars', 'tube', 'tubes', 'stick', 'sticks', 'head', 'heads', 'dozen', 'pint',
  'pints', 'quart', 'quarts', 'gallon', 'gallons',
])

// Verb groups. Order of checking matters (see detectAction).
// The *_RE forms (no /g) are for detection; the *_STRIP_RE forms (with /g)
// remove EVERY verb occurrence when isolating the item text.
const REMOVE_RE = /\b(remove|delete|drop|discard|erase)\b|\btake\s+(?:off|out)\b|\bget\s+rid\s+of\b|\bcross\s+(?:off|out)\b/
const REMOVE_STRIP_RE = /\b(remove|delete|drop|discard|erase)\b|\btake\s+(?:off|out)\b|\bget\s+rid\s+of\b|\bcross\s+(?:off|out)\b/g
const CLEAR_RE = /\b(clear|empty|reset|wipe)\b|\bstart\s+over\b|\b(delete|clear|remove)\s+(?:everything|all|the\s+whole\s+list)\b/
const SEARCH_RE = /\b(find|search|look\s+for|show\s+me|look\s+up|do\s+you\s+have|any)\b/
const ADD_RE = /\b(add|need|want|buy|get|grab|put|include|purchase|remember)\b|\bpick\s+up\b|\bi'?d\s+like\b|\bgimme\b|\bwanna\b|\bgotta\b/
const ADD_STRIP_RE = /\b(add|need|want\s+to\s+buy|want|buy|get\s+me|get|grab|put|include|purchase|remember)\b|\bpick\s+up\b|\bwould\s+like\s+to\b|\bwould\s+like\b|\bi'?d\s+like\b|\bi'?ll\b|\bwanna\b|\bgotta\b|\bhave\s+to\b/g

// leading/trailing words that are never part of an item name
const FILLER = new Set([
  'of', 'some', 'the', 'a', 'an', 'please', 'for', 'me', 'my', 'to', 'i', 'we', 'you',
])

const stripListPhrases = (s) =>
  s
    .replace(/\b(to|from|on|in|off)\s+(my|the)\s+(shopping\s+)?(list|cart|basket)\b/g, ' ')
    .replace(/\b(my|the)\s+(shopping\s+)?(list|cart|basket)\b/g, ' ')
    .replace(/\bplease\b/g, ' ')
    .replace(/\bfor\s+me\b/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()

const cleanItem = (s) => {
  let tokens = stripListPhrases(s).split(' ').filter(Boolean)
  // trim leading/trailing filler words
  while (tokens.length && FILLER.has(tokens[0])) tokens.shift()
  while (tokens.length && FILLER.has(tokens[tokens.length - 1])) tokens.pop()
  return tokens.join(' ').trim()
}

/** Pull the first quantity (digit or number-word), optional unit, and item. */
function extractQtyUnitItem(phrase) {
  const tokens = phrase.split(' ').filter(Boolean)
  let quantity = 1
  let unit = null
  let qtyIndex = -1

  for (let i = 0; i < tokens.length; i++) {
    const t = tokens[i].replace(/[^\w.]/g, '')
    if (/^\d+(\.\d+)?$/.test(t)) {
      quantity = parseFloat(t)
      qtyIndex = i
      break
    }
    if (Object.prototype.hasOwnProperty.call(NUMBER_WORDS, t)) {
      quantity = NUMBER_WORDS[t]
      qtyIndex = i
      break
    }
  }

  let itemTokens = tokens.slice()
  if (qtyIndex >= 0) {
    // consume the qty token, and a following unit + optional "of"
    const consume = new Set([qtyIndex])
    const next = (tokens[qtyIndex + 1] || '').toLowerCase()
    if (UNITS.has(next)) {
      unit = next
      consume.add(qtyIndex + 1)
      if ((tokens[qtyIndex + 2] || '').toLowerCase() === 'of') consume.add(qtyIndex + 2)
    } else if (next === 'of') {
      consume.add(qtyIndex + 1)
    }
    itemTokens = tokens.filter((_, i) => !consume.has(i))
  }

  const item = cleanItem(itemTokens.join(' '))
  return { quantity: Math.max(1, Math.round(quantity)), unit, item }
}

/** Extract search filters (price/brand/size) and a cleaned query. */
function extractSearch(text) {
  const filters = {}
  let q = text

  const price =
    q.match(/\bunder\s*\$?\s*(\d+(?:\.\d+)?)/) ||
    q.match(/\bbelow\s*\$?\s*(\d+(?:\.\d+)?)/) ||
    q.match(/\bless\s+than\s*\$?\s*(\d+(?:\.\d+)?)/) ||
    q.match(/\bcheaper\s+than\s*\$?\s*(\d+(?:\.\d+)?)/) ||
    q.match(/\$\s*(\d+(?:\.\d+)?)\s*(?:or\s+less|and\s+under)?/)
  if (price) {
    filters.maxPrice = parseFloat(price[1])
    q = q.replace(price[0], ' ')
  }

  if (/\borganic\b/.test(q)) {
    filters.brand = 'organic'
    q = q.replace(/\borganic\b/g, ' ')
  }

  const size = q.match(/\b(\d+(?:\.\d+)?)\s?(kg|g|ml|l|litre|liter|oz|pack|lb|pound)\b/)
  if (size) {
    filters.size = size[0].trim()
    q = q.replace(size[0], ' ')
  }

  // strip search verbs and connectors
  q = q
    .replace(SEARCH_RE, ' ')
    .replace(/\bfor\b/g, ' ')
    .replace(/\b(dollars?|bucks?|price|priced|cost)\b/g, ' ')
    .replace(/\bunder\b|\bbelow\b|\bless\s+than\b/g, ' ')
  q = cleanItem(q)

  return { query: q, filters }
}

function detectAction(text) {
  if (CLEAR_RE.test(text)) return 'clear'
  // "change X to N" / "set X to N" / "update X to N" / "make it N"
  if (/\b(change|update|set)\b.*\bto\b/.test(text) || /\bmake\s+it\b/.test(text)) return 'update'
  if (SEARCH_RE.test(text)) return 'search'
  if (REMOVE_RE.test(text)) return 'remove'
  if (ADD_RE.test(text)) return 'add'
  return 'add' // default: a bare noun ("milk", "eggs") means add
}

function parseUpdate(text) {
  // change/set/update X to N
  let m = text.match(/\b(?:change|update|set)\s+(.+?)\s+to\s+(\d+|[a-z]+)\b/)
  if (m) {
    const qty = /^\d+$/.test(m[2]) ? parseInt(m[2], 10) : NUMBER_WORDS[m[2]]
    if (qty) return { item: cleanItem(m[1]), quantity: qty }
  }
  // make it N [item]
  m = text.match(/\bmake\s+it\s+(\d+|[a-z]+)\s*(.*)$/)
  if (m) {
    const qty = /^\d+$/.test(m[1]) ? parseInt(m[1], 10) : NUMBER_WORDS[m[1]]
    if (qty) return { item: cleanItem(m[2] || ''), quantity: qty }
  }
  return null
}

/**
 * @param {string} transcript
 * @param {string} [language]
 * @returns {import('./command.js').Command} normalized command with confidence
 */
export function parseRules(transcript, language = 'en-US') {
  const text = (transcript || '').toLowerCase().trim().replace(/[.!?]+$/g, '').replace(/\s+/g, ' ')
  if (!text) return normalizeCommand({ action: 'unknown', confidence: 0 }, { transcript, language })

  const action = detectAction(text)

  if (action === 'clear') {
    return normalizeCommand(
      { action: 'clear', confidence: 0.95 },
      { transcript, language },
    )
  }

  if (action === 'search') {
    const { query, filters } = extractSearch(text)
    const hasFilters = Object.keys(filters).length > 0
    return normalizeCommand(
      {
        action: 'search',
        item: query,
        filters,
        confidence: query || hasFilters ? 0.85 : 0.4,
      },
      { transcript, language },
    )
  }

  if (action === 'update') {
    const u = parseUpdate(text)
    if (u && u.item) {
      return normalizeCommand(
        { action: 'update', item: u.item, quantity: u.quantity, category: categorize(u.item), confidence: 0.85 },
        { transcript, language },
      )
    }
    // couldn't parse the update precisely -> let the LLM try
    return normalizeCommand({ action: 'update', confidence: 0.3 }, { transcript, language })
  }

  if (action === 'remove') {
    const phrase = cleanItem(text.replace(REMOVE_STRIP_RE, ' '))
    const { item } = extractQtyUnitItem(phrase)
    return normalizeCommand(
      { action: 'remove', item, confidence: item ? 0.9 : 0.2 },
      { transcript, language },
    )
  }

  // add (explicit verb or bare noun)
  const hadVerb = ADD_RE.test(text)
  const phrase = cleanItem(text.replace(ADD_STRIP_RE, ' '))
  const { quantity, unit, item } = extractQtyUnitItem(phrase)

  let confidence = 0
  if (item) confidence = hadVerb ? 0.9 : 0.55
  if (item && item.split(' ').length > 5) confidence -= 0.3 // long item = probably a misparse

  return normalizeCommand(
    {
      action: item ? 'add' : 'unknown',
      item,
      quantity,
      unit,
      category: categorize(item),
      confidence: Math.max(0, confidence),
    },
    { transcript, language },
  )
}
