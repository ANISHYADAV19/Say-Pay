import { Component } from 'react'
import { loadState } from '../services/storage.js'
import { t, DEFAULT_LANG } from '../i18n/strings.js'
import Button from './Button.jsx'

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
          <Button
            onClick={() => window.location.reload()}
            variant="secondary"
            className="mt-6 text-accent hover:text-accent-hover dark:text-accent dark:hover:text-accent-hover"
          >
            {t('error.crashReload', lang)}
          </Button>
        </div>
      </div>
    )
  }
}
