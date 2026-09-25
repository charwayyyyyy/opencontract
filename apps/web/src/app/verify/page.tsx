import type { Metadata } from "next";
import { Suspense } from "react";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { VerifyPage } from "@/components/verification/verify-page";

export const metadata: Metadata = {
  title: "Verify a document",
  description:
    "Check whether a document matches the cryptographic fingerprint registered for a public procurement record.",
};

export default function VerifyRoute() {
  return (
    <>
      <SiteHeader />
      <main>
        <Suspense fallback={<VerifyPageSkeleton />}>
          <VerifyPage />
        </Suspense>
      </main>
      <SiteFooter />
    </>
  );
}

function VerifyPageSkeleton() {
  return (
    <div className="container-narrow py-12 md:py-16" aria-hidden>
      <div className="mb-10 space-y-3">
        <div className="skeleton h-3 w-40 rounded" />
        <div className="skeleton h-9 w-72 rounded" />
        <div className="skeleton h-4 w-full max-w-lg rounded" />
      </div>
      <div className="border-2 border-dashed rounded-xl p-12">
        <div className="flex flex-col items-center gap-4">
          <div className="w-14 h-14 rounded-full bg-muted skeleton" />
          <div className="space-y-2 text-center">
            <div className="skeleton h-5 w-52 rounded mx-auto" />
            <div className="skeleton h-4 w-48 rounded mx-auto" />
          </div>
        </div>
      </div>
    </div>
  );
}
