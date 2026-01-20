import { NextResponse } from "next/server";
import { supabase } from "@/lib/stream/supabase/client";

export async function POST(req: Request) {
  try {
    const { callId, priestId, customerId, amount, message } =
      await req.json();

    // ✅ Validate required fields
    if (!callId || !priestId || !customerId || !amount) {
      return NextResponse.json(
        { error: "Missing fields" },
        { status: 400 }
      );
    }

    const { error } = await supabase.from("donations").insert({
      call_id: callId,          // ✅ REQUIRED
      priest_id: priestId,
      customer_id: customerId,
      amount,
      message: message || null,
    });

    if (error) throw error;

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Donation error:", err);
    return NextResponse.json(
      { error: "Failed to donate" },
      { status: 500 }
    );
  }
}