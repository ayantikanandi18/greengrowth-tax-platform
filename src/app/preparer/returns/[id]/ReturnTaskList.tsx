"use client";

import { useRole } from "@/lib/context/RoleContext";
import TaskList from "@/components/TaskList";
import type { Task } from "@/lib/mock/types";

export default function ReturnTaskList({ tasks, returnId }: { tasks: Task[]; returnId: string }) {
  const { activeRole, currentUser } = useRole();
  const canReview = activeRole !== "preparer" || !currentUser.seasonal;

  return (
    <TaskList
      tasks={tasks}
      returnHref={(task) => {
        const from = `&fromLabel=${encodeURIComponent(task.title)}&fromHref=/preparer/returns/${returnId}`;
        // Most-specific link wins: a task about one exact field goes
        // straight to that field on the review screen, ahead of a more
        // general document or message link — but never past a permission
        // boundary the tabs/shortcuts already enforce.
        if (task.linkedFieldId && canReview) {
          return `/preparer/returns/${returnId}/review?field=${task.linkedFieldId}${from}`;
        }
        if (task.linkedDocumentId) {
          return `/preparer/returns/${returnId}/documents?highlight=${task.linkedDocumentId}${from}`;
        }
        if (task.linkedMessageId) {
          return `/preparer/returns/${returnId}/messages?${from.slice(1)}`;
        }
        return canReview ? `/preparer/returns/${returnId}/review` : `/preparer/returns/${returnId}`;
      }}
      emptyLabel="No open tasks on this return."
    />
  );
}
