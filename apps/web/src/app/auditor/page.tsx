import type { Metadata } from "next";
import { redirect } from "next/navigation";
import Link from "next/link";
import { auth } from "@/lib/auth";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { prisma } from "@opencontract/database/client";
import { formatMoney, formatDate } from "@/lib/utils";
import {
  FileSearch,
  AlertTriangle,
  ShieldAlert,
  ArrowRight,
  TrendingUp,
  FileCheck2,
  Bot,
  Database,
} from "lucide-react";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Auditor & Oversight Console",
  description: "Investigate procurement review signals, audit contract amendments, and inspect cryptographic proofs.",
};

export default async function AuditorConsolePage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/auth/signin?callbackUrl=/auditor");
  }

  const role = session.user.role;
  if (!["AUDITOR", "ADMIN"].includes(role)) {
    redirect("/dashboard");
  }

  // Fetch signals and procurements needing audit review
  let signals: any[] = [];
  let highVarianceProcurements: any[] = [];
  try {
    signals = await prisma.integritySignal.findMany({
      orderBy: { detectedAt: "desc" },
      take: 6,
      include: {
        procurement: {
          select: {
            ocid: true,
            title: true,
            estimatedValue: true,
            currency: true,
            procuringEntity: { select: { shortName: true } },
          },
        },
      },
    });

    highVarianceProcurements = await prisma.procurement.findMany({
      where: {
        isDemo: true,
        contracts: {
          some: {
            amendments: {
              some: {},
            },
          },
        },
      },
      include: {
        procuringEntity: { select: { name: true, shortName: true } },
        contracts: {
          include: { amendments: true },
        },
      },
      take: 3,
    });
  } catch (err) {
    console.error("[AuditorConsolePage]", err);
  }

  const severityBadges: Record<string, string> = {
    HIGH: "badge-error",
    MEDIUM: "badge-warning",
    LOW: "badge-success",
    INFO: "badge-neutral",
  };

  return (
    <>
      <SiteHeader />
      <main className="min-h-screen bg-background">
        <div className="border-b border-border bg-surface">
          <div className="container-editorial py-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <p className="text-label uppercase text-text-muted mb-1">
                  Public Oversight &amp; Audit Console
                </p>
                <h1 className="text-heading-xl text-text-primary">
                  Integrity Review Board
                </h1>
                <p className="text-body-sm text-text-secondary mt-1">
                  Auditor: <span className="font-medium text-text-primary">{session.user.name}</span> ·
                  Clearance: <span className="font-medium text-text-primary">Senior Public Auditor</span>
                </p>
              </div>

              <div className="flex items-center gap-2">
                <Link href="/analyst">
                  <Button variant="outline" size="sm" className="gap-2">
                    <Bot className="h-4 w-4" />
                    Query AI Analyst
                  </Button>
                </Link>
                <Link href="/profile">
                  <Button variant="secondary" size="sm">
                    Account Settings
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>

        <div className="container-editorial py-8 space-y-8">
          {/* Audit Metrics */}
          <section aria-label="Audit summary">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="card-padded">
                <p className="data-label">Active Review Signals</p>
                <p className="data-value-lg text-[hsl(var(--status-warning))]">{signals.length}</p>
                <p className="text-[11px] text-text-muted mt-1">Requiring human review</p>
              </div>
              <div className="card-padded">
                <p className="data-label">High-Variance Amendments</p>
                <p className="data-value-lg text-[hsl(var(--status-error))]">1</p>
                <p className="text-[11px] text-text-muted mt-1">&gt;15% budget threshold</p>
              </div>
              <div className="card-padded">
                <p className="data-label">Single-Bid Awards</p>
                <p className="data-value-lg">1</p>
                <p className="text-[11px] text-text-muted mt-1">Competition check flag</p>
              </div>
              <div className="card-padded">
                <p className="data-label">On-Chain Verified</p>
                <p className="data-value-lg text-[hsl(var(--status-success))]">100%</p>
                <p className="text-[11px] text-text-muted mt-1">Base Sepolia anchored</p>
              </div>
            </div>
          </section>

          {/* Active Review Signals Triage Queue */}
          <section aria-label="Review signals queue">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <ShieldAlert className="h-5 w-5 text-[hsl(var(--status-warning))]" />
                <h2 className="text-heading-sm text-text-primary">
                  Review Signals Triage Queue
                </h2>
              </div>
              <Link href="/signals" className="text-xs text-[hsl(var(--status-info))] hover:underline">
                View all signals →
              </Link>
            </div>

            <div className="space-y-3">
              {signals.map((sig) => (
                <div
                  key={sig.id}
                  className="card-padded border border-border/80 bg-surface hover:shadow-xs transition-shadow"
                >
                  <div className="flex flex-col md:flex-row md:items-start justify-between gap-3">
                    <div className="space-y-1.5 max-w-3xl">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className={severityBadges[sig.severity] ?? "badge-neutral"}>
                          {sig.severity}
                        </span>
                        <span className="font-mono text-xs text-text-muted">
                          {sig.ruleId}
                        </span>
                        <span className="text-xs text-text-muted">·</span>
                        <Link
                          href={`/contracts/${sig.procurement?.ocid}`}
                          className="font-mono text-xs text-[hsl(var(--forest-green))] hover:underline font-medium"
                        >
                          {sig.procurement?.ocid}
                        </Link>
                      </div>

                      <h3 className="text-sm font-semibold text-text-primary">
                        {sig.title}
                      </h3>
                      <p className="text-xs text-text-secondary leading-relaxed">
                        {sig.description}
                      </p>

                      <div className="pt-1 flex items-center gap-4 text-[11px] text-text-muted">
                        <span>Project: <strong className="text-text-secondary">{sig.procurement?.title}</strong></span>
                        <span>Entity: <strong className="text-text-secondary">{sig.procurement?.procuringEntity?.shortName}</strong></span>
                      </div>
                    </div>

                    <div className="flex-shrink-0 pt-1">
                      <Link href={`/contracts/${sig.procurement?.ocid}`}>
                        <Button size="sm" variant="outline" className="gap-1.5 text-xs">
                          Audit Dossier
                          <ArrowRight className="h-3 w-3" />
                        </Button>
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Quick Auditor Toolkit */}
          <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="card-padded space-y-2">
              <div className="flex items-center gap-2 text-text-primary">
                <Bot className="h-4 w-4 text-[hsl(var(--forest-green))]" />
                <h3 className="text-sm font-semibold">AI Procurement Analyst</h3>
              </div>
              <p className="text-xs text-text-secondary leading-relaxed">
                Query complex contract amendments, supplier concentration, and payment dates in plain English.
              </p>
              <Link href="/analyst" className="inline-block pt-2">
                <Button size="sm" variant="secondary" className="text-xs">
                  Launch Analyst
                </Button>
              </Link>
            </div>

            <div className="card-padded space-y-2">
              <div className="flex items-center gap-2 text-text-primary">
                <FileCheck2 className="h-4 w-4 text-[hsl(var(--forest-green))]" />
                <h3 className="text-sm font-semibold">Cryptographic Document Check</h3>
              </div>
              <p className="text-xs text-text-secondary leading-relaxed">
                Compute local SHA-256 hashes of submitted contract PDFs and verify against the on-chain registry.
              </p>
              <Link href="/verify" className="inline-block pt-2">
                <Button size="sm" variant="secondary" className="text-xs">
                  Run Hash Check
                </Button>
              </Link>
            </div>

            <div className="card-padded space-y-2">
              <div className="flex items-center gap-2 text-text-primary">
                <Database className="h-4 w-4 text-[hsl(var(--forest-green))]" />
                <h3 className="text-sm font-semibold">OCDS 1.1 Data Feed</h3>
              </div>
              <p className="text-xs text-text-secondary leading-relaxed">
                Download structured machine-readable procurement records and timeline event logs.
              </p>
              <Link href="/ocds/releases" className="inline-block pt-2">
                <Button size="sm" variant="secondary" className="text-xs">
                  Inspect Releases
                </Button>
              </Link>
            </div>
          </section>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
