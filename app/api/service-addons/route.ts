import { NextRequest, NextResponse } from 'next/server';
const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const queryString = searchParams.toString();
    const url = queryString ? `${BACKEND_URL}/service-addons/?${queryString}` : `${BACKEND_URL}/service-addons/`;
    
    const response = await fetch(url, { 
      method: 'GET', 
      headers: { 'Content-Type': 'application/json' }
    });
    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error('Service Addons API error:', error);
    return NextResponse.json({ error: 'Failed to fetch service addons' }, { status: 500 });
  }
}
