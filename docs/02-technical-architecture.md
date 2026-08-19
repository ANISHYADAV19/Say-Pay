# Technical Architecture Document

**Product:** Say & Pay — Voice Command Shopping Assistant
**Status:** Draft v1.0
**Last updated:** 2026-08-19
**Related docs:** `01-product-requirements.md`, `03-security-and-access.md`, `04-frontend-specification.md`

> **Design principle:** favor the simplest architecture that satisfies the PRD within 8 hours. This is a **client-heavy single-page app** with **one thin serverless function** (only to hide the LLM key). No database server, no auth service, no container orchestration — those would be over-engineering for this scope.

---

## 1. Architecture at a glance

```
                          ┌──────────────────────────────────────────────┐
                          │                 BROWSER (SPA)                  │
                          │                                                │
  🎤 speech ──▶ ┌─────────────────┐   transcript   ┌──────────────────┐   │
                │ VoiceCapture     │──────────────▶ │ IntentParser      │   │
                │ (Web Speech API) │                │  1. rule-based    │   │
                └─────────────────┘                │  2. LLM fallback ─┼───┼──┐
                          ▲                          └───────┬──────────┘   │  │ HTTPS
                          │ mic state / interim              │ Command JSON │  │ (JSON)
                          │                                  ▼              │  │
  ┌───────────────┐      │        ┌──────────────────────────────────┐    │  │
  │  React UI      │◀─────┴────────│ CommandHandler                    │    │  │
  │ - MicButton    │  re-render    │  add / remove / update / search   │    │  │
  │ - ListView     │◀──────────────│  clear                            │    │  │
  │ - Suggestions  │               └───────┬───────────────┬──────────┘    │  │
  │ - SearchResults│                       │               │               │  │
  │ - Toasts       │            ┌──────────▼───┐   ┌────────▼─────────┐     │  │
  └───────────────┘            │ Store (state) │   │ SuggestionsEngine │     │  │
                                │ + localStorage│   │ substitute/season │     │  │
                                └──────────────┘   │ /history          │     │  │
                                        │           └──────────────────┘     │  │
                                        │           ┌──────────────────┐     │  │
                                        │           │ CatalogService    │     │  │
                                        │           │ (mock JSON)       │     │  │
                                        │           └──────────────────┘     │  │
                          └──────────────────────────────────────────────┘  │
                                                                              │
                          ┌───────────────────────────────────────────────┐  │
                          │  SERVERLESS FUNCTION  /api/parse   ◀────────────┘  │
                          │  - injects LLM API key (server-side env var)       │
                          │  - calls LLM provider, returns command JSON        │
                          └───────────────────┬───────────────────────────────┘
                                              │ HTTPS
                                              ▼
                                   ┌────────────────────┐
                                   │  LLM Provider       │
                                   │ (Gemini/OpenAI/etc) │
                                   └────────────────────┘
```

**Two runtime tiers only:**
1. **Client SPA** — does 90% of the work (voice, state, UI, suggestions, catalog search, rule-based parsing).
2. **Serverless proxy** — a single stateless function whose only job is to call the LLM with a server-side key.

---

## 2. Component responsibilities

| Component | File (suggested) | Responsibility | Key dependencies |
|---|---|---|---|
| **VoiceCapture** | `src/services/speech.js` | Wrap `SpeechRecognition`; emit interim + final transcript; expose start/stop; report support/permission errors. | Web Speech API |
| **IntentParser** | `src/services/parser.js` | Turn transcript → `Command`. Try rules first; call `/api/parse` (LLM) if low confidence. Normalize output. | `rules.js`, `/api/parse` |
| **Rule engine** | `src/services/rules.js` | Regex/keyword extraction of action, quantity, unit, item. | — |
| **CommandHandler** | `src/services/commands.js` | Execute a `Command` against the store; trigger suggestions/search. | Store, Suggestions, Catalog |
| **Store** | `src/store/list.js` | List state, reducers (add/remove/update/clear), history log; sync to `localStorage`. | localStorage |
| **SuggestionsEngine** | `src/services/suggestions.js` | Compute substitute / seasonal / history suggestions. | `data/*.json`, history |
| **CatalogService** | `src/services/catalog.js` | Load mock catalog; filter by query/brand/size/price. | `data/catalog.json` |
| **UI components** | `src/components/*` | Render list, mic, suggestions, results, toasts, feedback. | Store (via hooks/context) |
| **Serverless proxy** | `api/parse.js` | Server-side LLM call; key from env; returns validated JSON. | LLM SDK/fetch |

---

## 3. Data models

```jsonc
// Command — output of IntentParser (the app's internal contract)
{
  "action": "add | remove | update | search | clear | unknown",
  "item":   "milk",                 // normalized noun, lowercase
  "quantity": 2,                     // number, default 1
  "unit":   "bottles",              // optional
  "category": "dairy",              // assigned by parser or lookup
  "filters": {                       // only for action=search
    "brand": "organic",
    "maxPrice": 5,
    "size": null
  },
  "language": "en-US",
  "confidence": 0.0                  // parser self-rating; low → LLM fallback
}
```

```jsonc
// ListItem — element of the shopping list state
{
  "id": "uuid",
  "name": "milk",
  "quantity": 2,
  "unit": "bottles",
  "category": "dairy",
  "checked": false,
  "addedAt": 1690000000000
}
```

```jsonc
// CatalogProduct — element of mock catalog.json
{
  "id": "p001",
  "name": "organic apples",
  "brand": "FreshFarm",
  "size": "1kg",
  "price": 4.50,
  "category": "produce",
  "tags": ["organic", "fruit"]
}
```

```jsonc
// Persisted state (localStorage key: "sayandpay.v1")
{
  "items": [ /* ListItem[] */ ],
  "history": [ { "name": "bread", "count": 6, "lastAdded": 169... } ],
  "language": "en-US"
}
```

**Static data files** (`src/data/`): `catalog.json`, `substitutes.json` (`{item: [alts]}`), `seasonal.json` (`{month: [items]}`), `categories.json` (`{item|keyword: category}`).

---

## 4. Core data flow (add-by-voice)

1. `MicButton` → `VoiceCapture.start()` → sets store `micState = "listening"`.
2. `onresult` → interim transcript streamed to UI (FR-1.2).
3. On final result → `VoiceCapture` emits transcript → `micState = "processing"`.
4. `IntentParser.parse(transcript)`:
   - `rules.parse()` runs; if `confidence ≥ threshold` → use it.
   - else `POST /api/parse` → LLM returns `Command` JSON → validate against schema.
5. `CommandHandler.handle(command)` → `Store.dispatch(add|remove|…)`.
6. Store mutates → persists to `localStorage` → React re-renders `ListView`.
7. `SuggestionsEngine.recompute()` runs → updates `Suggestions`.
8. UI shows toast + highlight; `micState = "idle"`.

**Degradation paths (NFR-5):** LLM/network down → use rule-based result (or ask to rephrase). localStorage unavailable → in-memory only + warning. Mic unsupported → typed input feeds the *same* step 4 onward.

---

## 5. Interface contracts

### 5.1 Serverless: `POST /api/parse`
**Request**
```json
{ "transcript": "add two bottles of milk", "language": "en-US" }
```
**Response `200`**
```json
{ "command": { "action": "add", "item": "milk", "quantity": 2, "unit": "bottles", "category": "dairy", "confidence": 0.95 } }
```
**Errors:** `400` invalid body · `429` rate-limited (client falls back to rules) · `500` LLM error (client falls back to rules). The function **always** returns valid JSON; the client never trusts it blindly and re-validates.

### 5.2 LLM prompt contract (server-side)
- **System:** "You extract shopping-list intent. Output ONLY minified JSON matching this schema {…}. Never add prose. Default quantity 1. Choose category from this fixed list […]."
- **User:** the transcript.
- **Post-processing:** parse JSON; if parse fails → return `{action:"unknown"}` so the client can ask to rephrase.

---

## 6. Technology choices & rationale

| Decision | Choice | Why | Alternatives considered |
|---|---|---|---|
| UI framework | **React + Vite** | Fast scaffold, component model fits list UI, huge ecosystem | Vanilla JS (slower to build), Vue |
| Styling | **Tailwind CSS** | Rapid, consistent, mobile-first utility classes | CSS modules, MUI (heavier) |
| Speech-to-text | **Web Speech API** | Free, no key, in-browser, multilingual via `lang` | Google/AWS STT (cost, setup, latency) |
| NLP | **Rules + LLM fallback** | Rules = fast/offline; LLM = flexibility + multilingual + categorization in one call | Pure rules (brittle), pure LLM (latency, cost, offline-fragile) |
| State | **React hooks/Context + reducer** | No extra lib needed at this scale | Redux/Zustand (overkill) |
| Persistence | **localStorage** | Zero backend, instant, fits single-device MVP | Firebase Firestore (stretch, for cross-device history) |
| LLM key safety | **Serverless proxy** | Keeps secret server-side; satisfies NFR-3 | Client-side key (insecure), full backend (overkill) |
| Hosting | **Vercel** (or Netlify) | One repo deploys SPA + `/api` function; free HTTPS; CD from GitHub | Firebase Hosting+Functions, Render |

---

## 7. Deployment & environments

- **Repo layout (monorepo-in-one):** `src/` (SPA) + `api/` (serverless) + `public/`.
- **Build:** `vite build` → static assets; `api/parse.js` deployed as a function by Vercel automatically.
- **Environments:** `local` (`vite dev`, `.env.local`), `production` (Vercel, env vars in dashboard).
- **CI/CD:** push to `main` → Vercel builds + deploys → public HTTPS URL (FR-8.1, FR-8.3).
- **Config:** `LLM_API_KEY`, `LLM_MODEL`, `LLM_PROVIDER` as **server-side** env vars (never `VITE_`-prefixed, or they'd leak to the client bundle).

---

## 8. Cross-cutting concerns

- **Error handling (NFR-1):** every service returns typed results `{ok, data|error}`; UI maps errors to friendly states; no unhandled promise rejections.
- **Loading (FR-7.3):** `micState` (`idle|listening|processing`) + per-request spinners drive UI.
- **Observability:** lightweight `console`-based logging behind a `DEBUG` flag; optional Vercel analytics. Full telemetry is out of scope.
- **Testing (proportionate):** unit-test the pure functions that matter most — `rules.parse()`, catalog filtering, category lookup, quantity merge. Manual test script for the voice path (documented in README).
- **Accessibility (NFR-4):** ARIA live region announces recognized actions; all controls keyboard-reachable.

---

## 9. Scalability & future-proofing (noted, not built)
- Swap `localStorage` → Firestore for cross-device sync + real history.
- Add auth (Firebase Auth) for multi-user lists.
- Replace mock catalog with a real grocery API.
- Move rules+LLM into a versioned backend service if traffic grows.
- Add streaming STT / wake-word for true hands-free ("voice-only") mode.

These are intentionally deferred to keep the assessment build within 8 hours.

---

## 10. Key architectural risks & mitigations
| Risk | Impact | Mitigation |
|---|---|---|
| Web Speech API browser gaps | Core loop unusable on some browsers | Typed-input fallback path reuses the same parser (FR-1.4) |
| LLM latency/quota | Slow or failed parse | Rule-first, LLM only on low confidence; timeout → rules |
| Key leakage | Security failure | Serverless proxy; no `VITE_` secret; see `03-security-and-access.md` |
| State corruption in localStorage | App won't load | Schema version key + try/catch parse + reset-to-empty fallback |
