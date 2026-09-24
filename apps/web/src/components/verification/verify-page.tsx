"use client";

import { useState, useCallback, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { useDropzone } from "react-dropzone";
import Link from "next/link";
import {
  Upload,
  FileText,
  CheckCircle2,
  AlertTriangle,
  Info,
  RotateCcw,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/states";
import { formatFileSize, formatDateTime, shortenHash, documentCategoryLabel } from "@/lib/utils";
import type { VerificationResult } from "@opencontract/types";

type VerifyState =
  | "idle"
  | "hashing"
  | "checking"
  | "verified"
  | "mismatch"
  | "not_registered"
  | "pending"
  | "error";

export function VerifyPage() {
  const searchParams = useSearchParams();
  const preloadedHash = searchParams.get("hash");

  const [file, setFile] = useState<File | null>(null);
  const [state, setState] = useState<VerifyState>(preloadedHash ? "checking" : "idle");
  const [result, setResult] = useState<VerificationResult | null>(null);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [computedHash, setComputedHash] = useState<string>("");

  // If a hash was pre-loaded from query string (e.g., from document card)
  useEffect(() => {
    if (preloadedHash && state === "checking") {
      checkHash(preloadedHash);
    }
  }, [preloadedHash]);

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const dropped = acceptedFiles[0];
    if (!dropped) return;

    setFile(dropped);
    setState("hashing");
    setResult(null);
    setErrorMessage("");

    try {
      // Hash the exact file bytes — the actual verification mechanism
      const hash = await hashFile(dropped);
      setComputedHash(hash);
      setState("checking");
      await checkHash(hash);
    } catch (e) {
      setState("error");
      setErrorMessage("We couldn't generate a fingerprint for this file. Please try again.");
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive, isDragReject } = useDropzone({
    onDrop,
    accept: { "application/pdf": [".pdf"] },
    maxFiles: 1,
    maxSize: 50 * 1024 * 1024, // 50MB
    disabled: state !== "idle",
  });

  async function checkHash(hash: string) {
    setState("checking");
    try {
      const res = await fetch("/api/v1/verify/document", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sha256: hash }),
      });

      if (!res.ok) {
        const text = await res.text();
        throw new Error(text);
      }

      const json = await res.json() as { data: VerificationResult };
      const verifyResult = json.data;
      setResult(verifyResult);

      switch (verifyResult.outcome) {
        case "VERIFIED":
          setState("verified");
          break;
        case "MISMATCH":
          setState("mismatch");
          break;
        case "NOT_REGISTERED":
          setState("not_registered");
          break;
        case "PENDING":
          setState("pending");
          break;
        default:
          setState("error");
          setErrorMessage("Verification returned an unexpected result.");
      }
    } catch (e) {
      setState("error");
      setErrorMessage("We couldn't complete the verification check. Please try again.");
    }
  }

  function reset() {
    setFile(null);
    setState("idle");
    setResult(null);
    setErrorMessage("");
    setComputedHash("");
  }

  return (
    <div className="container-narrow py-12 md:py-16">
      {/* Header */}
      <div className="mb-10">
        <p className="text-label text-text-secondary uppercase tracking-wide mb-2">
          Document verification
        </p>
        <h1 className="text-heading-xl text-text-primary mb-3">
          Verify a public document
        </h1>
        <p className="text-body text-text-secondary leading-relaxed max-w-lg">
          Check whether a document matches the cryptographic fingerprint registered
          for an OpenContract record. Upload a PDF to begin.
        </p>
      </div>

      {/* Upload zone — only shown when idle */}
      {state === "idle" && (
        <div
          {...getRootProps()}
          className={[
            "border-2 border-dashed rounded-xl p-12 text-center cursor-pointer transition-colors",
            isDragActive && !isDragReject
              ? "border-primary bg-primary-subtle"
              : isDragReject
              ? "border-[hsl(var(--status-error))] bg-[hsl(var(--status-error-bg))]"
              : "border-border hover:border-primary/50 hover:bg-muted/30",
          ].join(" ")}
          role="button"
          aria-label="Upload a PDF document to verify"
          tabIndex={0}
        >
          <input {...getInputProps()} aria-label="File upload" />
          <div className="flex flex-col items-center gap-4">
            <div
              className={[
                "w-14 h-14 rounded-full flex items-center justify-center",
                isDragActive && !isDragReject ? "bg-primary text-primary-foreground" : "bg-muted",
              ].join(" ")}
              aria-hidden
            >
              <Upload className="h-6 w-6" />
            </div>
            <div>
              {isDragReject ? (
                <p className="font-medium text-[hsl(var(--status-error))]">
                  Only PDF files are accepted
                </p>
              ) : isDragActive ? (
                <p className="font-medium text-primary">Drop to verify</p>
              ) : (
                <>
                  <p className="font-medium text-text-primary">
                    Drop a PDF here, or click to choose
                  </p>
                  <p className="text-sm text-text-secondary mt-1">
                    Supported: PDF · Maximum size: 50 MB
                  </p>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Processing states */}
      {(state === "hashing" || state === "checking") && (
        <div className="card-padded flex flex-col items-center py-12 text-center gap-4">
          <Spinner className="h-8 w-8 text-primary" />
          <div>
            <p className="font-medium text-text-primary">
              {state === "hashing"
                ? "Generating document fingerprint…"
                : "Comparing with public record…"}
            </p>
            <p className="text-sm text-text-secondary mt-1">
              {state === "hashing"
                ? "Calculating the SHA-256 hash of the uploaded file."
                : "Checking the fingerprint against registered OpenContract documents."}
            </p>
          </div>
          {file && (
            <div className="flex items-center gap-2 text-sm text-text-secondary">
              <FileText className="h-4 w-4" aria-hidden />
              {file.name} ({formatFileSize(file.size)})
            </div>
          )}
        </div>
      )}

      {/* VERIFIED */}
      {state === "verified" && result && (
        <div
          className="card overflow-hidden"
          role="status"
          aria-live="assertive"
          aria-label="Document verified"
        >
          <div className="bg-[hsl(var(--status-success-bg))] border-b border-[hsl(149,25%,82%)] px-6 py-5">
            <div className="flex items-center gap-3">
              <CheckCircle2
                className="h-6 w-6 text-[hsl(var(--status-success))]"
                aria-hidden
              />
              <div>
                <p className="font-semibold text-[hsl(149,35%,25%)] text-lg">
                  Document verified
                </p>
                <p className="text-sm text-[hsl(149,25%,40%)] mt-0.5">
                  This file matches the cryptographic fingerprint registered for the public record.
                </p>
              </div>
            </div>
          </div>
          <div className="p-6 space-y-5">
            <VerificationDetails result={result} hash={computedHash || result.sha256} />
            {result.matchedDocument && (
              <div className="border-t border-border pt-4">
                <p className="text-sm font-medium text-text-primary mb-2">
                  Matched record
                </p>
                <div className="space-y-1.5 text-sm">
                  <div className="flex justify-between gap-4">
                    <span className="text-text-secondary">Document</span>
                    <span className="text-text-primary font-medium text-right">
                      {result.matchedDocument.originalName}
                    </span>
                  </div>
                  <div className="flex justify-between gap-4">
                    <span className="text-text-secondary">Type</span>
                    <span className="text-text-primary">
                      {documentCategoryLabel(result.matchedDocument.category)}
                    </span>
                  </div>
                  {result.matchedDocument.ocid && (
                    <div className="flex justify-between gap-4">
                      <span className="text-text-secondary">Procurement</span>
                      <Link
                        href={`/contracts/${result.matchedDocument.ocid}`}
                        className="text-[hsl(var(--status-info))] hover:underline font-mono text-xs"
                      >
                        {result.matchedDocument.ocid}
                      </Link>
                    </div>
                  )}
                </div>
              </div>
            )}
            <div className="pt-2">
              <Button onClick={reset} variant="outline" size="sm" className="gap-1.5">
                <RotateCcw className="h-3.5 w-3.5" aria-hidden />
                Verify another document
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* MISMATCH */}
      {state === "mismatch" && result && (
        <div
          className="card overflow-hidden"
          role="alert"
          aria-live="assertive"
          aria-label="Document mismatch"
        >
          <div className="bg-[hsl(var(--status-error-bg))] border-b border-[hsl(0,40%,87%)] px-6 py-5">
            <div className="flex items-center gap-3">
              <AlertTriangle
                className="h-6 w-6 text-[hsl(var(--status-error))]"
                aria-hidden
              />
              <div>
                <p className="font-semibold text-[hsl(0,45%,32%)] text-lg">
                  Document does not match
                </p>
                <p className="text-sm text-[hsl(0,30%,45%)] mt-0.5">
                  The uploaded file differs from the version registered in OpenContract.
                </p>
              </div>
            </div>
          </div>
          <div className="p-6 space-y-4">
            <p className="text-sm text-text-secondary">
              This may mean the file has been modified, or that it is a different version
              of the document. This check does not determine intent.
            </p>
            <VerificationDetails result={result} hash={computedHash || result.sha256} />
            <Button onClick={reset} variant="outline" size="sm" className="gap-1.5">
              <RotateCcw className="h-3.5 w-3.5" aria-hidden />
              Try another document
            </Button>
          </div>
        </div>
      )}

      {/* NOT REGISTERED */}
      {state === "not_registered" && (
        <div
          className="card-padded"
          role="status"
          aria-live="polite"
          aria-label="Document not registered"
        >
          <div className="flex items-start gap-3">
            <Info
              className="h-5 w-5 text-[hsl(var(--status-info))] mt-0.5 flex-shrink-0"
              aria-hidden
            />
            <div>
              <p className="font-medium text-text-primary">Not registered</p>
              <p className="text-sm text-text-secondary mt-1">
                No document with this fingerprint is registered in OpenContract. This
                could mean the document predates the platform, was not registered, or
                is not a public procurement document.
              </p>
              {computedHash && (
                <p className="mt-3 text-xs text-text-muted">
                  Fingerprint checked:{" "}
                  <code className="font-mono bg-muted px-1 rounded">{computedHash}</code>
                </p>
              )}
            </div>
          </div>
          <div className="mt-4">
            <Button onClick={reset} variant="outline" size="sm" className="gap-1.5">
              <RotateCcw className="h-3.5 w-3.5" aria-hidden />
              Try another document
            </Button>
          </div>
        </div>
      )}

      {/* PENDING */}
      {state === "pending" && result && (
        <div className="card-padded" role="status" aria-live="polite">
          <div className="flex items-start gap-3">
            <Info
              className="h-5 w-5 text-[hsl(var(--status-warning))] mt-0.5 flex-shrink-0"
              aria-hidden
            />
            <div>
              <p className="font-medium text-text-primary">Registered — blockchain pending</p>
              <p className="text-sm text-text-secondary mt-1">
                This document is registered in OpenContract and the file matches,
                but blockchain anchoring is still processing. Check back shortly.
              </p>
            </div>
          </div>
          <VerificationDetails result={result} hash={computedHash || result.sha256} className="mt-4" />
          <div className="mt-4">
            <Button onClick={reset} variant="outline" size="sm" className="gap-1.5">
              <RotateCcw className="h-3.5 w-3.5" aria-hidden />
              Verify another document
            </Button>
          </div>
        </div>
      )}

      {/* ERROR */}
      {state === "error" && (
        <div className="card-padded" role="alert">
          <div className="flex items-start gap-3">
            <AlertTriangle
              className="h-5 w-5 text-[hsl(var(--status-error))] mt-0.5 flex-shrink-0"
              aria-hidden
            />
            <div>
              <p className="font-medium text-text-primary">Verification failed</p>
              <p className="text-sm text-text-secondary mt-1">
                {errorMessage || "Something went wrong. Please try again."}
              </p>
            </div>
          </div>
          <div className="mt-4">
            <Button onClick={reset} variant="outline" size="sm" className="gap-1.5">
              <RotateCcw className="h-3.5 w-3.5" aria-hidden />
              Try again
            </Button>
          </div>
        </div>
      )}

      {/* Methodology note — always shown */}
      <div className="mt-8 card-padded bg-muted/30 border-border">
        <p className="text-xs text-text-secondary leading-relaxed">
          <strong className="text-text-primary">How this works:</strong> The uploaded file
          is never sent to our servers — your browser calculates a SHA-256 fingerprint
          locally. We then check whether that fingerprint matches a registered document
          hash. A match confirms the file is byte-for-byte identical to the registered
          version. It does not verify whether the contents are truthful.
        </p>
      </div>
    </div>
  );
}

// ── Shared verification details ───────────────────────────────

function VerificationDetails({
  result,
  hash,
  className,
}: {
  result: VerificationResult;
  hash: string;
  className?: string;
}) {
  return (
    <dl className={`space-y-2 text-sm ${className ?? ""}`}>
      <div className="flex justify-between gap-4">
        <dt className="text-text-secondary">SHA-256 fingerprint</dt>
        <dd>
          <code
            className="font-mono text-xs text-text-secondary bg-muted px-1.5 py-0.5 rounded break-all"
            title={hash}
          >
            {shortenHash(hash, 10)}
          </code>
        </dd>
      </div>
      {result.registeredAt && (
        <div className="flex justify-between gap-4">
          <dt className="text-text-secondary">Registered</dt>
          <dd className="text-text-primary">{formatDateTime(result.registeredAt)}</dd>
        </div>
      )}
      {result.blockchainStatus && (
        <div className="flex justify-between gap-4">
          <dt className="text-text-secondary">Blockchain status</dt>
          <dd>
            <span
              className={
                result.blockchainStatus === "CONFIRMED"
                  ? "badge-success"
                  : result.blockchainStatus === "PENDING"
                  ? "badge-warning"
                  : "badge-neutral"
              }
            >
              {result.blockchainStatus === "CONFIRMED"
                ? "✓ Confirmed"
                : result.blockchainStatus === "PENDING"
                ? "Pending"
                : result.blockchainStatus}
            </span>
          </dd>
        </div>
      )}
    </dl>
  );
}

// ── File hashing — browser-side SHA-256 ───────────────────────

async function hashFile(file: File): Promise<string> {
  const buffer = await file.arrayBuffer();
  const hashBuffer = await crypto.subtle.digest("SHA-256", buffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
}
