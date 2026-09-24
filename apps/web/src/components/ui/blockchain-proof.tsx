"use client";

import { useState } from "react";
import { Copy, Check } from "lucide-react";
import { cn, shortenHash, explorerUrl } from "@/lib/utils";
import { Button } from "./button";

interface HashDisplayProps {
  hash: string;
  chars?: number;
  className?: string;
  label?: string;
  showCopy?: boolean;
}

export function HashDisplay({
  hash,
  chars = 6,
  className,
  label,
  showCopy = true,
}: HashDisplayProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(hash);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <span className={cn("inline-flex items-center gap-1.5", className)}>
      {label && (
        <span className="text-xs text-text-secondary">{label}</span>
      )}
      <code
        className="font-mono text-xs text-text-secondary bg-muted px-1.5 py-0.5 rounded"
        title={hash}
        aria-label={label ? `${label}: ${hash}` : hash}
      >
        {shortenHash(hash, chars)}
      </code>
      {showCopy && (
        <button
          type="button"
          onClick={handleCopy}
          className="text-text-muted hover:text-text-primary transition-colors"
          aria-label={copied ? "Copied" : "Copy to clipboard"}
        >
          {copied ? (
            <Check className="h-3.5 w-3.5 text-[hsl(var(--status-success))]" />
          ) : (
            <Copy className="h-3.5 w-3.5" />
          )}
        </button>
      )}
    </span>
  );
}

interface BlockchainProofProps {
  transactionHash?: string | null;
  blockNumber?: string | null;
  contractAddress?: string | null;
  dataHash?: string;
  network?: string;
  confirmedAt?: string | null;
  status: "PENDING" | "SUBMITTED" | "CONFIRMED" | "FAILED";
  className?: string;
}

export function BlockchainProof({
  transactionHash,
  blockNumber,
  contractAddress,
  dataHash,
  network = "base-sepolia",
  confirmedAt,
  status,
  className,
}: BlockchainProofProps) {
  const [expanded, setExpanded] = useState(false);
  const networkLabel: Record<string, string> = {
    "base-sepolia": "Base Sepolia",
    "ethereum-sepolia": "Ethereum Sepolia",
    "anvil-local": "Local (Anvil)",
  };

  return (
    <div className={cn("blockchain-proof", className)}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div
            className={cn(
              "h-2 w-2 rounded-full",
              status === "CONFIRMED" && "bg-[hsl(var(--status-success))]",
              status === "PENDING" && "bg-[hsl(var(--status-warning))] animate-pulse",
              status === "SUBMITTED" && "bg-[hsl(var(--status-info))] animate-pulse",
              status === "FAILED" && "bg-[hsl(var(--status-error))]"
            )}
            aria-hidden
          />
          <span className="text-sm font-medium text-text-primary">
            Blockchain proof
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span
            className={cn(
              "text-xs font-medium",
              status === "CONFIRMED" && "text-[hsl(var(--status-success))]",
              status === "PENDING" && "text-[hsl(var(--status-warning))]",
              status === "SUBMITTED" && "text-[hsl(var(--status-info))]",
              status === "FAILED" && "text-[hsl(var(--status-error))]"
            )}
          >
            {status === "CONFIRMED" && "✓ Anchored"}
            {status === "PENDING" && "Pending"}
            {status === "SUBMITTED" && "Submitted"}
            {status === "FAILED" && "Failed"}
          </span>
          <button
            type="button"
            onClick={() => setExpanded((p) => !p)}
            className="text-xs text-text-secondary hover:text-text-primary transition-colors"
            aria-expanded={expanded}
            aria-label="Toggle blockchain details"
          >
            {expanded ? "Less detail" : "More detail"}
          </button>
        </div>
      </div>

      {status === "CONFIRMED" && transactionHash && !expanded && (
        <div className="mt-1">
          <HashDisplay hash={transactionHash} label="Transaction" chars={8} />
        </div>
      )}

      {status === "PENDING" && (
        <p className="text-xs text-text-secondary mt-1">
          This record has been prepared for blockchain anchoring. Confirmation
          typically takes 1–2 minutes.
        </p>
      )}

      {expanded && (
        <dl className="mt-3 grid grid-cols-1 gap-2 text-xs">
          <div className="flex justify-between gap-4">
            <dt className="text-text-secondary">Network</dt>
            <dd className="font-medium text-text-primary">
              {networkLabel[network] ?? network}
            </dd>
          </div>
          {contractAddress && (
            <div className="flex justify-between gap-4">
              <dt className="text-text-secondary">Contract</dt>
              <dd>
                <HashDisplay hash={contractAddress} chars={6} showCopy />
              </dd>
            </div>
          )}
          {transactionHash && (
            <div className="flex justify-between gap-4">
              <dt className="text-text-secondary">Transaction</dt>
              <dd className="flex items-center gap-2">
                <HashDisplay hash={transactionHash} chars={8} showCopy />
                {status === "CONFIRMED" && (
                  <a
                    href={explorerUrl(transactionHash, "tx", network)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[hsl(var(--status-info))] hover:underline"
                    aria-label="View transaction on block explorer"
                  >
                    View ↗
                  </a>
                )}
              </dd>
            </div>
          )}
          {blockNumber && (
            <div className="flex justify-between gap-4">
              <dt className="text-text-secondary">Block</dt>
              <dd className="font-mono text-text-primary">{blockNumber}</dd>
            </div>
          )}
          {confirmedAt && (
            <div className="flex justify-between gap-4">
              <dt className="text-text-secondary">Anchored</dt>
              <dd className="text-text-primary">
                {new Date(confirmedAt).toLocaleString("en-GH", {
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </dd>
            </div>
          )}
          {dataHash && (
            <div className="flex flex-col gap-1">
              <dt className="text-text-secondary">Data fingerprint (SHA-256)</dt>
              <dd>
                <code className="font-mono text-xs text-text-secondary bg-muted px-2 py-1 rounded block break-all">
                  {dataHash}
                </code>
              </dd>
            </div>
          )}
        </dl>
      )}
    </div>
  );
}
