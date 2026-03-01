"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { getUserWithRole } from "@/lib/stream/auth/getUserWithRole";
import { createVideoClient } from "@/lib/stream/stream/videoClient";

import {
    StreamVideo,
    StreamCall,
    SpeakerLayout,
    CallControls,
} from "@stream-io/video-react-sdk";

import "@stream-io/video-react-sdk/dist/css/styles.css";

export default function OneOnOneCallPage() {
    const params = useParams();
    const streamId = params.streamId as string;

    const [client, setClient] = useState<any>(null);
    const [call, setCall] = useState<any>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        async function init() {
            try {
                const user = await getUserWithRole();
                if (!user) {
                    setError("User not authenticated");
                    return;
                }

                const res = await fetch("/api/stream/token");
                if (!res.ok) throw new Error("Token fetch failed");

                const { token } = await res.json();

                const videoClient = createVideoClient(user.id, token);
                const callInstance = videoClient.call("default", streamId);

                await callInstance.join();

                setClient(videoClient);
                setCall(callInstance);
            } catch (err: any) {
                console.error(err);
                setError(err.message || "Failed to join call");
            }
        }

        if (streamId) init();
    }, [streamId]);

    if (error) {
        return (
            <div className="h-screen flex items-center justify-center">
                <p className="text-red-600">{error}</p>
            </div>
        );
    }

    if (!client || !call) {
        return (
            <div className="h-screen flex items-center justify-center">
                <p>Joining call…</p>
            </div>
        );
    }

    return (
        <StreamVideo client={client}>
            <StreamCall call={call}>
                <div style={{ height: "100vh" }}>
                    <SpeakerLayout />
                    <CallControls />
                </div>
            </StreamCall>
        </StreamVideo>
    );
}