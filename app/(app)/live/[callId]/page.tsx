"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { getUserWithRole } from "@/lib/stream/auth/getUserWithRole";
import { createVideoClient } from "@/lib/stream/stream/videoClient";
import {
  StreamVideo,
  StreamCall,
  SpeakerLayout,
} from "@stream-io/video-react-sdk";
import "@stream-io/video-react-sdk/dist/css/styles.css";

import DonationBox from "./DonationBox";

// Theme color
const PRIMARY_GREEN = "#5cb85c";

// Live Badge Component
const LiveBadge = () => (
  <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-red-50 border border-red-200 shadow-sm">
    <span className="relative flex h-3 w-3">
      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-500 opacity-75"></span>
      <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
    </span>
    <span className="text-sm font-bold text-red-600 uppercase tracking-wide">Live Now</span>
  </div>
);

// Icon Components
const VideoIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
  </svg>
);

const LeaveIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
  </svg>
);

export default function LiveViewerPage() {
  const params = useParams();
  const router = useRouter();

  const callId = typeof params.callId === "string" ? params.callId : "";

  const [client, setClient] = useState<any>(null);
  const [call, setCall] = useState<any>(null);
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [leaving, setLeaving] = useState(false);

  useEffect(() => {
    if (!callId) return;

    async function init() {
      try {
        const currentUser = await getUserWithRole();

        if (!currentUser || currentUser.role !== "customer") {
          router.push("/login");
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

        if (!res.ok) {
          throw new Error("Failed to get stream token");
        }

        const { token } = await res.json();

        const videoClient = createVideoClient(currentUser.id, token);
        setClient(videoClient);

        const livestreamCall = videoClient.call("livestream", callId);
        await livestreamCall.join();

        setCall(livestreamCall);
        setLoading(false);
      } catch (err: any) {
        console.error("Error joining stream:", err);
        setError(err.message || "Failed to join stream");
        setLoading(false);
      }
    }

    init();
  }, [callId, router]);

  // Handle leaving the stream - use window.location for guaranteed navigation
  const handleLeaveStream = () => {
    setLeaving(true);

    // Clean up in background
    if (call) {
      call.leave().catch(() => { });
    }
    if (client) {
      try { client.disconnectUser(); } catch { }
    }

    // Force navigation using window.location
    window.location.href = "/live-streams";
  };

  if (!callId) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#d6f0a8] via-[#eaf5b5] to-[#ffe6a3]">
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-10 text-center max-w-md">
          <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-red-50 flex items-center justify-center">
            <span className="text-4xl">❌</span>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-3">Invalid Stream</h2>
          <p className="text-gray-500 mb-6">The stream ID is invalid or missing.</p>
          <button
            onClick={() => window.location.href = "/live-streams"}
            className="px-8 py-3 rounded-xl text-white font-semibold transition-all hover:opacity-90 shadow-md"
            style={{ backgroundColor: PRIMARY_GREEN }}
          >
            Browse Live Streams
          </button>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#d6f0a8] via-[#eaf5b5] to-[#ffe6a3]">
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-10 text-center max-w-md">
          <div className="w-20 h-20 mx-auto mb-6 rounded-full flex items-center justify-center" style={{ backgroundColor: `${PRIMARY_GREEN}15` }}>
            <div
              className="w-10 h-10 border-4 border-t-transparent rounded-full animate-spin"
              style={{ borderColor: PRIMARY_GREEN, borderTopColor: 'transparent' }}
            ></div>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-3">Joining Live Stream</h2>
          <p className="text-gray-500">Connecting you to the ritual...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#d6f0a8] via-[#eaf5b5] to-[#ffe6a3]">
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-10 text-center max-w-md">
          <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-amber-50 flex items-center justify-center">
            <span className="text-4xl">⚠️</span>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-3">Unable to Join</h2>
          <p className="text-gray-500 mb-6">{error}</p>
          <button
            onClick={() => window.location.href = "/live-streams"}
            className="px-8 py-3 rounded-xl text-white font-semibold transition-all hover:opacity-90 shadow-md"
            style={{ backgroundColor: PRIMARY_GREEN }}
          >
            Browse Live Streams
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#d6f0a8] via-[#eaf5b5] to-[#ffe6a3]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10">

        {/* Header */}
        <div className="text-center mb-8">
          <div className="mb-4">
            <LiveBadge />
          </div>
          <h1 className="text-3xl sm:text-4xl font-serif font-bold text-gray-900 mb-2">
            Live Ritual Session
          </h1>
          <p className="text-gray-600">
            Experience the sacred ceremony in real-time
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* Video Section */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">

              {/* Video Header */}
              <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center text-white shadow-sm"
                    style={{ backgroundColor: PRIMARY_GREEN }}
                  >
                    <VideoIcon />
                  </div>
                  <div>
                    <h2 className="font-bold text-gray-900">Live Stream</h2>
                    <p className="text-xs text-gray-500">Priest Session</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: PRIMARY_GREEN }}></span>
                  <span className="text-sm font-medium" style={{ color: PRIMARY_GREEN }}>Connected</span>
                </div>
              </div>

              {/* Video Area */}
              <div className="relative aspect-video bg-[#2f3a1f]">
                {client && call && (
                  <StreamVideo client={client}>
                    <StreamCall call={call}>
                      <div className="w-full h-full">
                        <SpeakerLayout />
                      </div>
                    </StreamCall>
                  </StreamVideo>
                )}
              </div>

              {/* Controls */}
              <div className="px-5 py-4 bg-[#2f3a1f] flex items-center justify-center">
                <a
                  href="/live-streams"
                  onClick={() => {
                    // Clean up stream before leaving
                    if (call) call.leave().catch(() => { });
                    if (client) try { client.disconnectUser(); } catch { }
                  }}
                  className="inline-flex items-center gap-2 px-8 py-3 rounded-xl bg-red-600 text-white font-bold text-sm hover:bg-red-700 transition-all shadow-lg hover:shadow-red-600/30 no-underline"
                >
                  <LeaveIcon />
                  Leave Stream
                </a>
              </div>
            </div>

            {/* Participation Guide - Enhanced */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-100" style={{ backgroundColor: `${PRIMARY_GREEN}08` }}>
                <h3 className="font-bold text-gray-900 flex items-center gap-2 text-lg">
                  <span className="text-xl">✨</span> How to Participate
                </h3>
                <p className="text-sm text-gray-500 mt-1">Follow these guidelines for a meaningful experience</p>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {[
                    { icon: "🧘", title: "Find Peace", desc: "Sit in a calm, clean space", color: "#dcfce7" },
                    { icon: "🙏", title: "Open Heart", desc: "Join with a peaceful mind", color: "#fef3c7" },
                    { icon: "💝", title: "Give Back", desc: "Support with donations", color: "#fce7f3" },
                    { icon: "🔔", title: "Chant Along", desc: "Join the sacred mantras", color: "#e0e7ff" },
                  ].map((tip, i) => (
                    <div
                      key={i}
                      className="flex items-center gap-4 p-4 rounded-xl border border-gray-100"
                      style={{ backgroundColor: tip.color }}
                    >
                      <span className="text-3xl">{tip.icon}</span>
                      <div>
                        <p className="font-semibold text-gray-900">{tip.title}</p>
                        <p className="text-sm text-gray-600">{tip.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">

            {/* Donation Card */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100">
              <div className="px-5 py-4 border-b border-gray-100" style={{ backgroundColor: `${PRIMARY_GREEN}08` }}>
                <h2 className="font-bold text-gray-900 flex items-center gap-2 text-lg">
                  <span className="text-xl">🎁</span> Support The Priest
                </h2>
                <p className="text-sm text-gray-500 mt-1">
                  Your donation helps sustain sacred traditions
                </p>
              </div>

              <div className="p-5">
                {user && (
                  <DonationBox
                    callId={callId}
                    priestId={callId.replace("priest_", "")}
                    customerId={user.id}
                  />
                )}
              </div>
            </div>

            {/* Benefits Card */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
              <div className="px-5 py-4 border-b border-gray-100 bg-amber-50">
                <h3 className="font-bold text-gray-900 flex items-center gap-2">
                  <span className="text-lg">🌟</span> Benefits of Participation
                </h3>
              </div>
              <div className="p-5 space-y-4">
                {[
                  { icon: "🕉️", title: "Spiritual Merit", desc: "Earn punya from sacred rituals" },
                  { icon: "🙏", title: "Divine Blessings", desc: "Receive blessings in real-time" },
                  { icon: "🔥", title: "Positive Energy", desc: "Cleanse your aura and mind" },
                  { icon: "💫", title: "Karma Points", desc: "Good deeds multiply" },
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-gray-50 flex items-center justify-center text-lg flex-shrink-0 border border-gray-100">
                      {item.icon}
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900 text-sm">{item.title}</p>
                      <p className="text-xs text-gray-500">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx global>{`
        .str-video__speaker-layout { height: 100% !important; }
        .str-video__participant-view { border-radius: 0 !important; }
        .str-video__call-controls { display: none !important; }
      `}</style>
    </div>
  );
}