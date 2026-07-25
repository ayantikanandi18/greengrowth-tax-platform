import { MILESTONES, STATUS_META, ownerDisplay, type ReturnStatus } from "@/lib/mock/data";

const DOT_CLASSES: Record<string, { fill: string; ring: string }> = {
  muted: { fill: "bg-ink-muted", ring: "ring-ink-muted/30" },
  warning: { fill: "bg-warning", ring: "ring-warning/30" },
  info: { fill: "bg-info", ring: "ring-info/30" },
  good: { fill: "bg-good", ring: "ring-good/30" },
};

/**
 * The one place "where's the return, what's already happened, what's next,
 * who owns it, and is anything blocked" all live together — reused for
 * both audiences off the same STATUS_META, so a client and a preparer
 * looking at the same return read the same milestones, just with
 * audience-appropriate labels (no raw internal status names on the client
 * side, per the brief's "don't expose unnecessary internal complexity").
 */
export default function StatusProgress({
  status,
  audience,
  updatedAt,
}: {
  status: ReturnStatus;
  audience: "client" | "staff";
  updatedAt?: string;
}) {
  const meta = STATUS_META[status];
  const label = audience === "client" ? meta.clientLabel : meta.staffLabel;
  const dot = DOT_CLASSES[meta.color];

  return (
    <div className="card p-5">
      <div className="flex items-center gap-2 mb-4">
        {MILESTONES.map((name, i) => {
          const state = i < meta.milestone ? "done" : i === meta.milestone ? "current" : "upcoming";
          return (
            <div key={name} className="flex-1 flex items-center gap-2">
              <div className="flex-1 flex flex-col items-center gap-1.5">
                <span
                  className={`h-2.5 w-2.5 rounded-full ${
                    state === "upcoming"
                      ? "bg-border"
                      : state === "current"
                        ? `${dot.fill} ring-4 ${dot.ring}`
                        : "bg-navy"
                  }`}
                />
                <span
                  className={`text-[11px] text-center leading-tight ${
                    state === "upcoming" ? "text-ink-muted" : state === "current" ? "font-medium" : "text-ink-secondary"
                  }`}
                >
                  {name}
                </span>
              </div>
              {i < MILESTONES.length - 1 && (
                <span className={`h-px flex-1 -mt-4 ${i < meta.milestone ? "bg-navy" : "bg-border"}`} />
              )}
            </div>
          );
        })}
      </div>

      <div className="flex items-start justify-between gap-4 pt-3 border-t border-border">
        <div>
          <div className="flex items-center gap-2">
            <span className={`h-2 w-2 rounded-full ${dot.fill}`} />
            <span className="text-sm font-semibold">{label}</span>
            {meta.blocking && (
              <span className="text-[11px] font-medium px-1.5 py-0.5 rounded bg-warning-soft text-warning">
                Blocking
              </span>
            )}
          </div>
          <p className="text-sm text-ink-secondary mt-1">{meta.description}</p>
          <p className="text-xs text-ink-muted mt-1">Next: {meta.whatsNext}</p>
        </div>
        <div className="text-right shrink-0">
          <div className="text-[11px] text-ink-muted uppercase tracking-wide">Owner</div>
          <div className="text-sm font-medium">{ownerDisplay(meta.ownerRole, audience)}</div>
          {updatedAt && (
            <div className="text-[11px] text-ink-muted mt-1">
              Updated {new Date(updatedAt).toLocaleDateString()}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
