import { MicIcon } from './icons.jsx'
import { useT } from '../i18n/useT.js'
import Button from './Button.jsx'

/**
 * First-run / empty-list state (FR-3.2). Teaches the voice grammar with a few
 * tappable example commands that run through the same pipeline. Examples are
 * localized (FR-6.4); non-English ones parse via the LLM path, like voice.
 */
export default function EmptyState({ onTry, disabled = false }) {
  const { t } = useT()
  const examples = t('empty.examples')

  return (
    <div className="flex flex-col items-center px-4 py-16 text-center">
      <div className="relative grid h-16 w-16 place-items-center">
        <span
          aria-hidden
          className="absolute inset-0 animate-breathe-slow rounded-full bg-accent/25 blur-lg"
        />
        <span className="glass relative grid h-16 w-16 place-items-center rounded-full text-accent">
          <MicIcon className="text-3xl" />
        </span>
      </div>
      <h2 className="mt-4 text-xl font-semibold text-stone-900 dark:text-stone-100">
        {t('empty.title')}
      </h2>
      <p className="mt-1 max-w-xs text-stone-500 dark:text-stone-400">
        {t('empty.subtitle')}
      </p>
      <ul className="mt-5 flex flex-col items-stretch gap-2">
        {examples.map((ex) => (
          <li key={ex}>
            <Button
              disabled={disabled}
              onClick={() => onTry(ex)}
              className="w-full"
            >
              “{ex}”
            </Button>
          </li>
        ))}
      </ul>
    </div>
  )
}
