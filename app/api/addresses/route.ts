import { NextRequest, NextResponse } from "next/server";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL!;

function getAuthHeader(request: NextRequest) {
  // Try to get token from Authorization header first (preferred)
  const authHeader = request.headers.get("authorization");
  if (authHeader) {
    console.log("[Addresses API] Found Authorization header");
    return authHeader;
  }
  
  // Fallback to reading from cookies
  const token = request.cookies.get("access_token")?.value;
  if (token) {
    console.log("[Addresses API] Found access_token in cookies");
    return `Bearer ${token}`;
  }
  
  console.error("[Addresses API] No authentication found in headers or cookies");
  throw new Error("Unauthorized");
}

/**
 * GET /addresses
 * List addresses for logged-in user
 */
export async function GET(request: NextRequest) {
  try {
    console.log("[Addresses API] GET /addresses called");
    const authHeader = getAuthHeader(request);

    console.log("[Addresses API] Fetching from backend:", `${API_BASE_URL}/addresses/`);
    const response = await fetch(`${API_BASE_URL}/addresses/`, {
      method: "GET",
      headers: {
        Authorization: authHeader,
      },
      cache: "no-store", // Avoid stale cache
    });

    console.log("[Addresses API] Backend response status:", response.status);
    const data = await response.json();
    
    if (!response.ok) {
      console.error("[Addresses API] Backend error:", response.status, data);
    } else {
      console.log("[Addresses API] Successfully fetched addresses, count:", Array.isArray(data) ? data.length : 'unknown');
    }
    
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error("[Addresses API] GET error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to fetch addresses" },
      { status: 401 }
    );
  }
}

/**
 * POST /addresses
 * Create address for logged-in user
 */
export async function POST(request: NextRequest) {
  try {
    console.log("[Addresses API] POST /addresses called");
    const authHeader = getAuthHeader(request);
    const body = await request.json();

    console.log("[Addresses API] Creating address with data:", body);
    const response = await fetch(`${API_BASE_URL}/addresses/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: authHeader,
      },
      body: JSON.stringify(body),
    });

    console.log("[Addresses API] Backend response status:", response.status);
    const data = await response.json();
    
    if (!response.ok) {
      console.error("[Addresses API] Backend error:", response.status, data);
    } else {
      console.log("[Addresses API] Address created successfully, id:", data.id);
    }
    
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error("[Addresses API] POST error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to create address" },
      { status: 401 }
    );
  }
}
