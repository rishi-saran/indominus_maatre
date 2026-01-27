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
 * GET /payments
 * List payments for logged-in user
 */
export async function GET(request: NextRequest) {
  try {
    const authHeader = getAuthHeader(request);

    const response = await fetch(`${API_BASE_URL}/api/v1/payments/`, {
      method: "GET",
      headers: {
        Authorization: authHeader,
      },
    });

    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error("Payments GET error:", error);
    return NextResponse.json(
      { error: "Failed to fetch payments" },
      { status: 401 }
    );
  }
}

/**
 * POST /payments/create-order
 * Create Razorpay order (SAFE)
 */
export async function POST(request: NextRequest) {
  try {
    const authHeader = getAuthHeader(request);
    const body = await request.json(); // { order_id }

    const response = await fetch(
      `${API_BASE_URL}/api/v1/payments/create-order`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: authHeader,
        },
        body: JSON.stringify(body),
      }
    );

    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error("Payments POST error:", error);
    return NextResponse.json(
      { error: "Failed to initiate payment" },
      { status: 401 }
    );
  }
}