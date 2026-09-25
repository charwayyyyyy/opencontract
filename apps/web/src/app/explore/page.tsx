import type { Metadata } from "next";
import { Suspense } from "react";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { ProcurementExplorer } from "@/components/procurement/procurement-explorer";
import { ProcurementListSkeleton } from "@/components/ui/states";

export const metadata: Metadata = {
  title: "Explore procurements",
  description:
    "Search and browse public procurement records — contracts, suppliers, organizations, and procurement histories.",
};

export default function ExplorePage() {
  return (
    <>
      <SiteHeader />
      <main>
        <div className="border-b border-border bg-surface">
          <div className="container-editorial py-8">
            <h1 className="text-heading-xl text-text-primary mb-1">
              Explore procurements
            </h1>
            <p className="text-body text-text-secondary">
              Search contracts, suppliers, organizations or OCIDs.
            </p>
          </div>
        </div>
        <Suspense fallback={<ProcurementExplorerSkeleton />}>
          <ProcurementExplorer />
        </Suspense>
      </main>
      <SiteFooter />
    </>
  );
}

function ProcurementExplorerSkeleton() {
  return (
    <div className="container-editorial py-6" aria-hidden>
      <div className="flex flex-col sm:flex-row gap-3 mb-4">
        <div className="relative flex-1">
          <div className="skeleton h-9 w-full rounded-md" />
        </div>
        <div className="skeleton h-9 w-24 rounded-md" />
      </div>
      <ProcurementListSkeleton />
    </div>
  );
}
