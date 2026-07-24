"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useRole } from "@/lib/context/RoleContext";

const HOME_BY_ROLE: Record<string, string> = {
  client: "/client",
  preparer: "/preparer",
  reviewer: "/reviewer",
  admin: "/admin",
};

export default function Home() {
  const { activeRole } = useRole();
  const router = useRouter();

  useEffect(() => {
    router.replace(HOME_BY_ROLE[activeRole] ?? "/preparer");
  }, [activeRole, router]);

  return <div className="p-8 text-sm text-ink-muted">Loading GreenGrowth…</div>;
}
