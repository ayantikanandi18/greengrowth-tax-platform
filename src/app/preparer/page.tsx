"use client";

import { useState } from "react";
import Link from "next/link";
import { useRole } from "@/lib/context/RoleContext";
import {
  CLIENTS,
  NOW,
  RETURNS,
  clientDisplayName,
  getReturnsForPreparer,
  ownerDisplay,
  rankReturnsByUrgency,
  returnUrgency,
} from "@/lib/mock/data";
import PageHeader from "@/components/PageHeader";
import StatusPill from "@/components/StatusPill";

export default function PreparerDashboard() {
  const { currentUser } = useRole();
  const [scope, setScope] = useState<"mine" | "firm">("mine");
  const [showBlockingOnly, setShowBlockingOnly] = useState(false);
  const [search, setSearch] = useState("");

  const scoped = scope === "mine" ? getReturnsForPreparer(currentUser.id) : RETURNS;
  const urgency = new Map(scoped.map((r) => [r.id, returnUrgency(r)]));

  const blockingCount = scoped.filter((r) => urgency.get(r.id)!.blocking).length;
  const overdueCount = scoped.filter((r) => new Date(urgency.get(r.id)!.nextDueDate).getTime() < NOW.getTime()).length;
  const inReviewCount = scoped.filter((r) => r.status === "in_review").length;

  // Filters + search are the "stays usable at hundreds of returns" affordance:
  // the ranking below is real for 5 rows or 500 — the list itself just
  // needs a way to narrow down instead of scrolling past everything.
  const query = search.trim().toLowerCase();
  const filtered = scoped.filter((r) => {
    if (showBlockingOnly && !urgency.get(r.id)!.blocking) return false;
    if (query && !clientDisplayName(r.clientId).toLowerCase().includes(query)) return false;
    return true;
  });
  const ranked = rankReturnsByUrgency(filtered);

  return (
    <div>
      <PageHeader
        title="Dashboard"
        subtitle="Ranked by what actually needs attention — not a static report."
        actions={
          <div className="flex rounded-lg border border-border overflow-hidden text-sm">
            <button
              onClick={() => setScope("mine")}
              className={`px-3 py-1.5 ${scope === "mine" ? "bg-navy text-white" : "hover:bg-surface-sunken"}`}
            >
              My returns
            </button>
            <button
              onClick={() => setScope("firm")}
              className={`px-3 py-1.5 ${scope === "firm" ? "bg-navy text-white" : "hover:bg-surface-sunken"}`}
            >
              All firm returns
            </button>
          </div>
        }
      />

      <div className="p-8 space-y-6">
        <div className="grid grid-cols-4 gap-4">
          <button
            onClick={() => setShowBlockingOnly(false)}
            className={`card p-4 text-left transition-colors ${!showBlockingOnly ? "" : "hover:bg-surface-sunken"}`}
          >
            <div className="text-2xl font-semibold">{scoped.length}</div>
            <div className="text-sm text-ink-muted">Returns in scope</div>
          </button>
          <button
            onClick={() => setShowBlockingOnly((v) => !v)}
            className={`card p-4 text-left transition-colors ${showBlockingOnly ? "ring-2 ring-warning" : "hover:bg-surface-sunken"}`}
          >
            <div className="text-2xl font-semibold text-warning">{blockingCount}</div>
            <div className="text-sm text-ink-muted">Blocked on someone{showBlockingOnly ? " (shown below)" : " — click to filter"}</div>
          </button>
          <div className="card p-4">
            <div className="text-2xl font-semibold text-critical">{overdueCount}</div>
            <div className="text-sm text-ink-muted">Past due date</div>
          </div>
          <div className="card p-4">
            <div className="text-2xl font-semibold text-info">{inReviewCount}</div>
            <div className="text-sm text-ink-muted">In review</div>
          </div>
        </div>

        <section className="card overflow-hidden">
          <div className="flex items-center justify-between gap-4 px-5 py-3 border-b border-border">
            <span className="text-sm font-semibold">What to work on next</span>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by client…"
              className="text-sm border border-border rounded-md px-2.5 py-1 w-56 bg-surface focus:outline-none focus:ring-2 focus:ring-navy/30"
            />
          </div>
          <div className="divide-y divide-border">
            {ranked.map((r) => {
              const u = urgency.get(r.id)!;
              const client = CLIENTS.find((c) => c.id === r.clientId);
              const daysUntilDue = Math.round((new Date(u.nextDueDate).getTime() - NOW.getTime()) / 86400000);

              return (
                <Link
                  key={r.id}
                  href={`/preparer/returns/${r.id}`}
                  className="flex items-center gap-4 px-5 py-4 hover:bg-surface-sunken transition-colors"
                >
                  <span className="h-9 w-9 rounded-full bg-navy/10 text-navy flex items-center justify-center text-xs font-semibold shrink-0">
                    {(client?.entityName ?? client?.name ?? "?").slice(0, 2).toUpperCase()}
                  </span>
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-sm">{clientDisplayName(r.clientId)}</div>
                    <div className="text-xs text-ink-muted">
                      {r.taxYear} {r.formType} · {u.openTaskCount} open task{u.openTaskCount === 1 ? "" : "s"}
                      {u.blocking && ` · waiting on ${ownerDisplay(u.ownerRole, "staff")}`}
                    </div>
                  </div>
                  <div className={`text-xs whitespace-nowrap ${daysUntilDue < 7 ? "text-critical font-medium" : "text-ink-muted"}`}>
                    {daysUntilDue < 0 ? `${Math.abs(daysUntilDue)}d overdue` : `Due in ${daysUntilDue}d`}
                    {u.isTaskDriven && <span className="block text-[10px] text-ink-muted">from an open task</span>}
                  </div>
                  <StatusPill status={r.status} audience="staff" />
                </Link>
              );
            })}
            {ranked.length === 0 && (
              <div className="px-5 py-10 text-center text-sm text-ink-muted">
                Nothing matches {showBlockingOnly ? "the blocking filter" : "your search"}.
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
