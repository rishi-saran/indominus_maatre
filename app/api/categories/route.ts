import { NextRequest, NextResponse } from 'next/server';
const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export async function GET(request: NextRequest) {
  try {
    // Call backend directly
    const url = `${BACKEND_URL}/service-categories/`;
    console.log('Fetching categories from backend:', url);
    
    const response = await fetch(url, { 
      method: 'GET', 
      headers: { 'Content-Type': 'application/json' } 
    });
    
    const data = await response.json();
    console.log('Backend categories response:', data);
    
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error('Categories API error:', error);
    return NextResponse.json({ error: 'Failed to fetch categories' }, { status: 500 });
  }
}
