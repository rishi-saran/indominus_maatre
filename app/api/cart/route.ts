import { NextRequest, NextResponse } from "next/server";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL!;

function getAuthHeader(request: NextRequest) {
  const authHeader = request.headers.get("authorization");
  if (!authHeader) {
    throw new Error("Unauthorized");
  }
  return authHeader;
}

/**
 * GET /cart
 * Fetch current user's cart
 */
export async function GET(request: NextRequest) {
  try {
    const authHeader = getAuthHeader(request);

    const response = await fetch(`${API_BASE_URL}/api/v1/cart/`, {
      method: "GET",
      headers: {
        Authorization: authHeader,
      },
    });

    const data = await response.json();

    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error("Cart GET error:", error);
    return NextResponse.json(
      { error: "Failed to fetch cart" },
      { status: 401 }
    );
  }
}

/**
 * POST /cart
 * Get or create cart (no body)
 */
export async function POST(request: NextRequest) {
  try {
    const authHeader = getAuthHeader(request);

    const response = await fetch(`${API_BASE_URL}/api/v1/cart/`, {
      method: "POST",
      headers: {
        Authorization: authHeader,
      },
    });

    const data = await response.json();

    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error("Cart POST error:", error);
    return NextResponse.json(
      { error: "Failed to create cart" },
      { status: 401 }
    );
  }
}