import { useEffect, useState } from 'react'
import { cx } from '../utils/cx.js'
import { isCoarsePointer } from '../utils/device.js'
import { MicIcon, StopIcon, SpinnerIcon } from './icons.jsx'
import MicWaveform from './MicWaveform.jsx'
import { useT } from '../i18n/useT.js'

/**
 * Primary control (SP-004, FR-1.1/7.2). Fixed bottom-center FAB with
 * idle / listening / processing / unavailable states. Keyboard-operable
 * (native button — Space/Enter), and exposes state via aria-pressed + label.
 *
 * Visually it's the one solid surface in the app: everything else is frosted
 * glass, so keeping the mic opaque with a layered halo behind it is what makes
 * it read as the primary action. On desktop it shows live audio bars driven by
 * the real mic signal; touch devices and reduced-motion users get the CSS pulse
 * ring instead.
 */
const LABEL_KEYS = {
  idle: 'mic.idle',
  listening: 'mic.listening',
  processing: 'mic.processing',
  unavailable: 'mic.unavailable',
}

function prefersReducedMotion() {
  return (
    typeof window !== 'undefined' &&
    typeof window.matchMedia === 'function' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches
  )
}

/**
 * Whether to attempt the live waveform at all.
 *
 * On phones the mic is single-consumer: the waveform's own getUserMedia stream
 * competes with the recognizer and leaves it hearing silence, so the whole
 * voice loop dies just to animate five bars — never worth it (see
 * utils/device.js). Reduced-motion users are excluded too, because the bars are
 * JS transforms and the global CSS animation override in index.css can't quiet
 * them (NFR-4).
 */
function liveWaveformAllowed() {
  return !isCoarsePointer() && !prefersReducedMotion()
}

export default function MicButton({ state = 'idle', onToggle }) {
  const { t } = useT()
  const label = t(LABEL_KEYS[state])
  const listening = state === 'listening'
  const processing = state === 'processing'
  const unavailable = state === 'unavailable'
  const disabled = unavailable || processing

  const [audioBlocked, setAudioBlocked] = useState(() => !liveWaveformAllowed())

  // A failure is per-attempt (device busy, stream revoked mid-session), not
  // permanent — reset when listening stops so the next tap tries again.
  useEffect(() => {
    if (!listening && liveWaveformAllowed()) setAudioBlocked(false)
  }, [listening])

  const showWaveform = listening && !audioBlocked

  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-0 z-30 flex flex-col items-center gap-2.5 pb-[max(1rem,env(safe-area-inset-bottom))] pt-10">
      {/* Soft fade so list content doesn't collide with the FAB. Translucent
          rather than opaque, so the aurora still reads through it. */}
      <div
        aria-hidden
        className="absolute inset-0 -z-10 bg-gradient-to-t from-stone-50/85 via-stone-50/40 to-transparent dark:from-[#0B0F14]/90 dark:via-[#0B0F14]/45"
      />

      <div className="relative grid place-items-center">
        {/* Layered halo. Two rings on offset cycles so the pulse never looks
            mechanical; tightens and brightens once we're actually listening. */}
        {!unavailable && (
          <>
            <span
              aria-hidden
              className={cx(
                'absolute h-[104px] w-[104px] animate-breathe-slow rounded-full bg-accent/25 blur-xl',
                listening && 'bg-accent/45',
              )}
            />
            <span
              aria-hidden
              className={cx(
                'absolute h-[86px] w-[86px] animate-breathe rounded-full bg-accent/30 blur-md',
                listening && 'bg-accent/55',
              )}
            />
          </>
        )}

        {/* Expanding ring on top of the halo — the "actively recording" tell,
            and the fallback when the live audio stream is unavailable. */}
        {listening && !showWaveform && (
          <span
            aria-hidden
            className="absolute h-[72px] w-[72px] animate-pulse-ring rounded-full bg-accent/60"
          />
        )}

        <button
          type="button"
          onClick={onToggle}
          disabled={disabled}
          aria-pressed={listening}
          aria-label={label}
          className={cx(
            'pointer-events-auto relative grid h-[72px] w-[72px] place-items-center overflow-hidden rounded-full text-white outline-none transition',
            'focus-visible:ring-4 focus-visible:ring-accent/50',
            unavailable
              ? 'cursor-not-allowed bg-stone-400 shadow-md dark:bg-stone-600'
              : cx(
                  'bg-accent hover:bg-accent-hover active:scale-95',
                  'shadow-[0_10px_30px_-8px_rgba(13,148,136,0.7),0_2px_6px_-1px_rgba(15,23,42,0.25)]',
                  'ring-1 ring-inset ring-white/25',
                ),
            listening && 'ring-2 ring-white/40',
          )}
        >
          {/* Top-down lighting highlight — turns the flat disc into a sphere. */}
          {!unavailable && (
            <span
              aria-hidden
              className="pointer-events-none absolute inset-0 rounded-full bg-gradient-to-b from-white/30 via-white/5 to-transparent"
            />
          )}

          <span className="relative grid place-items-center text-2xl">
            {processing ? (
              <SpinnerIcon />
            ) : showWaveform ? (
              <MicWaveform onUnavailable={() => setAudioBlocked(true)} />
            ) : listening ? (
              <StopIcon />
            ) : (
              <MicIcon />
            )}
          </span>
        </button>

        {listening && (
          <span
            aria-hidden
            className="pointer-events-none absolute right-1 top-1 h-2.5 w-2.5 rounded-full bg-red-500 ring-2 ring-white dark:ring-[#0B0F14]"
          />
        )}
      </div>

      <span className="pointer-events-none text-xs font-medium text-stone-500 dark:text-stone-400">
        {label}
      </span>
    </div>
  )
}
