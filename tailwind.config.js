/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  darkMode: 'class', // manual light/dark toggle via a .dark class on <html> (defaults to prefers-color-scheme on first load)
  theme: {
    extend: {
      colors: {
        accent: {
          DEFAULT: '#0D9488', // teal
          hover: '#0F766E',
          fg: '#ffffff',
        },
      },
      keyframes: {
        'pulse-ring': {
          '0%': { transform: 'scale(1)', opacity: '0.55' },
          '100%': { transform: 'scale(1.9)', opacity: '0' },
        },
        // Row-changed highlight. A glow ring rather than a background tint:
        // the rows are translucent glass now, so animating their fill to
        // `transparent` made them flicker back to opaque at the end.
        //
        // --glass-shadow is carried through both frames so the row keeps its
        // depth while flashing, and the 100% frame is visually identical to the
        // glass base — the effect looks right even if the animation is
        // interrupted or the class lingers. Falls back to no shadow on
        // non-glass rows, where the variable is undefined.
        flash: {
          '0%': {
            boxShadow:
              '0 0 0 2px rgba(13,148,136,0.9), 0 0 20px 2px rgba(13,148,136,0.5), var(--glass-shadow, 0 0 #0000)',
          },
          '100%': {
            boxShadow:
              '0 0 0 2px rgba(13,148,136,0), 0 0 20px 2px rgba(13,148,136,0), var(--glass-shadow, 0 0 #0000)',
          },
        },
        'toast-in': {
          '0%': { transform: 'translateY(8px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        // Aurora blobs. Each returns to its 0% position at 100% so the global
        // reduced-motion rule (which pins animations to their end frame) leaves
        // them where they started instead of mid-drift.
        'drift-a': {
          '0%, 100%': { transform: 'translate3d(0, 0, 0) scale(1)' },
          '33%': { transform: 'translate3d(3rem, 2rem, 0) scale(1.12)' },
          '66%': { transform: 'translate3d(-1.5rem, 3.5rem, 0) scale(0.94)' },
        },
        'drift-b': {
          '0%, 100%': { transform: 'translate3d(0, 0, 0) scale(1)' },
          '40%': { transform: 'translate3d(-3.5rem, -2.5rem, 0) scale(1.08)' },
          '70%': { transform: 'translate3d(-1rem, 2.5rem, 0) scale(0.92)' },
        },
        'drift-c': {
          '0%, 100%': { transform: 'translate3d(-50%, 0, 0) scale(1)' },
          '50%': { transform: 'translate3d(calc(-50% + 2.5rem), -3rem, 0) scale(1.15)' },
        },
        // Mic halo: slow expand/contract so the idle button still feels alive.
        breathe: {
          '0%, 100%': { transform: 'scale(1)', opacity: '0.4' },
          '50%': { transform: 'scale(1.14)', opacity: '0.75' },
        },
      },
      animation: {
        'pulse-ring': 'pulse-ring 1.4s cubic-bezier(0.4,0,0.6,1) infinite',
        flash: 'flash 1.2s ease-out',
        'toast-in': 'toast-in 0.18s ease-out',
        'drift-a': 'drift-a 26s ease-in-out infinite',
        'drift-b': 'drift-b 32s ease-in-out infinite',
        'drift-c': 'drift-c 38s ease-in-out infinite',
        breathe: 'breathe 3.6s ease-in-out infinite',
        'breathe-slow': 'breathe 5.2s ease-in-out infinite',
      },
    },
  },
  plugins: [],
}
