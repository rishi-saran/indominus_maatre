"use client";

import { useState } from "react";
import Link from "next/link";

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
    ArrowUpRight,
    ChevronDown,
    Check
} from "lucide-react";


import { useEffect } from "react";

function getAdminToken() {
    if (typeof window !== "undefined") {
        return localStorage.getItem("adminToken") || "";
    }
    return "";
}
    import { ApiService } from '@/lib/services/api.service';




export default function AdminDashboard() {
    const currentDate = new Date().toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long' });

    const [stats, setStats] = useState<any[]>([]);
    const [activities, setActivities] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        async function fetchDashboardData() {
            setLoading(true);
            setError(null);
            try {
                const headers = await ApiService.getAuthHeaders();
                const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

                const [revenueRes, bookingsRes, priestsRes, streamsRes, activityRes] = await Promise.all([
                    fetch(`${BASE_URL}/admin/dashboard/revenue`, { headers }),
                    fetch(`${BASE_URL}/admin/dashboard/bookings`, { headers }),
                    fetch(`${BASE_URL}/admin/dashboard/priests`, { headers }),
                    fetch(`${BASE_URL}/admin/dashboard/live_streams`, { headers }),
                    fetch(`${BASE_URL}/admin/dashboard/activity`, { headers })
                ]);

                if (!revenueRes.ok || !bookingsRes.ok || !priestsRes.ok || !streamsRes.ok || !activityRes.ok) {
                    throw new Error('Failed to fetch dashboard data');
                }

                const revenue = await revenueRes.json();
                const bookings = await bookingsRes.json();
                const priests = await priestsRes.json();
                const streams = await streamsRes.json();
                const activity = await activityRes.json();

                setStats([
                    {
                        label: 'Total Revenue',
                        value: revenue.current_month,
                        subtext: revenue.comparison_text,
                        icon: Wallet,
                        color: 'bg-orange-50 border border-orange-100',
                        textColor: 'text-orange-700'
                    },
                    {
                        label: 'Confirmed Bookings',
                        value: bookings.completion_rate,
                        subtext: 'Completion Rate',
                        icon: CheckCircle2,
                        color: 'bg-indigo-50 border border-indigo-100',
                        textColor: 'text-indigo-700'
                    },
                    {
                        label: 'Active Priests',
                        value: priests.active_count,
                        subtext: 'Currently Online',
                        icon: Users,
                        color: 'bg-rose-50 border border-rose-100',
                        textColor: 'text-rose-700'
                    },
                    {
                        label: 'Total Views',
                        value: streams.total_views,
                        subtext: 'Live Stream Aud.',
                        icon: Video,
                        color: 'bg-violet-50 border border-violet-100',
                        textColor: 'text-violet-700'
                    }
                ]);
                setActivities(activity.items || []);
            } catch (e: any) {
                setError(e.message || 'Failed to load dashboard');
            } finally {
                setLoading(false);
            }
        }
        fetchDashboardData();
    }, []);

    const [openMenuId, setOpenMenuId] = useState<number | null>(null);

    const toggleMenu = (id: number, e: React.MouseEvent) => {
        e.stopPropagation();
        setOpenMenuId(openMenuId === id ? null : id);
    };

    const [selectedActivity, setSelectedActivity] = useState<any>(null);
    const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isStatusDropdownOpen, setIsStatusDropdownOpen] = useState(false);

    const handleViewDetails = (activity: any) => {
        setSelectedActivity(activity);
        setIsDetailModalOpen(true);
        setOpenMenuId(null);
    };

    const handleEdit = (activity: any) => {
        setSelectedActivity(activity);
        setIsEditModalOpen(true);
        setOpenMenuId(null);
    };

    const handleSaveEdit = (e: React.FormEvent) => {
        e.preventDefault();
        setActivities(activities.map(a =>
            a.id === selectedActivity.id ? selectedActivity : a
        ));
        setIsEditModalOpen(false);
        setSelectedActivity(null);
    };

    const handleActionRequired = () => {
        if (selectedActivity) {
            const updated = { ...selectedActivity, status: "Action Required" };
            setActivities(activities.map(a => a.id === selectedActivity.id ? updated : a));
            setSelectedActivity(updated);
        }
    };

    if (loading) {
        return <div className="text-center py-20 text-gray-500">Loading dashboard...</div>;
    }
    if (error) {
        return <div className="text-center py-20 text-red-500">{error}</div>;
    }
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
                    <Link href="/admin/bookings">
                        <button className="bg-[#1a5d1a] text-white px-8 py-3 rounded-xl font-bold text-sm hover:bg-[#144414] transition-all shadow-lg hover:shadow-green-900/20 active:scale-95 flex items-center gap-2">
                            View Requests <ArrowUpRight className="w-4 h-4" />
                        </button>
                    </Link>
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
                                <div className="flex items-start justify-between mb-6">
                                    <div className="pt-1">
                                        <p className="text-xs font-bold uppercase tracking-wider text-gray-400">{stat.label}</p>
                                    </div>
                                    <div className={`w-14 h-14 rounded-2xl ${stat.color} shadow-[0_8px_16px_rgb(0,0,0,0.06)] flex items-center justify-center transform transition-transform duration-500 group-hover:scale-110 group-hover:rotate-6`}>
                                        <stat.icon className={`w-7 h-7 ${stat.textColor}`} />
                                    </div>
                                </div>
                                <h4 className="text-4xl font-black text-gray-900 tracking-tight mb-6">{stat.value}</h4>
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

                <div className="bg-white rounded-[2rem] shadow-sm border border-gray-100">
                    {activities.length === 0 ? (
                        <div className="text-center text-gray-400 py-12">No recent activity found.</div>
                    ) : (
                        activities.map((activity: any, i: number) => (
                            <div
                                key={activity.id || i}
                                className={`p-6 flex items-center justify-between transition-colors hover:bg-gray-50 cursor-pointer ${i === 0 ? 'rounded-t-[2rem]' : ''} ${i === activities.length - 1 ? 'rounded-b-[2rem]' : 'border-b border-gray-100'}`}
                            >
                                <div className="flex items-center gap-6">
                                    <div className={`w-16 h-16 rounded-2xl bg-gray-100 flex items-center justify-center shrink-0`}>
                                        <span className="text-2xl">📝</span>
                                    </div>
                                    <div>
                                        <h4 className="text-base font-bold text-gray-900 mb-1">{activity.title || activity.type}</h4>
                                        <p className="text-sm text-gray-500 font-medium">{activity.subtitle || activity.description}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-6">
                                    <span className="hidden md:inline-flex px-3 py-1 rounded-full text-xs font-bold bg-gray-100 text-gray-700">
                                        {activity.status || activity.type}
                                    </span>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>

            {/* View Details Modal */}
            {isDetailModalOpen && selectedActivity && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-black/20 backdrop-blur-sm" onClick={() => setIsDetailModalOpen(false)}></div>
                    <div className="relative bg-white rounded-[2rem] w-full max-w-md overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-300">
                        <div className="p-6">
                            <div className="flex justify-between items-start mb-6">
                                <h3 className="text-xl font-black text-gray-900">Activity Details</h3>
                                <button onClick={() => setIsDetailModalOpen(false)} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                                    <span className="text-gray-400 font-bold">✕</span>
                                </button>
                            </div>

                            <div className="space-y-6">
                                <div className="flex items-center gap-4">
                                    <div className={`w-16 h-16 rounded-2xl ${selectedActivity.thumbnailColor} flex items-center justify-center`}>
                                        <selectedActivity.thumbnailIcon className={`w-8 h-8 ${selectedActivity.iconColor}`} />
                                    </div>
                                    <div>
                                        <h4 className="text-lg font-bold text-gray-900">{selectedActivity.serviceName}</h4>
                                        <span className={`inline-flex px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider mt-1
                                            ${selectedActivity.status === 'Pending' ? 'bg-orange-100 text-orange-700' :
                                                selectedActivity.status === 'Action Required' ? 'bg-red-100 text-red-700' :
                                                    selectedActivity.status === 'Live' ? 'bg-rose-100 text-rose-700' :
                                                        selectedActivity.status === 'Completed' ? 'bg-blue-50 text-blue-700' :
                                                            'bg-gray-100 text-gray-700'
                                            }`}>
                                            {selectedActivity.status}
                                        </span>
                                    </div>
                                </div>

                                <div className="space-y-4 bg-gray-50 p-4 rounded-2xl">
                                    <div>
                                        <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">User Name</p>
                                        <p className="text-sm font-medium text-gray-900">{selectedActivity.userName}</p>
                                    </div>
                                    <div>
                                        <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Service Name</p>
                                        <p className="text-sm font-medium text-gray-900">{selectedActivity.serviceName}</p>
                                    </div>
                                    <div>
                                        <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Request Date</p>
                                        <p className="text-sm font-medium text-gray-900">{selectedActivity.requestDate}</p>
                                    </div>
                                    <div>
                                        <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Description</p>
                                        <p className="text-sm font-medium text-gray-700">{selectedActivity.description}</p>
                                    </div>
                                    <div>
                                        <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Status</p>
                                        <p className="text-sm font-medium text-gray-700">{selectedActivity.status}</p>
                                    </div>
                                </div>

                                <div className="flex gap-3">
                                    <button onClick={() => setIsDetailModalOpen(false)} className="flex-1 py-3 text-sm font-bold text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors">
                                        Close
                                    </button>
                                    <button
                                        onClick={handleActionRequired}
                                        className="flex-1 py-3 text-sm font-bold text-white bg-amber-600 hover:bg-amber-700 rounded-xl transition-colors shadow-lg shadow-amber-900/10"
                                    >
                                        Mark as Action Required
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Edit Modal */}
            {isEditModalOpen && selectedActivity && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-black/20 backdrop-blur-sm" onClick={() => setIsEditModalOpen(false)}></div>
                    <div className="relative bg-white rounded-[2rem] w-full max-w-md shadow-2xl animate-in fade-in zoom-in-95 duration-300">
                        <div className="p-6">
                            <h3 className="text-xl font-black text-gray-900 mb-6">Edit Activity</h3>

                            <form onSubmit={handleSaveEdit} className="space-y-4">
                                <div>
                                    <label className="text-xs font-bold text-gray-400 uppercase tracking-wider block mb-2">Title</label>
                                    <input
                                        type="text"
                                        value={selectedActivity.title}
                                        onChange={(e) => setSelectedActivity({ ...selectedActivity, title: e.target.value })}
                                        className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 font-bold text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#1a5d1a]/20"
                                    />
                                </div>

                                <div>
                                    <label className="text-xs font-bold text-gray-400 uppercase tracking-wider block mb-2">Status</label>
                                    <div className="relative">
                                        <button
                                            type="button"
                                            onClick={() => setIsStatusDropdownOpen(!isStatusDropdownOpen)}
                                            className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 font-bold text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#1a5d1a]/20 transition-all flex items-center justify-between"
                                        >
                                            {selectedActivity.status}
                                            <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform duration-300 ${isStatusDropdownOpen ? 'rotate-180' : ''}`} />
                                        </button>

                                        {isStatusDropdownOpen && (
                                            <>
                                                <div className="fixed inset-0 z-10" onClick={() => setIsStatusDropdownOpen(false)} />
                                                <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-100 rounded-xl shadow-xl z-20 overflow-hidden animate-in fade-in zoom-in-95 duration-200 p-1">
                                                    {["Pending", "Action Required", "Live", "Review", "Completed"].map((option) => (
                                                        <button
                                                            key={option}
                                                            type="button"
                                                            onClick={() => {
                                                                setSelectedActivity({ ...selectedActivity, status: option });
                                                                setIsStatusDropdownOpen(false);
                                                            }}
                                                            className={`w-full text-left px-3 py-2.5 rounded-lg text-sm font-bold transition-colors flex items-center justify-between group
                                                                ${selectedActivity.status === option ? 'bg-[#1a5d1a]/10 text-[#1a5d1a]' : 'text-gray-600 hover:bg-gray-50'}`}
                                                        >
                                                            {option}
                                                            {selectedActivity.status === option && <Check className="w-4 h-4" />}
                                                        </button>
                                                    ))}
                                                </div>
                                            </>
                                        )}
                                    </div>
                                </div>

                                <div className="flex gap-3 pt-4">
                                    <button
                                        type="button"
                                        onClick={() => setIsEditModalOpen(false)}
                                        className="flex-1 py-3 text-sm font-bold text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className="flex-1 py-3 text-sm font-bold text-white bg-[#1a5d1a] hover:bg-[#144414] rounded-xl transition-colors shadow-lg shadow-green-900/10"
                                    >
                                        Save Changes
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}