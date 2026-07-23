"use client";

import Link from "next/link";
import { CLIENTS, RETURNS, STATUS_META, USERS, clientDisplayName } from "@/lib/mock/data";
import PageHeader from "@/components/PageHeader";
import StatusPill from "@/components/StatusPill";

const STATUS_ORDER = Object.keys(STATUS_META) as (keyof typeof STATUS_META)[];

export default function AdminOverview() {
  const staff = USERS.filter((u) => u.roles.some((r) => r !== "client"));
  const counts = STATUS_ORDER.map((status) => ({
    status,
    count: RETURNS.filter((r) => r.status === status).length,
  }));

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
          <h2 className="text-sm font-semibold mb-3">Staff</h2>
          <div className="divide-y divide-border -mx-5">
            {staff.map((u) => (
              <div key={u.id} className="flex items-center gap-3 px-5 py-2.5">
                <span className="h-8 w-8 rounded-full bg-navy/10 text-navy flex items-center justify-center text-xs font-semibold">
                  {u.initials}
                </span>
                <div className="flex-1">
                  <div className="text-sm font-medium">{u.name}</div>
                  <div className="text-xs text-ink-muted">{u.title}</div>
                </div>
                <div className="text-xs text-ink-muted">
                  {RETURNS.filter((r) => CLIENTS.find((c) => c.id === r.clientId)?.assignedPreparerId === u.id).length} returns
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="card overflow-hidden">
          <div className="px-5 py-3 border-b border-border text-sm font-semibold">All returns</div>
          <div className="divide-y divide-border">
            {RETURNS.map((r) => (
              <Link key={r.id} href={`/preparer/returns/${r.id}`} className="flex items-center gap-4 px-5 py-3 hover:bg-surface-sunken transition-colors">
                <div className="flex-1 text-sm">{clientDisplayName(r.clientId)}</div>
                <StatusPill status={r.status} audience="staff" />
              </Link>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
