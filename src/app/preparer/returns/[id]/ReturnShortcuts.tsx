"use client";

import Link from "next/link";
import { useRole } from "@/lib/context/RoleContext";
import DataStateBadge from "@/components/DataStateBadge";
import type { ExtractedField, FieldDataState } from "@/lib/mock/data";

export default function ReturnShortcuts({
  returnId,
  documentsCount,
  messagesCount,
  fields,
}: {
  returnId: string;
  documentsCount: number;
  messagesCount: number;
  fields: ExtractedField[];
}) {
  const { activeRole, currentUser } = useRole();
  const base = `/preparer/returns/${returnId}`;

  // Same Clickable-vs-Editable badge language as the Review tab, one level
  // up — a preparer can see which states are still in play here without
  // having to open the field-by-field screen just to find out.
  const stateCounts = fields.reduce(
    (acc, f) => ({ ...acc, [f.dataState]: (acc[f.dataState] ?? 0) + 1 }),
    {} as Partial<Record<FieldDataState, number>>,
  );

  // Same role rules as ReturnTabs — a shortcut card here would otherwise
  // reopen a door the tabs just closed.
  const canReview = activeRole !== "preparer" || !currentUser.seasonal;
  const canSeeDocuments = activeRole === "preparer" || activeRole === "admin";

  return (
    <div className="space-y-4">
      {canSeeDocuments && (
        <Link href={`${base}/documents`} className="card p-4 flex items-center justify-between hover:border-border-strong transition-colors">
          <span className="text-sm font-medium">Documents</span>
          <span className="text-sm text-ink-muted">{documentsCount}</span>
        </Link>
      )}
      <Link href={`${base}/messages`} className="card p-4 flex items-center justify-between hover:border-border-strong transition-colors">
        <span className="text-sm font-medium">Messages</span>
        <span className="text-sm text-ink-muted">{messagesCount}</span>
      </Link>
      {canReview && (
        <Link href={`${base}/review`} className="card p-4 hover:border-border-strong transition-colors">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Review & Traceability</span>
            <span className="text-sm text-ink-muted">→</span>
          </div>
          {fields.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mt-2.5">
              {(Object.keys(stateCounts) as FieldDataState[]).map((state) => (
                <div key={state} className="flex items-center gap-1">
                  <DataStateBadge state={state} />
                  <span className="text-xs text-ink-muted">×{stateCounts[state]}</span>
                </div>
              ))}
            </div>
          )}
        </Link>
      )}
    </div>
  );
}
