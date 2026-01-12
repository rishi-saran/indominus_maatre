import { NextRequest, NextResponse } from 'next/server';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000/api/v1';

interface PaymentRequest {
  order_id: string;
  method: string;
}

interface PaymentResponse {
  payment_id: string;
  status: string;
}

export async function POST(request: NextRequest) {
  try {
    const body: PaymentRequest = await request.json();

    if (!body.order_id) {
      return NextResponse.json({ error: 'order_id is required' }, { status: 400 });
    }

    if (!body.method) {
      return NextResponse.json({ error: 'payment method is required' }, { status: 400 });
    }

    const response = await fetch(`${API_BASE_URL}/payments`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      return NextResponse.json(
        { error: errorData.detail || 'Payment failed' },
        { status: response.status }
      );
    }

    const data: PaymentResponse = await response.json();
    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    console.error('Payment error:', error);
    return NextResponse.json({ error: 'Payment service unavailable' }, { status: 500 });
  }
}
