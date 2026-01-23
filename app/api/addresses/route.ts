import { NextRequest, NextResponse } from "next/server";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000";

function getAuthHeader(request: NextRequest) {
  const authHeader = request.headers.get("authorization");
  if (!authHeader) {
    throw new Error("Unauthorized");
  }
  return authHeader;
}

/**
 * GET /addresses
 * List addresses for logged-in user
 */
export async function GET(request: NextRequest) {
  try {
    const authHeader = getAuthHeader(request);

    const response = await fetch(`${API_BASE_URL}/api/v1/addresses/`, {
      method: "GET",
      headers: {
        Authorization: authHeader,
      },
    });

    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error("Addresses GET error:", error);
    return NextResponse.json(
      { error: "Failed to fetch addresses" },
      { status: 401 }
    );
  }
}

/**
 * POST /addresses
 * Create address for logged-in user
 */
export async function POST(request: NextRequest) {
  try {
    const authHeader = getAuthHeader(request);
    const body = await request.json();

    const response = await fetch(`${API_BASE_URL}/api/v1/addresses/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: authHeader,
      },
      body: JSON.stringify(body),
    });

    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error("Addresses POST error:", error);
    return NextResponse.json(
      { error: "Failed to create address" },
      { status: 401 }
    );
  }
}
