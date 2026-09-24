import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Format monetary values — never use floating point
export function formatMoney(
  amount: string | number | null | undefined,
  currency: string = "GHS",
  options?: Intl.NumberFormatOptions
): string {
  if (amount === null || amount === undefined) return "—";
  const num = typeof amount === "string" ? parseFloat(amount) : amount;
  if (isNaN(num)) return "—";

  const symbol = currency === "GHS" ? "₵" : currency;
  const formatted = new Intl.NumberFormat("en-GH", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
    ...options,
  }).format(num);

  return `${symbol}${formatted}`;
}

// Compact money: ₵4.8M, ₵340K
export function formatMoneyCompact(
  amount: string | number | null | undefined,
  currency: string = "GHS"
): string {
  if (amount === null || amount === undefined) return "—";
  const num = typeof amount === "string" ? parseFloat(amount) : amount;
  if (isNaN(num)) return "—";
  const symbol = currency === "GHS" ? "₵" : currency;

  if (num >= 1_000_000_000) return `${symbol}${(num / 1_000_000_000).toFixed(1)}B`;
  if (num >= 1_000_000) return `${symbol}${(num / 1_000_000).toFixed(1)}M`;
  if (num >= 1_000) return `${symbol}${(num / 1_000).toFixed(0)}K`;
  return `${symbol}${num.toFixed(2)}`;
}

// Calculate percentage change — precise string arithmetic
export function calcChangePercent(
  previous: string | number,
  current: string | number
): number {
  const prev = typeof previous === "string" ? parseFloat(previous) : previous;
  const curr = typeof current === "string" ? parseFloat(current) : current;
  if (prev === 0) return 0;
  return ((curr - prev) / prev) * 100;
}

// Shorten a hex hash for display: 0x8a4f...3c2d
export function shortenHash(hash: string, chars: number = 6): string {
  if (!hash) return "";
  if (hash.length <= chars * 2 + 2) return hash;
  return `${hash.slice(0, chars + 2)}...${hash.slice(-chars)}`;
}

// Format date for display
export function formatDate(
  date: string | Date | null | undefined,
  options?: Intl.DateTimeFormatOptions
): string {
  if (!date) return "—";
  const d = typeof date === "string" ? new Date(date) : date;
  return d.toLocaleDateString("en-GH", {
    day: "numeric",
    month: "short",
    year: "numeric",
    ...options,
  });
}

export function formatDateTime(date: string | Date | null | undefined): string {
  if (!date) return "—";
  const d = typeof date === "string" ? new Date(date) : date;
  return d.toLocaleString("en-GH", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    timeZoneName: "short",
  });
}

// Format file size
export function formatFileSize(bytes: string | number | bigint): string {
  const n = typeof bytes === "bigint" ? Number(bytes) : Number(bytes);
  if (n < 1024) return `${n} B`;
  if (n < 1024 * 1024) return `${(n / 1024).toFixed(1)} KB`;
  if (n < 1024 * 1024 * 1024) return `${(n / (1024 * 1024)).toFixed(1)} MB`;
  return `${(n / (1024 * 1024 * 1024)).toFixed(1)} GB`;
}

// Procurement status label
export function procurementStatusLabel(status: string): string {
  const labels: Record<string, string> = {
    DRAFT: "Draft",
    PUBLISHED: "Published",
    OPEN: "Open",
    CLOSED: "Closed",
    EVALUATION: "Under evaluation",
    AWARDED: "Awarded",
    CONTRACTED: "Contracted",
    IMPLEMENTATION: "In implementation",
    COMPLETED: "Completed",
    CANCELLED: "Cancelled",
  };
  return labels[status] ?? status;
}

// Blockchain anchor status label
export function anchorStatusLabel(status: string): string {
  const labels: Record<string, string> = {
    PENDING: "Pending",
    SUBMITTED: "Submitted",
    CONFIRMED: "Confirmed",
    FAILED: "Failed",
  };
  return labels[status] ?? status;
}

// Signal type label
export function signalTypeLabel(type: string): string {
  const labels: Record<string, string> = {
    SINGLE_BIDDER: "Single bidder",
    SIGNIFICANT_AMENDMENT: "Significant amendment",
    DELAYED_IMPLEMENTATION: "Delayed implementation",
    MISSING_UPDATE: "Missing update",
    SUPPLIER_CONCENTRATION: "Supplier concentration",
  };
  return labels[type] ?? type;
}

// Procurement method label
export function methodLabel(method: string): string {
  const labels: Record<string, string> = {
    OPEN_TENDERING: "Open tendering",
    RESTRICTED_TENDERING: "Restricted tendering",
    REQUEST_FOR_QUOTATION: "Request for quotation",
    SINGLE_SOURCE: "Single source",
    FRAMEWORK_AGREEMENT: "Framework agreement",
    DIRECT_AWARD: "Direct award",
  };
  return labels[method] ?? method;
}

// Document category label
export function documentCategoryLabel(category: string): string {
  const labels: Record<string, string> = {
    TENDER_NOTICE: "Tender notice",
    BID_DOCUMENT: "Bid document",
    EVALUATION_REPORT: "Evaluation report",
    AWARD_NOTICE: "Award notice",
    CONTRACT_DOCUMENT: "Contract",
    AMENDMENT_DOCUMENT: "Amendment",
    PAYMENT_CERTIFICATE: "Payment certificate",
    INSPECTION_REPORT: "Inspection report",
    COMPLETION_CERTIFICATE: "Completion certificate",
    OTHER: "Document",
  };
  return labels[category] ?? category;
}

// Blockchain explorer URL
export function explorerUrl(
  hash: string,
  type: "tx" | "address" | "block" = "tx",
  network: string = "base-sepolia"
): string {
  const explorers: Record<string, string> = {
    "base-sepolia": "https://sepolia.basescan.org",
    "ethereum-sepolia": "https://sepolia.etherscan.io",
    "anvil-local": "",
  };
  const base = explorers[network] ?? explorers["base-sepolia"];
  if (!base) return "#";
  const paths: Record<string, string> = {
    tx: "tx",
    address: "address",
    block: "block",
  };
  return `${base}/${paths[type]}/${hash}`;
}

// Generate OCID
export function generateOCID(sequence: number): string {
  const padded = String(sequence).padStart(6, "0");
  return `ocds-demo-2026-${padded}`;
}

// Canonical object serialization for hashing
export function canonicalize(obj: unknown): string {
  return JSON.stringify(sortDeep(obj));
}

function sortDeep(obj: unknown): unknown {
  if (Array.isArray(obj)) return obj.map(sortDeep);
  if (obj !== null && typeof obj === "object") {
    return Object.keys(obj as Record<string, unknown>)
      .sort()
      .reduce<Record<string, unknown>>((acc, key) => {
        acc[key] = sortDeep((obj as Record<string, unknown>)[key]);
        return acc;
      }, {});
  }
  return obj;
}

// Rate limit helper
export function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
