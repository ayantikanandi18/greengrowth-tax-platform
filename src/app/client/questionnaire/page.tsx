"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useRole } from "@/lib/context/RoleContext";
import { useQuestionnaireProgress } from "@/lib/context/QuestionnaireContext";
import { getClient, getQuestionnaireForClient } from "@/lib/mock/data";
import PageHeader from "@/components/PageHeader";
import { IconCheck } from "@/components/icons";

export default function ClientQuestionnaire() {
  const { currentUser } = useRole();
  const { sessionAnswers, submitAnswer } = useQuestionnaireProgress();
  const router = useRouter();
  const [drafts, setDrafts] = useState<Record<string, string>>({});

  const client = currentUser.clientId ? getClient(currentUser.clientId) : null;
  if (!client) return null;

  const items = getQuestionnaireForClient(client.id);
  const answeredCount = items.filter((q) => q.answer || sessionAnswers[q.id]).length;
  const allDone = answeredCount === items.length && items.length > 0;

  return (
    <div>
      <PageHeader
        title="Intake questionnaire"
        crumbs={[{ label: "My Return", href: "/client" }, { label: "Questionnaire" }]}
        subtitle={`${answeredCount} of ${items.length} answered`}
      />

      <div className="p-8 max-w-2xl mx-auto space-y-4">
        {items.map((item) => {
          const savedAnswer = item.answer || sessionAnswers[item.id];
          return (
            <div key={item.id} className="card p-5">
              <div className="flex items-start justify-between gap-3 mb-1">
                <h3 className="font-medium text-sm">{item.question}</h3>
                {savedAnswer && (
                  <span className="shrink-0 inline-flex items-center gap-1 text-xs text-good font-medium">
                    <IconCheck className="h-3.5 w-3.5" /> Answered
                  </span>
                )}
              </div>
              <p className="text-xs text-ink-muted mb-3">{item.helpText}</p>

              {savedAnswer ? (
                <div className="text-sm bg-surface-sunken rounded-md px-3 py-2">{savedAnswer}</div>
              ) : (
                <div className="flex gap-2">
                  <input
                    value={drafts[item.id] ?? ""}
                    onChange={(e) => setDrafts((prev) => ({ ...prev, [item.id]: e.target.value }))}
                    placeholder="Type your answer…"
                    className="flex-1 rounded-lg border border-border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-navy/20"
                  />
                  <button
                    onClick={() => drafts[item.id]?.trim() && submitAnswer(item.id, drafts[item.id].trim())}
                    className="bg-navy text-white text-sm font-medium px-4 rounded-lg hover:bg-navy-strong transition-colors"
                  >
                    Save
                  </button>
                </div>
              )}
            </div>
          );
        })}

        {allDone && (
          <div className="rounded-xl border border-good/30 bg-good-soft p-5 text-center">
            <div className="font-semibold text-good mb-1">All done — thank you!</div>
            <p className="text-sm text-ink-secondary mb-3">
              We can now tell you exactly which documents to upload next.
            </p>
            <button
              onClick={() => router.push("/client")}
              className="bg-navy text-white text-sm font-medium px-4 py-2 rounded-lg hover:bg-navy-strong transition-colors"
            >
              Back to my return
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
