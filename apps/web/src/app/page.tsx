import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  Search,
  Shield,
  FileCheck,
  TrendingUp,
  AlertTriangle,
  Clock,
  CheckCircle2,
  ChevronRight,
} from "lucide-react";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { Button } from "@/components/ui/button";
import { getPublicStatistics } from "@/services/procurement/statistics";
import { formatMoneyCompact } from "@/lib/utils";

export const metadata: Metadata = {
  title: "OpenContract — Public money should leave a public trail",
  description:
    "OpenContract makes public procurement easier to trace, understand and independently verify — from tender publication to contract completion.",
};

// Revalidate every 5 minutes
export const revalidate = 300;

export default async function HomePage() {
  const stats = await getPublicStatistics();

  return (
    <>
      <SiteHeader />
      <main>
        {/* ── Hero ─────────────────────────────────────────── */}
        <section
          className="relative overflow-hidden border-b border-border"
          aria-label="Introduction"
        >
          {/* Subtle background pattern */}
          <div
            className="absolute inset-0 pointer-events-none opacity-30"
            aria-hidden
            style={{
              backgroundImage: `
                repeating-linear-gradient(
                  0deg,
                  transparent,
                  transparent 39px,
                  hsl(120, 7%, 90%) 39px,
                  hsl(120, 7%, 90%) 40px
                )
              `,
            }}
          />

          <div className="container-editorial relative py-20 md:py-28 lg:py-32">
            <div className="max-w-3xl">
              {/* Eyebrow */}
              <div className="demo-banner mb-6 inline-flex">
                Demo environment
              </div>

              {/* Headline */}
              <h1 className="text-display text-balance text-text-primary mb-6 leading-tight">
                Public money
                <br />
                should leave
                <br />
                <span className="text-primary">a public trail.</span>
              </h1>

              <p className="text-body-lg text-text-secondary max-w-xl mb-8 leading-relaxed">
                OpenContract makes public procurement easier to trace, understand
                and independently verify — from tender publication to contract
                completion.
              </p>

              <div className="flex flex-col sm:flex-row gap-3">
                <Link href="/explore">
                  <Button size="lg" className="gap-2 w-full sm:w-auto">
                    Explore contracts
                    <ArrowRight className="h-4 w-4" aria-hidden />
                  </Button>
                </Link>
                <Link href="/verify">
                  <Button
                    size="lg"
                    variant="outline"
                    className="gap-2 w-full sm:w-auto"
                  >
                    <FileCheck className="h-4 w-4" aria-hidden />
                    Verify a document
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* ── Statistics ────────────────────────────────────── */}
        <section
          className="border-b border-border bg-surface"
          aria-label="Platform statistics"
        >
          <div className="container-editorial py-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
              <Stat
                value={stats.totalProcurements.toLocaleString()}
                label="Procurement processes"
                note="DEMO DATA"
              />
              <Stat
                value={stats.activeTenders.toLocaleString()}
                label="Active tenders"
                note="DEMO DATA"
              />
              <Stat
                value={formatMoneyCompact(stats.totalContractValue)}
                label="Tracked contract value"
                note="DEMO DATA"
              />
              <Stat
                value={stats.pendingSignals.toLocaleString()}
                label="Signals requiring review"
                note="DEMO DATA"
              />
            </div>
          </div>
        </section>

        {/* ── Procurement Lifecycle ─────────────────────────── */}
        <section className="border-b border-border" aria-label="How it works">
          <div className="container-editorial py-16 md:py-20">
            <h2 className="text-heading-lg text-text-primary mb-2">
              Follow the full lifecycle
            </h2>
            <p className="text-body text-text-secondary mb-10 max-w-xl">
              Every public procurement creates a chain of events. OpenContract
              makes that chain visible and verifiable.
            </p>

            <LifecycleTrail />
          </div>
        </section>

        {/* ── How Verification Works ────────────────────────── */}
        <section
          className="border-b border-border bg-surface"
          aria-label="Document verification"
        >
          <div className="container-editorial py-16 md:py-20">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-heading-lg text-text-primary mb-3">
                  Verify any public document
                </h2>
                <p className="text-body text-text-secondary mb-5 leading-relaxed">
                  Upload a document and check whether it matches the cryptographic
                  fingerprint registered for an OpenContract record. If even a
                  single byte changed, verification will show a mismatch.
                </p>
                <p className="text-body-sm text-text-muted mb-6">
                  A matching fingerprint confirms the file is identical to the
                  registered version. It does not verify the contents are truthful.
                </p>
                <Link href="/verify">
                  <Button variant="outline" className="gap-2">
                    <FileCheck className="h-4 w-4" aria-hidden />
                    Verify a document
                  </Button>
                </Link>
              </div>
              <VerificationDemo />
            </div>
          </div>
        </section>

        {/* ── Blockchain Anchoring ──────────────────────────── */}
        <section className="border-b border-border" aria-label="Blockchain anchoring">
          <div className="container-editorial py-16 md:py-20">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
              <BlockchainExplainer />
              <div>
                <h2 className="text-heading-lg text-text-primary mb-3">
                  Independent verification layer
                </h2>
                <p className="text-body text-text-secondary mb-5 leading-relaxed">
                  Key procurement events and document fingerprints are anchored to
                  an EVM blockchain. This creates a tamper-evident public record
                  that can be independently verified without relying on OpenContract
                  servers.
                </p>
                <ul className="space-y-3 text-sm text-text-secondary mb-6">
                  {[
                    "Events are anchored, not full documents",
                    "Document hashes are anchored — not document contents",
                    "Blockchain does not verify truthfulness of submitted data",
                    "Anyone can independently verify the anchored events",
                  ].map((point) => (
                    <li key={point} className="flex items-start gap-2">
                      <CheckCircle2
                        className="h-4 w-4 text-[hsl(var(--status-success))] mt-0.5 flex-shrink-0"
                        aria-hidden
                      />
                      {point}
                    </li>
                  ))}
                </ul>
                <Link href="/methodology">
                  <Button variant="ghost" className="gap-1 px-0 hover:bg-transparent text-primary">
                    Read our methodology
                    <ChevronRight className="h-4 w-4" aria-hidden />
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* ── Review Signals ────────────────────────────────── */}
        <section
          className="border-b border-border bg-surface"
          aria-label="Integrity signals"
        >
          <div className="container-editorial py-16 md:py-20">
            <h2 className="text-heading-lg text-text-primary mb-2">
              Structured review signals
            </h2>
            <p className="text-body text-text-secondary mb-8 max-w-xl">
              OpenContract's integrity engine applies deterministic rules to
              surface procurement records that may warrant additional attention.
              These are signals for review — not findings of wrongdoing.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {[
                {
                  type: "Single bidder",
                  description:
                    "A tender received only one recorded bid, which may reduce competitive pressure.",
                  severity: "MEDIUM",
                },
                {
                  type: "Significant amendment",
                  description:
                    "Contract value changed by more than 15% from the original awarded amount.",
                  severity: "HIGH",
                },
                {
                  type: "Delayed implementation",
                  description:
                    "Recorded milestone dates indicate the project is significantly behind schedule.",
                  severity: "MEDIUM",
                },
                {
                  type: "Missing update",
                  description:
                    "An expected procurement stage has no corresponding public record.",
                  severity: "LOW",
                },
                {
                  type: "Supplier concentration",
                  description:
                    "A supplier appears across an unusually high proportion of recorded procurements.",
                  severity: "INFO",
                },
              ].map((signal) => (
                <SignalCard key={signal.type} {...signal} />
              ))}
            </div>

            <div className="mt-6">
              <Link href="/signals">
                <Button variant="outline" size="sm" className="gap-1">
                  View review signals
                  <ArrowRight className="h-3.5 w-3.5" aria-hidden />
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* ── AI Analyst CTA ────────────────────────────────── */}
        <section aria-label="AI analyst">
          <div className="container-editorial py-16 md:py-20">
            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
              <div className="max-w-xl">
                <h2 className="text-heading-lg text-text-primary mb-2">
                  Ask questions about the data
                </h2>
                <p className="text-body text-text-secondary leading-relaxed">
                  The AI procurement analyst answers questions using structured
                  application records — not a general knowledge model. Every
                  factual statement is traceable to a specific procurement record.
                </p>
              </div>
              <div className="flex-shrink-0">
                <Link href="/analyst">
                  <Button className="gap-2">
                    Open AI analyst
                    <ArrowRight className="h-4 w-4" aria-hidden />
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}

// ── Sub-components ───────────────────────────────────────────

function Stat({
  value,
  label,
  note,
}: {
  value: string;
  label: string;
  note?: string;
}) {
  return (
    <div className="stat-block">
      {note && <p className="text-xs text-text-muted mb-0.5 demo-banner inline-block">{note}</p>}
      <p className="stat-value mt-1">{value}</p>
      <p className="stat-label">{label}</p>
    </div>
  );
}

function LifecycleTrail() {
  const stages = [
    { label: "Planning", icon: "📋", done: true },
    { label: "Tender", icon: "📣", done: true },
    { label: "Bids", icon: "📩", done: true },
    { label: "Evaluation", icon: "📊", done: true },
    { label: "Award", icon: "🏆", done: true },
    { label: "Contract", icon: "📄", done: true },
    { label: "Implementation", icon: "🏗️", done: false },
    { label: "Completion", icon: "✅", done: false },
  ];

  return (
    <div className="overflow-x-auto scrollbar-none -mx-4 px-4">
      <div className="flex items-center gap-0 min-w-max">
        {stages.map((stage, i) => (
          <div key={stage.label} className="flex items-center">
            <div className="flex flex-col items-center gap-1.5">
              <div
                className={cn(
                  "w-10 h-10 rounded-full border-2 flex items-center justify-center text-base",
                  stage.done
                    ? "border-[hsl(var(--status-success))] bg-[hsl(var(--status-success-bg))]"
                    : "border-border bg-muted"
                )}
                aria-label={stage.label}
              >
                <span aria-hidden>{stage.icon}</span>
              </div>
              <span
                className={cn(
                  "text-xs font-medium whitespace-nowrap",
                  stage.done ? "text-text-primary" : "text-text-muted"
                )}
              >
                {stage.label}
              </span>
            </div>
            {i < stages.length - 1 && (
              <div
                className={cn(
                  "h-px w-8 mx-1 mb-4 flex-shrink-0",
                  stage.done ? "bg-[hsl(var(--status-success))]" : "bg-border"
                )}
                aria-hidden
              />
            )}
          </div>
        ))}
      </div>
      <p className="mt-4 text-xs text-text-muted">
        Click any stage to explore contracts at that point in the lifecycle.
      </p>
    </div>
  );
}

// cn imported from utils — re-exported here since this file is server component
function cn(...classes: (string | boolean | undefined)[]) {
  return classes.filter(Boolean).join(" ");
}

function VerificationDemo() {
  return (
    <div className="card-padded space-y-4" aria-label="Verification example">
      {/* Verified state example */}
      <div className="border border-[hsl(149,25%,82%)] bg-[hsl(var(--status-success-bg))] rounded-lg p-4 space-y-3">
        <div className="flex items-center gap-2">
          <CheckCircle2
            className="h-5 w-5 text-[hsl(var(--status-success))]"
            aria-hidden
          />
          <span className="font-semibold text-[hsl(149,35%,28%)]">
            Document verified
          </span>
        </div>
        <p className="text-sm text-[hsl(149,35%,35%)]">
          The uploaded file matches the registered document fingerprint.
        </p>
        <dl className="text-xs space-y-1.5">
          <div className="flex justify-between">
            <dt className="text-[hsl(149,20%,45%)]">SHA-256</dt>
            <dd className="font-mono text-[hsl(149,35%,28%)]">a3f2…8c1d</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-[hsl(149,20%,45%)]">Registered</dt>
            <dd className="text-[hsl(149,35%,28%)]">18 May 2026</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-[hsl(149,20%,45%)]">Blockchain</dt>
            <dd className="text-[hsl(149,35%,28%)]">✓ Confirmed</dd>
          </div>
        </dl>
      </div>

      {/* Mismatch state example */}
      <div className="border border-[hsl(0,40%,87%)] bg-[hsl(var(--status-error-bg))] rounded-lg p-4 space-y-2">
        <div className="flex items-center gap-2">
          <AlertTriangle
            className="h-5 w-5 text-[hsl(var(--status-error))]"
            aria-hidden
          />
          <span className="font-semibold text-[hsl(0,45%,38%)]">
            Document mismatch
          </span>
        </div>
        <p className="text-sm text-[hsl(0,35%,45%)]">
          The uploaded file does not match the registered fingerprint. This may
          mean the file has been modified.
        </p>
      </div>
    </div>
  );
}

function BlockchainExplainer() {
  return (
    <div className="card-padded" aria-label="Blockchain proof example">
      <div className="flex items-center gap-2 mb-4">
        <div className="h-2 w-2 rounded-full bg-[hsl(var(--status-success))]" aria-hidden />
        <span className="text-sm font-medium text-text-primary">Blockchain proof</span>
        <span className="text-xs text-[hsl(var(--status-success))] ml-auto font-medium">
          ✓ Anchored
        </span>
      </div>
      <dl className="space-y-2.5 text-sm">
        {[
          { label: "Network", value: "Base Sepolia" },
          { label: "Transaction", value: "0x8a4f…3c2d" },
          { label: "Block", value: "14,893,241" },
          { label: "Anchored", value: "24 Sep 2026" },
        ].map(({ label, value }) => (
          <div key={label} className="flex justify-between items-center">
            <dt className="text-text-secondary">{label}</dt>
            <dd className="font-mono text-xs text-text-primary bg-muted px-2 py-0.5 rounded">
              {value}
            </dd>
          </div>
        ))}
      </dl>
      <div className="mt-4 pt-4 border-t border-border">
        <p className="text-xs text-text-muted">
          SHA-256 fingerprint of the procurement event data, anchored at the time of
          publication.
        </p>
      </div>
    </div>
  );
}

function SignalCard({
  type,
  description,
  severity,
}: {
  type: string;
  description: string;
  severity: string;
}) {
  const severityClass: Record<string, string> = {
    INFO: "badge-info",
    LOW: "badge-success",
    MEDIUM: "badge-warning",
    HIGH: "badge-error",
  };

  return (
    <div className="card-padded hover:shadow-sm transition-shadow">
      <div className="flex items-start justify-between gap-2 mb-2">
        <AlertTriangle
          className="h-4 w-4 text-text-muted flex-shrink-0 mt-0.5"
          aria-hidden
        />
        <span className={cn(severityClass[severity] ?? "badge-neutral")}>
          {severity.charAt(0) + severity.slice(1).toLowerCase()}
        </span>
      </div>
      <h3 className="text-sm font-medium text-text-primary mb-1">{type}</h3>
      <p className="text-xs text-text-secondary leading-relaxed">{description}</p>
    </div>
  );
}
