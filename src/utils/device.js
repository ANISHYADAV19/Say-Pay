/**
 * Platform probes for the voice pipeline (SP-003).
 *
 * Mobile browsers treat the microphone as single-consumer: Android Chrome and
 * iOS Safari hand it to the speech recognizer, and a second `getUserMedia`
 * stream — or an `AudioContext`, which on iOS renegotiates the whole audio
 * session — starves that recognizer. It starts, hears silence, and ends with no
 * transcript. So anything that wants its own mic stream has to know whether
 * it's running on a phone.
 *
 * Media queries only, no UA sniffing. `(pointer: coarse)` describes the
 * PRIMARY pointer, so a touchscreen laptop still reports `fine` and keeps the
 * richer desktop treatment.
 */

/** True on phones/tablets — touch is the primary way of pointing. */
export function isCoarsePointer() {
  return (
    typeof window !== 'undefined' &&
    typeof window.matchMedia === 'function' &&
    window.matchMedia('(pointer: coarse)').matches
  )
}
