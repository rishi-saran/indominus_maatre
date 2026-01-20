"use client";

import { useEffect, useState } from "react";
import { createVideoClient } from "@/lib/stream/stream/videoClient";
import { getUserWithRole } from "@/lib/stream/auth/getUserWithRole";
import {
  StreamVideo,
  StreamCall,
  SpeakerLayout,
} from "@stream-io/video-react-sdk";
import { supabase } from "@/lib/stream/supabase/client";
// app/(app)/priest/dashboard/page.tsx
type Donation = {
  id: string;
  amount: number;
  message: string | null;
  customer_id: string;
  created_at: string;
};

export default function PriestDashboard() {
  const [client, setClient] = useState<any>(null);
  const [call, setCall] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const [donations, setDonations] = useState<Donation[]>([]);
  const [priestId, setPriestId] = useState<string | null>(null);

  async function startLive() {
    setLoading(true);

    const user = await getUserWithRole();
    if (!user || user.role !== "priest") {
      alert("Unauthorized");
      return;
    }

    setPriestId(user.id);

    const res = await fetch("/api/stream/token", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        userId: user.id,
        role: user.role,
      }),
    });

    const { token } = await res.json();

    const videoClient = createVideoClient(user.id, token);
    setClient(videoClient);

    const callId = `priest_${user.id}`;
    const livestreamCall = videoClient.call("livestream", callId);

    await livestreamCall.getOrCreate({
      data: {
        settings_override: {
          backstage: {
            enabled: true,
            join_ahead_time_seconds: 3600,
          },
        },
      },
    });

    await livestreamCall.join({ create: true });
    await livestreamCall.goLive();

    setCall(livestreamCall);
    setLoading(false);
  }

  // ✅ REALTIME DONATIONS
  useEffect(() => {
    if (!priestId) return;

    // Initial load
    supabase
      .from("donations")
      .select("*")
      .eq("priest_id", priestId)
      .order("created_at", { ascending: false })
      .then(({ data }) => {
        if (data) setDonations(data as Donation[]);
      });

    const channel = supabase
      .channel(`donations-${priestId}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "donations",
          filter: `priest_id=eq.${priestId}`,
        },
        (payload) => {
          setDonations((prev) => [
            payload.new as Donation,
            ...prev,
          ]);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [priestId]);

  return (
    <div style={{ padding: 40 }}>
      <h1>Priest Dashboard</h1>

      {!call && (
        <button onClick={startLive} disabled={loading}>
          {loading ? "Starting..." : "Go Live"}
        </button>
      )}

      {client && call && (
        <StreamVideo client={client}>
          <StreamCall call={call}>
            <SpeakerLayout />
          </StreamCall>
        </StreamVideo>
      )}

      {call && (
        <div style={{ marginTop: 30 }}>
          <h2>Live Donations</h2>

          {donations.length === 0 && <p>No donations yet.</p>}

          {donations.map((d) => (
            <div
              key={d.id}
              style={{
                padding: 12,
                marginBottom: 10,
                borderRadius: 8,
                background: "#111",
                border: "1px solid #333",
              }}
            >
              <strong>₹{d.amount}</strong>
              {d.message && <p>{d.message}</p>}
              <small>From: {d.customer_id}</small>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}