import { useEffect, useRef } from 'react'

/**
 * Live audio-reactive bars for the mic button (FR-7.2 feedback).
 *
 * The Web Speech API doesn't expose the audio it's capturing, so this opens its
 * own getUserMedia stream and runs it through an AnalyserNode. Permission is
 * already granted by the time this mounts (it only renders while the recognizer
 * is listening), so this does not trigger a second prompt.
 *
 * The rAF loop writes transforms straight to the bar nodes rather than going
 * through state — 60fps of setState here would re-render MicButton on every
 * frame for no benefit.
 *
 * Anything that goes wrong (unsupported, device busy, stream revoked) calls
 * `onUnavailable` so MicButton can fall back to the CSS pulse ring. Mic errors
 * are the recognizer's job to report; this stays silent.
 */

const BAR_COUNT = 5

// Bucket edges over analyser bins, widening toward the top end so the bars are
// spaced roughly logarithmically. At fftSize 256 / 48kHz each bin is ~187Hz, so
// this spans ~370Hz–8.2kHz: speech formants, ignoring the DC/rumble bins.
const BUCKETS = [
  [2, 5],
  [5, 9],
  [9, 15],
  [15, 26],
  [26, 44],
]

const MIN_SCALE = 0.14 // bars never fully collapse — a flat line reads as "dead"
const GAIN = 1.5
const EASE = 0.35 // per-frame approach to the target, on top of analyser smoothing

export default function MicWaveform({ onUnavailable }) {
  const barsRef = useRef([])
  const onUnavailableRef = useRef(onUnavailable)
  onUnavailableRef.current = onUnavailable

  useEffect(() => {
    // `disposed` guards the async setup below: the effect can be torn down
    // while getUserMedia is still pending, and we must not leave a live stream
    // (and its mic indicator) running after unmount.
    let disposed = false
    let stream = null
    let ctx = null
    let raf = 0

    const cleanup = () => {
      disposed = true
      if (raf) cancelAnimationFrame(raf)
      stream?.getTracks().forEach((track) => track.stop())
      if (ctx && ctx.state !== 'closed') ctx.close().catch(() => {})
      stream = null
      ctx = null
      raf = 0
    }

    const start = async () => {
      const AudioCtx =
        typeof window !== 'undefined' && (window.AudioContext || window.webkitAudioContext)
      if (!AudioCtx || !navigator?.mediaDevices?.getUserMedia) {
        onUnavailableRef.current?.()
        return
      }

      try {
        stream = await navigator.mediaDevices.getUserMedia({ audio: true })
        if (disposed) {
          stream.getTracks().forEach((track) => track.stop())
          return
        }

        ctx = new AudioCtx()
        if (ctx.state === 'suspended') await ctx.resume()
        if (disposed) return

        const analyser = ctx.createAnalyser()
        analyser.fftSize = 256
        analyser.smoothingTimeConstant = 0.72
        ctx.createMediaStreamSource(stream).connect(analyser)

        const spectrum = new Uint8Array(analyser.frequencyBinCount)
        const current = new Array(BAR_COUNT).fill(MIN_SCALE)

        const tick = () => {
          if (disposed) return
          analyser.getByteFrequencyData(spectrum)

          for (let i = 0; i < BAR_COUNT; i += 1) {
            const [lo, hi] = BUCKETS[i]
            let sum = 0
            for (let bin = lo; bin < hi; bin += 1) sum += spectrum[bin]
            const avg = sum / (hi - lo) / 255

            const target = Math.min(1, MIN_SCALE + avg * GAIN)
            current[i] += (target - current[i]) * EASE

            const node = barsRef.current[i]
            if (node) node.style.transform = `scaleY(${current[i].toFixed(3)})`
          }

          raf = requestAnimationFrame(tick)
        }

        raf = requestAnimationFrame(tick)
      } catch {
        cleanup()
        onUnavailableRef.current?.()
      }
    }

    start()
    return cleanup
  }, [])

  return (
    <span aria-hidden className="flex items-center gap-[3px]">
      {Array.from({ length: BAR_COUNT }, (_, i) => (
        <span
          key={i}
          ref={(node) => {
            barsRef.current[i] = node
          }}
          className="h-[26px] w-[3.5px] origin-center rounded-full bg-white will-change-transform"
          style={{ transform: `scaleY(${MIN_SCALE})` }}
        />
      ))}
    </span>
  )
}
