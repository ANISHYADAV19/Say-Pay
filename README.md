# Say & Pay — Voice Command Shopping Assistant

Manage a shopping list entirely by voice. Say **“add two bottles of milk,”** **“remove bread,”** or **“find organic apples under $5”** and the app understands the intent, updates a categorized list, and suggests smart additions.

> **On the name:** *Say & Pay* is branding only. This is a voice-driven shopping **list** manager — there is **no checkout or payment** feature (and none is implied by the assessment brief).

**Live demo:** _[add your Vercel URL here after deploying]_

---

## Highlights

- 🎙️ **Hands-free voice input** via the Web Speech API — with a live transcript and a typed-input fallback that uses the exact same pipeline.
- 🧠 **Hybrid intent parsing:** a fast, offline **rule-based parser** handles the common phrasings deterministically; a **serverless LLM proxy** (Google Gemini) handles the long tail of free-form and multilingual phrasing. The app keeps working with the network off.
- 🗂️ **Auto-categorization** into produce / dairy / bakery / pantry / etc., grouped in the list.
- 🔎 **Voice search** over a mock catalog with price / brand / size filters (“find apples under $5”, “show me organic milk”).
- 💡 **Smart suggestions:** substitutes for items on the list, in-season produce, and reorder hints from your history.
- ♿ **Accessible & mobile-first:** keyboard-operable, screen-reader announcements, dark mode, reduced-motion support.
- 🔒 **Secure by design:** the LLM API key lives **only** on the server; the transcript is treated as untrusted input; the LLM’s output is re-validated on the client.

---

## How it works

```
                    ┌─────────────┐
   voice / typing → │ transcript  │
                    └──────┬──────┘
                           ▼
                  ┌──────────────────┐   confidence ≥ 0.65
                  │  rule parser     │ ─────────────────────►  execute
                  │  (offline, fast) │
                  └────────┬─────────┘
                           │ low confidence / free-form / other language
                           ▼
                  ┌──────────────────┐   POST /api/parse (key server-side)
                  │  LLM proxy       │ ─────────────►  Google Gemini
                  │  (serverless)    │
                  └────────┬─────────┘
                           ▼
                  normalizeCommand()  ← single choke point: coerces ANY raw
                           │             object (rules OR LLM) into a safe Command
                           ▼
                  { action, item, quantity, unit, category, filters, ... }
                           ▼
                     store (useReducer + localStorage)
```

Every parser output — rules or LLM — is funneled through one `normalizeCommand()` validator ([src/services/command.js](src/services/command.js)) before it can touch the store. That’s both a correctness guarantee and a security boundary: the LLM is never trusted blindly.

The `Command` contract:

```js
{ action, item, quantity, unit, category, filters, language, confidence }
// action ∈ add | remove | update | search | clear | unknown
```

---

## Voice / text commands

| Intent | Examples |
| --- | --- |
| **Add** | “add milk”, “I need two bottles of olive oil”, “buy a dozen eggs”, “bananas” |
| **Remove** | “remove bread”, “take milk off my list”, “get rid of apples” |
| **Update quantity** | “change milk to 3”, “make it 5” |
| **Search** | “find apples under $5”, “show me organic milk”, “look for pasta” |
| **Clear** | “clear my list”, “start over” |

Bare nouns default to *add* (“eggs” → adds eggs), matching how people actually talk to a shopping assistant.

---

## Tech stack

- **React 18 + Vite 5** — SPA, mobile-first
- **Tailwind CSS v3** — styling, dark mode via `prefers-color-scheme`
- **Web Speech API** — `SpeechRecognition` for voice capture (no audio ever leaves the browser through our code)
- **Vercel Serverless Function** (`api/parse.js`) — proxies to **Google Gemini**, keeping the key off the client
- **localStorage** — persistence (no backend/database needed at this scale)
- **Vitest** — unit tests for the pure parsing/catalog/categorization logic

Design rationale for each choice lives in [`docs/`](docs/).

---

## Local development

```bash
npm install
npm run dev
```

Open the printed `http://localhost:5173`. The app works immediately using the **rule-based parser** — no API key required. To enable the LLM fallback locally, add a key (see below); without one, low-confidence phrases simply fall back to the rules result.

### Other scripts

```bash
npm run build      # production build to dist/
npm run preview    # preview the production build
npm run test       # run the unit test suite once
npm run test:watch # watch mode
```

---

## Environment variables

The LLM key is **never** exposed to the browser. It is read only inside the serverless function.

Copy `.env.example` → `.env` and fill in:

```bash
LLM_PROVIDER=gemini
LLM_MODEL=gemini-2.0-flash
LLM_API_KEY=your-google-ai-studio-key   # server-side only — NEVER prefix with VITE_
```

> ⚠️ **Security:** never prefix the key with `VITE_` (that would bundle it into client JS), and never commit `.env`. `.env*` is gitignored; only `.env.example` is tracked. Get a key from [Google AI Studio](https://aistudio.google.com/apikey).

---

## Deployment (Vercel)

1. Push this repo to GitHub.
2. In Vercel: **New Project → import the repo.** The `vite` framework preset is auto-detected, and `api/parse.js` is deployed as a Node serverless function automatically.
3. Add the environment variables above under **Settings → Environment Variables** (`LLM_API_KEY`, `LLM_MODEL`, `LLM_PROVIDER`).
4. Deploy. [`vercel.json`](vercel.json) applies a strict Content-Security-Policy and other hardening headers, and scopes microphone access to the app’s own origin.

---

## Security notes

- **Key isolation** — the Gemini key exists only in the serverless runtime; the client bundle never sees it.
- **Untrusted transcript** — the system prompt instructs the model to treat the transcript as *data, not instructions* (prompt-injection defense), and to return JSON only. Transcript length is capped and the endpoint is rate-limited per IP.
- **Defense in depth** — the client re-validates the LLM’s JSON against the `Command` schema (`normalizeCommand`) before acting on it.
- **No `dangerouslySetInnerHTML`** with dynamic content; the mic activates only on an explicit user tap; HTTPS only.

---

## Project structure

```
api/parse.js            Serverless LLM proxy (Gemini)
src/
  services/             Pure logic (framework-free, unit-tested)
    command.js          The Command contract + normalizeCommand() validator
    rules.js            Offline rule-based intent parser (+ confidence)
    parser.js           Orchestrates rules → LLM fallback
    categorize.js       Item → category
    catalog.js          Mock-catalog search
    suggestions.js      Substitute / seasonal / reorder engine
    commands.js         Command → store action + user-facing copy
    storage.js          localStorage persistence
  store/ListContext.jsx State (useReducer + Context) + persistence
  hooks/                useSpeech · useCommandRunner · useToasts
  components/           UI (MicButton, ShoppingList, SearchResults, …)
  data/                 Static JSON (catalog, categories, seasonal, substitutes)
docs/                   Requirements, architecture, and decision docs
```

---

## Testing

```bash
npm run test
```

Unit tests cover the parts where correctness matters most and that are cheap to test in isolation: the rule parser (including all 14 sample phrasings), categorization, and catalog search — 28 tests total.

---

## Known limitations & trade-offs

- **Web Speech API support** is best in Chromium-based browsers; where it’s unavailable, the app automatically promotes the **typed input** (same pipeline), so nothing is lost.
- **Multi-item phrases** (“add milk and eggs”) are handled by the LLM path rather than the rule parser, which parses one item at a time.
- **Suggestions & catalog** run off bundled static JSON — appropriate for the assessment scope; a real deployment would source these from an API.
- Speech recognition accuracy depends on the browser/OS; the rule parser is intentionally forgiving of filler words to compensate.

---

## Scope note

Built as an ~8-hour technical assessment. Priorities: a working end-to-end voice loop, clean and tested logic, honest documentation of the design decisions and their trade-offs.
