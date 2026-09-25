import type { Metadata } from "next";
import Link from "next/link";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { ArrowRight, BookOpen, Code2, Database, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Documentation — OpenContract",
  description:
    "System guides, API reference, smart contract documentation, and developer setup for OpenContract.",
};

export default function DocsPage() {
  return (
    <>
      <SiteHeader />
      <main>
        <div className="border-b border-border bg-surface">
          <div className="container-narrow py-10">
            <p className="text-xs uppercase tracking-wider text-text-muted font-medium mb-1">
              Developer & Auditor Documentation
            </p>
            <h1 className="text-display text-text-primary mb-3">
              OpenContract Documentation
            </h1>
            <p className="text-body-lg text-text-secondary">
              Architecture overviews, data schema specifications, smart contract addresses, and integration guides.
            </p>
          </div>
        </div>

        <div className="container-narrow py-12 space-y-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Link href="/docs/api" className="card-padded group hover:border-primary/50 transition-all">
              <div className="flex items-center gap-3 mb-2">
                <Code2 className="h-5 w-5 text-primary" />
                <h2 className="text-heading-sm text-text-primary group-hover:text-primary transition-colors">
                  REST API Reference
                </h2>
              </div>
              <p className="text-sm text-text-secondary mb-4">
                Query procurements, download OCDS records, execute document verification, and access integrity metrics.
              </p>
              <span className="text-xs text-primary font-medium inline-flex items-center gap-1">
                Explore APIs <ArrowRight className="h-3 w-3" />
              </span>
            </Link>

            <Link href="/methodology" className="card-padded group hover:border-primary/50 transition-all">
              <div className="flex items-center gap-3 mb-2">
                <Database className="h-5 w-5 text-primary" />
                <h2 className="text-heading-sm text-text-primary group-hover:text-primary transition-colors">
                  OCDS 1.1 Data Model
                </h2>
              </div>
              <p className="text-sm text-text-secondary mb-4">
                Learn how planning, tenders, awards, contracts, amendments, and payment milestones map to OCDS.
              </p>
              <span className="text-xs text-primary font-medium inline-flex items-center gap-1">
                View Schema <ArrowRight className="h-3 w-3" />
              </span>
            </Link>

            <Link href="/verify" className="card-padded group hover:border-primary/50 transition-all">
              <div className="flex items-center gap-3 mb-2">
                <Shield className="h-5 w-5 text-primary" />
                <h2 className="text-heading-sm text-text-primary group-hover:text-primary transition-colors">
                  Document Verifier Guide
                </h2>
              </div>
              <p className="text-sm text-text-secondary mb-4">
                How in-browser SHA-256 fingerprinting verifies official PDF documents without uploading raw files.
              </p>
              <span className="text-xs text-primary font-medium inline-flex items-center gap-1">
                Try Verifier <ArrowRight className="h-3 w-3" />
              </span>
            </Link>

            <Link href="/limitations" className="card-padded group hover:border-primary/50 transition-all">
              <div className="flex items-center gap-3 mb-2">
                <BookOpen className="h-5 w-5 text-primary" />
                <h2 className="text-heading-sm text-text-primary group-hover:text-primary transition-colors">
                  Integrity Principles
                </h2>
              </div>
              <p className="text-sm text-text-secondary mb-4">
                Understanding institutional limits, review signals vs findings, and responsible civic technology usage.
              </p>
              <span className="text-xs text-primary font-medium inline-flex items-center gap-1">
                Read Principles <ArrowRight className="h-3 w-3" />
              </span>
            </Link>
          </div>

          {/* Smart Contract Quick Reference */}
          <div className="card-padded bg-surface border border-border">
            <h3 className="text-heading-sm text-text-primary mb-3">Smart Contract Reference</h3>
            <p className="text-sm text-text-secondary mb-4 leading-relaxed">
              OpenContract deploys a tamper-evident event and document registry contract on Base Sepolia:
            </p>
            <dl className="text-xs space-y-2 font-mono">
              <div className="flex justify-between py-1 border-b border-border">
                <dt className="text-text-muted">Network</dt>
                <dd className="text-text-primary">Base Sepolia (Chain ID: 84532)</dd>
              </div>
              <div className="flex justify-between py-1 border-b border-border">
                <dt className="text-text-muted">Registry Contract</dt>
                <dd className="text-text-primary">OpenContractRegistry.sol</dd>
              </div>
              <div className="flex justify-between py-1 border-b border-border">
                <dt className="text-text-muted">Contract Standard</dt>
                <dd className="text-text-primary">Solidity 0.8.28</dd>
              </div>
              <div className="flex justify-between py-1">
                <dt className="text-text-muted">Foundry Toolchain</dt>
                <dd className="text-text-primary">forge test --root contracts</dd>
              </div>
            </dl>
          </div>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
