import { normalizeCommand } from './command.js'
import { categorize } from './categorize.js'
import { compiledFor } from './lexicons/index.js'
import { toCanonical } from './terms.js'

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

function foldDigits(text, digits) {
  if (!digits) return text
  let out = ''
  for (let i = 0; i < text.length; i++) {
    const c = text[i]
    const idx = digits.indexOf(c)
    if (idx >= 0) {
      out += idx.toString()
    } else {
      out += c
    }
  }
  return out
}

const stripListPhrases = (s, lex) => {
  if (lex.listPhrasesRe) {
    s = s.replace(lex.listPhrasesRe, ' ')
  }
  return s.replace(/\s+/g, ' ').trim()
}

const cleanItem = (s, lex) => {
  s = stripListPhrases(s, lex)
  if (lex.spaced) {
    let tokens = s.split(' ').filter(Boolean)
    // trim leading/trailing filler words
    while (tokens.length && lex.filler.has(tokens[0])) tokens.shift()
    while (tokens.length && lex.filler.has(tokens[tokens.length - 1])) tokens.pop()
    return tokens.join(' ').trim()
  } else {
    // unspaced: strip filler anywhere
    if (lex.fillerRe) {
      s = s.replace(lex.fillerRe, '')
    }
    return s.replace(/\s+/g, '').trim()
  }
}

/** Pull the first quantity (digit or number-word), optional unit, and item. */
function extractQtyUnitItem(phrase, lex) {
  if (lex.spaced) {
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
      if (lex.numbers.has(t)) {
        quantity = lex.numbers.get(t)
        qtyIndex = i
        break
      }
    }

    let itemTokens = tokens.slice()
    if (qtyIndex >= 0) {
      // consume the qty token, and a following unit + optional partitive
      const consume = new Set([qtyIndex])
      const next = (tokens[qtyIndex + 1] || '').toLowerCase()
      if (lex.units.has(next)) {
        unit = next
        consume.add(qtyIndex + 1)
        const nextNext = (tokens[qtyIndex + 2] || '').toLowerCase()
        if (lex.partitive.has(nextNext)) {
          consume.add(qtyIndex + 2)
        }
      } else if (lex.partitive.has(next)) {
        consume.add(qtyIndex + 1)
      }
      itemTokens = tokens.filter((_, i) => !consume.has(i))
    }

    const item = cleanItem(itemTokens.join(' '), lex)
    return { quantity: Math.max(1, Math.round(quantity)), unit, item }
  } else {
    // Unspaced (Chinese): pull quantity via pattern rather than scanning tokens
    let quantity = 1
    let unit = null
    let item = phrase

    const qtyMatch = phrase.match(lex.qtyRe)
    if (qtyMatch) {
      const rawQty = qtyMatch[1]
      if (/^\d+(\.\d+)?$/.test(rawQty)) {
        quantity = parseFloat(rawQty)
      } else if (lex.numbers.has(rawQty)) {
        quantity = lex.numbers.get(rawQty)
      }

      const startIdx = qtyMatch.index
      const endIdx = startIdx + rawQty.length
      const remaining = phrase.slice(endIdx)

      let unitLength = 0
      if (lex.unitAtStartRe) {
        const unitMatch = remaining.match(lex.unitAtStartRe)
        if (unitMatch) {
          unit = unitMatch[1]
          unitLength = unit.length
        }
      }

      item = phrase.slice(0, startIdx) + phrase.slice(endIdx + unitLength)
    }

    item = cleanItem(item, lex)
    return { quantity: Math.max(1, Math.round(quantity)), unit, item }
  }
}

/** Extract search filters (price/brand/size) and a cleaned query. */
function extractSearch(text, lex) {
  const filters = {}
  let q = text

  for (const r of lex.price || []) {
    const m = q.match(r)
    if (m) {
      filters.maxPrice = parseFloat(m[1])
      q = q.replace(m[0], ' ')
      break
    }
  }

  if (lex.organic.detect && lex.organic.detect.test(q)) {
    filters.brand = 'organic'
    q = q.replace(lex.organic.strip, ' ')
  }

  if (lex.sizeRe) {
    const size = q.match(lex.sizeRe)
    if (size) {
      filters.size = size[0].trim()
      q = q.replace(size[0], ' ')
    }
  }

  if (lex.search.strip) {
    q = q.replace(lex.search.strip, ' ')
  }
  if (lex.searchNoiseRe) {
    q = q.replace(lex.searchNoiseRe, ' ')
  }

  q = cleanItem(q, lex)
  return { query: q, filters }
}

function detectAction(text, lex) {
  if (lex.clear.detect && lex.clear.detect.test(text)) return 'clear'
  for (const r of lex.update.detect || []) {
    if (r.test(text)) return 'update'
  }
  if (lex.search.detect && lex.search.detect.test(text)) return 'search'
  if (lex.remove.detect && lex.remove.detect.test(text)) return 'remove'
  if (lex.add.detect && lex.add.detect.test(text)) return 'add'
  return 'add' // default: a bare noun means add
}

function parseUpdate(text, lex) {
  for (const item of lex.update.extract || []) {
    const m = text.match(item.re)
    if (m) {
      const rawQty = m[item.qty]
      let qty = 1
      if (/^\d+$/.test(rawQty)) {
        qty = parseInt(rawQty, 10)
      } else if (lex.numbers.has(rawQty)) {
        qty = lex.numbers.get(rawQty)
      }
      if (qty) return { item: cleanItem(m[item.item], lex), quantity: qty }
    }
  }
  return null
}

/**
 * @param {string} transcript
 * @param {string} [language]
 * @returns {import('./command.js').Command} normalized command with confidence
 */
export function parseRules(transcript, language = 'en-US') {
  const lex = compiledFor(language)
  let text = (transcript || '').toLowerCase().trim().replace(/[.!?]+$/g, '')

  text = foldDigits(text, lex.digits)

  if (lex.spaced) {
    text = text.replace(/\s+/g, ' ')
  }

  if (!text) return normalizeCommand({ action: 'unknown', confidence: 0 }, { transcript, language })

  const action = detectAction(text, lex)

  if (action === 'clear') {
    return normalizeCommand(
      { action: 'clear', confidence: 0.95 },
      { transcript, language },
    )
  }

  if (action === 'search') {
    let { query, filters } = extractSearch(text, lex)
    const hasFilters = Object.keys(filters).length > 0
    query = toCanonical(query, language) ?? query
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
    const u = parseUpdate(text, lex)
    if (u && u.item) {
      const canonicalItem = toCanonical(u.item, language) ?? u.item
      return normalizeCommand(
        { action: 'update', item: canonicalItem, quantity: u.quantity, category: categorize(canonicalItem), confidence: 0.85 },
        { transcript, language },
      )
    }
    return normalizeCommand({ action: 'update', confidence: 0.3 }, { transcript, language })
  }

  if (action === 'remove') {
    const phrase = cleanItem(text.replace(lex.remove.strip, ' '), lex)
    let { item } = extractQtyUnitItem(phrase, lex)
    item = toCanonical(item, language) ?? item
    return normalizeCommand(
      { action: 'remove', item, confidence: item ? 0.9 : 0.2 },
      { transcript, language },
    )
  }

  // add (explicit verb or bare noun)
  const hadVerb = lex.add.detect && lex.add.detect.test(text)
  const phrase = cleanItem(text.replace(lex.add.strip, ' '), lex)
  let { quantity, unit, item } = extractQtyUnitItem(phrase, lex)

  item = toCanonical(item, language) ?? item

  let confidence = 0
  if (item) {
    confidence = hadVerb ? 0.9 : 0.55
    if (lex.spaced) {
      if (item.split(' ').length > 5) confidence -= 0.3 // long item = probably a misparse
    } else {
      if (item.length > 10) confidence -= 0.3 // unspaced: character count threshold instead
    }
  }

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
