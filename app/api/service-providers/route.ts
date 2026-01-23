import { NextRequest, NextResponse } from "next/server";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000";

/**
 * GET /service-providers
 * Optional query params:
 *  - verified=true|false
 * Public endpoint
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams.toString();
    const url = searchParams
      ? `${API_BASE_URL}/api/v1/service-providers/?${searchParams}`
      : `${API_BASE_URL}/api/v1/service-providers/`;

    const response = await fetch(url, { method: "GET" });

    const contentType = response.headers.get("content-type") || "";
    const isJson = contentType.includes("application/json");
    const payload = isJson ? await response.json() : await response.text();

    return NextResponse.json(payload, { status: response.status });
  } catch (error) {
    console.error("Service Providers API error:", error);
    return NextResponse.json(
      { error: "Failed to fetch service providers" },
      { status: 500 }
    );
  }
}