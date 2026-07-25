"use client";

import Link from "next/link";
import { useRole } from "@/lib/context/RoleContext";
import { clientDisplayName, getFieldsForReturn, getReturnsForReviewer, getTasksForReturn, type FieldDataState } from "@/lib/mock/data";
import DataStateBadge from "@/components/DataStateBadge";
import PageHeader from "@/components/PageHeader";
import StatusPill from "@/components/StatusPill";

export default function ReviewerQueue() {
  const { currentUser } = useRole();
  const returns = getReturnsForReviewer(currentUser.id);

  return (
    <div>
      <PageHeader title="Review Queue" subtitle="Returns waiting on your final sign-off." />
      <div className="p-8">
        <div className="card divide-y divide-border">
          {returns.map((r) => {
            const reviewerTasks = getTasksForReturn(r.id).filter((t) => t.ownerRole === "reviewer" && t.status === "open");
            // Same Clickable-vs-Editable badge language a preparer sees on
            // the return itself — a reviewer deciding what to open next
            // shouldn't have to click in just to find out how much is
            // still AI-suggested vs. already verified.
            const stateCounts = getFieldsForReturn(r.id).reduce(
              (acc, f) => ({ ...acc, [f.dataState]: (acc[f.dataState] ?? 0) + 1 }),
              {} as Partial<Record<FieldDataState, number>>,
            );
            return (
              <Link
                key={r.id}
                href={`/preparer/returns/${r.id}/review`}
                className="flex items-center gap-4 px-5 py-4 hover:bg-surface-sunken transition-colors"
              >
                <div className="flex-1">
                  <div className="text-sm font-medium">{clientDisplayName(r.clientId)}</div>
                  <div className="text-xs text-ink-muted">
                    {r.taxYear} {r.formType}
                    {reviewerTasks.length > 0 && ` · ${reviewerTasks.length} item(s) need your input`}
                  </div>
                  {Object.keys(stateCounts).length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mt-2">
                      {(Object.keys(stateCounts) as FieldDataState[]).map((state) => (
                        <div key={state} className="flex items-center gap-1">
                          <DataStateBadge state={state} />
                          <span className="text-xs text-ink-muted">×{stateCounts[state]}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                <StatusPill status={r.status} audience="staff" />
              </Link>
            );
          })}
          {returns.length === 0 && (
            <div className="px-5 py-10 text-center text-sm text-ink-muted">Nothing in your review queue.</div>
          )}
        </div>
      </div>
    </div>
  );
}
