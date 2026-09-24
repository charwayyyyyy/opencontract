import type { Metadata } from "next";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { prisma } from "@opencontract/database/client";
import Link from "next/link";
import { Building2, ExternalLink } from "lucide-react";
import { EmptyState } from "@/components/ui/states";

export const metadata: Metadata = {
  title: "Organizations",
  description:
    "Public entities and suppliers registered in OpenContract.",
};

export const revalidate = 300;

async function getOrganizations() {
  try {
    return await prisma.organization.findMany({
      where: { isActive: true },
      orderBy: [{ type: "asc" }, { name: "asc" }],
      include: {
        procurements: {
          where: { status: { not: "DRAFT" } },
          select: { id: true },
        },
        contracts: {
          where: { status: { in: ["ACTIVE", "AMENDED", "IMPLEMENTATION", "COMPLETED"] } },
          select: { id: true },
        },
      },
    });
  } catch {
    return [];
  }
}

export default async function OrganizationsPage() {
  const organizations = await getOrganizations();

  const publicEntities = organizations.filter((o) => o.type === "PUBLIC_ENTITY");
  const contractors = organizations.filter((o) => o.type === "CONTRACTOR");

  return (
    <>
      <SiteHeader />
      <main>
        <div className="border-b border-border bg-surface">
          <div className="container-editorial py-8">
            <h1 className="text-heading-xl text-text-primary mb-1">Organizations</h1>
            <p className="text-body text-text-secondary">
              {organizations.length} organizations registered.
            </p>
          </div>
        </div>

        <div className="container-editorial py-8 space-y-10">

          {/* Procuring Entities */}
          <section aria-label="Public entities">
            <h2 className="text-heading-sm text-text-primary mb-4">
              Procuring entities
            </h2>
            {publicEntities.length === 0 ? (
              <EmptyState title="No entities registered" />
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {publicEntities.map((org) => (
                  <OrganizationCard
                    key={org.id}
                    org={org}
                    procurementCount={org.procurements.length}
                    contractCount={org.contracts.length}
                  />
                ))}
              </div>
            )}
          </section>

          {/* Contractors */}
          <section aria-label="Contractors">
            <h2 className="text-heading-sm text-text-primary mb-4">
              Registered contractors
            </h2>
            {contractors.length === 0 ? (
              <EmptyState title="No contractors registered" />
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {contractors.map((org) => (
                  <OrganizationCard
                    key={org.id}
                    org={org}
                    procurementCount={0}
                    contractCount={org.contracts.length}
                  />
                ))}
              </div>
            )}
          </section>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}

function OrganizationCard({
  org,
  procurementCount,
  contractCount,
}: {
  org: {
    id: string;
    name: string;
    shortName: string | null;
    type: string;
    region: string | null;
    country: string;
    website: string | null;
    identifier: string | null;
    isDemo: boolean;
  };
  procurementCount: number;
  contractCount: number;
}) {
  return (
    <div className="card-padded hover:shadow-sm transition-shadow">
      <div className="flex items-start justify-between gap-2 mb-2">
        <Building2 className="h-5 w-5 text-text-muted flex-shrink-0 mt-0.5" aria-hidden />
        {org.isDemo && <span className="demo-banner">DEMO</span>}
      </div>
      <p className="text-sm font-medium text-text-primary mb-0.5">{org.name}</p>
      {org.shortName && (
        <p className="text-xs text-text-secondary mb-2">{org.shortName}</p>
      )}
      <div className="flex flex-wrap gap-3 text-xs text-text-muted">
        {org.region && <span>{org.region}</span>}
        {org.identifier && <span className="font-mono">{org.identifier}</span>}
      </div>
      <div className="mt-3 pt-3 border-t border-border flex gap-4 text-xs text-text-secondary">
        {procurementCount > 0 && (
          <span>{procurementCount} procurement{procurementCount !== 1 ? "s" : ""}</span>
        )}
        {contractCount > 0 && (
          <span>{contractCount} contract{contractCount !== 1 ? "s" : ""}</span>
        )}
      </div>
      {org.website && (
        <a
          href={org.website}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-2 inline-flex items-center gap-1 text-xs text-[hsl(var(--status-info))] hover:underline"
        >
          Website
          <ExternalLink className="h-3 w-3" aria-hidden />
        </a>
      )}
    </div>
  );
}
