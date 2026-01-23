"use client";

import { useEffect, useState } from "react";
import { createVideoClient } from "@/lib/stream/stream/videoClient";
import { getUserWithRole } from "@/lib/stream/auth/getUserWithRole";
import {
  StreamVideo,
  StreamCall,
  SpeakerLayout,
} from "@stream-io/video-react-sdk";
import { supabase } from "@/lib/supabase/client";
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
  
  const [isMuted, setIsMuted] = useState(false);
  const [isCameraOff, setIsCameraOff] = useState(false);

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

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({ error: 'Unknown error' }));
      console.error("Token fetch failed:", errorData);
      alert(`Failed to get Stream token: ${errorData.error || res.statusText}`);
      setLoading(false);
      return;
    }

    const { token } = await res.json();

    if (!token) {
      alert("Failed to get Stream token");
      setLoading(false);
      return;
    }

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

  async function endLive() {
    if (!call) return;
    
    try {
      await call.endCall();
      setCall(null);
      setClient(null);
      setPriestId(null);
    } catch (err) {
      console.error("Error ending stream:", err);
      alert("Failed to end stream");
    }
  }

  async function toggleMute() {
    if (!call) return;
    
    try {
      if (isMuted) {
        await call.microphone.enable();
      } else {
        await call.microphone.disable();
      }
      setIsMuted(!isMuted);
    } catch (err) {
      console.error("Error toggling mute:", err);
    }
  }

  async function toggleCamera() {
    if (!call) return;
    
    try {
      if (isCameraOff) {
        await call.camera.enable();
      } else {
        await call.camera.disable();
      }
      setIsCameraOff(!isCameraOff);
    } catch (err) {
      console.error("Error toggling camera:", err);
    }
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
        <>
          <div style={{ marginBottom: 20, display: "flex", gap: 10 }}>
            <button onClick={toggleMute} style={{ padding: "10px 20px", cursor: "pointer" }}>
              {isMuted ? "🔇 Unmute" : "🎤 Mute"}
            </button>
            <button onClick={toggleCamera} style={{ padding: "10px 20px", cursor: "pointer" }}>
              {isCameraOff ? "📹 Turn Camera On" : "📷 Turn Camera Off"}
            </button>
            <button 
              onClick={endLive} 
              style={{ 
                padding: "10px 20px", 
                cursor: "pointer", 
                backgroundColor: "#dc2626", 
                color: "white", 
                border: "none", 
                borderRadius: 5 
              }}
            >
              ⏹️ End Stream
            </button>
          </div>
          
          <StreamVideo client={client}>
            <StreamCall call={call}>
              <SpeakerLayout />
            </StreamCall>
          </StreamVideo>
        </>
      )}

      {call && (
        <div style={{ marginTop: 30, backgroundColor: "white", padding: 20, borderRadius: 8 }}>
          <h2 style={{ color: "#000" }}>Live Donations</h2>

          {donations.length === 0 && <p style={{ color: "#666" }}>No donations yet.</p>}

          {donations.map((d) => (
            <div
              key={d.id}
              style={{
                padding: 12,
                marginBottom: 10,
                borderRadius: 8,
                background: "#f3f4f6",
                border: "1px solid #d1d5db",
              }}
            >
              <strong style={{ color: "#059669" }}>₹{d.amount}</strong>
              {d.message && <p style={{ margin: "8px 0 0 0", color: "#374151" }}>{d.message}</p>}
              <small style={{ color: "#6b7280", fontSize: "12px" }}>From: {d.customer_id}</small>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}