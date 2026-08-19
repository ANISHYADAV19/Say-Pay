/** Tiny className joiner (skips falsy values). */
export const cx = (...parts) => parts.filter(Boolean).join(' ')
