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
 * GET /orders
 * List orders for logged-in user
 */
export async function GET(request: NextRequest) {
  try {
    const authHeader = getAuthHeader(request);

    const response = await fetch(`${API_BASE_URL}/api/v1/orders/`, {
      method: "GET",
      headers: {
        Authorization: authHeader,
      },
    });

    const data = await response.json();

    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error("Orders GET error:", error);
    return NextResponse.json(
      { error: "Failed to fetch orders" },
      { status: 401 }
    );
  }
}

/**
 * POST /orders
 * Create order from cart
 */
export async function POST(request: NextRequest) {
  try {
    const authHeader = getAuthHeader(request);
    const body = await request.json(); // provider_id, address_id

    const search = new URLSearchParams();
    if (body?.provider_id) search.append("provider_id", body.provider_id);
    if (body?.address_id) search.append("address_id", body.address_id);

    const url = `${API_BASE_URL}/api/v1/orders/${
      search.toString() ? `?${search.toString()}` : ''
    }`;

    const response = await fetch(url, {
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
    console.error("Orders POST error:", error);
    return NextResponse.json(
      { error: "Failed to create order" },
      { status: 401 }
    );
  }
}