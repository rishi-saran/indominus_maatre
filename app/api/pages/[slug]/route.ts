import { NextRequest, NextResponse } from "next/server";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL!;

export async function GET(
    request: NextRequest,
    props: { params: Promise<{ slug: string }> }
) {
    try {
        const params = await props.params;
        const slug = params.slug;

        // Construct backend URL: {API_BASE}/pages/{slug}
        // Note: API_BASE_URL from env already includes '/api/v1'
        const url = `${API_BASE_URL}/pages/${slug}`;
        console.log(`[Pages API] Proxying request to: ${url}`);

        const response = await fetch(url, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        });

        if (!response.ok) {
            console.error(`[Pages API] Backend returned ${response.status} for URL: ${url}`);
            return NextResponse.json(
                { error: `Failed to fetch page content from ${url} (Status: ${response.status})` },
                { status: response.status }
            );
        }

        const data = await response.json();
        return NextResponse.json(data);
    } catch (error) {
        console.error("[Pages API] Internal Error:", error);
        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 }
        );
    }
}
