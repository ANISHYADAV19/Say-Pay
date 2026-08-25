import { useList } from '../store/ListContext.jsx'
import { useT } from '../i18n/useT.js'
import { SunIcon, MoonIcon } from './icons.jsx'
import Button from './Button.jsx'

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
    <Button
      variant="secondary"
      size="icon"
      onClick={toggleTheme}
      aria-label={label}
      title={label}
      className="h-9 w-9 text-[1.05rem]"
    >
      {isDark ? <SunIcon /> : <MoonIcon />}
    </Button>
  )
}
