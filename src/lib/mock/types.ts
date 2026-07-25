export type Role = "client" | "preparer" | "reviewer" | "admin";

export interface User {
  id: string;
  name: string;
  initials: string;
  roles: Role[];
  title?: string; // e.g. "Senior Tax Preparer", "Firm Administrator"
  clientId?: string; // set when this user IS a client (their portal login)
  seasonal?: boolean; // seasonal staff = preparer role, reduced permissions
}

export type ClientType = "individual" | "business";

export interface Client {
  id: string;
  name: string;
  entityName?: string; // for business clients
  type: ClientType;
  email: string;
  assignedPreparerId: string;
  assignedReviewerId?: string;
  createdAt: string; // ISO — recent createdAt drives the "new client" onboarding state
}

export type ReturnStatus =
  | "not_started"
  | "awaiting_documents"
  | "in_preparation"
  | "awaiting_client_response"
  | "in_review"
  | "ready_to_file"
  | "filed";

export interface StatusMeta {
  clientLabel: string;
  staffLabel: string;
  description: string;
  /** Plain-language "what happens after this" — the answer to "what's next," always visible, never just a tooltip. */
  whatsNext: string;
  color: "muted" | "warning" | "info" | "good";
  blocking: boolean;
  ownerRole: Role | "none";
  /** Which of the 4 client-facing milestones this internal status belongs to — see MILESTONES. */
  milestone: number;
}

export const STATUS_META: Record<ReturnStatus, StatusMeta> = {
  not_started: {
    clientLabel: "Let's get started",
    staffLabel: "Not Started",
    description: "The return hasn't been opened yet.",
    whatsNext: "Your preparer will request the documents needed to begin.",
    color: "muted",
    blocking: false,
    ownerRole: "preparer",
    milestone: 0,
  },
  awaiting_documents: {
    clientLabel: "Action needed: upload your documents",
    staffLabel: "Awaiting Documents (Client)",
    description: "Waiting on the client to upload requested documents.",
    whatsNext: "Once documents are in, preparation starts.",
    color: "warning",
    blocking: true,
    ownerRole: "client",
    milestone: 0,
  },
  in_preparation: {
    clientLabel: "We're preparing your return",
    staffLabel: "In Preparation",
    description: "Preparer is actively working on the return.",
    whatsNext: "Once everything is entered, it moves to final review.",
    color: "info",
    blocking: false,
    ownerRole: "preparer",
    milestone: 1,
  },
  awaiting_client_response: {
    clientLabel: "Action needed: answer a question",
    staffLabel: "Awaiting Client Response",
    description: "Preparer asked a question that's blocking progress.",
    whatsNext: "Once you reply, preparation picks back up.",
    color: "warning",
    blocking: true,
    ownerRole: "client",
    milestone: 1,
  },
  in_review: {
    clientLabel: "Final review in progress",
    staffLabel: "In Review",
    description: "A reviewer is checking the completed return.",
    whatsNext: "Once review passes, it's ready for your signature.",
    color: "info",
    blocking: false,
    ownerRole: "reviewer",
    milestone: 2,
  },
  ready_to_file: {
    clientLabel: "Action needed: review & sign to file",
    staffLabel: "Ready for Signature",
    description: "Return is complete and awaiting the client's e-signature.",
    whatsNext: "Once you sign, we file it with the IRS.",
    color: "good",
    blocking: true,
    ownerRole: "client",
    milestone: 3,
  },
  filed: {
    clientLabel: "Filed",
    staffLabel: "Filed",
    description: "The return has been filed.",
    whatsNext: "Nothing further — the return is complete.",
    color: "good",
    blocking: false,
    ownerRole: "none",
    milestone: 3,
  },
};

/**
 * The client-facing journey, collapsed from 7 internal statuses to 4
 * milestones — "solve without exposing unnecessary internal complexity to
 * the client." Staff see the same milestones plus their precise status.
 */
export const MILESTONES = ["Documents", "Preparation", "Review", "Sign & File"] as const;

export type FormType = "1040" | "1040 + Schedule C" | "1120S";

export interface TaxReturn {
  id: string;
  clientId: string;
  taxYear: number;
  formType: FormType;
  status: ReturnStatus;
  dueDate: string;
  updatedAt: string;
}

export type DocumentCategory =
  | "Income"
  | "Deductions"
  | "Business Expenses"
  | "Prior Year"
  | "Correspondence";

export interface TaxDocument {
  id: string;
  returnId: string;
  name: string;
  docType: string; // "W-2", "1099-NEC", "Receipt", "Bank Statement", etc.
  category: DocumentCategory;
  uploadedAt: string;
  uploadedBy: Role;
  pageCount: number;
  vendor?: string;
  amount?: number;
  tags: string[];
}

export type FieldDataState = "ai-suggested" | "verified" | "locked" | "needs-input";

export interface FieldSource {
  documentId: string;
  page: number;
  regionLabel: string; // "Box 1"
}

export interface ExtractedField {
  id: string;
  returnId: string;
  fieldLabel: string; // "Form 1040, Line 1a — Wages"
  value: string;
  /** Every document that feeds this field — one for a direct copy, several for a sum. Empty when there's no source document at all (e.g. confirmed directly with the client). */
  sources: FieldSource[];
  transformation: string | null; // "Sum of 2 W-2 Box 1 values"
  dataState: FieldDataState;
  confidence: number | null; // 0-1, only meaningful when ai-suggested
}

export interface Task {
  id: string;
  returnId: string;
  title: string;
  description: string;
  ownerRole: Role;
  status: "open" | "done";
  priority: "high" | "medium" | "low";
  dueDate: string;
  blocking: boolean;
  linkedDocumentId?: string;
  linkedMessageId?: string;
  linkedFieldId?: string;
}

export interface QuestionnaireItem {
  id: string;
  clientId: string;
  question: string;
  helpText: string;
  answer: string | null;
}

export interface Message {
  id: string;
  returnId: string;
  subject: string;
  visibility: "internal" | "client";
  authorId: string;
  authorName: string;
  authorRole: Role;
  body: string;
  createdAt: string;
  resolved: boolean;
  linkedDocumentId?: string;
  linkedTaskId?: string;
}

export type AIInsightType = "recommendation" | "warning" | "correction";

export interface AIInsight {
  id: string;
  returnId: string;
  relatedFieldId?: string;
  type: AIInsightType;
  title: string;
  message: string;
  rationale: string;
  evidence: { documentId: string; note: string }[];
  confidence: number;
  status: "pending" | "accepted" | "corrected" | "dismissed";
}
