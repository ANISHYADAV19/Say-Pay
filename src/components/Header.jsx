import LanguageSelect from './LanguageSelect.jsx'
import ThemeToggle from './ThemeToggle.jsx'
import { useT } from '../i18n/useT.js'

/**
 * App header (SP-022). Brand + language picker. "Say & Pay" is a branding name
 * only — this is a voice shopping-LIST manager, with no checkout/payment.
 */
export default function Header({ language, onLanguageChange }) {
  const { t } = useT()
  return (
    <header className="flex items-center justify-between gap-3">
      <div className="flex items-center gap-2.5">
        <span className="grid h-9 w-9 place-items-center rounded-xl bg-accent text-lg font-bold text-white">
          S
        </span>
        <div>
          <h1 className="text-lg font-bold leading-none text-stone-900 dark:text-stone-100">
            Say &amp; Pay
          </h1>
          <p className="text-xs text-stone-500 dark:text-stone-400">{t('header.subtitle')}</p>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <ThemeToggle />
        <LanguageSelect value={language} onChange={onLanguageChange} />
      </div>
    </header>
  )
}
