import { cx } from '../utils/cx.js'
import { MicIcon, StopIcon, SpinnerIcon } from './icons.jsx'

/**
 * Primary control (SP-004, FR-1.1/7.2). Fixed bottom-center FAB with
 * idle / listening / processing / unavailable states. Keyboard-operable
 * (native button — Space/Enter), and exposes state via aria-pressed + label.
 */
const LABELS = {
  idle: 'Tap to speak',
  listening: 'Listening… tap to stop',
  processing: 'Thinking…',
  unavailable: 'Voice unavailable',
}

export default function MicButton({ state = 'idle', onToggle }) {
  const listening = state === 'listening'
  const processing = state === 'processing'
  const unavailable = state === 'unavailable'
  const disabled = unavailable || processing

  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-0 z-30 flex flex-col items-center gap-2 bg-gradient-to-t from-stone-50 via-stone-50/90 to-transparent pb-[max(1rem,env(safe-area-inset-bottom))] pt-8 dark:from-[#0B0F14] dark:via-[#0B0F14]/90">
      <button
        type="button"
        onClick={onToggle}
        disabled={disabled}
        aria-pressed={listening}
        aria-label={LABELS[state]}
        className={cx(
          'pointer-events-auto relative grid h-[72px] w-[72px] place-items-center rounded-full text-white shadow-lg outline-none transition',
          'focus-visible:ring-4 focus-visible:ring-accent/40',
          unavailable
            ? 'cursor-not-allowed bg-stone-400 dark:bg-stone-600'
            : 'bg-accent hover:bg-accent-hover active:scale-95',
          listening && 'ring-4 ring-accent/30',
        )}
      >
        {listening && (
          <span className="absolute inset-0 animate-pulse-ring rounded-full bg-accent/60" />
        )}
        <span className="relative text-2xl">
          {processing ? <SpinnerIcon /> : listening ? <StopIcon /> : <MicIcon />}
        </span>
        {listening && (
          <span className="absolute right-3 top-3 h-2.5 w-2.5 rounded-full bg-red-500 ring-2 ring-white" />
        )}
      </button>
      <span className="pointer-events-none text-xs font-medium text-stone-500 dark:text-stone-400">
        {LABELS[state]}
      </span>
    </div>
  )
}
