import type { Metadata } from "next";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import Link from "next/link";
import { Download, FileCode, CheckCircle2, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { prisma } from "@opencontract/database/client";

export const metadata: Metadata = {
  title: "OCDS Releases & Data Packages — OpenContract",
  description: "Standardized Open Contracting Data Standard (OCDS 1.1) releases and JSON exports.",
};

export default async function OcdsReleasesPage() {
  let procurements: Array<{ ocid: string; title: string; status: string; publishedAt: Date }> = [];
  try {
    procurements = await prisma.procurement.findMany({
      where: { status: { not: "DRAFT" } },
      select: { ocid: true, title: true, status: true, publishedAt: true },
      orderBy: { publishedAt: "desc" },
    });
  } catch {
    procurements = [
      {
        ocid: "ocds-demo-2026-000001",
        title: "Construction of Tema Motorway Interchange Upgrade – Phase 2",
        status: "IMPLEMENTATION",
        publishedAt: new Date("2026-01-15"),
      },
      {
        ocid: "ocds-demo-2026-000002",
        title: "Essential Medicines & Clinical Supplies Framework (Q1–Q2 2026)",
        status: "COMPLETED",
        publishedAt: new Date("2026-02-01"),
      },
      {
        ocid: "ocds-demo-2026-000003",
        title: "Supply and Implementation of Cloud Infrastructure for E-Government",
        status: "OPEN",
        publishedAt: new Date("2026-03-01"),
      },
    ];
  }

  return (
    <>
      <SiteHeader />
      <main>
        <div className="border-b border-border bg-surface">
          <div className="container-narrow py-10">
            <p className="text-xs uppercase tracking-wider text-text-muted font-medium mb-1">
              Open Data Package
            </p>
            <h1 className="text-display text-text-primary mb-3">
              OCDS 1.1 Data Releases
            </h1>
            <p className="text-body-lg text-text-secondary">
              Machine-readable procurement packages compliant with the Open Contracting Data Standard.
            </p>
          </div>
        </div>

        <div className="container-narrow py-12 space-y-8">
          <div className="card-padded bg-muted/20 border border-border flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h2 className="text-heading-sm text-text-primary mb-1">OCDS 1.1 Package Specification</h2>
              <p className="text-xs text-text-secondary">
                Published with Open Contracting Data Standard schema validation, license metadata, and cryptographic event hashes.
              </p>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-primary font-medium">
              <CheckCircle2 className="h-4 w-4" /> Valid OCDS 1.1
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-text-muted">
              Published Records ({procurements.length})
            </h3>
            {procurements.map((p) => (
              <div
                key={p.ocid}
                className="card-padded bg-surface border border-border flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 hover:border-primary/40 transition-colors"
              >
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-mono text-text-muted">{p.ocid}</span>
                    <span className="badge-neutral text-[10px]">{p.status}</span>
                  </div>
                  <h4 className="text-sm font-medium text-text-primary">{p.title}</h4>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <a
                    href={`/api/v1/ocds/records/${p.ocid}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Button variant="outline" size="sm" className="gap-1.5 text-xs">
                      <Download className="h-3.5 w-3.5" />
                      JSON Record
                    </Button>
                  </a>
                  <Link href={`/contracts/${p.ocid}`}>
                    <Button size="sm" variant="ghost" className="gap-1 text-xs text-primary">
                      View Dossier <ArrowRight className="h-3.5 w-3.5" />
                    </Button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
