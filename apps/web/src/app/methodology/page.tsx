import type { Metadata } from "next";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { CheckCircle2, ShieldCheck, Database, FileCheck } from "lucide-react";

export const metadata: Metadata = {
  title: "Methodology — OpenContract",
  description:
    "How OpenContract processes public procurement data, applies OCDS 1.1 standards, and generates cryptographic blockchain anchors.",
};

export default function MethodologyPage() {
  return (
    <>
      <SiteHeader />
      <main>
        <div className="border-b border-border bg-surface">
          <div className="container-narrow py-10">
            <p className="text-xs uppercase tracking-wider text-text-muted font-medium mb-1">
              Technical Reference
            </p>
            <h1 className="text-display text-text-primary mb-3">
              Procurement Methodology
            </h1>
            <p className="text-body-lg text-text-secondary">
              Standards, cryptographic hashing protocols, and integrity evaluation rules.
            </p>
          </div>
        </div>

        <div className="container-narrow py-12 space-y-12">
          <section>
            <div className="flex items-center gap-2 mb-3">
              <Database className="h-5 w-5 text-primary" />
              <h2 className="text-heading-lg text-text-primary">
                The Evidence Model
              </h2>
            </div>
            <div className="space-y-6 text-body text-text-secondary leading-relaxed">
              <p>
                OpenContract operates on a layered evidence model. It does not independently discover truth; it creates a verifiable trail of published claims.
              </p>
              
              <div className="space-y-4">
                <h3 className="font-semibold text-text-primary text-sm uppercase tracking-wider">1. Data Layer</h3>
                <p>
                  <strong>What it records:</strong> OpenContract structures all procurement data according to the global Open Contracting Data Standard (OCDS version 1.1). Every procurement process is assigned a globally unique Open Contracting Identifier (OCID).
                </p>
                <p>
                  <strong>Boundary:</strong> The data layer only represents what the procuring entity formally publishes (tenders, awards, contracts, amendments). It cannot establish whether off-record agreements exist or whether published prices are fair.
                </p>
              </div>

              <div className="space-y-4">
                <h3 className="font-semibold text-text-primary text-sm uppercase tracking-wider">2. Cryptographic Layer</h3>
                <p>
                  <strong>What it establishes:</strong> Document verification is executed entirely client-side within the browser using the standard Web Cryptography API. The document bytes are hashed locally; they are not uploaded.
                </p>
                <p>
                  <strong>Boundary:</strong> A cryptographic match proves only that the exact sequence of bytes in a local file matches the fingerprint registered in the database. It does not prove the document is legally valid, truthful, or free of fraud.
                </p>
              </div>

              <div className="space-y-4">
                <h3 className="font-semibold text-text-primary text-sm uppercase tracking-wider">3. Blockchain Layer</h3>
                <p>
                  <strong>What it establishes:</strong> Key procurement milestones and document fingerprints are anchored on the Base Sepolia testnet via the <code>OpenContractRegistry.sol</code> smart contract. Tamper-evident block timestamps provide proof that a specific fingerprint was registered at a specific time.
                </p>
                <p>
                  <strong>Boundary:</strong> The blockchain layer guarantees the registration timeline and prevents retrospective tampering of the anchored hashes. It cannot prevent false information from being anchored initially.
                </p>
              </div>

              <div className="space-y-4">
                <h3 className="font-semibold text-text-primary text-sm uppercase tracking-wider">4. Signal Layer</h3>
                <p>
                  <strong>What it establishes:</strong> Deterministic integrity signals evaluate the structured data against rule-based thresholds (e.g., single-bidder tenders, major cost overruns, delays).
                </p>
                <p>
                  <strong>Boundary:</strong> Signals are indicators for review. They flag records that merit closer attention; they do not represent findings of misconduct or criminality.
                </p>
              </div>

              <div className="space-y-4">
                <h3 className="font-semibold text-text-primary text-sm uppercase tracking-wider">5. AI Layer</h3>
                <p>
                  <strong>What it establishes:</strong> The Grounded AI Procurement Analyst uses Gemini to interpret and summarize the canonical records stored in the OpenContract database.
                </p>
                <p>
                  <strong>Boundary:</strong> The AI is constrained to the available structured evidence. It is designed to distinguish between what is present in the published record and what is unknown. It does not know facts outside the system.
                </p>
              </div>
            </div>
          </section>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
