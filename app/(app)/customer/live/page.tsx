"use client";
// pwd -> app/(app)/customer/live/page.tsx
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getUserWithRole } from "@/lib/stream/auth/getUserWithRole";
import { createVideoClient } from "@/lib/stream/stream/videoClient";

export default function CustomerLiveList() {
  const router = useRouter();
  const [streams, setStreams] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function init() {
      const user = await getUserWithRole();

      if (!user || user.role !== "customer") {
        router.push("/auth/login");
        return;
      }

      // Fetch live calls from Stream (client-side)
      const res = await fetch("/api/stream/live");
      const data = await res.json();

      setStreams(data.streams || []);
      setLoading(false);
    }

    init();
  }, [router]);

  if (loading) return <p>Loading live streams...</p>;

  return (
    <div style={{ padding: 40 }}>
      <h1>Live Priests</h1>

      {streams.length === 0 && <p>No one is live right now.</p>}

      <ul>
        {streams.map((callId) => (
          <li key={callId}>
            <button onClick={() => router.push(`/live/${callId}`)}>
              Watch {callId}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}