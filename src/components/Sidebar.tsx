"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useRole } from "@/lib/context/RoleContext";
import { IconFile, IconHome, IconLayers, IconMessage, IconShield, IconUsers } from "./icons";
import type { Role } from "@/lib/mock/types";

const NAV_BY_ROLE: Record<Role, { href: string; label: string; icon: React.ComponentType<React.SVGProps<SVGSVGElement>> }[]> = {
  client: [
    { href: "/client", label: "My Return", icon: IconHome },
    { href: "/client/documents", label: "Documents", icon: IconFile },
    { href: "/client/messages", label: "Messages", icon: IconMessage },
  ],
  preparer: [
    { href: "/preparer", label: "Dashboard", icon: IconHome },
    { href: "/preparer/clients", label: "Clients", icon: IconUsers },
  ],
  reviewer: [{ href: "/reviewer", label: "Review Queue", icon: IconLayers }],
  admin: [{ href: "/admin", label: "Firm Overview", icon: IconShield }],
};

export default function Sidebar() {
  const { activeRole, currentUser } = useRole();
  const pathname = usePathname();
  const items = NAV_BY_ROLE[activeRole];

  return (
    <aside className="w-60 shrink-0 border-r border-border bg-surface flex flex-col">
      <div className="h-16 flex items-center gap-2 px-5 border-b border-border">
        <span className="h-8 w-8 rounded-md bg-navy flex items-center justify-center text-gold-soft font-serif font-semibold text-sm">
          G
        </span>
        <div>
          <div className="font-semibold text-sm leading-tight">GreenGrowth</div>
          <div className="text-[11px] text-ink-muted leading-tight">Client &amp; Tax Portal</div>
        </div>
      </div>

      <nav className="flex-1 px-3 py-4 space-y-0.5">
        {items.map((item) => {
          const active = pathname === item.href || pathname?.startsWith(item.href + "/");
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors ${
                active ? "bg-navy text-white" : "text-ink-secondary hover:bg-surface-sunken hover:text-ink"
              }`}
            >
              <Icon className="h-4 w-4" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      {currentUser.seasonal && (
        <div className="mx-3 mb-3 rounded-md bg-warning-soft border border-warning/30 px-3 py-2 text-[11px] text-warning">
          Seasonal staff account — limited to document intake and client messaging.
        </div>
      )}

      <div className="px-5 py-4 border-t border-border text-[11px] text-ink-muted">
        Prototype — all data is simulated
      </div>
    </aside>
  );
}
