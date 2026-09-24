import Link from "next/link";
import {
  ArrowLeft,
  Building2,
  Calendar,
  AlertTriangle,
  CheckCircle2,
  Clock,
  FileText,
  ChevronDown,
} from "lucide-react";
import { StatusBadge } from "@/components/ui/status-badge";
import { BlockchainProof } from "@/components/ui/blockchain-proof";
import { Button } from "@/components/ui/button";
import { Alert } from "@/components/ui/states";
import {
  formatMoney,
  formatDate,
  formatDateTime,
  formatFileSize,
  methodLabel,
  documentCategoryLabel,
  signalTypeLabel,
  calcChangePercent,
  shortenHash,
} from "@/lib/utils";
import type { ProcurementDetail } from "@opencontract/types";

interface ContractDetailProps {
  procurement: ProcurementDetail;
}

export function ContractDetail({ procurement }: ContractDetailProps) {
  const primaryContract = procurement.contracts[0];
  const primaryAward = procurement.awards[0];
  const hasSingleBidSignal = procurement.signals.some(
    (s) => s.signalType === "SINGLE_BIDDER"
  );

  // Calculate totals
  const totalPaid = primaryContract
    ? parseFloat(primaryContract.totalPaid)
    : 0;
  const currentValue = primaryContract
    ? parseFloat(primaryContract.currentAmount)
    : primaryAward
    ? parseFloat(primaryAward.amount)
    : procurement.estimatedValue
    ? parseFloat(procurement.estimatedValue)
    : 0;

  return (
    <>
      {/* ── Page Header ──────────────────────────────────── */}
      <div className="page-header">
        <div className="page-header-inner">
          <Link
            href="/explore"
            className="inline-flex items-center gap-1.5 text-sm text-text-secondary hover:text-text-primary mb-4 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" aria-hidden />
            All procurements
          </Link>

          <div className="flex flex-wrap items-center gap-2 mb-3">
            <StatusBadge status={procurement.status} />
            {procurement.isDemo && (
              <span className="demo-banner">DEMO DATA</span>
            )}
            {procurement.signalCount > 0 && (
              <span className="badge-warning inline-flex items-center gap-1.5">
                <AlertTriangle className="h-3.5 w-3.5" aria-hidden />
                {procurement.signalCount} review signal
                {procurement.signalCount > 1 ? "s" : ""}
              </span>
            )}
          </div>

          <h1 className="text-heading-xl text-text-primary mb-3 text-balance">
            {procurement.title}
          </h1>

          <div className="flex flex-wrap items-center gap-4 text-sm text-text-secondary">
            <span className="ocid font-mono">{procurement.ocid}</span>
            <span className="flex items-center gap-1">
              <Building2 className="h-3.5 w-3.5" aria-hidden />
              {procurement.procuringEntity.name}
            </span>
            {procurement.supplierName && (
              <span>Awarded to {procurement.supplierName}</span>
            )}
            {procurement.publishedAt && (
              <span className="flex items-center gap-1">
                <Calendar className="h-3.5 w-3.5" aria-hidden />
                Published {formatDate(procurement.publishedAt)}
              </span>
            )}
            <span>{methodLabel(procurement.method)}</span>
          </div>
        </div>
      </div>

      {/* ── Body ─────────────────────────────────────────── */}
      <div className="container-editorial py-8 space-y-10">

        {/* ── Financial Summary ────────────────────────── */}
        <section aria-label="Financial summary">
          <h2 className="text-heading-sm text-text-primary mb-4">Financial summary</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <FinancialStat
              label="Estimated value"
              value={formatMoney(procurement.estimatedValue, procurement.currency)}
              note="At procurement stage"
            />
            {primaryAward && (
              <FinancialStat
                label="Awarded amount"
                value={formatMoney(primaryAward.amount, primaryAward.currency)}
              />
            )}
            {primaryContract && (
              <>
                <FinancialStat
                  label="Current contract value"
                  value={formatMoney(primaryContract.currentAmount, primaryContract.currency)}
                  highlight={
                    primaryContract.amendments.length > 0
                      ? `+${primaryContract.amendments.length} amendment${primaryContract.amendments.length > 1 ? "s" : ""}`
                      : undefined
                  }
                />
                <FinancialStat
                  label="Total recorded payments"
                  value={formatMoney(primaryContract.totalPaid, primaryContract.currency)}
                  note={`${primaryContract.percentagePaid}% of contract value`}
                />
              </>
            )}
          </div>

          {/* Amendment indicator */}
          {primaryContract && primaryContract.amendments.length > 0 && (
            <div className="mt-3">
              {primaryContract.amendments.map((amend) => {
                const isIncrease = parseFloat(amend.changeAmount) > 0;
                return (
                  <div key={amend.id} className="flex items-center gap-3 text-sm mt-1">
                    <span className="text-text-secondary">
                      Amendment #{amend.amendmentNumber}:
                    </span>
                    <span className="money text-text-primary">
                      {formatMoney(amend.previousAmount, primaryContract.currency)}
                    </span>
                    <span className="text-text-muted">→</span>
                    <span className="money text-text-primary">
                      {formatMoney(amend.newAmount, primaryContract.currency)}
                    </span>
                    <span
                      className={
                        isIncrease
                          ? "text-[hsl(var(--status-warning))] font-medium"
                          : "text-[hsl(var(--status-success))] font-medium"
                      }
                    >
                      {isIncrease ? "+" : ""}
                      {amend.changePct}%
                    </span>
                  </div>
                );
              })}
            </div>
          )}
        </section>

        {/* ── Tender Info ──────────────────────────────── */}
        {procurement.tender && (
          <section aria-label="Tender information">
            <h2 className="text-heading-sm text-text-primary mb-4">Tender</h2>
            <div className="card-padded">
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                <DataField label="Tender status">
                  <StatusBadge status={procurement.tender.status} />
                </DataField>
                <DataField label="Opening date">
                  {formatDate(procurement.tender.openingDate)}
                </DataField>
                <DataField label="Closing date">
                  {formatDate(procurement.tender.closingDate)}
                </DataField>
                {procurement.tender.eligibilityRequirements && (
                  <DataField label="Eligibility requirements" className="sm:col-span-2 md:col-span-3">
                    {procurement.tender.eligibilityRequirements}
                  </DataField>
                )}
              </div>
            </div>
          </section>
        )}

        {/* ── Bids ─────────────────────────────────────── */}
        {procurement.bids.length > 0 && (
          <section aria-label="Bid submissions">
            <h2 className="text-heading-sm text-text-primary mb-1">Bids received</h2>
            <p className="text-sm text-text-secondary mb-4">
              {procurement.bids.length} bid{procurement.bids.length > 1 ? "s" : ""} recorded.
              {!["AWARDED", "CONTRACTED", "IMPLEMENTATION", "COMPLETED"].includes(
                procurement.status
              ) && " Bidder details visible after award."}
            </p>

            {hasSingleBidSignal && (
              <Alert variant="warning" className="mb-4">
                <p>
                  This tender received only one recorded bid. This is a review signal —
                  it does not indicate wrongdoing.
                </p>
              </Alert>
            )}

            <div className="card overflow-hidden">
              <table className="data-table">
                <thead>
                  <tr>
                    <th scope="col">Reference</th>
                    <th scope="col">Submitted</th>
                    <th scope="col">Bidder</th>
                    <th scope="col">Status</th>
                    {procurement.bids.some((b) => b.amount) && (
                      <th scope="col" className="text-right">Amount</th>
                    )}
                  </tr>
                </thead>
                <tbody>
                  {procurement.bids.map((bid) => (
                    <tr key={bid.id}>
                      <td className="font-mono text-xs">{bid.submissionRef}</td>
                      <td>{formatDate(bid.submittedAt)}</td>
                      <td>{bid.bidderName ?? <span className="text-text-muted">Not disclosed at this stage</span>}</td>
                      <td>
                        <StatusBadge status={bid.status} variant="bid" />
                      </td>
                      {procurement.bids.some((b) => b.amount) && (
                        <td className="text-right money">
                          {bid.amount ? formatMoney(bid.amount, procurement.currency) : "—"}
                        </td>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        )}

        {/* ── Award ────────────────────────────────────── */}
        {procurement.awards.length > 0 && (
          <section aria-label="Award information">
            <h2 className="text-heading-sm text-text-primary mb-4">Award</h2>
            {procurement.awards.map((award) => (
              <div key={award.id} className="card-padded">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  <DataField label="Supplier">{award.supplierName}</DataField>
                  <DataField label="Amount" className="font-semibold money">
                    {formatMoney(award.amount, award.currency)}
                  </DataField>
                  <DataField label="Award date">{formatDate(award.awardDate)}</DataField>
                  <DataField label="Status">
                    <StatusBadge status={award.status} variant="award" />
                  </DataField>
                  {award.justification && (
                    <DataField label="Justification" className="sm:col-span-2 md:col-span-3">
                      {award.justification}
                    </DataField>
                  )}
                </div>
              </div>
            ))}
          </section>
        )}

        {/* ── Timeline ─────────────────────────────────── */}
        <section aria-label="Procurement timeline">
          <h2 className="text-heading-sm text-text-primary mb-6">Timeline</h2>
          <div className="timeline-container pl-4">
            <div className="timeline-line" aria-hidden />
            <div className="space-y-0">
              {procurement.timeline.map((event, i) => {
                const isLast = i === procurement.timeline.length - 1;
                return (
                  <div key={event.id} className="timeline-item">
                    <div
                      className={`timeline-marker ${
                        event.isVerified
                          ? "timeline-marker-completed"
                          : i === procurement.timeline.length - 1
                          ? "timeline-marker-current"
                          : "timeline-marker-pending"
                      }`}
                      aria-hidden
                    >
                      {event.isVerified ? (
                        <CheckCircle2 className="h-4 w-4" />
                      ) : (
                        <Clock className="h-3.5 w-3.5" />
                      )}
                    </div>

                    <div className="flex-1 pt-0.5 pb-8">
                      <div className="flex flex-wrap items-start justify-between gap-2">
                        <div>
                          <p className="text-sm font-medium text-text-primary">
                            {event.label}
                          </p>
                          <p className="text-xs text-text-secondary mt-0.5">
                            {formatDate(event.date)}
                            {event.actor && ` · ${event.actor}`}
                          </p>
                          {event.description && (
                            <p className="text-sm text-text-secondary mt-1">
                              {event.description}
                            </p>
                          )}
                        </div>
                        {event.isVerified && (
                          <span className="badge-success text-xs flex-shrink-0">
                            ✓ Verified
                          </span>
                        )}
                      </div>

                      {/* Blockchain proof (collapsed by default) */}
                      {event.blockchainAnchor && (
                        <div className="mt-3">
                          <BlockchainProof
                            transactionHash={event.blockchainAnchor.transactionHash}
                            blockNumber={event.blockchainAnchor.blockNumber}
                            contractAddress={event.blockchainAnchor.contractAddress}
                            dataHash={event.blockchainAnchor.dataHash}
                            network={event.blockchainAnchor.network}
                            confirmedAt={event.blockchainAnchor.confirmedAt}
                            status={event.blockchainAnchor.status}
                            className="max-w-lg"
                          />
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}

              {/* Pending future stages */}
              {!["COMPLETED", "CANCELLED"].includes(procurement.status) && (
                <div className="timeline-item opacity-40">
                  <div className="timeline-marker timeline-marker-pending" aria-hidden>
                    <Clock className="h-3.5 w-3.5" />
                  </div>
                  <div className="flex-1 pt-0.5">
                    <p className="text-sm text-text-muted italic">
                      Further stages to be recorded
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* ── Documents ────────────────────────────────── */}
        {procurement.documents.length > 0 && (
          <section aria-label="Public documents">
            <h2 className="text-heading-sm text-text-primary mb-4">Documents</h2>
            <div className="space-y-2">
              {procurement.documents.map((doc) => (
                <DocumentRow key={doc.id} document={doc} />
              ))}
            </div>
          </section>
        )}

        {/* ── Integrity Signals ─────────────────────────── */}
        {procurement.signals.length > 0 && (
          <section aria-label="Review signals">
            <h2 className="text-heading-sm text-text-primary mb-2">
              Review signals
            </h2>
            <Alert variant="info" className="mb-4">
              <p>
                These signals highlight patterns that may warrant additional review.
                They are not findings of wrongdoing.
              </p>
            </Alert>
            <div className="space-y-3">
              {procurement.signals.map((signal) => (
                <div key={signal.id} className="card-padded">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-2">
                      <AlertTriangle
                        className="h-4 w-4 mt-0.5 flex-shrink-0 text-[hsl(var(--status-warning))]"
                        aria-hidden
                      />
                      <div>
                        <p className="text-sm font-medium text-text-primary">
                          {signalTypeLabel(signal.signalType)}
                        </p>
                        <p className="text-sm text-text-secondary mt-0.5">
                          {signal.explanation}
                        </p>
                      </div>
                    </div>
                    <StatusBadge
                      status={signal.severity}
                      variant="signal"
                      className="flex-shrink-0"
                    />
                  </div>
                  {signal.isResolved && (
                    <p className="mt-2 text-xs text-[hsl(var(--status-success))] flex items-center gap-1">
                      <CheckCircle2 className="h-3.5 w-3.5" aria-hidden />
                      Marked as reviewed
                    </p>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* ── OCDS Export ──────────────────────────────── */}
        <section aria-label="Data export" className="border-t border-border pt-8">
          <h2 className="text-heading-sm text-text-primary mb-3">Export data</h2>
          <div className="flex flex-wrap gap-3">
            <a href={`/api/v1/ocds/records/${procurement.ocid}`} target="_blank">
              <Button variant="outline" size="sm">
                Download OCDS record (JSON)
              </Button>
            </a>
            <a href={`/api/v1/procurements/${procurement.ocid}/timeline`} target="_blank">
              <Button variant="outline" size="sm">
                Download timeline (JSON)
              </Button>
            </a>
          </div>
          <p className="text-xs text-text-muted mt-2">
            Data exported in Open Contracting Data Standard (OCDS) format.
          </p>
        </section>
      </div>
    </>
  );
}

// ── Sub-components ───────────────────────────────────────────

function FinancialStat({
  label,
  value,
  note,
  highlight,
}: {
  label: string;
  value: string;
  note?: string;
  highlight?: string;
}) {
  return (
    <div className="card-padded">
      <p className="data-label">{label}</p>
      <p className="data-value-lg">{value}</p>
      {note && <p className="text-xs text-text-muted mt-0.5">{note}</p>}
      {highlight && (
        <p className="text-xs text-[hsl(var(--status-warning))] mt-0.5 font-medium">
          {highlight}
        </p>
      )}
    </div>
  );
}

function DataField({
  label,
  children,
  className,
}: {
  label: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div>
      <p className="data-label">{label}</p>
      <div className={`data-value ${className ?? ""}`}>{children}</div>
    </div>
  );
}

function DocumentRow({
  document,
}: {
  document: ProcurementDetail["documents"][0];
}) {
  return (
    <div className="doc-card">
      <FileText
        className="h-5 w-5 text-text-muted flex-shrink-0 mt-0.5"
        aria-hidden
      />
      <div className="flex-1 min-w-0">
        <div className="flex flex-wrap items-center gap-2">
          <p className="text-sm font-medium text-text-primary">
            {document.originalName}
          </p>
          <span className="badge-neutral text-xs">
            {documentCategoryLabel(document.category)}
          </span>
          {document.status === "REGISTERED" && (
            <span className="badge-success text-xs">✓ Registered</span>
          )}
          {document.isDemo && <span className="demo-banner">DEMO</span>}
        </div>
        <div className="flex flex-wrap items-center gap-3 mt-1 text-xs text-text-muted">
          <span>{formatFileSize(document.sizeBytes)}</span>
          <span>·</span>
          <span>Added {formatDate(document.createdAt)}</span>
          <span>·</span>
          <span className="font-mono" title={document.sha256}>
            SHA-256: {document.sha256.slice(0, 12)}…
          </span>
        </div>
      </div>
      <div className="flex items-center gap-2 flex-shrink-0">
        <a href={`/api/v1/documents/${document.id}/download`}>
          <Button variant="ghost" size="sm" aria-label={`Download ${document.originalName}`}>
            Download
          </Button>
        </a>
        <a href={`/verify?hash=${document.sha256}`}>
          <Button variant="outline" size="sm" aria-label={`Verify ${document.originalName}`}>
            Verify
          </Button>
        </a>
      </div>
    </div>
  );
}
