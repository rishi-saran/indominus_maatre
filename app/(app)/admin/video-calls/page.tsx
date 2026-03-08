// /app/(app)/admin/video-calls/page.tsx
"use client";

import { useEffect, useState } from "react";

interface Session {
    id: string
    stream_id?: string
    customer_id: string
    priest_id?: string
    start_time: string
    end_time: string
    status: string
}

export default function AdminVideoCallsPage() {
    const [sessions, setSessions] = useState<Session[]>([]);

    async function loadSessions() {
        const token = localStorage.getItem("access_token");

        const res = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/sessions/list-all`,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );

        const data = await res.json();
        console.log("Sessions from API:", data.items)
        setSessions(data.items || []);
    }

    async function approveSession(sessionId: string) {
        const token = localStorage.getItem("access_token")

        const res = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/sessions/${sessionId}`,
            {
                method: "PUT",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        )

        if (!res.ok) {
            console.error("Approval failed")
        }

        loadSessions()
    }

    useEffect(() => {
        loadSessions();
    }, []);

    return (
        <div className="max-w-5xl mx-auto p-8">
            <h1 className="text-3xl font-bold mb-6 text-[#1a5d1a]">
                Video Call Requests
            </h1>

            <div className="space-y-4">
                {sessions.map((s) => (
                    <div
                        key={s.id}
                        className="p-4 bg-white border rounded-xl flex justify-between items-center"
                    >
                        <div>
                            <p className="font-semibold">Session ID: {s.id}</p>

                            <p className="text-sm text-gray-600">
                                {new Date(s.start_time).toLocaleString()} →
                                {new Date(s.end_time).toLocaleString()}
                            </p>

                            <p className="text-sm">Status: {s.status}</p>
                        </div>

                        {s.status === "requested" && (
                            <button
                                onClick={() => approveSession(s.id)}
                                className="bg-green-600 text-white px-4 py-2 rounded"
                            >
                                Approve
                            </button>
                        )}
                        {s.stream_id && (
                            <a
                                href={`/one-on-one/${s.id}`}
                                className="bg-blue-600 text-white px-4 py-2 rounded ml-2"
                            >
                                Join
                            </a>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}