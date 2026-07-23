"use client";

import Link from "next/link";
import { useRole } from "@/lib/context/RoleContext";
import { CLIENTS, RETURNS, getReturnsForPreparer } from "@/lib/mock/data";
import PageHeader from "@/components/PageHeader";
import StatusPill from "@/components/StatusPill";

export default function ClientsList() {
  const { currentUser } = useRole();
  const returns = getReturnsForPreparer(currentUser.id);
  const returnIds = new Set(returns.map((r) => r.id));

  return (
    <div>
      <PageHeader title="Clients" subtitle={`${returns.length} clients assigned to you`} />
      <div className="p-8">
        <div className="card divide-y divide-border">
          {CLIENTS.filter((c) => RETURNS.some((r) => r.clientId === c.id && returnIds.has(r.id))).map((client) => {
            const r = RETURNS.find((r) => r.clientId === client.id)!;
            return (
              <Link
                key={client.id}
                href={`/preparer/returns/${r.id}`}
                className="flex items-center gap-4 px-5 py-4 hover:bg-surface-sunken transition-colors"
              >
                <span className="h-9 w-9 rounded-full bg-navy/10 text-navy flex items-center justify-center text-xs font-semibold">
                  {(client.entityName ?? client.name).slice(0, 2).toUpperCase()}
                </span>
                <div className="flex-1">
                  <div className="text-sm font-medium">{client.entityName ?? client.name}</div>
                  <div className="text-xs text-ink-muted">
                    {client.type === "business" ? `Contact: ${client.name}` : client.email}
                  </div>
                </div>
                <StatusPill status={r.status} audience="staff" />
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
