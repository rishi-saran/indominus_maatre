"use client";

import React, { useState } from "react";
import { Video, Check, X, Eye, Power, Wifi, Users, Clock } from "lucide-react";
import { toast } from "sonner";

type Request = {
    id: string;
    priest: string;
    title: string;
    proposed_time: string;
};

type Active = {
    id: string;
    priest: string;
    title: string;
    viewers: number;
    duration?: string;
    price?: number;
};

const initialRequests: Request[] = [
    { id: "STR001", priest: "Pandit Ravi", title: "Special Ganapati Homam Live", proposed_time: "Today, 4:00 PM" },
    { id: "STR002", priest: "Swami Iyer", title: "Vedayana Chant Session", proposed_time: "Tomorrow, 6:00 AM" },
];

const initialActive: Active[] = [
    { id: "STR003", priest: "Acharya Mishra", title: "Rudrabhishek Live", viewers: 124, duration: "00:45:12", price: 124 },
];

export default function LiveStreamsPage() {
    const [requests, setRequests] = useState<Request[]>(initialRequests);
    const [active, setActive] = useState<Active[]>(initialActive);
    const [watching, setWatching] = useState<Active | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [activity, setActivity] = useState<string[]>([]);

    function approveRequest(id: string) {
        const req = requests.find((r) => r.id === id);
        if (!req) return;
        setRequests((prev) => prev.filter((r) => r.id !== id));
        const newActive: Active = {
            id: `A-${id}`,
            priest: req.priest,
            title: req.title,
            viewers: Math.floor(Math.random() * 100) + 20,
            duration: "00:00:00",
            price: Math.floor(Math.random() * 200) + 50,
        };
        setActive((prev) => [newActive, ...prev]);
        setActivity((a) => [`Approved ${req.title} by ${req.priest}`, ...a]);
        toast.success("Request approved and moved to Active Streams");
    }

    function rejectRequest(id: string) {
        const req = requests.find((r) => r.id === id);
        setRequests((prev) => prev.filter((r) => r.id !== id));
        if (req) setActivity((a) => [`Rejected ${req.title} by ${req.priest}`, ...a]);
        toast.error("Request rejected");
    }

    function watchStream(s: Active) {
        setWatching(s);
        setIsModalOpen(true);
        toast("Opening player (dummy)");
    }

    function endStream(id: string) {
        const s = active.find((x) => x.id === id);
        setActive((prev) => prev.filter((x) => x.id !== id));
        if (watching?.id === id) {
            setIsModalOpen(false);
            setWatching(null);
        }
        if (s) setActivity((a) => [`Ended ${s.title}`, ...a]);
        toast.success("Stream ended");
    }

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-extrabold text-[#1b5e20]">Live Stream Management</h1>
                <p className="text-sm text-[#2b6b2b]/80 mt-1">Approve requests and monitor live sessions.</p>
            </div>

            {/* Active Streams */}
            <div>
                <h3 className="text-lg font-semibold text-[#2b6b2b] flex items-center gap-2"> 
                    <span className="w-2 h-2 rounded-full bg-red-500 inline-block" /> Active Streams Now
                </h3>

                <div className="mt-4">
                    {active.length === 0 ? (
                        <div className="bg-white rounded-3xl p-6 shadow text-center">No active streams</div>
                    ) : (
                        <div className="flex flex-wrap items-start gap-8">
                            {active.map((s) => (
                                <div key={s.id} className="bg-white rounded-[18px] border border-[#e6e6e6] p-6 w-full sm:w-[45%] lg:w-[460px] flex-shrink-0 relative text-gray-900 h-48 flex flex-col justify-between shadow-sm">
                                    <div className="absolute top-4 left-4">
                                        <span className="bg-red-600 px-3 py-1 rounded-full text-xs font-bold text-white">LIVE</span>
                                    </div>
                                    <div className="absolute top-4 right-4">
                                        <span className="bg-black/80 px-3 py-1 rounded-full text-xs flex items-center gap-2 text-white"><Eye className="w-3 h-3" /> {s.viewers}</span>
                                    </div>
                                    <div className="text-lg font-semibold">{s.title}</div>
                                    <div className="text-sm text-gray-500 mt-1">{s.priest}</div>
                                    <div className="flex items-center gap-4 mt-4">
                                        <button onClick={() => watchStream(s)} className="bg-gray-200 hover:bg-gray-300 text-gray-900 px-6 py-2 rounded-full inline-flex items-center gap-2 font-semibold"> <Eye className="w-4 h-4"/> Watch</button>
                                        <button onClick={() => endStream(s.id)} className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-full inline-flex items-center gap-2 font-semibold"> <Power className="w-4 h-4"/> End Stream</button>
                                        <div className="ml-auto bg-[#fff5d7] text-[#2b2b00] px-3 py-1 rounded-full font-bold">₹{s.price}</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Stream Requests */}
            <div>
                <h3 className="text-lg font-semibold text-[#2b6b2b] mt-6">Stream Requests</h3>
                <div className="mt-4 space-y-4">
                    {requests.length === 0 && <div className="text-sm text-gray-500">No pending requests.</div>}
                    {requests.map((r) => (
                        <div key={r.id} className="bg-white rounded-[18px] px-4 py-3 flex items-center justify-between border border-[#f4efe8] shadow-sm">
                            <div className="flex items-center gap-4">
                                <div className="w-14 h-14 rounded-xl bg-[#f6fff5] flex items-center justify-center text-[#1b8a3e]">
                                    <Wifi className="w-5 h-5" />
                                </div>
                                <div>
                                    <div className="font-semibold text-[#1b5e20]">{r.title}</div>
                                    <div className="text-xs text-gray-400">Requested by <span className="font-medium text-gray-800">{r.priest}</span></div>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="text-xs text-gray-400 mr-2">{r.proposed_time}</div>
                                <button onClick={() => approveRequest(r.id)} className="inline-flex items-center gap-2 bg-[#1b8a3e] hover:bg-[#187737] text-white px-4 py-2 rounded-full font-semibold">
                                    <Check className="w-4 h-4" /> Approve
                                </button>
                                <button onClick={() => rejectRequest(r.id)} className="inline-flex items-center gap-2 border border-[#f5d1d1] text-[#b91c1c] px-3 py-2 rounded-full font-semibold bg-white/90">
                                    <X className="w-4 h-4" /> Reject
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>



            {/* Watch Modal */}
            {isModalOpen && watching && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-6">
                    <div className="bg-white rounded-3xl w-full max-w-3xl p-6 relative">
                        <button className="absolute right-4 top-4 p-2 text-gray-600" onClick={() => {setIsModalOpen(false); setWatching(null);}}>Close</button>
                        <div className="flex items-center gap-4 mb-4">
                            <div className="w-12 h-12 rounded-lg bg-neutral-900 flex items-center justify-center text-white font-bold">LIVE</div>
                            <div>
                                <div className="font-semibold text-lg">{watching.title}</div>
                                <div className="text-sm text-gray-500">Hosted by {watching.priest}</div>
                            </div>
                        </div>
                        <div className="aspect-video bg-black rounded-md flex items-center justify-center text-white">
                            <div className="text-center">
                                <div className="text-2xl font-bold">Video Player (dummy)</div>
                                <div className="text-sm text-gray-300 mt-2">This is a placeholder for the live stream player.</div>
                            </div>
                        </div>
                        <div className="mt-4 flex items-center gap-2">
                            <button className="bg-[#1b8a3e] text-white px-4 py-2 rounded-lg" onClick={() => toast.success("Pinned to featured (dummy)")}>Feature</button>
                            <button className="bg-red-600 text-white px-4 py-2 rounded-lg" onClick={() => {endStream(watching.id); setIsModalOpen(false); setWatching(null);}}>End Stream</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
