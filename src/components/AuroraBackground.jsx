/**
 * Ambient aurora backdrop. Three large, heavily-blurred colour fields drift on
 * long offset cycles so the background is never quite static, with a single
 * full-screen blur/tint layer stacked on top of them.
 *
 * That top layer is deliberate: it means the frosted surfaces above (.glass)
 * can be plain translucent fills instead of each running its own
 * `backdrop-filter`. One blurred layer for the whole app instead of one per
 * list row keeps long lists smooth on mobile.
 *
 * Purely decorative — aria-hidden, and the drift keyframes loop back to their
 * start position so the global prefers-reduced-motion rule (index.css) freezes
 * them somewhere sensible rather than mid-transit.
 */
export default function AuroraBackground() {
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      {/* teal — anchors the brand colour behind the header */}
      <div className="absolute -left-24 -top-32 h-[26rem] w-[26rem] animate-drift-a rounded-full bg-teal-400/35 blur-[80px] dark:bg-teal-500/25" />

      {/* violet — cool counterweight on the opposite edge */}
      <div className="absolute -right-28 top-[22%] h-[24rem] w-[24rem] animate-drift-b rounded-full bg-violet-400/30 blur-[80px] dark:bg-violet-600/25" />

      {/* warm low note, sitting behind the mic so the FAB reads against it */}
      <div className="absolute -bottom-28 left-1/2 h-[22rem] w-[22rem] -translate-x-1/2 animate-drift-c rounded-full bg-amber-300/30 blur-[80px] dark:bg-fuchsia-700/20" />

      {/* Shared blur + tint. Frosts everything below once, for everything above. */}
      <div className="absolute inset-0 bg-stone-50/55 backdrop-blur-[60px] dark:bg-[#0B0F14]/60" />
    </div>
  )
}
