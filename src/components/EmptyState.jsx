import { MicIcon } from './icons.jsx'

/**
 * First-run / empty-list state (FR-3.2). Teaches the voice grammar with a few
 * tappable example commands that run through the same pipeline.
 */
const EXAMPLES = ['add 2 bottles of milk', 'add bread and eggs', 'find apples under $5']

export default function EmptyState({ onTry, disabled = false }) {
  return (
    <div className="flex flex-col items-center px-4 py-16 text-center">
      <div className="grid h-16 w-16 place-items-center rounded-full bg-accent/10 text-accent">
        <MicIcon className="text-3xl" />
      </div>
      <h2 className="mt-4 text-xl font-semibold text-stone-900 dark:text-stone-100">
        Your list is empty
      </h2>
      <p className="mt-1 max-w-xs text-stone-500 dark:text-stone-400">
        Tap the mic and speak naturally — or type. Try one of these:
      </p>
      <ul className="mt-5 flex flex-col items-stretch gap-2">
        {EXAMPLES.map((ex) => (
          <li key={ex}>
            <button
              type="button"
              disabled={disabled}
              onClick={() => onTry(ex)}
              className="w-full rounded-xl border border-stone-200 bg-white px-4 py-2.5 text-stone-700 transition hover:border-accent hover:text-accent disabled:opacity-50 dark:border-stone-800 dark:bg-stone-900 dark:text-stone-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/40"
            >
              “{ex}”
            </button>
          </li>
        ))}
      </ul>
    </div>
  )
}
