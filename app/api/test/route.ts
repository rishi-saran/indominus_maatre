import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  return NextResponse.json({ 
    message: 'Next.js API is working',
    timestamp: new Date().toISOString(),
    backend_url: process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000'
  });
}

export async function POST(request: NextRequest) {
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000';
  
  try {
    // Try to connect to backend
    const backendResponse = await fetch(`${API_BASE_URL}/docs`);
    return NextResponse.json({
      message: 'Backend connection test',
      backend_status: backendResponse.status,
      backend_ok: backendResponse.ok,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    return NextResponse.json({
      message: 'Backend connection failed',
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
}
