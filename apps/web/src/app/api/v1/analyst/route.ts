import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@opencontract/database/client";
import { aiQuerySchema } from "@opencontract/validation";
import { GoogleGenerativeAI } from "@google/generative-ai";

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
    console.error("DB context error:", e);
    context = "No procurement data is available yet.";
  }

  // ── Generate response with Gemini ─────────────────────────

  const apiKey = process.env["GOOGLE_AI_API_KEY"];

  if (!apiKey) {
    // Demo fallback — return a static answer
    return NextResponse.json({
      data: {
        response: `I found ${evidenceRecords.length} procurement records in the OpenContract database. To enable the AI analyst, a Google Gemini API key must be configured in the GOOGLE_AI_API_KEY environment variable. In this demo, I can confirm the database contains the records listed in the evidence below.`,
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
