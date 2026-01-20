import { NextResponse } from "next/server";
import { StreamChat } from "stream-chat";

export async function POST(req: Request) {
  try {
    const { userId, role } = await req.json();

    if (!userId || !role) {
      return NextResponse.json(
        { error: "userId and role are required" },
        { status: 400 }
      );
    }

    const apiKey = process.env.NEXT_PUBLIC_STREAM_API_KEY!;
    const apiSecret = process.env.STREAM_API_SECRET!;

    const serverClient = StreamChat.getInstance(apiKey, apiSecret);

    // ✅ THIS IS THE CRITICAL FIX
    // Roles are assigned HERE, not in createToken
    await serverClient.upsertUser({
      id: userId,
      role: role === "priest" ? "admin" : "user",
    });

    // ✅ Token is generated AFTER role is set
    const token = serverClient.createToken(userId);

    return NextResponse.json({ token });
  } catch (err) {
    console.error("Stream token error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}