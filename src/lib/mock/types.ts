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
  color: "muted" | "warning" | "info" | "good";
  blocking: boolean;
  ownerRole: Role | "none";
}

export const STATUS_META: Record<ReturnStatus, StatusMeta> = {
  not_started: {
    clientLabel: "Let's get started",
    staffLabel: "Not Started",
    description: "The return hasn't been opened yet.",
    color: "muted",
    blocking: false,
    ownerRole: "preparer",
  },
  awaiting_documents: {
    clientLabel: "Action needed: upload your documents",
    staffLabel: "Awaiting Documents (Client)",
    description: "Waiting on the client to upload requested documents.",
    color: "warning",
    blocking: true,
    ownerRole: "client",
  },
  in_preparation: {
    clientLabel: "We're preparing your return",
    staffLabel: "In Preparation",
    description: "Preparer is actively working on the return.",
    color: "info",
    blocking: false,
    ownerRole: "preparer",
  },
  awaiting_client_response: {
    clientLabel: "Action needed: answer a question",
    staffLabel: "Awaiting Client Response",
    description: "Preparer asked a question that's blocking progress.",
    color: "warning",
    blocking: true,
    ownerRole: "client",
  },
  in_review: {
    clientLabel: "Final review in progress",
    staffLabel: "In Review",
    description: "A reviewer is checking the completed return.",
    color: "info",
    blocking: false,
    ownerRole: "reviewer",
  },
  ready_to_file: {
    clientLabel: "Action needed: review & sign to file",
    staffLabel: "Ready for Signature",
    description: "Return is complete and awaiting the client's e-signature.",
    color: "good",
    blocking: true,
    ownerRole: "client",
  },
  filed: {
    clientLabel: "Filed",
    staffLabel: "Filed",
    description: "The return has been filed.",
    color: "good",
    blocking: false,
    ownerRole: "none",
  },
};

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

export interface ExtractedField {
  id: string;
  returnId: string;
  fieldLabel: string; // "Form 1040, Line 1a — Wages"
  value: string;
  sourceDocumentId: string | null;
  sourcePage: number | null;
  sourceRegionLabel: string | null; // "Box 1"
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
