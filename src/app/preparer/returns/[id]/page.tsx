import {
  getDocumentsForReturn,
  getFieldsForReturn,
  getInsightsForReturn,
  getMessagesForReturn,
  getReturn,
  getTasksForReturn,
  rankTasksByUrgency,
} from "@/lib/mock/data";
import StatusProgress from "@/components/StatusProgress";
import ReturnInsights from "./ReturnInsights";
import ReturnShortcuts from "./ReturnShortcuts";
import ReturnTaskList from "./ReturnTaskList";
import { notFound } from "next/navigation";

export default async function ReturnOverview({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const taxReturn = getReturn(id);
  if (!taxReturn) notFound();

  const tasks = getTasksForReturn(id);
  const openTasks = rankTasksByUrgency(tasks.filter((t) => t.status === "open"));
  const documents = getDocumentsForReturn(id);
  const messages = getMessagesForReturn(id);
  const fields = getFieldsForReturn(id);
  const insights = getInsightsForReturn(id).filter((i) => i.status === "pending").slice(0, 2);

  return (
    <div className="p-8 space-y-6">
      <StatusProgress status={taxReturn.status} audience="staff" updatedAt={taxReturn.updatedAt} />

      <div className="grid grid-cols-3 gap-6">
        <div className="col-span-2 space-y-6">
          <section className="card p-5">
            <h2 className="text-sm font-semibold mb-1">Open tasks</h2>
            <p className="text-xs text-ink-muted mb-2">
              Deep-linked to their source — clicking one takes you straight there and back.
            </p>
            <ReturnTaskList tasks={openTasks} returnId={id} />
          </section>

          <ReturnInsights insights={insights} />
        </div>

        <ReturnShortcuts returnId={id} documentsCount={documents.length} messagesCount={messages.length} fields={fields} />
      </div>
    </div>
  );
}
