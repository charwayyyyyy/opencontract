import Link from "next/link";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { Button } from "@/components/ui/button";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Page not found",
};

export default function NotFound() {
  return (
    <>
      <SiteHeader />
      <main>
        <div className="container-narrow py-24 text-center">
          <p className="text-label uppercase tracking-wide text-text-muted mb-4">
            404
          </p>
          <h1 className="text-heading-xl text-text-primary mb-3">
            Page not found
          </h1>
          <p className="text-body text-text-secondary mb-8">
            The page you're looking for doesn't exist, or the procurement record
            may have been removed or never published.
          </p>
          <div className="flex justify-center gap-3">
            <Link href="/explore">
              <Button>Browse procurements</Button>
            </Link>
            <Link href="/">
              <Button variant="outline">Home</Button>
            </Link>
          </div>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
