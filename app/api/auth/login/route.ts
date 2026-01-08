import { NextRequest, NextResponse } from 'next/server';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000/api/v1';

// Temporary synthetic credentials to allow frontend login while backend is unavailable
const MOCK_EMAIL = 'maatre@gamil.com';
const MOCK_PASSWORD = 'maatre@2026';
const MOCK_USER: LoginResponse = {
  user_id: 'mock-user-id',
  email: MOCK_EMAIL,
  is_new_user: false,
};

interface LoginRequest {
  email: string;
  password: string;
}

interface LoginResponse {
  user_id: string;
  email: string;
  is_new_user: boolean;
}

export async function POST(request: NextRequest) {
  try {
    const body: LoginRequest = await request.json();

    // Validate email and password
    if (!body.email || !body.email.includes('@')) {
      return NextResponse.json(
        { error: 'Valid email is required' },
        { status: 400 }
      );
    }

    if (!body.password) {
      return NextResponse.json(
        { error: 'Password is required' },
        { status: 400 }
      );
    }

    // Short-circuit with mock response for synthetic creds
    if (body.email === MOCK_EMAIL && body.password === MOCK_PASSWORD) {
      return NextResponse.json(MOCK_USER, { status: 200 });
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
    const message = error instanceof Error ? error.message : 'Login service unavailable';
    return NextResponse.json(
      { error: `Login failed: ${message}` },
      { status: 500 }
    );
  }
}
