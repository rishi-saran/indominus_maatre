"use client";

import { Card, CardContent } from "@/components/ui/card";
import {
    Users,
    Video,
    Wallet,
    Bell,
    CheckCircle2,
    AlertCircle,
    MoreHorizontal,
    Search,
    Laptop,
    Sparkles,
    ArrowUpRight
} from "lucide-react";

// Mock Data
const stats = [
    {
        label: "Total Revenue",
        value: "₹4.2L",
        subtext: "+12% vs last month",
        icon: Wallet,
        color: "bg-orange-50 border border-orange-100",
        textColor: "text-orange-700"
    },
    {
        label: "Confirmed Bookings",
        value: "85%",
        subtext: "Completion Rate",
        icon: CheckCircle2,
        color: "bg-indigo-50 border border-indigo-100",
        textColor: "text-indigo-700"
    },
    {
        label: "Active Priests",
        value: "56",
        subtext: "Currently Online",
        icon: Users,
        color: "bg-rose-50 border border-rose-100",
        textColor: "text-rose-700"
    },
    {
        label: "Total Views",
        value: "12K",
        subtext: "Live Stream Aud.",
        icon: Video,
        color: "bg-violet-50 border border-violet-100",
        textColor: "text-violet-700"
    },
];

const recentActivities = [
    {
        id: 1,
        title: "Ganapati Homam Request",
        subtitle: "Requested by Rahul Sharma • 2 mins ago",
        status: "Pending",
        thumbnailColor: "bg-orange-100",
        thumbnailIcon: Sparkles,
        iconColor: "text-orange-600"
    },
    {
        id: 2,
        title: "Commission Payout Batch",
        subtitle: "45 payments pending approval • ₹1.2L Total",
        status: "Action Required",
        thumbnailColor: "bg-emerald-100",
        thumbnailIcon: Wallet,
        iconColor: "text-emerald-600"
    },
    {
        id: 3,
        title: "Live Stream: Morning Aarti",
        subtitle: "Started by Pandit Ravi • 145 Viewers",
        status: "Live",
        thumbnailColor: "bg-rose-100",
        thumbnailIcon: Video,
        iconColor: "text-rose-600"
    },
    {
        id: 4,
        title: "New Priest Registration",
        subtitle: "Acharya Mishra • Verification Pending",
        status: "Review",
        thumbnailColor: "bg-blue-100",
        thumbnailIcon: Users,
        iconColor: "text-blue-600"
    }
];

export default function AdminDashboard() {
    const currentDate = new Date().toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long' });

    return (
        <div className="font-sans space-y-10">
            {/* Header / Top Bar */}
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-xl font-bold text-gray-800">Dashboard</h2>
                    <p className="text-sm text-gray-500">{currentDate}</p>
                </div>
            </div>

            {/* Welcome Banner */}
            <div className="relative overflow-hidden rounded-[2.5rem] bg-white p-8 md:p-12 border border-gray-100 shadow-sm transition-all duration-300 hover:shadow-[0_20px_40px_rgba(92,184,92,0.1)] hover:border-[#5cb85c]/30 group">
                <div className="relative z-10 max-w-lg">
                    <h1 className="text-4xl md:text-5xl font-black text-gray-900 tracking-tight mb-4">
                        Namaste, <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#2e7d32] to-[#5cb85c]">Admin</span>
                    </h1>
                    <p className="text-gray-500 text-lg leading-relaxed mb-8 group-hover:text-gray-700 transition-colors">
                        Ready to manage your spiritual services today? You have <span className="font-bold text-gray-900">4 pending requests</span> waiting for review.
                    </p>
                    <button className="bg-[#1a5d1a] text-white px-8 py-3 rounded-xl font-bold text-sm hover:bg-[#144414] transition-all shadow-lg hover:shadow-green-900/20 active:scale-95 flex items-center gap-2">
                        View Requests <ArrowUpRight className="w-4 h-4" />
                    </button>
                </div>

                {/* Decorative Illustration (Simulated with Shapes & Icons) */}
                <div className="absolute right-0 bottom-0 h-full w-1/2 hidden md:block pointer-events-none">
                    <div className="absolute right-12 bottom-0 w-64 h-64 transition-transform duration-500 group-hover:scale-110 group-hover:rotate-3">
                        {/* Circle Background */}
                        <div className="absolute inset-0 bg-[#5cb85c]/5 rounded-full blur-3xl"></div>
                        {/* Laptop/Person Composition */}
                        <div className="absolute bottom-0 right-10">
                            <Laptop className="w-48 h-48 text-[#5cb85c]/20 transform -scale-x-100" />
                        </div>
                        <div className="absolute bottom-12 right-24 animate-bounce duration-[3000ms]">
                            <div className="w-16 h-16 bg-white rounded-2xl shadow-xl flex items-center justify-center transform rotate-12 border border-gray-50">
                                <CheckCircle2 className="w-8 h-8 text-[#5cb85c]" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Overview / Stats Cards */}
            <div>
                <h3 className="text-lg font-bold text-gray-900 mb-6 px-1">Overview</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
                    {stats.map((stat, i) => (
                        <div key={i} className="group relative">
                            <div className={`relative h-full rounded-[2rem] bg-white p-6 shadow-sm transition-all duration-300 group-hover:shadow-lg border border-gray-100 overflow-hidden`}>

                                {/* Top Row: Label and Icon */}
                                <div className="flex items-start justify-between mb-6">
                                    <div className="pt-1">
                                        <p className="text-xs font-bold uppercase tracking-wider text-gray-400">{stat.label}</p>
                                    </div>
                                    {/* Icon Container - Now Inside */}
                                    <div className={`w-14 h-14 rounded-2xl ${stat.color} shadow-[0_8px_16px_rgb(0,0,0,0.06)] flex items-center justify-center transform transition-transform duration-500 group-hover:scale-110 group-hover:rotate-6`}>
                                        <stat.icon className={`w-7 h-7 ${stat.textColor}`} />
                                    </div>
                                </div>

                                {/* Middle: Value */}
                                <h4 className="text-4xl font-black text-gray-900 tracking-tight mb-6">{stat.value}</h4>

                                {/* Bottom: Subtext and Action */}
                                <div className="flex items-center justify-between">
                                    <div className={`inline-flex items-center px-3 py-1.5 rounded-xl ${stat.color} bg-opacity-15`}>
                                        <span className={`text-[10px] font-bold ${stat.textColor} opacity-90`}>
                                            {stat.subtext}
                                        </span>
                                    </div>
                                    <div className={`w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-4 group-hover:translate-x-0`}>
                                        <ArrowUpRight className={`w-5 h-5 ${stat.textColor}`} />
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Recent Activity Section */}
            <div>
                <div className="flex items-center justify-between mb-6 px-1">
                    <h3 className="text-lg font-bold text-gray-900">Recent Activity</h3>
                    <button className="text-xs font-bold text-violet-600 hover:text-violet-700">View All</button>
                </div>

                <div className="bg-white rounded-[2rem] shadow-sm border border-gray-100 overflow-hidden">
                    {recentActivities.map((activity, i) => (
                        <div key={activity.id} className={`p-6 flex items-center justify-between transition-colors hover:bg-gray-50 cursor-pointer ${i !== recentActivities.length - 1 ? 'border-b border-gray-100' : ''}`}>
                            <div className="flex items-center gap-6">
                                <div className={`w-16 h-16 rounded-2xl ${activity.thumbnailColor} flex items-center justify-center shrink-0`}>
                                    <activity.thumbnailIcon className={`w-8 h-8 ${activity.iconColor}`} />
                                </div>
                                <div>
                                    <h4 className="text-base font-bold text-gray-900 mb-1">{activity.title}</h4>
                                    <p className="text-sm text-gray-500 font-medium">{activity.subtitle}</p>
                                </div>
                            </div>

                            <div className="flex items-center gap-6">
                                <span className={`hidden md:inline-flex px-3 py-1 rounded-full text-xs font-bold
                                    ${activity.status === 'Pending' ? 'bg-orange-100 text-orange-700' :
                                        activity.status === 'Action Required' ? 'bg-red-100 text-red-700' :
                                            activity.status === 'Live' ? 'bg-rose-100 text-rose-700 animate-pulse' :
                                                'bg-gray-100 text-gray-700'
                                    }`}>
                                    {activity.status}
                                </span>
                                <div className="w-10 h-6 bg-gray-200 rounded-full relative transition-colors hover:bg-violet-200 cursor-pointer">
                                    <div className="absolute top-1 left-1 w-4 h-4 bg-white rounded-full shadow-sm transition-transform hover:translate-x-4"></div>
                                </div>
                                <button className="text-gray-400 hover:text-gray-600">
                                    <MoreHorizontal className="w-5 h-5" />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}