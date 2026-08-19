import { cx } from '../utils/cx.js'

/**
 * Live transcript + mic status (SP-005, FR-1.2/7.2). Doubles as the assistive
 * announcement surface (NFR-4): a visually-hidden role="status" region reads
 * out every action ("Added 2 bottles of milk", "Didn't catch that…").
 */
export default function StatusBar({ listening, processing, interim, lastTranscript, announcement }) {
  const stateWord = processing ? 'Thinking…' : listening ? 'Listening…' : 'Ready'
  const dotClass = processing
    ? 'bg-amber-500 animate-pulse'
    : listening
      ? 'bg-red-500 animate-pulse'
      : 'bg-stone-300 dark:bg-stone-600'

  const shown = interim || lastTranscript
  return (
    <div className="rounded-2xl border border-stone-200 bg-white/70 px-4 py-3 backdrop-blur dark:border-stone-800 dark:bg-stone-900/60">
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
        {shown || 'Say “add milk” or “find apples under $5”'}
      </p>

      {/* Screen-reader-only live region for action announcements */}
      <div role="status" aria-live="polite" className="sr-only">
        {announcement}
      </div>
    </div>
  )
}
