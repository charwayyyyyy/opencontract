/**
 * StatusBadge — the central component for displaying procurement lifecycle states.
 * Color is semantic: green=positive/complete, amber=attention, red=error/cancelled,
 * blue=informational, grey=neutral.
 * Never relies on color alone — always includes text.
 */

import { cn } from "@/lib/utils";
import {
  procurementStatusLabel,
  anchorStatusLabel,
  signalTypeLabel,
} from "@/lib/utils";

type StatusVariant =
  | "procurement"
  | "contract"
  | "blockchain"
  | "document"
  | "signal"
  | "bid"
  | "award"
  | "payment";

interface StatusBadgeProps {
  status: string;
  variant?: StatusVariant;
  className?: string;
}

const procurementStatusClass: Record<string, string> = {
  DRAFT: "badge-neutral",
  PUBLISHED: "badge-info",
  OPEN: "badge-success",
  CLOSED: "badge-neutral",
  EVALUATION: "badge-warning",
  AWARDED: "badge-info",
  CONTRACTED: "badge-success",
  IMPLEMENTATION: "badge-warning",
  COMPLETED: "badge-success",
  CANCELLED: "badge-error",
};

const contractStatusClass: Record<string, string> = {
  DRAFT: "badge-neutral",
  ACTIVE: "badge-success",
  AMENDED: "badge-warning",
  SUSPENDED: "badge-warning",
  COMPLETED: "badge-success",
  TERMINATED: "badge-error",
};

const blockchainStatusClass: Record<string, string> = {
  PENDING: "badge-warning",
  SUBMITTED: "badge-info",
  CONFIRMED: "badge-success",
  FAILED: "badge-error",
};

const documentStatusClass: Record<string, string> = {
  UPLOADING: "badge-info",
  PROCESSING: "badge-warning",
  REGISTERED: "badge-success",
  FAILED: "badge-error",
};

const signalSeverityClass: Record<string, string> = {
  INFO: "badge-info",
  LOW: "badge-success",
  MEDIUM: "badge-warning",
  HIGH: "badge-error",
};

const bidStatusClass: Record<string, string> = {
  DRAFT: "badge-neutral",
  SUBMITTED: "badge-info",
  WITHDRAWN: "badge-neutral",
  DISQUALIFIED: "badge-error",
  SHORTLISTED: "badge-warning",
  AWARDED: "badge-success",
  UNSUCCESSFUL: "badge-neutral",
};

const awardStatusClass: Record<string, string> = {
  PENDING: "badge-warning",
  PUBLISHED: "badge-success",
  CANCELLED: "badge-neutral",
  WITHDRAWN: "badge-error",
};

const paymentStatusClass: Record<string, string> = {
  PENDING: "badge-warning",
  PROCESSED: "badge-success",
  FAILED: "badge-error",
  REVERSED: "badge-neutral",
};

function getStatusClass(status: string, variant?: StatusVariant): string {
  switch (variant) {
    case "contract":
      return contractStatusClass[status] ?? "badge-neutral";
    case "blockchain":
      return blockchainStatusClass[status] ?? "badge-neutral";
    case "document":
      return documentStatusClass[status] ?? "badge-neutral";
    case "signal":
      return signalSeverityClass[status] ?? "badge-neutral";
    case "bid":
      return bidStatusClass[status] ?? "badge-neutral";
    case "award":
      return awardStatusClass[status] ?? "badge-neutral";
    case "payment":
      return paymentStatusClass[status] ?? "badge-neutral";
    default:
      return procurementStatusClass[status] ?? "badge-neutral";
  }
}

function getStatusLabel(status: string, variant?: StatusVariant): string {
  if (variant === "blockchain") return anchorStatusLabel(status);
  if (variant === "signal") {
    const labels: Record<string, string> = {
      INFO: "Info",
      LOW: "Low",
      MEDIUM: "Medium",
      HIGH: "High",
    };
    return labels[status] ?? status;
  }
  return procurementStatusLabel(status);
}

export function StatusBadge({ status, variant, className }: StatusBadgeProps) {
  return (
    <span
      className={cn(getStatusClass(status, variant), className)}
      aria-label={`Status: ${getStatusLabel(status, variant)}`}
    >
      {getStatusLabel(status, variant)}
    </span>
  );
}

// Inline blockchain verification indicator
export function VerificationBadge({
  status,
  className,
}: {
  status: string;
  className?: string;
}) {
  if (status === "CONFIRMED") {
    return (
      <span
        className={cn("badge-success inline-flex items-center gap-1", className)}
        aria-label="Blockchain confirmed"
      >
        <span className="h-1.5 w-1.5 rounded-full bg-current" aria-hidden />
        Verified
      </span>
    );
  }
  if (status === "PENDING" || status === "SUBMITTED") {
    return (
      <span
        className={cn("badge-warning inline-flex items-center gap-1", className)}
        aria-label="Blockchain pending"
      >
        <span className="h-1.5 w-1.5 rounded-full bg-current animate-pulse" aria-hidden />
        Pending
      </span>
    );
  }
  if (status === "FAILED") {
    return (
      <span
        className={cn("badge-error inline-flex items-center gap-1", className)}
        aria-label="Blockchain failed"
      >
        Failed
      </span>
    );
  }
  return null;
}
