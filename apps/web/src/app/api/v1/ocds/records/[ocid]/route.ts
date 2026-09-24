import { NextRequest, NextResponse } from "next/server";
import { getProcurementByOcid } from "@/services/procurement/queries";

/**
 * GET /api/v1/ocds/records/:ocid
 * Returns OCDS-formatted JSON for a procurement record.
 */
interface RouteContext {
  params: Promise<{ ocid: string }>;
}

export async function GET(_request: NextRequest, { params }: RouteContext) {
  const { ocid } = await params;

  try {
    const procurement = await getProcurementByOcid(ocid);

    if (!procurement) {
      return NextResponse.json(
        { error: { code: "NOT_FOUND", message: "Procurement not found" } },
        { status: 404 }
      );
    }

    // Build OCDS-compatible release
    const ocdsRelease = {
      ocid: procurement.ocid,
      id: `${procurement.ocid}-1`,
      date: procurement.publishedAt ?? procurement.createdAt,
      tag: [procurement.status.toLowerCase()],
      initiationType: "tender",
      language: "en",
      publisher: {
        name: "OpenContract",
        uri: "https://opencontract.dev",
      },

      planning: {
        budget: {
          amount: {
            amount: procurement.estimatedValue
              ? parseFloat(procurement.estimatedValue)
              : null,
            currency: procurement.currency,
          },
        },
      },

      tender: procurement.tender
        ? {
            id: procurement.tender.id,
            title: procurement.tender.title,
            description: procurement.tender.description,
            status: procurement.tender.status.toLowerCase(),
            procurementMethod: mapOCDSMethod(procurement.method),
            tenderPeriod: {
              startDate: procurement.tender.openingDate,
              endDate: procurement.tender.closingDate,
            },
            eligibilityCriteria: procurement.tender.eligibilityRequirements,
            awardCriteria: procurement.tender.evaluationCriteria,
            numberOfTenderers: procurement.bids.length,
            value: {
              amount: procurement.estimatedValue
                ? parseFloat(procurement.estimatedValue)
                : null,
              currency: procurement.currency,
            },
          }
        : undefined,

      bids: {
        statistics: [
          { id: "1", measure: "tenderers", value: procurement.bids.length },
        ],
        details: procurement.bids.map((bid, i) => ({
          id: bid.id,
          status: bid.status.toLowerCase(),
          dateSubmitted: bid.submittedAt,
          tenderers: bid.bidderName ? [{ name: bid.bidderName }] : [],
          value: bid.amount
            ? { amount: parseFloat(bid.amount), currency: procurement.currency }
            : undefined,
        })),
      },

      awards: procurement.awards.map((award) => ({
        id: award.id,
        title: `Award to ${award.supplierName}`,
        status: award.status.toLowerCase(),
        date: award.awardDate,
        value: {
          amount: parseFloat(award.amount),
          currency: award.currency,
        },
        suppliers: [{ id: award.supplierId, name: award.supplierName }],
        rationale: award.justification,
      })),

      contracts: procurement.contracts.map((contract) => ({
        id: contract.contractRef,
        awardID: procurement.awards[0]?.id,
        title: `Contract ${contract.contractRef}`,
        status: contract.status.toLowerCase(),
        period: {
          startDate: contract.startDate,
          endDate: contract.endDate,
        },
        value: {
          amount: parseFloat(contract.currentAmount),
          currency: contract.currency,
        },
        dateSigned: contract.startDate,
        amendments: contract.amendments.map((amend) => ({
          id: amend.id,
          date: amend.effectiveDate,
          rationale: amend.reason,
          value: {
            amount: parseFloat(amend.newAmount),
            currency: amend.currency,
          },
        })),
        implementation: {
          transactions: contract.amendments.map((_, i) => ({
            id: `tx-${i}`,
            date: null,
            value: null,
          })),
          milestones: [],
        },
      })),

      buyer: {
        id: procurement.procuringEntity.id,
        name: procurement.procuringEntity.name,
      },

      parties: [
        {
          id: procurement.procuringEntity.id,
          name: procurement.procuringEntity.name,
          roles: ["buyer"],
        },
        ...procurement.awards.map((award) => ({
          id: award.supplierId,
          name: award.supplierName,
          roles: ["supplier"],
        })),
      ],

      // OpenContract extensions
      "opencontract:blockchain": {
        anchors: procurement.blockchainAnchors,
      },
      "opencontract:signals": procurement.signals,
    };

    return NextResponse.json(ocdsRelease, {
      headers: {
        "Content-Disposition": `attachment; filename="${ocid}-ocds.json"`,
        "Content-Type": "application/json; charset=utf-8",
      },
    });
  } catch (error) {
    console.error("[GET /api/v1/ocds/records/:ocid]", error);
    return NextResponse.json(
      { error: { code: "INTERNAL_ERROR", message: "Failed to export record" } },
      { status: 500 }
    );
  }
}

function mapOCDSMethod(method: string): string {
  const map: Record<string, string> = {
    OPEN_TENDERING: "open",
    RESTRICTED_TENDERING: "selective",
    REQUEST_FOR_QUOTATION: "limited",
    SINGLE_SOURCE: "direct",
    FRAMEWORK_AGREEMENT: "open",
    DIRECT_AWARD: "direct",
  };
  return map[method] ?? "open";
}
