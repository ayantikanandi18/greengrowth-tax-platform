import {
  AI_INSIGHTS,
  ALL_DOCUMENTS,
  CLIENTS,
  MESSAGES,
  NOW,
  QUESTIONNAIRE_ITEMS,
  RETURNS,
  SARAH_FIELDS,
  TASKS,
  USERS,
} from "./generate";
import { STATUS_META, type ReturnStatus, type Role } from "./types";

export {
  AI_INSIGHTS,
  ALL_DOCUMENTS,
  NOW,
  CLIENTS,
  MESSAGES,
  QUESTIONNAIRE_ITEMS,
  RETURNS,
  SARAH_FIELDS,
  TASKS,
  USERS,
  STATUS_META,
};
export * from "./types";

export function getUser(userId: string) {
  return USERS.find((u) => u.id === userId) ?? null;
}

export function getClient(clientId: string) {
  return CLIENTS.find((c) => c.id === clientId) ?? null;
}

export function getReturn(returnId: string) {
  return RETURNS.find((r) => r.id === returnId) ?? null;
}

export function getReturnForClient(clientId: string) {
  return RETURNS.find((r) => r.clientId === clientId) ?? null;
}

export function getDocumentsForReturn(returnId: string) {
  return ALL_DOCUMENTS.filter((d) => d.returnId === returnId);
}

export function getFieldsForReturn(returnId: string) {
  return SARAH_FIELDS.filter((f) => f.returnId === returnId);
}

export function getTasksForReturn(returnId: string) {
  return TASKS.filter((t) => t.returnId === returnId);
}

export function getMessagesForReturn(returnId: string) {
  return MESSAGES.filter((m) => m.returnId === returnId);
}

export function getInsightsForReturn(returnId: string) {
  return AI_INSIGHTS.filter((i) => i.returnId === returnId);
}

export function getDocument(documentId: string) {
  return ALL_DOCUMENTS.find((d) => d.id === documentId) ?? null;
}

export function getTask(taskId: string) {
  return TASKS.find((t) => t.id === taskId) ?? null;
}

export function getQuestionnaireForClient(clientId: string) {
  return QUESTIONNAIRE_ITEMS.filter((q) => q.clientId === clientId);
}

export function getReturnsForPreparer(preparerId: string) {
  const clientIds = new Set(CLIENTS.filter((c) => c.assignedPreparerId === preparerId).map((c) => c.id));
  return RETURNS.filter((r) => clientIds.has(r.clientId));
}

export function getReturnsForReviewer(reviewerId: string) {
  const clientIds = new Set(CLIENTS.filter((c) => c.assignedReviewerId === reviewerId).map((c) => c.id));
  return RETURNS.filter((r) => r.status === "in_review" && clientIds.has(r.clientId));
}

/** Challenge 07 — real prioritization: blocking > overdue > due-soon > everything else. */
const URGENCY_ORDER: ReturnStatus[] = [
  "awaiting_client_response",
  "awaiting_documents",
  "ready_to_file",
  "in_review",
  "in_preparation",
  "not_started",
  "filed",
];

export function rankReturnsByUrgency(returns: (typeof RETURNS)[number][]) {
  return [...returns].sort((a, b) => {
    const aBlocking = STATUS_META[a.status].blocking;
    const bBlocking = STATUS_META[b.status].blocking;
    if (aBlocking !== bBlocking) return aBlocking ? -1 : 1;

    const aDue = new Date(a.dueDate).getTime();
    const bDue = new Date(b.dueDate).getTime();
    if (aDue !== bDue) return aDue - bDue;

    return URGENCY_ORDER.indexOf(a.status) - URGENCY_ORDER.indexOf(b.status);
  });
}

export function roleLabel(role: Role) {
  return { client: "Client", preparer: "Preparer", reviewer: "Reviewer", admin: "Firm Admin" }[role];
}

/**
 * "Who owns the next action" in plain language — the same underlying
 * ownerRole read two ways so a client never sees internal role vocabulary
 * ("Preparer") and staff never see the flattened "You" that only makes
 * sense from a client's seat.
 */
export function ownerDisplay(ownerRole: Role | "none", audience: "client" | "staff") {
  if (ownerRole === "none") return "No one — it's done";
  if (audience === "client") {
    return { client: "You", preparer: "Your preparer", reviewer: "The reviewer", admin: "Your firm" }[ownerRole];
  }
  return roleLabel(ownerRole);
}

export function clientDisplayName(clientId: string) {
  const c = getClient(clientId);
  if (!c) return "Unknown client";
  const base = c.entityName ? `${c.entityName} (${c.name})` : c.name;
  // Challenge 05 — a firm employee's personal return uses their own name,
  // identical to their staff identity. In any list that could show both
  // (firm-wide admin view, a colleague's client list), make it unmistakable
  // this row is their own file, not a duplicate staff entry.
  const isStaffPersonalReturn = USERS.some((u) => u.clientId === clientId && u.roles.length > 1);
  return isStaffPersonalReturn ? `${base} (personal return)` : base;
}
