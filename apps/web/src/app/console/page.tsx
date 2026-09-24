import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";

export const metadata: Metadata = {
  title: "Procurement Console",
};

export default async function ConsolePage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/auth/signin?callbackUrl=/console");
  }

  const role = session.user.role;
  if (!["PROCUREMENT_OFFICER", "EVALUATOR", "ADMIN"].includes(role)) {
    redirect("/dashboard");
  }

  return (
    <>
      <SiteHeader />
      <main>
        <div className="border-b border-border bg-surface">
          <div className="container-editorial py-8">
            <p className="text-label uppercase text-text-muted mb-1">Procurement Console</p>
            <h1 className="text-heading-xl text-text-primary">Console</h1>
            <p className="text-body-sm text-text-secondary mt-1">
              {role === "PROCUREMENT_OFFICER" || role === "ADMIN"
                ? "Manage procurement processes, publish tenders, and record contract events."
                : "Review evaluations and provide technical assessments."}
            </p>
          </div>
        </div>
        <div className="container-editorial py-8">
          <div className="card-padded text-center py-16">
            <p className="text-heading-sm text-text-primary mb-2">Console — Coming Soon</p>
            <p className="text-body text-text-secondary max-w-md mx-auto">
              The procurement officer console for creating procurements, managing tenders,
              recording awards, and tracking contract implementation is part of Phase 2.
              The data model, API routes, and blockchain anchoring service are complete.
            </p>
          </div>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
