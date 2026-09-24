"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Search, Filter, X, ChevronRight, AlertTriangle, Shield } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/ui/status-badge";
import { EmptyState, ErrorState, ProcurementListSkeleton } from "@/components/ui/states";
import { formatMoneyCompact, formatDate, methodLabel, procurementStatusLabel } from "@/lib/utils";
import type { ProcurementSummary } from "@opencontract/types";

interface SearchResult {
  items: ProcurementSummary[];
  total: number;
  page: number;
  pageSize: number;
  hasMore: boolean;
}

const STATUS_OPTIONS = [
  { value: "", label: "All statuses" },
  { value: "OPEN", label: "Open" },
  { value: "AWARDED", label: "Awarded" },
  { value: "CONTRACTED", label: "Contracted" },
  { value: "IMPLEMENTATION", label: "In implementation" },
  { value: "COMPLETED", label: "Completed" },
  { value: "EVALUATION", label: "Under evaluation" },
  { value: "CLOSED", label: "Closed" },
  { value: "CANCELLED", label: "Cancelled" },
];

const METHOD_OPTIONS = [
  { value: "", label: "All methods" },
  { value: "OPEN_TENDERING", label: "Open tendering" },
  { value: "RESTRICTED_TENDERING", label: "Restricted tendering" },
  { value: "REQUEST_FOR_QUOTATION", label: "Request for quotation" },
  { value: "SINGLE_SOURCE", label: "Single source" },
  { value: "DIRECT_AWARD", label: "Direct award" },
];

export function ProcurementExplorer() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [query, setQuery] = useState(searchParams.get("q") ?? "");
  const [status, setStatus] = useState(searchParams.get("status") ?? "");
  const [method, setMethod] = useState(searchParams.get("method") ?? "");
  const [result, setResult] = useState<SearchResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [showFilters, setShowFilters] = useState(false);

  const fetchProcurements = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams();
      if (query) params.set("q", query);
      if (status) params.set("status", status);
      if (method) params.set("method", method);
      params.set("page", String(page));
      params.set("pageSize", "20");

      const res = await fetch(`/api/v1/procurements?${params}`);
      if (!res.ok) throw new Error("Failed to load procurements");
      const data = await res.json() as { data: SearchResult };
      setResult(data.data);
    } catch {
      setError("We couldn't load the procurement list. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [query, status, method, page]);

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      setPage(1);
      fetchProcurements();
    }, 300);
    return () => clearTimeout(timer);
  }, [query, status, method]);

  useEffect(() => {
    fetchProcurements();
  }, [page]);

  const hasActiveFilters = status || method;

  const clearFilters = () => {
    setStatus("");
    setMethod("");
    setPage(1);
  };

  return (
    <div className="container-editorial py-6">
      {/* Search + Filter bar */}
      <div className="flex flex-col sm:flex-row gap-3 mb-4">
        <div className="relative flex-1">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-text-muted pointer-events-none"
            aria-hidden
          />
          <Input
            type="search"
            placeholder="Search contracts, suppliers, organizations or OCIDs..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="pl-9"
            aria-label="Search procurements"
            id="procurement-search"
          />
        </div>
        <Button
          variant="outline"
          size="md"
          className="gap-2 sm:w-auto"
          onClick={() => setShowFilters((p) => !p)}
          aria-expanded={showFilters}
          aria-controls="filter-panel"
        >
          <Filter className="h-4 w-4" aria-hidden />
          Filters
          {hasActiveFilters && (
            <span className="h-2 w-2 rounded-full bg-primary" aria-label="Filters active" />
          )}
        </Button>
      </div>

      {/* Filter panel */}
      {showFilters && (
        <div
          id="filter-panel"
          className="card-padded mb-4 animate-slide-down"
          aria-label="Filter options"
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            <div className="field-group">
              <label htmlFor="filter-status" className="field-label">
                Status
              </label>
              <select
                id="filter-status"
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="w-full h-9 rounded-md border border-input bg-surface px-3 text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-ring"
              >
                {STATUS_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>
            <div className="field-group">
              <label htmlFor="filter-method" className="field-label">
                Procurement method
              </label>
              <select
                id="filter-method"
                value={method}
                onChange={(e) => setMethod(e.target.value)}
                className="w-full h-9 rounded-md border border-input bg-surface px-3 text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-ring"
              >
                {METHOD_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
          {hasActiveFilters && (
            <div className="mt-3 flex items-center gap-2">
              <button
                type="button"
                onClick={clearFilters}
                className="text-xs text-text-secondary hover:text-text-primary flex items-center gap-1 transition-colors"
              >
                <X className="h-3.5 w-3.5" aria-hidden />
                Clear filters
              </button>
            </div>
          )}
        </div>
      )}

      {/* Result count */}
      {result && !loading && (
        <p className="text-sm text-text-secondary mb-4" role="status" aria-live="polite">
          {result.total === 0
            ? "No procurements found"
            : `${result.total.toLocaleString()} procurement${result.total === 1 ? "" : "s"} found`}
          {query && ` for "${query}"`}
        </p>
      )}

      {/* Results */}
      {loading && <ProcurementListSkeleton />}

      {error && (
        <ErrorState
          title="Couldn't load procurements"
          description={error}
          action={
            <Button onClick={fetchProcurements} variant="outline">
              Try again
            </Button>
          }
        />
      )}

      {!loading && !error && result?.items.length === 0 && (
        <EmptyState
          title="Nothing matched your search"
          description={
            hasActiveFilters || query
              ? "Try removing a filter or searching for a different term."
              : "No procurement records have been published yet."
          }
          action={
            hasActiveFilters || query ? (
              <Button
                variant="outline"
                onClick={() => {
                  setQuery("");
                  clearFilters();
                }}
              >
                Clear search and filters
              </Button>
            ) : undefined
          }
        />
      )}

      {!loading && !error && result && result.items.length > 0 && (
        <>
          {/* List */}
          <div
            className="divide-y divide-border border border-border rounded-lg overflow-hidden bg-surface"
            role="list"
            aria-label="Procurement results"
          >
            {result.items.map((item) => (
              <ProcurementRow key={item.id} item={item} />
            ))}
          </div>

          {/* Pagination */}
          {(result.page > 1 || result.hasMore) && (
            <div className="flex items-center justify-between mt-6">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage((p) => p - 1)}
                disabled={result.page <= 1}
              >
                Previous
              </Button>
              <span className="text-sm text-text-secondary">
                Page {result.page} of {Math.ceil(result.total / result.pageSize)}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage((p) => p + 1)}
                disabled={!result.hasMore}
              >
                Next
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  );
}

function ProcurementRow({ item }: { item: ProcurementSummary }) {
  return (
    <Link
      href={`/contracts/${item.ocid}`}
      className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 px-4 py-4 hover:bg-muted/40 transition-colors group"
      role="listitem"
      aria-label={`${item.title} — ${procurementStatusLabel(item.status)}`}
    >
      <div className="flex-1 min-w-0">
        <div className="flex flex-wrap items-center gap-2 mb-0.5">
          <StatusBadge status={item.status} />
          {item.isDemo && (
            <span className="demo-banner text-xs">DEMO</span>
          )}
          {item.signalCount > 0 && (
            <span className="badge-warning inline-flex items-center gap-1">
              <AlertTriangle className="h-3 w-3" aria-hidden />
              {item.signalCount} signal{item.signalCount > 1 ? "s" : ""}
            </span>
          )}
          {item.hasVerifiedDocuments && (
            <span className="badge-success inline-flex items-center gap-1">
              <Shield className="h-3 w-3" aria-hidden />
              Verified
            </span>
          )}
        </div>

        <h2 className="text-sm font-medium text-text-primary group-hover:text-primary transition-colors line-clamp-2">
          {item.title}
        </h2>

        <div className="flex flex-wrap items-center gap-3 mt-1.5 text-xs text-text-secondary">
          <span className="ocid">{item.ocid}</span>
          <span className="text-text-muted">·</span>
          <span>{item.procuringEntity.name}</span>
          {item.supplierName && (
            <>
              <span className="text-text-muted">·</span>
              <span>Awarded to {item.supplierName}</span>
            </>
          )}
          {item.publishedAt && (
            <>
              <span className="text-text-muted">·</span>
              <span>{formatDate(item.publishedAt)}</span>
            </>
          )}
        </div>
      </div>

      <div className="flex sm:flex-col items-center sm:items-end gap-3 sm:gap-0.5 flex-shrink-0">
        {item.estimatedValue && (
          <p className="money text-sm text-text-primary">
            {formatMoneyCompact(item.estimatedValue, item.currency)}
          </p>
        )}
        <p className="text-xs text-text-muted hidden sm:block">
          {methodLabel(item.method)}
        </p>
        <ChevronRight
          className="h-4 w-4 text-text-muted group-hover:text-primary transition-colors ml-auto sm:hidden"
          aria-hidden
        />
      </div>

      <ChevronRight
        className="h-4 w-4 text-text-muted group-hover:text-primary transition-colors hidden sm:block flex-shrink-0"
        aria-hidden
      />
    </Link>
  );
}
