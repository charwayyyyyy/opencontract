import type { Metadata } from "next";
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
        <VerifyPage />
      </main>
      <SiteFooter />
    </>
  );
}
