import { describe, it, expect } from 'vitest'
import { toCanonical, displayName, TERMS, ALIASES } from './terms.js'
import { fold } from '../utils/text.js'

describe('Terms Localization Engine', () => {
  it('should round-trip displayName and toCanonical for every term in all languages', () => {
    for (const [canonicalKey, translations] of Object.entries(TERMS)) {
      for (const [lang, val] of Object.entries(translations)) {
        const parsedCanonical = toCanonical(val, lang)
        expect(parsedCanonical).toBe(canonicalKey)

        const renderedName = displayName(parsedCanonical, lang)
        expect(renderedName).toBe(val)
      }
    }
  })

  it('should guarantee no cross-language alias collision maps to multiple canonicals', () => {
    const aliasToCanonical = new Map()

    // 1. Check translations in TERMS
    for (const [canonicalKey, translations] of Object.entries(TERMS)) {
      for (const val of Object.values(translations)) {
        const folded = fold(val)
        if (aliasToCanonical.has(folded)) {
          expect(aliasToCanonical.get(folded)).toBe(canonicalKey)
        } else {
          aliasToCanonical.set(folded, canonicalKey)
        }
      }
    }

    // 2. Check ALIASES
    for (const aliases of Object.values(ALIASES)) {
      for (const [alias, canonicalKey] of Object.entries(aliases)) {
        const folded = fold(alias)
        if (aliasToCanonical.has(folded)) {
          expect(aliasToCanonical.get(folded)).toBe(canonicalKey)
        } else {
          aliasToCanonical.set(folded, canonicalKey)
        }
      }
    }
  })

  it('should return unknown verbatim inputs untouched', () => {
    expect(displayName('xyz123', 'en-US')).toBe('xyz123')
    expect(displayName('कुछ नया', 'hi-IN')).toBe('कुछ नया')
    expect(toCanonical('xyz123')).toBeNull()
  })
})
