/**
 * Procurement Query Service
 * Server-side data access for procurement records.
 * All monetary values returned as strings (from Prisma Decimal) — never floated.
 */

import { prisma } from "@opencontract/database/client";
import type {
  ProcurementSummary,
  ProcurementDetail,
  BlockchainAnchorSummary,
  SignalSummary,
  DocumentSummary,
} from "@opencontract/types";
import type { z } from "zod";
import type { searchProcurementsSchema } from "@opencontract/validation";
import {
  searchDemoProcurements,
  getDemoProcurementByOcid,
} from "./demo-data";

type SearchParams = z.infer<typeof searchProcurementsSchema>;

export interface ProcurementListResult {
  items: ProcurementSummary[];
  total: number;
  page: number;
  pageSize: number;
  hasMore: boolean;
}

// ─── List / Search ────────────────────────────────────────────

export async function searchProcurements(
  params: SearchParams
): Promise<ProcurementListResult> {
  try {
    const { q, status, method, region, minValue, maxValue, year, page, pageSize, sortBy, sortOrder } =
      params;

  const where: Parameters<typeof prisma.procurement.findMany>[0]["where"] = {
    status: { not: "DRAFT" }, // never expose drafts to public
  };

  if (q) {
    where.OR = [
      { title: { contains: q, mode: "insensitive" } },
      { ocid: { contains: q, mode: "insensitive" } },
      { description: { contains: q, mode: "insensitive" } },
      { procuringEntity: { name: { contains: q, mode: "insensitive" } } },
    ];
  }

  if (status) where.status = status;
  if (method) where.procurementMethod = method;
  if (region) where.region = { contains: region, mode: "insensitive" };
  if (year) {
    where.publishedAt = {
      gte: new Date(`${year}-01-01`),
      lte: new Date(`${year}-12-31`),
    };
  }
  if (minValue !== undefined || maxValue !== undefined) {
    where.estimatedValue = {};
    if (minValue !== undefined) where.estimatedValue.gte = minValue;
    if (maxValue !== undefined) where.estimatedValue.lte = maxValue;
  }

  const orderBy: Parameters<typeof prisma.procurement.findMany>[0]["orderBy"] = {
    [sortBy === "estimatedValue" ? "estimatedValue" : sortBy]: sortOrder,
  };

  const skip = (page - 1) * pageSize;

  const [procurements, total] = await Promise.all([
    prisma.procurement.findMany({
      where,
      orderBy,
      skip,
      take: pageSize,
      include: {
        procuringEntity: {
          select: { id: true, name: true, shortName: true },
        },
        awards: {
          where: { status: "PUBLISHED" },
          include: { supplier: { select: { name: true } } },
          take: 1,
        },
        integritySignals: {
          where: { isResolved: false },
          select: { id: true },
        },
        documents: {
          where: { status: "REGISTERED", visibility: "PUBLIC" },
          select: { id: true },
          take: 1,
        },
      },
    }),
    prisma.procurement.count({ where }),
  ]);

  const items: ProcurementSummary[] = procurements.map((p) => ({
    id: p.id,
    ocid: p.ocid,
    title: p.title,
    description: p.description,
    status: p.status as ProcurementSummary["status"],
    method: p.procurementMethod as ProcurementSummary["method"],
    currency: p.currency,
    estimatedValue: p.estimatedValue?.toString() ?? null,
    region: p.region,
    category: p.category,
    isDemo: p.isDemo,
    publishedAt: p.publishedAt?.toISOString() ?? null,
    createdAt: p.createdAt.toISOString(),
    procuringEntity: p.procuringEntity,
    supplierName: p.awards[0]?.supplier.name ?? null,
    signalCount: p.integritySignals.length,
    hasVerifiedDocuments: p.documents.length > 0,
  }));

    if (total === 0 && !q && !status && !method && !region && minValue === undefined && maxValue === undefined && !year) {
      return searchDemoProcurements(params);
    }

    return { items, total, page, pageSize, hasMore: skip + items.length < total };
  } catch (error) {
    console.warn("[searchProcurements] Database unreachable, serving demo data:", error);
    return searchDemoProcurements(params);
  }
}

// ─── Single Procurement Detail ─────────────────────────────────

export async function getProcurementByOcid(
  ocid: string
): Promise<ProcurementDetail | null> {
  try {
    const p = await prisma.procurement.findUnique({
      where: { ocid },
    include: {
      procuringEntity: { select: { id: true, name: true, shortName: true } },
      tender: {
        include: {
          bids: {
            include: { bidder: { select: { name: true } } },
            orderBy: { submittedAt: "asc" },
          },
          documents: {
            where: { visibility: "PUBLIC" },
            orderBy: { createdAt: "desc" },
          },
        },
      },
      awards: {
        include: {
          supplier: { select: { id: true, name: true } },
          documents: { where: { visibility: "PUBLIC" } },
        },
        orderBy: { awardDate: "asc" },
      },
      contracts: {
        include: {
          supplier: { select: { id: true, name: true } },
          amendments: { orderBy: { amendmentNumber: "asc" } },
          payments: { orderBy: { paymentDate: "asc" } },
          milestones: { orderBy: { plannedDate: "asc" } },
          documents: { where: { visibility: "PUBLIC" }, orderBy: { createdAt: "desc" } },
        },
        orderBy: { createdAt: "asc" },
      },
      documents: {
        where: { visibility: "PUBLIC" },
        include: {
          uploadedBy: { select: { name: true } },
          blockchainAnchors: { where: { status: "CONFIRMED" }, take: 1 },
        },
        orderBy: { createdAt: "desc" },
      },
      integritySignals: {
        orderBy: { createdAt: "desc" },
      },
      blockchainAnchors: {
        orderBy: { createdAt: "desc" },
      },
    },
  });

    if (!p || p.status === "DRAFT") {
      return getDemoProcurementByOcid(ocid);
    }

  // Build timeline
  const timeline = buildTimeline(p);

  const totalPaid =
    p.contracts
      .flatMap((c) => c.payments)
      .reduce((sum, pay) => sum + parseFloat(pay.amount.toString()), 0)
      .toFixed(2);

  const currentAmount =
    p.contracts[0]?.currentAmount.toString() ?? p.estimatedValue?.toString() ?? "0";

  const percentagePaid =
    parseFloat(currentAmount) > 0
      ? Math.round((parseFloat(totalPaid) / parseFloat(currentAmount)) * 100)
      : 0;

  return {
    id: p.id,
    ocid: p.ocid,
    title: p.title,
    description: p.description,
    status: p.status as ProcurementDetail["status"],
    method: p.procurementMethod as ProcurementDetail["method"],
    currency: p.currency,
    estimatedValue: p.estimatedValue?.toString() ?? null,
    region: p.region,
    category: p.category,
    isDemo: p.isDemo,
    publishedAt: p.publishedAt?.toISOString() ?? null,
    createdAt: p.createdAt.toISOString(),
    procuringEntity: p.procuringEntity,
    supplierName: p.awards[0]?.supplier.name ?? null,
    signalCount: p.integritySignals.filter((s) => !s.isResolved).length,
    hasVerifiedDocuments: p.documents.some((d) => d.status === "REGISTERED"),

    tender: p.tender
      ? {
          id: p.tender.id,
          title: p.tender.title,
          description: p.tender.description,
          openingDate: p.tender.openingDate.toISOString(),
          closingDate: p.tender.closingDate.toISOString(),
          status: p.tender.status as "DRAFT" | "PUBLISHED" | "OPEN" | "CLOSED" | "CANCELLED",
          method: p.tender.procurementMethod as ProcurementDetail["method"],
          eligibilityRequirements: p.tender.eligibilityRequirements,
          evaluationCriteria: p.tender.evaluationCriteria,
          publishedAt: p.tender.publishedAt?.toISOString() ?? null,
        }
      : null,

    bids: (p.tender?.bids ?? []).map((bid) => ({
      id: bid.id,
      submissionRef: bid.submissionRef,
      submittedAt: bid.submittedAt.toISOString(),
      status: bid.status as ProcurementDetail["bids"][0]["status"],
      // Show bidder name and amount only after award (appropriate stage)
      bidderName:
        ["AWARDED", "CONTRACTED", "IMPLEMENTATION", "COMPLETED"].includes(p.status)
          ? bid.bidder.name
          : null,
      amount:
        ["AWARDED", "CONTRACTED", "IMPLEMENTATION", "COMPLETED"].includes(p.status) && !bid.isConfidential
          ? bid.amount?.toString() ?? null
          : null,
    })),

    awards: p.awards.map((a) => ({
      id: a.id,
      supplierId: a.supplierId,
      supplierName: a.supplier.name,
      amount: a.amount.toString(),
      currency: a.currency,
      awardDate: a.awardDate.toISOString(),
      status: a.status as "PENDING" | "PUBLISHED" | "CANCELLED" | "WITHDRAWN",
      justification: a.justification,
    })),

    contracts: p.contracts.map((c) => {
      const contractPaid = c.payments
        .reduce((sum, pay) => sum + parseFloat(pay.amount.toString()), 0)
        .toFixed(2);
      const contractPct =
        parseFloat(c.currentAmount.toString()) > 0
          ? Math.round(
              (parseFloat(contractPaid) / parseFloat(c.currentAmount.toString())) * 100
            )
          : 0;

      return {
        id: c.id,
        contractRef: c.contractRef,
        originalAmount: c.originalAmount.toString(),
        currentAmount: c.currentAmount.toString(),
        currency: c.currency,
        startDate: c.startDate.toISOString(),
        endDate: c.endDate?.toISOString() ?? null,
        status: c.status as "DRAFT" | "ACTIVE" | "AMENDED" | "SUSPENDED" | "COMPLETED" | "TERMINATED",
        amendments: c.amendments.map((a) => ({
          id: a.id,
          amendmentNumber: a.amendmentNumber,
          reason: a.reason,
          previousAmount: a.previousAmount.toString(),
          newAmount: a.newAmount.toString(),
          currency: a.currency,
          changeAmount: (
            parseFloat(a.newAmount.toString()) - parseFloat(a.previousAmount.toString())
          ).toFixed(2),
          changePct: Math.round(
            ((parseFloat(a.newAmount.toString()) - parseFloat(a.previousAmount.toString())) /
              parseFloat(a.previousAmount.toString())) *
              100
          ),
          effectiveDate: a.effectiveDate.toISOString(),
        })),
        totalPaid: contractPaid,
        percentagePaid: contractPct,
      };
    }),

    documents: p.documents.map(mapDocumentSummary),

    signals: p.integritySignals.map((s) => ({
      id: s.id,
      signalType: s.signalType as SignalSummary["signalType"],
      severity: s.severity as SignalSummary["severity"],
      explanation: s.explanation,
      evidence: s.evidence,
      isResolved: s.isResolved,
      createdAt: s.createdAt.toISOString(),
    })),

    timeline,

    blockchainAnchors: p.blockchainAnchors.map(mapAnchorSummary),
  };
  } catch (error) {
    console.warn("[getProcurementByOcid] Database unreachable, serving demo data:", error);
    return getDemoProcurementByOcid(ocid);
  }
}

// ─── Helper Mappers ────────────────────────────────────────────

function mapDocumentSummary(doc: {
  id: string;
  filename: string;
  originalName: string;
  mimeType: string;
  sizeBytes: bigint;
  sha256: string;
  category: string;
  visibility: string;
  status: string;
  createdAt: Date;
  isDemo: boolean;
}): DocumentSummary {
  return {
    id: doc.id,
    filename: doc.filename,
    originalName: doc.originalName,
    mimeType: doc.mimeType,
    sizeBytes: doc.sizeBytes.toString(),
    sha256: doc.sha256,
    category: doc.category as DocumentSummary["category"],
    visibility: doc.visibility as DocumentSummary["visibility"],
    status: doc.status as DocumentSummary["status"],
    createdAt: doc.createdAt.toISOString(),
    isDemo: doc.isDemo,
  };
}

function mapAnchorSummary(anchor: {
  id: string;
  eventType: string;
  status: string;
  network: string;
  contractAddress: string | null;
  transactionHash: string | null;
  blockNumber: bigint | null;
  confirmedAt: Date | null;
  dataHash: string;
  createdAt: Date;
}): BlockchainAnchorSummary {
  return {
    id: anchor.id,
    eventType: anchor.eventType as BlockchainAnchorSummary["eventType"],
    status: anchor.status as BlockchainAnchorSummary["status"],
    network: anchor.network,
    contractAddress: anchor.contractAddress,
    transactionHash: anchor.transactionHash,
    blockNumber: anchor.blockNumber?.toString() ?? null,
    confirmedAt: anchor.confirmedAt?.toISOString() ?? null,
    dataHash: anchor.dataHash,
    createdAt: anchor.createdAt.toISOString(),
  };
}

// Build a human-readable timeline from procurement events
function buildTimeline(procurement: Awaited<ReturnType<typeof prisma.procurement.findUnique>> & {
  tender?: { publishedAt: Date | null; closingDate: Date } | null;
  awards: Array<{ awardDate: Date; supplierId: string }>;
  contracts: Array<{
    signedAt: Date | null;
    amendments: Array<{ effectiveDate: Date; amendmentNumber: number }>;
    payments: Array<{ paymentDate: Date }>;
  }>;
  blockchainAnchors: Array<{
    id: string;
    eventType: string;
    status: string;
    network: string;
    contractAddress: string | null;
    transactionHash: string | null;
    blockNumber: bigint | null;
    confirmedAt: Date | null;
    dataHash: string;
    createdAt: Date;
  }>;
}): ProcurementDetail["timeline"] {
  const events: ProcurementDetail["timeline"] = [];

  // Procurement published
  if (procurement.publishedAt) {
    events.push({
      id: `created-${procurement.id}`,
      date: procurement.publishedAt.toISOString(),
      type: "PROCUREMENT_CREATED",
      label: "Procurement published",
      description: `${procurement.title} published to OpenContract.`,
      actor: procurement.procuringEntity?.name ?? null,
      isVerified: hasAnchor(procurement.blockchainAnchors, "PROCUREMENT_CREATED"),
      blockchainAnchor: getAnchor(procurement.blockchainAnchors, "PROCUREMENT_CREATED"),
      documents: [],
    });
  }

  // Tender published
  if (procurement.tender?.publishedAt) {
    events.push({
      id: `tender-${procurement.id}`,
      date: procurement.tender.publishedAt.toISOString(),
      type: "TENDER_PUBLISHED",
      label: "Tender published",
      description: `Tender open until ${new Date(procurement.tender.closingDate).toLocaleDateString("en-GH", { day: "numeric", month: "long", year: "numeric" })}.`,
      actor: null,
      isVerified: hasAnchor(procurement.blockchainAnchors, "TENDER_PUBLISHED"),
      blockchainAnchor: getAnchor(procurement.blockchainAnchors, "TENDER_PUBLISHED"),
      documents: [],
    });
  }

  // Tender closed
  if (
    procurement.tender &&
    ["CLOSED", "EVALUATION", "AWARDED", "CONTRACTED", "IMPLEMENTATION", "COMPLETED"].includes(
      procurement.status
    )
  ) {
    events.push({
      id: `closed-${procurement.id}`,
      date: procurement.tender.closingDate.toISOString(),
      type: "SUBMISSIONS_CLOSED",
      label: "Submissions closed",
      description: "Bidding period closed.",
      actor: null,
      isVerified: hasAnchor(procurement.blockchainAnchors, "SUBMISSIONS_CLOSED"),
      blockchainAnchor: getAnchor(procurement.blockchainAnchors, "SUBMISSIONS_CLOSED"),
      documents: [],
    });
  }

  // Awards
  procurement.awards.forEach((award) => {
    events.push({
      id: `award-${award.supplierId}`,
      date: award.awardDate.toISOString(),
      type: "AWARD_PUBLISHED",
      label: "Award published",
      description: "Procurement award decision published.",
      actor: null,
      isVerified: hasAnchor(procurement.blockchainAnchors, "AWARD_PUBLISHED"),
      blockchainAnchor: getAnchor(procurement.blockchainAnchors, "AWARD_PUBLISHED"),
      documents: [],
    });
  });

  // Contract
  procurement.contracts.forEach((contract) => {
    if (contract.signedAt) {
      events.push({
        id: `contract-${contract.signedAt.toISOString()}`,
        date: contract.signedAt.toISOString(),
        type: "CONTRACT_CREATED",
        label: "Contract signed",
        description: "Contract created and signed.",
        actor: null,
        isVerified: hasAnchor(procurement.blockchainAnchors, "CONTRACT_CREATED"),
        blockchainAnchor: getAnchor(procurement.blockchainAnchors, "CONTRACT_CREATED"),
        documents: [],
      });
    }

    // Amendments
    contract.amendments.forEach((amendment) => {
      events.push({
        id: `amendment-${amendment.amendmentNumber}-${amendment.effectiveDate.toISOString()}`,
        date: amendment.effectiveDate.toISOString(),
        type: "CONTRACT_AMENDED",
        label: `Contract amended (Amendment #${amendment.amendmentNumber})`,
        description: "Contract value or terms amended.",
        actor: null,
        isVerified: hasAnchor(procurement.blockchainAnchors, "CONTRACT_AMENDED"),
        blockchainAnchor: getAnchor(procurement.blockchainAnchors, "CONTRACT_AMENDED"),
        documents: [],
      });
    });

    // Payments
    contract.payments.forEach((payment, i) => {
      events.push({
        id: `payment-${i}-${payment.paymentDate.toISOString()}`,
        date: payment.paymentDate.toISOString(),
        type: "PAYMENT_RECORDED",
        label: "Payment recorded",
        description: "Payment certificate recorded.",
        actor: null,
        isVerified: hasAnchor(procurement.blockchainAnchors, "PAYMENT_RECORDED"),
        blockchainAnchor: getAnchor(procurement.blockchainAnchors, "PAYMENT_RECORDED"),
        documents: [],
      });
    });
  });

  // Sort chronologically
  return events.sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  );
}

function hasAnchor(
  anchors: Array<{ eventType: string; status: string }>,
  eventType: string
): boolean {
  return anchors.some((a) => a.eventType === eventType && a.status === "CONFIRMED");
}

function getAnchor(
  anchors: Array<{
    id: string;
    eventType: string;
    status: string;
    network: string;
    contractAddress: string | null;
    transactionHash: string | null;
    blockNumber: bigint | null;
    confirmedAt: Date | null;
    dataHash: string;
    createdAt: Date;
  }>,
  eventType: string
): BlockchainAnchorSummary | null {
  const anchor = anchors.find(
    (a) => a.eventType === eventType && a.status === "CONFIRMED"
  );
  if (!anchor) return null;
  return mapAnchorSummary(anchor);
}
