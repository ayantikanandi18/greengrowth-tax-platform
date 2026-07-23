"use client";

import { useState } from "react";
import { requestAIRecheck } from "@/lib/mock/ai-stub";
import { getDocument, type AIInsight, type ExtractedField } from "@/lib/mock/data";
import { IconSparkle } from "./icons";

const TYPE_STYLES: Record<AIInsight["type"], { badge: string; label: string }> = {
  recommendation: { badge: "bg-info-soft text-info", label: "Recommendation" },
  warning: { badge: "bg-warning-soft text-warning", label: "Warning" },
  correction: { badge: "bg-critical-soft text-critical", label: "Possible correction" },
};

export default function AIInsightCard({ insight, field }: { insight: AIInsight; field?: ExtractedField }) {
  const [expanded, setExpanded] = useState(false);
  const [status, setStatus] = useState(insight.status);
  const [checking, setChecking] = useState(false);
  const [recheckNote, setRecheckNote] = useState<string | null>(null);

  const style = TYPE_STYLES[insight.type];

  async function handleRecheck() {
    if (!field) {
      setStatus("corrected");
      return;
    }
    setChecking(true);
    const result = await requestAIRecheck(field);
    setChecking(false);
    setRecheckNote(result.explanation);
    setStatus("corrected");
  }

  return (
    <div className="rounded-lg border border-border bg-surface p-4">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className="h-6 w-6 rounded-full bg-navy/10 text-navy flex items-center justify-center">
            <IconSparkle className="h-3.5 w-3.5" />
          </span>
          <span className={`text-[11px] font-medium px-2 py-0.5 rounded-full ${style.badge}`}>{style.label}</span>
        </div>
        <div className="flex items-center gap-1.5 text-xs text-ink-muted" title="How confident the AI is in this output">
          <div className="w-16 h-1.5 rounded-full bg-surface-sunken overflow-hidden">
            <div className="h-full bg-navy" style={{ width: `${insight.confidence * 100}%` }} />
          </div>
          {Math.round(insight.confidence * 100)}%
        </div>
      </div>

      <h3 className="font-medium text-sm mt-2.5">{insight.title}</h3>
      <p className="text-sm text-ink-secondary mt-1">{insight.message}</p>

      <button
        onClick={() => setExpanded((v) => !v)}
        className="text-xs text-navy hover:underline mt-2 font-medium"
      >
        {expanded ? "Hide reasoning" : "Why did the AI say this?"}
      </button>

      {expanded && (
        <div className="mt-2 rounded-md bg-surface-sunken p-3 text-xs space-y-2">
          <p className="text-ink-secondary">{insight.rationale}</p>
          {insight.evidence.length > 0 && (
            <div>
              <div className="text-ink-muted uppercase tracking-wide text-[10px] mb-1">Evidence</div>
              <ul className="space-y-1">
                {insight.evidence.map((e, i) => {
                  const doc = getDocument(e.documentId);
                  return (
                    <li key={i} className="text-ink-secondary">
                      • {doc ? doc.name : "Document"} — {e.note}
                    </li>
                  );
                })}
              </ul>
            </div>
          )}
        </div>
      )}

      {recheckNote && (
        <div className="mt-2 rounded-md bg-info-soft p-2.5 text-xs text-info">{recheckNote}</div>
      )}

      <div className="mt-3 flex items-center gap-2">
        {status === "pending" ? (
          <>
            <button
              onClick={() => setStatus("accepted")}
              className="text-xs font-medium px-3 py-1.5 rounded-md bg-navy text-white hover:bg-navy-strong transition-colors"
            >
              Looks right
            </button>
            <button
              onClick={handleRecheck}
              disabled={checking}
              className="text-xs font-medium px-3 py-1.5 rounded-md border border-border hover:bg-surface-sunken transition-colors disabled:opacity-60"
            >
              {checking ? "Re-checking…" : "Something's off"}
            </button>
          </>
        ) : (
          <span className="text-xs font-medium text-good flex items-center gap-1">
            {status === "accepted" && "✓ Marked as reviewed"}
            {status === "corrected" && "✓ Re-checked"}
            {status === "dismissed" && "Dismissed"}
          </span>
        )}
      </div>
    </div>
  );
}
