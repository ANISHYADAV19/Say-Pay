import categoriesData from '../data/categories.json'
import { CATEGORIES } from './command.js'

/**
 * Auto-categorization (FR-2.4, SP-011).
 *
 * Builds a keyword -> category index from data/categories.json once, then
 * resolves an item name to a category. This is the rule-based/offline path;
 * the LLM can also supply a category, but we always fall back to this so
 * categorization works with no network.
 */

// keyword -> category (exact), and a list of multi-word keywords for substring hits.
const exact = new Map()
const multiWord = [] // [{ kw, cat }], longest first

for (const cat of Object.keys(categoriesData)) {
  for (const kw of categoriesData[cat]) {
    const k = kw.toLowerCase().trim()
    if (!exact.has(k)) exact.set(k, cat)
    if (k.includes(' ')) multiWord.push({ kw: k, cat })
  }
}
multiWord.sort((a, b) => b.kw.length - a.kw.length)

/** Strip a trailing plural 's' for a light singular/plural match. */
const singularize = (w) => (w.length > 3 && w.endsWith('s') ? w.slice(0, -1) : w)

/**
 * @param {string} name  item name (any casing)
 * @returns {string}     a category from CATEGORIES ('other' if unknown)
 */
export function categorize(name) {
  if (!name || typeof name !== 'string') return 'other'
  const n = name.toLowerCase().trim().replace(/\s+/g, ' ')
  if (!n) return 'other'

  // 1) exact full-name match ("olive oil", "ice cream")
  if (exact.has(n)) return exact.get(n)

  // 2) multi-word keyword contained in the name ("frozen peas" in "bag of frozen peas")
  for (const { kw, cat } of multiWord) {
    if (n.includes(kw)) return cat
  }

  // 3) token match — check each word and its singular form; head noun (last) wins ties
  const tokens = n.split(' ')
  for (let i = tokens.length - 1; i >= 0; i--) {
    const t = tokens[i]
    if (exact.has(t)) return exact.get(t)
    const s = singularize(t)
    if (exact.has(s)) return exact.get(s)
  }

  return 'other'
}

/** Guard used by the normalizer/UI. */
export const isKnownCategory = (c) => CATEGORIES.includes(c)
