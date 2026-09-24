import type {
  ProcurementDetail,
  ProcurementSummary,
  PublicStatistics,
  DocumentSummary,
  SignalSummary,
} from "@opencontract/types";

// ============================================================================
// DEMO ORGANIZATIONS
// ============================================================================

export interface DemoOrganization {
  id: string;
  name: string;
  shortName: string | null;
  type: "PUBLIC_ENTITY" | "CONTRACTOR" | "AUDITOR" | "CIVIL_SOCIETY" | "RESEARCHER";
  identifier: string;
  country: string;
  region: string;
  website?: string | null;
  isActive: boolean;
  procurements: { id: string }[];
  contracts: { id: string }[];
}

export const DEMO_ORGANIZATIONS: DemoOrganization[] = [
  {
    id: "org-mor",
    name: "Ministry of Roads and Highways",
    shortName: "MoRH",
    type: "PUBLIC_ENTITY",
    identifier: "GH-MOR-001",
    country: "GH",
    region: "Greater Accra",
    website: "https://mrh.gov.gh",
    isActive: true,
    procurements: [{ id: "proc-1" }],
    contracts: [],
  },
  {
    id: "org-moh",
    name: "Ministry of Health",
    shortName: "MoH",
    type: "PUBLIC_ENTITY",
    identifier: "GH-MOH-001",
    country: "GH",
    region: "Greater Accra",
    website: "https://moh.gov.gh",
    isActive: true,
    procurements: [{ id: "proc-2" }],
    contracts: [],
  },
  {
    id: "org-mofep",
    name: "Ministry of Finance and Economic Planning",
    shortName: "MoFEP",
    type: "PUBLIC_ENTITY",
    identifier: "GH-MOFEP-001",
    country: "GH",
    region: "Greater Accra",
    website: "https://mofep.gov.gh",
    isActive: true,
    procurements: [{ id: "proc-3" }],
    contracts: [],
  },
  {
    id: "org-moe",
    name: "Ministry of Education",
    shortName: "MoE",
    type: "PUBLIC_ENTITY",
    identifier: "GH-MOE-001",
    country: "GH",
    region: "Greater Accra",
    website: "https://moe.gov.gh",
    isActive: true,
    procurements: [{ id: "proc-4" }],
    contracts: [],
  },
  {
    id: "org-moen",
    name: "Ministry of Energy",
    shortName: "MoEn",
    type: "PUBLIC_ENTITY",
    identifier: "GH-MOEN-001",
    country: "GH",
    region: "Greater Accra",
    website: "https://energymin.gov.gh",
    isActive: true,
    procurements: [{ id: "proc-5" }],
    contracts: [],
  },
  {
    id: "org-builderco",
    name: "Accra BuilderCo Ltd",
    shortName: "BuilderCo",
    type: "CONTRACTOR",
    identifier: "GH-BUILDER-001",
    country: "GH",
    region: "Greater Accra",
    website: "https://builderco.demo.gh",
    isActive: true,
    procurements: [],
    contracts: [{ id: "ctr-1" }],
  },
  {
    id: "org-medsupply",
    name: "MedSupply Africa Ltd",
    shortName: "MedSupply",
    type: "CONTRACTOR",
    identifier: "GH-MEDS-001",
    country: "GH",
    region: "Greater Accra",
    website: "https://medsupply.demo.gh",
    isActive: true,
    procurements: [],
    contracts: [{ id: "ctr-2" }],
  },
  {
    id: "org-techventures",
    name: "TechVentures Ghana Ltd",
    shortName: "TechVentures",
    type: "CONTRACTOR",
    identifier: "GH-TECHV-001",
    country: "GH",
    region: "Ashanti",
    website: "https://techventures.demo.gh",
    isActive: true,
    procurements: [],
    contracts: [],
  },
  {
    id: "org-apexpower",
    name: "Apex Power Solutions Ltd",
    shortName: "ApexPower",
    type: "CONTRACTOR",
    identifier: "GH-APEX-001",
    country: "GH",
    region: "Western",
    website: "https://apexpower.demo.gh",
    isActive: true,
    procurements: [],
    contracts: [{ id: "ctr-5" }],
  },
];

// ============================================================================
// DEMO PROCUREMENTS (FULL DETAILS)
// ============================================================================

export const DEMO_PROCUREMENTS: ProcurementDetail[] = [
  // ── Procurement 1: Road Construction ───────────────────────────────────────
  {
    id: "proc-1",
    ocid: "ocds-demo-2026-000001",
    title: "Construction of Tema Motorway Interchange Upgrade — Phase 2",
    description:
      "Design, supply, and construction of upgraded interchange infrastructure at the Tema Motorway junction. Includes carriageway improvements, lighting, and drainage works.",
    status: "IMPLEMENTATION",
    method: "OPEN_TENDERING",
    currency: "GHS",
    estimatedValue: "48000000.00",
    region: "Greater Accra",
    category: "Infrastructure",
    isDemo: true,
    publishedAt: "2026-01-15T09:00:00.000Z",
    createdAt: "2026-01-15T09:00:00.000Z",
    procuringEntity: {
      id: "org-mor",
      name: "Ministry of Roads and Highways",
      shortName: "MoRH",
    },
    supplierName: "Accra BuilderCo Ltd",
    signalCount: 2,
    hasVerifiedDocuments: true,

    tender: {
      id: "tender-1",
      title: "IFT-2026-MOR-0012 — Tema Motorway Interchange Upgrade",
      description:
        "Invitation for Tenders for the construction of Phase 2 of the Tema Motorway Interchange Upgrade.",
      openingDate: "2026-01-20T09:00:00.000Z",
      closingDate: "2026-03-10T17:00:00.000Z",
      status: "CLOSED",
      method: "OPEN_TENDERING",
      eligibilityRequirements:
        "Must hold a valid Ghana contractor's licence, Class A or above. Minimum 5 years relevant road construction experience required.",
      evaluationCriteria:
        "70% technical, 30% financial. Technically responsive bids scoring below 70% will not proceed to financial evaluation.",
      publishedAt: "2026-01-20T09:00:00.000Z",
    },

    bids: [
      {
        id: "bid-1",
        submissionRef: "BID-2026-MOR-001A",
        submittedAt: "2026-03-08T10:30:00.000Z",
        status: "AWARDED",
        bidderName: "Accra BuilderCo Ltd",
        amount: "47200000.00",
      },
    ],

    awards: [
      {
        id: "award-1",
        supplierId: "org-builderco",
        supplierName: "Accra BuilderCo Ltd",
        amount: "47200000.00",
        currency: "GHS",
        awardDate: "2026-03-28T14:00:00.000Z",
        status: "PUBLISHED",
        justification:
          "Only technically responsive bid received. BuilderCo demonstrated required experience and submitted a competitively priced proposal within the approved estimate.",
      },
    ],

    contracts: [
      {
        id: "ctr-1",
        contractRef: "CTR-2026-MOR-0012",
        originalAmount: "47200000.00",
        currentAmount: "51800000.00",
        currency: "GHS",
        startDate: "2026-04-15T00:00:00.000Z",
        endDate: "2026-12-31T23:59:59.000Z",
        status: "AMENDED",
        amendments: [
          {
            id: "amend-1",
            amendmentNumber: 1,
            reason:
              "Unforeseen ground condition survey identified contaminated sub-soil requiring additional remediation works not included in original scope.",
            previousAmount: "47200000.00",
            newAmount: "51800000.00",
            currency: "GHS",
            changeAmount: "4600000.00",
            changePct: 10,
            effectiveDate: "2026-06-20T00:00:00.000Z",
          },
        ],
        totalPaid: "21400000.00",
        percentagePaid: 41,
      },
    ],

    documents: [
      {
        id: "doc-1",
        filename: "IFT-2026-MOR-0012-Tender-Notice.pdf",
        originalName: "Tema_Motorway_Tender_Notice_Final.pdf",
        mimeType: "application/pdf",
        sizeBytes: "2450892",
        sha256: "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
        category: "TENDER_NOTICE",
        visibility: "PUBLIC",
        status: "REGISTERED",
        createdAt: "2026-01-20T09:15:00.000Z",
        isDemo: true,
      },
      {
        id: "doc-2",
        filename: "CTR-2026-MOR-0012-Executed-Contract.pdf",
        originalName: "Signed_Contract_Tema_Phase2.pdf",
        mimeType: "application/pdf",
        sizeBytes: "8120400",
        sha256: "7f83b1657ff1fc53b92dc18148a1d65dfc2d4b1fa3d677284addd200126d9069",
        category: "CONTRACT_DOCUMENT",
        visibility: "PUBLIC",
        status: "REGISTERED",
        createdAt: "2026-04-12T16:00:00.000Z",
        isDemo: true,
      },
    ],

    signals: [
      {
        id: "sig-1",
        signalType: "SINGLE_BIDDER",
        severity: "MEDIUM",
        explanation:
          "Only one bid was received for this open tendering process. While technically compliant, a single submission limits competitive validation of pricing and quality.",
        evidence: { bidCount: 1, expectedMinimum: 3, method: "OPEN_TENDERING" },
        isResolved: false,
        createdAt: "2026-03-11T08:00:00.000Z",
      },
      {
        id: "sig-2",
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
        createdAt: "2026-06-21T10:00:00.000Z",
      },
    ],

    timeline: [
      {
        id: "tl-1",
        date: "2026-01-15T09:00:00.000Z",
        type: "PROCUREMENT_CREATED",
        label: "Procurement published",
        description: "Tema Motorway Interchange Upgrade published to OpenContract.",
        actor: "Ministry of Roads and Highways",
        isVerified: true,
        blockchainAnchor: {
          id: "anc-1",
          eventType: "PROCUREMENT_CREATED",
          status: "CONFIRMED",
          network: "base-sepolia",
          contractAddress: "0x5FbDB2315678afecb367f032d93F642f64180aa3",
          transactionHash: "0x8a4f2e31c93bd12f8a6c71b4e29ae38f5d0a2c9e4fb7d8e1a3b6c5d8e2f1a4b",
          blockNumber: "14893241",
          confirmedAt: "2026-01-15T10:32:45.000Z",
          dataHash: "a3f2b8c19de4f6e71a2b5c8d9e3f7a2b4c6d8e9f1a3b5c7d9e1f3a5b7c9d1e3f",
          createdAt: "2026-01-15T10:30:00.000Z",
        },
        documents: [],
      },
      {
        id: "tl-2",
        date: "2026-01-20T09:00:00.000Z",
        type: "TENDER_PUBLISHED",
        label: "Tender published",
        description: "Tender open until 10 March 2026.",
        actor: "Ministry of Roads and Highways",
        isVerified: true,
        blockchainAnchor: {
          id: "anc-2",
          eventType: "TENDER_PUBLISHED",
          status: "CONFIRMED",
          network: "base-sepolia",
          contractAddress: "0x5FbDB2315678afecb367f032d93F642f64180aa3",
          transactionHash: "0x4b7c9d1e3f5a7b9c1d3e5f7a9b2c4e6f8a1b3d5e7f9a2b4c6d8e1f3a5b7c9d2",
          blockNumber: "14901024",
          confirmedAt: "2026-01-20T09:30:00.000Z",
          dataHash: "d8e1a3b5c7d9e1f3a5b7c9d1e3f5a7b9c1d3e5f7a9b2c4e6f8a1b3d5e7f9a2b",
          createdAt: "2026-01-20T09:20:00.000Z",
        },
        documents: [],
      },
      {
        id: "tl-3",
        date: "2026-03-28T14:00:00.000Z",
        type: "AWARD_PUBLISHED",
        label: "Award published",
        description: "Award published to Accra BuilderCo Ltd (GHS 47,200,000.00).",
        actor: "Ministry of Roads and Highways",
        isVerified: true,
        blockchainAnchor: {
          id: "anc-3",
          eventType: "AWARD_PUBLISHED",
          status: "CONFIRMED",
          network: "base-sepolia",
          contractAddress: "0x5FbDB2315678afecb367f032d93F642f64180aa3",
          transactionHash: "0xc2e4f6a8b1d3e5f7a9b2c4e6f8a1b3d5e7f9a2b4c6d8e1f3a5b7c9d2e4f6a8b",
          blockNumber: "14930582",
          confirmedAt: "2026-03-28T14:20:00.000Z",
          dataHash: "b5c7d9e1f3a5b7c9d1e3f5a7b9c1d3e5f7a9b2c4e6f8a1b3d5e7f9a2b4c6d8e1",
          createdAt: "2026-03-28T14:10:00.000Z",
        },
        documents: [],
      },
      {
        id: "tl-4",
        date: "2026-04-12T16:00:00.000Z",
        type: "CONTRACT_CREATED",
        label: "Contract signed",
        description: "Contract CTR-2026-MOR-0012 executed and signed.",
        actor: "Ministry of Roads and Highways",
        isVerified: false,
        blockchainAnchor: null,
        documents: [],
      },
      {
        id: "tl-5",
        date: "2026-06-20T00:00:00.000Z",
        type: "CONTRACT_AMENDED",
        label: "Contract amended (Amendment #1)",
        description: "Variation approved: +GHS 4,600,000.00 for soil remediation.",
        actor: "Ministry of Roads and Highways",
        isVerified: false,
        blockchainAnchor: null,
        documents: [],
      },
    ],

    blockchainAnchors: [
      {
        id: "anc-1",
        eventType: "PROCUREMENT_CREATED",
        status: "CONFIRMED",
        network: "base-sepolia",
        contractAddress: "0x5FbDB2315678afecb367f032d93F642f64180aa3",
        transactionHash: "0x8a4f2e31c93bd12f8a6c71b4e29ae38f5d0a2c9e4fb7d8e1a3b6c5d8e2f1a4b",
        blockNumber: "14893241",
        confirmedAt: "2026-01-15T10:32:45.000Z",
        dataHash: "a3f2b8c19de4f6e71a2b5c8d9e3f7a2b4c6d8e9f1a3b5c7d9e1f3a5b7c9d1e3f",
        createdAt: "2026-01-15T10:30:00.000Z",
      },
      {
        id: "anc-2",
        eventType: "TENDER_PUBLISHED",
        status: "CONFIRMED",
        network: "base-sepolia",
        contractAddress: "0x5FbDB2315678afecb367f032d93F642f64180aa3",
        transactionHash: "0x4b7c9d1e3f5a7b9c1d3e5f7a9b2c4e6f8a1b3d5e7f9a2b4c6d8e1f3a5b7c9d2",
        blockNumber: "14901024",
        confirmedAt: "2026-01-20T09:30:00.000Z",
        dataHash: "d8e1a3b5c7d9e1f3a5b7c9d1e3f5a7b9c1d3e5f7a9b2c4e6f8a1b3d5e7f9a2b",
        createdAt: "2026-01-20T09:20:00.000Z",
      },
      {
        id: "anc-3",
        eventType: "AWARD_PUBLISHED",
        status: "CONFIRMED",
        network: "base-sepolia",
        contractAddress: "0x5FbDB2315678afecb367f032d93F642f64180aa3",
        transactionHash: "0xc2e4f6a8b1d3e5f7a9b2c4e6f8a1b3d5e7f9a2b4c6d8e1f3a5b7c9d2e4f6a8b",
        blockNumber: "14930582",
        confirmedAt: "2026-03-28T14:20:00.000Z",
        dataHash: "b5c7d9e1f3a5b7c9d1e3f5a7b9c1d3e5f7a9b2c4e6f8a1b3d5e7f9a2b4c6d8e1",
        createdAt: "2026-03-28T14:10:00.000Z",
      },
    ],
  },

  // ── Procurement 2: Medical Supplies ────────────────────────────────────────
  {
    id: "proc-2",
    ocid: "ocds-demo-2026-000002",
    title: "Supply of Essential Medicines — Q1–Q2 2026 (National Medical Stores)",
    description:
      "Framework agreement for the supply of essential medicines to National Medical Stores for distribution to regional health facilities during Q1–Q2 2026.",
    status: "COMPLETED",
    method: "FRAMEWORK_AGREEMENT",
    currency: "GHS",
    estimatedValue: "12000000.00",
    region: "National",
    category: "Health Supplies",
    isDemo: true,
    publishedAt: "2025-11-20T10:00:00.000Z",
    createdAt: "2025-11-20T10:00:00.000Z",
    procuringEntity: {
      id: "org-moh",
      name: "Ministry of Health",
      shortName: "MoH",
    },
    supplierName: "MedSupply Africa Ltd",
    signalCount: 0,
    hasVerifiedDocuments: true,

    tender: {
      id: "tender-2",
      title: "RFQ-2025-MOH-0098 — Essential Medicines Supply Framework",
      description: "Supply of essential medicines for public clinics.",
      openingDate: "2025-11-25T09:00:00.000Z",
      closingDate: "2025-12-20T17:00:00.000Z",
      status: "CLOSED",
      method: "FRAMEWORK_AGREEMENT",
      eligibilityRequirements:
        "Must be a registered pharmaceutical supplier with FDA Ghana certification.",
      evaluationCriteria: "Lowest compliant quotation.",
      publishedAt: "2025-11-25T09:00:00.000Z",
    },

    bids: [
      {
        id: "bid-2",
        submissionRef: "BID-2025-MOH-001",
        submittedAt: "2025-12-18T11:00:00.000Z",
        status: "AWARDED",
        bidderName: "MedSupply Africa Ltd",
        amount: "11600000.00",
      },
    ],

    awards: [
      {
        id: "award-2",
        supplierId: "org-medsupply",
        supplierName: "MedSupply Africa Ltd",
        amount: "11600000.00",
        currency: "GHS",
        awardDate: "2026-01-05T11:00:00.000Z",
        status: "PUBLISHED",
        justification:
          "Single responsive quotation received; price evaluated as fair and reasonable.",
      },
    ],

    contracts: [
      {
        id: "ctr-2",
        contractRef: "CTR-2026-MOH-0098",
        originalAmount: "11600000.00",
        currentAmount: "11600000.00",
        currency: "GHS",
        startDate: "2026-01-15T00:00:00.000Z",
        endDate: "2026-06-30T23:59:59.000Z",
        status: "COMPLETED",
        amendments: [],
        totalPaid: "11600000.00",
        percentagePaid: 100,
      },
    ],

    documents: [
      {
        id: "doc-3",
        filename: "CTR-2026-MOH-0098-Completion-Cert.pdf",
        originalName: "Final_Delivery_Inspection_MOH.pdf",
        mimeType: "application/pdf",
        sizeBytes: "1940200",
        sha256: "2c26b46b68ffc68ff99b453c1d30413413422d706483bfa0f98a5e886266e7ae",
        category: "COMPLETION_CERTIFICATE",
        visibility: "PUBLIC",
        status: "REGISTERED",
        createdAt: "2026-06-30T16:00:00.000Z",
        isDemo: true,
      },
    ],

    signals: [],

    timeline: [
      {
        id: "tl-201",
        date: "2025-11-20T10:00:00.000Z",
        type: "PROCUREMENT_CREATED",
        label: "Procurement published",
        description: "Essential Medicines Supply published to OpenContract.",
        actor: "Ministry of Health",
        isVerified: true,
        blockchainAnchor: {
          id: "anc-201",
          eventType: "PROCUREMENT_CREATED",
          status: "CONFIRMED",
          network: "base-sepolia",
          contractAddress: "0x5FbDB2315678afecb367f032d93F642f64180aa3",
          transactionHash: "0x3a1f8e2d4c6b8a0e2f4a6b8c0d2e4f6a8b0c2d4e6f8a0b2c4d6e8f0a2b4c6d8e",
          blockNumber: "14820100",
          confirmedAt: "2025-11-20T10:35:00.000Z",
          dataHash: "1e3f5a7b9c1d3e5f7a9b2c4e6f8a1b3d5e7f9a2b4c6d8e1f3a5b7c9d1e3f5a7b",
          createdAt: "2025-11-20T10:30:00.000Z",
        },
        documents: [],
      },
      {
        id: "tl-202",
        date: "2026-01-05T11:00:00.000Z",
        type: "AWARD_PUBLISHED",
        label: "Award published",
        description: "Awarded to MedSupply Africa Ltd (GHS 11,600,000.00).",
        actor: "Ministry of Health",
        isVerified: true,
        blockchainAnchor: null,
        documents: [],
      },
    ],

    blockchainAnchors: [
      {
        id: "anc-201",
        eventType: "PROCUREMENT_CREATED",
        status: "CONFIRMED",
        network: "base-sepolia",
        contractAddress: "0x5FbDB2315678afecb367f032d93F642f64180aa3",
        transactionHash: "0x3a1f8e2d4c6b8a0e2f4a6b8c0d2e4f6a8b0c2d4e6f8a0b2c4d6e8f0a2b4c6d8e",
        blockNumber: "14820100",
        confirmedAt: "2025-11-20T10:35:00.000Z",
        dataHash: "1e3f5a7b9c1d3e5f7a9b2c4e6f8a1b3d5e7f9a2b4c6d8e1f3a5b7c9d1e3f5a7b",
        createdAt: "2025-11-20T10:30:00.000Z",
      },
    ],
  },

  // ── Procurement 3: IFMIS Upgrade ──────────────────────────────────────────
  {
    id: "proc-3",
    ocid: "ocds-demo-2026-000003",
    title: "Procurement of Integrated Financial Management Information System (IFMIS) — Upgrade Phase",
    description:
      "Supply, installation, configuration, and training for an upgrade to the national Integrated Financial Management Information System to include module-level budget tracking.",
    status: "EVALUATION",
    method: "RESTRICTED_TENDERING",
    currency: "GHS",
    estimatedValue: "8500000.00",
    region: "National",
    category: "ICT",
    isDemo: true,
    publishedAt: "2026-05-01T09:00:00.000Z",
    createdAt: "2026-05-01T09:00:00.000Z",
    procuringEntity: {
      id: "org-mofep",
      name: "Ministry of Finance and Economic Planning",
      shortName: "MoFEP",
    },
    supplierName: null,
    signalCount: 1,
    hasVerifiedDocuments: true,

    tender: {
      id: "tender-3",
      title: "IFT-2026-MOFEP-004 — IFMIS Upgrade",
      description: "Upgrade to national financial management enterprise software.",
      openingDate: "2026-05-05T09:00:00.000Z",
      closingDate: "2026-06-15T17:00:00.000Z",
      status: "CLOSED",
      method: "RESTRICTED_TENDERING",
      eligibilityRequirements:
        "Must have delivered a comparable government ERP/IFMIS deployment in the last 5 years.",
      evaluationCriteria: "Technical quality 60%, price 40%.",
      publishedAt: "2026-05-05T09:00:00.000Z",
    },

    bids: [
      {
        id: "bid-3",
        submissionRef: "BID-2026-MOFEP-001",
        submittedAt: "2026-06-13T15:00:00.000Z",
        status: "SHORTLISTED",
        bidderName: null, // under evaluation — confidential
        amount: null,
      },
    ],

    awards: [],
    contracts: [],

    documents: [
      {
        id: "doc-4",
        filename: "IFT-2026-MOFEP-004-Specs.pdf",
        originalName: "IFMIS_System_Architecture_Specs.pdf",
        mimeType: "application/pdf",
        sizeBytes: "4190200",
        sha256: "fcde2b2edba56bf408601fb721fe9b5c338d10ee429ea04fae5511b68fbf8fb9",
        category: "TENDER_NOTICE",
        visibility: "PUBLIC",
        status: "REGISTERED",
        createdAt: "2026-05-05T10:00:00.000Z",
        isDemo: true,
      },
    ],

    signals: [
      {
        id: "sig-3",
        signalType: "SUPPLIER_CONCENTRATION",
        severity: "LOW",
        explanation:
          "Shortlisted ICT vendor has participated in 3 of the last 4 public finance software procurements over the past 24 months.",
        evidence: { vendorParticipationRate: "75%", threshold: "50%" },
        isResolved: false,
        createdAt: "2026-06-16T12:00:00.000Z",
      },
    ],

    timeline: [
      {
        id: "tl-301",
        date: "2026-05-01T09:00:00.000Z",
        type: "PROCUREMENT_CREATED",
        label: "Procurement published",
        description: "IFMIS Upgrade published to OpenContract.",
        actor: "Ministry of Finance and Economic Planning",
        isVerified: true,
        blockchainAnchor: {
          id: "anc-301",
          eventType: "PROCUREMENT_CREATED",
          status: "CONFIRMED",
          network: "base-sepolia",
          contractAddress: "0x5FbDB2315678afecb367f032d93F642f64180aa3",
          transactionHash: "0x9f8e7d6c5b4a3f2e1d0c9b8a7f6e5d4c3b2a1f0e9d8c7b6a5f4e3d2c1b0a9f8",
          blockNumber: "15012480",
          confirmedAt: "2026-05-01T09:30:00.000Z",
          dataHash: "3f5a7b9c1d3e5f7a9b2c4e6f8a1b3d5e7f9a2b4c6d8e1f3a5b7c9d1e3f5a7b9c",
          createdAt: "2026-05-01T09:20:00.000Z",
        },
        documents: [],
      },
    ],

    blockchainAnchors: [
      {
        id: "anc-301",
        eventType: "PROCUREMENT_CREATED",
        status: "CONFIRMED",
        network: "base-sepolia",
        contractAddress: "0x5FbDB2315678afecb367f032d93F642f64180aa3",
        transactionHash: "0x9f8e7d6c5b4a3f2e1d0c9b8a7f6e5d4c3b2a1f0e9d8c7b6a5f4e3d2c1b0a9f8",
        blockNumber: "15012480",
        confirmedAt: "2026-05-01T09:30:00.000Z",
        dataHash: "3f5a7b9c1d3e5f7a9b2c4e6f8a1b3d5e7f9a2b4c6d8e1f3a5b7c9d1e3f5a7b9c",
        createdAt: "2026-05-01T09:20:00.000Z",
      },
    ],
  },

  // ── Procurement 4: STEM Laboratories ──────────────────────────────────────
  {
    id: "proc-4",
    ocid: "ocds-demo-2026-000004",
    title: "Construction and Equipping of Regional STEM Laboratories — Cluster 3",
    description:
      "Turnkey procurement for the civil construction, furnishing, and equipping of modern science, technology, engineering, and mathematics (STEM) laboratories across 12 senior high schools in the Central and Western regions.",
    status: "OPEN",
    method: "OPEN_TENDERING",
    currency: "GHS",
    estimatedValue: "24500000.00",
    region: "Central & Western",
    category: "Education & Infrastructure",
    isDemo: true,
    publishedAt: "2026-08-01T08:30:00.000Z",
    createdAt: "2026-08-01T08:30:00.000Z",
    procuringEntity: {
      id: "org-moe",
      name: "Ministry of Education",
      shortName: "MoE",
    },
    supplierName: null,
    signalCount: 0,
    hasVerifiedDocuments: true,

    tender: {
      id: "tender-4",
      title: "IFT-2026-MOE-0089 — STEM Labs Construction Cluster 3",
      description: "Open tendering for construction and supply of laboratory equipment.",
      openingDate: "2026-08-01T08:30:00.000Z",
      closingDate: "2026-10-15T17:00:00.000Z",
      status: "OPEN",
      method: "OPEN_TENDERING",
      eligibilityRequirements:
        "Licensed contractors Class B1/K1 and authorized equipment distributors with valid ISO 9001 certification.",
      evaluationCriteria: "70% technical specifications compliance, 30% commercial proposal.",
      publishedAt: "2026-08-01T08:30:00.000Z",
    },

    bids: [],
    awards: [],
    contracts: [],

    documents: [
      {
        id: "doc-5",
        filename: "IFT-2026-MOE-0089-Tender-Dossier.pdf",
        originalName: "STEM_Labs_Detailed_Tender_Specifications.pdf",
        mimeType: "application/pdf",
        sizeBytes: "6320000",
        sha256: "e258d248883f5da2c54c407b4f0e438b8719ac5de0fb724f2d429f903a676e82",
        category: "TENDER_NOTICE",
        visibility: "PUBLIC",
        status: "REGISTERED",
        createdAt: "2026-08-01T09:00:00.000Z",
        isDemo: true,
      },
    ],

    signals: [],

    timeline: [
      {
        id: "tl-401",
        date: "2026-08-01T08:30:00.000Z",
        type: "PROCUREMENT_CREATED",
        label: "Procurement published",
        description: "Regional STEM Laboratories published to OpenContract.",
        actor: "Ministry of Education",
        isVerified: true,
        blockchainAnchor: {
          id: "anc-401",
          eventType: "PROCUREMENT_CREATED",
          status: "CONFIRMED",
          network: "base-sepolia",
          contractAddress: "0x5FbDB2315678afecb367f032d93F642f64180aa3",
          transactionHash: "0x7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b",
          blockNumber: "15180420",
          confirmedAt: "2026-08-01T09:02:15.000Z",
          dataHash: "5a7b9c1d3e5f7a9b2c4e6f8a1b3d5e7f9a2b4c6d8e1f3a5b7c9d1e3f5a7b9c1d",
          createdAt: "2026-08-01T08:50:00.000Z",
        },
        documents: [],
      },
      {
        id: "tl-402",
        date: "2026-08-01T09:00:00.000Z",
        type: "TENDER_PUBLISHED",
        label: "Tender published",
        description: "Tender open until 15 October 2026.",
        actor: "Ministry of Education",
        isVerified: true,
        blockchainAnchor: null,
        documents: [],
      },
    ],

    blockchainAnchors: [
      {
        id: "anc-401",
        eventType: "PROCUREMENT_CREATED",
        status: "CONFIRMED",
        network: "base-sepolia",
        contractAddress: "0x5FbDB2315678afecb367f032d93F642f64180aa3",
        transactionHash: "0x7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b",
        blockNumber: "15180420",
        confirmedAt: "2026-08-01T09:02:15.000Z",
        dataHash: "5a7b9c1d3e5f7a9b2c4e6f8a1b3d5e7f9a2b4c6d8e1f3a5b7c9d1e3f5a7b9c1d",
        createdAt: "2026-08-01T08:50:00.000Z",
      },
    ],
  },

  // ── Procurement 5: Rural Electrification Grid Extension ───────────────────
  {
    id: "proc-5",
    ocid: "ocds-demo-2026-000005",
    title: "Rural Electrification Grid Extension Project — Phase 3 (Eastern & Volta)",
    description:
      "Extension of medium voltage (33kV/11kV) distribution network and low-voltage reticulation to connect 45 peri-urban communities across the Eastern and Volta regions.",
    status: "AWARDED",
    method: "OPEN_TENDERING",
    currency: "GHS",
    estimatedValue: "38200000.00",
    region: "Eastern & Volta",
    category: "Energy & Infrastructure",
    isDemo: true,
    publishedAt: "2026-03-10T10:00:00.000Z",
    createdAt: "2026-03-10T10:00:00.000Z",
    procuringEntity: {
      id: "org-moen",
      name: "Ministry of Energy",
      shortName: "MoEn",
    },
    supplierName: "Apex Power Solutions Ltd",
    signalCount: 1,
    hasVerifiedDocuments: true,

    tender: {
      id: "tender-5",
      title: "IFT-2026-MOEN-012 — Grid Extension Phase 3",
      description: "Procurement of electrical engineering and transmission installation services.",
      openingDate: "2026-03-15T09:00:00.000Z",
      closingDate: "2026-05-20T17:00:00.000Z",
      status: "CLOSED",
      method: "OPEN_TENDERING",
      eligibilityRequirements:
        "Certified electrical contractor with Energy Commission Category E1 accreditation.",
      evaluationCriteria: "Least cost technically compliant tender.",
      publishedAt: "2026-03-15T09:00:00.000Z",
    },

    bids: [
      {
        id: "bid-5a",
        submissionRef: "BID-2026-MOEN-001",
        submittedAt: "2026-05-18T14:30:00.000Z",
        status: "AWARDED",
        bidderName: "Apex Power Solutions Ltd",
        amount: "37850000.00",
      },
    ],

    awards: [
      {
        id: "award-5",
        supplierId: "org-apexpower",
        supplierName: "Apex Power Solutions Ltd",
        amount: "37850000.00",
        currency: "GHS",
        awardDate: "2026-06-18T11:30:00.000Z",
        status: "PUBLISHED",
        justification:
          "Sole responsive bid submitted within approved budget; technical proposal satisfied all engineering requirements.",
      },
    ],

    contracts: [],

    documents: [
      {
        id: "doc-6",
        filename: "IFT-2026-MOEN-012-Award-Notification.pdf",
        originalName: "Award_Decision_Notice_ApexPower.pdf",
        mimeType: "application/pdf",
        sizeBytes: "1850100",
        sha256: "a591a6d40bf420404a011733cfb7b190d62c65bf0bcda32b57b277d9ad9f146e",
        category: "AWARD_NOTICE",
        visibility: "PUBLIC",
        status: "REGISTERED",
        createdAt: "2026-06-18T12:00:00.000Z",
        isDemo: true,
      },
    ],

    signals: [
      {
        id: "sig-5",
        signalType: "SINGLE_BIDDER",
        severity: "MEDIUM",
        explanation:
          "Open tendering resulted in only 1 valid tender submission from Apex Power Solutions Ltd. Potential market barriers should be reviewed.",
        evidence: { bidCount: 1, expectedMinimum: 3, method: "OPEN_TENDERING" },
        isResolved: false,
        createdAt: "2026-05-22T09:00:00.000Z",
      },
    ],

    timeline: [
      {
        id: "tl-501",
        date: "2026-03-10T10:00:00.000Z",
        type: "PROCUREMENT_CREATED",
        label: "Procurement published",
        description: "Rural Electrification Grid Extension published to OpenContract.",
        actor: "Ministry of Energy",
        isVerified: true,
        blockchainAnchor: {
          id: "anc-501",
          eventType: "PROCUREMENT_CREATED",
          status: "CONFIRMED",
          network: "base-sepolia",
          contractAddress: "0x5FbDB2315678afecb367f032d93F642f64180aa3",
          transactionHash: "0x5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b",
          blockNumber: "14920800",
          confirmedAt: "2026-03-10T10:25:00.000Z",
          dataHash: "7a9b2c4e6f8a1b3d5e7f9a2b4c6d8e1f3a5b7c9d1e3f5a7b9c1d3e5f7a9b2c4e",
          createdAt: "2026-03-10T10:15:00.000Z",
        },
        documents: [],
      },
      {
        id: "tl-502",
        date: "2026-06-18T11:30:00.000Z",
        type: "AWARD_PUBLISHED",
        label: "Award published",
        description: "Awarded to Apex Power Solutions Ltd (GHS 37,850,000.00).",
        actor: "Ministry of Energy",
        isVerified: true,
        blockchainAnchor: null,
        documents: [],
      },
    ],

    blockchainAnchors: [
      {
        id: "anc-501",
        eventType: "PROCUREMENT_CREATED",
        status: "CONFIRMED",
        network: "base-sepolia",
        contractAddress: "0x5FbDB2315678afecb367f032d93F642f64180aa3",
        transactionHash: "0x5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b",
        blockNumber: "14920800",
        confirmedAt: "2026-03-10T10:25:00.000Z",
        dataHash: "7a9b2c4e6f8a1b3d5e7f9a2b4c6d8e1f3a5b7c9d1e3f5a7b9c1d3e5f7a9b2c4e",
        createdAt: "2026-03-10T10:15:00.000Z",
      },
    ],
  },
];

// ============================================================================
// DEMO SUMMARIES
// ============================================================================

export const DEMO_SUMMARIES: ProcurementSummary[] = DEMO_PROCUREMENTS.map((p) => ({
  id: p.id,
  ocid: p.ocid,
  title: p.title,
  description: p.description,
  status: p.status,
  method: p.method,
  currency: p.currency,
  estimatedValue: p.estimatedValue,
  region: p.region,
  category: p.category,
  isDemo: p.isDemo,
  publishedAt: p.publishedAt,
  createdAt: p.createdAt,
  procuringEntity: p.procuringEntity,
  supplierName: p.supplierName,
  signalCount: p.signalCount,
  hasVerifiedDocuments: p.hasVerifiedDocuments,
}));

// ============================================================================
// DEMO SIGNALS
// ============================================================================

export interface EnrichedDemoSignal extends SignalSummary {
  procurement: {
    ocid: string;
    title: string;
    procuringEntity: { name: string };
  };
}

export const DEMO_SIGNALS: EnrichedDemoSignal[] = DEMO_PROCUREMENTS.flatMap((p) =>
  p.signals.map((s) => ({
    ...s,
    procurement: {
      ocid: p.ocid,
      title: p.title,
      procuringEntity: { name: p.procuringEntity.name },
    },
  }))
);

// ============================================================================
// DEMO STATISTICS
// ============================================================================

export const DEMO_STATISTICS: PublicStatistics = {
  totalProcurements: DEMO_PROCUREMENTS.length,
  activeTenders: DEMO_PROCUREMENTS.filter((p) => p.status === "OPEN").length,
  activeContracts: DEMO_PROCUREMENTS.filter((p) =>
    ["ACTIVE", "AMENDED", "IMPLEMENTATION", "COMPLETED"].includes(p.status)
  ).length,
  totalContractValue: DEMO_PROCUREMENTS.reduce((sum, p) => {
    const val = parseFloat(p.estimatedValue ?? "0");
    return sum + val;
  }, 0).toFixed(2),
  pendingSignals: DEMO_SIGNALS.filter((s) => !s.isResolved).length,
  verifiedDocuments: DEMO_PROCUREMENTS.flatMap((p) => p.documents).length,
};

// ============================================================================
// DEMO SEARCH & QUERY HELPERS
// ============================================================================

export interface SearchFilterParams {
  q?: string;
  status?: string;
  method?: string;
  region?: string;
  minValue?: number;
  maxValue?: number;
  year?: number;
  page?: number;
  pageSize?: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

export function searchDemoProcurements(params: SearchFilterParams) {
  const {
    q,
    status,
    method,
    region,
    minValue,
    maxValue,
    year,
    page = 1,
    pageSize = 10,
    sortBy = "publishedAt",
    sortOrder = "desc",
  } = params;

  let items = [...DEMO_SUMMARIES];

  if (q) {
    const term = q.toLowerCase();
    items = items.filter(
      (item) =>
        item.title.toLowerCase().includes(term) ||
        item.ocid.toLowerCase().includes(term) ||
        (item.description && item.description.toLowerCase().includes(term)) ||
        item.procuringEntity.name.toLowerCase().includes(term) ||
        (item.supplierName && item.supplierName.toLowerCase().includes(term))
    );
  }

  if (status) {
    items = items.filter((item) => item.status === status);
  }

  if (method) {
    items = items.filter((item) => item.method === method);
  }

  if (region) {
    const regTerm = region.toLowerCase();
    items = items.filter((item) => item.region?.toLowerCase().includes(regTerm));
  }

  if (year) {
    items = items.filter(
      (item) => item.publishedAt && new Date(item.publishedAt).getFullYear() === year
    );
  }

  if (minValue !== undefined) {
    items = items.filter(
      (item) => item.estimatedValue && parseFloat(item.estimatedValue) >= minValue
    );
  }

  if (maxValue !== undefined) {
    items = items.filter(
      (item) => item.estimatedValue && parseFloat(item.estimatedValue) <= maxValue
    );
  }

  items.sort((a, b) => {
    let aVal: string | number = a.publishedAt ?? "";
    let bVal: string | number = b.publishedAt ?? "";

    if (sortBy === "estimatedValue") {
      aVal = parseFloat(a.estimatedValue ?? "0");
      bVal = parseFloat(b.estimatedValue ?? "0");
    } else if (sortBy === "title") {
      aVal = a.title;
      bVal = b.title;
    }

    if (aVal < bVal) return sortOrder === "asc" ? -1 : 1;
    if (aVal > bVal) return sortOrder === "asc" ? 1 : -1;
    return 0;
  });

  const total = items.length;
  const skip = (page - 1) * pageSize;
  const paginated = items.slice(skip, skip + pageSize);

  return {
    items: paginated,
    total,
    page,
    pageSize,
    hasMore: skip + paginated.length < total,
  };
}

export function getDemoProcurementByOcid(ocid: string): ProcurementDetail | null {
  return DEMO_PROCUREMENTS.find((p) => p.ocid === ocid) ?? null;
}

export function getDemoDocumentBySha256(sha256Hex: string) {
  const normalized = sha256Hex.toLowerCase();
  for (const proc of DEMO_PROCUREMENTS) {
    for (const doc of proc.documents) {
      if (doc.sha256.toLowerCase() === normalized) {
        const anchor = proc.blockchainAnchors.find((a) => a.status === "CONFIRMED");
        return {
          document: doc,
          procurement: { ocid: proc.ocid, title: proc.title },
          anchor: anchor ?? null,
        };
      }
    }
  }
  return null;
}
