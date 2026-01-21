import { NextResponse } from "next/server";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000";

/**
 * GET /categories
 * Public endpoint – no auth required
 */
export async function GET() {
  try {
    const response = await fetch(
      `${API_BASE_URL}/api/v1/service-categories/`,
      {
        method: "GET",
      }
    );

    const data = await response.json();

    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error("Categories API error:", error);
    return NextResponse.json(
      { error: "Failed to fetch categories" },
      { status: 500 }
    );
  }
}