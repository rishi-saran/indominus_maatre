"use client";
//  app/(app)/live/[callId]/page.tsx
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { getUserWithRole } from "@/lib/stream/auth/getUserWithRole";
import { createVideoClient } from "@/lib/stream/stream/videoClient";
import {
  StreamVideo,
  StreamCall,
  SpeakerLayout,
} from "@stream-io/video-react-sdk";

import DonationBox from "./DonationBox";

export default function LiveViewerPage() {
  const params = useParams();
  const router = useRouter();

  // ✅ SAFELY extract callId
  const callId =
    typeof params.callId === "string" ? params.callId : "";

  const [client, setClient] = useState<any>(null);
  const [call, setCall] = useState<any>(null);
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!callId) return;

    async function init() {
      const currentUser = await getUserWithRole();

      if (!currentUser || currentUser.role !== "customer") {
        router.push("/auth/login");
        return;
      }

      setUser(currentUser);

      const res = await fetch("/api/stream/token", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: currentUser.id,
          role: currentUser.role,
        }),
      });

      const { token } = await res.json();

      const videoClient = createVideoClient(currentUser.id, token);
      setClient(videoClient);

      const livestreamCall = videoClient.call("livestream", callId);
      await livestreamCall.join();

      setCall(livestreamCall);
      setLoading(false);
    }

    init();
  }, [callId, router]);

  if (!callId) return <p>Invalid stream</p>;
  if (loading) return <p>Joining live stream…</p>;

  return (
    <div style={{ padding: 40 }}>
      <h1>Live Ritual</h1>

      {/* 🎥 LIVE VIDEO */}
      {client && call && (
        <StreamVideo client={client}>
          <StreamCall call={call}>
            <SpeakerLayout />
          </StreamCall>
        </StreamVideo>
      )}

      {/* 💰 DONATION BOX */}
      {user && (
        <DonationBox
          callId={callId} // ✅ NOW GUARANTEED STRING
          priestId={callId.replace("priest_", "")}
          customerId={user.id}
        />
      )}
    </div>
  );
}