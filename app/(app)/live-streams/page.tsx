"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getUserWithRole } from "@/lib/stream/auth/getUserWithRole";
import { motion } from "framer-motion";
import { Video, AlertCircle, Loader2 } from "lucide-react";

interface LiveStream {
  callId: string;
  priestId: string;
  priestName?: string;
}

export default function LiveStreamsPage() {
  const [streams, setStreams] = useState<LiveStream[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const router = useRouter();

  useEffect(() => {
    async function initPage() {
      try {
        // Check if user is logged in
        const currentUser = await getUserWithRole();
        if (!currentUser) {
          router.push("/login");
          return;
        }

        // Redirect priests to their dashboard
        if (currentUser.role === "priest") {
          router.push("/priest/dashboard");
          return;
        }

        setUser(currentUser);

        // Fetch active live streams
        const res = await fetch("/api/stream/live");
        const data = await res.json();

        if (data.streams && Array.isArray(data.streams)) {
          // Filter and format streams - extract priestId from callId (format: "priest_<priestId>")
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
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-[var(--spiritual-dark)] to-black">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-[var(--spiritual-green)] animate-spin mx-auto mb-4" />
          <p className="text-white text-lg">Loading live streams...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[var(--spiritual-dark)] to-black pt-32 pb-20">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-12"
        >
          <div className="flex items-center gap-3 mb-4">
            <Video className="w-8 h-8 text-[var(--spiritual-green)]" />
            <h1 className="text-4xl md:text-5xl font-bold text-white">
              Live Streams
            </h1>
          </div>
          <p className="text-gray-400 text-lg">
            Join priests performing sacred rituals and ceremonies in real-time
          </p>
        </motion.div>

        {/* Streams Grid */}
        {streams.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="text-center py-20"
          >
            <div className="inline-flex items-center gap-3 bg-[var(--spiritual-green)]/10 border border-[var(--spiritual-green)]/30 rounded-lg px-6 py-4">
              <AlertCircle className="w-5 h-5 text-[var(--spiritual-green)]" />
              <p className="text-gray-300">
                No live streams at the moment. Please check back soon.
              </p>
            </div>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {streams.map((stream, index) => (
              <motion.div
                key={stream.callId}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="group cursor-pointer"
                onClick={() => handleJoinStream(stream.callId)}
              >
                <div className="relative bg-gradient-to-br from-[var(--spiritual-green)]/20 to-black border border-[var(--spiritual-green)]/30 rounded-xl p-6 h-full hover:border-[var(--spiritual-green)]/60 transition-all duration-300 hover:shadow-lg hover:shadow-[var(--spiritual-green)]/20">
                  {/* Live Badge */}
                  <div className="absolute top-4 right-4">
                    <div className="flex items-center gap-2 bg-red-600 text-white px-3 py-1 rounded-full text-sm font-semibold">
                      <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
                      LIVE
                    </div>
                  </div>

                  {/* Icon */}
                  <div className="w-16 h-16 bg-[var(--spiritual-green)]/20 rounded-lg flex items-center justify-center mb-4 group-hover:bg-[var(--spiritual-green)]/30 transition-colors">
                    <Video className="w-8 h-8 text-[var(--spiritual-green)]" />
                  </div>

                  {/* Content */}
                  <h3 className="text-xl font-bold text-white mb-2">
                    Sacred Ritual
                  </h3>
                  <p className="text-gray-400 text-sm mb-4">
                    Priest ID: {stream.priestId.slice(0, 8)}...
                  </p>

                  {/* Join Button */}
                  <button className="w-full mt-6 bg-[var(--spiritual-green)] text-black font-semibold py-2 rounded-lg hover:bg-[var(--spiritual-green)]/90 transition-colors">
                    Join Stream
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
