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
 * POST /payments/verify
 * Verify Razorpay payment signature
 */
export async function POST(request: NextRequest) {
  try {
    const authHeader = getAuthHeader(request);
    const body = await request.json();

    const response = await fetch(
      `${API_BASE_URL}/api/v1/payments/verify`,
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
    console.error("Payment verification error:", error);
    return NextResponse.json(
      { error: "Failed to verify payment" },
      { status: 401 }
    );
  }
}
