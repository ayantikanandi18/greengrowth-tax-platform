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
        <div className="w-full max-w-sm aspect-[8.5/11] bg-surface border border-border-strong rounded-md shadow-sm relative p-5">
          <div className="space-y-2">
            <div className="h-2.5 w-2/3 bg-surface-sunken rounded" />
            <div className="h-2 w-1/2 bg-surface-sunken rounded" />
            <div className="h-2 w-5/6 bg-surface-sunken rounded mt-4" />
            <div className="h-2 w-4/6 bg-surface-sunken rounded" />
          </div>

          {regionLabel && (
            <div className="absolute left-5 right-5 top-[42%] rounded-md border-2 border-gold bg-gold-soft/70 px-3 py-2 shadow-sm">
              <div className="text-[10px] uppercase tracking-wide text-gold font-semibold">{regionLabel}</div>
              <div className="h-2 w-2/3 bg-gold/30 rounded mt-1" />
            </div>
          )}

          <div className="space-y-2 mt-16">
            <div className="h-2 w-3/4 bg-surface-sunken rounded" />
            <div className="h-2 w-1/2 bg-surface-sunken rounded" />
          </div>
        </div>
      </div>
    </div>
  );
}
