# GreenGrowth

A prototype tax-prep platform for **GreenGrowth CPAs** — a from-scratch client/CPA workflow product covering document intake, AI-assisted review, cross-role collaboration, and filing status, designed around one question: *what does someone actually need to do next?*

Built as a take-home product/design exercise: 10 open-ended design challenges, no prescribed UI, no backend requirement. It's a real, clickable Next.js app, not a static mockup — but everything behind the UI is intentionally simulated. See below for exactly where that line is.

**Live: https://greengrowth-tax-platform-pi.vercel.app**

---

## What's genuinely wired up vs. simulated

**Real:** the Next.js app end to end — routing, all UI logic, the role-based permission system (enforced consistently across every path into a return, not just in the nav), the prioritization/ranking algorithms behind the dashboard, the status/progress state machine, search/filter/pagination against a 249-document dataset, and the deep-linking/back-navigation trail connecting messages → tasks → documents → fields.

**Simulated, by design** — this is what "keep it quick and dirty, simulate the AI" meant in practice for a 10-challenge take-home, not a shortcut I'd defend for production:
- **No real AI/LLM call anywhere.** `lib/mock/ai-stub.ts` is the seam — a handful of functions (`requestAIRecheck`, `checkForDuplicate`) that return hand-authored plausible JSON behind an artificial delay, so a "re-check" *feels* like a network round-trip without one existing. If this were wired to a real model, this file is exactly where that call would go; the call sites and UI states around it wouldn't need to change.
- **No OCR, no document parsing.** The "document viewer" renders a layout templated by document type (W-2/1099 as boxed IRS-style fields, receipts as line items, bank statements as a transaction list) using data already on the record — not a real file, not an extracted image.
- **No backend, no database.** All data — clients, returns, documents, tasks, messages, AI insights — is generated once at process start from a seeded `@faker-js/faker` run plus hand-authored records (`lib/mock/generate.ts`), then queried in-memory (`lib/mock/data.ts`). Nothing is written anywhere; a "write" (uploading a file, sending a message, confirming a field value) only updates local React state and is gone on refresh.
- **No real auth.** The account switcher is a UI convenience over a fixed list of 8 demo users, persisted client-side via `localStorage` so a refresh keeps whichever persona you last picked — that's the *only* thing that survives a reload.

### Decisions worth explaining

- **Two roles built in full** (Client, Preparer); Reviewer and Firm Admin are lighter, adapted views of the same shell rather than two more fully independent UIs. Six roles as six separate products defeats the point of the exercise — the interesting problem is one architecture flexing across roles, which two fully-built roles plus two adapted ones already proves.
- **Business-owner and seasonal-staff are represented as variations, not separate builds** — Elena Rivera's client view on a business return (same role, different data shape) and Jordan Osei's preparer account with a visibly reduced permission set, respectively.
- **The dashboard's urgency ranking is a plain rules-based sort** (blocking status, then nearest real deadline — pulling in task-level due dates, not just the return's own status), not a scored model. A small script over mock data is the right amount of engineering for what's being evaluated here.
- **Category taxonomy for Rivera's generated documents is keyed deterministically to vendor type**, not drawn independently at random — an earlier pass let a utility bill land under "Income" purely by chance, which is the kind of bug that looks fine in a demo and wrong the moment someone actually clicks around.

---

## Quick start

**Prerequisites:** Node 20+, npm.

```bash
git clone https://github.com/ayantikanandi18/greengrowth-tax-platform.git
cd greengrowth-tax-platform
npm install
npm run dev
```

Open **http://localhost:3000**. No environment variables, no `.env` file, no database to provision — the dev server is immediately usable. If port 3000 is already taken locally, Next.js will pick the next free port and print it to the terminal; use whatever it reports.

Other scripts:

```bash
npm run build   # production build
npm run start   # serve the production build locally (after build)
npm run lint    # eslint
```

There's no test suite — verification for this project was done by hand against each of the 10 design challenges (typecheck + lint clean, then click-through per feature), not automated tests, given the scope and timeline.

---

## Deploying

This is a standard Next.js App Router project — any platform with first-class Next.js support works. It was actually deployed to **Vercel**:

**Via the dashboard (no CLI needed):**
1. Push the repo to your own GitHub account.
2. [vercel.com/new](https://vercel.com/new) → import the repo. Framework is auto-detected as Next.js.
3. No environment variables to configure — leave that section empty and deploy.
4. Every subsequent push to `main` auto-deploys via Vercel's GitHub integration.

**Via the CLI, if you'd rather not go through GitHub:**
```bash
npm i -g vercel
vercel login
vercel --prod
```
Accept the defaults it infers (Next.js, build command `next build`, output `.next`). `.vercel/` is gitignored on purpose — it holds your own account's project link, not something to share or inherit from this repo.

---

## Project structure

```
src/
  app/                       Next.js App Router routes — one folder per URL
    client/                    Client-role screens: My Return, Documents, Messages, Questionnaire
    preparer/
      returns/[id]/              Per-return workspace — layout.tsx adds the Overview/Review/Documents/Messages tabs
    reviewer/, admin/          Lighter role-specific views, reusing the same components as preparer/client
    layout.tsx                 Root layout — wraps everything in RoleProvider + QuestionnaireProvider + AppShell
  components/                 Shared UI: AppShell, Sidebar, DataStateBadge, DocumentViewer,
                               AIInsightCard, StatusPill/StatusProgress, TaskList, BackToBanner
  lib/
    context/                   RoleContext (active persona/role, SSR-safe via useSyncExternalStore),
                               QuestionnaireContext (onboarding progress)
    mock/
      generate.ts                 All seed data — the "database" (seeded faker + hand-authored records)
      data.ts                      Query functions + business logic (ranking, status labels) over that data
      types.ts                     Shared TypeScript types, STATUS_META
      ai-stub.ts                   Fake AI response functions — see "What's simulated" above
```

Same shell (`AppShell` → `Sidebar`/`TopNav`) renders differently per role by reading `activeRole` from context — there are four route trees for four roles, not four separate apps stitched together.

---

## Demo accounts

Click the account switcher, top right. 8 logins across 4 roles:

| User | Role(s) | Why they exist |
|---|---|---|
| **Ayantika Nandi** | Preparer *and* Client | Primary preparer account — also has their own personal return, to demonstrate a firm employee who is also a client (switch roles from the same account) |
| **Jordan Osei** | Preparer (seasonal) | Same shell, genuinely reduced permissions — not just a banner |
| **Dana Whitfield** | Reviewer | Sees only returns in final review |
| **Alex Whitcombe** | Firm Admin | Firm-wide overview |
| **Sarah Chen** | Client | Individual return mid-review — the main traceability walkthrough |
| **Elena Rivera** | Client | Rivera Consulting LLC — a business return with 249 documents, for the scale/search challenge |
| **David Okafor** | Client | Blocked return (missing a document) — dashboard urgency example |
| **Priya Nair** | Client | Brand-new client, zero data, 3 unanswered questionnaire items — the first-time onboarding walkthrough |

---

## How this maps to the assignment

*(Described in my own words — not reproducing the brief's proprietary language, since the source document was marked confidential.)*

- **Traceability** — `/preparer/returns/r-sarah-2025/review`. Click any return field on the left; the right panel shows the exact source document, the region on it, and the transformation applied. Fields backed by more than one document (wages = 2 W-2s, the charitable deduction = 6 receipts) show a chip for **every** contributing source — click through each one rather than only ever seeing the first. AI-suggested and needs-input fields also surface their linked `AIInsightCard` right there (e.g. the AGI field explains exactly why it can't be finalized yet). Rivera Consulting's return has its own 5-field Schedule C set too, not just Sarah's — a second, business-flavored example of the same locked/verified/AI-suggested/needs-input mix, with the existing "K-1 needs a human call" insight and its task both linked to a real field instead of just a document.
- **Client/CPA collaboration** — `/preparer/returns/[id]/messages` and `/client/messages`. Internal-vs-client-visible toggle; messages link back to both specific documents *and* specific tasks (David Okafor's "missing W-2" message links straight to that task). The Outstanding Requests panel groups client-visible messages into threads and shows **who owns the next reply** — whoever didn't send the last message — plus a "Mark resolved" action so a thread can actually be closed, not just listed forever.
- **First-time onboarding** — log in as **Priya Nair** (Client, zero documents, zero messages). The home screen shows exactly one action — a real 3-question intake questionnaire, not just a task title — and the "Questionnaire" nav tab only exists while there's something left to answer. Answer all three and, in the same session, the home screen and nav update immediately: the hero switches to "Now let's get your documents," the Questionnaire tab disappears from the sidebar, and the (previously hidden) documents/messages stat tiles appear — a genuine live before/after, not just two different demo accounts side by side.
- **Cross-object navigation** — global nav (`Sidebar`) stays constant; contextual nav (`ReturnTabs`) only exists inside a specific return. From any return's Overview tab, click a task that references a document, a message, *or a specific field* (most-specific link wins — "Finalize AGI calculation" jumps straight to the AGI field pre-selected on the review screen). You land there with a gold "← Back to [task]" banner and a real deep-linkable URL (`?field=...&fromLabel=...&fromHref=...`) — your place is never lost, and the same link works if bookmarked or shared.
- **Role-aware experience** — the same shell re-renders its global nav per active role. Permissions aren't just a label — inside a return, `ReturnTabs`/`ReturnShortcuts`/`ReturnTaskList`/`ReturnInsights` all filter by role from the same rule set: a seasonal preparer genuinely cannot reach a review action through *any* path (tab, shortcut card, task link, or an inline AI-insight button — verified all four independently), and a reviewer gets no Documents tab. A firm employee with their own personal return switches identity via the same account, and any list that could show both her staff and client rows labels the personal one explicitly so it never reads as a stray duplicate.
- **Status & progress** — one internal state machine (`STATUS_META`, 7 statuses), rendered two ways off the exact same data so client and staff can never drift apart. A compact `StatusPill` sits in every header/list row; the full `StatusProgress` panel answers where it is, what's next, who owns it, and whether it's blocked in one glance instead of a hover tooltip — 7 internal statuses collapse to 4 client-facing milestones so staff-only nuance never leaks into the client's mental model.
- **Actionable dashboard** — `/preparer`. Sorted by real logic: blocking first, then the nearest actual deadline, pulling in open-task urgency, not just the return's own headline status. Individual preparers get this scoped to their own clients; managers get a parallel firm-wide view at `/admin` with a staff workload panel showing who's actually carrying blocking work.
- **Clickable vs. editable** — `DataStateBadge`: one visual language (AI-suggested / verified / locked / needs-input) reused across three screens. "Locked" is clickable, not disabled — it explains *why* a value can't change instead of just refusing input. "Needs your input" is the one state that's genuinely editable — a real text input, not another clickable card.
- **Complexity at scale** — Rivera Consulting's return has **249 real mock documents**. Search, category filters, a newest-first sort, a summary/detail toggle, pagination, and a click-through detail panel are all wired against that actual dataset. Deep links into a specific document override the aggregate-summary default and the pagination window that would otherwise hide it.
- **Trustworthy AI** — `AIInsightCard`. Every insight shows what the "AI" found, a collapsible rationale, linked evidence, a confidence meter, and an accept/correct flow that resolves without leaving the page. The correction path is real, not a confirmation dressed up as one — one field is wired to come back with an actual different, explained value on recheck, and that correction updates the value shown, not just the explanation text.

---

## Stack

Next.js 16 (App Router) + TypeScript + Tailwind CSS v4, Framer Motion, `@faker-js/faker` for mock data generation.
