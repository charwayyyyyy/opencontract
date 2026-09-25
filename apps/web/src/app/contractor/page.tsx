import type { Metadata } from "next";
import { redirect } from "next/navigation";
import Link from "next/link";
import { auth } from "@/lib/auth";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { prisma } from "@opencontract/database/client";
import { formatMoney, formatDate } from "@/lib/utils";
import {
  Briefcase,
  FileCheck2,
  CheckCircle2,
  Clock,
  ArrowRight,
  Shield,
  Layers,
  FileSignature,
} from "lucide-react";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Contractor Portal",
  description: "View awarded contracts, track delivery milestones, and submit verification documents.",
};

export default async function ContractorPortalPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/auth/signin?callbackUrl=/contractor");
  }

  const role = session.user.role;
  if (!["CONTRACTOR", "ADMIN"].includes(role)) {
    redirect("/dashboard");
  }

  // Fetch contractor's awarded procurements
  let procurements: any[] = [];
  try {
    procurements = await prisma.procurement.findMany({
      where: {
        isDemo: true,
        awards: {
          some: {
            supplier: {
              shortName: { contains: "BuilderCo", mode: "insensitive" },
            },
          },
        },
      },
      include: {
        procuringEntity: { select: { name: true, shortName: true } },
        awards: {
          include: { supplier: { select: { name: true } } },
        },
        contracts: true,
        milestones: { orderBy: { sequenceNumber: "asc" } },
        blockchainAnchors: { take: 2 },
      },
    });
  } catch (err) {
    console.error("[ContractorPortalPage]", err);
  }

  return (
    <>
      <SiteHeader />
      <main className="min-h-screen bg-background">
        {/* Banner Header */}
        <div className="border-b border-border bg-surface">
          <div className="container-editorial py-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <p className="text-label uppercase text-text-muted mb-1">Contractor &amp; Supplier Portal</p>
                <h1 className="text-heading-xl text-text-primary">
                  Accra BuilderCo Ltd
                </h1>
                <p className="text-body-sm text-text-secondary mt-1">
                  Vendor ID: <span className="font-mono text-text-primary font-medium">GH-BUILDER-001</span> ·
                  Representative: <span className="text-text-primary font-medium">{session.user.name}</span>
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Link href="/verify">
                  <Button variant="outline" size="sm" className="gap-2">
                    <FileCheck2 className="h-4 w-4" />
                    Verify Document Hash
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
          {/* Key Metrics */}
          <section aria-label="Contractor overview">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="card-padded">
                <p className="data-label">Active Contracts</p>
                <p className="data-value-lg">1</p>
                <p className="text-[11px] text-text-muted mt-1">In implementation</p>
              </div>
              <div className="card-padded">
                <p className="data-label">Total Contract Value</p>
                <p className="data-value-lg text-[hsl(var(--forest-green))]">
                  {formatMoney(51800000, "GHS")}
                </p>
                <p className="text-[11px] text-text-muted mt-1">Includes approved amendment (+9.75%)</p>
              </div>
              <div className="card-padded">
                <p className="data-label">Completed Milestones</p>
                <p className="data-value-lg">4 / 6</p>
                <p className="text-[11px] text-text-muted mt-1">Phase 2 on schedule</p>
              </div>
              <div className="card-padded">
                <p className="data-label">Blockchain Anchors</p>
                <p className="data-value-lg flex items-center gap-1.5">
                  <CheckCircle2 className="h-5 w-5 text-[hsl(var(--status-success))]" />
                  <span>Verified</span>
                </p>
                <p className="text-[11px] text-text-muted mt-1">Base Sepolia verified</p>
              </div>
            </div>
          </section>

          {/* Awarded Public Contracts */}
          <section aria-label="Awarded contracts">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-heading-sm text-text-primary">Awarded Public Works</h2>
              <span className="text-xs text-text-muted">Showing 1 active contract</span>
            </div>

            <div className="space-y-4">
              {procurements.map((proc) => {
                const contract = proc.contracts[0];
                return (
                  <div key={proc.id} className="card-padded border border-border/80 bg-surface shadow-xs">
                    <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 pb-4 border-b border-border">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-xs text-[hsl(var(--forest-green))] font-medium">
                            {proc.ocid}
                          </span>
                          <span className="badge-success text-[10px]">Active Implementation</span>
                        </div>
                        <h3 className="text-base font-semibold text-text-primary">
                          {proc.title}
                        </h3>
                        <p className="text-xs text-text-secondary">
                          Procuring Authority: <span className="font-medium text-text-primary">{proc.procuringEntity.name}</span>
                        </p>
                      </div>

                      <div className="text-left md:text-right flex-shrink-0">
                        <p className="text-xs text-text-muted">Original Contract Award</p>
                        <p className="text-lg font-semibold text-text-primary">
                          {formatMoney(contract ? Number(contract.value) : Number(proc.estimatedValue), proc.currency)}
                        </p>
                        <Link href={`/contracts/${proc.ocid}`}>
                          <Button size="sm" className="mt-2 gap-1.5">
                            Inspect Public Record
                            <ArrowRight className="h-3.5 w-3.5" />
                          </Button>
                        </Link>
                      </div>
                    </div>

                    {/* Milestones Progress */}
                    <div className="pt-4">
                      <p className="text-xs font-semibold uppercase tracking-wider text-text-muted mb-3">
                        Delivery Milestones &amp; Work Progress
                      </p>
                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                        {proc.milestones.map((ms: any) => (
                          <div
                            key={ms.id}
                            className="p-3 rounded-lg border border-border/60 bg-muted/30 text-xs space-y-1"
                          >
                            <div className="flex items-center justify-between">
                              <span className="font-medium text-text-primary truncate">
                                {ms.title}
                              </span>
                              {ms.status === "COMPLETED" ? (
                                <span className="text-[10px] text-[hsl(var(--status-success))] font-medium flex items-center gap-0.5">
                                  <CheckCircle2 className="h-3 w-3" /> Done
                                </span>
                              ) : (
                                <span className="text-[10px] text-text-muted flex items-center gap-0.5">
                                  <Clock className="h-3 w-3" /> In Progress
                                </span>
                              )}
                            </div>
                            <p className="text-[11px] text-text-secondary line-clamp-1">
                              {ms.description}
                            </p>
                            <p className="text-[10px] text-text-muted font-mono">
                              Due: {formatDate(ms.dueDate)}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>

          {/* Quick Verification Guide */}
          <section className="card-padded bg-[hsl(var(--forest-green)/0.04)] border border-[hsl(var(--forest-green)/0.2)]">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-[hsl(var(--forest-green))]">
                  <Shield className="h-4 w-4" />
                  <span className="text-xs font-semibold uppercase tracking-wider">
                    Zero-Knowledge Document Verification
                  </span>
                </div>
                <h3 className="text-base font-semibold text-text-primary">
                  Need to verify your invoice or milestone sign-off sheet?
                </h3>
                <p className="text-xs text-text-secondary max-w-xl">
                  OpenContract calculates SHA-256 digests entirely in your browser using the Web Crypto API.
                  Your confidential documents are never uploaded to any server.
                </p>
              </div>
              <Link href="/verify">
                <Button className="gap-2">
                  <FileCheck2 className="h-4 w-4" />
                  Launch Verifier
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
