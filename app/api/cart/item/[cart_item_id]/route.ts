import { NextRequest, NextResponse } from 'next/server';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000/api/v1';

export async function DELETE(_req: NextRequest, { params }: { params: { cart_item_id: string } }) {
  try {
    const cartItemId = params?.cart_item_id;
    if (!cartItemId) {
      return NextResponse.json({ error: 'cart_item_id is required' }, { status: 400 });
    }

    const response = await fetch(`${API_BASE_URL}/cart/item/${cartItemId}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      return NextResponse.json(
        { error: errorData.detail || 'Failed to remove cart item' },
        { status: response.status }
      );
    }

    const data = await response.json().catch(() => ({ message: 'Item removed from cart' }));
    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    console.error('Cart item delete error:', error);
    return NextResponse.json({ error: 'Cart service unavailable' }, { status: 500 });
  }
}
