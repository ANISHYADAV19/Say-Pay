import { Component } from 'react'
import { loadState } from '../services/storage.js'
import { t, DEFAULT_LANG } from '../i18n/strings.js'

/**
 * Last-resort boundary around the whole app (NFR-5). Async failures are handled
 * where they happen — the LLM proxy falls back to the rule parser, storage is
 * guarded, the command pipeline catches — but a *render-time* throw has no such
 * net and would blank the page. This turns that into a readable recovery screen.
 *
 * It mounts OUTSIDE <ListProvider>, so it can't use useT(): the store may be the
 * very thing that failed. It reads the persisted language directly from storage
 * instead, which is safe because loadState() never throws and returns null on
 * anything unexpected — so the message still lands in the user's language.
 */
export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { crashed: false }
  }

  static getDerivedStateFromError() {
    return { crashed: true }
  }

  componentDidCatch(error, info) {
    // No telemetry backend at this scale; the console is the audit trail.
    console.error('[ErrorBoundary]', error, info?.componentStack)
  }

  render() {
    if (!this.state.crashed) return this.props.children

    const lang = loadState()?.language || DEFAULT_LANG

    return (
      <div className="grid min-h-dvh place-items-center bg-stone-50 px-6 dark:bg-[#0B0F14]">
        <div role="alert" className="glass max-w-sm rounded-2xl px-6 py-8 text-center">
          <h1 className="text-xl font-semibold text-stone-900 dark:text-stone-100">
            {t('error.crashTitle', lang)}
          </h1>
          <p className="mt-2 text-stone-600 dark:text-stone-400">{t('error.crashBody', lang)}</p>
          <button
            type="button"
            onClick={() => window.location.reload()}
            className="glass glass-interactive mt-6 rounded-xl px-5 py-2.5 font-medium text-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/40"
          >
            {t('error.crashReload', lang)}
          </button>
        </div>
      </div>
    )
  }
}
