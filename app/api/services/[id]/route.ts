import { NextRequest, NextResponse } from "next/server";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL!;
const API_BASE = API_BASE_URL.replace(/\/$/, "");

/**
 * GET /api/services/[id]
 * Proxies request to backend GET /services/[id]
 */
export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const url = `${API_BASE}/services/${id}`;

        const response = await fetch(url, { method: "GET" });

        const contentType = response.headers.get("content-type") || "";
        const isJson = contentType.includes("application/json");
        const payload = isJson ? await response.json() : await response.text();

        return NextResponse.json(payload, { status: response.status });
    } catch (error) {
        console.error(`[API] Error fetching service details:`, error);
        return NextResponse.json(
            { error: "Failed to fetch service details" },
            { status: 500 }
        );
    }
}
