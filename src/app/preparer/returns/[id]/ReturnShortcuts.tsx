"use client";

import Link from "next/link";
import { useRole } from "@/lib/context/RoleContext";

export default function ReturnShortcuts({
  returnId,
  documentsCount,
  messagesCount,
}: {
  returnId: string;
  documentsCount: number;
  messagesCount: number;
}) {
  const { activeRole, currentUser } = useRole();
  const base = `/preparer/returns/${returnId}`;

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
        <Link href={`${base}/review`} className="card p-4 flex items-center justify-between hover:border-border-strong transition-colors">
          <span className="text-sm font-medium">Review & Traceability</span>
          <span className="text-sm text-ink-muted">→</span>
        </Link>
      )}
    </div>
  );
}
