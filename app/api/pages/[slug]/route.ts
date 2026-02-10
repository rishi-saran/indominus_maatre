import { NextRequest, NextResponse } from "next/server";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL!;

function toTitle(slug: string) {
    return slug
        .split("-")
        .map((part) => (part ? part[0].toUpperCase() + part.slice(1) : part))
        .join(" ");
}

export async function GET(
    request: NextRequest,
    props: { params: Promise<{ slug: string }> }
) {
    const params = await props.params;
    const slug = params.slug;
    
    try {
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
                {
                    id: `fallback-${slug}`,
                    slug,
                    title: toTitle(slug),
                    type: "page",
                    content: null,
                    published: false,
                    fallback: true,
                },
                { status: 200 }
            );
        }

        const data = await response.json();
        return NextResponse.json(data);
    } catch (error) {
        console.error("[Pages API] Internal Error:", error);
        return NextResponse.json(
            {
                id: `fallback-${slug}`,
                slug,
                title: toTitle(slug),
                type: "page",
                content: null,
                published: false,
                fallback: true,
            },
            { status: 200 }
        );
    }
}
