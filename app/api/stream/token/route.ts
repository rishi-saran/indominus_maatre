import { NextResponse } from "next/server";
import { StreamClient } from "@stream-io/node-sdk";

export async function POST(req: Request) {
  try {
    const { userId, role } = await req.json();

    if (!userId || !role) {
      return NextResponse.json(
        { error: "userId and role are required" },
        { status: 400 }
      );
    }

    const apiKey =
      process.env.PUBLIC_STREAM_API_KEY || process.env.NEXT_PUBLIC_STREAM_API_KEY;
    const apiSecret = process.env.STREAM_API_SECRET;

    console.log("Stream API config:", { 
      hasApiKey: !!apiKey, 
      hasApiSecret: !!apiSecret,
      keySource: process.env.PUBLIC_STREAM_API_KEY ? 'PUBLIC_STREAM_API_KEY' : 'NEXT_PUBLIC_STREAM_API_KEY'
    });

    if (!apiKey || !apiSecret) {
      console.error("Missing Stream API credentials");
      return NextResponse.json(
        { error: "Stream API not configured" },
        { status: 500 }
      );
    }

    // Generate video token via server-side Stream client
    const serverClient = new StreamClient(apiKey, apiSecret);
    
    // Upsert user with correct role (admin for priests, user for customers)
    const streamRole = role === "priest" ? "admin" : "user";
    console.log("Upserting user:", { userId, streamRole });
    
    await serverClient.upsertUsers([
      {
        id: userId,
        role: streamRole,
      },
    ]);
    
    console.log("Creating token for userId:", userId);
    const token = serverClient.createToken(userId, Math.floor(Date.now() / 1000) + 3600);
    console.log("Token created successfully");

    return NextResponse.json({ token });
  } catch (err) {
    console.error("Stream token error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}