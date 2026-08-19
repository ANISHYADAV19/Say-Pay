import { GlobeIcon } from './icons.jsx'

/**
 * Recognition language picker (SP-022, FR-6.1). Sets the BCP-47 tag passed to
 * the Web Speech API; the LLM fallback handles non-English transcripts.
 */
export const LANGUAGES = [
  { code: 'en-US', label: 'English' },
  { code: 'es-ES', label: 'Español' },
  { code: 'fr-FR', label: 'Français' },
  { code: 'de-DE', label: 'Deutsch' },
  { code: 'hi-IN', label: 'हिन्दी' },
  { code: 'zh-CN', label: '中文' },
]

export default function LanguageSelect({ value, onChange }) {
  return (
    <label className="relative flex items-center">
      <GlobeIcon className="pointer-events-none absolute left-2.5 text-stone-500 dark:text-stone-400" />
      <span className="sr-only">Recognition language</span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="appearance-none rounded-lg border border-stone-300 bg-white py-1.5 pl-8 pr-7 text-sm font-medium text-stone-700 outline-none transition focus:border-accent focus:ring-2 focus:ring-accent/30 dark:border-stone-700 dark:bg-stone-900 dark:text-stone-200"
      >
        {LANGUAGES.map((l) => (
          <option key={l.code} value={l.code}>
            {l.label}
          </option>
        ))}
      </select>
      <svg
        className="pointer-events-none absolute right-2 text-stone-400"
        width="12"
        height="12"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.5"
        aria-hidden
      >
        <path d="m6 9 6 6 6-6" />
      </svg>
    </label>
  )
}
