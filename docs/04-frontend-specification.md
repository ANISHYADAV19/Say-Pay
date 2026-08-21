# Frontend Specification Document

**Product:** Say & Pay — Voice Command Shopping Assistant
**Status:** Draft v1.0
**Last updated:** 2026-08-19
**Related docs:** `01-product-requirements.md`, `02-technical-architecture.md`

> **Design intent:** minimalist, mobile-first, voice-forward. One screen, one obvious action (the mic), instant feedback. The UI should feel calm and responsive — the "smart" happens quietly around a simple list.

---

## 1. Design principles
1. **Voice is the hero.** The mic button is the largest, most central control.
2. **Always show system state.** The user must always know: is it listening? thinking? did it work?
3. **One screen.** No routing/navigation for the MVP — list, mic, suggestions, and (stretch) search all live on one scrollable page.
4. **Mobile-first.** Design for a 375px-wide phone; scale up gracefully.
5. **Forgiving.** Every action is reversible or correctable; nothing fails silently.

---

## 2. Screen layout (single page)

```
┌───────────────────────────────┐   375px (mobile)
│  Say & Pay            [🌐 EN▾] │  ← Header: title + language selector (stretch)
├───────────────────────────────┤
│  “add two bottles of milk”     │  ← Live transcript / status line (ARIA live)
│  ● Listening…                  │
├───────────────────────────────┤
│  ┌─────────────────────────┐  │
│  │  SUGGESTIONS             │  │  ← Horizontal chips: substitute/seasonal/history
│  │  [+ Oat milk][+ Spinach] │  │     (one-tap add)
│  └─────────────────────────┘  │
│                                │
│  DAIRY                         │  ← List grouped by category
│   • Milk        2 bottles  ⋮   │
│  PRODUCE                       │
│   • Apples      1kg        ⋮   │
│   • Bananas     6          ⋮   │
│  BAKERY                        │
│   • Bread ✓ (checked)      ⋮   │
│                                │
│  (empty state if no items)     │
├───────────────────────────────┤
│                                │
│            (  🎤  )            │  ← Big mic FAB, fixed bottom-center
│         Tap to speak           │
└───────────────────────────────┘
   Toasts appear above the mic ↑
```

**Regions:**
- **Header** — product name; a light/dark theme toggle (FR-7.6); language dropdown (stretch, FR-6.1/6.4 — drives both the recognition locale *and* the UI language via the `useT()` i18n hook); optional "clear list" in overflow.
- **Status line** — live transcript + mic state; doubles as the ARIA live region (NFR-4).
- **Suggestions strip** — scrollable chips (FR-4.x); hidden when empty.
- **List** — grouped by category (FR-3.4); each row has name, qty/unit, and a row menu (check off / edit / delete → FR-3.5).
- **Search results** (stretch) — appears as a sheet/section when action=search (FR-5.x).
- **Mic FAB** — primary control; label changes with state.
- **Toasts** — transient confirmations/errors.

---

## 3. Component tree

```
<App>
├─ <Header>
│   └─ <LanguageSelect/>            // stretch (E6)
├─ <StatusBar>                      // mic state + live transcript (ARIA live)
├─ <SuggestionStrip>
│   └─ <SuggestionChip/> × n
├─ <SearchResults/>                 // stretch (E5), conditional
├─ <ShoppingList>
│   └─ <CategoryGroup> × n
│        └─ <ListItemRow/> × n      // qty, check, edit, delete
├─ <EmptyState/>                    // when list is empty
├─ <MicButton/>                     // FAB, primary action
├─ <TypedInputFallback/>            // shown if speech unsupported/denied
└─ <ToastHost/>                     // renders <Toast/> queue
```

State is provided via a `ListContext` (reducer) + a `useSpeech()` hook wrapping VoiceCapture. See `02-technical-architecture.md §2`.

---

## 4. Component specs

### 4.1 MicButton (primary)
- **Visual:** circular FAB, ~72px, fixed bottom-center, high-contrast accent color.
- **States:**
  | State | Appearance | Label |
  |---|---|---|
  | idle | solid accent, mic icon | "Tap to speak" |
  | listening | pulsing ring animation, red dot | "Listening… tap to stop" |
  | processing | spinner overlay, disabled | "Thinking…" |
  | error/unsupported | greyed, alert icon | "Voice unavailable" |
- **Interaction:** tap toggles listening; tapping during `processing` is ignored; keyboard: `Space`/`Enter` toggles (NFR-4).
- **Accessibility:** `aria-pressed` reflects listening; announces state changes via the status live region.

### 4.2 StatusBar
- Shows interim transcript in a muted style; final transcript in solid.
- Mic-state indicator (dot + word).
- Is the `aria-live="polite"` region that announces "Added 2 bottles of milk", "Removed bread", "Didn't catch that — try again".

### 4.3 ShoppingList / CategoryGroup / ListItemRow
- **CategoryGroup:** uppercase category label + count; collapsible is optional.
- **ListItemRow:** item name, quantity + unit, overflow menu (⋮) → check off (FR-3.5), edit quantity, delete. Checked items show strikethrough + move to bottom (or dim in place).
- **New-item highlight (FR-7.5):** row briefly flashes the accent background on add; fade on remove.
- Empty group is not rendered.

### 4.4 SuggestionStrip / SuggestionChip
- Horizontal scroll of chips; each chip: label + "+" to add (FR-4.4).
- Chip variants tagged by source: *substitute*, *seasonal*, *reorder* (subtle color/icon difference).
- Hidden entirely when there are no suggestions.

### 4.5 SearchResults (stretch, E5)
- Triggered when `action=search`; renders a titled list ("Results for 'apples under $5'").
- Each result: name, brand, size, price; "+ Add" button.
- Empty result → "No matches — try a different search."

### 4.6 TypedInputFallback (FR-1.4)
- Always available (small text field + send), and **promoted to primary** when speech is unsupported/denied.
- Feeds the exact same parser pipeline as voice, so the app is fully usable without a mic.

### 4.7 ToastHost / Toast
- Bottom, above the FAB; auto-dismiss ~3s; types: success / info / error.
- Error toasts persist slightly longer and offer an action where relevant (e.g., "Retry").

---

## 5. UI states (every component must handle these)

| State | Where it shows | Design |
|---|---|---|
| **Empty** | List with no items | Friendly illustration/text: "Your list is empty — tap the mic and say 'add milk'." Includes 2–3 example commands. |
| **Loading** | During LLM parse / search | Mic → "Thinking…" spinner; skeleton row optional (FR-7.3). |
| **Success** | After any command | Toast + item highlight + live-region announcement. |
| **Error** | Mic denied, no match, network/LLM fail | Inline banner or toast with plain-language cause + next step. |
| **Unsupported** | Non-Chrome/Edge or no mic | Banner + typed fallback promoted. |
| **Ambiguous** | Parser confidence low | "Did you mean to add or remove *milk*?" prompt / re-ask (FR-2.6). |

**Example error copy (plain, non-technical):**
- Mic denied → "I need microphone access to hear you. You can enable it in your browser settings, or type your command below."
- No match (search) → "I couldn't find that. Try a brand or a price like 'under $5'."
- LLM/network down → "I'm having trouble understanding right now — I'll use basic matching. Try short commands like 'add eggs'."

---

## 6. Visual design tokens (starting point)

| Token | Value (suggested) | Use |
|---|---|---|
| Font | System UI stack / Inter | All text |
| Base size | 16px; scale 14/16/20/28 | Body → headings |
| Accent | one confident color (e.g., teal `#0D9488`) | Mic, primary actions, highlights |
| Surface | near-white `#FAFAF9` / dark `#0B0F14` | Background (support dark mode) |
| Text | `#1C1917` / dark `#E7E5E4` | Foreground |
| Success / Error | green / red at accessible contrast | Toasts, states |
| Radius | 12–16px | Cards, chips, FAB |
| Spacing | 4px base grid (8/12/16/24) | Layout rhythm |

> Keep the palette tight (1 accent + neutrals + semantic green/red). **Dark mode** ships as a manual light/dark toggle (class-based) that defaults to `prefers-color-scheme` and persists the user's choice (FR-7.6); a pre-paint script in `index.html` applies it before first render to avoid a flash. Ensure WCAG AA contrast (NFR-4).

---

## 7. Interaction & motion
- Mic **listening** = gentle pulsing ring (respect `prefers-reduced-motion` → static dot instead).
- Add/remove = 150–200ms highlight/fade; list reflow animated subtly.
- Toasts slide up + fade.
- Keep all motion under ~200ms; never block interaction on animation.

---

## 8. Responsive behavior
| Breakpoint | Layout |
|---|---|
| ≤ 480px (phone, primary) | Single column; FAB fixed bottom-center; suggestions scroll horizontally. |
| 481–768px (large phone/tablet) | Same, wider max-width (~560px), centered. |
| ≥ 769px (desktop demo) | Centered column (max ~640px) with generous margins; FAB may dock bottom-right. |

Design and test at **375px first**; the reviewer may open it on a phone.

---

## 9. Accessibility checklist (NFR-4)
- [ ] Mic button and all row actions reachable and operable by keyboard.
- [ ] Visible focus states on all interactive elements.
- [ ] `aria-live="polite"` status region announces every recognized action/error.
- [ ] Mic state exposed via `aria-pressed` + text (not color alone).
- [ ] Color contrast meets WCAG AA in light and dark.
- [ ] `prefers-reduced-motion` respected.
- [ ] Typed fallback ensures full functionality without voice.

---

## 10. Definition of "done" (frontend)
A screen is done when it handles **empty, loading, success, error, and unsupported** states; is usable by **keyboard + voice + typing**; looks correct at **375px and desktop**; and announces actions to assistive tech. See `05-feature-tickets.md` for per-ticket acceptance criteria.
