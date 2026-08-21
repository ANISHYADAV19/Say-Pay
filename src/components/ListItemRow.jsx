import { cx } from '../utils/cx.js'
import { titleCase } from '../utils/format.js'
import { CheckIcon, TrashIcon, PlusIcon, MinusIcon } from './icons.jsx'
import { useT } from '../i18n/useT.js'

/**
 * A single list row (SP-016, FR-3.x/7.5). Tap the checkbox to mark bought,
 * step the quantity, or delete. `justChanged` briefly flashes the row after a
 * voice add/update so the user can see what happened.
 */
export default function ListItemRow({ item, justChanged, onToggle, onStep, onDelete }) {
  const { t } = useT()
  const { id, name, quantity, unit, checked } = item

  return (
    <li
      className={cx(
        'flex items-center gap-3 rounded-xl border px-3 py-2.5 transition',
        checked
          ? 'border-transparent bg-stone-100 dark:bg-stone-800/50'
          : 'border-stone-200 bg-white dark:border-stone-800 dark:bg-stone-900',
        justChanged && 'animate-flash',
      )}
    >
      <button
        type="button"
        onClick={() => onToggle(id)}
        role="checkbox"
        aria-checked={checked}
        aria-label={t(checked ? 'row.markNotBought' : 'row.markBought', { name })}
        className={cx(
          'grid h-6 w-6 shrink-0 place-items-center rounded-md border-2 transition',
          checked
            ? 'border-accent bg-accent text-white'
            : 'border-stone-300 text-transparent hover:border-accent dark:border-stone-600',
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
          {titleCase(name)}
        </p>
        {unit && !checked && (
          <p className="text-xs text-stone-400 dark:text-stone-500">{unit}</p>
        )}
      </div>

      {!checked && (
        <div className="flex items-center gap-1 rounded-lg bg-stone-100 p-0.5 dark:bg-stone-800">
          <button
            type="button"
            onClick={() => onStep(id, quantity - 1)}
            disabled={quantity <= 1}
            aria-label={t('row.decrease', { name })}
            className="grid h-7 w-7 place-items-center rounded-md text-stone-600 transition hover:bg-white disabled:opacity-30 dark:text-stone-300 dark:hover:bg-stone-700"
          >
            <MinusIcon className="text-sm" />
          </button>
          <span className="w-6 text-center text-sm font-semibold tabular-nums" aria-label={t('row.quantity', { qty: quantity })}>
            {quantity}
          </span>
          <button
            type="button"
            onClick={() => onStep(id, quantity + 1)}
            aria-label={t('row.increase', { name })}
            className="grid h-7 w-7 place-items-center rounded-md text-stone-600 transition hover:bg-white dark:text-stone-300 dark:hover:bg-stone-700"
          >
            <PlusIcon className="text-sm" />
          </button>
        </div>
      )}

      <button
        type="button"
        onClick={() => onDelete(id)}
        aria-label={t('row.delete', { name })}
        className="grid h-8 w-8 shrink-0 place-items-center rounded-lg text-stone-400 transition hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-950/40"
      >
        <TrashIcon className="text-base" />
      </button>
    </li>
  )
}
