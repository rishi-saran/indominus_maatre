"use client";

import { Video, Check, X, Eye } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

// Mock Data
const streamRequests = [
    { id: "STR001", priest: "Pandit Ravi", title: "Special Ganapati Homam Live", proposed_time: "Today, 4:00 PM", status: "Pending" },
    { id: "STR002", priest: "Swami Iyer", title: "Vedayana Chant Session", proposed_time: "Tomorrow, 6:00 AM", status: "Pending" },
];

const activeStreams = [
    { id: "STR003", priest: "Acharya Mishra", title: "Rudrabhishek", viewers: 124, duration: "00:45:12" },
];

export default function LiveStreamsPage() {
    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Live Stream Management</h1>
                <p className="text-gray-600 mt-1">Approve requests and monitor live sessions</p>
            </div>

            {/* Active Streams */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <Card className="col-span-full">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <span className="relative flex h-3 w-3">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
                            </span>
                            Active Streams Now
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {activeStreams.map((stream) => (
                                <div key={stream.id} className="group relative aspect-video bg-black rounded-xl overflow-hidden shadow-lg border border-gray-800">
                                    <div className="absolute inset-0 flex items-center justify-center bg-gray-900/50 group-hover:bg-gray-900/30 transition-all">
                                        <Video className="w-12 h-12 text-white/50 group-hover:text-white transition-colors" />
                                    </div>
                                    <div className="absolute top-3 left-3 flex gap-2">
                                        <span className="px-2 py-1 bg-red-600 text-white text-xs font-bold rounded flex items-center gap-1">
                                            LIVE
                                        </span>
                                        <span className="px-2 py-1 bg-black/60 text-white text-xs rounded flex items-center gap-1">
                                            <Eye className="w-3 h-3" /> {stream.viewers}
                                        </span>
                                    </div>
                                    <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/80 to-transparent">
                                        <p className="text-white font-medium text-sm truncate">{stream.title}</p>
                                        <p className="text-gray-300 text-xs">{stream.priest}</p>
                                    </div>
                                </div>
                            ))}
                            <div className="aspect-video flex items-center justify-center bg-gray-50 rounded-xl border border-dashed border-gray-200">
                                <p className="text-gray-400 text-sm">No other active streams</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Requests */}
            <h2 className="text-xl font-semibold text-gray-900 mt-8">Stream Requests</h2>
            <div className="grid grid-cols-1 gap-4">
                {streamRequests.map((req) => (
                    <Card key={req.id}>
                        <CardContent className="p-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center text-purple-600">
                                    <Video className="w-6 h-6" />
                                </div>
                                <div>
                                    <h3 className="font-semibold text-gray-900">{req.title}</h3>
                                    <p className="text-sm text-gray-600">
                                        Requested by <span className="font-medium text-gray-900">{req.priest}</span> • {req.proposed_time}
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <button className="flex items-center gap-2 px-4 py-2 bg-[#5cb85c] text-white rounded-lg font-medium hover:bg-[#4cae4c] transition-colors shadow-sm">
                                    <Check className="w-4 h-4" /> Approve
                                </button>
                                <button className="flex items-center gap-2 px-4 py-2 border border-red-200 text-red-600 bg-red-50 rounded-lg font-medium hover:bg-red-100 transition-colors">
                                    <X className="w-4 h-4" /> Reject
                                </button>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
}
