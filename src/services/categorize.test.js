import { describe, it, expect } from 'vitest'
import { categorize } from './categorize.js'

describe('categorize', () => {
  it('maps common staples to the right category', () => {
    expect(categorize('milk')).toBe('dairy')
    expect(categorize('apples')).toBe('produce')
    expect(categorize('bread')).toBe('bakery')
    expect(categorize('chips')).toBe('snacks')
    expect(categorize('chicken')).toBe('meat')
    expect(categorize('salmon')).toBe('seafood')
    expect(categorize('toothpaste')).toBe('personal-care')
    expect(categorize('dish soap')).toBe('household')
    expect(categorize('orange juice')).toBe('beverages')
  })

  it('handles adjectives / multi-word via head noun', () => {
    expect(categorize('organic apples')).toBe('produce')
    expect(categorize('a bag of frozen peas')).toBe('frozen')
  })

  it('falls back to "other" for unknown items', () => {
    expect(categorize('unobtainium')).toBe('other')
    expect(categorize('')).toBe('other')
    expect(categorize(null)).toBe('other')
  })
})
