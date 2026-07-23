"use client";

import Link from "next/link";
import { useRole } from "@/lib/context/RoleContext";
import {
  clientDisplayName,
  getClient,
  getDocumentsForReturn,
  getMessagesForReturn,
  getReturnForClient,
  getTasksForReturn,
} from "@/lib/mock/data";
import PageHeader from "@/components/PageHeader";
import StatusPill from "@/components/StatusPill";
import TaskList from "@/components/TaskList";

export default function ClientHome() {
  const { currentUser } = useRole();
  const client = currentUser.clientId ? getClient(currentUser.clientId) : null;
  const taxReturn = client ? getReturnForClient(client.id) : null;

  if (!client || !taxReturn) {
    return <div className="p-8 text-sm text-ink-muted">No client record found for this user.</div>;
  }

  const allTasks = getTasksForReturn(taxReturn.id);
  const myOpenTasks = allTasks.filter((t) => t.ownerRole === "client" && t.status === "open");
  const documents = getDocumentsForReturn(taxReturn.id);
  const messages = getMessagesForReturn(taxReturn.id).filter((m) => m.visibility === "client");
  const isBrandNew = documents.length === 0 && messages.length === 0;

  return (
    <div>
      <PageHeader
        title={isBrandNew ? `Welcome, ${client.name.split(" ")[0]}` : clientDisplayName(client.id)}
        subtitle={`${taxReturn.taxYear} · ${taxReturn.formType}`}
        actions={<StatusPill status={taxReturn.status} audience="client" />}
      />

      <div className="p-8 max-w-3xl mx-auto space-y-6">
        {isBrandNew ? (
          // Challenge 03 — brand-new client: exactly one clear next action, nothing else competing for attention.
          <div className="rounded-xl border border-navy/20 bg-navy text-white p-6">
            <div className="text-xs uppercase tracking-wide text-gold-soft/80 mb-2">Your next step</div>
            <h2 className="text-lg font-semibold mb-1">
              {myOpenTasks[0]?.title ?? "Complete your intake questionnaire"}
            </h2>
            <p className="text-sm text-white/80 mb-4">
              {myOpenTasks[0]?.description ??
                "This tells us what documents to request from you and lets us open your return."}
            </p>
            <Link
              href="/client/documents"
              className="inline-flex items-center gap-2 bg-gold text-navy-strong font-medium text-sm px-4 py-2 rounded-lg hover:brightness-110 transition"
            >
              Get started
            </Link>
          </div>
        ) : myOpenTasks.length > 0 ? (
          <div className="rounded-xl border border-warning/30 bg-warning-soft p-5">
            <div className="text-xs uppercase tracking-wide text-warning mb-1">Action needed</div>
            <h2 className="font-semibold text-warning">{myOpenTasks[0].title}</h2>
            <p className="text-sm text-ink-secondary mt-1">{myOpenTasks[0].description}</p>
          </div>
        ) : (
          <div className="rounded-xl border border-good/30 bg-good-soft p-5">
            <div className="text-xs uppercase tracking-wide text-good mb-1">You&apos;re all caught up</div>
            <p className="text-sm text-ink-secondary">
              Nothing is needed from you right now — we&apos;ll reach out if that changes.
            </p>
          </div>
        )}

        {myOpenTasks.length > 0 && (
          <section className="card p-5">
            <h3 className="text-sm font-semibold mb-1">Everything we need from you</h3>
            <TaskList tasks={myOpenTasks} />
          </section>
        )}

        <div className="grid grid-cols-2 gap-4">
          <Link href="/client/documents" className="card p-5 hover:border-border-strong transition-colors">
            <div className="text-2xl font-semibold">{documents.length}</div>
            <div className="text-sm text-ink-muted">Documents on file</div>
          </Link>
          <Link href="/client/messages" className="card p-5 hover:border-border-strong transition-colors">
            <div className="text-2xl font-semibold">{messages.length}</div>
            <div className="text-sm text-ink-muted">Messages with your preparer</div>
          </Link>
        </div>
      </div>
    </div>
  );
}
