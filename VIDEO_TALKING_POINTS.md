# Video walkthrough — talking points

Not part of the submission itself — just a script to work from when recording. Aim for ~5-7 minutes, one continuous click-through rather than jumping around.

## Suggested order

1. **Land on the Preparer dashboard** (`/preparer`, logged in as Ayantika Nandi).
   - "This is ranked by what actually needs attention, not a static report — blocked-on-someone returns surface first, then by due date." Point out the "My returns" vs "All firm returns" toggle.

2. **Open Sarah Chen's return → Review & Traceability tab.**
   - Click the Wages field: "This is the sum of two W-2 Box 1 values — here's both source documents, the exact region, and the math." Click the AI-suggested dividend field, expand "Why did the AI say this?", then click "Something's off" to show the re-check flow resolving in place.
   - Point out the badge system: AI-suggested (dashed border), Verified (solid, checked), Locked (greyed, can't be edited — and why), Needs your input (amber). "Same visual language everywhere in the app, not just here."

3. **Overview tab → click a task linked to a document.**
   - Show the gold "← Back to [task]" banner and the URL. "Deep-linkable, and you never lose your place jumping between a task, a document, and a message."

4. **Rivera Consulting's Documents tab.**
   - "247 real mock documents." Show Summary view (category totals) vs Detail view, then search for a vendor, then a category filter. "This is what 'complexity at scale' needs to actually hold up against — not five demo rows."

5. **Messages tab (any return).**
   - Toggle Internal vs Client-visible. "Firm-only notes never leak to the client view, and every outstanding client-visible question shows up in this panel until it's resolved."

6. **Switch role to Client → Priya Nair** (brand-new client, via the account switcher top-right).
   - "Zero documents, zero messages — she sees exactly one thing to do." Contrast briefly with Sarah Chen's client view (richer status, "action needed" banner only when something's actually blocking).

7. **Switch to Ayantika Nandi's own "Client (My Return)" role.**
   - "Same account, two roles — this is how a firm employee who also has a personal return in the system stays one identity, not two logins."

8. **Reviewer and Admin, briefly** (10-15 seconds each).
   - Reviewer queue → click into a return, land on the exact same traceability screen preparers use. Admin → firm-wide status counts and staff list.

## If asked live about scope

- Two roles (Client, Preparer) got the full build; Reviewer/Admin are adapted views of the same shell, not separate products — say this proactively, it's a scoping decision, not an oversight.
- Everything AI-related is fabricated on purpose — say so before anyone asks. The point was showing how to present AI output and build trust around it, not standing up a real model.
- No backend/database — all state is in-memory mock data; uploads and sent messages update local state only and don't survive a refresh.
