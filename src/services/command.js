/**
 * The `Command` is the internal contract every part of the app speaks:
 * the rule parser and the LLM proxy both emit it, and the command handler
 * consumes it. See docs/02-technical-architecture.md §3.
 *
 * Because the LLM output is untrusted (docs/03-security-and-access.md §3),
 * `normalizeCommand` is the single choke point that coerces ANY raw object
 * — from rules or from the LLM — into a safe, well-shaped Command.
 */

export const ACTIONS = ['add', 'remove', 'update', 'search', 'clear', 'unknown']

/** Fixed category vocabulary. The LLM is constrained to this list too. */
export const CATEGORIES = [
  'produce',
  'dairy',
  'bakery',
  'meat',
  'seafood',
  'frozen',
  'pantry',
  'snacks',
  'beverages',
  'household',
  'personal-care',
  'other',
]

/** Human-facing labels + display order for category group headers. */
export const CATEGORY_LABELS = {
  produce: 'Produce',
  dairy: 'Dairy',
  bakery: 'Bakery',
  meat: 'Meat',
  seafood: 'Seafood',
  frozen: 'Frozen',
  pantry: 'Pantry',
  snacks: 'Snacks',
  beverages: 'Beverages',
  household: 'Household',
  'personal-care': 'Personal Care',
  other: 'Other',
}

/** Confidence below this triggers the LLM fallback (docs §4, SP-010). */
export const LLM_FALLBACK_THRESHOLD = 0.65

const clampConfidence = (n) => {
  const v = Number(n)
  if (Number.isNaN(v)) return 0
  return Math.min(1, Math.max(0, v))
}

const toPositiveInt = (n, fallback = 1) => {
  const v = Math.round(Number(n))
  if (!Number.isFinite(v) || v < 1) return fallback
  return Math.min(v, 999) // sanity cap
}

/** A safe, empty command used as the default when parsing fails. */
export function emptyCommand(overrides = {}) {
  return {
    action: 'unknown',
    item: '',
    quantity: 1,
    unit: null,
    category: 'other',
    filters: {},
    language: 'en-US',
    confidence: 0,
    ...overrides,
  }
}

/**
 * Coerce an arbitrary raw object into a valid Command. Never throws.
 * @param {object} raw               partial command from rules or the LLM
 * @param {object} [ctx]
 * @param {string} [ctx.language]    language tag to stamp on the command
 * @param {string} [ctx.transcript]  original transcript (kept for logging/UX)
 */
export function normalizeCommand(raw = {}, ctx = {}) {
  const language = raw.language || ctx.language || 'en-US'

  const action = ACTIONS.includes(raw.action) ? raw.action : 'unknown'

  const item =
    typeof raw.item === 'string' ? raw.item.trim().toLowerCase().replace(/\s+/g, ' ') : ''

  const unit =
    typeof raw.unit === 'string' && raw.unit.trim() ? raw.unit.trim().toLowerCase() : null

  const category = CATEGORIES.includes(raw.category) ? raw.category : 'other'

  // Filters only make sense for search; keep the object tidy.
  const rawFilters = raw.filters && typeof raw.filters === 'object' ? raw.filters : {}
  const filters = {}
  if (typeof rawFilters.brand === 'string' && rawFilters.brand.trim()) {
    filters.brand = rawFilters.brand.trim().toLowerCase()
  }
  if (typeof rawFilters.size === 'string' && rawFilters.size.trim()) {
    filters.size = rawFilters.size.trim().toLowerCase()
  }
  const maxPrice = Number(rawFilters.maxPrice)
  if (Number.isFinite(maxPrice) && maxPrice > 0) {
    filters.maxPrice = maxPrice
  }

  const cmd = {
    action,
    item,
    quantity: toPositiveInt(raw.quantity, 1),
    unit,
    category,
    filters,
    language,
    confidence: clampConfidence(raw.confidence),
    transcript: ctx.transcript ?? raw.transcript ?? '',
  }

  // An add/remove/update with no item can't be executed — downgrade to unknown
  // so the UI asks the user to rephrase instead of doing something surprising.
  if (['add', 'remove', 'update'].includes(cmd.action) && !cmd.item) {
    cmd.action = 'unknown'
    cmd.confidence = Math.min(cmd.confidence, 0.2)
  }

  return cmd
}
