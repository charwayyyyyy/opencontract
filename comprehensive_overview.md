# OpenContract - Comprehensive Overview

## Project Summary
**OpenContract** is a blockchain-backed public procurement accountability and verification platform. It is designed to act as institutional-grade, light-first civic infrastructure to make public procurement transparent, traceable, and independently verifiable. 

By combining the **Open Contracting Data Standard (OCDS 1.1)** with **EVM blockchain immutability (Base Sepolia)**, **client-side cryptographic hashing**, and **grounded Gemini AI intelligence**, OpenContract ensures an unalterable, easily accessible trail for every public dollar spent.

---

## 🏗️ Detailed Project Structure
The project is built as a monorepo using **Turborepo** to separate concerns:

- `apps/web/`: The main Next.js 15 application (App Router) containing all pages, API routes, and frontend logic.
- `packages/database/`: Shared Prisma ORM models and schema used to interface with the Neon PostgreSQL database.
- `packages/types/` (implied): Shared TypeScript types for full-stack type safety.
- `contracts/`: Solidity smart contracts (using Foundry) that handle the Base Sepolia blockchain integration for event/document hashing and verification.

---

## 🚀 Working Technologies
The application uses a modern, high-performance tech stack:

- **Frontend & API**: Next.js 15 (App Router), React, Tailwind CSS (Vanilla styling practices), Lucide Icons.
- **Monorepo Management**: Turborepo, pnpm workspace.
- **Database**: Neon PostgreSQL (Serverless), Prisma ORM 6.
- **Blockchain/Web3**: Solidity 0.8.28, Foundry (`forge`, `cast`, `anvil`), deployed on Base Sepolia (`AccessController.sol`, `OpenContractRegistry.sol`).
- **AI Integration**: Google Gemini AI (`gemini-flash-lite-latest`) for strictly grounded, context-injected data querying.
- **Security**: In-browser `crypto.subtle` (Web Crypto API) for secure, zero-upload SHA-256 byte fingerprinting.

---

## 📊 Core Features & Functionality (Currently Working)

1. **Complete Lifecycle Tracking**
   - Follows the OCDS 1.1 normalized data model covering: Planning -> Tender -> Bids -> Evaluation -> Award -> Contract -> Implementation -> Completion.
   - Prevents silent removal of requirements or post-award scope manipulation.
2. **Zero-Upload Document Verification**
   - Users can upload a document locally. The browser calculates the SHA-256 hash using the Web Crypto API.
   - Files *never leave the user's device*, ensuring privacy. The hash is cross-checked against the OpenContract database and the Base Sepolia ledger for instant verification (Verified, Tampered, or Not Registered).
3. **Independent Verification Layer (Blockchain Anchoring)**
   - The EVM Smart Registry (`OpenContractRegistry.sol`) anchors cryptographic fingerprints (SHA-256) of milestones and documents.
   - Any citizen or auditor can independently verify records directly against the blockchain without trusting the OpenContract servers.
4. **Deterministic Integrity Signals**
   - Automated rule engine that scans for: Single-bidder risks, contract amendments >15%, implementation delays, missing updates, and supplier concentration.
   - Deterministic, rule-based flags (not black-box AI accusations).
5. **Grounded AI Procurement Analyst**
   - Integrates Gemini AI to answer plain-language questions about procurements.
   - **Strict Grounding:** The AI is locked to factual database records (tenders, amounts, payments, flags) and cites specific procurement identifiers (OCIDs) without hallucinating.

---

## 🌐 Application Pages & Routes

All pages are optimized for mobile, tablet, and desktop viewing:

- **`/` (Landing Page)**: Hero section with dynamic statistics, procurement lifecycle visualization, quick search, document verification demo, and AI analyst CTA. Recently enhanced with a customized, non-AI-slop hero illustration that elegantly reflects the platform's civic transparency and blockchain theme.
- **`/explore` (Procurement Explorer)**: Multi-filter explorer allowing users to search and browse procurements by OCID, buyer agencies, contract values, stages, statuses, and procurement methods. Includes debounced search and active filtering.
- **`/contracts/[ocid]` (Contract Dossier)**: Detailed view of a single procurement process showing its full lifecycle timeline, associated bids, amendments, payments, integrity flags, and anchored documents.
- **`/verify` (Document Verifier)**: A dedicated page for zero-upload document verification (SHA-256 hashing) with 1-click test samples.
- **`/signals` (Integrity Signals Monitor)**: Dashboard visualizing red-flag indicators across all procurements (e.g., single bidders, cost overruns).
- **`/organizations` (Directory)**: Listings of procuring entities, ministries, and private contractors.
- **`/analyst` (AI Chat Interface)**: The dedicated chat interface for interacting with the grounded Gemini AI analyst.
- **`/methodology`**: Detailed documentation explaining data collection, OCDS standard compliance, and cryptographic verification guarantees.
- **`/auth/signin`**: User authentication for internal roles (Procurement Officers, Auditors, Contractors, Admins).
- **`/console`, `/contractor`, `/auditor`**: Role-based internal dashboards for managing the procurement data, submitting bids/updates, and conducting audits.

---

## 📱 Mobile Optimizations Implemented
The application uses responsive design primitives to guarantee full mobile support:
- **Responsive Flex & Grid Layouts:** Used across the `Landing Page`, `Procurement Explorer`, `Site Header`, and internal cards. Stacked (`flex-col`) on mobile and side-by-side (`flex-row`, `grid-cols-2/3/4`) on larger screens.
- **Responsive Navigation:** The `SiteHeader` features a dedicated mobile hamburger menu that gracefully reveals navigation links and authentication options on small screens.
- **Touch-Friendly Targets:** Buttons, dropdowns, and form inputs are sized appropriately for mobile tapping.
- **Hero Image Integration:** The newly generated hero image on the landing page adapts via `aspect-video` on mobile and `aspect-square` on desktop, maintaining an aesthetic flow whether stacked or side-by-side.

All functionality is deeply integrated, responsive, and working cohesively to form a robust civic transparency platform.
