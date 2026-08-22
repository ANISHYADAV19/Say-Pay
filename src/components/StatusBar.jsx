import { cx } from '../utils/cx.js'
import { useT } from '../i18n/useT.js'

/**
 * Live transcript + mic status (SP-005, FR-1.2/7.2). Doubles as the assistive
 * announcement surface (NFR-4): a visually-hidden role="status" region reads
 * out every action ("Added 2 bottles of milk", "Didn't catch that…").
 */
export default function StatusBar({ listening, processing, interim, lastTranscript, announcement }) {
  const { t } = useT()
  const stateWord = processing
    ? t('status.thinking')
    : listening
      ? t('status.listening')
      : t('status.ready')
  const dotClass = processing
    ? 'bg-amber-500 animate-pulse shadow-[0_0_0_3px_rgba(245,158,11,0.22)]'
    : listening
      ? 'bg-red-500 animate-pulse shadow-[0_0_0_3px_rgba(239,68,68,0.22)]'
      : 'bg-stone-300 dark:bg-stone-600'

  const shown = interim || lastTranscript
  return (
    <div className="glass rounded-2xl px-4 py-3">
      <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-wide text-stone-500 dark:text-stone-400">
        <span className={cx('h-2.5 w-2.5 rounded-full', dotClass)} aria-hidden />
        {stateWord}
      </div>
      <p
        className={cx(
          'mt-1 min-h-[1.5rem] text-lg leading-snug',
          interim
            ? 'text-stone-500 dark:text-stone-400'
            : 'text-stone-900 dark:text-stone-100',
          !shown && 'text-stone-400 dark:text-stone-600',
        )}
      >
        {shown || t('status.hint')}
      </p>

      {/* Screen-reader-only live region for action announcements */}
      <div role="status" aria-live="polite" className="sr-only">
        {announcement}
      </div>
    </div>
  )
}
