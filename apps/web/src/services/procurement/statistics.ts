/**
 * Statistics Service
 * Provides aggregate public statistics for the platform.
 * Used on the homepage and potentially the explorer.
 */

import { prisma } from "@opencontract/database/client";
import type { PublicStatistics } from "@opencontract/types";
import { DEMO_STATISTICS } from "./demo-data";

export async function getPublicStatistics(): Promise<PublicStatistics> {
  try {
    const [
      totalProcurements,
      activeTenders,
      activeContracts,
      contractValueResult,
      pendingSignals,
      verifiedDocuments,
    ] = await Promise.all([
      prisma.procurement.count({
        where: { status: { not: "DRAFT" } },
      }),
      prisma.tender.count({
        where: { status: "OPEN" },
      }),
      prisma.contract.count({
        where: { status: { in: ["ACTIVE", "AMENDED"] } },
      }),
      prisma.contract.aggregate({
        _sum: { currentAmount: true },
        where: { status: { in: ["ACTIVE", "AMENDED", "COMPLETED"] } },
      }),
      prisma.integritySignal.count({
        where: { isResolved: false },
      }),
      prisma.document.count({
        where: { status: "REGISTERED" },
      }),
    ]);

    if (totalProcurements === 0) {
      return DEMO_STATISTICS;
    }

    return {
      totalProcurements,
      activeTenders,
      activeContracts,
      totalContractValue: contractValueResult._sum.currentAmount?.toString() ?? "0",
      pendingSignals,
      verifiedDocuments,
    };
  } catch {
    return DEMO_STATISTICS;
  }
}
