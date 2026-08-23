import { cx } from '../utils/cx.js'
import { titleCase } from '../utils/format.js'
import { CheckIcon, TrashIcon, PlusIcon, MinusIcon } from './icons.jsx'
import { useT } from '../i18n/useT.js'
import { useTerm } from '../i18n/useTerm.js'

/**
 * A single list row (SP-016, FR-3.x/7.5). Tap the checkbox to mark bought,
 * step the quantity, or delete. `justChanged` briefly flashes the row after a
 * voice add/update so the user can see what happened.
 */
export default function ListItemRow({ item, justChanged, onToggle, onStep, onDelete }) {
  const { t } = useT()
  const { term } = useTerm()
  const { id, name, quantity, unit, checked } = item
  const displayLabel = titleCase(term(name))

  return (
    <li
      className={cx(
        'flex items-center gap-3 rounded-xl px-3 py-2.5 transition',
        checked
          ? 'border border-white/40 bg-white/25 dark:border-white/[0.04] dark:bg-white/[0.02]'
          : 'glass',
        justChanged && 'animate-flash',
      )}
    >
      <button
        type="button"
        onClick={() => onToggle(id)}
        role="checkbox"
        aria-checked={checked}
        aria-label={t(checked ? 'row.markNotBought' : 'row.markBought', { name: displayLabel })}
        className={cx(
          'grid h-6 w-6 shrink-0 place-items-center rounded-md border-2 transition',
          checked
            ? 'border-accent bg-accent text-white shadow-[0_2px_8px_-2px_rgba(13,148,136,0.7)]'
            : 'border-stone-400/70 bg-white/40 text-transparent hover:border-accent dark:border-stone-500/60 dark:bg-white/5',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/40',
        )}
      >
        <CheckIcon className="text-sm" />
      </button>

      <div className="min-w-0 flex-1">
        <p
          className={cx(
            'truncate text-base',
            checked
              ? 'text-stone-400 line-through dark:text-stone-500'
              : 'text-stone-900 dark:text-stone-100',
          )}
        >
          {displayLabel}
        </p>
        {unit && !checked && (
          <p className="text-xs text-stone-400 dark:text-stone-500">{unit}</p>
        )}
      </div>

      {!checked && (
        <div className="flex items-center gap-1 rounded-lg border border-white/50 bg-white/45 p-0.5 shadow-[inset_0_1px_0_0_rgb(255_255_255/0.6)] dark:border-white/[0.06] dark:bg-black/20 dark:shadow-none">
          <button
            type="button"
            onClick={() => onStep(id, quantity - 1)}
            disabled={quantity <= 1}
            aria-label={t('row.decrease', { name: displayLabel })}
            className="grid h-7 w-7 place-items-center rounded-md text-stone-600 transition hover:bg-white/80 hover:text-accent disabled:opacity-30 disabled:hover:bg-transparent dark:text-stone-300 dark:hover:bg-white/10"
          >
            <MinusIcon className="text-sm" />
          </button>
          <span className="w-6 text-center text-sm font-semibold tabular-nums" aria-label={t('row.quantity', { qty: quantity })}>
            {quantity}
          </span>
          <button
            type="button"
            onClick={() => onStep(id, quantity + 1)}
            aria-label={t('row.increase', { name: displayLabel })}
            className="grid h-7 w-7 place-items-center rounded-md text-stone-600 transition hover:bg-white/80 hover:text-accent dark:text-stone-300 dark:hover:bg-white/10"
          >
            <PlusIcon className="text-sm" />
          </button>
        </div>
      )}

      <button
        type="button"
        onClick={() => onDelete(id)}
        aria-label={t('row.delete', { name: displayLabel })}
        className="grid h-8 w-8 shrink-0 place-items-center rounded-lg text-stone-400 transition hover:bg-red-500/10 hover:text-red-600 dark:hover:bg-red-500/15 dark:hover:text-red-400"
      >
        <TrashIcon className="text-base" />
      </button>
    </li>
  )
}
