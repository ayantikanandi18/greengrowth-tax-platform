"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function ReturnTabs({ returnId }: { returnId: string }) {
  const pathname = usePathname();
  const base = `/preparer/returns/${returnId}`;
  const tabs = [
    { href: base, label: "Overview" },
    { href: `${base}/review`, label: "Review & Traceability" },
    { href: `${base}/documents`, label: "Documents" },
    { href: `${base}/messages`, label: "Messages" },
  ];

  return (
    <div className="px-8 border-b border-border bg-surface flex gap-1">
      {tabs.map((tab) => {
        const active = pathname === tab.href;
        return (
          <Link
            key={tab.href}
            href={tab.href}
            className={`px-3 py-2.5 text-sm border-b-2 -mb-px transition-colors ${
              active ? "border-navy text-navy font-medium" : "border-transparent text-ink-muted hover:text-ink"
            }`}
          >
            {tab.label}
          </Link>
        );
      })}
    </div>
  );
}
