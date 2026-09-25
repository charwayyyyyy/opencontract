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
                Blockchain Cannot Establish Truthfulness
              </h2>
            </div>
            <div className="space-y-4 text-body text-text-secondary leading-relaxed">
              <p>
                Blockchain anchoring establishes that a specific fingerprint was registered at a specific time. It guarantees the registered record has not been altered since publication.
              </p>
              <p>
                However, <strong>the blockchain cannot establish the truthfulness of original inputs.</strong> It cannot verify whether the procurement legally occurred, whether the prices were fair, or whether the publisher was telling the truth. Blockchain verification establishes fingerprint registration, not legal authenticity or factual truth.
              </p>
            </div>
          </section>

          <div className="section-divider" />

          {/* Section 2 */}
          <section>
            <div className="flex items-center gap-2 mb-3">
              <Scale className="h-5 w-5 text-primary" />
              <h2 className="text-heading-lg text-text-primary">
                Integrity Signals Are Indicators For Review
              </h2>
            </div>
            <div className="space-y-4 text-body text-text-secondary leading-relaxed">
              <p>
                OpenContract automatically flags patterns such as single-bidder tenders, major amendments, or significant delays.
              </p>
              <p>
                These flags are <strong>indicators for review, not findings of misconduct.</strong> A single bidder may result from specialized technical requirements; an amendment may be legitimate. They do not represent findings of criminality, fraud, or corruption.
              </p>
            </div>
          </section>

          <div className="section-divider" />

          {/* Section 3 */}
          <section>
            <div className="flex items-center gap-2 mb-3">
              <Info className="h-5 w-5 text-[hsl(var(--status-info))]" />
              <h2 className="text-heading-lg text-text-primary">
                Incomplete Data & AI Limitations
              </h2>
            </div>
            <div className="space-y-4 text-body text-text-secondary leading-relaxed">
              <p>
                <strong>Incomplete visibility:</strong> OpenContract can only analyze records that are officially published. Incomplete source data produces incomplete visibility. If a contract is not registered in the system, it cannot be verified or analyzed.
              </p>
              <p>
                <strong>AI boundaries:</strong> AI responses depend entirely on the available canonical records. The AI analyst does not know facts outside the published procurement database.
              </p>
            </div>
          </section>

          <div className="section-divider" />

          {/* Section 4 */}
          <section>
            <div className="flex items-center gap-2 mb-3">
              <Info className="h-5 w-5 text-[hsl(var(--status-info))]" />
              <h2 className="text-heading-lg text-text-primary">
                Demo Environment
              </h2>
            </div>
            <div className="space-y-4 text-body text-text-secondary leading-relaxed">
              <p>
                DEMO DATA — The procurement records, organizations, and blockchain anchors in this deployment are fictional. They are used exclusively to demonstrate the OpenContract workflow and do not represent actual government procurement data.
              </p>
            </div>
          </section>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
