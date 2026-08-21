import { describe, it, expect } from 'vitest'
import { t, STRING_KEYS, SUPPORTED_LANGS, DEFAULT_LANG, baseLang, langsFor } from './strings.js'

/**
 * Guards the localization layer (FR-6.4): interpolation, fallbacks, and — most
 * importantly — that every UI string is defined in ALL supported languages, so
 * a forgotten translation fails the build instead of silently showing English.
 */
describe('i18n — t()', () => {
  it('interpolates {vars}', () => {
    expect(t('toast.added', 'en-US', { name: 'milk' })).toBe('Added milk')
    expect(t('row.quantity', 'es-ES', { qty: 3 })).toBe('Cantidad 3')
    expect(t('cmd.foundOther', 'en-US', { count: 4, label: 'apples' })).toBe(
      'Found 4 results for “apples”',
    )
  })

  it('leaves an unfilled placeholder intact rather than printing "undefined"', () => {
    expect(t('toast.added', 'en-US', {})).toBe('Added {name}')
  })

  it('falls back to the default language for an unknown language', () => {
    expect(t('status.ready', 'xx-YY')).toBe(t('status.ready', DEFAULT_LANG))
  })

  it('returns the key itself for an unknown key (so typos are visible)', () => {
    expect(t('does.not.exist', 'en-US')).toBe('does.not.exist')
  })

  it('returns an array for list-valued keys, per language', () => {
    const ex = t('empty.examples', 'es-ES')
    expect(Array.isArray(ex)).toBe(true)
    expect(ex).toHaveLength(3)
  })
})

describe('i18n — baseLang()', () => {
  it('extracts the subtag and defaults to en', () => {
    expect(baseLang('es-ES')).toBe('es')
    expect(baseLang('zh-CN')).toBe('zh')
    expect(baseLang()).toBe('en')
  })
})

describe('i18n — coverage', () => {
  it('defines every key in all supported languages', () => {
    for (const key of STRING_KEYS) {
      for (const lang of SUPPORTED_LANGS) {
        expect(langsFor(key), `missing ${lang} for "${key}"`).toContain(lang)
      }
    }
  })
})
