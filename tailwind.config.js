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
        flash: {
          '0%': { backgroundColor: 'rgba(13,148,136,0.20)' },
          '100%': { backgroundColor: 'transparent' },
        },
        'toast-in': {
          '0%': { transform: 'translateY(8px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
      },
      animation: {
        'pulse-ring': 'pulse-ring 1.4s cubic-bezier(0.4,0,0.6,1) infinite',
        flash: 'flash 1.2s ease-out',
        'toast-in': 'toast-in 0.18s ease-out',
      },
    },
  },
  plugins: [],
}
