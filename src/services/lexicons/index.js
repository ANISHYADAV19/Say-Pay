import { baseLang } from '../../i18n/strings.js'
import { variants, escapeRe } from '../../utils/text.js'
import en from './en.js'
import es from './es.js'
import fr from './fr.js'
import de from './de.js'
import hi from './hi.js'
import zh from './zh.js'

/**
 * Lexicon lookup + regex compilation for the rule parser.
 *
 * Each lexicon is a plain word list (see ./en.js). This module turns it into the
 * regexes and Sets rules.js needs, and caches the result per language so parsing
 * stays synchronous and allocation-free after the first utterance.
 *
 * Three things the compiler has to get right:
 *
 *  - **Longest-first ordering.** Regex alternation is leftmost-first at each
 *    position, so "take off" must precede "take" and "जोड़ दो" must precede
 *    "जोड़", or the short form swallows the long one and leaves a fragment
 *    behind in the item name.
 *  - **Boundaries only where they exist.** JS `\b` is defined against
 *    `[A-Za-z0-9_]`, so it never matches at the edge of a Devanagari or CJK
 *    character. Those lexicons set `wordBoundary: false` and get bare
 *    alternations instead.
 *  - **Spelling variants.** Every word is expanded via utils/text.js, so one
 *    entry covers "añade"/"anade" and "Äpfel"/"äpfel"/"aepfel".
 */

const LEXICONS = { en, es, fr, de, hi, zh }

/** Raw lexicon data for a BCP-47 tag, falling back to English. */
export function lexiconFor(language) {
  return LEXICONS[baseLang(language)] || en
}

/** Variant-expanded alternation body, longest-first. `null` for an empty list. */
function altBody(words) {
  const expanded = new Set()
  for (const w of words || []) for (const v of variants(w)) expanded.add(v)
  if (expanded.size === 0) return null

  return [...expanded]
    .sort((a, b) => b.length - a.length || (a < b ? -1 : 1))
    .map(escapeRe)
    .join('|')
}

/** Wrap an alternation body as a group, with `\b` only where it can match. */
const wrap = (body, wordBoundary) =>
  body ? (wordBoundary ? `\\b(?:${body})\\b` : `(?:${body})`) : null

/** A detect/strip regex pair, mirroring the original REMOVE_RE / REMOVE_STRIP_RE. */
function group(words, wordBoundary) {
  const src = wrap(altBody(words), wordBoundary)
  if (!src) return { detect: null, strip: null }
  return { detect: new RegExp(src), strip: new RegExp(src, 'g') }
}

/** Single-token membership set, variant-expanded. Multi-word entries are skipped. */
function tokenSet(words) {
  const set = new Set()
  for (const w of words || []) {
    if (/\s/.test(w)) continue
    for (const v of variants(w)) set.add(v)
  }
  return set
}

/** Number word -> value, variant-expanded so "fünf"/"funf"/"fuenf" all resolve. */
function numberMap(numbers) {
  const map = new Map()
  for (const [word, value] of Object.entries(numbers || {})) {
    for (const v of variants(word)) if (!map.has(v)) map.set(v, value)
  }
  return map
}

function compile(lex) {
  const wb = lex.wordBoundary
  const numbers = numberMap(lex.numbers)

  const numberBody = altBody([...numbers.keys()])
  const unitBody = altBody(lex.units)
  const sizeBody = wrap(altBody(lex.sizeUnits), wb)

  return {
    lex,
    lang: lex.lang,
    wordBoundary: wb,
    spaced: lex.spaced,

    add: group(lex.verbs.add, wb),
    remove: group(lex.verbs.remove, wb),
    clear: group(lex.verbs.clear, wb),
    search: group(lex.verbs.search, wb),

    numbers,
    units: tokenSet(lex.units),
    partitive: tokenSet(lex.partitive),

    // Filler is trimmed token-by-token off both ends in spaced languages, and
    // stripped wherever it appears in unspaced ones (there are no tokens to trim).
    filler: tokenSet(lex.filler),
    fillerRe: group(lex.filler, wb).strip,

    listPhrasesRe: group(lex.listPhrases, wb).strip,
    searchNoiseRe: group(lex.searchNoise, wb).strip,
    organic: group(lex.organic, wb),

    sizeRe: sizeBody ? new RegExp(`(\\d+(?:\\.\\d+)?)\\s?${sizeBody}`) : null,

    // --- unspaced (zh) extraction -------------------------------------------
    /** First quantity anywhere in the text: a digit run or a number word. */
    qtyRe: new RegExp(`(\\d+(?:\\.\\d+)?${numberBody ? `|${numberBody}` : ''})`),
    /** Measure word immediately following the quantity. */
    unitAtStartRe: unitBody ? new RegExp(`^(${unitBody})`) : null,

    price: lex.price,
    update: lex.update,

    /** Script digits to fold to ASCII ("२" -> "2"), or null when there are none. */
    digits: lex.scriptDigits || null,
  }
}

const cache = new Map()

/**
 * Compiled lexicon for a BCP-47 tag. Cached — call it freely.
 * @returns {ReturnType<typeof compile>}
 */
export function compiledFor(language) {
  const lex = lexiconFor(language)
  let hit = cache.get(lex.lang)
  if (!hit) {
    hit = compile(lex)
    cache.set(lex.lang, hit)
  }
  return hit
}

export { LEXICONS }
