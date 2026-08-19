import catalog from '../data/catalog.json'

/**
 * Mock catalog search (SP-020, FR-5.1/5.2).
 *
 * Pure filter over the static catalog: every query token must appear in the
 * product's searchable text; brand matches the brand field OR a tag (so
 * "organic" works as a filter); size is a substring; maxPrice is inclusive.
 * Results are sorted cheapest-first.
 */

const haystack = (p) =>
  `${p.name} ${p.brand} ${p.category} ${(p.tags || []).join(' ')}`.toLowerCase()

/**
 * @param {{query?:string, brand?:string, size?:string, maxPrice?:number}} filters
 * @param {Array} [products]  defaults to the bundled catalog
 */
export function filterCatalog(filters = {}, products = catalog) {
  const query = (filters.query || '').toLowerCase().trim()
  const tokens = query ? query.split(/\s+/) : []
  const brand = (filters.brand || '').toLowerCase().trim()
  const size = (filters.size || '').toLowerCase().trim()
  const maxPrice = Number(filters.maxPrice)
  const hasMax = Number.isFinite(maxPrice) && maxPrice > 0

  return products
    .filter((p) => {
      const hay = haystack(p)
      if (tokens.length && !tokens.every((t) => hay.includes(t))) return false
      if (brand && !(p.brand.toLowerCase().includes(brand) || (p.tags || []).includes(brand)))
        return false
      if (size && !String(p.size).toLowerCase().includes(size)) return false
      if (hasMax && p.price > maxPrice) return false
      return true
    })
    .sort((a, b) => a.price - b.price)
}

export const getCatalog = () => catalog
