import { NextRequest, NextResponse } from "next/server";
import { searchProcurementsSchema } from "@opencontract/validation";
import { searchProcurements } from "@/services/procurement/queries";
import type { ApiSuccess } from "@opencontract/types";

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;

  const rawParams: Record<string, string> = {};
  searchParams.forEach((value, key) => {
    rawParams[key] = value;
  });

  const parsed = searchProcurementsSchema.safeParse(rawParams);

  if (!parsed.success) {
    return NextResponse.json(
      {
        error: {
          code: "VALIDATION_ERROR",
          message: "Invalid search parameters",
          fields: parsed.error.flatten().fieldErrors,
        },
      },
      { status: 400 }
    );
  }

  try {
    const result = await searchProcurements(parsed.data);
    const response: ApiSuccess<typeof result> = {
      data: result,
      meta: {
        total: result.total,
        page: result.page,
        pageSize: result.pageSize,
        hasMore: result.hasMore,
      },
    };
    return NextResponse.json(response);
  } catch (error) {
    console.error("[GET /api/v1/procurements]", error);
    return NextResponse.json(
      {
        error: {
          code: "INTERNAL_ERROR",
          message: "We couldn't retrieve the procurement list. Please try again.",
        },
      },
      { status: 500 }
    );
  }
}
