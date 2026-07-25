"use client";

import { use, useState } from "react";
import { useSearchParams } from "next/navigation";
import { getDocument, getFieldsForReturn, getInsightsForReturn, type FieldDataState } from "@/lib/mock/data";
import DataStateBadge, { dataStateContainerClasses } from "@/components/DataStateBadge";
import DocumentViewer from "@/components/DocumentViewer";
import AIInsightCard from "@/components/AIInsightCard";
import BackToBanner from "@/components/BackToBanner";

export default function ReturnReview({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const searchParams = useSearchParams();
  const fields = getFieldsForReturn(id);

  // Challenge 04 — a task/message linking here (e.g. "Finalize AGI
  // calculation") should land the reader directly on that field, not
  // whatever field happens to be first in the list.
  const requestedFieldId = searchParams.get("field");
  const [selectedId, setSelectedId] = useState(
    () => (requestedFieldId && fields.some((f) => f.id === requestedFieldId) ? requestedFieldId : fields[0]?.id) ?? null,
  );
  const [sourceIndex, setSourceIndex] = useState(0);
  // A field starts as whatever it was seeded as, but approving its linked
  // AI insight below should visibly flip its badge to Verified — otherwise
  // "what requires approval" and "what has been verified" never connect.
  const [fieldOverrides, setFieldOverrides] = useState<Record<string, FieldDataState>>({});
  const selected = fields.find((f) => f.id === selectedId) ?? null;
  const insights = selected ? getInsightsForReturn(id).filter((i) => i.relatedFieldId === selected.id) : [];
  const activeSource = selected?.sources[sourceIndex] ?? null;

  function stateFor(fieldId: string, fallback: FieldDataState) {
    return fieldOverrides[fieldId] ?? fallback;
  }

  function selectField(fieldId: string) {
    setSelectedId(fieldId);
    setSourceIndex(0);
  }

  if (fields.length === 0) {
    return (
      <div className="p-8">
        <div className="rounded-lg border border-dashed border-border p-10 text-center text-sm text-ink-muted">
          This return hasn&apos;t reached field extraction yet — nothing to review.
        </div>
      </div>
    );
  }

  return (
    <div>
      <BackToBanner />
      <div className="grid grid-cols-2 h-[calc(100vh-9rem)]">
        <div className="border-r border-border overflow-y-auto p-5 space-y-2">
          <div className="text-xs uppercase tracking-wide text-ink-muted mb-2 px-1">
            Return fields — click any value to see where it came from
          </div>
          {fields.map((field) => {
            const state = stateFor(field.id, field.dataState);
            return (
              <button
                key={field.id}
                onClick={() => selectField(field.id)}
                className={`w-full text-left rounded-lg border-2 p-3.5 transition-colors ${dataStateContainerClasses(state)} ${
                  selectedId === field.id ? "ring-2 ring-navy/30" : ""
                }`}
              >
                <div className="flex items-center justify-between gap-2 mb-1">
                  <span className="text-xs text-ink-muted">{field.fieldLabel}</span>
                  <DataStateBadge state={state} />
                </div>
                <div className="text-lg font-semibold">{field.value}</div>
              </button>
            );
          })}
        </div>

        <div className="p-5 flex flex-col gap-4 overflow-y-auto">
          {selected && (
            <>
              <div>
                <div className="text-xs uppercase tracking-wide text-ink-muted mb-1">{selected.fieldLabel}</div>
                <div className="text-sm text-ink-secondary">{selected.transformation}</div>
              </div>

              {selected.sources.length > 1 && (
                <div className="flex gap-2 flex-wrap">
                  {selected.sources.map((source, i) => {
                    const doc = getDocument(source.documentId);
                    return (
                      <button
                        key={source.documentId}
                        onClick={() => setSourceIndex(i)}
                        className={`text-xs font-medium px-3 py-1.5 rounded-full border transition-colors ${
                          i === sourceIndex
                            ? "bg-navy text-white border-navy"
                            : "border-border hover:bg-surface-sunken"
                        }`}
                      >
                        {i + 1} of {selected.sources.length}: {doc?.name ?? "Document"}
                      </button>
                    );
                  })}
                </div>
              )}

              <div className="flex-1 min-h-[320px]">
                <DocumentViewer
                  document={activeSource ? getDocument(activeSource.documentId) : null}
                  page={activeSource?.page ?? null}
                  regionLabel={activeSource?.regionLabel ?? null}
                />
              </div>
              {insights.map((insight) => (
                <AIInsightCard
                  key={insight.id}
                  insight={insight}
                  field={selected}
                  onResolved={() => setFieldOverrides((prev) => ({ ...prev, [selected.id]: "verified" }))}
                />
              ))}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
