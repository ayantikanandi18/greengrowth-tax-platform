"use client";

import { use, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { getDocumentsForReturn } from "@/lib/mock/data";
import type { DocumentCategory } from "@/lib/mock/types";
import BackToBanner from "@/components/BackToBanner";
import { IconFile, IconSearch } from "@/components/icons";

const CATEGORIES: (DocumentCategory | "All")[] = [
  "All",
  "Business Expenses",
  "Income",
  "Deductions",
  "Correspondence",
];

const PAGE_SIZE = 40;

export default function ReturnDocuments({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const searchParams = useSearchParams();
  const highlightId = searchParams.get("highlight");

  const allDocs = useMemo(() => getDocumentsForReturn(id), [id]);
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<(typeof CATEGORIES)[number]>("All");
  const [visible, setVisible] = useState(PAGE_SIZE);
  const [summaryView, setSummaryView] = useState(allDocs.length > 30);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return allDocs.filter((d) => {
      if (category !== "All" && d.category !== category) return false;
      if (!q) return true;
      return d.name.toLowerCase().includes(q) || d.vendor?.toLowerCase().includes(q) || d.docType.toLowerCase().includes(q);
    });
  }, [allDocs, query, category]);

  const byCategory = useMemo(() => {
    const map = new Map<string, number>();
    for (const d of allDocs) map.set(d.category, (map.get(d.category) ?? 0) + 1);
    return map;
  }, [allDocs]);

  return (
    <div>
      <BackToBanner />

      <div className="p-8">
        <div className="flex items-center gap-3 mb-4">
          <div className="relative flex-1 max-w-sm">
            <IconSearch className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-ink-muted" />
            <input
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setVisible(PAGE_SIZE);
              }}
              placeholder="Search by name, vendor, or type…"
              className="w-full rounded-lg border border-border pl-9 pr-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-navy/20"
            />
          </div>
          <div className="flex rounded-lg border border-border overflow-hidden text-sm shrink-0">
            <button
              onClick={() => setSummaryView(true)}
              className={`px-3 py-2 ${summaryView ? "bg-navy text-white" : "hover:bg-surface-sunken"}`}
            >
              Summary
            </button>
            <button
              onClick={() => setSummaryView(false)}
              className={`px-3 py-2 ${!summaryView ? "bg-navy text-white" : "hover:bg-surface-sunken"}`}
            >
              Detail
            </button>
          </div>
          <div className="text-sm text-ink-muted shrink-0">{allDocs.length} documents total</div>
        </div>

        <div className="flex gap-2 mb-5">
          {CATEGORIES.map((c) => (
            <button
              key={c}
              onClick={() => {
                setCategory(c);
                setVisible(PAGE_SIZE);
              }}
              className={`rounded-full border px-3 py-1 text-xs font-medium transition-colors ${
                category === c ? "bg-navy text-white border-navy" : "border-border hover:bg-surface-sunken"
              }`}
            >
              {c}
              {c !== "All" && <span className="ml-1 text-[10px] opacity-70">({byCategory.get(c) ?? 0})</span>}
            </button>
          ))}
        </div>

        {summaryView ? (
          <div className="grid grid-cols-2 gap-4">
            {CATEGORIES.filter((c) => c !== "All").map((c) => {
              const docsInCat = allDocs.filter((d) => d.category === c);
              const total = docsInCat.reduce((s, d) => s + (d.amount ?? 0), 0);
              return (
                <button
                  key={c}
                  onClick={() => {
                    setCategory(c);
                    setSummaryView(false);
                  }}
                  className="card p-4 text-left hover:border-border-strong transition-colors"
                >
                  <div className="text-sm font-medium">{c}</div>
                  <div className="text-2xl font-semibold mt-1">{docsInCat.length}</div>
                  {total > 0 && (
                    <div className="text-xs text-ink-muted mt-1">${total.toLocaleString()} total</div>
                  )}
                </button>
              );
            })}
          </div>
        ) : (
          <div className="card divide-y divide-border">
            {filtered.slice(0, visible).map((doc) => (
              <div
                key={doc.id}
                className={`flex items-center gap-3 px-4 py-2.5 ${
                  doc.id === highlightId ? "bg-gold-soft" : ""
                }`}
              >
                <IconFile className="h-4 w-4 text-ink-secondary shrink-0" />
                <div className="flex-1 min-w-0">
                  <div className="text-sm truncate">{doc.name}</div>
                </div>
                <span className="text-xs text-ink-muted shrink-0">{doc.category}</span>
                {doc.amount !== undefined && (
                  <span className="text-xs font-medium w-20 text-right shrink-0">${doc.amount.toLocaleString()}</span>
                )}
                <span className="text-xs text-ink-muted w-24 text-right shrink-0">
                  {new Date(doc.uploadedAt).toLocaleDateString()}
                </span>
              </div>
            ))}
            {filtered.length === 0 && (
              <div className="px-4 py-10 text-center text-sm text-ink-muted">No documents match.</div>
            )}
            {filtered.length > visible && (
              <button
                onClick={() => setVisible((v) => v + PAGE_SIZE)}
                className="w-full py-3 text-sm text-navy hover:bg-surface-sunken transition-colors"
              >
                Show {Math.min(PAGE_SIZE, filtered.length - visible)} more (of {filtered.length} matching)
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
