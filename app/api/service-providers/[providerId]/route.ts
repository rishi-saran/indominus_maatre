import { NextRequest, NextResponse } from "next/server";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL!;

/**
 * GET /service-providers/[providerId]
 * Get a service provider by ID
 * Public endpoint – no auth required
 */
export async function GET(
  request: NextRequest,
  props: { params: Promise<{ providerId: string }> }
) {
  try {
    const params = await props.params;
    const providerId = params.providerId;

    const url = `${API_BASE_URL}/service-providers/${providerId}`;
    console.log(`[Service Providers API] Fetching from: ${url}`);

    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      console.error(`[Service Providers API] Backend returned ${response.status} for URL: ${url}`);
      return NextResponse.json(
        { error: `Failed to fetch service provider (Status: ${response.status})` },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("[Service Providers API] Internal Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
