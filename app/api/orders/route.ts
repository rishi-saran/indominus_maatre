import { NextRequest, NextResponse } from 'next/server';
const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export async function POST(request: NextRequest) {
  try {
    // Extract query parameters from the frontend request
    const searchParams = request.nextUrl.searchParams;
    const queryString = searchParams.toString();
    const url = queryString ? `${BACKEND_URL}/orders/?${queryString}` : `${BACKEND_URL}/orders/`;
    console.log('Creating order at backend:', url);
    
    const response = await fetch(url, { 
      method: 'POST', 
      headers: { 'Content-Type': 'application/json' }
    });
    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error('Orders POST API error:', error);
    return NextResponse.json({ error: 'Failed to create order' }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  try {
    // Extract query parameters from the frontend request
    const searchParams = request.nextUrl.searchParams;
    const queryString = searchParams.toString();
    const url = queryString ? `${BACKEND_URL}/orders/?${queryString}` : `${BACKEND_URL}/orders/`;
    console.log('Fetching from backend:', url);
    
    const response = await fetch(url, { 
      method: 'GET', 
      headers: { 'Content-Type': 'application/json' }
    });

    console.log('Backend response status:', response.status, response.statusText);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Backend error details:', {
        status: response.status,
        statusText: response.statusText,
        body: errorText,
        headers: Object.fromEntries(response.headers)
      });
      
      return NextResponse.json(
        { error: `Backend error: ${response.status} ${response.statusText}`, details: errorText },
        { status: response.status }
      );
    }

    const data = await response.json();
    console.log('Backend response data:', data);
    return NextResponse.json(data);
  } catch (error) {
    console.error('Orders GET API error:', error);
    return NextResponse.json({ error: 'Failed to fetch orders', details: String(error) }, { status: 500 });
  }
}
