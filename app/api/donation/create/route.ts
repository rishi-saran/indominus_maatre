import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

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

    // Use service role to bypass RLS for server-side operations
    const supabaseAdmin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false
        }
      }
    );

    const { error } = await supabaseAdmin.from("donations").insert({
      call_id: callId,
      priest_id: priestId,
      customer_id: customerId,
      amount,
      message: message || null,
    });

    if (error) {
      console.error("Donation insert error:", error);
      throw error;
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Donation error:", err);
    return NextResponse.json(
      { error: "Failed to donate" },
      { status: 500 }
    );
  }
}