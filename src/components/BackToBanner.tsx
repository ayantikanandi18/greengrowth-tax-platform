"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { IconArrowLeft } from "./icons";

/**
 * Challenge 04 — when a user deep-links here from a task or message (e.g.
 * `?fromLabel=Verify+AI-suggested+dividend+figure&fromHref=/preparer/returns/r-sarah-2025`),
 * show where they came from and a one-click way back, so jumping to a
 * connected object never costs them their place.
 */
export default function BackToBanner() {
  const params = useSearchParams();
  const fromLabel = params.get("fromLabel");
  const fromHref = params.get("fromHref");
  if (!fromLabel || !fromHref) return null;

  return (
    <Link
      href={fromHref}
      className="flex items-center gap-2 px-8 py-2.5 bg-gold-soft border-b border-gold/30 text-sm text-navy-strong hover:bg-gold-soft/70 transition-colors"
    >
      <IconArrowLeft className="h-3.5 w-3.5" />
      Back to <span className="font-medium">{fromLabel}</span>
    </Link>
  );
}
