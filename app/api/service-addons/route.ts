import { NextRequest, NextResponse } from "next/server";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL!;

/**
 * GET /service-addons
 * Optional query params:
 *  - service_id
 * Public endpoint – no auth required
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams.toString();
    const url = searchParams
      ? `${API_BASE_URL}/api/v1/service-addons/?${searchParams}`
      : `${API_BASE_URL}/api/v1/service-addons/`;

    const response = await fetch(url, { method: "GET" });
    const data = await response.json();

    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error("Service Addons API error:", error);
    return NextResponse.json(
      { error: "Failed to fetch service addons" },
      { status: 500 }
    );
  }
}