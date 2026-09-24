import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@opencontract/database/client";
import { z } from "zod";
import type { VerificationResult } from "@opencontract/types";

const verifySchema = z.object({
  sha256: z
    .string()
    .regex(/^[a-f0-9]{64}$/i, "Must be a valid SHA-256 hex string"),
});

/**
 * POST /api/v1/verify/document
 *
 * Accepts a SHA-256 hash and looks it up against registered document hashes.
 * The file itself is NEVER uploaded to this endpoint — the browser hashes it client-side.
 * This prevents large file uploads and keeps the verification privacy-friendly.
 */
export async function POST(request: NextRequest) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: { code: "VALIDATION_ERROR", message: "Request body must be valid JSON" } },
      { status: 400 }
    );
  }

  const parsed = verifySchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      {
        error: {
          code: "VALIDATION_ERROR",
          message: "Invalid hash format",
          fields: parsed.error.flatten().fieldErrors,
        },
      },
      { status: 400 }
    );
  }

  const { sha256 } = parsed.data;
  const normalizedHash = sha256.toLowerCase();

  try {
    // Search for a matching document
    const document = await prisma.document.findFirst({
      where: { sha256: normalizedHash },
      include: {
        procurement: { select: { ocid: true, title: true } },
        blockchainAnchors: {
          orderBy: { createdAt: "desc" },
          take: 1,
        },
      },
    });

    if (!document) {
      const result: VerificationResult = {
        outcome: "NOT_REGISTERED",
        sha256: normalizedHash,
      };
      return NextResponse.json({ data: result });
    }

    const anchor = document.blockchainAnchors[0];
    const blockchainStatus = anchor
      ? (anchor.status as VerificationResult["blockchainStatus"])
      : undefined;

    // If document is registered but blockchain still pending
    if (anchor && anchor.status === "PENDING") {
      const result: VerificationResult = {
        outcome: "PENDING",
        sha256: normalizedHash,
        registeredAt: document.createdAt.toISOString(),
        blockchainStatus: "PENDING",
        transactionHash: null,
      };
      return NextResponse.json({ data: result });
    }

    const result: VerificationResult = {
      outcome: "VERIFIED",
      sha256: normalizedHash,
      registeredAt: document.createdAt.toISOString(),
      blockchainStatus,
      transactionHash: anchor?.transactionHash ?? null,
      matchedDocument: {
        id: document.id,
        filename: document.filename,
        originalName: document.originalName,
        mimeType: document.mimeType,
        sizeBytes: document.sizeBytes.toString(),
        sha256: document.sha256,
        category: document.category as VerificationResult["matchedDocument"]["category"],
        visibility: document.visibility as VerificationResult["matchedDocument"]["visibility"],
        status: document.status as VerificationResult["matchedDocument"]["status"],
        createdAt: document.createdAt.toISOString(),
        isDemo: document.isDemo,
        ocid: document.procurement?.ocid,
        procurementTitle: document.procurement?.title,
      },
    };

    return NextResponse.json({ data: result });
  } catch (error) {
    console.error("[POST /api/v1/verify/document]", error);
    return NextResponse.json(
      {
        error: {
          code: "INTERNAL_ERROR",
          message: "Verification check failed. Please try again.",
        },
      },
      { status: 500 }
    );
  }
}
