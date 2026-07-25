import { IconCheck, IconLock, IconSparkle } from "./icons";
import type { FieldDataState } from "@/lib/mock/data";

const CONFIG: Record<FieldDataState, { label: string; classes: string; icon: React.ReactNode }> = {
  "ai-suggested": {
    label: "AI suggested",
    classes: "bg-info-soft text-info border-info/30",
    icon: <IconSparkle className="h-3 w-3" />,
  },
  verified: {
    label: "Verified",
    classes: "bg-good-soft text-good border-good/30",
    icon: <IconCheck className="h-3 w-3" />,
  },
  locked: {
    label: "Locked",
    classes: "bg-surface-sunken text-ink-muted border-border",
    icon: <IconLock className="h-3 w-3" />,
  },
  "needs-input": {
    label: "Needs your input",
    classes: "bg-warning-soft text-warning border-warning/30",
    icon: null,
  },
};

export default function DataStateBadge({ state }: { state: FieldDataState }) {
  const c = CONFIG[state];
  return (
    <span className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[11px] font-medium ${c.classes}`}>
      {c.icon}
      {c.label}
    </span>
  );
}

export function dataStateContainerClasses(state: FieldDataState) {
  switch (state) {
    case "ai-suggested":
      return "border-dashed border-info/40 hover:border-info/70 cursor-pointer";
    case "verified":
      return "border-solid border-border hover:border-good/50 cursor-pointer";
    case "locked":
      // Still clickable — locked means "can't be changed," not "can't be
      // inspected." Clicking shows why, same as every other field; the
      // muted fill + lock icon (no dashed/colored outline) is what signals
      // "look, don't touch," not a disabled control.
      return "border-solid border-border bg-surface-sunken/60 cursor-pointer";
    case "needs-input":
      return "border-solid border-warning/50 cursor-pointer";
  }
}
