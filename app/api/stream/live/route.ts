import { NextResponse } from "next/server";
import { StreamClient } from "@stream-io/node-sdk";

export async function GET() {
  try {
    const apiKey =
      process.env.PUBLIC_STREAM_API_KEY || process.env.NEXT_PUBLIC_STREAM_API_KEY;
    const apiSecret = process.env.STREAM_API_SECRET;

    if (!apiKey || !apiSecret) {
      console.error("Missing Stream API credentials");
      return NextResponse.json({ streams: [] }, { status: 500 });
    }

    const client = new StreamClient(apiKey, apiSecret);

    // Query ALL livestreams (no ended_at filter for debugging)
    const { calls } = await client.video.queryCalls({
      filter_conditions: {
        type: "livestream",
      },
      sort: [{ field: "created_at", direction: -1 }],
      limit: 25,
    });

    console.log("Found calls:", calls.length);
    calls.forEach((c) => {
      console.log("Call:", c.call.id);
      console.log("  - ended_at:", c.call.ended_at);
      console.log("  - backstage:", c.call.settings?.backstage);
      console.log("  - session:", c.call.session ? JSON.stringify({
        participants: c.call.session.participants?.length ?? 0,
        live_started_at: c.call.session.live_started_at,
        live_ended_at: c.call.session.live_ended_at,
      }) : "null");
    });

    // Filter to only include calls that are truly live:
    // - Call has NOT ended
    // - Has an active session with participants
    // - Is currently live (live_started_at exists, live_ended_at doesn't)
    const activeStreams = calls
      .filter((c) => {
        // Call must not be ended
        if (c.call.ended_at) {
          console.log("Skipping", c.call.id, "- call ended");
          return false;
        }
        
        const session = c.call.session;
        
        // If no session, call hasn't been joined yet
        if (!session) {
          console.log("Skipping", c.call.id, "- no session");
          return false;
        }
        
        // Check if there are participants in the call (someone is streaming)
        const participantCount = session.participants?.length ?? 0;
        if (participantCount === 0) {
          console.log("Skipping", c.call.id, "- no participants");
          return false;
        }
        
        // Check if stream is currently live (goLive was called, stopLive was not)
        if (!session.live_started_at) {
          console.log("Skipping", c.call.id, "- not live (in backstage)");
          return false;
        }
        
        if (session.live_ended_at) {
          console.log("Skipping", c.call.id, "- live ended");
          return false;
        }
        
        console.log("Including", c.call.id, "- LIVE with", participantCount, "participants");
        return true;
      })
      .map((c) => c.call.id);

    return NextResponse.json({ streams: activeStreams });
  } catch (error) {
    console.error("Live streams error:", error);
    return NextResponse.json({ streams: [] });
  }
}