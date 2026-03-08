// /app/(app)/one-on-one/page.tsx
"use client";

import { useState } from "react";

export default function RequestSessionPage() {
    const [startTime, setStartTime] = useState("");
    const [endTime, setEndTime] = useState("");
    const [message, setMessage] = useState("");

    async function requestSession() {
        const token = localStorage.getItem("access_token");

        const res = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/sessions/request-session`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    start_time: startTime,
                    end_time: endTime,
                }),
            }
        );

        if (!res.ok) {
            setMessage("Failed to request session");
            return;
        }

        setMessage("Session request submitted!");
    }

    return (
        <div className="max-w-xl mx-auto p-8">
            <h1 className="text-2xl font-bold mb-6">Request 1-on-1 Video Call</h1>

            <label className="block mb-2 font-medium">Start Time</label>
            <input
                type="datetime-local"
                className="w-full border rounded p-2 mb-4"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
            />

            <label className="block mb-2 font-medium">End Time</label>
            <input
                type="datetime-local"
                className="w-full border rounded p-2 mb-4"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
            />

            <button
                onClick={requestSession}
                className="bg-green-600 text-white px-6 py-2 rounded"
            >
                Request Session
            </button>

            {message && (
                <p className="mt-4 text-green-700 font-semibold">{message}</p>
            )}
        </div>
    );
}