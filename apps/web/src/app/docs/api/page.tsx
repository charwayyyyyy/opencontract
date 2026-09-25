import type { Metadata } from "next";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import Link from "next/link";
import { ArrowLeft, Code2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "API Reference — OpenContract",
  description: "REST API endpoints for querying procurements, document verification, and OCDS records.",
};

const ENDPOINTS = [
  {
    method: "GET",
    path: "/api/v1/procurements",
    desc: "List procurements with pagination, status filtering, and search query.",
    example: "/api/v1/procurements?page=1&pageSize=10",
  },
  {
    method: "GET",
    path: "/api/v1/procurements/:ocid",
    desc: "Fetch full procurement dossier by OCID, including awards, contracts, and integrity signals.",
    example: "/api/v1/procurements/ocds-demo-2026-000001",
  },
  {
    method: "GET",
    path: "/api/v1/procurements/:ocid/timeline",
    desc: "Export the full chronological event timeline of a procurement in structured JSON.",
    example: "/api/v1/procurements/ocds-demo-2026-000001/timeline",
  },
  {
    method: "GET",
    path: "/api/v1/ocds/records/:ocid",
    desc: "Export the procurement record strictly in standard Open Contracting Data Standard 1.1 format.",
    example: "/api/v1/ocds/records/ocds-demo-2026-000001",
  },
  {
    method: "POST",
    path: "/api/v1/verify/document",
    desc: "Verify a document by SHA-256 fingerprint. Returns verification outcome, registered record, and blockchain anchor status.",
    example: '{ "sha256": "a3f2b4c8d1e5f9a0b2c4d6e8f0a2b4c6d8e0f2a4b6c8d0e2f4a6b8c0d2e4f6a8" }',
  },
  {
    method: "POST",
    path: "/api/v1/analyst",
    desc: "Ask the grounded AI procurement analyst questions backed by Google Gemini and live database records.",
    example: '{ "question": "What is the status of the Tema Motorway Upgrade?" }',
  },
];

export default function ApiReferencePage() {
  return (
    <>
      <SiteHeader />
      <main>
        <div className="border-b border-border bg-surface">
          <div className="container-narrow py-10">
            <Link href="/docs" className="text-xs text-text-muted hover:text-primary mb-3 inline-flex items-center gap-1">
              <ArrowLeft className="h-3 w-3" /> Back to Documentation
            </Link>
            <h1 className="text-display text-text-primary mb-3">REST API Reference</h1>
            <p className="text-body-lg text-text-secondary">
              OpenContract provides public REST endpoints for researchers, civil society, and oversight agencies.
            </p>
          </div>
        </div>

        <div className="container-narrow py-12 space-y-8">
          {ENDPOINTS.map((endpoint) => (
            <div key={endpoint.path} className="card-padded bg-surface border border-border">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-primary/10 text-primary border border-primary/20">
                  {endpoint.method}
                </span>
                <span className="text-sm font-mono text-text-primary font-semibold">
                  {endpoint.path}
                </span>
              </div>
              <p className="text-sm text-text-secondary mb-3">{endpoint.desc}</p>
              <div className="bg-muted/40 p-2.5 rounded border border-border">
                <span className="text-[11px] text-text-muted uppercase tracking-wider block mb-1">
                  {endpoint.method === "GET" ? "Example Request:" : "Request Body:"}
                </span>
                <code className="text-xs font-mono text-text-primary break-all">
                  {endpoint.example}
                </code>
              </div>
            </div>
          ))}
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
