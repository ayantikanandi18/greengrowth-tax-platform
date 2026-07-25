"use client";

import Link from "next/link";
import { CLIENTS, RETURNS, STATUS_META, USERS, clientDisplayName, ownerDisplay, rankReturnsByUrgency, returnUrgency } from "@/lib/mock/data";
import PageHeader from "@/components/PageHeader";
import StatusPill from "@/components/StatusPill";

const STATUS_ORDER = Object.keys(STATUS_META) as (keyof typeof STATUS_META)[];

export default function AdminOverview() {
  const staff = USERS.filter((u) => u.roles.some((r) => r !== "client"));
  const counts = STATUS_ORDER.map((status) => ({
    status,
    count: RETURNS.filter((r) => r.status === status).length,
  }));

  // A manager's version of "what to work on next" isn't their own queue —
  // it's the firm's, so they can see what's stuck before a client calls
  // asking why. Same ranking logic as the preparer dashboard, same data.
  const ranked = rankReturnsByUrgency(RETURNS);
  const blockingReturnIds = new Set(RETURNS.filter((r) => returnUrgency(r).blocking).map((r) => r.id));

  return (
    <div>
      <PageHeader title="Firm Overview" subtitle={`${CLIENTS.length} clients · ${staff.length} staff accounts`} />
      <div className="p-8 space-y-6">
        <section className="card p-5">
          <h2 className="text-sm font-semibold mb-3">Returns by status, firm-wide</h2>
          <div className="grid grid-cols-7 gap-3">
            {counts.map(({ status, count }) => (
              <div key={status} className="text-center">
                <div className="text-2xl font-semibold">{count}</div>
                <div className="text-[11px] text-ink-muted mt-1 leading-tight">{STATUS_META[status].staffLabel}</div>
              </div>
            ))}
          </div>
        </section>

        <section className="card p-5">
          <h2 className="text-sm font-semibold mb-3">Staff workload</h2>
          <div className="divide-y divide-border -mx-5">
            {staff.map((u) => {
              const assigned = RETURNS.filter((r) => CLIENTS.find((c) => c.id === r.clientId)?.assignedPreparerId === u.id);
              const blockingCount = assigned.filter((r) => blockingReturnIds.has(r.id)).length;
              return (
                <div key={u.id} className="flex items-center gap-3 px-5 py-2.5">
                  <span className="h-8 w-8 rounded-full bg-navy/10 text-navy flex items-center justify-center text-xs font-semibold">
                    {u.initials}
                  </span>
                  <div className="flex-1">
                    <div className="text-sm font-medium">{u.name}</div>
                    <div className="text-xs text-ink-muted">{u.title}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-xs text-ink-muted">{assigned.length} returns</div>
                    {blockingCount > 0 && (
                      <div className="text-[11px] text-warning font-medium">{blockingCount} blocking</div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        <section className="card overflow-hidden">
          <div className="px-5 py-3 border-b border-border text-sm font-semibold">Needs attention, firm-wide</div>
          <div className="text-xs text-ink-muted px-5 pt-3 -mb-1">
            Ranked the same way an individual preparer&apos;s queue is — blocking first, then nearest deadline (return or task).
          </div>
          <div className="divide-y divide-border">
            {ranked.map((r) => {
              const u = returnUrgency(r);
              const preparer = USERS.find((s) => s.id === CLIENTS.find((c) => c.id === r.clientId)?.assignedPreparerId);
              return (
                <Link
                  key={r.id}
                  href={`/preparer/returns/${r.id}`}
                  className="flex items-center gap-4 px-5 py-3 hover:bg-surface-sunken transition-colors"
                >
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium">{clientDisplayName(r.clientId)}</div>
                    <div className="text-xs text-ink-muted">
                      {preparer?.name ?? "Unassigned"}
                      {u.blocking && ` · waiting on ${ownerDisplay(u.ownerRole, "staff")}`}
                    </div>
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
