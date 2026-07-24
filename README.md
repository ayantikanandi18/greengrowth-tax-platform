# GreenGrowth

A prototype tax-prep platform for **GreenGrowth CPAs** — a from-scratch client/CPA workflow product covering document intake, AI-assisted review, cross-role collaboration, and filing status, designed around one question: *what does someone actually need to do next?*

This was built as a take-home product/design exercise. It's a real, clickable Next.js app — not a static mockup — but everything behind the UI is intentionally simulated (see "What's real vs. simulated" below).

**Live prototype: https://greengrowth-tax-platform-pi.vercel.app**

## Running it

```bash
npm install
npm run dev
```

Open http://localhost:3000. No login, no environment variables, no database — everything is seeded, deterministic mock data generated at load time.

### Switching roles / demo users

Click the account switcher in the top-right corner. There are 8 demo logins spanning 4 roles:

| User | Role(s) | Why they exist |
|---|---|---|
| **Ayantika Nandi** | Preparer *and* Client | The primary preparer account — also has their own personal return, to demonstrate a firm employee who is also a client (switch roles from the same account) |
| **Jordan Osei** | Preparer (seasonal) | Same shell, visibly reduced permissions banner |
| **Dana Whitfield** | Reviewer | Sees only returns in final review |
| **Alex Whitcombe** | Firm Admin | Firm-wide overview |
| **Sarah Chen** | Client | Individual return mid-review — the main traceability walkthrough |
| **Elena Rivera** | Client | Rivera Consulting LLC — a business return with 247 documents, for the scale/search challenge |
| **David Okafor** | Client | Blocked return (missing a document) — dashboard urgency example |
| **Priya Nair** | Client | Brand-new client, zero data — the first-time onboarding walkthrough |

## How this maps to the assignment

*(Described in my own words — not reproducing the brief's proprietary language, since the source document was marked confidential.)*

- **Traceability** — `/preparer/returns/r-sarah-2025/review`. Click any return field on the left; the right panel shows the exact source document, the region on it, and the transformation applied (e.g. wages is the sum of two W-2s — click through both).
- **Client/CPA collaboration** — `/preparer/returns/[id]/messages` and `/client/messages`. Internal-vs-client-visible toggle, messages linked back to specific documents, an "outstanding requests" panel.
- **First-time onboarding** — log in as **Priya Nair**. Zero documents, zero messages → the home screen shows exactly one action, nothing else.
- **Cross-object navigation** — from any return's Overview tab, click a task that references a document or message. You'll land there with a gold "← Back to [task]" banner and a deep-linkable URL (`?fromLabel=...&fromHref=...`) — your place is never lost.
- **Role-aware experience** — the same shell (`AppShell` → `Sidebar`/`TopNav`) re-renders its nav per active role. Two roles (Client, Preparer) are fully built out; Reviewer and Firm Admin get lighter, adapted views reusing the same components (the Reviewer queue links straight into the same traceability screen preparers use). Business-owner and seasonal-staff are represented as variations rather than six separate screen sets — noted below.
- **Status & progress** — one internal state machine (`STATUS_META` in `lib/mock/types.ts`), rendered two ways: a plain-language client label and a detailed staff label, both driven off the same data so they can never drift apart.
- **Actionable dashboard** — `/preparer`. Sorted by real logic (`rankReturnsByUrgency`): blocking-on-someone first, then by due date — not a static list. Toggle between "My returns" and firm-wide.
- **Clickable vs. editable** — `DataStateBadge` + `dataStateContainerClasses`: one consistent visual language (AI-suggested / verified / locked / needs-input) reused on the review screen, the dashboard, and the documents screen.
- **Complexity at scale** — Rivera Consulting's return has **247 real mock documents**. Search, category filters, a summary/detail toggle, and pagination are all wired against that actual dataset, not a handful of demo rows.
- **Trustworthy AI** — `AIInsightCard`, on the review screen and the return overview. Every insight shows what the "AI" found, a collapsible rationale, linked evidence documents, a confidence meter, and an "accept vs. something's off" flow that re-checks and closes the loop without leaving the page.

## What's real vs. simulated

**Real:** the Next.js app, all routing/navigation, the prioritization logic on the dashboard, the compatibility-style status state machine, the search/filter/pagination on Rivera's 247 documents, the role-switching architecture, and the deep-linking/back-navigation trail.

**Simulated, by design** (per the assignment's own instruction — this is what "keep it quick and dirty" and "simulate the AI" meant in practice):
- There is no OCR, no document parsing, and no real AI/model call anywhere. `lib/mock/ai-stub.ts` returns hand-authored, plausible-looking JSON behind an artificial delay, so the UI can demonstrate what an in-progress AI action should feel like.
- The "document viewer" is a stylized page mockup with a highlighted region — not a real PDF renderer.
- All data (clients, returns, documents, tasks, messages, AI insights) is generated once from a seeded `@faker-js/faker` + hand-authored dataset (`lib/mock/generate.ts`) — nothing is persisted; refreshing the server resets nothing because nothing was ever written anywhere.
- Uploading a document or sending a message updates local React state only — it isn't saved anywhere and won't survive a refresh.
- There's no real authentication — the role switcher is a UI convenience over a fixed list of demo users.

## Deliberate scope decisions

- **Two roles built in full** (Client, Preparer); Reviewer and Admin are lighter, adapted views of the same shell. Building six fully independent experiences wasn't the point — showing *one architecture* flex across roles was.
- **Business-owner** is represented by Elena Rivera's client view on a business return (same client role, different data shape); **seasonal staff** is Jordan Osei's preparer account with a visible reduced-permissions banner, rather than two more entirely separate UIs.
- The forecast/urgency logic on the dashboard is a straightforward rules-based sort, not a scored ML model — matching the assignment's instruction that a small script over mock data is the right amount of engineering here.

## Stack

Next.js (App Router) + TypeScript + Tailwind CSS v4, Framer Motion, `@faker-js/faker` for realistic mock data. No backend, no database, no environment variables required.
