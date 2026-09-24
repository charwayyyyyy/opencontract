import { NextRequest, NextResponse } from "next/server";
import { getProcurementByOcid } from "@/services/procurement/queries";

interface RouteContext {
  params: Promise<{ ocid: string }>;
}

export async function GET(_request: NextRequest, { params }: RouteContext) {
  const { ocid } = await params;

  if (!ocid || typeof ocid !== "string") {
    return NextResponse.json(
      { error: { code: "VALIDATION_ERROR", message: "Invalid OCID" } },
      { status: 400 }
    );
  }

  try {
    const procurement = await getProcurementByOcid(ocid);

    if (!procurement) {
      return NextResponse.json(
        {
          error: {
            code: "NOT_FOUND",
            message: "The requested procurement record could not be found.",
          },
        },
        { status: 404 }
      );
    }

    return NextResponse.json({ data: procurement });
  } catch (error) {
    console.error("[GET /api/v1/procurements/:ocid]", error);
    return NextResponse.json(
      {
        error: {
          code: "INTERNAL_ERROR",
          message: "We couldn't load this procurement. Please try again.",
        },
      },
      { status: 500 }
    );
  }
}
