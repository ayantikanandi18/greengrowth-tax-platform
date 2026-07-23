"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { ALL_DOCUMENTS, CLIENTS, TASKS } from "@/lib/mock/data";
import { IconSearch } from "./icons";

interface Hit {
  id: string;
  label: string;
  sub: string;
  href: string;
  group: "Clients" | "Documents" | "Tasks";
}

export default function CommandSearch() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const router = useRouter();

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen((v) => !v);
      }
      if (e.key === "Escape") setOpen(false);
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const hits: Hit[] = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (q.length < 1) return [];

    const clientHits: Hit[] = CLIENTS.filter(
      (c) => c.name.toLowerCase().includes(q) || c.entityName?.toLowerCase().includes(q),
    ).map((c) => ({
      id: c.id,
      label: c.entityName ?? c.name,
      sub: c.entityName ? `Client contact: ${c.name}` : "Individual client",
      href: `/preparer/returns/${c.id === "c-rivera" ? "r-rivera-2025" : c.id === "c-sarah" ? "r-sarah-2025" : c.id === "c-david" ? "r-david-2025" : c.id === "c-priya" ? "r-priya-2025" : "r-morgan-2025"}`,
      group: "Clients",
    }));

    const docHits: Hit[] = ALL_DOCUMENTS.filter(
      (d) => d.name.toLowerCase().includes(q) || d.vendor?.toLowerCase().includes(q),
    )
      .slice(0, 8)
      .map((d) => ({
        id: d.id,
        label: d.name,
        sub: `${d.docType} · ${d.category}`,
        href: `/preparer/returns/${d.returnId}/documents`,
        group: "Documents",
      }));

    const taskHits: Hit[] = TASKS.filter((t) => t.title.toLowerCase().includes(q))
      .slice(0, 6)
      .map((t) => ({
        id: t.id,
        label: t.title,
        sub: t.description,
        href: `/preparer/returns/${t.returnId}`,
        group: "Tasks",
      }));

    return [...clientHits, ...docHits, ...taskHits];
  }, [query]);

  const grouped = useMemo(() => {
    const map = new Map<string, Hit[]>();
    for (const h of hits) {
      if (!map.has(h.group)) map.set(h.group, []);
      map.get(h.group)!.push(h);
    }
    return map;
  }, [hits]);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="flex items-center gap-2 rounded-lg border border-border bg-surface px-3 py-1.5 text-sm text-ink-muted hover:border-border-strong w-64"
      >
        <IconSearch className="h-4 w-4" />
        Search clients, documents, tasks…
        <kbd className="ml-auto text-[10px] border border-border rounded px-1.5 py-0.5">⌘K</kbd>
      </button>

      {open && (
        <div className="fixed inset-0 z-50 bg-navy-strong/40 flex items-start justify-center pt-24" onClick={() => setOpen(false)}>
          <div
            className="w-full max-w-xl rounded-xl border border-border bg-surface shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-2 px-4 py-3 border-b border-border">
              <IconSearch className="h-4 w-4 text-ink-muted" />
              <input
                autoFocus
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search across every client, document, and task…"
                className="flex-1 outline-none text-sm bg-transparent"
              />
              <kbd className="text-[10px] text-ink-muted border border-border rounded px-1.5 py-0.5">esc</kbd>
            </div>

            <div className="max-h-96 overflow-y-auto py-2">
              {query.length > 0 && hits.length === 0 && (
                <div className="px-4 py-6 text-sm text-ink-muted text-center">No results.</div>
              )}
              {[...grouped.entries()].map(([group, items]) => (
                <div key={group} className="mb-2">
                  <div className="px-4 py-1 text-[11px] uppercase tracking-wide text-ink-muted">{group}</div>
                  {items.map((h) => (
                    <button
                      key={h.id}
                      onClick={() => {
                        router.push(h.href);
                        setOpen(false);
                        setQuery("");
                      }}
                      className="w-full text-left px-4 py-2 hover:bg-surface-sunken transition-colors"
                    >
                      <div className="text-sm font-medium">{h.label}</div>
                      <div className="text-xs text-ink-muted truncate">{h.sub}</div>
                    </button>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
