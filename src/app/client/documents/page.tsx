"use client";

import { useRef, useState } from "react";
import { useRole } from "@/lib/context/RoleContext";
import { getClient, getDocumentsForReturn, getReturnForClient } from "@/lib/mock/data";
import type { TaxDocument } from "@/lib/mock/types";
import PageHeader from "@/components/PageHeader";
import { IconFile, IconUsers } from "@/components/icons";

export default function ClientDocuments() {
  const { currentUser } = useRole();
  const client = currentUser.clientId ? getClient(currentUser.clientId) : null;
  const taxReturn = client ? getReturnForClient(client.id) : null;
  const [extra, setExtra] = useState<TaxDocument[]>([]);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!client || !taxReturn) return null;
  const documents = [...getDocumentsForReturn(taxReturn.id), ...extra];

  // Uses the real filename picked from disk instead of a hardcoded
  // placeholder — the document list is meant to be scannable by name for
  // both the client and their preparer, and "Uploaded Document.pdf"
  // repeated for every upload defeats that.
  function handleFileSelected(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;

    setUploading(true);
    setTimeout(() => {
      setExtra((prev) => [
        {
          id: `d-upload-${prev.length}`,
          returnId: taxReturn!.id,
          name: file.name,
          docType: "Other",
          category: "Correspondence",
          uploadedAt: new Date().toISOString(),
          uploadedBy: "client",
          pageCount: 1,
          tags: [],
        },
        ...prev,
      ]);
      setUploading(false);
    }, 700);
  }

  return (
    <div>
      <PageHeader
        title="Documents"
        crumbs={[{ label: "My Return", href: "/client" }, { label: "Documents" }]}
        actions={
          <>
            <input
              ref={fileInputRef}
              type="file"
              onChange={handleFileSelected}
              className="hidden"
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
              className="text-sm font-medium bg-navy text-white px-4 py-2 rounded-lg hover:bg-navy-strong transition-colors disabled:opacity-60"
            >
              {uploading ? "Uploading…" : "Upload document"}
            </button>
          </>
        }
      />
      <div className="p-8 max-w-3xl mx-auto">
        <div className="card divide-y divide-border">
          {documents.map((doc) => (
            <div key={doc.id} className="flex items-center gap-3 px-4 py-3">
              <span className="h-9 w-9 rounded-md bg-surface-sunken flex items-center justify-center shrink-0">
                <IconFile className="h-4 w-4 text-ink-secondary" />
              </span>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium truncate">{doc.name}</div>
                <div className="text-xs text-ink-muted">
                  {doc.docType} · {new Date(doc.uploadedAt).toLocaleDateString()}
                </div>
              </div>
            </div>
          ))}
          {documents.length === 0 && (
            <div className="px-4 py-10 text-center text-sm text-ink-muted flex flex-col items-center gap-2">
              <IconUsers className="h-6 w-6 text-ink-muted" />
              No documents yet — upload your first one to get started.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
