import Link from "next/link";
import { NOW } from "@/lib/mock/data";
import type { Task } from "@/lib/mock/types";

const PRIORITY_DOT: Record<Task["priority"], string> = {
  high: "bg-critical",
  medium: "bg-warning",
  low: "bg-ink-muted",
};

function formatDue(dateIso: string) {
  const days = Math.round((new Date(dateIso).getTime() - NOW.getTime()) / 86400000);
  if (days < 0) return { text: `${Math.abs(days)}d overdue`, urgent: true };
  if (days === 0) return { text: "Due today", urgent: true };
  if (days <= 3) return { text: `Due in ${days}d`, urgent: true };
  return { text: `Due in ${days}d`, urgent: false };
}

export default function TaskList({
  tasks,
  returnHref,
  emptyLabel = "Nothing here.",
}: {
  tasks: Task[];
  returnHref?: (task: Task) => string;
  emptyLabel?: string;
}) {
  if (tasks.length === 0) {
    return <div className="text-sm text-ink-muted py-6 text-center">{emptyLabel}</div>;
  }

  return (
    <div className="divide-y divide-border">
      {tasks.map((task) => {
        const due = formatDue(task.dueDate);
        const content = (
          <div className="flex items-start gap-3 py-3">
            <span className={`mt-1.5 h-2 w-2 rounded-full shrink-0 ${PRIORITY_DOT[task.priority]}`} />
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className="font-medium text-sm">{task.title}</span>
                {task.blocking && (
                  <span className="text-[10px] uppercase tracking-wide bg-critical-soft text-critical px-1.5 py-0.5 rounded">
                    Blocking
                  </span>
                )}
              </div>
              <p className="text-xs text-ink-muted mt-0.5">{task.description}</p>
            </div>
            <span className={`text-xs whitespace-nowrap ${due.urgent ? "text-critical font-medium" : "text-ink-muted"}`}>
              {due.text}
            </span>
          </div>
        );

        return returnHref ? (
          <Link key={task.id} href={returnHref(task)} className="block px-1 hover:bg-surface-sunken -mx-1 rounded-md transition-colors">
            {content}
          </Link>
        ) : (
          <div key={task.id}>{content}</div>
        );
      })}
    </div>
  );
}
