/**
 * Everything in this file is fabricated. There is no model call here — per
 * the case study's explicit instruction, AI outputs (confidence scores,
 * rationale, corrections) are hand-authored plausible data, wrapped in a
 * small artificial delay so the UI can demonstrate what an in-progress AI
 * action should feel like (not to pretend it's a real network call).
 */
import { AI_INSIGHTS, SARAH_FIELDS } from "./generate";
import type { AIInsight, ExtractedField } from "./types";

function delay<T>(value: T, ms = 550): Promise<T> {
  return new Promise((resolve) => setTimeout(() => resolve(value), ms));
}

export async function fetchInsightsForReturn(returnId: string): Promise<AIInsight[]> {
  return delay(AI_INSIGHTS.filter((i) => i.returnId === returnId));
}

export async function fetchFieldDetail(fieldId: string): Promise<ExtractedField | null> {
  return delay(SARAH_FIELDS.find((f) => f.id === fieldId) ?? null);
}

export interface ReCheckResult {
  fieldId: string;
  newValue: string;
  newConfidence: number;
  explanation: string;
}

/**
 * Simulates asking the AI to re-derive a field after a user flags it as
 * questionable — a fabricated "second pass" with a slightly different
 * framing, used to demonstrate the correction workflow in Challenge 10.
 */
export async function requestAIRecheck(field: ExtractedField): Promise<ReCheckResult> {
  return delay(
    {
      fieldId: field.id,
      newValue: field.value,
      newConfidence: Math.min(0.99, (field.confidence ?? 0.7) + 0.05),
      explanation:
        "Re-checked against the source document region again. The original figure matches exactly what's printed on the document — no change recommended, but this is now marked as double-checked.",
    },
    900,
  );
}

export interface DuplicateCheckResult {
  isDuplicate: boolean;
  explanation: string;
}

export async function checkForDuplicate(documentName: string): Promise<DuplicateCheckResult> {
  return delay({
    isDuplicate: true,
    explanation: `"${documentName}" shares a vendor, amount, and upload timestamp with another document already on this return.`,
  });
}
