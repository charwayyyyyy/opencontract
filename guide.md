# OpenContract — Localhost Setup Guide & Technology Documentation

This guide provides step-by-step instructions for running **OpenContract** on your local machine, along with an architectural breakdown of the technologies used throughout the platform.

---

## 📋 Table of Contents

1. [System Prerequisites](#1-system-prerequisites)
2. [Project Architecture Overview](#2-project-architecture-overview)
3. [Quick Start: Step-by-Step Local Setup](#3-quick-start-step-by-step-local-setup)
   - [Clone and Install Dependencies](#step-1-clone-and-install-dependencies)
   - [Environment Configuration](#step-2-environment-configuration)
   - [Database Synchronization & Seeding](#step-3-database-synchronization--seeding)
   - [Compile Smart Contracts with Foundry](#step-4-compile-smart-contracts-with-foundry)
   - [Launch the Local Server](#step-5-launch-the-local-server)
4. [Technology Stack Explained](#4-technology-stack-explained)
5. [Key Verification Flows & Testing](#5-key-verification-flows--testing)
6. [Troubleshooting & FAQs](#6-troubleshooting--faqs)

---

## 1. System Prerequisites

Ensure you have the following installed on your operating system:

| Dependency | Minimum Version | Check Command | Purpose |
| :--- | :--- | :--- | :--- |
| **Node.js** | `>= 20.0.0` | `node -v` | JavaScript runtime environment |
| **pnpm** | `>= 10.0.0` | `pnpm -v` | Fast, disk space-efficient package manager |
| **Git** | `>= 2.30.0` | `git -v` | Version control |
| **Foundry** *(Optional for EVM)* | Latest (`v1.8.x`) | `forge --version` | Solidity compilation and testing framework |

> **Note on Windows**: PowerShell 7+ or Command Prompt works seamlessly. If Foundry is not installed, the web application runs completely with simulated and live testnet RPCs.

---

## 2. Project Architecture Overview

OpenContract is structured as a **Turborepo monorepo**:

```text
opencontract/
├── apps/
│   └── web/                   # Next.js 15 App Router web application
│       ├── public/            # Static assets, logos, and sample audit documents
│       └── src/
│           ├── app/           # App router pages, layouts, and API routes
│           │   ├── analyst/   # Grounded Gemini AI procurement analyst
│           │   ├── contracts/ # Dynamic contract dossier and audit trail pages
│           │   ├── explore/   # Search and multi-facet procurement filter
│           │   ├── signals/   # Red-flag risk and integrity detector
│           │   ├── verify/    # In-browser client-side document verifier
│           │   └── api/v1/    # REST endpoints (procurements, analyst, verification)
│           ├── components/    # Reusable UI components, headers, footers
│           ├── lib/           # Web3 client, hash utilities, formatters
│           └── services/      # Business logic (blockchain queries, stats, analyst)
├── contracts/                 # Foundry smart contracts
│   ├── src/
│   │   ├── AccessController.sol       # Role-based security (Officer, Publisher)
│   │   └── OpenContractRegistry.sol   # On-chain SHA-256 event anchoring
│   └── test/                          # Unit and integration tests (forge test)
├── packages/
│   └── database/              # Prisma 6 schema, migrations, and seed scripts
├── guide.md                   # This localhost guide
└── README.md                  # Complete product specification and documentation
```

---

## 3. Quick Start: Step-by-Step Local Setup

### Step 1: Clone and Install Dependencies

```bash
# 1. Clone repository
git clone https://github.com/charwayyyyyy/opencontract.git
cd opencontract

# 2. Install monorepo dependencies with pnpm
pnpm install
```

---

### Step 2: Environment Configuration

Create a `.env` file in the root of the project (if not already present):

```bash
# Copy example if available, or create .env:
cp .env.example .env
```

Your root `.env` must contain the following configuration variables:

```env
# ==============================================================================
# DATABASE (PostgreSQL / Neon Serverless)
# ==============================================================================
DATABASE_URL="postgresql://user:password@ep-sample-pooler.us-east-2.aws.neon.tech/neondb?sslmode=require"

# ==============================================================================
# AI ANALYST (Google Gemini)
# ==============================================================================
GEMINI_API_KEY="your_google_gemini_api_key_here"
GEMINI_MODEL="gemini-flash-lite-latest"

# ==============================================================================
# WEB3 & BLOCKCHAIN (Base Sepolia EVM Testnet)
# ==============================================================================
NEXT_PUBLIC_BLOCKCHAIN_NETWORK="Base Sepolia"
NEXT_PUBLIC_CHAIN_ID="84532"
NEXT_PUBLIC_REGISTRY_CONTRACT_ADDRESS="0x1234567890123456789012345678901234567890"
NEXT_PUBLIC_BLOCK_EXPLORER_URL="https://sepolia.basescan.org"
NEXT_PUBLIC_BASE_SEPOLIA_RPC="https://sepolia.base.org"

# ==============================================================================
# APP METADATA
# ==============================================================================
NEXT_PUBLIC_APP_URL="http://localhost:3000"
NODE_ENV="development"
```

> 🔒 **Security Notice:** The `.env` file is included in `.gitignore` and is never committed to GitHub.

---

### Step 3: Database Synchronization & Seeding

Sync the Prisma schema to the database and seed realistic, high-fidelity OCDS 1.1 procurement data:

```bash
# 1. Generate Prisma Client
pnpm db:generate

# 2. Push schema definitions to database
pnpm db:push

# 3. Seed sample contracts, organizations, milestones, and blockchain anchors
pnpm db:seed
```

The database seeder populates:

- **8 Public Procurements** across Healthcare, Energy, Transit, Education, and Digital Infrastructure.
- **32 Organizations** (Procuring entities, suppliers, auditors).
- **48 Milestones & Amendments** spanning planning to completion.
- **On-chain Anchor Signatures** with verifiable transaction and block hashes.

---

### Step 4: Compile Smart Contracts with Foundry

*(Optional for EVM compilation)*

If you have Foundry installed, you can compile and verify the smart contracts:

```bash
cd contracts

# Run compilation and 5 automated tests
forge test
```

Expected output:

```text
Ran 5 tests for test/OpenContractRegistry.t.sol:OpenContractRegistryTest
[PASS] test_AnchorEventByOfficer()
[PASS] test_InitialOwner()
[PASS] test_MultipleEventsForSameOCID()
[PASS] test_RevokePublisher()
[PASS] test_UnauthorizedCannotAnchor()
Suite result: ok. 5 passed; 0 failed; 0 skipped
```

Return to the root directory:

```bash
cd ..
```

---

### Step 5: Launch the Local Server

Start the Next.js development server:

```bash
pnpm dev
```

The application will be accessible at:
👉 **[http://localhost:3000](http://localhost:3000)**

---

## 4. Technology Stack Explained

OpenContract was built deliberately using modern, high-reliability technologies suited for institutional transparency:

### 1. Next.js 15 (App Router) & React 19

- **Server Components (RSC):** The vast majority of views are Server Components, allowing zero-bundle data fetching directly from the database and lightning-fast first contentful paint (FCP).
- **Client Components (`"use client"`):** Used strictly where user interaction is mandatory (e.g., in-browser SHA-256 calculation, interactive table filtering, AI streaming chat).
- **Edge-Ready API Routes (`/api/v1/*`):** High-speed REST endpoints adhering to the Open Contracting Data Standard (OCDS 1.1).

### 2. PostgreSQL & Prisma ORM 6 (Neon Serverless)

- **Relational Integrity:** Procurement lifecycles require strict relational links between Procuring Entities, Tenders, Bids, Awards, Contracts, and Payment Records.
- **Full JSON Support:** Stores OCDS metadata, buyer details, and classification codes efficiently.
- **Connection Pooling:** Integrates with Neon's AWS pooler for resilient serverless connection handling.

### 3. Solidity 0.8.28 & Foundry

- **`OpenContractRegistry.sol`:** Stores tamper-evident cryptographic digests of each procurement milestone on-chain (`ocidHash`, `eventHash`, `documentHash`, `blockTimestamp`).
- **`AccessController.sol`:** Granular OpenZeppelin role-based security protecting state modifications from unauthorized entities.
- **Foundry Toolchain:** Fast compilation and automated property-based testing written directly in Solidity.

### 4. Base Sepolia (EVM L2)

- **Ultra-Low Cost & Sub-Second Finality:** Recording public records on Ethereum Layer 1 is cost-prohibitive. Base Sepolia (Coinbase L2) allows government bodies to anchor millions of documents for fractions of a cent.
- **Verifiable Transparency:** Anyone with a public RPC or block explorer can verify whether a contract was tampered with after publication.

### 5. Google Gemini Flash AI

- **Grounded Procurement Analyst:** Rather than relying on generic LLM knowledge, queries are injected with relevant database records (amounts, supplier IDs, milestone dates, amendment details).
- **Resilient Fallback Engine:** Features a multi-model fallback chain (`gemini-flash-lite-latest` → `gemini-3.8-flash` → deterministic query fallback) to guarantee 100% uptime during demonstrations.

### 6. Tailwind CSS & Editorial Civic Design System

- **Light-First Editorial Palette:** Designed after civic standards like GOV.UK, USDS, and investigative journalism outlets (off-white `#F7F7F4`, crisp card surfaces `#FFFFFF`, deep forest green `#2C5F3C`).
- **Zero Generic Graphics:** Clean typography, minimalist Lucide SVG icons with `stroke-width={1.75}`, and accessible contrast ratios (WCAG AAA compliant).

### 7. Web Crypto API (Client-Side In-Browser Hashing)

- **Client-Side SHA-256:** Document fingerprinting is calculated entirely inside the browser's JavaScript V8 thread using `crypto.subtle.digest("SHA-256", buffer)`.
- **Zero Document Leakage:** Confidential draft tenders or bid proposals are never transmitted to OpenContract servers. Only the resulting 32-byte hexadecimal hash is checked against the database and blockchain.

---

## 5. Key Verification Flows & Testing

When evaluating OpenContract locally, test these core user journeys:

1. **Explore Contracts (`/explore`):**
   - Search by keyword (`"Hospital"`, `"Solar"`, `"Transit"`).
   - Filter by stage (`Tender`, `Award`, `Contract`, `Implementation`) or integrity risk status.

2. **Contract Detail Dossier (`/contracts/[ocid]`):**
   - View complete procurement timeline from Planning to Completion.
   - Inspect the on-chain blockchain proof box with transaction hashes.
   - Click **Download timeline JSON** to verify the `/api/v1/procurements/[ocid]/timeline` endpoint.

3. **Document Verifier (`/verify`):**
   - Click the built-in sample document buttons:
     - Click **"Test valid contract"** → Result: **Verified (Fingerprint Matches)**.
     - Click **"Test modified version"** → Result: **Integrity Mismatch (Tampering Detected)**.
   - Or drag-and-drop any local file to compute its instant SHA-256 hash.

4. **AI Procurement Analyst (`/analyst`):**
   - Ask: *"What is the largest procurement in the system?"*
   - Ask: *"Which supplier received the emergency medical supplies contract?"*
   - Verify that answers include specific OCID references and grounded figures.

5. **Red-Flag Signals (`/signals`):**
   - Review rule-based risk triggers including single-bid tenders and budget variance warnings.

---

## 6. Troubleshooting & FAQs

### Q: Why did the AI chatbot fail previously?

**A:** Google deprecated older models like `gemini-2.0-flash`. OpenContract uses `gemini-flash-lite-latest` along with automatic fallbacks to ensure uninterrupted operation.

### Q: How do I re-seed or wipe the database?

```bash
# Push schema fresh and re-seed
pnpm db:push --force-reset
pnpm db:seed
```

### Q: Does the document verifier upload my files?

**A:** No. All hashing occurs locally via your browser's native `crypto.subtle` API.

---

**OpenContract** — *Public money should leave a public trail.*
