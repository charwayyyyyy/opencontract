import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
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
  Layers,
  Megaphone,
  Inbox,
  Scale,
  Award,
  FileSignature,
  Activity,
  ShieldCheck,
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

          <div className="container-editorial relative py-12 md:py-24 lg:py-28">
            <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-8">
              <div className="flex-1 max-w-3xl">
                {/* Eyebrow */}
                <div className="demo-banner mb-6 inline-flex items-center gap-1.5 font-medium">
                  <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                  Live Civic Transparency Platform
                </div>

                {/* Headline */}
                <h1 className="text-display text-balance text-text-primary mb-6 leading-tight">
                  Public money
                  <br className="hidden sm:block" />
                  should leave
                  <br className="hidden sm:block" />
                  <span className="text-primary">a public trail.</span>
                </h1>

                <p className="text-body-lg text-text-secondary max-w-xl mb-8 leading-relaxed">
                  OpenContract makes public procurement easier to trace, understand
                  and independently verify — from tender publication to contract
                  completion.
                </p>

                {/* Quick Search */}
                <form action="/explore" method="GET" className="mb-6 max-w-xl">
                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center border-2 border-border focus-within:border-primary bg-surface rounded-lg p-2 sm:px-3 sm:py-2 shadow-xs transition-colors gap-2">
                    <div className="flex flex-1 items-center px-2 sm:px-0">
                      <Search className="h-5 w-5 text-text-muted mr-2 flex-shrink-0" />
                      <input
                        type="search"
                        name="q"
                        placeholder="Search project title, buyer, OCID..."
                        className="w-full bg-transparent border-none outline-none text-sm text-text-primary placeholder:text-text-muted"
                      />
                    </div>
                    <Button type="submit" size="sm" className="w-full sm:w-auto flex-shrink-0">
                      Search
                    </Button>
                  </div>
                  <div className="mt-2 flex flex-wrap items-center gap-1.5 text-xs text-text-muted">
                    <span>Try:</span>
                    <Link href="/explore?q=Tema" className="hover:text-primary underline">Tema Motorway</Link>
                    <span>·</span>
                    <Link href="/explore?q=Medicines" className="hover:text-primary underline">Essential Medicines</Link>
                    <span>·</span>
                    <Link href="/explore?q=Cloud" className="hover:text-primary underline">Cloud Infrastructure</Link>
                    <span>·</span>
                    <Link href="/explore?q=STEM" className="hover:text-primary underline">STEM Complex</Link>
                  </div>
                </form>

                <div className="flex flex-col sm:flex-row gap-3">
                  <Link href="/explore">
                    <Button size="lg" className="gap-2 w-full shadow-xs">
                      Explore contracts
                      <ArrowRight className="h-4 w-4" aria-hidden />
                    </Button>
                  </Link>
                  <Link href="/verify">
                    <Button
                      size="lg"
                      variant="outline"
                      className="gap-2 w-full bg-surface hover:bg-muted/50"
                    >
                      <FileCheck className="h-4 w-4" aria-hidden />
                      Verify a document
                    </Button>
                  </Link>
                </div>
              </div>
              
              <div className="flex-1 w-full max-w-md lg:max-w-xl relative">
                <div className="relative w-full aspect-square overflow-visible drop-shadow-xl">
                  <Image 
                    src="/hero-illustration.svg" 
                    alt="Minimalist illustration representing transparency and blockchain verification in public procurement" 
                    fill
                    className="object-contain"
                    priority
                  />
                </div>
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
    { label: "Planning", icon: Layers, done: true, query: "planning", status: "Recorded" },
    { label: "Tender", icon: Megaphone, done: true, query: "tender", status: "Published" },
    { label: "Bids", icon: Inbox, done: true, query: "bids", status: "Submitted" },
    { label: "Evaluation", icon: Scale, done: true, query: "evaluation", status: "Reviewed" },
    { label: "Award", icon: Award, done: true, query: "award", status: "Awarded" },
    { label: "Contract", icon: FileSignature, done: true, query: "contract", status: "Signed" },
    { label: "Implementation", icon: Activity, done: false, query: "implementation", status: "Active" },
    { label: "Completion", icon: ShieldCheck, done: false, query: "completion", status: "Pending" },
  ];

  return (
    <div className="overflow-x-auto scrollbar-none -mx-4 px-4 py-2">
      <div className="flex items-center gap-0 min-w-max pb-2">
        {stages.map((stage, i) => {
          const Icon = stage.icon;
          return (
            <div key={stage.label} className="flex items-center">
              <Link
                href={`/explore?stage=${stage.query}`}
                className="group flex flex-col items-center gap-2 focus:outline-none"
              >
                <div
                  className={cn(
                    "w-12 h-12 rounded-xl border flex items-center justify-center transition-all duration-200 shadow-xs",
                    stage.done
                      ? "border-[hsl(var(--forest-green)/0.25)] bg-[hsl(var(--forest-green)/0.06)] text-[hsl(var(--forest-green))] group-hover:bg-[hsl(var(--forest-green)/0.12)] group-hover:border-[hsl(var(--forest-green)/0.45)] group-hover:scale-105"
                      : "border-border/80 bg-surface text-text-muted group-hover:border-border group-hover:text-text-secondary"
                  )}
                  aria-label={`${stage.label} stage (${stage.status})`}
                >
                  <Icon className="w-5 h-5 stroke-[1.75]" aria-hidden />
                </div>
                <div className="text-center">
                  <span
                    className={cn(
                      "block text-xs font-medium tracking-tight whitespace-nowrap transition-colors",
                      stage.done
                        ? "text-text-primary group-hover:text-[hsl(var(--forest-green))]"
                        : "text-text-muted"
                    )}
                  >
                    {stage.label}
                  </span>
                  <span className="block text-[10px] text-text-muted font-normal mt-0.5">
                    {stage.status}
                  </span>
                </div>
              </Link>
              {i < stages.length - 1 && (
                <div
                  className={cn(
                    "h-px w-7 mx-2.5 mb-6 flex-shrink-0 transition-colors",
                    stage.done && stages[i + 1]?.done
                      ? "bg-[hsl(var(--forest-green)/0.35)]"
                      : "bg-border/60"
                  )}
                  aria-hidden
                />
              )}
            </div>
          );
        })}
      </div>
      <p className="mt-2 text-xs text-text-muted flex items-center gap-1.5">
        <span className="inline-block w-1.5 h-1.5 rounded-full bg-[hsl(var(--forest-green))]" aria-hidden />
        Click any stage to filter and explore public contracts at that point in the procurement chain.
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
        <span className="text-sm font-medium text-text-primary">Blockchain proof (Demo)</span>
        <span className="text-xs text-[hsl(var(--status-success))] ml-auto font-medium">
          ✓ Anchored (Simulated)
        </span>
      </div>
      <dl className="space-y-2.5 text-sm">
        {[
          { label: "Network", value: "Base Sepolia" },
          { label: "Transaction", value: "0x8a4f…3c2d (Demo)" },
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
          Simulated demo anchor on Base Sepolia. Demonstrates how cryptographic SHA-256 fingerprints are
          anchored to OpenContractRegistry.sol at the time of publication.
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
