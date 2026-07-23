import { STATUS_META, type ReturnStatus } from "@/lib/mock/data";

const COLOR_CLASSES: Record<string, string> = {
  muted: "bg-surface-sunken text-ink-secondary border-border",
  warning: "bg-warning-soft text-warning border-warning/30",
  info: "bg-info-soft text-info border-info/30",
  good: "bg-good-soft text-good border-good/30",
};

export default function StatusPill({
  status,
  audience,
}: {
  status: ReturnStatus;
  audience: "client" | "staff";
}) {
  const meta = STATUS_META[status];
  const label = audience === "client" ? meta.clientLabel : meta.staffLabel;

  return (
    <span
      title={meta.description}
      className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium ${COLOR_CLASSES[meta.color]}`}
    >
      {meta.blocking && <span className="h-1.5 w-1.5 rounded-full bg-current" />}
      {label}
    </span>
  );
}
