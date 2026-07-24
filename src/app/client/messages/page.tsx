"use client";

import { useState } from "react";
import Link from "next/link";
import { useRole } from "@/lib/context/RoleContext";
import { getClient, getDocument, getMessagesForReturn, getReturnForClient, getTask } from "@/lib/mock/data";
import type { Message } from "@/lib/mock/types";
import PageHeader from "@/components/PageHeader";

export default function ClientMessages() {
  const { currentUser } = useRole();
  const client = currentUser.clientId ? getClient(currentUser.clientId) : null;
  const taxReturn = client ? getReturnForClient(client.id) : null;
  const [extra, setExtra] = useState<Message[]>([]);
  const [draft, setDraft] = useState("");

  if (!client || !taxReturn) return null;

  const messages = [...getMessagesForReturn(taxReturn.id).filter((m) => m.visibility === "client"), ...extra].sort(
    (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
  );

  function send() {
    if (!draft.trim()) return;
    setExtra((prev) => [
      ...prev,
      {
        id: `m-client-${prev.length}`,
        returnId: taxReturn!.id,
        subject: "New message",
        visibility: "client",
        authorId: currentUser.id,
        authorName: currentUser.name,
        authorRole: "client",
        body: draft.trim(),
        createdAt: new Date().toISOString(),
        resolved: false,
      },
    ]);
    setDraft("");
  }

  return (
    <div>
      <PageHeader title="Messages" crumbs={[{ label: "My Return", href: "/client" }, { label: "Messages" }]} />
      <div className="p-8 max-w-2xl mx-auto">
        <div className="card flex flex-col h-[520px]">
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {messages.length === 0 && (
              <div className="text-sm text-ink-muted text-center py-10">No messages yet.</div>
            )}
            {messages.map((m) => {
              const mine = m.authorId === currentUser.id;
              const linkedDoc = m.linkedDocumentId ? getDocument(m.linkedDocumentId) : null;
              const linkedTask = m.linkedTaskId ? getTask(m.linkedTaskId) : null;
              const chipClasses = `mt-2 inline-flex items-center gap-1 text-xs rounded-md px-2 py-1 ${
                mine ? "bg-white/15" : "bg-surface border border-border"
              }`;
              return (
                <div key={m.id} className={`flex ${mine ? "justify-end" : "justify-start"}`}>
                  <div className={`max-w-[80%] rounded-xl px-4 py-2.5 text-sm ${mine ? "bg-navy text-white" : "bg-surface-sunken"}`}>
                    {!mine && <div className="text-xs font-medium mb-0.5 opacity-70">{m.authorName}</div>}
                    {m.body}
                    <div className="flex flex-wrap gap-2">
                      {linkedDoc && (
                        <Link href="/client/documents" className={chipClasses}>
                          📎 {linkedDoc.name}
                        </Link>
                      )}
                      {linkedTask && (
                        <Link href="/client" className={chipClasses}>
                          ✓ {linkedTask.title}
                        </Link>
                      )}
                    </div>
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
              placeholder="Message your preparer…"
              className="flex-1 rounded-lg border border-border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-navy/30"
            />
            <button onClick={send} className="bg-navy text-white text-sm font-medium px-4 rounded-lg hover:bg-navy-strong transition-colors">
              Send
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
