import { NextRequest, NextResponse } from "next/server";

// Token cache to avoid requesting new token for every API call
let tokenCache: { token: string; expiresAt: number } | null = null;

// Get Prokerala API token
async function getProkeralaToken(): Promise<string> {
    // Check if we have a valid cached token
    if (tokenCache && Date.now() < tokenCache.expiresAt) {
        return tokenCache.token;
    }

    const clientId = process.env.PROKERALA_CLIENT_ID;
    const clientSecret = process.env.PROKERALA_CLIENT_SECRET;

    if (!clientId || !clientSecret) {
        throw new Error("Prokerala API credentials not configured");
    }

    const tokenUrl = "https://api.prokerala.com/token";

    const response = await fetch(tokenUrl, {
        method: "POST",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({
            grant_type: "client_credentials",
            client_id: clientId,
            client_secret: clientSecret,
        }),
    });

    if (!response.ok) {
        const errorText = await response.text();
        console.error("[Panchang API] Token error:", errorText);
        throw new Error(`Failed to get Prokerala token: ${response.status}`);
    }

    const data = await response.json();

    // Cache the token (expires_in is in seconds, subtract 5 minutes for safety)
    tokenCache = {
        token: data.access_token,
        expiresAt: Date.now() + (data.expires_in - 300) * 1000,
    };

    return data.access_token;
}

export async function POST(request: NextRequest) {
    // Mock data for fallback (defined inside to get fresh date, and outside try to be visible in catch)
    const mockPanchangData = {
        is_mock: true, // Flag inside data object for frontend detection
        vaara: new Date().toLocaleDateString('en-US', { weekday: 'long' }),
        tithi: [{
            id: 1,
            name: "Pratipada",
            paksha: "Krishna",
            end: new Date().toISOString()
        }],
        nakshatra: [{
            id: 9,
            name: "Ashlesha",
            lord: "Mercury",
            end: new Date().toISOString()
        }],
        yoga: [{
            id: 3,
            name: "Ayushman",
            end: new Date().toISOString()
        }],
        karana: [{
            id: 1,
            name: "Bava",
            end: new Date().toISOString()
        }],
        sunrise: new Date().setHours(6, 38, 0, 0) ? new Date(new Date().setHours(6, 38, 0, 0)).toISOString() : undefined,
        sunset: new Date().setHours(18, 6, 0, 0) ? new Date(new Date().setHours(18, 6, 0, 0)).toISOString() : undefined,
        moonrise: new Date().setHours(19, 45, 0, 0) ? new Date(new Date().setHours(19, 45, 0, 0)).toISOString() : undefined,
        moonset: new Date().setHours(7, 30, 0, 0) ? new Date(new Date().setHours(7, 30, 0, 0)).toISOString() : undefined,
        auspicious_period: [
            {
                id: 1,
                name: "Abhijit Muhurat",
                period: [{
                    start: new Date(new Date().setHours(11, 59, 0, 0)).toISOString(),
                    end: new Date(new Date().setHours(12, 45, 0, 0)).toISOString()
                }]
            },
            {
                id: 2,
                name: "Amrit Kaal",
                period: [{
                    start: new Date(new Date().setHours(8, 30, 0, 0)).toISOString(),
                    end: new Date(new Date().setHours(10, 0, 0, 0)).toISOString()
                }]
            }
        ],
        inauspicious_period: [
            {
                id: 1,
                name: "Rahu Kaal",
                period: [{
                    start: new Date(new Date().setHours(7, 30, 0, 0)).toISOString(),
                    end: new Date(new Date().setHours(9, 0, 0, 0)).toISOString()
                }]
            },
            {
                id: 2,
                name: "Yamaganda",
                period: [{
                    start: new Date(new Date().setHours(10, 30, 0, 0)).toISOString(),
                    end: new Date(new Date().setHours(12, 0, 0, 0)).toISOString()
                }]
            },
            {
                id: 3,
                name: "Gulika Kaal",
                period: [{
                    start: new Date(new Date().setHours(13, 30, 0, 0)).toISOString(),
                    end: new Date(new Date().setHours(15, 0, 0, 0)).toISOString()
                }]
            }
        ]
    };

    try {
        const body = await request.json();
        const { date, coordinates, location, timezone = "+05:30" } = body;

        if (!date || !coordinates) {
            return NextResponse.json(
                { error: "Missing required parameters: date and coordinates" },
                { status: 400 }
            );
        }

        // Check for credentials first
        const clientId = process.env.PROKERALA_CLIENT_ID;
        const clientSecret = process.env.PROKERALA_CLIENT_SECRET;

        // If credentials are missing or default, return mock data
        if (!clientId || !clientSecret || clientId === 'your_client_id_here') {
            console.warn("[Panchang API] Credentials missing, returning mock data");
            return NextResponse.json({
                date,
                location: location || "Chennai",
                data: mockPanchangData,
                is_mock: true
            });
        }

        // Get the API token
        const token = await getProkeralaToken();

        // Parse coordinates
        const [lat, lng] = coordinates.split(",");

        // Build Prokerala API URL
        const panchangUrl = new URL("https://api.prokerala.com/v2/astrology/panchang/advanced");
        panchangUrl.searchParams.set("ayanamsa", "1"); // Lahiri
        panchangUrl.searchParams.set("coordinates", `${lat},${lng}`);
        panchangUrl.searchParams.set("datetime", `${date}T06:00:00${timezone}`);

        console.log("[Panchang API] Fetching from:", panchangUrl.toString());

        const panchangResponse = await fetch(panchangUrl.toString(), {
            headers: {
                Authorization: `Bearer ${token}`,
                Accept: "application/json",
            },
        });

        if (!panchangResponse.ok) {
            const errorText = await panchangResponse.text();
            console.error("[Panchang API] Prokerala error:", errorText);
            throw new Error(`Prokerala API returned ${panchangResponse.status}`);
        }

        const data = await panchangResponse.json();

        // Return the data with metadata
        return NextResponse.json({
            date,
            location: location || "Chennai",
            data: data.data,
        });
    } catch (error) {
        console.error("[Panchang API] Error:", error);

        // If it's a configuration error, fall back to mock data
        if (error instanceof Error && error.message.includes("not configured")) {
            return NextResponse.json({
                date: new Date().toISOString().split('T')[0],
                location: "Chennai",
                data: mockPanchangData,
                is_mock: true
            });
        }

        return NextResponse.json(
            {
                error: error instanceof Error ? error.message : "Failed to fetch panchang data",
                details: error instanceof Error ? error.stack : undefined
            },
            { status: 500 }
        );
    }
}

// Also support GET for simple testing
export async function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams;
    const date = searchParams.get("date") || new Date().toISOString().split("T")[0];
    const coordinates = searchParams.get("coordinates") || "13.0827,80.2707";
    const location = searchParams.get("location") || "Chennai";

    // Convert to POST request internally
    const mockRequest = {
        json: async () => ({ date, coordinates, location }),
    } as NextRequest;

    return POST(mockRequest);
}
