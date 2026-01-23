/**
 * Live Streams Service
 * Handles fetching and managing active live streams from the Stream API
 */

export interface LiveStream {
  callId: string;
  priestId: string;
  priestName?: string;
  createdAt?: string;
}

/**
 * Fetch all active live streams
 * @returns Array of active livestream calls
 */
export async function getActiveLiveStreams(): Promise<LiveStream[]> {
  try {
    const res = await fetch("/api/stream/live", {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });

    if (!res.ok) {
      console.error("Failed to fetch live streams:", res.statusText);
      return [];
    }

    const data = await res.json();

    if (!data.streams || !Array.isArray(data.streams)) {
      return [];
    }

    // Filter and format streams - extract priestId from callId (format: "priest_<priestId>")
    const formattedStreams: LiveStream[] = data.streams
      .filter((callId: string) => callId.startsWith("priest_"))
      .map((callId: string) => ({
        callId,
        priestId: callId.replace("priest_", ""),
      }));

    return formattedStreams;
  } catch (error) {
    console.error("Error fetching live streams:", error);
    return [];
  }
}

/**
 * Check if a specific priest is currently live
 * @param priestId - The priest's user ID
 * @returns True if priest is live, false otherwise
 */
export async function isPriestLive(priestId: string): Promise<boolean> {
  const streams = await getActiveLiveStreams();
  return streams.some((stream) => stream.priestId === priestId);
}

/**
 * Get a specific live stream by priest ID
 * @param priestId - The priest's user ID
 * @returns The live stream object or null
 */
export async function getLiveStreamByPriestId(
  priestId: string
): Promise<LiveStream | null> {
  const streams = await getActiveLiveStreams();
  return streams.find((stream) => stream.priestId === priestId) || null;
}
