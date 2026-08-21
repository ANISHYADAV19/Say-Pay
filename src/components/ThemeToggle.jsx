import { useList } from '../store/ListContext.jsx'
import { useT } from '../i18n/useT.js'
import { SunIcon, MoonIcon } from './icons.jsx'

/**
 * Light/dark theme toggle (FR-7.6). Flips the persisted theme in the store,
 * which drives the `.dark` class on <html>. Shows the icon of the theme you'd
 * switch TO, with a localized label so it's clear for screen readers (NFR-4).
 */
export default function ThemeToggle() {
  const { theme, toggleTheme } = useList()
  const { t } = useT()
  const isDark = theme === 'dark'
  const label = t(isDark ? 'theme.toLight' : 'theme.toDark')

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={label}
      title={label}
      className="grid h-9 w-9 place-items-center rounded-lg border border-stone-300 bg-white text-[1.05rem] text-stone-600 outline-none transition hover:text-accent focus:border-accent focus:ring-2 focus:ring-accent/30 dark:border-stone-700 dark:bg-stone-900 dark:text-stone-300 dark:hover:text-accent"
    >
      {isDark ? <SunIcon /> : <MoonIcon />}
    </button>
  )
}
