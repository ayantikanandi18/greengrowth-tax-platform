"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { HOME_BY_ROLE, useRole } from "@/lib/context/RoleContext";

export default function Home() {
  const { activeRole } = useRole();
  const router = useRouter();

  useEffect(() => {
    router.replace(HOME_BY_ROLE[activeRole] ?? "/preparer");
  }, [activeRole, router]);

  return <div className="p-8 text-sm text-ink-muted">Loading GreenGrowth…</div>;
}
