"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getUserWithRole } from "@/lib/stream/auth/getUserWithRole";

// Theme colors
const PRIMARY_GREEN = "#5cb85c";

interface LiveStream {
  callId: string;
  priestId: string;
  priestName?: string;
}

// Icon components
const VideoIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
  </svg>
);

const PlayIcon = () => (
  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
    <path d="M8 5v14l11-7z" />
  </svg>
);

// Stream Card Component
const StreamCard = ({ stream, onJoin }: { stream: LiveStream; onJoin: () => void }) => (
  <div
    className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-lg transition-all duration-300 cursor-pointer group"
    onClick={onJoin}
  >
    {/* Thumbnail Area */}
    <div className="relative aspect-video bg-[#2f3a1f] flex items-center justify-center">
      <div
        className="w-16 h-16 rounded-full flex items-center justify-center"
        style={{ backgroundColor: `${PRIMARY_GREEN}30` }}
      >
        <div style={{ color: PRIMARY_GREEN }}>
          <VideoIcon />
        </div>
      </div>

      {/* Live Badge */}
      <div className="absolute top-3 left-3">
        <div className="flex items-center gap-1.5 bg-red-500 text-white px-2.5 py-1 rounded-full text-xs font-bold">
          <span className="w-1.5 h-1.5 bg-white rounded-full animate-pulse"></span>
          LIVE
        </div>
      </div>

      {/* Play overlay on hover */}
      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
        <div
          className="w-14 h-14 rounded-full flex items-center justify-center text-white"
          style={{ backgroundColor: PRIMARY_GREEN }}
        >
          <PlayIcon />
        </div>
      </div>
    </div>

    {/* Content */}
    <div className="p-5">
      <div className="flex items-center gap-3 mb-3">
        <div
          className="w-10 h-10 rounded-full flex items-center justify-center text-white text-sm"
          style={{ backgroundColor: PRIMARY_GREEN }}
        >
          🙏
        </div>
        <div>
          <h3 className="font-semibold text-gray-900">Sacred Ritual</h3>
          <p className="text-xs text-gray-500">Priest: {stream.priestId.slice(0, 8)}...</p>
        </div>
      </div>

      <button
        className="w-full py-2.5 rounded-lg text-white font-semibold text-sm transition-all hover:opacity-90"
        style={{ backgroundColor: PRIMARY_GREEN }}
      >
        Join Stream
      </button>
    </div>
  </div>
);

export default function LiveStreamsPage() {
  const [streams, setStreams] = useState<LiveStream[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const router = useRouter();

  useEffect(() => {
    async function initPage() {
      try {
        const currentUser = await getUserWithRole();
        if (!currentUser) {
          router.push("/login");
          return;
        }

        if (currentUser.role === "priest") {
          router.push("/priest/dashboard");
          return;
        }

        setUser(currentUser);

        const res = await fetch("/api/stream/live");
        const data = await res.json();

        if (data.streams && Array.isArray(data.streams)) {
          const formattedStreams: LiveStream[] = data.streams
            .filter((callId: string) => callId.startsWith("priest_"))
            .map((callId: string) => ({
              callId,
              priestId: callId.replace("priest_", ""),
            }));

          setStreams(formattedStreams);
        }
      } catch (error) {
        console.error("Error fetching live streams:", error);
      } finally {
        setLoading(false);
      }
    }

    initPage();
  }, [router]);

  const handleJoinStream = (callId: string) => {
    router.push(`/live/${callId}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-[#d6f0a8] via-[#eaf5b5] to-[#ffe6a3]">
        <div className="flex flex-col items-center gap-3">
          <div
            className="w-10 h-10 border-3 border-t-transparent rounded-full animate-spin"
            style={{ borderColor: PRIMARY_GREEN, borderTopColor: 'transparent' }}
          ></div>
          <p className="text-gray-700 font-medium">Loading live streams...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-r from-[#d6f0a8] via-[#eaf5b5] to-[#ffe6a3]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">

        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 mb-4">
            <div
              className="w-10 h-10 rounded-full flex items-center justify-center text-white"
              style={{ backgroundColor: PRIMARY_GREEN }}
            >
              <VideoIcon />
            </div>
          </div>
          <h1 className="text-3xl sm:text-4xl font-serif font-bold text-gray-900 mb-3">
            Live Streams
          </h1>
          <p className="text-gray-600 max-w-xl mx-auto">
            Join priests performing sacred rituals and ceremonies in real-time
          </p>
        </div>

        {/* Streams Grid */}
        {streams.length === 0 ? (
          <div className="text-center py-16">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 inline-block p-8 max-w-md mx-auto">
              <div
                className="w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center"
                style={{ backgroundColor: `${PRIMARY_GREEN}15` }}
              >
                <span className="text-3xl">📺</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No Live Streams</h3>
              <p className="text-gray-500 text-sm">
                No priests are streaming at the moment. Please check back soon.
              </p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {streams.map((stream) => (
              <StreamCard
                key={stream.callId}
                stream={stream}
                onJoin={() => handleJoinStream(stream.callId)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
