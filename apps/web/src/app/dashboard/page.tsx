import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { getPublicStatistics } from "@/services/procurement/statistics";
import { formatMoney, formatDate } from "@/lib/utils";
import { prisma } from "@opencontract/database/client";
import Link from "next/link";
import { StatusBadge } from "@/components/ui/status-badge";
import { EmptyState } from "@/components/ui/states";

export const metadata: Metadata = {
  title: "Dashboard",
};

export default async function DashboardPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/auth/signin?callbackUrl=/dashboard");
  }

  const stats = await getPublicStatistics();

  // Fetch recent activity
  let recentProcurements: any[] = [];
  try {
    recentProcurements = await prisma.procurement.findMany({
      where: { status: { not: "DRAFT" } },
      orderBy: { publishedAt: "desc" },
      take: 5,
      include: {
        procuringEntity: { select: { name: true } },
        awards: {
          where: { status: "PUBLISHED" },
          include: { supplier: { select: { name: true } } },
          take: 1,
        },
      },
    });
  } catch {}

  return (
    <>
      <SiteHeader />
      <main>
        <div className="border-b border-border bg-surface">
          <div className="container-editorial py-8">
            <p className="text-label uppercase text-text-muted mb-1">Dashboard</p>
            <h1 className="text-heading-xl text-text-primary">
              Welcome back, {session.user.name.split(" ")[0]}
            </h1>
            <p className="text-body-sm text-text-secondary mt-1">
              Role: {session.user.role.replace(/_/g, " ")}
            </p>
          </div>
        </div>

        <div className="container-editorial py-8 space-y-8">
          {/* Platform stats */}
          <section aria-label="Platform overview">
            <h2 className="text-heading-sm text-text-primary mb-4">Platform overview</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { label: "Active tenders", value: stats.activeTenders.toLocaleString() },
                { label: "Active contracts", value: stats.activeContracts.toLocaleString() },
                { label: "Pending signals", value: stats.pendingSignals.toLocaleString() },
                { label: "Verified documents", value: stats.verifiedDocuments.toLocaleString() },
              ].map(({ label, value }) => (
                <div key={label} className="card-padded">
                  <p className="data-label">{label}</p>
                  <p className="data-value-lg">{value}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Recent procurements */}
          <section aria-label="Recent procurements">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-heading-sm text-text-primary">Recent procurements</h2>
              <Link href="/explore" className="text-sm text-[hsl(var(--status-info))] hover:underline">
                View all →
              </Link>
            </div>
            {recentProcurements.length === 0 ? (
              <EmptyState
                title="No procurements yet"
                description="Published procurement records will appear here."
              />
            ) : (
              <div className="card overflow-hidden">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th scope="col">OCID</th>
                      <th scope="col">Title</th>
                      <th scope="col">Status</th>
                      <th scope="col">Entity</th>
                      <th scope="col">Published</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentProcurements.map((p) => (
                      <tr key={p.id}>
                        <td>
                          <Link
                            href={`/contracts/${p.ocid}`}
                            className="font-mono text-xs text-[hsl(var(--status-info))] hover:underline"
                          >
                            {p.ocid}
                          </Link>
                        </td>
                        <td className="max-w-xs truncate">{p.title}</td>
                        <td>
                          <StatusBadge status={p.status} />
                        </td>
                        <td className="text-text-secondary">{p.procuringEntity.name}</td>
                        <td className="text-text-secondary">{formatDate(p.publishedAt)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>

          {/* Quick links */}
          <section aria-label="Quick actions">
            <h2 className="text-heading-sm text-text-primary mb-4">Quick access</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {[
                { href: "/explore", label: "Browse contracts", description: "Search all public procurement records" },
                { href: "/verify", label: "Verify a document", description: "Check document fingerprint" },
                { href: "/signals", label: "Review signals", description: `${stats.pendingSignals} signals pending` },
              ].map((item) => (
                <Link key={item.href} href={item.href} className="card-padded hover:shadow-sm transition-shadow">
                  <p className="text-sm font-medium text-text-primary">{item.label}</p>
                  <p className="text-xs text-text-secondary mt-0.5">{item.description}</p>
                </Link>
              ))}
            </div>
          </section>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
