/**
 * OpenContract — Blockchain Service
 * Anchors procurement event hashes to EVM blockchain (Base Sepolia).
 * Only hashes are stored on-chain — never document contents or personal data.
 */

import { createPublicClient, createWalletClient, http, parseAbi } from "viem";
import { baseSepolia } from "viem/chains";
import { privateKeyToAccount } from "viem/accounts";
import { prisma } from "@opencontract/database/client";
import { createHash } from "crypto";
import type { BlockchainEventType } from "@opencontract/types";

// Contract ABI — minimal interface for the on-chain registry
const REGISTRY_ABI = parseAbi([
  "function recordEvent(bytes32 eventType, bytes32 dataHash) external",
  "event EventRecorded(bytes32 indexed eventType, bytes32 indexed dataHash, address indexed recorder, uint256 timestamp)",
]);

export interface AnchorPayload {
  eventType: BlockchainEventType;
  data: Record<string, unknown>;
  procurementId?: string;
  bidId?: string;
  awardId?: string;
  contractId?: string;
  amendmentId?: string;
  paymentId?: string;
  milestoneId?: string;
  inspectionId?: string;
  documentId?: string;
}

/**
 * Compute the canonical SHA-256 hash of a structured payload.
 * Uses sorted JSON serialization to ensure determinism.
 */
export function computeDataHash(data: Record<string, unknown>): string {
  const canonical = JSON.stringify(sortObjectDeep(data));
  return createHash("sha256").update(canonical).digest("hex");
}

function sortObjectDeep(obj: unknown): unknown {
  if (Array.isArray(obj)) return obj.map(sortObjectDeep);
  if (obj !== null && typeof obj === "object") {
    return Object.keys(obj as Record<string, unknown>)
      .sort()
      .reduce<Record<string, unknown>>((acc, key) => {
        acc[key] = sortObjectDeep((obj as Record<string, unknown>)[key]);
        return acc;
      }, {});
  }
  return obj;
}

/**
 * Queue a blockchain anchor record.
 * Creates a pending anchor in the database for the worker to process.
 */
export async function queueAnchor(payload: AnchorPayload): Promise<string> {
  const dataHash = computeDataHash(payload.data);
  const network = process.env["BLOCKCHAIN_NETWORK"] ?? "base-sepolia";
  const contractAddress = process.env["BLOCKCHAIN_CONTRACT_ADDRESS"] ?? undefined;

  const anchor = await prisma.blockchainAnchor.create({
    data: {
      eventType: payload.eventType,
      status: "PENDING",
      network,
      contractAddress: contractAddress ?? null,
      dataHash,
      procurementId: payload.procurementId ?? null,
      bidId: payload.bidId ?? null,
      awardId: payload.awardId ?? null,
      contractId: payload.contractId ?? null,
      amendmentId: payload.amendmentId ?? null,
      paymentId: payload.paymentId ?? null,
      milestoneId: payload.milestoneId ?? null,
      inspectionId: payload.inspectionId ?? null,
      documentId: payload.documentId ?? null,
    },
  });

  return anchor.id;
}

/**
 * Submit a pending anchor to the blockchain.
 * Marks the anchor as SUBMITTED, sends the transaction, waits for confirmation.
 * Called by the background worker.
 */
export async function submitAnchor(anchorId: string): Promise<void> {
  const anchor = await prisma.blockchainAnchor.findUnique({
    where: { id: anchorId },
  });

  if (!anchor || anchor.status !== "PENDING") {
    throw new Error(`Anchor ${anchorId} not found or not in PENDING state`);
  }

  const privateKey = process.env["BLOCKCHAIN_PRIVATE_KEY"];
  const rpcUrl = process.env["BLOCKCHAIN_RPC_URL"] ?? "https://sepolia.base.org";
  const contractAddress = process.env["BLOCKCHAIN_CONTRACT_ADDRESS"];

  if (!privateKey || !contractAddress) {
    // In demo mode — simulate anchoring without actual blockchain submission
    await simulateAnchor(anchorId, anchor.dataHash);
    return;
  }

  await prisma.blockchainAnchor.update({
    where: { id: anchorId },
    data: { status: "SUBMITTED", retryCount: { increment: 1 } },
  });

  try {
    const account = privateKeyToAccount(privateKey as `0x${string}`);

    const publicClient = createPublicClient({
      chain: baseSepolia,
      transport: http(rpcUrl),
    });

    const walletClient = createWalletClient({
      account,
      chain: baseSepolia,
      transport: http(rpcUrl),
    });

    // Convert to bytes32
    const eventTypeBytes = `0x${Buffer.from(anchor.eventType.padEnd(32, "\0")).toString("hex").slice(0, 64)}` as `0x${string}`;
    const dataHashBytes = `0x${anchor.dataHash.slice(0, 64)}` as `0x${string}`;

    const hash = await walletClient.writeContract({
      address: contractAddress as `0x${string}`,
      abi: REGISTRY_ABI,
      functionName: "recordEvent",
      args: [eventTypeBytes, dataHashBytes],
    });

    // Wait for confirmation
    const receipt = await publicClient.waitForTransactionReceipt({
      hash,
      confirmations: 1,
    });

    await prisma.blockchainAnchor.update({
      where: { id: anchorId },
      data: {
        status: "CONFIRMED",
        transactionHash: hash,
        blockNumber: receipt.blockNumber,
        confirmedAt: new Date(),
      },
    });
  } catch (error) {
    await prisma.blockchainAnchor.update({
      where: { id: anchorId },
      data: {
        status: "FAILED",
        failedAt: new Date(),
        failureReason: error instanceof Error ? error.message : "Unknown error",
      },
    });
    throw error;
  }
}

/**
 * Demo simulation — marks anchor as confirmed without blockchain submission.
 * Used when no private key / contract address is configured.
 */
async function simulateAnchor(anchorId: string, dataHash: string): Promise<void> {
  const simulatedTxHash = `0x${createHash("sha256").update(`${anchorId}-${dataHash}-${Date.now()}`).digest("hex")}`;

  await prisma.blockchainAnchor.update({
    where: { id: anchorId },
    data: {
      status: "CONFIRMED",
      transactionHash: simulatedTxHash,
      blockNumber: BigInt(Math.floor(Math.random() * 1_000_000) + 14_000_000),
      confirmedAt: new Date(),
    },
  });
}
