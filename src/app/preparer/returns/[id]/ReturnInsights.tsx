"use client";

import { useRole } from "@/lib/context/RoleContext";
import AIInsightCard from "@/components/AIInsightCard";
import type { AIInsight } from "@/lib/mock/data";

export default function ReturnInsights({ insights }: { insights: AIInsight[] }) {
  const { activeRole, currentUser } = useRole();
  // Accepting/flagging an AI insight is a review action — the same
  // capability ReturnTabs already blocks seasonal preparers from reaching
  // via the Review & Traceability tab. Keeping it out of every path, not
  // just the tab, is what makes the permission boundary real.
  const canReview = activeRole !== "preparer" || !currentUser.seasonal;
  if (!canReview || insights.length === 0) return null;

  return (
    <section>
      <h2 className="text-sm font-semibold mb-2">AI insights needing a look</h2>
      <div className="space-y-3">
        {insights.map((insight) => (
          <AIInsightCard key={insight.id} insight={insight} />
        ))}
      </div>
    </section>
  );
}
