// OpenContract — Shared Types
// These types are used across web app, worker, and packages.
// They mirror Prisma enums but are independent so the web layer
// doesn't need to import Prisma types directly everywhere.

export type UserRole =
  | "PUBLIC"
  | "CONTRACTOR"
  | "PROCUREMENT_OFFICER"
  | "EVALUATOR"
  | "AUDITOR"
  | "ADMIN";

export type ProcurementStatus =
  | "DRAFT"
  | "PUBLISHED"
  | "OPEN"
  | "CLOSED"
  | "EVALUATION"
  | "AWARDED"
  | "CONTRACTED"
  | "IMPLEMENTATION"
  | "COMPLETED"
  | "CANCELLED";

export type ProcurementMethod =
  | "OPEN_TENDERING"
  | "RESTRICTED_TENDERING"
  | "REQUEST_FOR_QUOTATION"
  | "SINGLE_SOURCE"
  | "FRAMEWORK_AGREEMENT"
  | "DIRECT_AWARD";

export type TenderStatus = "DRAFT" | "PUBLISHED" | "OPEN" | "CLOSED" | "CANCELLED";

export type BidStatus =
  | "DRAFT"
  | "SUBMITTED"
  | "WITHDRAWN"
  | "DISQUALIFIED"
  | "SHORTLISTED"
  | "AWARDED"
  | "UNSUCCESSFUL";

export type AwardStatus = "PENDING" | "PUBLISHED" | "CANCELLED" | "WITHDRAWN";

export type ContractStatus =
  | "DRAFT"
  | "ACTIVE"
  | "AMENDED"
  | "SUSPENDED"
  | "COMPLETED"
  | "TERMINATED";

export type PaymentStatus = "PENDING" | "PROCESSED" | "FAILED" | "REVERSED";

export type MilestoneStatus =
  | "PENDING"
  | "IN_PROGRESS"
  | "COMPLETED"
  | "DELAYED"
  | "CANCELLED";

export type DocumentVisibility = "PUBLIC" | "RESTRICTED" | "PRIVATE";

export type DocumentCategory =
  | "TENDER_NOTICE"
  | "BID_DOCUMENT"
  | "EVALUATION_REPORT"
  | "AWARD_NOTICE"
  | "CONTRACT_DOCUMENT"
  | "AMENDMENT_DOCUMENT"
  | "PAYMENT_CERTIFICATE"
  | "INSPECTION_REPORT"
  | "COMPLETION_CERTIFICATE"
  | "OTHER";

export type DocumentStatus = "UPLOADING" | "PROCESSING" | "REGISTERED" | "FAILED";

export type BlockchainAnchorStatus = "PENDING" | "SUBMITTED" | "CONFIRMED" | "FAILED";

export type BlockchainEventType =
  | "PROCUREMENT_CREATED"
  | "TENDER_PUBLISHED"
  | "BID_COMMITTED"
  | "SUBMISSIONS_CLOSED"
  | "BIDS_OPENED"
  | "EVALUATION_PUBLISHED"
  | "AWARD_PUBLISHED"
  | "CONTRACT_CREATED"
  | "CONTRACT_AMENDED"
  | "PAYMENT_RECORDED"
  | "MILESTONE_RECORDED"
  | "INSPECTION_RECORDED"
  | "CONTRACT_COMPLETED";

export type SignalType =
  | "SINGLE_BIDDER"
  | "SIGNIFICANT_AMENDMENT"
  | "DELAYED_IMPLEMENTATION"
  | "MISSING_UPDATE"
  | "SUPPLIER_CONCENTRATION";

export type SignalSeverity = "INFO" | "LOW" | "MEDIUM" | "HIGH";

export type OrganizationType =
  | "PUBLIC_ENTITY"
  | "CONTRACTOR"
  | "AUDITOR"
  | "CIVIL_SOCIETY"
  | "RESEARCHER";

// ============================================================
// API Response Types
// ============================================================

export interface ApiSuccess<T> {
  data: T;
  meta?: {
    total?: number;
    page?: number;
    pageSize?: number;
    hasMore?: boolean;
  };
}

export interface ApiError {
  error: {
    code: string;
    message: string;
    requestId?: string;
    fields?: Record<string, string[]>;
  };
}

export type ApiResponse<T> = ApiSuccess<T> | ApiError;

// ============================================================
// Procurement Public View Types
// ============================================================

export interface ProcurementSummary {
  id: string;
  ocid: string;
  title: string;
  description: string | null;
  status: ProcurementStatus;
  method: ProcurementMethod;
  currency: string;
  estimatedValue: string | null; // serialized Decimal
  region: string | null;
  category: string | null;
  isDemo: boolean;
  publishedAt: string | null;
  createdAt: string;
  procuringEntity: {
    id: string;
    name: string;
    shortName: string | null;
  };
  supplierName: string | null; // from award if awarded
  signalCount: number;
  hasVerifiedDocuments: boolean;
}

export interface ProcurementDetail extends ProcurementSummary {
  tender: TenderSummary | null;
  bids: BidPublicView[];
  awards: AwardSummary[];
  contracts: ContractSummary[];
  documents: DocumentSummary[];
  signals: SignalSummary[];
  timeline: TimelineEvent[];
  blockchainAnchors: BlockchainAnchorSummary[];
}

export interface TenderSummary {
  id: string;
  title: string;
  description: string | null;
  openingDate: string;
  closingDate: string;
  status: TenderStatus;
  method: ProcurementMethod;
  eligibilityRequirements: string | null;
  evaluationCriteria: string | null;
  publishedAt: string | null;
}

export interface BidPublicView {
  id: string;
  submissionRef: string;
  submittedAt: string;
  status: BidStatus;
  // Amount and bidder details only visible post-award or to authorized users
  bidderName: string | null;
  amount: string | null;
}

export interface AwardSummary {
  id: string;
  supplierId: string;
  supplierName: string;
  amount: string;
  currency: string;
  awardDate: string;
  status: AwardStatus;
  justification: string | null;
}

export interface ContractSummary {
  id: string;
  contractRef: string;
  originalAmount: string;
  currentAmount: string;
  currency: string;
  startDate: string;
  endDate: string | null;
  status: ContractStatus;
  amendments: AmendmentSummary[];
  totalPaid: string;
  percentagePaid: number;
}

export interface AmendmentSummary {
  id: string;
  amendmentNumber: number;
  reason: string;
  previousAmount: string;
  newAmount: string;
  currency: string;
  changeAmount: string;
  changePct: number;
  effectiveDate: string;
}

export interface DocumentSummary {
  id: string;
  filename: string;
  originalName: string;
  mimeType: string;
  sizeBytes: string;
  sha256: string;
  category: DocumentCategory;
  visibility: DocumentVisibility;
  status: DocumentStatus;
  createdAt: string;
  isDemo: boolean;
}

export interface BlockchainAnchorSummary {
  id: string;
  eventType: BlockchainEventType;
  status: BlockchainAnchorStatus;
  network: string;
  contractAddress: string | null;
  transactionHash: string | null;
  blockNumber: string | null;
  confirmedAt: string | null;
  dataHash: string;
  createdAt: string;
}

export interface SignalSummary {
  id: string;
  signalType: SignalType;
  severity: SignalSeverity;
  explanation: string;
  evidence: unknown;
  isResolved: boolean;
  createdAt: string;
}

export interface TimelineEvent {
  id: string;
  date: string;
  type: BlockchainEventType | "STAGE_CHANGE";
  label: string;
  description: string | null;
  actor: string | null;
  isVerified: boolean;
  blockchainAnchor: BlockchainAnchorSummary | null;
  documents: DocumentSummary[];
}

// ============================================================
// Document Verification
// ============================================================

export type VerificationOutcome =
  | "VERIFIED"
  | "MISMATCH"
  | "NOT_REGISTERED"
  | "PENDING"
  | "ERROR";

export interface VerificationResult {
  outcome: VerificationOutcome;
  sha256: string;
  matchedDocument?: DocumentSummary & {
    ocid?: string;
    procurementTitle?: string;
  };
  registeredAt?: string;
  blockchainStatus?: BlockchainAnchorStatus;
  transactionHash?: string | null;
}

// ============================================================
// Statistics
// ============================================================

export interface PublicStatistics {
  totalProcurements: number;
  activeTenders: number;
  activeContracts: number;
  totalContractValue: string;
  pendingSignals: number;
  verifiedDocuments: number;
}

// ============================================================
// Signals
// ============================================================

export interface SignalDetail extends SignalSummary {
  procurementId: string;
  procurementOcid: string;
  procurementTitle: string;
  resolvedAt: string | null;
  resolvedNote: string | null;
}
