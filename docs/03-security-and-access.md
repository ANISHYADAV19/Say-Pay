# Security & Access Document

**Product:** Say & Pay — Voice Command Shopping Assistant
**Status:** Draft v1.0
**Last updated:** 2026-08-19
**Related docs:** `02-technical-architecture.md`

> **Scope note:** This app has **no user accounts, no personal data collection, and no payments**. The realistic attack surface is small. This document is therefore **proportionate**: it takes seriously the few things that genuinely matter (API-key secrecy, microphone consent, input handling, dependency/hosting hygiene) and explicitly marks the rest as **out of scope with rationale**. Over-building security here (OAuth, RBAC, WAF, SIEM) would be a judgment red flag for an 8-hour project.

---

## 1. Security objectives

| # | Objective |
|---|---|
| S1 | The LLM API key is **never** exposed to the client or committed to git. |
| S2 | Microphone access is **consent-based, transparent, and revocable**. |
| S3 | No voice audio or personal data is stored or transmitted beyond what's needed to parse a command. |
| S4 | All external inputs (transcript, LLM response, stored state) are **validated** before use. |
| S5 | The app is served only over **HTTPS**. |
| S6 | Dependencies and hosting are configured with safe defaults. |

---

## 2. Assets & data classification

| Asset | Sensitivity | Where it lives | Protection |
|---|---|---|---|
| LLM API key | **Secret** | Serverless env var only | Never in client bundle / repo (S1) |
| Voice audio | Transient | Browser memory during recognition | Never persisted or uploaded (S3) |
| Transcript text | Low | Sent to `/api/parse` transiently | Not logged with identifiers |
| Shopping list | Low / personal-ish | `localStorage` on user's device | Stays on-device; user can clear |
| Mock catalog / suggestion data | Public | Static JSON in bundle | None needed |

**Key point:** the app collects **no PII, no accounts, no location, no payment data**. The shopping list is the only user-generated data and it never leaves the device (unless the optional Firestore stretch is enabled — see §8).

---

## 3. Trust boundaries

```
[ User's browser ]  --trusted-by-user, untrusted-by-server-->  [ /api/parse serverless ]  -->  [ LLM provider ]
        |                                                              |
   localStorage (device)                                        holds the secret key
```

- **Client is untrusted by the server:** `/api/parse` validates its input and never returns the key or provider errors verbatim.
- **LLM output is untrusted by the client:** the client re-validates the returned `Command` against a schema before acting on it (defense in depth).

---

## 4. Threats & controls (right-sized threat model)

| ID | Threat | Likelihood | Control |
|---|---|---|---|
| T1 | **API key theft** from client bundle or repo | High if mishandled | Key only in serverless env var; `.env*` git-ignored; no `VITE_`-prefixed secrets (those ship to the browser); secret scanning on the repo. |
| T2 | **Abuse of the `/api/parse` proxy** (someone else's traffic burning your quota) | Medium | Basic **rate limiting** per IP; restrict CORS/allowed origin to your domain; short request timeout; cap transcript length. |
| T3 | **Injection via transcript** into the LLM prompt (prompt injection) | Medium | Treat transcript as untrusted **data**, not instructions; strict system prompt ("output only JSON"); validate/parse response; ignore any non-schema output. |
| T4 | **XSS** from rendering transcript/LLM text in the DOM | Medium | React escapes by default; **never** use `dangerouslySetInnerHTML` with dynamic text; render suggestions/catalog as text nodes. |
| T5 | **Malicious/oversized `localStorage`** breaking the app | Low | Version key + `try/catch` on parse + reset-to-empty fallback; validate shape before use. |
| T6 | **Man-in-the-middle** | Low (HTTPS) | Enforce HTTPS (host default); no mixed content. |
| T7 | **Dependency / supply-chain vulnerability** | Medium | Pin versions; `npm audit`; minimal dependency count; Dependabot (optional). |
| T8 | **Clickjacking / content sniffing** | Low | Security headers (see §6). |

---

## 5. Access & permissions model

Because there is **no authentication**, "access control" here is about **browser permissions and network access**, not user roles:

| Actor | Access | Granted by |
|---|---|---|
| End user | Full app UI on their own device; their own `localStorage` list | Just visiting the URL |
| Microphone | Only after explicit browser permission prompt | OS/browser consent (S2) |
| `/api/parse` caller | Only same-origin requests within rate limit | CORS + rate limit (T2) |
| Deploy/admin | Vercel project + env vars + GitHub repo | Platform account (protect with 2FA) |

**Microphone consent (S2):**
- Mic only activates on an explicit user tap (never auto-listen on load).
- Clear visual "listening" indicator whenever the mic is live.
- A one-line privacy statement in the UI/README: *"Audio is processed in your browser and never stored. Transcribed text is sent to an AI service only to interpret your command."*
- User can stop listening at any time; browser permission is revocable.

**No RBAC / no auth rationale:** single-user, single-device, no sensitive data, assessment scope. Adding auth would add attack surface and build cost for zero security benefit here. Multi-user access control is documented as a **future** item (§8).

---

## 6. Recommended HTTP security headers

Set via `vercel.json` (or host equivalent):
```
Content-Security-Policy: default-src 'self'; connect-src 'self' https://<llm-provider-host>; media-src 'self'; img-src 'self' data:; style-src 'self' 'unsafe-inline'
Strict-Transport-Security: max-age=63072000; includeSubDomains; preload
X-Content-Type-Options: nosniff
X-Frame-Options: DENY
Referrer-Policy: no-referrer
Permissions-Policy: microphone=(self), geolocation=(), camera=()
```
> Tune `connect-src` to your actual LLM host and `/api`. `Permissions-Policy` explicitly allows mic only for your own origin and disables camera/geolocation.

---

## 7. Secrets management

- Secrets live **only** in the host's environment variables (`LLM_API_KEY`, etc.).
- `.gitignore` includes `.env`, `.env.local`, `.env.*`.
- Never prefix secrets with `VITE_` (Vite inlines those into the client bundle).
- If a key is ever committed: **rotate it immediately**, don't just delete the commit.
- Enable GitHub secret-scanning / push protection on the repo.

---

## 8. Privacy

- **Data minimization:** only the transcript is sent off-device, and only to interpret the command.
- **No persistence of audio or transcripts** server-side; the serverless function is stateless and should not log transcripts alongside any identifier.
- **On-device data:** the shopping list stays in `localStorage`; provide a "Clear list / clear data" control so the user can wipe it.
- **Optional Firestore stretch (§ future):** if cross-device sync is added, document what is stored, add security rules restricting each user to their own document, and update this doc — do **not** enable it silently.

---

## 9. Out of scope (with rationale)
| Not doing | Why it's acceptable here |
|---|---|
| User authentication / accounts | No multi-user data, no PII, single-device MVP |
| Role-based access control | No privileged operations exist |
| Payment/PCI compliance | No payments (name is branding only) |
| WAF / DDoS protection / SIEM | Free static host defaults + basic rate limit suffice for assessment traffic |
| Penetration test / formal audit | Disproportionate for an 8-hour prototype |
| GDPR/CCPA data-subject workflows | No accounts and no server-side personal data stored |

---

## 10. Pre-launch security checklist
- [ ] No secrets in the repo history; `.env*` git-ignored.
- [ ] LLM key only in serverless env vars; no `VITE_` secret.
- [ ] `/api/parse` validates input, caps length, rate-limits, restricts origin.
- [ ] Client re-validates LLM response against schema before acting.
- [ ] No `dangerouslySetInnerHTML` with dynamic content.
- [ ] Security headers set (CSP, HSTS, X-CTO, Permissions-Policy).
- [ ] HTTPS enforced; no mixed content.
- [ ] Mic only on explicit tap; listening indicator shown; privacy line present.
- [ ] `localStorage` reads wrapped in try/catch with reset fallback.
- [ ] `npm audit` clean of high/critical; dependencies pinned.
