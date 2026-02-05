import { NextRequest, NextResponse } from "next/server";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL!;
const API_BASE = API_BASE_URL.replace(/\/$/, "");

function getAuthHeader(request: NextRequest) {
  const authHeader = request.headers.get("authorization");
  if (!authHeader) {
    throw new Error("Unauthorized");
  }
  return authHeader;
}

/**
 * POST /cart/items
 * Add item to cart
 */
export async function POST(request: NextRequest) {
  try {
    const authHeader = getAuthHeader(request);

    // Get query params (backend expects query params, not body)
    const searchParams = request.nextUrl.searchParams;
    const params = {
      service_id: searchParams.get('service_id'),
      package_id: searchParams.get('package_id'),
      addon_id: searchParams.get('addon_id'),
      quantity: searchParams.get('quantity'),
      price: searchParams.get('price'),
    };

    // Build backend URL with query params
    const queryString = new URLSearchParams(
      Object.entries(params).filter(([_, v]) => v !== null) as [string, string][]
    ).toString();

    const response = await fetch(
      `${API_BASE}/cart/items${queryString ? `?${queryString}` : ''}`,
      {
        method: "POST",
        headers: {
          Authorization: authHeader,
        },
      }
    );

    const data = await response.json();

    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error("Cart add item error:", error);
    return NextResponse.json(
      { error: "Failed to add item to cart" },
      { status: 401 }
    );
  }
}
