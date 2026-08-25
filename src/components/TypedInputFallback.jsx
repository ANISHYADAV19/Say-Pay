import { useState } from 'react'
import { cx } from '../utils/cx.js'
import { SendIcon } from './icons.jsx'
import { useT } from '../i18n/useT.js'
import Button from './Button.jsx'

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
      <Button
        type="submit"
        variant="primary"
        size="icon-lg"
        disabled={disabled || !value.trim()}
        aria-label={t('input.send')}
      >
        <SendIcon className="text-xl" />
      </Button>
    </form>
  )
}
