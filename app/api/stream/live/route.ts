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

    // ✅ Correct server-side Stream client
    const client = new StreamClient(apiKey, apiSecret);

    // ✅ Query active livestreams (NO user, NO token)
    const { calls } = await client.video.queryCalls({
      filter_conditions: {
        type: "livestream",
        ended_at: { $exists: false },
      },
    });

    // ✅ Correct call ID extraction
    const streams = calls.map((c) => c.call.id);

    return NextResponse.json({ streams });
  } catch (error) {
    console.error("Live streams error:", error);
    return NextResponse.json({ streams: [] });
  }
}