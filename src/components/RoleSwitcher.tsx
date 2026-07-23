"use client";

import { useState } from "react";
import { useRole } from "@/lib/context/RoleContext";
import { roleLabel } from "@/lib/mock/data";

export default function RoleSwitcher() {
  const { currentUser, activeRole, allUsers, setCurrentUserId, setActiveRole } = useRole();
  const [open, setOpen] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-2 rounded-lg border border-border bg-surface px-3 py-1.5 text-sm hover:border-border-strong transition-colors"
      >
        <span className="h-6 w-6 rounded-full bg-navy text-white text-[11px] font-semibold flex items-center justify-center">
          {currentUser.initials}
        </span>
        <span className="font-medium">{currentUser.name}</span>
        <span className="text-ink-muted text-xs">· Viewing as {roleLabel(activeRole)}</span>
        <span className="text-ink-muted">▾</span>
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <div className="absolute right-0 mt-2 w-72 rounded-lg border border-border bg-surface shadow-lg z-50 py-2">
            <div className="px-3 pb-2 text-[11px] uppercase tracking-wide text-ink-muted">
              Switch demo user
            </div>
            {allUsers.map((u) => (
              <button
                key={u.id}
                onClick={() => {
                  setCurrentUserId(u.id);
                  setOpen(false);
                }}
                className={`w-full text-left px-3 py-2 flex items-center gap-2 hover:bg-surface-sunken transition-colors ${
                  u.id === currentUser.id ? "bg-surface-sunken" : ""
                }`}
              >
                <span className="h-7 w-7 rounded-full bg-navy text-white text-xs font-semibold flex items-center justify-center shrink-0">
                  {u.initials}
                </span>
                <span>
                  <div className="text-sm font-medium">{u.name}</div>
                  <div className="text-xs text-ink-muted">
                    {u.title ?? roleLabel(u.roles[0])}
                    {u.seasonal ? " · Seasonal" : ""}
                  </div>
                </span>
              </button>
            ))}

            {currentUser.roles.length > 1 && (
              <>
                <div className="border-t border-border my-2" />
                <div className="px-3 pb-2 text-[11px] uppercase tracking-wide text-ink-muted">
                  {currentUser.name} has multiple roles
                </div>
                <div className="px-3 flex gap-2 pb-1">
                  {currentUser.roles.map((role) => (
                    <button
                      key={role}
                      onClick={() => {
                        setActiveRole(role);
                        setOpen(false);
                      }}
                      className={`flex-1 rounded-md border px-2 py-1.5 text-xs font-medium transition-colors ${
                        role === activeRole
                          ? "bg-navy text-white border-navy"
                          : "border-border hover:bg-surface-sunken"
                      }`}
                    >
                      {roleLabel(role)}
                      {role === "client" ? " (My Return)" : ""}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>
        </>
      )}
    </div>
  );
}
