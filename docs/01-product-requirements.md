# Product Requirements Document (PRD)

**Product:** Say & Pay — Voice Command Shopping Assistant
**Document owner:** [Your Name]
**Status:** Draft v1.0
**Last updated:** 2026-08-19

> **Scope note:** This is a technical-assessment project with a **hard 8-hour build budget**. This PRD is deliberately *right-sized* — it defines a focused MVP plus clearly-labelled stretch goals, rather than a full commercial product spec. Anything not achievable and demonstrable within the time budget is marked **Out of Scope** or **Stretch**.

---

## 1. Overview

### 1.1 Summary
Say & Pay is a **voice-first shopping-list web app**. A user speaks a natural command ("add two bottles of milk", "remove bread", "find organic apples under $5"), and the app transcribes it, understands the intent, updates a categorized shopping list, and responds with real-time visual feedback plus smart suggestions.

### 1.2 Problem statement
Typing shopping lists on a phone is slow and awkward — especially hands-busy moments (cooking, driving, mid-chore). People also forget recurring staples and don't know good substitutes. Say & Pay lets users **manage a list by speaking**, and nudges them with helpful, context-aware suggestions.

### 1.3 Goals
- **G1** — Let a user manage a shopping list end-to-end using only their voice.
- **G2** — Understand varied, natural phrasing (not rigid commands).
- **G3** — Feel responsive and trustworthy through immediate visual feedback.
- **G4** — Add lightweight "smart" value (suggestions, substitutes, seasonal picks).
- **G5** — Ship a deployed, working URL that a reviewer can try in minutes.

### 1.4 Non-goals (Out of Scope)
- Real payment / checkout (despite the name — "Say & Pay" is **branding only**).
- Real retailer inventory or live pricing (a **mock catalog** stands in).
- User accounts, authentication, multi-user sharing.
- Native mobile apps (this is a responsive/PWA-style web app).
- Server-side ML model training. "Smart" = curated data + heuristics + a hosted LLM.

### 1.5 Naming clarification
The product name **Say & Pay** is retained for branding. The reviewer should understand there is **no payment feature**; the app is a shopping-*list* manager. This is stated in the README to avoid confusion.

---

## 2. Target users & context

| Persona | Description | Primary need |
|---|---|---|
| **Busy home cook** | Hands full, adds items mid-task | Fast, hands-free capture |
| **Weekly shopper** | Builds a list over the week | Recurring-item reminders, categories |
| **Assessment reviewer** | Evaluates this build | Try it in 2 minutes, see it work, read clean docs |

**Primary device:** mobile phone in **Chrome/Edge** (Web Speech API support is best there). Desktop Chrome is the demo/dev environment.

---

## 3. Assumptions & constraints

- **A1** — Browser supports the Web Speech API (Chrome/Edge). A **typed-input fallback** is provided for unsupported browsers (Firefox/Safari) so the app is always usable.
- **A2** — Microphone requires user permission and an **HTTPS** origin.
- **A3** — LLM usage stays within a **free tier**; the app degrades gracefully to rule-based parsing if the LLM is unavailable.
- **A4** — No login: list state persists **per-device** via `localStorage`.
- **C1** — Total build effort ≤ **8 hours**.
- **C2** — Deliverables: working URL, GitHub repo + README, ≤200-word write-up.

---

## 4. Feature requirements

Requirements are grouped by **Epic** (E1–E8). Each has a stable ID used across all project docs. Priority: **P0** = must-work (assessment fails without it), **P1** = high value, **P2** = stretch/differentiator.

### E1 — Voice Capture & Transcription
| ID | Requirement | Priority |
|---|---|---|
| FR-1.1 | User taps a mic button to start/stop listening. | P0 |
| FR-1.2 | Live (interim) transcript is shown while the user speaks. | P0 |
| FR-1.3 | Final transcript is passed to the intent parser on speech end. | P0 |
| FR-1.4 | If mic is denied/unsupported, show a clear message + typed-input fallback. | P0 |

### E2 — Natural Language Intent Parsing
| ID | Requirement | Priority |
|---|---|---|
| FR-2.1 | Parse transcript into a structured command `{action, item, quantity, unit, category, filters}`. | P0 |
| FR-2.2 | Support actions: **add, remove, update quantity, search, clear**. | P0 |
| FR-2.3 | Handle varied phrasing ("I need…", "add…", "buy…", "get me…"). | P0 |
| FR-2.4 | Auto-assign a **category** to each item (dairy, produce, bakery, etc.). | P1 |
| FR-2.5 | Rule-based parser handles common cases; **LLM fallback** handles the rest. | P1 |
| FR-2.6 | If intent is unclear, ask the user to rephrase (no silent failure). | P1 |

### E3 — Shopping List Management
| ID | Requirement | Priority |
|---|---|---|
| FR-3.1 | Add an item (deduplicate; merge quantity if it already exists). | P0 |
| FR-3.2 | Remove an item by name. | P0 |
| FR-3.3 | Update an item's quantity. | P1 |
| FR-3.4 | Group/display items by category. | P1 |
| FR-3.5 | Manually check off / delete items via the UI (not only voice). | P1 |
| FR-3.6 | Persist the list across page reloads (`localStorage`). | P0 |

### E4 — Smart Suggestions
| ID | Requirement | Priority |
|---|---|---|
| FR-4.1 | **Substitutes** — offer alternatives for a mentioned item (milk → oat/almond/soy). | P1 |
| FR-4.2 | **Seasonal** — suggest in-season produce based on the current month. | P1 |
| FR-4.3 | **History-based** — surface frequently-bought items not currently on the list ("Running low on bread?"). | P2 |
| FR-4.4 | Suggestions are one-tap addable to the list. | P1 |

### E5 — Voice-Activated Search
| ID | Requirement | Priority |
|---|---|---|
| FR-5.1 | Search a **mock product catalog** by voice ("find organic apples"). | P2 |
| FR-5.2 | Filter by attributes: brand, size, and **price range** ("under $5"). | P2 |
| FR-5.3 | Show results with name, brand, size, price; one-tap add to list. | P2 |

### E6 — Multilingual Support
| ID | Requirement | Priority |
|---|---|---|
| FR-6.1 | Language selector sets the speech-recognition language. | P2 |
| FR-6.2 | Intent parsing works for the selected language (via LLM). | P2 |
| FR-6.3 | Ship **at least 2** languages beyond English (e.g., Hindi, Spanish). | P2 |

### E7 — UI/UX & Visual Feedback
| ID | Requirement | Priority |
|---|---|---|
| FR-7.1 | Minimalist, single-column, mobile-first layout. | P0 |
| FR-7.2 | Real-time feedback: mic state (idle/listening/processing), live transcript, action toasts. | P0 |
| FR-7.3 | Loading states for async work (LLM/search). | P0 |
| FR-7.4 | Empty, error, and success states are all designed. | P0 |
| FR-7.5 | Newly added/removed items are briefly highlighted. | P1 |

### E8 — Deployment & Ops
| ID | Requirement | Priority |
|---|---|---|
| FR-8.1 | Deployed to a public HTTPS URL (Vercel/Netlify). | P0 |
| FR-8.2 | LLM key handled via a **serverless proxy**, never exposed client-side. | P0 |
| FR-8.3 | Continuous deploy from `main` on GitHub. | P1 |

### Non-functional requirements
| ID | Requirement |
|---|---|
| NFR-1 | **Error handling** — every external call (mic, LLM, storage) has a graceful failure path. |
| NFR-2 | **Performance** — command → visible result in < ~2s on a normal connection. |
| NFR-3 | **Code quality** — modular files, clear names, no secrets in the repo. |
| NFR-4 | **Accessibility** — keyboard-operable controls, ARIA live region for feedback, visible focus. |
| NFR-5 | **Resilience** — app remains usable if the LLM or network is down (rule-based + local state). |
| NFR-6 | **Privacy** — no voice audio is stored; transcripts processed transiently. |

---

## 5. Primary user flows

**Flow A — Add by voice (happy path)**
1. User taps mic → state = *listening*.
2. Speaks "add two bottles of milk" → live transcript shows.
3. Parser returns `{action:add, item:milk, quantity:2, unit:bottles, category:dairy}`.
4. Item appears under **Dairy**, toast: *"Added 2 bottles of milk"*, item highlights briefly.
5. Suggestions panel may show a substitute (oat milk) or seasonal item.

**Flow B — Remove by voice**
"remove milk" → item removed → toast confirms → undo option (stretch).

**Flow C — Voice search + price filter (stretch)**
"find toothpaste under $5" → results list from catalog → tap to add.

**Flow D — Unsupported browser / mic denied**
Banner explains the limitation → typed-input box performs the same parse pipeline.

---

## 6. Success metrics (for the write-up)

| Metric | Target |
|---|---|
| Core loop works (voice → categorized list) | 100% on Chrome desktop + mobile |
| Varied-phrasing commands understood | ≥ 8/10 sample phrases |
| Command-to-feedback latency | < 2s typical |
| P0 requirements delivered | 100% |
| Reviewer time-to-first-success | < 2 minutes from opening the URL |

---

## 7. Release scope

- **MVP (must ship):** all **P0** items — E1, E2 core, E3 core, E7 core, E8 core.
- **Should ship if time allows:** **P1** — categorization, quantity, substitutes, seasonal.
- **Stretch differentiators:** **P2** — voice search + price filter, multilingual, history-based suggestions.

See **05-feature-tickets.md** for the ticket-level breakdown and the 8-hour phase plan, and **02-technical-architecture.md** for how these requirements map to components.

---

## 8. Open questions / risks
- **R1 — Browser support:** Web Speech API is Chrome/Edge-centric → mitigated by typed fallback (FR-1.4).
- **R2 — LLM latency/limits:** free-tier throttling → mitigated by rule-based parser + graceful degradation (FR-2.5, NFR-5).
- **R3 — Recognition accuracy** for accents/noise → mitigated by editable transcript + confirmation toasts.
- **R4 — Scope creep** across 13 listed features → mitigated by strict P0/P1/P2 prioritization.
