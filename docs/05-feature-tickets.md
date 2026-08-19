# Feature Ticket List

**Product:** Say & Pay — Voice Command Shopping Assistant
**Status:** Draft v1.0
**Last updated:** 2026-08-19
**Related docs:** `01-product-requirements.md` (FR IDs), `02-technical-architecture.md`, `04-frontend-specification.md`

> **How to use this:** tickets are grouped by Epic (E1–E8) and ordered for delivery. Each maps to PRD requirement IDs. **Estimates assume the 8-hour budget** and are intentionally aggressive — cut P2 tickets first if you fall behind. Ticket IDs (`SP-###`) are stable; use them in commit messages (`SP-004: add rule-based parser`) and as your GitHub issue/board cards.
>
> **Legend:** Priority **P0** must ship · **P1** should ship · **P2** stretch. Est. in hours. **DoD** = Definition of Done.

---

## Suggested board columns
`Backlog → In Progress → In Review → Done`. Track the P0 tickets as your critical path; a working P0-only build is a passing submission.

---

## Phase plan (maps tickets to the 8-hour timeline)

| Phase | Time | Tickets | Outcome |
|---|---|---|---|
| **0 — Setup** | 0.5h | SP-001, SP-002 | Deployed empty app + pipeline |
| **1 — Core loop** | 2.0h | SP-003→SP-008 | Voice → list → feedback works |
| **2 — Smart parse** | 1.5h | SP-009→SP-012 | LLM parse, quantity, categories |
| **3 — Suggestions** | 1.5h | SP-013→SP-016 | Substitute/seasonal/history |
| **4 — Search + polish** | 1.5h | SP-017→SP-022 | Search, errors, mobile, a11y |
| **5 — Ship** | 1.0h | SP-023→SP-026 | Docs, demo, final deploy |

---

## EPIC E1 — Voice Capture & Transcription

### SP-003 · Speech service wrapper `[P0] ~0.5h`
**FRs:** FR-1.1, FR-1.3 · **Depends:** SP-001
Wrap the Web Speech API in `services/speech.js`: `start()`, `stop()`, callbacks for interim/final transcript, error, and support-detection.
**DoD:** speaking into the mic logs a final transcript; unsupported browser reported via a flag; no uncaught errors.

### SP-004 · Mic button + states `[P0] ~0.5h`
**FRs:** FR-1.1, FR-7.2 · **Depends:** SP-003
Build `<MicButton>` with idle/listening/processing/error states per `04-frontend-specification.md §4.1`.
**DoD:** tapping toggles listening; visual state matches actual recognition state; keyboard operable.

### SP-005 · Live transcript / status bar `[P0] ~0.25h`
**FRs:** FR-1.2, FR-7.2 · **Depends:** SP-003
`<StatusBar>` shows interim + final transcript and mic state; is the `aria-live` region.
**DoD:** words appear as the user speaks; final text persists briefly; screen reader announces it.

### SP-006 · Mic-permission & unsupported fallback `[P0] ~0.5h`
**FRs:** FR-1.4, NFR-1 · **Depends:** SP-004
Handle denied permission and unsupported browsers; render `<TypedInputFallback>` that feeds the same parser.
**DoD:** in Firefox/Safari or with mic blocked, the user can still add/remove items by typing; clear explanatory copy shown.

---

## EPIC E2 — Natural Language Intent Parsing

### SP-007 · Command schema + normalizer `[P0] ~0.25h`
**FRs:** FR-2.1 · **Depends:** SP-001
Define the `Command` shape (`02-technical-architecture.md §3`) and a `normalize()`/validate function used by both parsers.
**DoD:** invalid/partial commands are coerced to a safe default (`action:"unknown"`, `quantity:1`).

### SP-008 · Rule-based parser `[P0] ~0.75h`
**FRs:** FR-2.2, FR-2.3, FR-2.5 · **Depends:** SP-007
`services/rules.js`: detect action verbs (add/need/buy/get vs remove/delete vs find/search vs clear), extract first number as quantity + unit, remainder as item; emit a confidence score.
**DoD:** ≥8/10 sample English phrases parse correctly (documented test list); returns confidence for LLM-fallback decision.

### SP-009 · Serverless LLM proxy `/api/parse` `[P1] ~0.75h`
**FRs:** FR-2.3, FR-8.2, S1 · **Depends:** SP-001, SP-007
Implement `api/parse.js`: read `{transcript, language}`, call LLM with JSON-only system prompt, validate, return `{command}`. Key from env var. Add input length cap + basic rate limit.
**DoD:** curl with a transcript returns valid command JSON; key absent from client bundle; malformed LLM output → `action:"unknown"` (never crashes).

### SP-010 · Parser orchestration (rules → LLM fallback) `[P1] ~0.5h`
**FRs:** FR-2.5, NFR-5 · **Depends:** SP-008, SP-009
`services/parser.js`: run rules; if confidence < threshold, call `/api/parse`; on timeout/failure, fall back to rules result. Re-validate LLM output client-side.
**DoD:** varied phrasing that rules miss is handled by LLM; with network off, app still parses common commands.

### SP-011 · Auto-categorization `[P1] ~0.5h`
**FRs:** FR-2.4 · **Depends:** SP-010
Assign category via LLM field and/or `data/categories.json` keyword lookup (fallback "other").
**DoD:** milk→dairy, apples→produce, bread→bakery, chips→snacks; unknown items get "other".

### SP-012 · Ambiguity / rephrase prompt `[P1] ~0.25h`
**FRs:** FR-2.6, NFR-1 · **Depends:** SP-010
When `action:"unknown"` or confidence very low, ask the user to rephrase instead of acting.
**DoD:** gibberish input produces a friendly "didn't catch that" state, no accidental list changes.

---

## EPIC E3 — Shopping List Management

### SP-013 · List store + persistence `[P0] ~0.5h`
**FRs:** FR-3.1, FR-3.2, FR-3.6 · **Depends:** SP-007
Reducer + `ListContext`; actions add/remove/update/clear; sync to `localStorage` with version key + safe parse.
**DoD:** items survive reload; corrupt storage resets safely; add merges quantity on duplicates.

### SP-014 · Command handler wiring `[P0] ~0.25h`
**FRs:** FR-3.1–3.3 · **Depends:** SP-013, SP-010
`services/commands.js` maps a `Command` to store actions and triggers suggestions/search.
**DoD:** "add milk" / "remove milk" / "add 3 eggs" all mutate the list correctly.

### SP-015 · List UI (grouped by category) `[P0] ~0.5h`
**FRs:** FR-3.4, FR-7.1 · **Depends:** SP-013
`<ShoppingList>`/`<CategoryGroup>`/`<ListItemRow>` per `04-frontend-specification.md`.
**DoD:** items render under correct category headers; empty groups hidden; matches mobile layout.

### SP-016 · Manual item controls + quantity edit `[P1] ~0.5h`
**FRs:** FR-3.3, FR-3.5 · **Depends:** SP-015
Row menu: check off, edit quantity, delete (non-voice path).
**DoD:** user can fully manage the list by touch as well as voice; checked items visually distinct.

---

## EPIC E4 — Smart Suggestions

### SP-017 · Suggestions data + engine `[P1] ~0.5h`
**FRs:** FR-4.1, FR-4.2 · **Depends:** SP-013
`data/substitutes.json`, `data/seasonal.json`; `services/suggestions.js` computes substitute (for mentioned/added items) + seasonal (current month).
**DoD:** adding milk suggests oat/almond/soy; seasonal picks reflect the month.

### SP-018 · History-based recommendations `[P2] ~0.5h`
**FRs:** FR-4.3 · **Depends:** SP-013
Track add-frequency + last-added in history; surface frequent items absent from the current list.
**DoD:** after repeated adds of bread, a "Running low on bread?" suggestion appears when it's off the list.

### SP-019 · Suggestion strip UI + one-tap add `[P1] ~0.5h`
**FRs:** FR-4.4, FR-7.x · **Depends:** SP-017
`<SuggestionStrip>`/`<SuggestionChip>`; tap "+" adds to list; hidden when empty; source-tagged styling.
**DoD:** chips render, add correctly, and disappear once added/irrelevant.

---

## EPIC E5 — Voice-Activated Search (stretch)

### SP-020 · Mock catalog + filter service `[P2] ~0.5h`
**FRs:** FR-5.1, FR-5.2 · **Depends:** SP-007
`data/catalog.json` (30–50 products) + `services/catalog.js` filter by query/brand/size/maxPrice.
**DoD:** `filter({query:"apples", maxPrice:5})` returns correct subset; unit-tested.

### SP-021 · Search results UI `[P2] ~0.5h`
**FRs:** FR-5.3 · **Depends:** SP-020, SP-014
`<SearchResults>` renders on `action:"search"`; each result has add button; empty-result state.
**DoD:** "find toothpaste under $5" shows matching products; tapping adds to list.

---

## EPIC E6 — Multilingual Support (stretch)

### SP-022 · Language selector + multilingual parse `[P2] ~0.5h`
**FRs:** FR-6.1, FR-6.2, FR-6.3 · **Depends:** SP-003, SP-010
`<LanguageSelect>` sets `recognition.lang` and passes `language` to `/api/parse`; ship ≥2 non-English languages.
**DoD:** switching to Hindi/Spanish transcribes and parses a command in that language (LLM path).

---

## EPIC E7 — UI/UX & Visual Feedback
*(Interwoven with feature tickets; these are the cross-cutting UX tickets.)*

### SP-023 · Toasts + action feedback + highlights `[P0] ~0.5h`
**FRs:** FR-7.2, FR-7.5 · **Depends:** SP-013
`<ToastHost>`; success/error toasts; new-item highlight; live-region announcements.
**DoD:** every command produces a visible confirmation and an assistive-tech announcement.

### SP-024 · Loading + error + empty states pass `[P0] ~0.5h`
**FRs:** FR-7.3, FR-7.4, NFR-1 · **Depends:** SP-015, SP-010
Implement all states from `04-frontend-specification.md §5` (empty list, thinking spinner, error copy, unsupported banner).
**DoD:** no blank/confusing screens; each failure path shows plain-language guidance.

### SP-025 · Mobile layout + accessibility pass `[P0] ~0.5h`
**FRs:** FR-7.1, NFR-4 · **Depends:** SP-015, SP-004
Verify 375px layout, focus states, contrast (light/dark), reduced-motion, keyboard operation.
**DoD:** a11y checklist in `04-frontend-specification.md §9` fully checked.

---

## EPIC E8 — Deployment & Ops

### SP-001 · Project scaffold `[P0] ~0.25h`
**FRs:** — · **Depends:** none
Vite + React + Tailwind; folder structure (`src/components`, `src/services`, `src/data`, `api/`); base layout; `.gitignore` (incl. `.env*`).
**DoD:** app builds and runs locally; repo initialized; folders match architecture doc.

### SP-002 · Deploy pipeline (Vercel) `[P0] ~0.25h`
**FRs:** FR-8.1, FR-8.3 · **Depends:** SP-001
Connect GitHub repo to Vercel; auto-deploy `main`; confirm public HTTPS URL loads the scaffold.
**DoD:** pushing to `main` redeploys; live URL works; done **before** feature work (deploy early!).

### SP-026 · Env vars + security headers + final deploy `[P0] ~0.5h`
**FRs:** FR-8.2, S1, S5, T2, T8 · **Depends:** SP-009, SP-002
Set `LLM_*` env vars in Vercel; add `vercel.json` security headers (`03-security-and-access.md §6`); verify no secret in bundle; run the pre-launch checklist.
**DoD:** production app parses via LLM using server-side key; security checklist passed; final URL tested on a phone.

---

## Documentation & submission (part of the grade)

### SP-027 · README `[P0] ~0.5h`
**FRs:** deliverable · **Depends:** SP-026
Pitch, live link, screenshot/GIF, example voice commands, tech stack + why, "works best in Chrome" note, local setup, limitations/next steps, and the **name-is-branding-no-payment** clarification.
**DoD:** a stranger can run it locally and try the live app from the README alone.

### SP-028 · Demo GIF `[P1] ~0.25h`
**Depends:** SP-026
Short screen recording of the voice loop (add → categorize → suggestion → remove).
**DoD:** GIF embedded in README so reviewers without a mic can see it work.

### SP-029 · 200-word approach write-up `[P0] ~0.25h`
**FRs:** deliverable · **Depends:** SP-026
Problem, architecture, the key trade-off (rules + LLM; Web Speech API), what you'd add next. ≤200 words.
**DoD:** within word limit; specific, not generic.

---

## Cut-list (if you run out of time, drop in this order)
1. SP-022 multilingual (P2)
2. SP-018 history recommendations (P2)
3. SP-020/SP-021 voice search (P2)
4. SP-016 manual quantity edit → keep delete only (P1→trim)
5. SP-028 demo GIF (nice-to-have)

**Never cut:** SP-001–SP-008, SP-013–SP-015, SP-023–SP-027, SP-029 — that set *is* a passing submission.

---

## Ticket summary table

| ID | Title | Epic | Priority | Est. |
|---|---|---|---|---|
| SP-001 | Project scaffold | E8 | P0 | 0.25 |
| SP-002 | Deploy pipeline | E8 | P0 | 0.25 |
| SP-003 | Speech service wrapper | E1 | P0 | 0.5 |
| SP-004 | Mic button + states | E1 | P0 | 0.5 |
| SP-005 | Live transcript / status bar | E1 | P0 | 0.25 |
| SP-006 | Permission & unsupported fallback | E1 | P0 | 0.5 |
| SP-007 | Command schema + normalizer | E2 | P0 | 0.25 |
| SP-008 | Rule-based parser | E2 | P0 | 0.75 |
| SP-009 | Serverless LLM proxy | E2 | P1 | 0.75 |
| SP-010 | Parser orchestration | E2 | P1 | 0.5 |
| SP-011 | Auto-categorization | E2 | P1 | 0.5 |
| SP-012 | Ambiguity / rephrase | E2 | P1 | 0.25 |
| SP-013 | List store + persistence | E3 | P0 | 0.5 |
| SP-014 | Command handler wiring | E3 | P0 | 0.25 |
| SP-015 | List UI (categories) | E3 | P0 | 0.5 |
| SP-016 | Manual controls + qty edit | E3 | P1 | 0.5 |
| SP-017 | Suggestions data + engine | E4 | P1 | 0.5 |
| SP-018 | History recommendations | E4 | P2 | 0.5 |
| SP-019 | Suggestion strip UI | E4 | P1 | 0.5 |
| SP-020 | Mock catalog + filter | E5 | P2 | 0.5 |
| SP-021 | Search results UI | E5 | P2 | 0.5 |
| SP-022 | Language selector + parse | E6 | P2 | 0.5 |
| SP-023 | Toasts + feedback + highlights | E7 | P0 | 0.5 |
| SP-024 | Loading/error/empty states | E7 | P0 | 0.5 |
| SP-025 | Mobile + accessibility pass | E7 | P0 | 0.5 |
| SP-026 | Env vars + headers + deploy | E8 | P0 | 0.5 |
| SP-027 | README | Docs | P0 | 0.5 |
| SP-028 | Demo GIF | Docs | P1 | 0.25 |
| SP-029 | 200-word write-up | Docs | P0 | 0.25 |

**P0 subtotal ≈ 6.75h · P1 ≈ 3.0h · P2 ≈ 2.0h.** Do all P0 first; add P1/P2 as time permits (the 8h budget covers P0 + a slice of P1).
