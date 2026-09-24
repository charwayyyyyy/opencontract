import type { Metadata } from "next";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { AnalystInterface } from "@/components/analyst/analyst-interface";

export const metadata: Metadata = {
  title: "AI Procurement Analyst",
  description:
    "Ask questions about public procurement data. Every answer is traceable to a specific procurement record.",
};

export default function AnalystPage() {
  return (
    <>
      <SiteHeader />
      <main>
        <div className="border-b border-border bg-surface">
          <div className="container-narrow py-8">
            <p className="text-label uppercase tracking-wide text-text-muted mb-2">
              AI Procurement Analyst
            </p>
            <h1 className="text-heading-xl text-text-primary mb-2">
              Ask about the data
            </h1>
            <p className="text-body text-text-secondary max-w-lg">
              This tool answers questions using structured records from the OpenContract
              database. Every factual statement is traceable to a specific procurement
              record.
            </p>
          </div>
        </div>
        <AnalystInterface />
      </main>
      <SiteFooter />
    </>
  );
}
