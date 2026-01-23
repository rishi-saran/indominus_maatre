import { NextRequest, NextResponse } from "next/server";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000";

/**
 * GET /services
 * Optional query params:
 *  - category_id
 * Public endpoint
 */
export async function GET(request: NextRequest) {
  try {
    const query = request.nextUrl.searchParams.toString();
    const url = query
      ? `${API_BASE_URL}/api/v1/services/?${query}`
      : `${API_BASE_URL}/api/v1/services/`;

    const response = await fetch(url, { method: "GET" });

    const contentType = response.headers.get("content-type") || "";
    const isJson = contentType.includes("application/json");
    const payload = isJson ? await response.json() : await response.text();

    return NextResponse.json(payload, { status: response.status });
  } catch (error) {
    console.error("Services API error:", error);
    return NextResponse.json(
      { error: "Failed to fetch services" },
      { status: 500 }
    );
  }
}