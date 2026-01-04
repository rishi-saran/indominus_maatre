import { NextRequest, NextResponse } from 'next/server';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000/api/v1';

interface RegisterRequest {
  email: string;
  first_name: string;
  last_name: string;
  phone: string;
}

interface RegisterResponse {
  user_id: string;
  email: string;
}

export async function POST(request: NextRequest) {
  try {
    const body: RegisterRequest = await request.json();

    // Validate required fields
    if (!body.email || !body.email.includes('@')) {
      return NextResponse.json(
        { error: 'Valid email is required' },
        { status: 400 }
      );
    }

    if (!body.first_name || !body.last_name) {
      return NextResponse.json(
        { error: 'First name and last name are required' },
        { status: 400 }
      );
    }

    if (!body.phone) {
      return NextResponse.json(
        { error: 'Phone number is required' },
        { status: 400 }
      );
    }

    // Call backend API
    const response = await fetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      return NextResponse.json(
        { error: errorData.detail || 'Registration failed' },
        { status: response.status }
      );
    }

    const data: RegisterResponse = await response.json();

    return NextResponse.json(data, { status: 201 });
  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
