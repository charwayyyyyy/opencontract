import type { Metadata } from "next";
import { redirect } from "next/navigation";
import Link from "next/link";
import { auth } from "@/lib/auth";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { prisma } from "@opencontract/database/client";
import { formatMoney, formatDate } from "@/lib/utils";
import {
  Shield,
  FileCheck2,
  Clock,
  ArrowRight,
  PlusCircle,
  Link as LinkIcon,
  CheckCircle2,
  Key,
  ExternalLink,
} from "lucide-react";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Procurement Officer Console",
  description: "Manage public procurements, publish tenders, and record cryptographic event anchors on-chain.",
};

export default async function ConsolePage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/auth/signin?callbackUrl=/console");
  }

  const role = session.user.role;
  if (!["PROCUREMENT_OFFICER", "EVALUATOR", "ADMIN"].includes(role)) {
    redirect("/dashboard");
  }

  // Fetch procurements managed by public entities
  let managedProcurements: any[] = [];
  try {
    managedProcurements = await prisma.procurement.findMany({
      where: { isDemo: true },
      orderBy: { publishedAt: "desc" },
      take: 6,
      include: {
        procuringEntity: { select: { name: true, shortName: true } },
        tender: true,
        blockchainAnchors: { take: 1 },
      },
    });
  } catch (err) {
    console.error("[ConsolePage]", err);
  }

  return (
    <>
      <SiteHeader />
      <main className="min-h-screen bg-background">
        <div className="border-b border-border bg-surface">
          <div className="container-editorial py-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <p className="text-label uppercase text-text-muted mb-1">
                  Procurement Officer Command Console
                </p>
                <h1 className="text-heading-xl text-text-primary">
                  Procurement Operations
                </h1>
                <p className="text-body-sm text-text-secondary mt-1">
                  Officer: <span className="font-medium text-text-primary">{session.user.name}</span> ·
                  Entity: <span className="font-medium text-text-primary">Ministry of Roads and Highways (MoRH)</span>
                </p>
              </div>

              <div className="flex items-center gap-2">
                <Link href="/verify">
                  <Button variant="outline" size="sm" className="gap-2">
                    <FileCheck2 className="h-4 w-4" />
                    Verify Document
                  </Button>
                </Link>
                <Link href="/profile">
                  <Button variant="secondary" size="sm">
                    Account &amp; Keys
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>

        <div className="container-editorial py-8 space-y-8">
          {/* Operations Overview */}
          <section aria-label="Operations metrics">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="card-padded">
                <p className="data-label">Active Tenders</p>
                <p className="data-value-lg">3</p>
                <p className="text-[11px] text-text-muted mt-1">Open for bidding</p>
              </div>
              <div className="card-padded">
                <p className="data-label">Contracted Projects</p>
                <p className="data-value-lg">5</p>
                <p className="text-[11px] text-text-muted mt-1">Under implementation</p>
              </div>
              <div className="card-padded">
                <p className="data-label">On-Chain Anchors</p>
                <p className="data-value-lg text-[hsl(var(--forest-green))] flex items-center gap-1.5">
                  <CheckCircle2 className="h-5 w-5 text-[hsl(var(--status-success))]" />
                  <span>8 Anchored</span>
                </p>
                <p className="text-[11px] text-text-muted mt-1">Base Sepolia verified</p>
              </div>
              <div className="card-padded">
                <p className="data-label">Issuer Status</p>
                <p className="data-value-lg text-[hsl(var(--status-success))]">Authorized</p>
                <p className="text-[11px] text-text-muted mt-1">Smart registry key active</p>
              </div>
            </div>
          </section>

          {/* On-Chain Anchoring Status Banner */}
          <section className="card-padded border border-[hsl(var(--forest-green)/0.25)] bg-[hsl(var(--forest-green)/0.04)]">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-[hsl(var(--forest-green))]">
                  <Key className="h-4 w-4" />
                  <span className="text-xs font-semibold uppercase tracking-wider">
                    EVM Smart Registry Anchoring Active
                  </span>
                </div>
                <h3 className="text-base font-semibold text-text-primary">
                  All procurement events are fingerprinted with SHA-256 and anchored to Base Sepolia
                </h3>
                <p className="text-xs text-text-secondary max-w-2xl">
                  As an authorized Procurement Officer, your publication actions generate tamper-evident cryptographic
                  milestones recorded by <span className="font-mono text-text-primary">OpenContractRegistry.sol</span>.
                </p>
              </div>
              <a
                href="https://sepolia.basescan.org/address/0x5FbDB2315678afecb367f032d93F642f64180aa3"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button size="sm" variant="secondary" className="gap-1.5 text-xs">
                  Inspect Contract on BaseScan
                  <ExternalLink className="h-3 w-3" />
                </Button>
              </a>
            </div>
          </section>

          {/* Managed Procurements Table */}
          <section aria-label="Managed procurements">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-heading-sm text-text-primary">
                Managed Public Procurements
              </h2>
              <Link href="/explore" className="text-xs text-[hsl(var(--status-info))] hover:underline">
                Explore all →
              </Link>
            </div>

            <div className="card overflow-hidden border border-border/80 bg-surface shadow-xs">
              <div className="overflow-x-auto">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th scope="col">OCID</th>
                      <th scope="col">Title &amp; Entity</th>
                      <th scope="col">Stage</th>
                      <th scope="col">Budget</th>
                      <th scope="col">Blockchain Anchor</th>
                      <th scope="col" className="text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {managedProcurements.map((proc) => {
                      const hasAnchor = proc.blockchainAnchors.length > 0;
                      return (
                        <tr key={proc.id}>
                          <td className="font-mono text-xs text-[hsl(var(--forest-green))] font-medium whitespace-nowrap">
                            {proc.ocid}
                          </td>
                          <td className="max-w-xs">
                            <p className="text-sm font-medium text-text-primary truncate">
                              {proc.title}
                            </p>
                            <p className="text-xs text-text-muted">
                              {proc.procuringEntity.name}
                            </p>
                          </td>
                          <td>
                            <span className="badge-neutral text-[11px]">
                              {proc.status}
                            </span>
                          </td>
                          <td className="text-sm font-semibold text-text-primary whitespace-nowrap">
                            {formatMoney(Number(proc.estimatedValue), proc.currency)}
                          </td>
                          <td>
                            {hasAnchor ? (
                              <span className="inline-flex items-center gap-1 text-[11px] text-[hsl(var(--status-success))] font-medium">
                                <CheckCircle2 className="h-3.5 w-3.5" /> Anchored
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 text-[11px] text-text-muted">
                                <Clock className="h-3.5 w-3.5" /> Pending
                              </span>
                            )}
                          </td>
                          <td className="text-right whitespace-nowrap">
                            <Link href={`/contracts/${proc.ocid}`}>
                              <Button size="sm" variant="ghost" className="gap-1 text-xs">
                                Open Dossier
                                <ArrowRight className="h-3 w-3" />
                              </Button>
                            </Link>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </section>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
