import Link from "next/link";
import {
  getDocumentsForReturn,
  getInsightsForReturn,
  getMessagesForReturn,
  getReturn,
  getTasksForReturn,
} from "@/lib/mock/data";
import TaskList from "@/components/TaskList";
import AIInsightCard from "@/components/AIInsightCard";
import { notFound } from "next/navigation";

export default async function ReturnOverview({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const taxReturn = getReturn(id);
  if (!taxReturn) notFound();

  const tasks = getTasksForReturn(id);
  const openTasks = tasks.filter((t) => t.status === "open");
  const documents = getDocumentsForReturn(id);
  const messages = getMessagesForReturn(id);
  const insights = getInsightsForReturn(id).filter((i) => i.status === "pending").slice(0, 2);

  return (
    <div className="p-8 grid grid-cols-3 gap-6">
      <div className="col-span-2 space-y-6">
        <section className="card p-5">
          <h2 className="text-sm font-semibold mb-1">Open tasks</h2>
          <p className="text-xs text-ink-muted mb-2">
            Deep-linked to their source — clicking one takes you straight there and back.
          </p>
          <TaskList
            tasks={openTasks}
            returnHref={(task) => {
              if (task.linkedDocumentId) {
                return `/preparer/returns/${id}/documents?highlight=${task.linkedDocumentId}&fromLabel=${encodeURIComponent(task.title)}&fromHref=/preparer/returns/${id}`;
              }
              if (task.linkedMessageId) {
                return `/preparer/returns/${id}/messages?fromLabel=${encodeURIComponent(task.title)}&fromHref=/preparer/returns/${id}`;
              }
              return `/preparer/returns/${id}/review`;
            }}
            emptyLabel="No open tasks on this return."
          />
        </section>

        {insights.length > 0 && (
          <section>
            <h2 className="text-sm font-semibold mb-2">AI insights needing a look</h2>
            <div className="space-y-3">
              {insights.map((insight) => (
                <AIInsightCard key={insight.id} insight={insight} />
              ))}
            </div>
          </section>
        )}
      </div>

      <div className="space-y-4">
        <Link href={`/preparer/returns/${id}/documents`} className="card p-4 flex items-center justify-between hover:border-border-strong transition-colors">
          <span className="text-sm font-medium">Documents</span>
          <span className="text-sm text-ink-muted">{documents.length}</span>
        </Link>
        <Link href={`/preparer/returns/${id}/messages`} className="card p-4 flex items-center justify-between hover:border-border-strong transition-colors">
          <span className="text-sm font-medium">Messages</span>
          <span className="text-sm text-ink-muted">{messages.length}</span>
        </Link>
        <Link href={`/preparer/returns/${id}/review`} className="card p-4 flex items-center justify-between hover:border-border-strong transition-colors">
          <span className="text-sm font-medium">Review & Traceability</span>
          <span className="text-sm text-ink-muted">→</span>
        </Link>
      </div>
    </div>
  );
}
