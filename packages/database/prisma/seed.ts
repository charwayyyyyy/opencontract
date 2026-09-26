/**
 * OpenContract — Demo Seed
 * Creates realistic but entirely fictional procurement data.
 * All organizations, suppliers, and contract values are made up.
 * This seed is for demonstration purposes only.
 */

import "dotenv/config";
import path from "node:path";
import dotenv from "dotenv";

dotenv.config({ path: path.resolve(__dirname, "../../../.env") });
dotenv.config({ path: path.resolve(__dirname, "../.env") });

import { prisma } from "../src/client";
import bcrypt from "bcryptjs";

const DEMO_PASSWORD_HASH = bcrypt.hashSync("demo1234", 12);

async function main() {
  console.log("🌱 Checking if demo data needs seeding…");

  const existing = await prisma.procurement.findUnique({
    where: { ocid: "ocds-demo-2026-000001" }
  });

  if (existing) {
    console.log("✅ Demo data is already seeded. Skipping to prevent duplicates.");
    return;
  }

  console.log("🌱 Seeding demo data…");

  // ── Organizations ─────────────────────────────────────────

  const mofep = await prisma.organization.upsert({
    where: { identifier: "GH-MOFEP-001" },
    update: {},
    create: {
      name: "Ministry of Finance and Economic Planning",
      shortName: "MoFEP",
      type: "PUBLIC_ENTITY",
      identifier: "GH-MOFEP-001",
      country: "GH",
      region: "Greater Accra",
      website: "https://www.mofep.gov.gh",
      isDemo: true,
    },
  });

  const moh = await prisma.organization.upsert({
    where: { identifier: "GH-MOH-001" },
    update: {},
    create: {
      name: "Ministry of Health",
      shortName: "MoH",
      type: "PUBLIC_ENTITY",
      identifier: "GH-MOH-001",
      country: "GH",
      region: "Greater Accra",
      isDemo: true,
    },
  });

  const mor = await prisma.organization.upsert({
    where: { identifier: "GH-MOR-001" },
    update: {},
    create: {
      name: "Ministry of Roads and Highways",
      shortName: "MoRH",
      type: "PUBLIC_ENTITY",
      identifier: "GH-MOR-001",
      country: "GH",
      region: "Greater Accra",
      isDemo: true,
    },
  });

  const builderCo = await prisma.organization.upsert({
    where: { identifier: "GH-BUILDER-001" },
    update: {},
    create: {
      name: "Accra BuilderCo Ltd",
      shortName: "BuilderCo",
      type: "CONTRACTOR",
      identifier: "GH-BUILDER-001",
      country: "GH",
      region: "Greater Accra",
      isDemo: true,
    },
  });

  const techVentures = await prisma.organization.upsert({
    where: { identifier: "GH-TECHV-001" },
    update: {},
    create: {
      name: "TechVentures Ghana Ltd",
      shortName: "TechVentures",
      type: "CONTRACTOR",
      identifier: "GH-TECHV-001",
      country: "GH",
      region: "Ashanti",
      isDemo: true,
    },
  });

  const medSupply = await prisma.organization.upsert({
    where: { identifier: "GH-MEDS-001" },
    update: {},
    create: {
      name: "MedSupply Africa Ltd",
      shortName: "MedSupply",
      type: "CONTRACTOR",
      identifier: "GH-MEDS-001",
      country: "GH",
      region: "Greater Accra",
      isDemo: true,
    },
  });

  // ── Demo Users ─────────────────────────────────────────────

  const officerUser = await prisma.user.upsert({
    where: { email: "officer@demo.opencontract.dev" },
    update: {},
    create: {
      email: "officer@demo.opencontract.dev",
      name: "Ama Asante (Demo)",
      passwordHash: DEMO_PASSWORD_HASH,
      role: "PROCUREMENT_OFFICER",
      emailVerified: true,
      isActive: true,
    },
  });

  const contractorUser = await prisma.user.upsert({
    where: { email: "contractor@demo.opencontract.dev" },
    update: {},
    create: {
      email: "contractor@demo.opencontract.dev",
      name: "Kofi Mensah (Demo)",
      passwordHash: DEMO_PASSWORD_HASH,
      role: "CONTRACTOR",
      emailVerified: true,
      isActive: true,
    },
  });

  const auditorUser = await prisma.user.upsert({
    where: { email: "auditor@demo.opencontract.dev" },
    update: {},
    create: {
      email: "auditor@demo.opencontract.dev",
      name: "Efua Boateng (Demo)",
      passwordHash: DEMO_PASSWORD_HASH,
      role: "AUDITOR",
      emailVerified: true,
      isActive: true,
    },
  });

  // ── DEMO PROCUREMENT 1: Road Construction (Awarded, Contracted) ──

  const roadProcurement = await prisma.procurement.upsert({
    where: { ocid: "ocds-demo-2026-000001" },
    update: {},
    create: {
      ocid: "ocds-demo-2026-000001",
      title: "Construction of Tema Motorway Interchange Upgrade — Phase 2",
      description:
        "Design, supply, and construction of upgraded interchange infrastructure at the Tema Motorway junction. Includes carriageway improvements, lighting, and drainage works.",
      procuringEntityId: mor.id,
      procurementMethod: "OPEN_TENDERING",
      status: "IMPLEMENTATION",
      currency: "GHS",
      estimatedValue: "48000000.00",
      category: "Infrastructure",
      region: "Greater Accra",
      isDemo: true,
      publishedAt: new Date("2026-01-15"),
    },
  });

  const roadTender = await prisma.tender.upsert({
    where: { procurementId: roadProcurement.id },
    update: {},
    create: {
      procurementId: roadProcurement.id,
      title: "IFT-2026-MOR-0012 — Tema Motorway Interchange Upgrade",
      description:
        "Invitation for Tenders for the construction of Phase 2 of the Tema Motorway Interchange Upgrade.",
      openingDate: new Date("2026-01-20"),
      closingDate: new Date("2026-03-10"),
      procurementMethod: "OPEN_TENDERING",
      eligibilityRequirements:
        "Must hold a valid Ghana contractor's licence, Class A or above. Minimum 5 years relevant road construction experience required.",
      evaluationCriteria:
        "70% technical, 30% financial. Technically responsive bids scoring below 70% will not proceed to financial evaluation.",
      status: "CLOSED",
      publishedAt: new Date("2026-01-20"),
    },
  });

  // Single bidder (triggers signal)
  const roadBid1 = await prisma.bid.create({
    data: {
      tenderId: roadTender.id,
      bidderId: builderCo.id,
      submissionRef: "BID-2026-MOR-001A",
      submittedAt: new Date("2026-03-08T10:30:00"),
      status: "AWARDED",
      amount: "47200000.00",
      currency: "GHS",
      isConfidential: false,
    },
  });

  const roadAward = await prisma.award.create({
    data: {
      procurementId: roadProcurement.id,
      supplierId: builderCo.id,
      amount: "47200000.00",
      currency: "GHS",
      awardDate: new Date("2026-03-28"),
      status: "PUBLISHED",
      justification:
        "Only technically responsive bid received. BuilderCo demonstrated required experience and submitted a competitively priced proposal within the approved estimate.",
      publishedAt: new Date("2026-03-28"),
    },
  });

  const roadContract = await prisma.contract.create({
    data: {
      contractRef: "CTR-2026-MOR-0012",
      procurementId: roadProcurement.id,
      supplierId: builderCo.id,
      originalAmount: "47200000.00",
      currentAmount: "51800000.00", // amended
      currency: "GHS",
      startDate: new Date("2026-04-15"),
      endDate: new Date("2026-12-31"),
      status: "AMENDED",
      description:
        "Full design-build contract for the Tema Motorway Interchange Upgrade Phase 2.",
      signedAt: new Date("2026-04-12"),
    },
  });

  const roadAmendment = await prisma.contractAmendment.create({
    data: {
      contractId: roadContract.id,
      amendmentNumber: 1,
      reason:
        "Unforeseen ground condition survey identified contaminated sub-soil requiring additional remediation works not included in original scope.",
      previousAmount: "47200000.00",
      newAmount: "51800000.00",
      currency: "GHS",
      effectiveDate: new Date("2026-06-20"),
      description:
        "Additional soil remediation scope: 4,600,000 GHS. Variation approved by MoRH Chief Director.",
    },
  });

  const roadPayment1 = await prisma.payment.create({
    data: {
      contractId: roadContract.id,
      amount: "9400000.00",
      currency: "GHS",
      paymentDate: new Date("2026-05-30"),
      reference: "PAY-2026-MOR-001",
      description: "Mobilization payment — 20% advance",
      status: "PROCESSED",
    },
  });

  const roadPayment2 = await prisma.payment.create({
    data: {
      contractId: roadContract.id,
      amount: "12000000.00",
      currency: "GHS",
      paymentDate: new Date("2026-07-31"),
      reference: "PAY-2026-MOR-002",
      description: "Interim payment certificate #1",
      status: "PROCESSED",
    },
  });

  const roadMilestone1 = await prisma.milestone.create({
    data: {
      contractId: roadContract.id,
      title: "Site clearance and mobilization",
      plannedDate: new Date("2026-05-15"),
      actualDate: new Date("2026-05-18"),
      completionPct: 100,
      status: "COMPLETED",
    },
  });

  const roadMilestone2 = await prisma.milestone.create({
    data: {
      contractId: roadContract.id,
      title: "Earthworks and foundation preparation",
      plannedDate: new Date("2026-07-30"),
      actualDate: new Date("2026-08-12"),
      completionPct: 100,
      status: "COMPLETED",
    },
  });

  const roadMilestone3 = await prisma.milestone.create({
    data: {
      contractId: roadContract.id,
      title: "Carriageway works — main lanes",
      plannedDate: new Date("2026-10-31"),
      completionPct: 45,
      status: "IN_PROGRESS",
    },
  });

  // ── Integrity Signals for Road Procurement ────────────────

  await prisma.integritySignal.create({
    data: {
      procurementId: roadProcurement.id,
      signalType: "SINGLE_BIDDER",
      severity: "MEDIUM",
      explanation:
        "Only one bid was received for this open tendering process. While technically compliant, a single submission limits competitive validation of pricing and quality.",
      evidence: { bidCount: 1, expectedMinimum: 3, method: "OPEN_TENDERING" },
      isResolved: false,
    },
  });

  await prisma.integritySignal.create({
    data: {
      procurementId: roadProcurement.id,
      signalType: "SIGNIFICANT_AMENDMENT",
      severity: "HIGH",
      explanation:
        "Contract value increased by GHS 4,600,000 (9.75%) via Amendment #1, attributed to unforeseen ground conditions. The change exceeds the significant amendment threshold of 5%.",
      evidence: {
        originalAmount: "47200000.00",
        currentAmount: "51800000.00",
        changePct: 9.75,
        threshold: 5,
        amendmentNumber: 1,
      },
      isResolved: false,
    },
  });

  // ── DEMO PROCUREMENT 2: Medical Supplies (Completed) ──────

  const medProcurement = await prisma.procurement.upsert({
    where: { ocid: "ocds-demo-2026-000002" },
    update: {},
    create: {
      ocid: "ocds-demo-2026-000002",
      title: "Supply of Essential Medicines — Q1–Q2 2026 (National Medical Stores)",
      description:
        "Framework agreement for the supply of essential medicines to National Medical Stores for distribution to regional health facilities during Q1–Q2 2026.",
      procuringEntityId: moh.id,
      procurementMethod: "FRAMEWORK_AGREEMENT",
      status: "COMPLETED",
      currency: "GHS",
      estimatedValue: "12000000.00",
      category: "Health Supplies",
      region: "National",
      isDemo: true,
      publishedAt: new Date("2025-11-20"),
    },
  });

  const medTender = await prisma.tender.upsert({
    where: { procurementId: medProcurement.id },
    update: {},
    create: {
      procurementId: medProcurement.id,
      title: "RFQ-2025-MOH-0098 — Essential Medicines Supply Framework",
      openingDate: new Date("2025-11-25"),
      closingDate: new Date("2025-12-20"),
      procurementMethod: "FRAMEWORK_AGREEMENT",
      eligibilityRequirements:
        "Must be a registered pharmaceutical supplier with FDA Ghana certification.",
      evaluationCriteria: "Lowest compliant quotation.",
      status: "CLOSED",
      publishedAt: new Date("2025-11-25"),
    },
  });

  const medBid1 = await prisma.bid.create({
    data: {
      tenderId: medTender.id,
      bidderId: medSupply.id,
      submissionRef: "BID-2025-MOH-001",
      submittedAt: new Date("2025-12-18"),
      status: "AWARDED",
      amount: "11600000.00",
      currency: "GHS",
      isConfidential: false,
    },
  });

  const medAward = await prisma.award.create({
    data: {
      procurementId: medProcurement.id,
      supplierId: medSupply.id,
      amount: "11600000.00",
      currency: "GHS",
      awardDate: new Date("2026-01-05"),
      status: "PUBLISHED",
      justification: "Single responsive quotation received; price evaluated as fair and reasonable.",
      publishedAt: new Date("2026-01-05"),
    },
  });

  const medContract = await prisma.contract.create({
    data: {
      contractRef: "CTR-2026-MOH-0098",
      procurementId: medProcurement.id,
      supplierId: medSupply.id,
      originalAmount: "11600000.00",
      currentAmount: "11600000.00",
      currency: "GHS",
      startDate: new Date("2026-01-15"),
      endDate: new Date("2026-06-30"),
      status: "COMPLETED",
      signedAt: new Date("2026-01-12"),
    },
  });

  await prisma.payment.createMany({
    data: [
      {
        contractId: medContract.id,
        amount: "5800000.00",
        currency: "GHS",
        paymentDate: new Date("2026-02-28"),
        reference: "PAY-2026-MOH-001",
        description: "Q1 payment",
        status: "PROCESSED",
      },
      {
        contractId: medContract.id,
        amount: "5800000.00",
        currency: "GHS",
        paymentDate: new Date("2026-06-30"),
        reference: "PAY-2026-MOH-002",
        description: "Q2 final payment",
        status: "PROCESSED",
      },
    ],
  });

  // ── DEMO PROCUREMENT 3: ICT System (Open) ─────────────────

  const ictProcurement = await prisma.procurement.upsert({
    where: { ocid: "ocds-demo-2026-000003" },
    update: {},
    create: {
      ocid: "ocds-demo-2026-000003",
      title: "Procurement of Integrated Financial Management Information System (IFMIS) — Upgrade Phase",
      description:
        "Supply, installation, configuration, and training for an upgrade to the national Integrated Financial Management Information System to include module-level budget tracking.",
      procuringEntityId: mofep.id,
      procurementMethod: "RESTRICTED_TENDERING",
      status: "EVALUATION",
      currency: "GHS",
      estimatedValue: "8500000.00",
      category: "ICT",
      region: "National",
      isDemo: true,
      publishedAt: new Date("2026-05-01"),
    },
  });

  const ictTender = await prisma.tender.upsert({
    where: { procurementId: ictProcurement.id },
    update: {},
    create: {
      procurementId: ictProcurement.id,
      title: "IFT-2026-MOFEP-004 — IFMIS Upgrade",
      openingDate: new Date("2026-05-05"),
      closingDate: new Date("2026-06-15"),
      procurementMethod: "RESTRICTED_TENDERING",
      eligibilityRequirements:
        "Must have delivered a comparable government ERP/IFMIS deployment in the last 5 years.",
      evaluationCriteria: "Technical quality 60%, price 40%.",
      status: "CLOSED",
      publishedAt: new Date("2026-05-05"),
    },
  });

  const ictBid1 = await prisma.bid.create({
    data: {
      tenderId: ictTender.id,
      bidderId: techVentures.id,
      submissionRef: "BID-2026-MOFEP-001",
      submittedAt: new Date("2026-06-13"),
      status: "SHORTLISTED",
      amount: "8100000.00",
      currency: "GHS",
      isConfidential: true,
    },
  });

  // ── Add demo blockchain anchors ──────────────────────────

  await prisma.blockchainAnchor.create({
    data: {
      procurementId: roadProcurement.id,
      eventType: "PROCUREMENT_CREATED",
      status: "CONFIRMED",
      network: "base-sepolia",
      contractAddress: "0x5FbDB2315678afecb367f032d93F642f64180aa3",
      transactionHash: "0x8a4f2e31c93bd12f8a6c71b4e29ae38f5d0a2c9e4fb7d8e1a3b6c5d8e2f1a4b",
      blockNumber: 14893241n,
      confirmedAt: new Date("2026-01-15T10:32:45"),
      dataHash: "a3f2b8c19de4f6e71a2b5c8d9e3f7a2b4c6d8e9f1a3b5c7d9e1f3a5b7c9d1e3f",
    },
  });

  await prisma.blockchainAnchor.create({
    data: {
      procurementId: roadProcurement.id,
      eventType: "AWARD_PUBLISHED",
      status: "CONFIRMED",
      network: "base-sepolia",
      contractAddress: "0x5FbDB2315678afecb367f032d93F642f64180aa3",
      transactionHash: "0xc2e4f6a8b1d3e5f7a9b2c4e6f8a1b3d5e7f9a2b4c6d8e1f3a5b7c9d2e4f6a8b",
      blockNumber: 14930582n,
      confirmedAt: new Date("2026-03-28T14:20:00"),
      dataHash: "b5c7d9e1f3a5b7c9d1e3f5a7b9c1d3e5f7a9b2c4e6f8a1b3d5e7f9a2b4c6d8e1",
    },
  });

  console.log("✅ Demo seed complete.");
  console.log("\nDemo credentials:");
  console.log("  officer@demo.opencontract.dev / demo1234");
  console.log("  contractor@demo.opencontract.dev / demo1234");
  console.log("  auditor@demo.opencontract.dev / demo1234");
}

main()
  .catch((e) => {
    console.error("Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
