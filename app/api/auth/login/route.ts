import { NextRequest, NextResponse } from 'next/server';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000/api/v1';

interface LoginRequest {
  email: string;
}

interface LoginResponse {
  user_id: string;
  email: string;
  is_new_user: boolean;
}

export async function POST(request: NextRequest) {
  try {
    const body: LoginRequest = await request.json();

    // Validate email
    if (!body.email || !body.email.includes('@')) {
      return NextResponse.json(
        { error: 'Valid email is required' },
        { status: 400 }
      );
    }

    // Call backend API
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      return NextResponse.json(
        { error: errorData.detail || 'Login failed' },
        { status: response.status }
      );
    }

    const data: LoginResponse = await response.json();

    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
