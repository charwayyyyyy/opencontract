import type { Metadata } from "next";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { ProcurementExplorer } from "@/components/procurement/procurement-explorer";

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
        <ProcurementExplorer />
      </main>
      <SiteFooter />
    </>
  );
}
