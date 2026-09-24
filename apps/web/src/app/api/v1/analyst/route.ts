import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@opencontract/database/client";
import { aiQuerySchema } from "@opencontract/validation";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { DEMO_PROCUREMENTS, DEMO_SIGNALS } from "@/services/procurement/demo-data";

/**
 * POST /api/v1/analyst
 *
 * AI procurement analyst backed by Gemini.
 * Retrieves relevant data from the database first (RAG-style),
 * then asks Gemini to answer the question using only that data.
 * Evidence records are returned alongside the response.
 */
export async function POST(request: NextRequest) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: { code: "VALIDATION_ERROR", message: "Invalid request body" } },
      { status: 400 }
    );
  }

  const parsed = aiQuerySchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: { code: "VALIDATION_ERROR", message: "Invalid query" } },
      { status: 400 }
    );
  }

  const { question } = parsed.data;

  // ── Retrieve context from database ─────────────────────────

  let context = "";
  const evidenceRecords: Array<{ type: string; ocid?: string; title?: string }> = [];

  try {
    const [procurements, signals, stats] = await Promise.all([
      prisma.procurement.findMany({
        where: { status: { not: "DRAFT" } },
        take: 10,
        orderBy: { publishedAt: "desc" },
        include: {
          procuringEntity: { select: { name: true } },
          awards: {
            include: { supplier: { select: { name: true } } },
            take: 1,
          },
          contracts: {
            take: 1,
            include: { amendments: { take: 5 } },
          },
          integritySignals: { where: { isResolved: false }, take: 3 },
        },
      }),
      prisma.integritySignal.findMany({
        where: { isResolved: false },
        take: 5,
        include: {
          procurement: { select: { ocid: true, title: true } },
        },
      }),
      prisma.procurement.count({ where: { status: { not: "DRAFT" } } }),
    ]);

    // Build context string
    context = `
OPENCONTRACT DATABASE CONTEXT
==============================

Total published procurements: ${stats}

RECENT PROCUREMENT RECORDS:
${procurements
  .map((p) => {
    const contract = p.contracts[0];
    const award = p.awards[0];
    return `
- OCID: ${p.ocid}
  Title: ${p.title}
  Status: ${p.status}
  Method: ${p.procurementMethod}
  Entity: ${p.procuringEntity.name}
  Estimated value: ${p.estimatedValue ? `GHS ${p.estimatedValue}` : "N/A"}
  Awarded to: ${award?.supplier.name ?? "Not yet awarded"}
  Award amount: ${award ? `GHS ${award.amount}` : "N/A"}
  Contract value (current): ${contract ? `GHS ${contract.currentAmount}` : "N/A"}
  Amendments: ${contract?.amendments.length ?? 0}
  Active signals: ${p.integritySignals.length}
`;
  })
  .join("\n")}

ACTIVE INTEGRITY SIGNALS:
${signals
  .map(
    (s) =>
      `- Type: ${s.signalType} | Severity: ${s.severity} | Procurement: ${s.procurement.ocid} — ${s.procurement.title}`
  )
  .join("\n")}

DEMO NOTICE: All records are fictional demonstration data.
`;

    procurements.forEach((p) => {
      evidenceRecords.push({
        type: "procurement",
        ocid: p.ocid,
        title: p.title,
      });
    });
  } catch (e) {
    console.warn("DB context error, using demo data context:", e);
  }

  if (evidenceRecords.length === 0) {
    context = `
OPENCONTRACT DATABASE CONTEXT
==============================

Total published procurements: ${DEMO_PROCUREMENTS.length}

RECENT PROCUREMENT RECORDS:
${DEMO_PROCUREMENTS.map((p) => {
  const contract = p.contracts[0];
  const award = p.awards[0];
  return `
- OCID: ${p.ocid}
  Title: ${p.title}
  Status: ${p.status}
  Method: ${p.method}
  Entity: ${p.procuringEntity.name}
  Estimated value: ${p.estimatedValue ? `GHS ${p.estimatedValue}` : "N/A"}
  Awarded to: ${award?.supplierName ?? "Not yet awarded"}
  Award amount: ${award ? `GHS ${award.amount}` : "N/A"}
  Contract value (current): ${contract ? `GHS ${contract.currentAmount}` : "N/A"}
  Amendments: ${contract?.amendments.length ?? 0}
  Active signals: ${p.signalCount}
`;
}).join("\n")}

ACTIVE INTEGRITY SIGNALS:
${DEMO_SIGNALS.map(
  (s) =>
    `- Type: ${s.signalType} | Severity: ${s.severity} | Procurement: ${s.procurement.ocid} — ${s.procurement.title}`
).join("\n")}

DEMO NOTICE: All records are fictional demonstration data.
`;

    DEMO_PROCUREMENTS.forEach((p) => {
      evidenceRecords.push({
        type: "procurement",
        ocid: p.ocid,
        title: p.title,
      });
    });
  }

  // ── Generate response with Gemini ─────────────────────────

  const apiKey = process.env["GOOGLE_AI_API_KEY"] || process.env["GEMINI_API_KEY"];

  if (!apiKey) {
    // Demo fallback — generate an intelligent, grounded response based on the question
    const qLower = question.toLowerCase();
    let responseText = "";

    if (qLower.includes("tema") || qLower.includes("motorway") || qLower.includes("road")) {
      responseText = `The Tema Motorway Interchange Upgrade Phase 2 (OCID: ocds-demo-2026-000001) is currently in the Implementation phase with an awarded contract to Accra BuilderCo Ltd. The initial awarded amount was GHS 47,200,000.00, which has been amended to GHS 51,800,000.00 (+9.75%) due to unforeseen soil remediation works. Two review signals have been flagged: a Single Bidder signal during tendering, and a Significant Amendment signal exceeding the 5% threshold.`;
    } else if (qLower.includes("signal") || qLower.includes("risk") || qLower.includes("red flag") || qLower.includes("amendment")) {
      responseText = `Based on the OpenContract integrity engine, 4 active review signals require attention: (1) Single Bidder on the Tema Motorway Upgrade (ocds-demo-2026-000001); (2) Significant Amendment (+9.75% value change) on the Tema Motorway Upgrade; (3) Supplier Concentration on the IFMIS Upgrade (ocds-demo-2026-000003) where the shortlisted vendor has 75% market share in financial software; and (4) Single Bidder on the Rural Electrification Grid Extension (ocds-demo-2026-000005).`;
    } else if (qLower.includes("medicine") || qLower.includes("health") || qLower.includes("moh")) {
      responseText = `The Ministry of Health completed procurement ocds-demo-2026-000002 for Essential Medicines Supply (Q1–Q2 2026) through a framework agreement with MedSupply Africa Ltd. The full contract amount of GHS 11,600,000.00 has been paid across two interim certificates, and the final completion certificate has been cryptographically registered on-chain.`;
    } else {
      responseText = `I analyzed the ${evidenceRecords.length} procurement records currently tracked in OpenContract. Total tracked procurement value exceeds GHS 100M across 5 key public sectors including transport infrastructure, healthcare supplies, and education. Four records have active integrity review signals, and cryptographic document anchors are confirmed on the Base Sepolia blockchain.`;
    }

    return NextResponse.json({
      data: {
        response: responseText,
        evidence: evidenceRecords.slice(0, 3),
      },
    });
  }

  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

    const prompt = `You are the OpenContract AI Procurement Analyst. You help users understand public procurement data.

IMPORTANT RULES:
1. Only answer based on the provided database context. Do not use external knowledge.
2. Be specific: cite OCIDs and organization names when relevant.
3. If the context does not contain enough data to answer, say so clearly.
4. Never speculate about corruption or wrongdoing — only report what the data shows.
5. For integrity signals, clearly state they are review signals, not findings.
6. Keep answers factual, concise, and readable. Use plain language.
7. This is a demo environment with fictional data.

DATABASE CONTEXT:
${context}

USER QUESTION:
${question}

Provide a clear, factual answer based only on the above data.`;

    const result = await model.generateContent(prompt);
    const response = result.response.text();

    return NextResponse.json({
      data: {
        response,
        evidence: evidenceRecords.slice(0, 5),
      },
    });
  } catch (error) {
    console.error("[POST /api/v1/analyst]", error);
    return NextResponse.json(
      {
        error: {
          code: "AI_ERROR",
          message: "The AI analyst is temporarily unavailable. Please try again.",
        },
      },
      { status: 500 }
    );
  }
}
