import { NextRequest, NextResponse } from 'next/server';
const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

// Mock credentials
const MOCK_EMAIL = 'maathre@gmail.com';
const MOCK_PASSWORD = 'maathre@2026';
const MOCK_USER_ID = '550e8400-e29b-41d4-a716-446655440000';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password } = body;

    // Mock login for testing
    if (email === MOCK_EMAIL && password === MOCK_PASSWORD) {
      return NextResponse.json({
        id: MOCK_USER_ID,
        user_id: MOCK_USER_ID,
        email: MOCK_EMAIL,
        is_new_user: false,
        full_name: 'Test User',
        phone: '+919876543210',
        profile_picture_url: null,
        created_at: new Date().toISOString(),
        access_token: 'mock-jwt-token',
        token_type: 'bearer',
      }, { status: 200 });
    }

    // Try backend if not mock credentials
    const response = await fetch(`${BACKEND_URL}/api/auth/login`, { 
      method: 'POST', 
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    });
    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error('Auth login API error:', error);
    return NextResponse.json({ error: 'Failed to login' }, { status: 500 });
  }
}
