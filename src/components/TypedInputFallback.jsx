import { useState } from 'react'
import { cx } from '../utils/cx.js'
import { PlusIcon } from './icons.jsx'
import { useT } from '../i18n/useT.js'

/**
 * Typed-input fallback (SP-006, FR-1.4). Always available, and PROMOTED to the
 * primary input when speech is unsupported/denied. Feeds the exact same parser
 * pipeline as voice, so the app is fully usable without a mic.
 */
export default function TypedInputFallback({ onSubmit, promoted = false, disabled = false }) {
  const { t } = useT()
  const [value, setValue] = useState('')

  const submit = (e) => {
    e.preventDefault()
    const v = value.trim()
    if (!v || disabled) return
    onSubmit(v)
    setValue('')
  }

  return (
    <form onSubmit={submit} className="flex items-center gap-2" aria-label={t('input.formLabel')}>
      <input
        type="text"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        disabled={disabled}
        placeholder={promoted ? t('input.placeholderPromoted') : t('input.placeholder')}
        aria-label={t('input.ariaLabel')}
        className={cx(
          'glass min-w-0 flex-1 rounded-xl px-4 py-2.5 text-base outline-none transition',
          'placeholder:text-stone-400 focus:border-accent/70 focus:ring-2 focus:ring-accent/25',
          'dark:text-stone-100 dark:placeholder:text-stone-500',
        )}
      />
      <button
        type="submit"
        disabled={disabled || !value.trim()}
        className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-accent text-white ring-1 ring-inset ring-white/25 shadow-[0_6px_18px_-6px_rgba(13,148,136,0.75)] transition hover:bg-accent-hover active:scale-95 disabled:opacity-40 disabled:shadow-none focus-visible:ring-4 focus-visible:ring-accent/40"
        aria-label={t('input.send')}
      >
        <PlusIcon className="text-xl" />
      </button>
    </form>
  )
}
