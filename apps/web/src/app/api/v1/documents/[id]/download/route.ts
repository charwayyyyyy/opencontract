import { NextRequest, NextResponse } from "next/server";
import { DEMO_PROCUREMENTS } from "@/services/procurement/demo-data";
import { prisma } from "@opencontract/database/client";

interface RouteContext {
  params: Promise<{ id: string }>;
}

export async function GET(_request: NextRequest, { params }: RouteContext) {
  const { id } = await params;

  let doc = null;

  try {
    const dbDoc = await prisma.document.findUnique({ where: { id } });
    if (dbDoc) {
      doc = {
        id: dbDoc.id,
        filename: dbDoc.filename,
        originalName: dbDoc.originalName,
        mimeType: dbDoc.mimeType,
        sha256: dbDoc.sha256,
      };
    }
  } catch {
    // DB unreachable, check demo
  }

  if (!doc) {
    for (const proc of DEMO_PROCUREMENTS) {
      const match = proc.documents.find((d) => d.id === id);
      if (match) {
        doc = match;
        break;
      }
    }
  }

  if (!doc) {
    return NextResponse.json(
      { error: { code: "NOT_FOUND", message: "Document not found" } },
      { status: 404 }
    );
  }

  const sampleContent = `================================================================================
OPENCONTRACT PUBLIC RECORD VERIFICATION COPY
================================================================================
Document Name: ${doc.originalName}
Document ID:   ${doc.id}
File Format:   ${doc.mimeType}
SHA-256 Hash:  ${doc.sha256}
Generated At:  ${new Date().toISOString()}

NOTICE:
This is an authentic demonstration verification copy generated from the
OpenContract procurement registry. The cryptographic SHA-256 fingerprint
above is anchored to the Base Sepolia blockchain testnet.

To independently verify this file, upload it to the OpenContract document
verification tool at:
https://opencontract.dev/verify

Public money should leave a public trail.
================================================================================
`;

  return new NextResponse(sampleContent, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Content-Disposition": `attachment; filename="${doc.originalName}.txt"`,
      "X-OpenContract-SHA256": doc.sha256,
    },
  });
}
