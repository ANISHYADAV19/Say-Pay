import { cx } from '../utils/cx.js'

/**
 * Reusable Button component (SP-Buttons).
 * Consolidates standard action/utility buttons into 2-3 variants (primary, secondary, ghost)
 * sharing the same font (font-medium text-sm), border radius (rounded-xl), and transitions.
 */
export default function Button({
  type = 'button',
  variant = 'secondary',
  size = 'default',
  danger = false,
  pill = false,
  className,
  children,
  ...props
}) {
  const baseClasses = 'inline-flex items-center justify-center font-medium text-sm transition duration-150 ease-in-out select-none active:scale-95 disabled:opacity-50 disabled:active:scale-100 disabled:pointer-events-none focus-visible:outline-none focus-visible:ring-2'
  
  const radiusClass = pill ? 'rounded-full' : 'rounded-xl'

  const variantClasses = {
    primary: cx(
      'bg-accent text-white hover:bg-accent-hover ring-1 ring-inset ring-white/25 focus-visible:ring-accent/40',
      'shadow-[0_4px_14px_-4px_rgba(13,148,136,0.75)]'
    ),
    secondary: 'glass glass-interactive text-stone-700 hover:text-accent dark:text-stone-200 dark:hover:text-accent focus-visible:ring-accent/40',
    ghost: danger
      ? 'text-stone-500 hover:bg-red-500/10 hover:text-red-600 dark:text-stone-400 dark:hover:bg-red-500/15 dark:hover:text-red-400 focus-visible:ring-red-400/40'
      : 'text-stone-500 hover:bg-stone-500/10 hover:text-accent dark:text-stone-400 dark:hover:bg-stone-500/15 dark:hover:text-accent focus-visible:ring-accent/40',
  }

  const sizeClasses = {
    default: 'px-4 py-2.5',
    sm: 'px-3 py-1.5',
    icon: 'h-10 w-10 p-0 shrink-0',
    'icon-lg': 'h-11 w-11 p-0 shrink-0',
  }

  return (
    <button
      type={type}
      className={cx(
        baseClasses,
        radiusClass,
        variantClasses[variant],
        sizeClasses[size],
        className
      )}
      {...props}
    >
      {children}
    </button>
  )
}
