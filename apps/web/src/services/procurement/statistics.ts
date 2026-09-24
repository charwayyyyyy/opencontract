/**
 * Statistics Service
 * Provides aggregate public statistics for the platform.
 * Used on the homepage and potentially the explorer.
 */

import { prisma } from "@opencontract/database/client";
import type { PublicStatistics } from "@opencontract/types";

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
        where: { status: { in: ["ACTIVE", "AMENDED", "IMPLEMENTATION"] } },
      }),
      prisma.contract.aggregate({
        _sum: { currentAmount: true },
        where: { status: { in: ["ACTIVE", "AMENDED", "IMPLEMENTATION", "COMPLETED"] } },
      }),
      prisma.integritySignal.count({
        where: { isResolved: false },
      }),
      prisma.document.count({
        where: { status: "REGISTERED" },
      }),
    ]);

    return {
      totalProcurements,
      activeTenders,
      activeContracts,
      totalContractValue: contractValueResult._sum.currentAmount?.toString() ?? "0",
      pendingSignals,
      verifiedDocuments,
    };
  } catch {
    // Return zeros gracefully if DB not yet seeded
    return {
      totalProcurements: 0,
      activeTenders: 0,
      activeContracts: 0,
      totalContractValue: "0",
      pendingSignals: 0,
      verifiedDocuments: 0,
    };
  }
}
