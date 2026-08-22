import { cx } from '../utils/cx.js'
import { CheckIcon, CloseIcon, SearchIcon } from './icons.jsx'

/**
 * Transient feedback toasts (SP-023, FR-7.2). Visual only — screen-reader
 * announcements go through StatusBar's live region, so these are aria-hidden
 * to avoid double-speaking. Auto-dismiss is handled by useToasts.
 *
 * These float over app content rather than just the aurora, so they use
 * `glass-floating` (its own backdrop blur). Because that surface is uniform,
 * success/info/error is carried by the icon chip and text colour instead of a
 * tinted background.
 */
const STYLES = {
  success: {
    text: 'text-accent-hover dark:text-accent',
    chip: 'bg-accent text-white',
  },
  info: {
    text: 'text-stone-700 dark:text-stone-200',
    chip: 'bg-stone-500 text-white dark:bg-stone-600',
  },
  error: {
    text: 'text-red-700 dark:text-red-300',
    chip: 'bg-red-500 text-white',
  },
}

const ICONS = {
  success: CheckIcon,
  info: SearchIcon,
  error: CloseIcon,
}

export default function ToastHost({ toasts, onDismiss }) {
  if (!toasts || toasts.length === 0) return null

  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-x-0 top-3 z-40 flex flex-col items-center gap-2 px-3"
    >
      {toasts.map((t) => {
        const Icon = ICONS[t.type] || ICONS.info
        const style = STYLES[t.type] || STYLES.info
        return (
          <button
            key={t.id}
            type="button"
            onClick={() => onDismiss(t.id)}
            className={cx(
              'glass-floating pointer-events-auto flex max-w-md items-center gap-2.5 rounded-xl py-2 pl-2 pr-4 text-sm font-medium animate-toast-in',
              style.text,
            )}
          >
            <span
              className={cx(
                'grid h-6 w-6 shrink-0 place-items-center rounded-lg text-[0.8rem]',
                style.chip,
              )}
            >
              <Icon />
            </span>
            <span className="text-left">{t.message}</span>
          </button>
        )
      })}
    </div>
  )
}
