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
          'min-w-0 flex-1 rounded-xl border bg-white px-4 py-2.5 text-base outline-none transition',
          'border-stone-300 focus:border-accent focus:ring-2 focus:ring-accent/30',
          'dark:border-stone-700 dark:bg-stone-900 dark:text-stone-100',
        )}
      />
      <button
        type="submit"
        disabled={disabled || !value.trim()}
        className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-accent text-white transition hover:bg-accent-hover disabled:opacity-40 focus-visible:ring-4 focus-visible:ring-accent/40"
        aria-label={t('input.send')}
      >
        <PlusIcon className="text-xl" />
      </button>
    </form>
  )
}
