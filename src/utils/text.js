/**
 * Script-aware text folding for lexicon matching (FR-6.x, multilingual parsing).
 *
 * Speech recognizers are inconsistent about diacritics: hi-IN returns "साफ" about
 * as often as "साफ़", es-ES will hand back "anade" for "añade", and de-DE users
 * type "Aepfel" as readily as "Äpfel". Folding lets one lexicon entry match every
 * one of those spellings.
 *
 * Folding is only ever applied to LOOKUP KEYS — never to the utterance itself.
 * An item we don't recognize is stored verbatim as spoken, accents included, so
 * rewriting the transcript in place would corrupt it. Instead every lexicon word
 * is expanded to its spelling variants up front (see `variants`), and the
 * matching happens against the original text.
 */

const LATIN_MARKS = /[̀-ͯ]/g // combining accents, after NFD
const NUKTA = /़/g // Devanagari nukta — ज़ vs ज, साफ़ vs साफ

// German (and the odd loanword) also survives as an ASCII transliteration.
const TRANSLIT = { ä: 'ae', ö: 'oe', ü: 'ue', ß: 'ss' }
const TRANSLIT_RE = /[äöüß]/g

/**
 * Collapse a word to a spelling-insensitive form: Latin accents and the
 * Devanagari nukta are dropped. CJK has no combining marks, so it passes through
 * unchanged apart from the case fold.
 */
export function fold(s) {
  if (!s) return ''
  return s
    .toLowerCase()
    .normalize('NFD')
    .replace(LATIN_MARKS, '')
    .replace(NUKTA, '')
    .normalize('NFC')
}

/** "Äpfel" -> "aepfel". Only fires on the four German letters. */
export function transliterate(s) {
  return (s || '').toLowerCase().replace(TRANSLIT_RE, (c) => TRANSLIT[c])
}

/**
 * Every spelling of `word` a recognizer might plausibly produce: as written,
 * accent-folded, ASCII-transliterated, and with the apostrophe flipped between
 * the typographic and ASCII forms (French "j'ai" / "j'ai").
 *
 * @returns {string[]} deduped, so a plain ASCII word compiles to one branch
 */
export function variants(word) {
  const w = (word || '').toLowerCase().trim()
  if (!w) return []

  const out = new Set([w, fold(w), transliterate(w)])
  for (const v of [...out]) {
    if (v.includes('’')) out.add(v.replace(/’/g, "'"))
    if (v.includes("'")) out.add(v.replace(/'/g, '’'))
  }
  return [...out].filter(Boolean)
}

/** Escape a literal for use inside a RegExp. */
export const escapeRe = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
