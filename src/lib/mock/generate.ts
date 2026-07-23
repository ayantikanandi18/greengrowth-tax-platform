import { faker } from "@faker-js/faker";
import type {
  AIInsight,
  Client,
  DocumentCategory,
  ExtractedField,
  Message,
  Task,
  TaxDocument,
  TaxReturn,
  User,
} from "./types";

// Seeded so the dataset is stable across reloads/deploys — this is fixture
// data generated once, not something that needs to vary run to run.
faker.seed(42);

// Fixed reference point for this fixture data — using a hardcoded "now"
// instead of the real clock keeps due-date math meaningful regardless of
// when the prototype is actually opened, and keeps date math out of render
// (React 19 flags real Date.now()/new Date() calls during render as impure).
export const NOW = new Date("2026-07-15T09:00:00Z");
const daysAgo = (n: number) => new Date(NOW.getTime() - n * 86400000).toISOString();
const daysFromNow = (n: number) => new Date(NOW.getTime() + n * 86400000).toISOString();

// ---------------------------------------------------------------------------
// Users (firm staff + client portal logins)
// ---------------------------------------------------------------------------

export const USERS: User[] = [
  {
    id: "u-morgan",
    name: "Morgan Ellis",
    initials: "ME",
    roles: ["preparer", "client"],
    title: "Senior Tax Preparer",
    clientId: "c-morgan",
  },
  {
    id: "u-jordan",
    name: "Jordan Osei",
    initials: "JO",
    roles: ["preparer"],
    title: "Seasonal Tax Preparer",
    seasonal: true,
  },
  {
    id: "u-dana",
    name: "Dana Whitfield",
    initials: "DW",
    roles: ["reviewer"],
    title: "Reviewing Preparer",
  },
  {
    id: "u-alex",
    name: "Alex Whitcombe",
    initials: "AW",
    roles: ["admin"],
    title: "Firm Administrator",
  },
  { id: "u-sarah", name: "Sarah Chen", initials: "SC", roles: ["client"], clientId: "c-sarah" },
  { id: "u-elena", name: "Elena Rivera", initials: "ER", roles: ["client"], clientId: "c-rivera" },
  { id: "u-david", name: "David Okafor", initials: "DO", roles: ["client"], clientId: "c-david" },
  { id: "u-priya", name: "Priya Nair", initials: "PN", roles: ["client"], clientId: "c-priya" },
];

// ---------------------------------------------------------------------------
// Clients
// ---------------------------------------------------------------------------

export const CLIENTS: Client[] = [
  {
    id: "c-sarah",
    name: "Sarah Chen",
    type: "individual",
    email: "sarah.chen@example.com",
    assignedPreparerId: "u-morgan",
    assignedReviewerId: "u-dana",
    createdAt: daysAgo(140),
  },
  {
    id: "c-rivera",
    name: "Elena Rivera",
    entityName: "Rivera Consulting LLC",
    type: "business",
    email: "elena@riveraconsulting.example",
    assignedPreparerId: "u-morgan",
    assignedReviewerId: "u-dana",
    createdAt: daysAgo(210),
  },
  {
    id: "c-david",
    name: "David Okafor",
    type: "individual",
    email: "david.okafor@example.com",
    assignedPreparerId: "u-morgan",
    createdAt: daysAgo(95),
  },
  {
    id: "c-priya",
    name: "Priya Nair",
    type: "individual",
    email: "priya.nair@example.com",
    assignedPreparerId: "u-morgan",
    createdAt: daysAgo(0),
  },
  {
    id: "c-morgan",
    name: "Morgan Ellis",
    type: "individual",
    email: "morgan.ellis@alcottreeves.example",
    assignedPreparerId: "u-jordan", // a colleague preparer handles Morgan's own return
    createdAt: daysAgo(30),
  },
];

// ---------------------------------------------------------------------------
// Returns
// ---------------------------------------------------------------------------

export const RETURNS: TaxReturn[] = [
  {
    id: "r-sarah-2025",
    clientId: "c-sarah",
    taxYear: 2025,
    formType: "1040",
    status: "in_review",
    dueDate: daysFromNow(30),
    updatedAt: daysAgo(1),
  },
  {
    id: "r-rivera-2025",
    clientId: "c-rivera",
    taxYear: 2025,
    formType: "1040 + Schedule C",
    status: "in_preparation",
    dueDate: daysFromNow(45),
    updatedAt: daysAgo(2),
  },
  {
    id: "r-david-2025",
    clientId: "c-david",
    taxYear: 2025,
    formType: "1040",
    status: "awaiting_documents",
    dueDate: daysFromNow(10),
    updatedAt: daysAgo(9),
  },
  {
    id: "r-priya-2025",
    clientId: "c-priya",
    taxYear: 2025,
    formType: "1040",
    status: "not_started",
    dueDate: daysFromNow(60),
    updatedAt: daysAgo(0),
  },
  {
    id: "r-morgan-2025",
    clientId: "c-morgan",
    taxYear: 2025,
    formType: "1040",
    status: "in_preparation",
    dueDate: daysFromNow(50),
    updatedAt: daysAgo(4),
  },
];

// ---------------------------------------------------------------------------
// Documents — Sarah Chen (small, curated set for the traceability walkthrough)
// ---------------------------------------------------------------------------

export const SARAH_DOCUMENTS: TaxDocument[] = [
  {
    id: "d-sarah-w2-1",
    returnId: "r-sarah-2025",
    name: "W-2 — Beacon Analytics Inc.",
    docType: "W-2",
    category: "Income",
    uploadedAt: daysAgo(38),
    uploadedBy: "client",
    pageCount: 1,
    vendor: "Beacon Analytics Inc.",
    amount: 96400,
    tags: ["wages", "employer"],
  },
  {
    id: "d-sarah-w2-2",
    returnId: "r-sarah-2025",
    name: "W-2 — Northfield Studio LLC",
    docType: "W-2",
    category: "Income",
    uploadedAt: daysAgo(35),
    uploadedBy: "client",
    pageCount: 1,
    vendor: "Northfield Studio LLC",
    amount: 18200,
    tags: ["wages", "employer"],
  },
  {
    id: "d-sarah-1099int",
    returnId: "r-sarah-2025",
    name: "1099-INT — Meridian Savings Bank",
    docType: "1099-INT",
    category: "Income",
    uploadedAt: daysAgo(35),
    uploadedBy: "client",
    pageCount: 1,
    vendor: "Meridian Savings Bank",
    amount: 612,
    tags: ["interest"],
  },
  {
    id: "d-sarah-1099div",
    returnId: "r-sarah-2025",
    name: "1099-DIV — Cascade Brokerage",
    docType: "1099-DIV",
    category: "Income",
    uploadedAt: daysAgo(34),
    uploadedBy: "client",
    pageCount: 2,
    vendor: "Cascade Brokerage",
    amount: 2140,
    tags: ["dividends"],
  },
  {
    id: "d-sarah-1098",
    returnId: "r-sarah-2025",
    name: "1098 — Mortgage Interest Statement",
    docType: "1098",
    category: "Deductions",
    uploadedAt: daysAgo(30),
    uploadedBy: "client",
    pageCount: 1,
    vendor: "Harborview Home Lending",
    amount: 11250,
    tags: ["mortgage", "itemized"],
  },
  {
    id: "d-sarah-prior-year",
    returnId: "r-sarah-2025",
    name: "2024 Return (Prior Year)",
    docType: "Prior Year Return",
    category: "Prior Year",
    uploadedAt: daysAgo(140),
    uploadedBy: "preparer",
    pageCount: 14,
    tags: ["reference"],
  },
  ...Array.from({ length: 6 }).map((_, i) => ({
    id: `d-sarah-charity-${i + 1}`,
    returnId: "r-sarah-2025",
    name: `Donation Receipt — ${faker.company.name()} Foundation`,
    docType: "Receipt",
    category: "Deductions" as const,
    uploadedAt: daysAgo(28 - i),
    uploadedBy: "client" as const,
    pageCount: 1,
    vendor: `${faker.company.name()} Foundation`,
    amount: faker.number.int({ min: 50, max: 800 }),
    tags: ["charitable", "itemized"],
  })),
];

// ---------------------------------------------------------------------------
// Documents — Rivera Consulting (large volume, for the scale/navigability challenge)
// ---------------------------------------------------------------------------

const EXPENSE_VENDORS_KINDS: [string, string][] = [
  ["Office Supplies", "Staples"],
  ["Software", "Adobe"],
  ["Software", "Google Workspace"],
  ["Travel", "Delta Airlines"],
  ["Travel", "Marriott"],
  ["Meals", "Local Bistro"],
  ["Utilities", "Pacific Power & Light"],
  ["Contractor Payment", "Freelance Designer"],
  ["Equipment", "Best Buy Business"],
  ["Insurance", "Hartford Business Insurance"],
];

function buildRiveraDocuments(): TaxDocument[] {
  const docs: TaxDocument[] = [];
  for (let i = 0; i < 244; i++) {
    const [kind, vendor] = faker.helpers.arrayElement(EXPENSE_VENDORS_KINDS);
    const category = faker.helpers.weightedArrayElement([
      { value: "Business Expenses", weight: 8 },
      { value: "Income", weight: 1 },
      { value: "Deductions", weight: 2 },
      { value: "Correspondence", weight: 1 },
    ]) as DocumentCategory;
    docs.push({
      id: `d-rivera-${i}`,
      returnId: "r-rivera-2025",
      name: `${kind} Receipt — ${vendor}`,
      docType: category === "Income" ? "Invoice" : "Receipt",
      category,
      uploadedAt: daysAgo(faker.number.int({ min: 1, max: 200 })),
      uploadedBy: faker.helpers.arrayElement(["client", "preparer"]),
      pageCount: faker.number.int({ min: 1, max: 3 }),
      vendor,
      amount: faker.number.int({ min: 12, max: 4200 }),
      tags: [kind.toLowerCase().replace(/\s+/g, "-")],
    });
  }
  // A handful of large, distinctive documents so search/filter has clear targets to demo.
  docs.push(
    {
      id: "d-rivera-bank-q1",
      returnId: "r-rivera-2025",
      name: "Business Bank Statement — Q1 2025",
      docType: "Bank Statement",
      category: "Income",
      uploadedAt: daysAgo(190),
      uploadedBy: "client",
      pageCount: 22,
      vendor: "First Cascade Bank",
      tags: ["bank-statement", "quarterly"],
    },
    {
      id: "d-rivera-bank-q2",
      returnId: "r-rivera-2025",
      name: "Business Bank Statement — Q2 2025",
      docType: "Bank Statement",
      category: "Income",
      uploadedAt: daysAgo(100),
      uploadedBy: "client",
      pageCount: 19,
      vendor: "First Cascade Bank",
      tags: ["bank-statement", "quarterly"],
    },
    {
      id: "d-rivera-k1",
      returnId: "r-rivera-2025",
      name: "Schedule K-1 — Rivera Holdings Partnership",
      docType: "K-1",
      category: "Income",
      uploadedAt: daysAgo(60),
      uploadedBy: "client",
      pageCount: 3,
      vendor: "Rivera Holdings Partnership",
      amount: 14200,
      tags: ["k-1", "partnership"],
    },
  );
  return docs;
}

export const RIVERA_DOCUMENTS: TaxDocument[] = buildRiveraDocuments();

export const ALL_DOCUMENTS: TaxDocument[] = [...SARAH_DOCUMENTS, ...RIVERA_DOCUMENTS];

// ---------------------------------------------------------------------------
// Extracted fields — Sarah Chen's return, wired to real source documents
// ---------------------------------------------------------------------------

export const SARAH_FIELDS: ExtractedField[] = [
  {
    id: "f-sarah-wages",
    returnId: "r-sarah-2025",
    fieldLabel: "Form 1040, Line 1a — Wages",
    value: "$114,600",
    sourceDocumentId: "d-sarah-w2-1",
    sourcePage: 1,
    sourceRegionLabel: "Box 1 (+ Box 1 on second W-2)",
    transformation: "Sum of Box 1 from 2 W-2s: $96,400 + $18,200",
    dataState: "verified",
    confidence: 0.98,
  },
  {
    id: "f-sarah-interest",
    returnId: "r-sarah-2025",
    fieldLabel: "Schedule B, Line 1 — Taxable Interest",
    value: "$612",
    sourceDocumentId: "d-sarah-1099int",
    sourcePage: 1,
    sourceRegionLabel: "Box 1",
    transformation: "Direct copy, no transformation",
    dataState: "verified",
    confidence: 0.99,
  },
  {
    id: "f-sarah-dividends",
    returnId: "r-sarah-2025",
    fieldLabel: "Schedule B, Line 5 — Ordinary Dividends",
    value: "$2,140",
    sourceDocumentId: "d-sarah-1099div",
    sourcePage: 1,
    sourceRegionLabel: "Box 1a",
    transformation: "Direct copy, no transformation",
    dataState: "ai-suggested",
    confidence: 0.94,
  },
  {
    id: "f-sarah-mortgage",
    returnId: "r-sarah-2025",
    fieldLabel: "Schedule A, Line 8a — Home Mortgage Interest",
    value: "$11,250",
    sourceDocumentId: "d-sarah-1098",
    sourcePage: 1,
    sourceRegionLabel: "Box 1",
    transformation: "Direct copy, no transformation",
    dataState: "verified",
    confidence: 0.97,
  },
  {
    id: "f-sarah-charity",
    returnId: "r-sarah-2025",
    fieldLabel: "Schedule A, Line 11 — Cash Charitable Contributions",
    value: "$2,385",
    sourceDocumentId: "d-sarah-charity-1",
    sourcePage: 1,
    sourceRegionLabel: "6 receipts",
    transformation: "Sum of 6 donation receipts uploaded to this return",
    dataState: "ai-suggested",
    confidence: 0.88,
  },
  {
    id: "f-sarah-filing-status",
    returnId: "r-sarah-2025",
    fieldLabel: "Form 1040 — Filing Status",
    value: "Single",
    sourceDocumentId: null,
    sourcePage: null,
    sourceRegionLabel: null,
    transformation: "Confirmed directly with client, no source document",
    dataState: "locked",
    confidence: null,
  },
  {
    id: "f-sarah-agi",
    returnId: "r-sarah-2025",
    fieldLabel: "Form 1040, Line 11 — Adjusted Gross Income",
    value: "$117,352",
    sourceDocumentId: null,
    sourcePage: null,
    sourceRegionLabel: null,
    transformation: "Computed: wages + interest + dividends, less adjustments",
    dataState: "needs-input",
    confidence: null,
  },
];

// ---------------------------------------------------------------------------
// Tasks
// ---------------------------------------------------------------------------

export const TASKS: Task[] = [
  {
    id: "t-david-w2",
    returnId: "r-david-2025",
    title: "Upload your W-2",
    description: "We don't have a W-2 on file yet for David's 2025 return.",
    ownerRole: "client",
    status: "open",
    priority: "high",
    dueDate: daysFromNow(3),
    blocking: true,
  },
  {
    id: "t-david-bank",
    returnId: "r-david-2025",
    title: "Confirm bank details for direct deposit",
    description: "Needed before the return can be filed.",
    ownerRole: "client",
    status: "open",
    priority: "medium",
    dueDate: daysFromNow(8),
    blocking: false,
  },
  {
    id: "t-sarah-review-dividends",
    returnId: "r-sarah-2025",
    title: "Verify AI-suggested dividend figure",
    description: "Confirm the $2,140 ordinary dividend figure against the 1099-DIV before filing.",
    ownerRole: "preparer",
    status: "open",
    priority: "medium",
    dueDate: daysFromNow(5),
    blocking: false,
    linkedDocumentId: "d-sarah-1099div",
  },
  {
    id: "t-sarah-agi",
    returnId: "r-sarah-2025",
    title: "Finalize AGI calculation",
    description: "AGI depends on confirming above-the-line adjustments with the client.",
    ownerRole: "preparer",
    status: "open",
    priority: "high",
    dueDate: daysFromNow(4),
    blocking: true,
  },
  {
    id: "t-rivera-categorize",
    returnId: "r-rivera-2025",
    title: "Categorize Q2 bank statement transactions",
    description: "244 expense documents uploaded — categorize against Schedule C lines.",
    ownerRole: "preparer",
    status: "open",
    priority: "high",
    dueDate: daysFromNow(12),
    blocking: false,
    linkedDocumentId: "d-rivera-bank-q2",
  },
  {
    id: "t-rivera-k1",
    returnId: "r-rivera-2025",
    title: "Confirm K-1 partnership income treatment",
    description: "Needs reviewer sign-off on passive vs. active income classification.",
    ownerRole: "reviewer",
    status: "open",
    priority: "medium",
    dueDate: daysFromNow(20),
    blocking: false,
    linkedDocumentId: "d-rivera-k1",
  },
  {
    id: "t-priya-questionnaire",
    returnId: "r-priya-2025",
    title: "Complete your intake questionnaire",
    description: "First step — tells us what documents to request.",
    ownerRole: "client",
    status: "open",
    priority: "high",
    dueDate: daysFromNow(7),
    blocking: true,
  },
  {
    id: "t-morgan-w2",
    returnId: "r-morgan-2025",
    title: "Upload W-2",
    description: "Standard first document request.",
    ownerRole: "client",
    status: "open",
    priority: "medium",
    dueDate: daysFromNow(15),
    blocking: false,
  },
];

// ---------------------------------------------------------------------------
// Messages
// ---------------------------------------------------------------------------

export const MESSAGES: Message[] = [
  {
    id: "m-sarah-1",
    returnId: "r-sarah-2025",
    subject: "Question about your dividend statement",
    visibility: "client",
    authorId: "u-morgan",
    authorName: "Morgan Ellis",
    authorRole: "preparer",
    body: "Hi Sarah — I see a 1099-DIV from Cascade Brokerage. Can you confirm this account was open for all of 2025, or did you open it partway through the year?",
    createdAt: daysAgo(6),
    resolved: false,
    linkedDocumentId: "d-sarah-1099div",
  },
  {
    id: "m-sarah-2",
    returnId: "r-sarah-2025",
    subject: "Question about your dividend statement",
    visibility: "client",
    authorId: "u-sarah",
    authorName: "Sarah Chen",
    authorRole: "client",
    body: "It was open all year — I just moved some funds around in March.",
    createdAt: daysAgo(5),
    resolved: false,
    linkedDocumentId: "d-sarah-1099div",
  },
  {
    id: "m-sarah-internal-1",
    returnId: "r-sarah-2025",
    subject: "Reviewer note",
    visibility: "internal",
    authorId: "u-dana",
    authorName: "Dana Whitfield",
    authorRole: "reviewer",
    body: "Charitable deduction total looks reasonable vs. last year's return, but flag if it grows further before filing.",
    createdAt: daysAgo(2),
    resolved: false,
  },
  {
    id: "m-david-1",
    returnId: "r-david-2025",
    subject: "We're missing your W-2",
    visibility: "client",
    authorId: "u-morgan",
    authorName: "Morgan Ellis",
    authorRole: "preparer",
    body: "Hi David — we can't move forward on your return until we receive your W-2. Could you upload it from your employer portal or take a photo of the paper copy?",
    createdAt: daysAgo(9),
    resolved: false,
    linkedTaskId: "t-david-w2",
  },
  {
    id: "m-rivera-internal-1",
    returnId: "r-rivera-2025",
    subject: "K-1 classification",
    visibility: "internal",
    authorId: "u-morgan",
    authorName: "Morgan Ellis",
    authorRole: "preparer",
    body: "Dana — can you take a look at the Rivera Holdings K-1? Want a second opinion on passive vs. active before I finalize Schedule E.",
    createdAt: daysAgo(3),
    resolved: false,
    linkedDocumentId: "d-rivera-k1",
    linkedTaskId: "t-rivera-k1",
  },
];

// ---------------------------------------------------------------------------
// AI Insights (entirely fabricated — see ai-stub.ts)
// ---------------------------------------------------------------------------

export const AI_INSIGHTS: AIInsight[] = [
  {
    id: "ai-sarah-dividend",
    returnId: "r-sarah-2025",
    relatedFieldId: "f-sarah-dividends",
    type: "recommendation",
    title: "Dividend figure ready for your review",
    message: "Extracted $2,140 in ordinary dividends from the Cascade Brokerage 1099-DIV.",
    rationale:
      "Box 1a on the uploaded 1099-DIV reads $2,140. This matches the format of prior-year dividend entries for this client.",
    evidence: [{ documentId: "d-sarah-1099div", note: "1099-DIV, Box 1a, page 1" }],
    confidence: 0.94,
    status: "pending",
  },
  {
    id: "ai-sarah-charity",
    returnId: "r-sarah-2025",
    relatedFieldId: "f-sarah-charity",
    type: "recommendation",
    title: "Charitable deduction totaled from 6 receipts",
    message: "Summed 6 donation receipts to $2,385 in cash charitable contributions.",
    rationale:
      "Each receipt names a distinct 501(c)(3)-style organization and a dollar amount. No duplicate vendors detected across the 6 receipts.",
    evidence: SARAH_DOCUMENTS.filter((d) => d.docType === "Receipt").map((d) => ({
      documentId: d.id,
      note: `${d.vendor} — $${d.amount}`,
    })),
    confidence: 0.88,
    status: "pending",
  },
  {
    id: "ai-sarah-warning-agi",
    returnId: "r-sarah-2025",
    type: "warning",
    title: "AGI can't be finalized yet",
    message: "Adjusted Gross Income depends on above-the-line adjustments not yet confirmed.",
    rationale:
      "No retirement contribution or HSA documents have been uploaded. If any exist, AGI will change.",
    evidence: [],
    confidence: 0.99,
    status: "pending",
  },
  {
    id: "ai-rivera-warning-k1",
    returnId: "r-rivera-2025",
    type: "warning",
    title: "K-1 income classification needs a human call",
    message: "This K-1 could be treated as passive or active partnership income depending on hours worked.",
    rationale:
      "The document doesn't state material participation hours. This determination changes whether losses are limited.",
    evidence: [{ documentId: "d-rivera-k1", note: "Schedule K-1, page 1" }],
    confidence: 0.62,
    status: "pending",
  },
  {
    id: "ai-rivera-correction",
    returnId: "r-rivera-2025",
    type: "correction",
    title: "Possible duplicate expense detected",
    message: "Two receipts from 'Adobe' on the same date for the same amount may be a duplicate upload.",
    rationale: "Same vendor, same amount, uploaded within the same session — a common duplicate-upload pattern.",
    evidence: [{ documentId: "d-rivera-0", note: "Flagged during batch categorization" }],
    confidence: 0.71,
    status: "pending",
  },
];
