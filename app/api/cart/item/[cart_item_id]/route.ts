import { NextRequest, NextResponse } from "next/server";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000";

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ cart_item_id: string }> }
) {
  try {
    const { cart_item_id } = await params;

    if (!cart_item_id) {
      return NextResponse.json(
        { error: "cart_item_id is required" },
        { status: 400 }
      );
    }

    const authHeader = request.headers.get("authorization");

    if (!authHeader) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const response = await fetch(
      `${API_BASE_URL}/api/v1/cart/items/${cart_item_id}`,
      {
        method: "DELETE",
        headers: {
          Authorization: authHeader,
        },
      }
    );

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      return NextResponse.json(
        { error: errorData.detail || "Failed to delete cart item" },
        { status: response.status }
      );
    }

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error("Delete cart item error:", error);
    return NextResponse.json(
      { error: "Cart service unavailable" },
      { status: 500 }
    );
  }
}