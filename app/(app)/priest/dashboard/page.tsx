"use client";

import { useEffect, useState } from "react";
import { createVideoClient } from "@/lib/stream/stream/videoClient";
import { getUserWithRole } from "@/lib/stream/auth/getUserWithRole";
import {
  StreamVideo,
  StreamCall,
  LivestreamLayout,
} from "@stream-io/video-react-sdk";
import "@stream-io/video-react-sdk/dist/css/styles.css";
import { supabase } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

// Theme color - soft professional green matching the app
const PRIMARY_GREEN = "#5cb85c";
const PRIMARY_GREEN_DARK = "#4cae4c";
const PRIMARY_GREEN_LIGHT = "#80c780";

type Donation = {
  id: string;
  amount: number;
  message: string | null;
  customer_id: string;
  created_at: string;
};

// Professional Stats Card
const StatCard = ({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) => (
  <div className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-100">
    <div className="flex items-center gap-4">
      <div
        className="w-12 h-12 rounded-full flex items-center justify-center"
        style={{ backgroundColor: PRIMARY_GREEN }}
      >
        <div className="text-white">{icon}</div>
      </div>
      <div>
        <p className="text-xs text-gray-500 font-medium uppercase tracking-wide">{label}</p>
        <p className="text-xl font-bold text-gray-900 mt-0.5">{value}</p>
      </div>
    </div>
  </div>
);

// Professional Donation Card
const DonationCard = ({ donation }: { donation: Donation }) => (
  <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 hover:shadow-md transition-all duration-200">
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div
          className="w-10 h-10 rounded-full flex items-center justify-center text-white text-sm font-bold"
          style={{ backgroundColor: PRIMARY_GREEN }}
        >
          ₹
        </div>
        <div>
          <p className="font-semibold text-gray-900">{donation.amount.toLocaleString()}</p>
          <p className="text-xs text-gray-500">
            {new Date(donation.created_at).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
          </p>
        </div>
      </div>
      <span
        className="px-2 py-1 rounded-full text-xs font-medium text-white"
        style={{ backgroundColor: PRIMARY_GREEN }}
      >
        New
      </span>
    </div>
    {donation.message && (
      <p className="mt-3 text-sm text-gray-600 bg-gray-50 rounded-lg p-2.5 italic">
        "{donation.message}"
      </p>
    )}
  </div>
);

// Live Badge
const LiveBadge = () => (
  <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-red-50 border border-red-200">
    <span className="relative flex h-2.5 w-2.5">
      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-500 opacity-75"></span>
      <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-500"></span>
    </span>
    <span className="text-xs font-semibold text-red-600 uppercase tracking-wide">Live</span>
  </div>
);

// Icon Components - Clean minimal style
const EyeIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
  </svg>
);

const ClockIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const CurrencyIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const HeartIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
  </svg>
);

const MicIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
  </svg>
);

const MicOffIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2" />
  </svg>
);

const VideoIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
  </svg>
);

const VideoOffIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M3 3l18 18" />
  </svg>
);

const StopIcon = () => (
  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
    <rect x="6" y="6" width="12" height="12" rx="1" />
  </svg>
);

const PlayIcon = () => (
  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
    <path d="M8 5v14l11-7z" />
  </svg>
);

export default function PriestDashboard() {
  const router = useRouter();
  const [client, setClient] = useState<any>(null);
  const [call, setCall] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [authLoading, setAuthLoading] = useState(true);

  const [donations, setDonations] = useState<Donation[]>([]);
  const [priestId, setPriestId] = useState<string | null>(null);
  const [priestName, setPriestName] = useState<string>("Priest");

  const [isMuted, setIsMuted] = useState(false);
  const [isCameraOff, setIsCameraOff] = useState(false);
  const [viewerCount, setViewerCount] = useState(0);
  const [streamDuration, setStreamDuration] = useState(0);

  useEffect(() => {
    async function checkAuth() {
      const user = await getUserWithRole();
      if (!user || user.role !== "priest") {
        router.push("/login");
        return;
      }
      setPriestId(user.id);
      setPriestName(user.email?.split("@")[0] || "Priest");
      setAuthLoading(false);
    }
    checkAuth();
  }, [router]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (call) {
      interval = setInterval(() => {
        setStreamDuration(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [call]);

  // Track viewer count from call state
  useEffect(() => {
    if (!call) {
      setViewerCount(0);
      return;
    }

    // Update viewer count every 2 seconds
    const updateViewerCount = () => {
      try {
        const participants = call.state.participants;
        // Subtract 1 to exclude the priest themselves
        const viewers = Math.max(0, participants.length - 1);
        setViewerCount(viewers);
      } catch (e) {
        console.warn("Could not get participant count:", e);
      }
    };

    // Initial count
    updateViewerCount();

    // Poll for updates
    const interval = setInterval(updateViewerCount, 2000);

    return () => clearInterval(interval);
  }, [call]);

  const formatDuration = (seconds: number) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  async function requestMediaPermissions(): Promise<boolean> {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      stream.getTracks().forEach(track => track.stop());
      return true;
    } catch (err: any) {
      if (err.name === 'NotAllowedError') {
        alert("Camera and microphone access is required. Please allow access in your browser.");
      } else if (err.name === 'NotFoundError') {
        alert("No camera or microphone found. Please connect devices to go live.");
      } else {
        alert(`Could not access camera/microphone: ${err.message}`);
      }
      return false;
    }
  }

  async function startLive() {
    setLoading(true);

    const hasPermissions = await requestMediaPermissions();
    if (!hasPermissions) {
      setLoading(false);
      return;
    }

    const user = await getUserWithRole();
    if (!user || user.role !== "priest") {
      alert("Unauthorized");
      setLoading(false);
      return;
    }

    setPriestId(user.id);

    try {
      const res = await fetch("/api/stream/token", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: user.id, role: user.role }),
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        alert(`Failed to get token: ${errorData.error || res.statusText}`);
        setLoading(false);
        return;
      }

      const { token } = await res.json();
      if (!token) {
        alert("Failed to get token");
        setLoading(false);
        return;
      }

      const videoClient = createVideoClient(user.id, token);
      setClient(videoClient);

      const callId = `priest_${user.id}`;
      const livestreamCall = videoClient.call("livestream", callId);

      await livestreamCall.getOrCreate({
        data: { settings_override: { backstage: { enabled: false } } },
      });

      await livestreamCall.join({ create: true });
      await livestreamCall.goLive();

      setCall(livestreamCall);
      setStreamDuration(0);

      try {
        await livestreamCall.camera.enable();
        setIsCameraOff(false);
      } catch { setIsCameraOff(true); }

      try {
        await livestreamCall.microphone.enable();
        setIsMuted(false);
      } catch { setIsMuted(true); }

    } catch (error: any) {
      alert(`Failed to start: ${error.message || 'Please try again.'}`);
      setClient(null);
      setCall(null);
    } finally {
      setLoading(false);
    }
  }

  async function endLive() {
    if (!call) return;

    try {
      await call.endCall();
      setCall(null);
      setClient(null);
      setPriestId(null);
      setStreamDuration(0);
    } catch (err) {
      console.error("Error ending stream:", err);
      alert("Failed to end stream");
    }
  }

  async function toggleMute() {
    if (!call) return;
    try {
      if (isMuted) await call.microphone.enable();
      else await call.microphone.disable();
      setIsMuted(!isMuted);
    } catch { }
  }

  async function toggleCamera() {
    if (!call) return;
    try {
      if (isCameraOff) await call.camera.enable();
      else await call.camera.disable();
      setIsCameraOff(!isCameraOff);
    } catch { }
  }

  useEffect(() => {
    if (!priestId) return;

    supabase
      .from("donations")
      .select("*")
      .eq("priest_id", priestId)
      .order("created_at", { ascending: false })
      .limit(20)
      .then(({ data }) => {
        if (data) setDonations(data as Donation[]);
      });

    const channel = supabase
      .channel(`donations-${priestId}`)
      .on("postgres_changes", {
        event: "INSERT",
        schema: "public",
        table: "donations",
        filter: `priest_id=eq.${priestId}`,
      }, (payload) => {
        setDonations(prev => [payload.new as Donation, ...prev.slice(0, 19)]);
      })
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [priestId]);

  const totalDonations = donations.reduce((sum, d) => sum + d.amount, 0);

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-[#d6f0a8] via-[#eaf5b5] to-[#ffe6a3]">
        <div className="flex flex-col items-center gap-3">
          <div
            className="w-10 h-10 border-3 border-t-transparent rounded-full animate-spin"
            style={{ borderColor: PRIMARY_GREEN, borderTopColor: 'transparent' }}
          ></div>
          <p className="text-gray-600 font-medium">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-r from-[#d6f0a8] via-[#eaf5b5] to-[#ffe6a3]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* Header */}
        <div className="text-center mb-10">
          {call && (
            <div className="mb-4">
              <LiveBadge />
            </div>
          )}
          <h1 className="text-3xl sm:text-4xl font-serif font-bold text-gray-900 mb-2">
            Priest Dashboard
          </h1>
          <p className="text-gray-600">
            Welcome, <span className="font-semibold" style={{ color: PRIMARY_GREEN }}>{priestName}</span>
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatCard icon={<EyeIcon />} label="Viewers" value={call ? viewerCount.toString() : "0"} />
          <StatCard icon={<ClockIcon />} label="Duration" value={call ? formatDuration(streamDuration) : "00:00:00"} />
          <StatCard icon={<CurrencyIcon />} label="Earnings" value={`₹${totalDonations.toLocaleString()}`} />
          <StatCard icon={<HeartIcon />} label="Donations" value={donations.length.toString()} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* Video Section */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">

              {/* Video Header */}
              <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div
                    className="w-9 h-9 rounded-lg flex items-center justify-center text-white"
                    style={{ backgroundColor: PRIMARY_GREEN }}
                  >
                    <VideoIcon />
                  </div>
                  <div>
                    <h2 className="font-semibold text-gray-900">Live Stream</h2>
                    {call && <p className="text-xs text-gray-500">ID: priest_{priestId?.slice(0, 6)}...</p>}
                  </div>
                </div>
                {call && (
                  <div className="flex items-center gap-1.5 text-xs font-medium" style={{ color: PRIMARY_GREEN }}>
                    <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ backgroundColor: PRIMARY_GREEN }}></span>
                    Broadcasting
                  </div>
                )}
              </div>

              {/* Video Area */}
              <div className="relative aspect-video bg-[#2f3a1f] flex items-center justify-center">
                {!call ? (
                  <div className="text-center px-6">
                    <div
                      className="w-20 h-20 mx-auto mb-6 rounded-full flex items-center justify-center"
                      style={{ backgroundColor: `${PRIMARY_GREEN}20` }}
                    >
                      <div style={{ color: PRIMARY_GREEN }}>
                        <svg className="w-10 h-10" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5l4.72-4.72a.75.75 0 011.28.53v11.38a.75.75 0 01-1.28.53l-4.72-4.72M4.5 18.75h9a2.25 2.25 0 002.25-2.25v-9a2.25 2.25 0 00-2.25-2.25h-9A2.25 2.25 0 002.25 7.5v9a2.25 2.25 0 002.25 2.25z" />
                        </svg>
                      </div>
                    </div>
                    <h3 className="text-xl font-semibold text-white mb-2">Start Your Session</h3>
                    <p className="text-gray-400 mb-6 max-w-sm mx-auto text-sm">
                      Begin your live ritual and connect with devotees
                    </p>
                    <button
                      onClick={startLive}
                      disabled={loading}
                      className="inline-flex items-center gap-2 px-8 py-3 rounded-xl text-white font-semibold transition-all hover:opacity-90 disabled:opacity-50"
                      style={{ backgroundColor: PRIMARY_GREEN }}
                    >
                      {loading ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          Starting...
                        </>
                      ) : (
                        <>
                          <PlayIcon />
                          Go Live
                        </>
                      )}
                    </button>
                  </div>
                ) : (
                  client && (
                    <StreamVideo client={client}>
                      <StreamCall call={call}>
                        <div className="w-full h-full">
                          <LivestreamLayout showParticipantCount={false} showLiveBadge={false} showDuration={false} />
                        </div>
                      </StreamCall>
                    </StreamVideo>
                  )
                )}
              </div>

              {/* Controls */}
              {call && (
                <div className="px-5 py-4 bg-[#2f3a1f] flex items-center justify-center gap-3">
                  <button
                    onClick={toggleMute}
                    className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-lg font-medium text-sm transition-all ${isMuted
                      ? "bg-red-500 text-white"
                      : "bg-[#4f5d2f] text-white hover:bg-[#5f6d3f]"
                      }`}
                  >
                    {isMuted ? <MicOffIcon /> : <MicIcon />}
                    {isMuted ? "Unmute" : "Mute"}
                  </button>

                  <button
                    onClick={toggleCamera}
                    className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-lg font-medium text-sm transition-all ${isCameraOff
                      ? "bg-red-500 text-white"
                      : "bg-[#4f5d2f] text-white hover:bg-[#5f6d3f]"
                      }`}
                  >
                    {isCameraOff ? <VideoOffIcon /> : <VideoIcon />}
                    {isCameraOff ? "Camera On" : "Camera Off"}
                  </button>

                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      endLive();
                    }}
                    type="button"
                    className="inline-flex items-center gap-2 px-6 py-2.5 rounded-lg bg-red-600 text-white font-semibold text-sm hover:bg-red-700 transition-all z-50 relative cursor-pointer"
                  >
                    <StopIcon />
                    End Stream
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Donations Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 sticky top-6">

              <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
                <h2 className="font-semibold text-gray-900 flex items-center gap-2">
                  <span className="text-lg">💝</span> Donations
                </h2>
                {call && (
                  <span
                    className="text-xs font-medium px-2 py-1 rounded-full"
                    style={{ backgroundColor: `${PRIMARY_GREEN}15`, color: PRIMARY_GREEN }}
                  >
                    Live
                  </span>
                )}
              </div>

              <div className="p-4 max-h-96 overflow-y-auto space-y-3">
                {donations.length === 0 ? (
                  <div className="text-center py-10">
                    <div
                      className="w-14 h-14 mx-auto mb-3 rounded-full flex items-center justify-center"
                      style={{ backgroundColor: `${PRIMARY_GREEN}10` }}
                    >
                      <span className="text-2xl">🎁</span>
                    </div>
                    <p className="text-gray-900 font-medium">No donations yet</p>
                    <p className="text-xs text-gray-500 mt-1">They'll appear here in real-time</p>
                  </div>
                ) : (
                  donations.map(d => <DonationCard key={d.id} donation={d} />)
                )}
              </div>

              {donations.length > 0 && (
                <div className="px-5 py-4 border-t border-gray-100" style={{ backgroundColor: `${PRIMARY_GREEN}05` }}>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Total</span>
                    <span className="text-xl font-bold" style={{ color: PRIMARY_GREEN }}>
                      ₹{totalDonations.toLocaleString()}
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <style jsx global>{`
        /* Livestream layout should fill container */
        .str-video__livestream-layout,
        .str-video__speaker-layout { 
          height: 100% !important; 
          width: 100% !important;
        }
        
        .str-video__participant-view { 
          border-radius: 0 !important; 
          height: 100% !important;
          width: 100% !important;
        }
        
        .str-video__call-controls { display: none !important; }
        
        /* Hide known overlay classes */
        .str-video__participant-count,
        .str-video__livestream-layout__participant-count,
        .str-video__speaker-layout__participant-count,
        .str-video__session-stats,
        .str-video__livestream-layout__live-badge,
        .str-video__call-stats,
        .str-video__participant-view__participant-details,
        .str-video__overlay,
        .str-video__livestream-layout__overlay,
        .str-video__livestream-layout__livestream-info,
        .str-video__livestream-layout__duration { 
          display: none !important; 
        }
        
        /* Hide span text elements */
        .str-video__speaker-layout > span,
        .str-video__speaker-layout__wrapper > span,
        .str-video__livestream-layout > span,
        .str-video__livestream-layout__wrapper > span { 
          display: none !important; 
        }
        
        /* Hide the participants bar */
        .str-video__speaker-layout__participants-bar,
        .str-video__livestream-layout__participants-bar {
          display: none !important;
        }
        
        /* Make video fill the container */
        .str-video__video {
          width: 100% !important;
          height: 100% !important;
          object-fit: cover !important;
        }
      `}</style>
    </div>
  );
}