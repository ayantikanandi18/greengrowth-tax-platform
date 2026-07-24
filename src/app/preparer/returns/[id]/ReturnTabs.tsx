"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useRole } from "@/lib/context/RoleContext";

export default function ReturnTabs({ returnId }: { returnId: string }) {
  const pathname = usePathname();
  const { activeRole, currentUser } = useRole();
  const base = `/preparer/returns/${returnId}`;

  const allTabs = [
    { href: base, label: "Overview", roles: ["preparer", "reviewer", "admin"] },
    { href: `${base}/review`, label: "Review & Traceability", roles: ["preparer", "reviewer", "admin"], seasonalOk: false },
    { href: `${base}/documents`, label: "Documents", roles: ["preparer", "admin"] },
    { href: `${base}/messages`, label: "Messages", roles: ["preparer", "reviewer", "admin"] },
  ];

  // Challenge 05 — permissions aren't just a claim in a sidebar banner: a
  // seasonal preparer genuinely can't reach Review & Traceability (that
  // banner said "limited to document intake and client messaging" — this is
  // what actually enforces it), and a reviewer doesn't get a Documents tab
  // since intake isn't their job.
  const tabs = allTabs.filter((tab) => {
    if (!tab.roles.includes(activeRole)) return false;
    if (currentUser.seasonal && tab.seasonalOk === false) return false;
    return true;
  });

  return (
    <div className="px-8 border-b border-border bg-surface flex items-center gap-1">
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
      {currentUser.seasonal && (
        <span className="ml-auto text-[11px] text-warning">Seasonal account — Review & Traceability hidden</span>
      )}
    </div>
  );
}
