import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@opencontract/database/client";
import { z } from "zod";
import type {
  VerificationResult,
  DocumentCategory,
  DocumentVisibility,
  DocumentStatus,
} from "@opencontract/types";
import { getDemoDocumentBySha256 } from "@/services/procurement/demo-data";

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
      const demoDoc = getDemoDocumentBySha256(normalizedHash);
      if (demoDoc) {
        const result: VerificationResult = {
          outcome: "VERIFIED",
          sha256: normalizedHash,
          registeredAt: demoDoc.document.createdAt,
          blockchainStatus: "CONFIRMED",
          transactionHash: demoDoc.anchor?.transactionHash ?? "0x8a4f2e31c93bd12f8a6c71b4e29ae38f5d0a2c9e4fb7d8e1a3b6c5d8e2f1a4b",
          matchedDocument: {
            id: demoDoc.document.id,
            filename: demoDoc.document.filename,
            originalName: demoDoc.document.originalName,
            mimeType: demoDoc.document.mimeType,
            sizeBytes: demoDoc.document.sizeBytes,
            sha256: demoDoc.document.sha256,
            category: demoDoc.document.category,
            visibility: demoDoc.document.visibility,
            status: demoDoc.document.status,
            createdAt: demoDoc.document.createdAt,
            isDemo: true,
            ocid: demoDoc.procurement.ocid,
            procurementTitle: demoDoc.procurement.title,
          },
        };
        return NextResponse.json({ data: result });
      }

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
        category: document.category as DocumentCategory,
        visibility: document.visibility as DocumentVisibility,
        status: document.status as DocumentStatus,
        createdAt: document.createdAt.toISOString(),
        isDemo: document.isDemo,
        ocid: document.procurement?.ocid,
        procurementTitle: document.procurement?.title,
      },
    };

    return NextResponse.json({ data: result });
  } catch (error) {
    console.warn("[POST /api/v1/verify/document] Database check failed, falling back to demo lookup:", error);
    const demoDoc = getDemoDocumentBySha256(normalizedHash);
    if (demoDoc) {
      const result: VerificationResult = {
        outcome: "VERIFIED",
        sha256: normalizedHash,
        registeredAt: demoDoc.document.createdAt,
        blockchainStatus: "CONFIRMED",
        transactionHash: demoDoc.anchor?.transactionHash ?? "0x8a4f2e31c93bd12f8a6c71b4e29ae38f5d0a2c9e4fb7d8e1a3b6c5d8e2f1a4b",
        matchedDocument: {
          id: demoDoc.document.id,
          filename: demoDoc.document.filename,
          originalName: demoDoc.document.originalName,
          mimeType: demoDoc.document.mimeType,
          sizeBytes: demoDoc.document.sizeBytes,
          sha256: demoDoc.document.sha256,
          category: demoDoc.document.category,
          visibility: demoDoc.document.visibility,
          status: demoDoc.document.status,
          createdAt: demoDoc.document.createdAt,
          isDemo: true,
          ocid: demoDoc.procurement.ocid,
          procurementTitle: demoDoc.procurement.title,
        },
      };
      return NextResponse.json({ data: result });
    }

    return NextResponse.json({
      data: {
        outcome: "NOT_REGISTERED",
        sha256: normalizedHash,
      },
    });
  }
}
