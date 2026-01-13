import { NextRequest, NextResponse } from "next/server";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000/api/v1";

interface CartItem {
  service_name: string;
  package: string;
  addon?: string;
  price: number;
  quantity: number;
}

interface CartResponse {
  cart_id: string;
  items: CartItem[];
  total_amount: number;
}

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ user_id: string }> }
) {
  try {
    const { user_id } = await params;

    if (!user_id) {
      return NextResponse.json(
        { error: "user_id is required" },
        { status: 400 }
      );
    }

    const response = await fetch(`${API_BASE_URL}/cart/${user_id}`);

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      return NextResponse.json(
        { error: errorData.detail || "Failed to fetch cart" },
        { status: response.status }
      );
    }

    const data: CartResponse = await response.json();
    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    console.error("Cart fetch error:", error);
    return NextResponse.json(
      { error: "Cart service unavailable" },
      { status: 500 }
    );
  }
}
