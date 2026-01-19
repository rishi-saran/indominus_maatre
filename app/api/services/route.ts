import { NextRequest, NextResponse } from 'next/server';
const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const queryString = searchParams.toString();
    
    // Call backend directly
    const url = queryString ? `${BACKEND_URL}/services/?${queryString}` : `${BACKEND_URL}/services/`;
    console.log('Fetching services from backend:', url);
    
    const response = await fetch(url, { 
      method: 'GET', 
      headers: { 'Content-Type': 'application/json' } 
    });
    
    const data = await response.json();
    console.log('Backend services response:', data);
    
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error('Services API error:', error);
    return NextResponse.json({ error: 'Failed to fetch services' }, { status: 500 });
  }
}
