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
 * DELETE /cart/items/[cart_item_id]
 * Remove item from cart
 */
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

    const authHeader = getAuthHeader(request);

    const response = await fetch(
      `${API_BASE}/cart/items/${cart_item_id}`,
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

    return NextResponse.json({ status: "item removed" }, { status: 200 });
  } catch (error) {
    console.error("Delete cart item error:", error);
    return NextResponse.json(
      { error: "Cart service unavailable" },
      { status: 500 }
    );
  }
}
