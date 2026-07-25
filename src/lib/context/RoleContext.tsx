"use client";

import { createContext, useContext, useMemo, useSyncExternalStore } from "react";
import { useRouter } from "next/navigation";
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
// Native "storage" events only fire in *other* tabs — this is how the tab
// that actually made the change notifies its own subscribers.
const CHANGE_EVENT = "greengrowth:persona-change";

/** Shared with the root "/" redirect page — one source of truth for
 * "where does this role actually live." */
export const HOME_BY_ROLE: Record<Role, string> = {
  client: "/client",
  preparer: "/preparer",
  reviewer: "/reviewer",
  admin: "/admin",
};

// localStorage is genuinely external to React, and can't be read during
// SSR — useSyncExternalStore is the API built for exactly that split:
// getServerSnapshot supplies what the server (and thus the client's first
// render) must show, getSnapshot supplies the real client-side value, and
// React reconciles the two safely right after hydration, without a
// synchronous setState-in-effect (which this project's stricter
// react-hooks/set-state-in-effect lint rule already blocks) and without
// the hydration mismatch that reading localStorage in a useState
// initializer used to cause on every hard refresh while viewing as
// anyone but the default user.
function subscribe(callback: () => void) {
  window.addEventListener(CHANGE_EVENT, callback);
  window.addEventListener("storage", callback);
  return () => {
    window.removeEventListener(CHANGE_EVENT, callback);
    window.removeEventListener("storage", callback);
  };
}

function getUserIdSnapshot() {
  const saved = window.localStorage.getItem(STORAGE_KEY_USER);
  return saved && USERS.some((u) => u.id === saved) ? saved : DEFAULT_USER_ID;
}
function getUserIdServerSnapshot() {
  return DEFAULT_USER_ID;
}

function getRoleSnapshot(): Role {
  return (window.localStorage.getItem(STORAGE_KEY_ROLE) as Role | null) ?? DEFAULT_ROLE;
}
function getRoleServerSnapshot(): Role {
  return DEFAULT_ROLE;
}

function persist(userId: string, role: Role) {
  window.localStorage.setItem(STORAGE_KEY_USER, userId);
  window.localStorage.setItem(STORAGE_KEY_ROLE, role);
  window.dispatchEvent(new Event(CHANGE_EVENT));
}

export function RoleProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const currentUserId = useSyncExternalStore(subscribe, getUserIdSnapshot, getUserIdServerSnapshot);
  const activeRole = useSyncExternalStore(subscribe, getRoleSnapshot, getRoleServerSnapshot);

  const currentUser = useMemo(
    () => USERS.find((u) => u.id === currentUserId) ?? USERS[0],
    [currentUserId],
  );

  // Switching the demo user or the active role only ever updated context
  // state — nothing navigated. If you were three levels deep on a
  // preparer-only route (e.g. a specific return) and switched to Client,
  // the sidebar would re-render with client nav links while the main
  // content stayed on that same preparer route, since the URL never
  // changed. Both setters now land you on the new role's home route, the
  // same way the very first page load does.
  function setCurrentUserId(id: string) {
    const user = USERS.find((u) => u.id === id);
    if (!user) return;
    const nextRole = user.roles.includes(activeRole) ? activeRole : user.roles[0];
    persist(id, nextRole);
    router.push(HOME_BY_ROLE[nextRole]);
  }

  function setActiveRole(role: Role) {
    persist(currentUserId, role);
    router.push(HOME_BY_ROLE[role]);
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
