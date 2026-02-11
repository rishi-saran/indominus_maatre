"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
    Users,
    Video,
    CalendarCheck, // Updated
    Wallet, // Updated
    TrendingUp,
    TrendingDown,
    ChevronRight, // Updated
    MoreVertical,
    Clock,
    Bell,
    ArrowUpRight,
    Search,
    Filter,
    DollarSign
} from "lucide-react";

// Mock Data
const stats = [
    {
        label: "Total Revenue",
        value: "₹4,20,500",
        change: "+12.5%",
        trend: "up",
        icon: Wallet,
        gradient: "from-emerald-500 to-teal-400",
        bg: "bg-emerald-500/10",
        text: "text-emerald-600"
    },
    {
        label: "Total Bookings",
        value: "1,234",
        change: "+8.2%",
        trend: "up",
        icon: CalendarCheck,
        gradient: "from-blue-500 to-indigo-400",
        bg: "bg-blue-500/10",
        text: "text-blue-600"
    },
    {
        label: "Active Priests",
        value: "56",
        change: "3 new this week",
        trend: "up",
        icon: Users,
        gradient: "from-violet-500 to-purple-400",
        bg: "bg-violet-500/10",
        text: "text-violet-600"
    },
    {
        label: "Live Streams",
        value: "12",
        change: "2 active now",
        trend: "down",
        icon: Video,
        gradient: "from-pink-500 to-rose-400",
        bg: "bg-pink-500/10",
        text: "text-pink-600"
    },
];

const recentBookings = [
    { id: "BK001", customer: "Rahul Sharma", service: "Ganapati Homam", date: "Today", time: "10:00 AM", amount: "₹5,000", status: "Confirmed", avatar: "RS", color: "bg-blue-100 text-blue-700" },
    { id: "BK002", customer: "Priya Patel", service: "Satyanarayan Puja", date: "Today", time: "2:00 PM", amount: "₹3,500", status: "Pending", avatar: "PP", color: "bg-purple-100 text-purple-700" },
    { id: "BK003", customer: "Amit Kumar", service: "Griha Pravesh", date: "Tomorrow", time: "9:00 AM", amount: "₹12,000", status: "Confirmed", avatar: "AK", color: "bg-emerald-100 text-emerald-700" },
    { id: "BK004", customer: "Sneha Gupta", service: "Navagraha Shanti", date: "Feb 14", time: "11:00 AM", amount: "₹4,500", status: "Completed", avatar: "SG", color: "bg-amber-100 text-amber-700" },
];

const liveChannels = [
    { id: "ST001", priest: "Pandit Ravi", title: "Morning Aarti Special", viewers: 145, status: "Live", thumbnail: "bg-orange-100" },
    { id: "ST002", priest: "Acharya Mishra", title: "Rudrabhishek Pooja", viewers: 89, status: "Live", thumbnail: "bg-blue-100" },
    { id: "ST003", priest: "Swami Iyer", title: "Vedayana Chanting", viewers: 0, status: "Scheduled", time: "5:00 PM", thumbnail: "bg-yellow-100" },
];

export default function AdminDashboard() {
    const currentDate = new Date().toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

    return (
        <div className="space-y-8 font-sans">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div>
                    <div className="flex items-center gap-2 mb-1">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-white/40 border border-white/50 text-gray-600 shadow-sm backdrop-blur-sm">
                            Admin Overview
                        </span>
                    </div>
                    <h1 className="text-4xl font-black text-gray-900 tracking-tight drop-shadow-sm">Welcome back, Admin 👋</h1>
                    <p className="text-gray-600 mt-2 font-medium flex items-center gap-2 text-lg">
                        <Clock className="w-5 h-5 text-gray-400" />
                        {currentDate}
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <div className="relative hidden md:block group">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-[#5cb85c] transition-colors" />
                        <input
                            type="text"
                            placeholder="Search anything..."
                            className="pl-10 pr-4 py-3 bg-white/40 backdrop-blur-md border border-white/50 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-[#5cb85c]/50 focus:bg-white/60 transition-all w-64 shadow-sm"
                        />
                    </div>
                    <button className="p-3 bg-white/40 backdrop-blur-md border border-white/50 rounded-2xl text-gray-600 hover:text-gray-900 hover:bg-white/60 transition-all shadow-sm relative group">
                        <Bell className="w-5 h-5" />
                        <span className="absolute top-2.5 right-3 w-2 h-2 bg-red-500 rounded-full ring-2 ring-white"></span>
                    </button>
                    <button className="px-6 py-3 bg-gray-900 text-white rounded-2xl font-bold hover:bg-gray-800 transition-all shadow-xl shadow-gray-900/20 flex items-center gap-2 hover:-translate-y-0.5 active:translate-y-0">
                        <ArrowUpRight className="w-5 h-5" /> Reports
                    </button>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat, i) => (
                    <div key={i} className="group relative bg-white/60 backdrop-blur-2xl rounded-[2rem] p-6 shadow-[0_4px_20px_rgba(0,0,0,0.02)] border border-white/50 hover:shadow-[0_15px_30px_rgba(0,0,0,0.04)] hover:-translate-y-1 transition-all duration-300 overflow-hidden">
                        {/* Background Decoration */}
                        <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${stat.gradient} opacity-[0.08] rounded-bl-full -mr-8 -mt-8 transition-transform group-hover:scale-110 duration-500`}></div>

                        <div className="flex items-start justify-between mb-6 relative">
                            <div className={`p-4 rounded-2xl bg-gradient-to-br ${stat.gradient} text-white shadow-lg shadow-${stat.text.split('-')[1]}-500/30 ring-4 ring-white/50`}>
                                <stat.icon className="w-6 h-6" />
                            </div>
                            <span className={`flex items-center text-xs font-bold px-3 py-1.5 rounded-full backdrop-blur-md ${stat.trend === 'up' ? 'text-emerald-700 bg-emerald-100/50 border border-emerald-200/50' : 'text-rose-700 bg-rose-100/50 border border-rose-200/50'
                                }`}>
                                {stat.trend === 'up' ? <TrendingUp className="w-3.5 h-3.5 mr-1.5" /> : <TrendingDown className="w-3.5 h-3.5 mr-1.5" />}
                                {stat.change}
                            </span>
                        </div>
                        <div className="relative">
                            <h3 className="text-gray-500 text-xs font-bold tracking-widest uppercase mb-1">{stat.label}</h3>
                            <p className="text-3xl font-black text-gray-900 tracking-tight group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-gray-900 group-hover:to-gray-600 transition-all">{stat.value}</p>
                        </div>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
                {/* Recent Bookings Table */}
                <div className="xl:col-span-2 space-y-6">
                    <Card className="rounded-[2rem] shadow-[0_4px_24px_rgba(0,0,0,0.02)] border-white/60 bg-white/70 backdrop-blur-2xl overflow-hidden h-full">
                        <CardHeader className="border-b border-gray-100/50 px-8 py-6 flex flex-row items-center justify-between bg-white/30">
                            <div>
                                <CardTitle className="text-xl font-bold text-gray-900">Recent Activity</CardTitle>
                                <p className="text-sm font-medium text-gray-500 mt-1">Latest confirmed bookings and requests</p>
                            </div>
                            <div className="flex gap-2">
                                <button className="p-2 text-gray-400 hover:text-gray-700 hover:bg-white/50 rounded-xl transition-all">
                                    <Filter className="w-5 h-5" />
                                </button>
                                <button className="text-xs font-bold text-[#1a5d1a] bg-[#e8f5e9] hover:bg-[#c8e6c9] px-4 py-2 rounded-xl transition-colors border border-[#a5d6a7]/50">
                                    View All
                                </button>
                            </div>
                        </CardHeader>
                        <CardContent className="p-0">
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm text-left">
                                    <thead className="bg-gray-50/50 text-gray-400 font-bold uppercase text-xs tracking-wider border-b border-gray-100/50">
                                        <tr>
                                            <th className="px-8 py-5">Customer</th>
                                            <th className="px-6 py-5">Service Details</th>
                                            <th className="px-6 py-5">Price</th>
                                            <th className="px-6 py-5">Status</th>
                                            <th className="px-6 py-5 text-right"></th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100/50">
                                        {recentBookings.map((booking, i) => (
                                            <tr key={i} className="group hover:bg-white/60 transition-colors">
                                                <td className="px-8 py-5">
                                                    <div className="flex items-center gap-4">
                                                        <div className={`w-10 h-10 rounded-2xl ${booking.color} flex items-center justify-center font-black text-xs shadow-sm ring-2 ring-white`}>
                                                            {booking.avatar}
                                                        </div>
                                                        <div>
                                                            <div className="font-bold text-gray-900 text-sm group-hover:text-[#2e7d32] transition-colors">{booking.customer}</div>
                                                            <div className="text-xs text-gray-400 font-medium">{booking.id}</div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-5">
                                                    <div className="font-semibold text-gray-700">{booking.service}</div>
                                                    <div className="text-xs text-gray-400 flex items-center gap-2 mt-0.5">
                                                        <CalendarCheck className="w-3 h-3" /> {booking.date} • {booking.time}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-5 font-black text-gray-900">{booking.amount}</td>
                                                <td className="px-6 py-5">
                                                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wide border
                            ${booking.status === 'Confirmed' ? 'bg-emerald-100/80 text-emerald-700 border-emerald-200/50 shadow-sm shadow-emerald-500/10' :
                                                            booking.status === 'Pending' ? 'bg-amber-100/80 text-amber-700 border-amber-200/50 shadow-sm shadow-amber-500/10' :
                                                                'bg-gray-100/80 text-gray-600 border-gray-200/50'}`}>
                                                        {booking.status === 'Confirmed' && <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mr-2 animate-pulse" />}
                                                        {booking.status === 'Pending' && <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mr-2" />}
                                                        {booking.status}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-5 text-right">
                                                    <button className="text-gray-300 hover:text-gray-600 p-2 rounded-xl hover:bg-gray-100/80 transition-all">
                                                        <MoreVertical className="w-5 h-5" />
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Sidebar Widgets - Stacked */}
                <div className="xl:col-span-1 space-y-8">
                    {/* Live Now Widget */}
                    <Card className="rounded-[2rem] shadow-[0_8px_40px_rgba(0,0,0,0.2)] border-0 overflow-hidden bg-[#1a1c1e] text-white relative">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-rose-500/20 rounded-full blur-[80px] -mr-16 -mt-16 pointer-events-none"></div>
                        <CardHeader className="px-8 py-6 border-b border-white/10 relative z-10">
                            <div className="flex items-center justify-between">
                                <div>
                                    <CardTitle className="text-lg font-bold flex items-center gap-2.5">
                                        Live Channels
                                        <span className="relative flex h-2.5 w-2.5">
                                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-500 opacity-75"></span>
                                            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-rose-500"></span>
                                        </span>
                                    </CardTitle>
                                    <p className="text-xs font-medium text-gray-400 mt-1 uppercase tracking-wider">Real-time sessions</p>
                                </div>
                                <button className="p-2 bg-white/10 rounded-xl hover:bg-white/20 transition-colors">
                                    <ChevronRight className="w-5 h-5 text-white" />
                                </button>
                            </div>
                        </CardHeader>
                        <CardContent className="p-0 relative z-10">
                            <div className="divide-y divide-white/5">
                                {liveChannels.map((stream, i) => (
                                    <div key={i} className="p-5 hover:bg-white/5 transition-colors cursor-pointer group">
                                        <div className="flex items-center gap-4">
                                            <div className={`w-14 h-14 rounded-2xl ${stream.thumbnail} flex items-center justify-center shrink-0 shadow-lg ring-2 ring-white/10 relative overflow-hidden`}>
                                                <Video className="w-6 h-6 text-gray-900/50 relative z-10" />
                                                {stream.status === 'Live' && <div className="absolute inset-0 bg-rose-500/10 animate-pulse"></div>}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center justify-between mb-1.5">
                                                    <p className="font-bold text-gray-100 text-sm truncate pr-2 group-hover:text-rose-400 transition-colors">{stream.priest}</p>
                                                    {stream.status === 'Live' ? (
                                                        <span className="bg-rose-500 text-white text-[9px] font-black px-1.5 py-0.5 rounded shadow-lg shadow-rose-500/40 uppercase tracking-wide">Live</span>
                                                    ) : (
                                                        <span className="bg-white/10 text-gray-400 text-[9px] font-bold px-1.5 py-0.5 rounded uppercase tracking-wide">{stream.time}</span>
                                                    )}
                                                </div>
                                                <p className="text-xs text-gray-400 truncate font-medium mb-1">{stream.title}</p>
                                                {stream.status === 'Live' && (
                                                    <div className="flex items-center gap-1.5 text-[10px] text-emerald-400 font-bold uppercase tracking-wide">
                                                        <div className="flex gap-0.5 items-end h-3">
                                                            <span className="w-0.5 h-2 bg-emerald-400 animate-[bounce_1s_infinite]"></span>
                                                            <span className="w-0.5 h-3 bg-emerald-400 animate-[bounce_1.2s_infinite]"></span>
                                                            <span className="w-0.5 h-1.5 bg-emerald-400 animate-[bounce_0.8s_infinite]"></span>
                                                        </div>
                                                        {stream.viewers} watching
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Quick Actions Card - Sleek Version */}
                    <div className="relative group overflow-hidden bg-white/80 backdrop-blur-2xl rounded-[2rem] p-8 border border-white/60 shadow-[0_8px_30px_rgba(0,0,0,0.04)] hover:shadow-[0_20px_40px_rgba(0,0,0,0.06)] transition-all duration-300">
                        <div className="absolute top-0 right-0 p-6 opacity-[0.03] group-hover:opacity-[0.08] transition-opacity duration-500 transform translate-x-4 -translate-y-4">
                            <Wallet className="w-48 h-48 text-gray-900 rotate-12" />
                        </div>

                        <div className="relative z-10 flex flex-col h-full justify-between">
                            <div>
                                <div className="flex items-center justify-between mb-6">
                                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-gray-900 to-gray-800 text-white flex items-center justify-center shadow-lg shadow-gray-900/20 group-hover:scale-110 transition-transform duration-300">
                                        <DollarSign className="w-7 h-7" />
                                    </div>
                                    <span className="flex h-3 w-3">
                                        <span className="animate-ping absolute inline-flex h-3 w-3 rounded-full bg-amber-400 opacity-75"></span>
                                        <span className="relative inline-flex rounded-full h-3 w-3 bg-amber-500"></span>
                                    </span>
                                </div>

                                <h3 className="text-xl font-bold text-gray-900 mb-2 tracking-tight">Commission Payouts</h3>
                                <p className="text-gray-500 font-medium text-sm leading-relaxed">
                                    <span className="text-gray-900 font-bold">45 payments</span> require your approval this week.
                                </p>
                            </div>

                            <div className="mt-8">
                                <button className="w-full group/btn relative overflow-hidden bg-gray-900 text-white px-6 py-4 rounded-xl text-sm font-bold shadow-xl shadow-gray-900/10 hover:shadow-gray-900/20 transition-all active:scale-[0.98]">
                                    <span className="relative z-10 flex items-center justify-center gap-2">
                                        Review & Process
                                        <ArrowUpRight className="w-4 h-4 group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5 transition-transform" />
                                    </span>
                                    <div className="absolute inset-0 bg-gradient-to-r from-gray-800 to-black opacity-0 group-hover/btn:opacity-100 transition-opacity"></div>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
