import type { Metadata } from "next";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { AlertTriangle, Info } from "lucide-react";
import { prisma } from "@opencontract/database/client";
import { StatusBadge } from "@/components/ui/status-badge";
import { EmptyState } from "@/components/ui/states";
import { formatDate, signalTypeLabel } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Review signals",
  description:
    "Structured signals that highlight procurement records which may warrant additional review. These are not findings of wrongdoing.",
};

export const revalidate = 300;

async function getSignals() {
  try {
    return await prisma.integritySignal.findMany({
      where: { isResolved: false },
      orderBy: [{ severity: "asc" }, { createdAt: "desc" }],
      include: {
        procurement: {
          select: {
            ocid: true,
            title: true,
            procuringEntity: { select: { name: true } },
          },
        },
      },
    });
  } catch {
    return [];
  }
}

export default async function SignalsPage() {
  const signals = await getSignals();

  return (
    <>
      <SiteHeader />
      <main>
        <div className="border-b border-border bg-surface">
          <div className="container-editorial py-8">
            <h1 className="text-heading-xl text-text-primary mb-2">
              Review signals
            </h1>
            <p className="text-body text-text-secondary max-w-2xl">
              These signals highlight patterns that may warrant additional
              scrutiny. They are generated deterministically from procurement
              data — they are not findings of wrongdoing or legal violations.
            </p>
          </div>
        </div>

        <div className="container-editorial py-8">
          {/* Methodology note */}
          <div className="alert-info mb-8">
            <Info className="h-4 w-4 text-[hsl(var(--status-info))] flex-shrink-0 mt-0.5" aria-hidden />
            <div className="text-sm text-[hsl(212,47%,35%)]">
              <p className="font-medium mb-1">About these signals</p>
              <p>
                OpenContract applies deterministic rules to procurement data to
                surface records that may benefit from closer review by oversight
                bodies, journalists, or researchers. Every signal includes an
                explanation of the specific data that triggered it.
              </p>
            </div>
          </div>

          {signals.length === 0 ? (
            <EmptyState
              title="No active signals"
              description="No unresolved review signals have been generated."
            />
          ) : (
            <div className="space-y-4" role="list" aria-label="Review signals">
              {signals.map((signal) => (
                <div key={signal.id} className="card-padded" role="listitem">
                  <div className="flex flex-col sm:flex-row sm:items-start gap-3 sm:gap-4">
                    <div className="flex-shrink-0 mt-0.5">
                      <AlertTriangle
                        className="h-5 w-5 text-[hsl(var(--status-warning))]"
                        aria-hidden
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2 mb-1">
                        <p className="text-sm font-semibold text-text-primary">
                          {signalTypeLabel(signal.signalType)}
                        </p>
                        <StatusBadge
                          status={signal.severity}
                          variant="signal"
                        />
                      </div>
                      <p className="text-sm text-text-secondary">
                        {signal.explanation}
                      </p>
                      <div className="mt-2 flex flex-wrap items-center gap-3 text-xs text-text-muted">
                        <a
                          href={`/contracts/${signal.procurement.ocid}`}
                          className="text-[hsl(var(--status-info))] hover:underline"
                        >
                          {signal.procurement.ocid}
                        </a>
                        <span>·</span>
                        <span className="truncate max-w-xs">
                          {signal.procurement.title}
                        </span>
                        <span>·</span>
                        <span>{signal.procurement.procuringEntity.name}</span>
                        <span>·</span>
                        <span>Detected {formatDate(signal.createdAt)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
