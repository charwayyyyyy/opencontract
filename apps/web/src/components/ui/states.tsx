import { cn } from "@/lib/utils";
import { AlertCircle, Info, CheckCircle, AlertTriangle } from "lucide-react";

// ============================================================
// Empty State
// ============================================================

interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  action?: React.ReactNode;
  className?: string;
}

export function EmptyState({
  icon,
  title,
  description,
  action,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center py-16 px-8 text-center",
        className
      )}
      role="status"
      aria-label={title}
    >
      {icon && (
        <div className="mb-4 text-text-muted" aria-hidden>
          {icon}
        </div>
      )}
      <h3 className="text-base font-medium text-text-primary">{title}</h3>
      {description && (
        <p className="mt-1.5 text-sm text-text-secondary max-w-sm">{description}</p>
      )}
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}

// ============================================================
// Error State
// ============================================================

interface ErrorStateProps {
  title?: string;
  description?: string;
  action?: React.ReactNode;
  className?: string;
}

export function ErrorState({
  title = "Something went wrong",
  description = "We couldn't load this content. Try again. If the problem continues, the service may be temporarily unavailable.",
  action,
  className,
}: ErrorStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center py-16 px-8 text-center",
        className
      )}
      role="alert"
      aria-live="assertive"
    >
      <AlertCircle
        className="h-10 w-10 text-[hsl(var(--status-error))] mb-4"
        aria-hidden
      />
      <h3 className="text-base font-medium text-text-primary">{title}</h3>
      <p className="mt-1.5 text-sm text-text-secondary max-w-sm">{description}</p>
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}

// ============================================================
// Loading Skeleton
// ============================================================

interface SkeletonProps {
  className?: string;
}

export function Skeleton({ className }: SkeletonProps) {
  return (
    <div
      className={cn("skeleton h-4 w-full rounded", className)}
      aria-hidden
      role="presentation"
    />
  );
}

// Procurement list skeleton
export function ProcurementListSkeleton() {
  return (
    <div aria-label="Loading procurements" role="status">
      <span className="sr-only">Loading…</span>
      <div className="space-y-0 divide-y divide-border">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="py-5 px-4 flex flex-col gap-2">
            <div className="flex items-start justify-between">
              <div className="flex-1 space-y-2">
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-3 w-1/3" />
              </div>
              <Skeleton className="h-5 w-16 ml-4 rounded-full" />
            </div>
            <div className="flex gap-4 mt-1">
              <Skeleton className="h-3 w-24" />
              <Skeleton className="h-3 w-20" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// Contract detail skeleton
export function ContractDetailSkeleton() {
  return (
    <div aria-label="Loading contract" role="status">
      <span className="sr-only">Loading contract details…</span>
      <div className="page-header-inner">
        <Skeleton className="h-6 w-16 mb-3" />
        <Skeleton className="h-9 w-3/4 mb-2" />
        <Skeleton className="h-4 w-1/3" />
      </div>
      <div className="container-editorial py-8 space-y-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="card-padded space-y-2">
              <Skeleton className="h-3 w-16" />
              <Skeleton className="h-7 w-24" />
            </div>
          ))}
        </div>
        <div className="space-y-4">
          <Skeleton className="h-5 w-24" />
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="timeline-item">
              <div className="h-8 w-8 rounded-full skeleton" />
              <div className="flex-1 space-y-2 pt-1">
                <Skeleton className="h-4 w-1/4" />
                <Skeleton className="h-3 w-1/2" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ============================================================
// Alert Components
// ============================================================

interface AlertProps {
  variant: "info" | "success" | "warning" | "error";
  title?: string;
  children: React.ReactNode;
  className?: string;
}

export function Alert({ variant, title, children, className }: AlertProps) {
  const icons = {
    info: <Info className="h-4 w-4 flex-shrink-0 text-[hsl(var(--status-info))]" />,
    success: <CheckCircle className="h-4 w-4 flex-shrink-0 text-[hsl(var(--status-success))]" />,
    warning: <AlertTriangle className="h-4 w-4 flex-shrink-0 text-[hsl(var(--status-warning))]" />,
    error: <AlertCircle className="h-4 w-4 flex-shrink-0 text-[hsl(var(--status-error))]" />,
  };

  const classes = {
    info: "alert-info",
    success: "alert-success",
    warning: "alert-warning",
    error: "alert-error",
  };

  const textColors = {
    info: "text-[hsl(212,47%,35%)]",
    success: "text-[hsl(149,35%,28%)]",
    warning: "text-[hsl(35,59%,33%)]",
    error: "text-[hsl(0,45%,38%)]",
  };

  return (
    <div
      className={cn(classes[variant], className)}
      role={variant === "error" ? "alert" : "status"}
      aria-live={variant === "error" ? "assertive" : "polite"}
    >
      {icons[variant]}
      <div className={cn("text-sm", textColors[variant])}>
        {title && <p className="font-medium mb-0.5">{title}</p>}
        {children}
      </div>
    </div>
  );
}

// ============================================================
// Loading Spinner (inline use only)
// ============================================================

export function Spinner({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        "inline-block h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent",
        className
      )}
      aria-hidden
    />
  );
}
