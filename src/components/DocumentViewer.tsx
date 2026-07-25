import type { TaxDocument } from "@/lib/mock/types";
import { IconFile } from "./icons";

/**
 * A stylized document-page mockup, not a real PDF/image renderer — there is
 * no OCR or real page image here. It exists to demonstrate the interaction
 * (source doc + highlighted region + page number) that Challenge 01 is
 * actually judging.
 */
export default function DocumentViewer({
  document,
  page,
  regionLabel,
}: {
  document: TaxDocument | null;
  page: number | null;
  regionLabel: string | null;
}) {
  if (!document) {
    return (
      <div className="rounded-lg border border-dashed border-border h-full flex items-center justify-center text-sm text-ink-muted p-8 text-center">
        This value was confirmed directly with the client — there&apos;s no source document to display.
      </div>
    );
  }

  return (
    <div className="rounded-lg border border-border bg-surface-sunken h-full flex flex-col">
      <div className="flex items-center gap-2 px-4 py-3 border-b border-border bg-surface rounded-t-lg">
        <IconFile className="h-4 w-4 text-ink-secondary" />
        <div className="text-sm font-medium">{document.name}</div>
        {page && <div className="ml-auto text-xs text-ink-muted">Page {page} of {document.pageCount}</div>}
      </div>

      <div className="flex-1 p-6 flex items-center justify-center">
        <div className="w-full max-w-sm aspect-[8.5/11] bg-surface border border-border-strong rounded-md shadow-sm relative p-6 flex flex-col">
          {/* Real fields from the document record, not decorative skeleton
              bars — a mockup that says nothing is a mockup that reads as
              broken, not intentional. */}
          <div className="text-sm font-semibold text-ink">{document.vendor ?? document.docType}</div>
          <div className="text-[11px] text-ink-muted mt-0.5">
            {document.docType} · {new Date(document.uploadedAt).toLocaleDateString()}
          </div>

          <div className="mt-5 space-y-1.5 text-[11px] text-ink-secondary">
            <div className="flex justify-between border-b border-border pb-1">
              <span className="text-ink-muted">Document ID</span>
              <span>{document.id.toUpperCase()}</span>
            </div>
            <div className="flex justify-between border-b border-border pb-1">
              <span className="text-ink-muted">Category</span>
              <span>{document.category}</span>
            </div>
            {document.amount !== undefined && (
              <div className="flex justify-between border-b border-border pb-1">
                <span className="text-ink-muted">Amount</span>
                <span className="font-medium">${document.amount.toLocaleString()}</span>
              </div>
            )}
            <div className="flex justify-between border-b border-border pb-1">
              <span className="text-ink-muted">Uploaded by</span>
              <span className="capitalize">{document.uploadedBy}</span>
            </div>
          </div>

          {/* Sits in normal flow, not absolutely positioned — an overlay
              calibrated for the old, mostly-empty mockup started colliding
              with these real data rows the moment the content grew. */}
          {regionLabel && (
            <div className="mt-4 rounded-md border-2 border-gold bg-gold-soft/80 px-3 py-2 shadow-sm">
              <div className="text-[10px] uppercase tracking-wide text-gold font-semibold">Highlighted region</div>
              <div className="text-xs text-ink mt-0.5">{regionLabel}</div>
            </div>
          )}

          <div className="mt-auto pt-6 text-[10px] text-ink-muted/70 italic text-center">
            Simulated document preview — not a real scan.
          </div>
        </div>
      </div>
    </div>
  );
}
