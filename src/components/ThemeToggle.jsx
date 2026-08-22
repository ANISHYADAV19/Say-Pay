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
      className="glass glass-interactive grid h-9 w-9 place-items-center rounded-lg text-[1.05rem] text-stone-600 outline-none hover:text-accent focus:ring-2 focus:ring-accent/30 dark:text-stone-300 dark:hover:text-accent"
    >
      {isDark ? <SunIcon /> : <MoonIcon />}
    </button>
  )
}
