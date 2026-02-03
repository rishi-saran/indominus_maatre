// Panchang API Service
// Fetches panchang data from backend which proxies to Prokerala API

// Period type for auspicious/inauspicious times
export interface TimePeriod {
    start: string;
    end: string;
}

// Auspicious/Inauspicious period from API
export interface AuspiciousPeriod {
    id: number;
    name: string;
    type: "Auspicious" | "Inauspicious";
    period: TimePeriod[];
}

// Tithi with paksha info
export interface TithiInfo {
    id: number;
    index: number;
    name: string;
    paksha?: string;
    start: string;
    end: string;
}

// Nakshatra with lord info
export interface NakshatraInfo {
    id: number;
    name: string;
    lord?: {
        id: number;
        name: string;
        vedic_name: string;
    };
    start: string;
    end: string;
}

// Yoga info
export interface YogaInfo {
    id: number;
    name: string;
    start: string;
    end: string;
}

// Karana info
export interface KaranaInfo {
    id: number;
    index: number;
    name: string;
    start: string;
    end: string;
}

// Type for Prokerala API response
export interface PanchangApiResponse {
    vaara?: string;
    tithi?: TithiInfo[];
    nakshatra?: NakshatraInfo[];
    yoga?: YogaInfo[];
    karana?: KaranaInfo[];
    sunrise?: string;
    sunset?: string;
    moonrise?: string;
    moonset?: string;
    auspicious_period?: AuspiciousPeriod[];
    inauspicious_period?: AuspiciousPeriod[];
    isMock?: boolean;
}

// Simplified data for UI display (dropdown/floating button)
export interface PanchangData {
    date: string;
    tithi: string;
    nakshatra: string;
    yoga: string;
    karana: string;
    sunrise: string;
    sunset: string;
    moonrise: string;
    auspiciousTime: string;
    vaara?: string;
    rahukaal?: string;
    isMock?: boolean; // New flag to indicate if data is mock/fallback
}

// Fallback data if API fails
export const fallbackPanchangData: PanchangData = {
    date: new Date().toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "long",
        year: "numeric"
    }),
    tithi: "Pratipada",
    nakshatra: "Ashlesha",
    yoga: "Ayushman",
    karana: "Bava",
    sunrise: "06:38 AM",
    sunset: "06:06 PM",
    moonrise: "07:45 PM",
    auspiciousTime: "11:59 AM - 12:45 PM",
};

// Static fallback for raw panchang data (used when API fails)
export const fallbackRawPanchangData = {
    vaara: new Date().toLocaleDateString('en-US', { weekday: 'long' }), // Dynamic weekday
    tithi: [{ name: "Pratipada", paksha: "Krishna" }],
    nakshatra: [{ name: "Ashlesha", lord: "Mercury" }],
    yoga: [{ name: "Ayushman" }],
    karana: [{ name: "Bava" }],
    sunrise: "2026-02-02T06:38:00+05:30",
    sunset: "2026-02-02T18:06:00+05:30",
    moonrise: "2026-02-02T19:45:00+05:30",
    moonset: "2026-02-02T07:30:00+05:30",
    auspicious_period: [
        { name: "Abhijit Muhurat", period: [{ start: "2026-02-02T11:59:00+05:30", end: "2026-02-02T12:45:00+05:30" }] },
        { name: "Amrit Kaal", period: [{ start: "2026-02-02T08:30:00+05:30", end: "2026-02-02T10:00:00+05:30" }] }
    ],
    inauspicious_period: [
        { name: "Rahu Kaal", period: [{ start: "2026-02-02T07:30:00+05:30", end: "2026-02-02T09:00:00+05:30" }] },
        { name: "Yamaganda", period: [{ start: "2026-02-02T10:30:00+05:30", end: "2026-02-02T12:00:00+05:30" }] },
        { name: "Gulika Kaal", period: [{ start: "2026-02-02T13:30:00+05:30", end: "2026-02-02T15:00:00+05:30" }] }
    ]
} as unknown as PanchangApiResponse;

// Format time from ISO string to readable format
export function formatTime(isoString: string | undefined): string {
    if (!isoString) return "--:--";
    try {
        const date = new Date(isoString);
        return date.toLocaleTimeString("en-IN", {
            hour: "2-digit",
            minute: "2-digit",
            hour12: true
        }).toUpperCase();
    } catch {
        return "--:--";
    }
}

// Format time range
export function formatTimeRange(period: TimePeriod | undefined): string {
    if (!period) return "N/A";
    return `${formatTime(period.start)} - ${formatTime(period.end)}`;
}

// Find period by name from auspicious/inauspicious periods
export function findPeriodByName(
    periods: AuspiciousPeriod[] | undefined,
    name: string
): TimePeriod | undefined {
    const found = periods?.find(p => p.name.toLowerCase().includes(name.toLowerCase()));
    return found?.period?.[0];
}

// Transform API response to UI format (for dropdown/floating button)
export function transformPanchangResponse(data: PanchangApiResponse, dateStr: string): PanchangData {
    // Find Abhijit Muhurat from auspicious periods
    const abhijitPeriod = findPeriodByName(data.auspicious_period, "Abhijit");
    // Find Rahu Kaal from inauspicious periods
    const rahuPeriod = findPeriodByName(data.inauspicious_period, "Rahu");

    return {
        date: new Date(dateStr).toLocaleDateString("en-IN", {
            day: "2-digit",
            month: "long",
            year: "numeric",
        }),
        isMock: (data as any).is_mock || false, // Check for mock flag from backend
        tithi: data.tithi?.[0]?.name || "N/A",
        nakshatra: data.nakshatra?.[0]?.name || "N/A",
        yoga: data.yoga?.[0]?.name || "N/A",
        karana: data.karana?.[0]?.name || "N/A",
        sunrise: formatTime(data.sunrise),
        sunset: formatTime(data.sunset),
        moonrise: formatTime(data.moonrise),
        auspiciousTime: abhijitPeriod
            ? formatTimeRange(abhijitPeriod)
            : "Check full panchang",
        vaara: data.vaara,
        rahukaal: rahuPeriod ? formatTimeRange(rahuPeriod) : undefined,
    };
}

// Fetch panchang data from backend API
export async function fetchPanchang(
    date?: string,
    coordinates: string = "13.0827,80.2707" // Default: Chennai
): Promise<{ data: PanchangData | null; error: string | null }> {
    try {
        // Use local date instead of UTC
        const now = new Date();
        const today = date || `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;

        // Use Internal Next.js API route
        const url = "/api/panchang";
        console.log("[Panchang API] POST to:", url);

        const response = await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                date: today,
                coordinates: coordinates,
                location: "Chennai", // Default location
            }),
        });

        if (!response.ok) {
            throw new Error(`API returned ${response.status}`);
        }

        const responseJson = await response.json();
        console.log("[Panchang API] Response:", responseJson);

        // The API returns { data: {...}, date, location } - extract the nested data
        const apiData: PanchangApiResponse = responseJson.data || responseJson;

        const transformed = transformPanchangResponse(apiData, today);
        return {
            data: transformed,
            error: null
        };
    } catch (err) {
        // Silently handle error and return fallback data
        console.warn("[Panchang API] Failed to fetch live data:", err instanceof Error ? err.message : String(err));
        // Return fallback data so UI still works
        return {
            data: { ...fallbackPanchangData, isMock: true, vaara: new Date().toLocaleDateString('en-US', { weekday: 'long' }) },
            error: null // Return null error to hide the error message in UI
        };
    }
}

// Fetch raw panchang data (for full page with all details)
export async function fetchRawPanchang(
    date?: string,
    coordinates: string = "13.0827,80.2707",
    location: string = "Chennai"
): Promise<{ data: PanchangApiResponse | null; date: string; location: string; error: string | null }> {
    try {
        const now = new Date();
        const today = date || `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;

        // Use Internal Next.js API route
        const url = "/api/panchang";

        const response = await fetch(url, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ date: today, coordinates, location }),
        });

        if (!response.ok) {
            throw new Error(`API returned ${response.status}`);
        }

        const responseJson = await response.json();
        const apiData: PanchangApiResponse = responseJson.data || responseJson;

        return {
            data: apiData,
            date: responseJson.date || today,
            location: responseJson.location || location,
            error: null
        };
    } catch (err) {
        // Silently handle error and return fallback data
        console.warn("[Panchang API] Failed to fetch live data:", err instanceof Error ? err.message : String(err));
        const now = new Date();
        const today = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
        // Return fallback data so UI still works
        return {
            data: fallbackRawPanchangData,
            date: today,
            location: "Chennai",
            error: null // Return null error to hide the error message in UI
        };
    }
}
