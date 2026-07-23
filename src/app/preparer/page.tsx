"use client";

import { useState } from "react";
import Link from "next/link";
import { useRole } from "@/lib/context/RoleContext";
import {
  CLIENTS,
  NOW,
  RETURNS,
  STATUS_META,
  clientDisplayName,
  getReturnsForPreparer,
  getTasksForReturn,
  rankReturnsByUrgency,
} from "@/lib/mock/data";
import PageHeader from "@/components/PageHeader";
import StatusPill from "@/components/StatusPill";

export default function PreparerDashboard() {
  const { currentUser } = useRole();
  const [scope, setScope] = useState<"mine" | "firm">("mine");

  const scoped = scope === "mine" ? getReturnsForPreparer(currentUser.id) : RETURNS;
  const ranked = rankReturnsByUrgency(scoped);

  const blockingCount = scoped.filter((r) => STATUS_META[r.status].blocking).length;
  const overdueCount = scoped.filter((r) => new Date(r.dueDate).getTime() < NOW.getTime()).length;
  const inReviewCount = scoped.filter((r) => r.status === "in_review").length;

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
          <div className="card p-4">
            <div className="text-2xl font-semibold">{scoped.length}</div>
            <div className="text-sm text-ink-muted">Returns in scope</div>
          </div>
          <div className="card p-4">
            <div className="text-2xl font-semibold text-warning">{blockingCount}</div>
            <div className="text-sm text-ink-muted">Blocked on someone</div>
          </div>
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
          <div className="px-5 py-3 border-b border-border text-sm font-semibold">What to work on next</div>
          <div className="divide-y divide-border">
            {ranked.map((r) => {
              const meta = STATUS_META[r.status];
              const openTasks = getTasksForReturn(r.id).filter((t) => t.status === "open");
              const client = CLIENTS.find((c) => c.id === r.clientId);
              const daysUntilDue = Math.round((new Date(r.dueDate).getTime() - NOW.getTime()) / 86400000);

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
                      {r.taxYear} {r.formType} · {openTasks.length} open task{openTasks.length === 1 ? "" : "s"}
                      {meta.blocking && ` · waiting on ${meta.ownerRole}`}
                    </div>
                  </div>
                  <div className={`text-xs whitespace-nowrap ${daysUntilDue < 7 ? "text-critical font-medium" : "text-ink-muted"}`}>
                    {daysUntilDue < 0 ? `${Math.abs(daysUntilDue)}d overdue` : `Due in ${daysUntilDue}d`}
                  </div>
                  <StatusPill status={r.status} audience="staff" />
                </Link>
              );
            })}
          </div>
        </section>
      </div>
    </div>
  );
}
