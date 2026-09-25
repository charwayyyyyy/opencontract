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
          {/* Section 1: OCDS Standards */}
          <section>
            <div className="flex items-center gap-2 mb-3">
              <Database className="h-5 w-5 text-primary" />
              <h2 className="text-heading-lg text-text-primary">
                Open Contracting Data Standard (OCDS 1.1)
              </h2>
            </div>
            <div className="space-y-4 text-body text-text-secondary leading-relaxed">
              <p>
                OpenContract structures all procurement data according to the global Open
                Contracting Data Standard (OCDS version 1.1). Every procurement process is assigned
                a globally unique Open Contracting Identifier (OCID).
              </p>
              <p>
                Each procurement follows sequential stages:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-sm text-text-secondary">
                <li><strong>Planning:</strong> Budget allocation, project rationale, and preliminary notices.</li>
                <li><strong>Tender:</strong> Public procurement notices, evaluation criteria, and lot specifications.</li>
                <li><strong>Award:</strong> Bid evaluations, shortlisted bidders, and award justifications.</li>
                <li><strong>Contract:</strong> Formal agreements, initial values, amendments, and sign dates.</li>
                <li><strong>Implementation:</strong> Milestone tracking, inspections, and verified interim payments.</li>
              </ul>
            </div>
          </section>

          <div className="section-divider" />

          {/* Section 2: Cryptographic Document Verification */}
          <section>
            <div className="flex items-center gap-2 mb-3">
              <FileCheck className="h-5 w-5 text-primary" />
              <h2 className="text-heading-lg text-text-primary">
                Zero-Upload Cryptographic Document Verification
              </h2>
            </div>
            <div className="space-y-4 text-body text-text-secondary leading-relaxed">
              <p>
                Document verification is executed entirely client-side within the browser using the
                standard Web Cryptography API (`crypto.subtle.digest(&quot;SHA-256&quot;)`).
              </p>
              <p>
                The document bytes are never transmitted to our servers or stored externally. Only the
                resulting 64-character hexadecimal digest is queried against our repository.
              </p>
              <div className="card-padded bg-muted/30 border border-border">
                <h3 className="font-semibold text-text-primary text-sm mb-2">Cryptographic Guarantee:</h3>
                <p className="text-xs text-text-muted leading-relaxed">
                  Even a single altered character, modified price figure, or changed bank account digit in a PDF
                  will produce an entirely different SHA-256 fingerprint, immediately triggering a Mismatch result.
                </p>
              </div>
            </div>
          </section>

          <div className="section-divider" />

          {/* Section 3: Blockchain Anchoring */}
          <section>
            <div className="flex items-center gap-2 mb-3">
              <ShieldCheck className="h-5 w-5 text-primary" />
              <h2 className="text-heading-lg text-text-primary">
                Base Sepolia EVM Anchoring Layer
              </h2>
            </div>
            <div className="space-y-4 text-body text-text-secondary leading-relaxed">
              <p>
                To eliminate dependence on central database integrity, key procurement milestones and document
                fingerprints are recorded on the Base Sepolia testnet via the <code>OpenContractRegistry.sol</code> smart
                contract.
              </p>
              <ul className="space-y-2 text-sm text-text-secondary">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                  <span>Immutable block timestamps provide proof of existence at publication time.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                  <span>Records cannot be retroactively modified, deleted, or backdated.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                  <span>Anyone can independently verify events directly on the Base block explorer.</span>
                </li>
              </ul>
            </div>
          </section>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
