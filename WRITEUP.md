# Say & Pay — Project Write-up

**Say & Pay** is a voice-first shopping-list manager. Users speak naturally — *“add two bottles of milk,” “find apples under $5,” “remove bread”* — and the app parses the intent, updates a categorized list, and offers smart suggestions. (The name is branding; there is no payment feature.)

**Approach.** I split parsing into two layers. A fast, offline **rule-based parser** handles common phrasings deterministically and emits a confidence score. When confidence is low — free-form or non-English speech — it escalates to an **LLM (Google Gemini)** through a serverless proxy. Both paths emit the same `Command` object, funneled through a single validator before touching state: one shared correctness *and* security boundary.

**Key features.** Hands-free voice input with a typed fallback (same pipeline), auto-categorization, catalog search with price/brand filters, and suggestions — substitutes, seasonal produce, and reorders.

**Technical decisions.** React + Vite + Tailwind; state in `useReducer` + localStorage (no backend needed at this scale); Vitest for the pure logic. Security was central: the API key stays server-side, the transcript is treated as untrusted input against prompt injection, and the LLM’s output is re-validated client-side. The app stays fully functional offline via the rule parser.
