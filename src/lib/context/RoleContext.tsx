"use client";

import { createContext, useContext, useMemo, useState } from "react";
import { USERS } from "@/lib/mock/data";
import type { Role, User } from "@/lib/mock/types";

interface RoleContextValue {
  currentUser: User;
  activeRole: Role;
  allUsers: User[];
  setCurrentUserId: (id: string) => void;
  setActiveRole: (role: Role) => void;
}

const RoleContext = createContext<RoleContextValue | null>(null);

const DEFAULT_USER_ID = "u-morgan";
const DEFAULT_ROLE: Role = "preparer";
const STORAGE_KEY_USER = "greengrowth:userId";
const STORAGE_KEY_ROLE = "greengrowth:activeRole";

// Read persisted UI state once, lazily, instead of an effect + setState —
// this only touches `window` client-side (SSR gets the plain defaults).
function initialUserId() {
  if (typeof window === "undefined") return DEFAULT_USER_ID;
  const saved = window.localStorage.getItem(STORAGE_KEY_USER);
  return saved && USERS.some((u) => u.id === saved) ? saved : DEFAULT_USER_ID;
}

function initialRole(): Role {
  if (typeof window === "undefined") return DEFAULT_ROLE;
  return (window.localStorage.getItem(STORAGE_KEY_ROLE) as Role | null) ?? DEFAULT_ROLE;
}

export function RoleProvider({ children }: { children: React.ReactNode }) {
  const [currentUserId, setCurrentUserIdState] = useState(initialUserId);
  const [activeRole, setActiveRoleState] = useState<Role>(initialRole);

  const currentUser = useMemo(
    () => USERS.find((u) => u.id === currentUserId) ?? USERS[0],
    [currentUserId],
  );

  function setCurrentUserId(id: string) {
    const user = USERS.find((u) => u.id === id);
    if (!user) return;
    setCurrentUserIdState(id);
    window.localStorage.setItem(STORAGE_KEY_USER, id);
    if (!user.roles.includes(activeRole)) {
      const nextRole = user.roles[0];
      setActiveRoleState(nextRole);
      window.localStorage.setItem(STORAGE_KEY_ROLE, nextRole);
    }
  }

  function setActiveRole(role: Role) {
    setActiveRoleState(role);
    window.localStorage.setItem(STORAGE_KEY_ROLE, role);
  }

  return (
    <RoleContext.Provider
      value={{ currentUser, activeRole, allUsers: USERS, setCurrentUserId, setActiveRole }}
    >
      {children}
    </RoleContext.Provider>
  );
}

export function useRole() {
  const ctx = useContext(RoleContext);
  if (!ctx) throw new Error("useRole must be used within RoleProvider");
  return ctx;
}
