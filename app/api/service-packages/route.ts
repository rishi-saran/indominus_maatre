import { NextRequest, NextResponse } from "next/server";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000";

/**
 * GET /service-packages
 * Optional query params:
 *  - service_id
 * Public endpoint – no auth required
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams.toString();
    const url = searchParams
      ? `${API_BASE_URL}/api/v1/service-packages/?${searchParams}`
      : `${API_BASE_URL}/api/v1/service-packages/`;

    const response = await fetch(url, { method: "GET" });
    const data = await response.json();

    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error("Service Packages API error:", error);
    return NextResponse.json(
      { error: "Failed to fetch service packages" },
      { status: 500 }
    );
  }
}