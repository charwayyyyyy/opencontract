import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { ProfileClient } from "@/components/profile/profile-client";

export const metadata: Metadata = {
  title: "User Profile & Account Settings",
  description: "View and configure your OpenContract credentials, role clearances, and session settings.",
};

export default async function ProfilePage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/auth/signin?callbackUrl=/profile");
  }

  // Derive organization based on demo user identity
  const email = session.user.email;
  let organizationName = "Public Governance Authority";
  let officerAddress = "0x71C672a9Fe3b94a82B6114Ff23908f5d0F523A9f";

  if (email.includes("officer")) {
    organizationName = "Ministry of Roads and Highways (MoRH)";
    officerAddress = "0x71C672a9Fe3b94a82B6114Ff23908f5d0F523A9f";
  } else if (email.includes("contractor")) {
    organizationName = "Accra BuilderCo Ltd";
    officerAddress = "0x89205A3A3b2A69De6Dbf7f01ED13B2108B2c43e7";
  } else if (email.includes("auditor")) {
    organizationName = "Public Audit & Oversight Board";
    officerAddress = "0x2546BcD3c84621e976D8185a91A922aE77ECEc30";
  }

  return (
    <>
      <SiteHeader />
      <main className="min-h-screen bg-background">
        <div className="border-b border-border bg-surface">
          <div className="container-editorial py-8">
            <p className="text-label uppercase text-text-muted mb-1">Account &amp; Security</p>
            <h1 className="text-heading-xl text-text-primary">Profile &amp; Portal Settings</h1>
            <p className="text-body-sm text-text-secondary mt-1">
              Manage your authenticated role clearances, on-chain officer credentials, and session controls.
            </p>
          </div>
        </div>

        <div className="container-editorial py-8 max-w-4xl">
          <ProfileClient
            user={session.user}
            organizationName={organizationName}
            officerAddress={officerAddress}
          />
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
