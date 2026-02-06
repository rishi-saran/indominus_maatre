import { NextRequest, NextResponse } from "next/server";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL!;
const API_BASE = API_BASE_URL.replace(/\/$/, "");

/**
 * GET /service-packages
 * Optional query params:
 *  - service_id
 * Public endpoint – no auth required
 */
export async function GET(request: NextRequest) {
  try {
    const query = request.nextUrl.searchParams.toString();
    const url = query
      ? `${API_BASE}/service-packages/?${query}`
      : `${API_BASE}/service-packages/`;

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