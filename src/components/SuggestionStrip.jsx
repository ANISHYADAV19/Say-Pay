import { cx } from '../utils/cx.js'
import { PlusIcon } from './icons.jsx'
import { useT } from '../i18n/useT.js'

/**
 * Suggestion chips (SP-019, FR-4.4). Horizontally scrollable; each chip adds
 * its item with one tap. Source-tagged styling (substitute / seasonal /
 * reorder). Renders nothing when there are no suggestions.
 */
const SOURCE_META = {
  substitute: { tagKey: 'suggestions.swap', dot: 'bg-accent' },
  seasonal: { tagKey: 'suggestions.season', dot: 'bg-amber-500' },
  reorder: { tagKey: 'suggestions.reorder', dot: 'bg-violet-500' },
}

export default function SuggestionStrip({ suggestions, onAdd }) {
  const { t } = useT()
  if (!suggestions || suggestions.length === 0) return null

  return (
    <section aria-label={t('suggestions.title')} className="space-y-2">
      <h2 className="px-1 text-xs font-semibold uppercase tracking-wide text-stone-500 dark:text-stone-400">
        {t('suggestions.title')}
      </h2>
      <ul className="flex snap-x gap-2 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {suggestions.map((s) => {
          const meta = SOURCE_META[s.source] || SOURCE_META.substitute
          const tag = t(meta.tagKey)
          return (
            <li key={s.id} className="snap-start">
              <button
                type="button"
                onClick={() => onAdd(s)}
                title={t('suggestions.addAction', { tag, label: s.label })}
                className={cx(
                  'flex items-center gap-2 whitespace-nowrap rounded-full border py-2 pl-3 pr-2 text-sm font-medium transition',
                  'border-stone-200 bg-white text-stone-800 hover:border-accent hover:text-accent',
                  'dark:border-stone-700 dark:bg-stone-900 dark:text-stone-100 dark:hover:border-accent',
                  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/40',
                )}
              >
                <span className={cx('h-2 w-2 rounded-full', meta.dot)} aria-hidden />
                {s.label}
                <span className="grid h-5 w-5 place-items-center rounded-full bg-accent/10 text-accent">
                  <PlusIcon className="text-sm" />
                </span>
              </button>
            </li>
          )
        })}
      </ul>
    </section>
  )
}
