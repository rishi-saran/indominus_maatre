"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { StreamVideoClient } from "@stream-io/video-client";
import {
    StreamVideo,
    StreamCall,
    SpeakerLayout,
    CallControls
} from "@stream-io/video-react-sdk";

import "@stream-io/video-react-sdk/dist/css/styles.css";

export default function OneOnOneCallPage() {
    const { sessionId } = useParams();

    const [client, setClient] = useState<any>(null);
    const [call, setCall] = useState<any>(null);

    useEffect(() => {
        async function joinCall() {
            const token = localStorage.getItem("access_token");

            const res = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL}/sessions/${sessionId}/join`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            const data = await res.json();

            if (!data.user_id) {
                console.error("Invalid join response", data);
                return;
            }

            const videoClient = new StreamVideoClient({
                apiKey: data.api_key,
                user: { id: data.user_id },
                token: data.token,
            });

            const callInstance = videoClient.call("default", data.call_id);

            await callInstance.join();

            setClient(videoClient);
            setCall(callInstance);
        }

        joinCall();
    }, [sessionId]);

    if (!call) {
        return (
            <div className="flex items-center justify-center h-screen">
                Joining session...
            </div>
        );
    }

    return (
        <StreamVideo client={client}>
            <StreamCall call={call}>
                <div className="flex flex-col h-screen bg-black">

                    {/* Video area */}
                    <div className="flex-1">
                        <SpeakerLayout />
                    </div>

                    {/* Controls */}
                    <div className="p-4 bg-gray-900">
                        <CallControls />
                    </div>

                </div>
            </StreamCall>
        </StreamVideo>
    );
}