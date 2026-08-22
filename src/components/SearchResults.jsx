import { cx } from '../utils/cx.js'
import { titleCase, money } from '../utils/format.js'
import { SearchIcon, CloseIcon, PlusIcon } from './icons.jsx'
import { useT } from '../i18n/useT.js'

/**
 * Catalog search results (SP-021, FR-5.2/5.3). Shows the matched products with
 * price/brand/size and a one-tap add. Overlays the list; closing returns to it.
 */
export default function SearchResults({ search, onAdd, onClose }) {
  const { t } = useT()
  const { query, filters = {}, results = [] } = search
  const label = query || filters.brand || t('search.itemsFallback')

  const chips = []
  if (filters.brand) chips.push(filters.brand)
  if (filters.size) chips.push(filters.size)
  if (filters.maxPrice) chips.push(t('search.under', { price: money(filters.maxPrice) }))

  return (
    <div className="space-y-4">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h2 className="flex items-center gap-2 text-lg font-semibold text-stone-900 dark:text-stone-100">
            <SearchIcon className="shrink-0 text-accent" />
            <span className="truncate">{t('search.resultsFor', { label })}</span>
          </h2>
          {chips.length > 0 && (
            <div className="mt-1 flex flex-wrap gap-1.5">
              {chips.map((c) => (
                <span
                  key={c}
                  className="rounded-full bg-accent/10 px-2 py-0.5 text-xs font-medium capitalize text-accent"
                >
                  {c}
                </span>
              ))}
            </div>
          )}
        </div>
        <button
          type="button"
          onClick={onClose}
          aria-label={t('search.close')}
          className="glass glass-interactive grid h-9 w-9 shrink-0 place-items-center rounded-lg text-stone-500 hover:text-accent dark:text-stone-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/40"
        >
          <CloseIcon />
        </button>
      </div>

      {results.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-stone-400/50 bg-white/20 py-10 text-center text-stone-500 dark:border-stone-600/50 dark:bg-white/[0.03] dark:text-stone-400">
          <p className="font-medium">{t('search.noMatches', { label })}</p>
          <p className="mt-1 text-sm">{t('search.tryOther')}</p>
        </div>
      ) : (
        <ul className="space-y-2">
          {results.map((p) => (
            <li
              key={p.id}
              className="glass flex items-center gap-3 rounded-xl px-3 py-2.5"
            >
              <div className="min-w-0 flex-1">
                <p className="truncate font-medium text-stone-900 dark:text-stone-100">
                  {titleCase(p.name)}
                </p>
                <p className="truncate text-xs text-stone-400 dark:text-stone-500">
                  {[p.brand, p.size].filter(Boolean).join(' · ')}
                </p>
              </div>
              <span className="shrink-0 font-semibold tabular-nums text-stone-700 dark:text-stone-200">
                {money(p.price)}
              </span>
              <button
                type="button"
                onClick={() => onAdd(p)}
                aria-label={t('search.addAria', { name: p.name })}
                className={cx(
                  'flex shrink-0 items-center gap-1 rounded-lg bg-accent px-2.5 py-1.5 text-sm font-medium text-white transition',
                  'ring-1 ring-inset ring-white/25 shadow-[0_4px_14px_-4px_rgba(13,148,136,0.75)]',
                  'hover:bg-accent-hover active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/40',
                )}
              >
                <PlusIcon className="text-sm" />
                {t('search.add')}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
