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

    const payload = {
      ocid: procurement.ocid,
      title: procurement.title,
      status: procurement.status,
      generatedAt: new Date().toISOString(),
      timeline: procurement.timeline,
    };

    return new NextResponse(JSON.stringify(payload, null, 2), {
      status: 200,
      headers: {
        "Content-Type": "application/json; charset=utf-8",
        "Content-Disposition": `inline; filename="${ocid}-timeline.json"`,
      },
    });
  } catch (error) {
    console.error("[GET /api/v1/procurements/:ocid/timeline]", error);
    return NextResponse.json(
      {
        error: {
          code: "INTERNAL_ERROR",
          message: "We couldn't load this procurement timeline. Please try again.",
        },
      },
      { status: 500 }
    );
  }
}
