import { NextRequest, NextResponse } from 'next/server';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000/api/v1';

interface OrderRequest {
  user_id: string;
  address: {
    address: string;
    city: string;
    state: string;
    pincode: string;
  };
}

interface OrderResponse {
  order_id: string;
  status: string;
  total_amount: number;
}

export async function POST(request: NextRequest) {
  try {
    const body: OrderRequest = await request.json();

    if (!body.user_id) {
      return NextResponse.json({ error: 'user_id is required' }, { status: 400 });
    }

    const response = await fetch(`${API_BASE_URL}/orders`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      return NextResponse.json(
        { error: errorData.detail || 'Failed to place order' },
        { status: response.status }
      );
    }

    const data: OrderResponse = await response.json();
    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    console.error('Order creation error:', error);
    return NextResponse.json({ error: 'Order service unavailable' }, { status: 500 });
  }
}
