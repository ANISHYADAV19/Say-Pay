import { cx } from '../utils/cx.js'
import { CheckIcon, CloseIcon, SearchIcon } from './icons.jsx'

/**
 * Transient feedback toasts (SP-023, FR-7.2). Visual only — screen-reader
 * announcements go through StatusBar's live region, so these are aria-hidden
 * to avoid double-speaking. Auto-dismiss is handled by useToasts.
 */
const STYLES = {
  success: 'border-accent/30 bg-accent/10 text-accent-hover dark:text-accent',
  info: 'border-stone-300 bg-white text-stone-700 dark:border-stone-700 dark:bg-stone-800 dark:text-stone-200',
  error: 'border-red-300 bg-red-50 text-red-700 dark:border-red-900 dark:bg-red-950/60 dark:text-red-300',
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
        return (
          <button
            key={t.id}
            type="button"
            onClick={() => onDismiss(t.id)}
            className={cx(
              'pointer-events-auto flex max-w-md items-center gap-2 rounded-xl border px-4 py-2.5 text-sm font-medium shadow-lg backdrop-blur animate-toast-in',
              STYLES[t.type] || STYLES.info,
            )}
          >
            <Icon className="shrink-0 text-base" />
            <span className="text-left">{t.message}</span>
          </button>
        )
      })}
    </div>
  )
}
