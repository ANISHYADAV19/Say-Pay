import { describe, it, expect } from 'vitest'
import { filterCatalog } from './catalog.js'

describe('filterCatalog', () => {
  it('finds items by query token', () => {
    const res = filterCatalog({ query: 'apples' })
    expect(res.length).toBeGreaterThan(0)
    expect(res.every((p) => p.name.includes('apples'))).toBe(true)
  })

  it('applies a maxPrice filter (inclusive) and sorts cheapest-first', () => {
    const res = filterCatalog({ query: 'milk', maxPrice: 2.5 })
    expect(res.length).toBeGreaterThan(0)
    expect(res.every((p) => p.price <= 2.5)).toBe(true)
    for (let i = 1; i < res.length; i++) expect(res[i].price).toBeGreaterThanOrEqual(res[i - 1].price)
  })

  it('treats "organic" brand filter as a tag match', () => {
    const res = filterCatalog({ query: 'apples', brand: 'organic' })
    expect(res.length).toBeGreaterThan(0)
    expect(res.every((p) => p.tags.includes('organic'))).toBe(true)
  })

  it('"toothpaste under $5" style query', () => {
    const res = filterCatalog({ query: 'toothpaste', maxPrice: 5 })
    expect(res.length).toBeGreaterThan(0)
    expect(res.every((p) => p.price <= 5 && p.name.includes('toothpaste'))).toBe(true)
  })

  it('returns empty for no matches (no crash)', () => {
    expect(filterCatalog({ query: 'unobtainium' })).toEqual([])
  })
})
