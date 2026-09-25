import type { Metadata } from "next";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { AlertTriangle, Info, Scale } from "lucide-react";

export const metadata: Metadata = {
  title: "Limitations — OpenContract",
  description:
    "Transparency principles, boundary limits, and evidentiary scope of the OpenContract platform.",
};

export default function LimitationsPage() {
  return (
    <>
      <SiteHeader />
      <main>
        <div className="border-b border-border bg-surface">
          <div className="container-narrow py-10">
            <p className="text-xs uppercase tracking-wider text-text-muted font-medium mb-1">
              Public Guidance
            </p>
            <h1 className="text-display text-text-primary mb-3">
              Platform Scope & Limitations
            </h1>
            <p className="text-body-lg text-text-secondary">
              Understanding what OpenContract proves, and what requires human investigative authority.
            </p>
          </div>
        </div>

        <div className="container-narrow py-12 space-y-12">
          {/* Section 1 */}
          <section>
            <div className="flex items-center gap-2 mb-3">
              <AlertTriangle className="h-5 w-5 text-[hsl(var(--status-warning))]" />
              <h2 className="text-heading-lg text-text-primary">
                What Cryptographic Anchoring Does and Does Not Prove
              </h2>
            </div>
            <div className="space-y-4 text-body text-text-secondary leading-relaxed">
              <p>
                <strong>What it proves:</strong> Cryptographic anchoring on the blockchain proves that a specific
                procurement event, contract value, or document hash existed in that exact form at that specific block time.
                It guarantees the record has not been altered since publication.
              </p>
              <p>
                <strong>What it does not prove:</strong> Blockchain anchoring cannot verify whether the human beings who
                drafted the document told the truth, whether market prices were fair, or whether construction materials
                meet quality specifications on the ground.
              </p>
            </div>
          </section>

          <div className="section-divider" />

          {/* Section 2 */}
          <section>
            <div className="flex items-center gap-2 mb-3">
              <Scale className="h-5 w-5 text-primary" />
              <h2 className="text-heading-lg text-text-primary">
                Integrity Signals Are Not Findings of Guilt
              </h2>
            </div>
            <div className="space-y-4 text-body text-text-secondary leading-relaxed">
              <p>
                OpenContract automatically flags patterns such as single-bidder tenders, contract amendments
                exceeding 15%, implementation delays, or high supplier concentration.
              </p>
              <p>
                These flags are <strong>signals for human audit review</strong>, not accusations of wrongdoing.
                A single bidder may result from specialized technical requirements; an amendment may be legitimate
                due to unexpected geological conditions. Only formal investigative bodies (auditor generals, anti-corruption
                commissions, parliamentary committees) have the authority to determine culpability.
              </p>
            </div>
          </section>

          <div className="section-divider" />

          {/* Section 3 */}
          <section>
            <div className="flex items-center gap-2 mb-3">
              <Info className="h-5 w-5 text-[hsl(var(--status-info))]" />
              <h2 className="text-heading-lg text-text-primary">
                Demonstration Environment
              </h2>
            </div>
            <div className="space-y-4 text-body text-text-secondary leading-relaxed">
              <p>
                The active deployment is a demonstration environment populated with realistic but fictionalized
                records to illustrate end-to-end functionality. Production deployments connect to national public procurement
                authority APIs and treasury financial management systems.
              </p>
            </div>
          </section>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
