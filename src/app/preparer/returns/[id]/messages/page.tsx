"use client";

import { use, useState } from "react";
import Link from "next/link";
import { getDocument, getMessagesForReturn, getTask } from "@/lib/mock/data";
import type { Message } from "@/lib/mock/types";
import BackToBanner from "@/components/BackToBanner";
import { useRole } from "@/lib/context/RoleContext";

export default function ReturnMessages({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { currentUser } = useRole();
  const [extra, setExtra] = useState<Message[]>([]);
  const [draft, setDraft] = useState("");
  const [visibility, setVisibility] = useState<"client" | "internal">("client");
  const [resolvedSubjects, setResolvedSubjects] = useState<Set<string>>(new Set());

  const messages = [...getMessagesForReturn(id), ...extra].sort(
    (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
  );
  const filtered = messages.filter((m) => m.visibility === visibility);

  // Challenge 02 — "outstanding requests" and "who owns the next action" only
  // mean something at the thread level, not the individual message: group
  // client-visible messages by subject, and for each thread still open,
  // whoever sent the *last* message is the one NOT holding the ball.
  const threadsBySubject = new Map<string, Message[]>();
  for (const m of messages.filter((m) => m.visibility === "client")) {
    if (!threadsBySubject.has(m.subject)) threadsBySubject.set(m.subject, []);
    threadsBySubject.get(m.subject)!.push(m);
  }
  const clientThreads = [...threadsBySubject.entries()]
    .map(([subject, msgs]) => {
      const last = [...msgs].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())[0];
      return { subject, last, waitingOn: last.authorRole === "client" ? "preparer" : "client" };
    })
    .filter((t) => !resolvedSubjects.has(t.subject));

  function send() {
    if (!draft.trim()) return;
    setExtra((prev) => [
      ...prev,
      {
        id: `m-preparer-${prev.length}`,
        returnId: id,
        subject: "Note",
        visibility,
        authorId: currentUser.id,
        authorName: currentUser.name,
        authorRole: "preparer",
        body: draft.trim(),
        createdAt: new Date().toISOString(),
        resolved: false,
      },
    ]);
    setDraft("");
  }

  function resolve(subject: string) {
    setResolvedSubjects((prev) => new Set(prev).add(subject));
  }

  return (
    <div>
      <BackToBanner />
      <div className="p-8 grid grid-cols-3 gap-6">
        <div className="col-span-2">
          <div className="flex rounded-lg border border-border overflow-hidden text-sm w-fit mb-4">
            <button
              onClick={() => setVisibility("client")}
              className={`px-4 py-2 ${visibility === "client" ? "bg-navy text-white" : "hover:bg-surface-sunken"}`}
            >
              Client-visible
            </button>
            <button
              onClick={() => setVisibility("internal")}
              className={`px-4 py-2 ${visibility === "internal" ? "bg-navy text-white" : "hover:bg-surface-sunken"}`}
            >
              Internal (firm only)
            </button>
          </div>

          <div className="card flex flex-col h-[460px]">
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {filtered.length === 0 && (
                <div className="text-sm text-ink-muted text-center py-10">
                  No {visibility === "internal" ? "internal notes" : "client messages"} yet.
                </div>
              )}
              {filtered.map((m) => {
                const linkedDoc = m.linkedDocumentId ? getDocument(m.linkedDocumentId) : null;
                const linkedTask = m.linkedTaskId ? getTask(m.linkedTaskId) : null;
                return (
                  <div key={m.id} className={`rounded-lg p-3 ${visibility === "internal" ? "bg-warning-soft" : "bg-surface-sunken"}`}>
                    <div className="flex items-center justify-between text-xs text-ink-muted mb-1">
                      <span className="font-medium text-ink-secondary">{m.authorName}</span>
                      <span>{new Date(m.createdAt).toLocaleDateString()}</span>
                    </div>
                    <div className="text-sm">{m.body}</div>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {linkedDoc && (
                        <Link
                          href={`/preparer/returns/${id}/documents?highlight=${linkedDoc.id}&fromLabel=${encodeURIComponent(m.subject)}&fromHref=/preparer/returns/${id}/messages`}
                          className="inline-flex items-center gap-1 text-xs bg-surface border border-border rounded-md px-2 py-1 hover:border-border-strong transition-colors"
                        >
                          📎 {linkedDoc.name}
                        </Link>
                      )}
                      {linkedTask && (
                        <Link
                          href={`/preparer/returns/${id}?fromLabel=${encodeURIComponent(m.subject)}&fromHref=/preparer/returns/${id}/messages`}
                          className="inline-flex items-center gap-1 text-xs bg-surface border border-border rounded-md px-2 py-1 hover:border-border-strong transition-colors"
                        >
                          ✓ {linkedTask.title}
                        </Link>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="border-t border-border p-3 flex gap-2">
              <input
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && send()}
                placeholder={visibility === "internal" ? "Add an internal note…" : "Message the client…"}
                className="flex-1 rounded-lg border border-border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-navy/20"
              />
              <button onClick={send} className="bg-navy text-white text-sm font-medium px-4 rounded-lg hover:bg-navy-strong transition-colors">
                Send
              </button>
            </div>
          </div>
        </div>

        <div className="card p-4">
          <h3 className="text-sm font-semibold mb-2">Outstanding requests</h3>
          <p className="text-xs text-ink-muted mb-3">Client-visible threads still waiting on someone.</p>
          <div className="space-y-2">
            {clientThreads.length === 0 && <div className="text-xs text-ink-muted">None open.</div>}
            {clientThreads.map((t) => (
              <div key={t.subject} className="text-xs border border-border rounded-md p-2.5">
                <div className="flex items-center justify-between gap-2 mb-1">
                  <span className="font-medium">{t.subject}</span>
                  <span
                    className={`shrink-0 px-1.5 py-0.5 rounded-full text-[10px] font-medium ${
                      t.waitingOn === "preparer" ? "bg-warning-soft text-warning" : "bg-info-soft text-info"
                    }`}
                  >
                    Waiting on {t.waitingOn === "preparer" ? "you" : "client"}
                  </span>
                </div>
                <div className="text-ink-muted truncate mb-2">{t.last.body}</div>
                <button
                  onClick={() => resolve(t.subject)}
                  className="text-[11px] font-medium text-navy hover:underline"
                >
                  Mark resolved
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
