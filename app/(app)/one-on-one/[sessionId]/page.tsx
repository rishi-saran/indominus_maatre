// /app/(app)/one-on-one/[sessionId]/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { StreamVideoClient } from "@stream-io/video-client";
import {
    StreamVideo,
    StreamCall,
    SpeakerLayout,
} from "@stream-io/video-react-sdk";

import {
    Mic,
    MicOff,
    Video,
    VideoOff,
    PhoneOff,
} from "lucide-react";

import "@stream-io/video-react-sdk/dist/css/styles.css";

export default function OneOnOneCallPage() {
    const { sessionId } = useParams();
    const router = useRouter();

    const [client, setClient] = useState<any>(null);
    const [call, setCall] = useState<any>(null);

    const [mic, setMic] = useState(true);
    const [cam, setCam] = useState(true);

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

            const videoClient = new StreamVideoClient({
                apiKey: data.api_key,
                user: {
                    id: data.user_id,
                    name: data.first_name
                },
                token: data.token,
            });

            const callInstance = videoClient.call("default", data.call_id);

            await callInstance.join({ create: true });

            setClient(videoClient);
            setCall(callInstance);
        }

        joinCall();
    }, [sessionId]);

    if (!call) {
        return (
            <div className="flex items-center justify-center h-screen text-xl">
                Joining session...
            </div>
        );
    }

    async function toggleMic() {
        if (mic) {
            await call.microphone.disable();
        } else {
            await call.microphone.enable();
        }
        setMic(!mic);
    }

    async function toggleCam() {
        if (cam) {
            await call.camera.disable();
        } else {
            await call.camera.enable();
        }
        setCam(!cam);
    }

    async function leaveCall() {
        await call.leave();
        router.push("/one-on-one");
    }

    return (
        <StreamVideo client={client}>
            <StreamCall call={call}>

                <div className="h-screen w-screen flex flex-col items-center justify-center bg-gray-100">

                    {/* VIDEO AREA */}
                    <div className="w-[900px] max-w-full rounded-2xl overflow-hidden shadow-xl bg-white">

                        <SpeakerLayout />

                    </div>

                    {/* CONTROLS */}
                    <div className="flex gap-6 mt-8">

                        <button
                            onClick={toggleMic}
                            className="w-14 h-14 flex items-center justify-center rounded-full bg-gray-700 text-white hover:bg-gray-800"
                        >
                            {mic ? <Mic size={22} /> : <MicOff size={22} />}
                        </button>

                        <button
                            onClick={toggleCam}
                            className="w-14 h-14 flex items-center justify-center rounded-full bg-gray-700 text-white hover:bg-gray-800"
                        >
                            {cam ? <Video size={22} /> : <VideoOff size={22} />}
                        </button>

                        <button
                            onClick={leaveCall}
                            className="w-16 h-16 flex items-center justify-center rounded-full bg-red-600 text-white hover:bg-red-700"
                        >
                            <PhoneOff size={24} />
                        </button>

                    </div>

                </div>

            </StreamCall>
        </StreamVideo>
    );
}