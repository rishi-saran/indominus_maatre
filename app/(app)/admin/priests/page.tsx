"use client";

import { useState } from "react";
import { UserPlus, Search, Filter, MoreVertical, Check, X } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

// Mock Data
const priests = [
    { id: "PR001", name: "Pandit Ravi", email: "ravi@example.com", phone: "+91 9876543210", location: "Mumbai", status: "Active", rating: 4.8 },
    { id: "PR002", name: "Acharya Mishra", email: "mishra@example.com", phone: "+91 9876543211", location: "Delhi", status: "Active", rating: 4.5 },
    { id: "PR003", name: "Swami Iyer", email: "iyer@example.com", phone: "+91 9876543212", location: "Chennai", status: "Inactive", rating: 4.9 },
];

const pendingPriests = [
    { id: "PR004", name: "Guru Sharma", email: "sharma@example.com", location: "Bangalore", applied: "2 days ago" },
    { id: "PR005", name: "Pandit Verma", email: "verma@example.com", location: "Pune", applied: "5 days ago" },
];

export default function PriestsPage() {
    const [activeTab, setActiveTab] = useState("all");

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Priests Management</h1>
                    <p className="text-gray-600 mt-1">Manage priests, onboarding, and profiles</p>
                </div>
                <button
                    onClick={() => setActiveTab("add")}
                    className="inline-flex items-center justify-center px-4 py-2 bg-[#5cb85c] text-white rounded-lg font-medium hover:bg-[#4cae4c] transition-colors shadow-sm"
                >
                    <UserPlus className="w-4 h-4 mr-2" />
                    Add Priest
                </button>
            </div>

            {/* Tabs */}
            <div className="flex border-b border-gray-200">
                <button
                    onClick={() => setActiveTab("all")}
                    className={`pb-3 px-4 text-sm font-medium border-b-2 transition-colors ${activeTab === "all"
                            ? "border-[#5cb85c] text-[#5cb85c]"
                            : "border-transparent text-gray-500 hover:text-gray-700"
                        }`}
                >
                    All Priests
                </button>
                <button
                    onClick={() => setActiveTab("onboarding")}
                    className={`pb-3 px-4 text-sm font-medium border-b-2 transition-colors ${activeTab === "onboarding"
                            ? "border-[#5cb85c] text-[#5cb85c]"
                            : "border-transparent text-gray-500 hover:text-gray-700"
                        }`}
                >
                    Priest Onboarding
                    <span className="ml-2 bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded-full text-xs">
                        {pendingPriests.length}
                    </span>
                </button>
                <button
                    onClick={() => setActiveTab("add")}
                    className={`pb-3 px-4 text-sm font-medium border-b-2 transition-colors ${activeTab === "add"
                            ? "border-[#5cb85c] text-[#5cb85c]"
                            : "border-transparent text-gray-500 hover:text-gray-700"
                        }`}
                >
                    Add Priest
                </button>
            </div>

            {/* Content */}
            {activeTab === "all" && (
                <Card>
                    <CardHeader className="border-b border-gray-100 bg-gray-50/50">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                            <CardTitle>Registered Priests</CardTitle>
                            <div className="flex items-center gap-2">
                                <div className="relative">
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                    <input
                                        type="text"
                                        placeholder="Search priests..."
                                        className="pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#5cb85c] focus:border-transparent w-full sm:w-64"
                                    />
                                </div>
                                <button className="p-2 border border-gray-200 rounded-lg hover:bg-gray-50 text-gray-600">
                                    <Filter className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent className="p-0">
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm text-left">
                                <thead className="bg-gray-50 text-gray-500 font-medium border-b border-gray-100">
                                    <tr>
                                        <th className="px-6 py-3">ID</th>
                                        <th className="px-6 py-3">Name</th>
                                        <th className="px-6 py-3">Contact</th>
                                        <th className="px-6 py-3">Location</th>
                                        <th className="px-6 py-3">Rating</th>
                                        <th className="px-6 py-3">Status</th>
                                        <th className="px-6 py-3 text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {priests.map((priest) => (
                                        <tr key={priest.id} className="hover:bg-gray-50/50 transition-colors">
                                            <td className="px-6 py-4 font-medium text-gray-900">{priest.id}</td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-8 h-8 rounded-full bg-[#5cb85c]/10 flex items-center justify-center text-[#5cb85c] font-bold text-xs">
                                                        {priest.name.charAt(0)}
                                                    </div>
                                                    <div>
                                                        <p className="font-medium text-gray-900">{priest.name}</p>
                                                        <p className="text-xs text-gray-500">{priest.email}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-gray-600">{priest.phone}</td>
                                            <td className="px-6 py-4 text-gray-600">{priest.location}</td>
                                            <td className="px-6 py-4 text-gray-900 font-medium">⭐ {priest.rating}</td>
                                            <td className="px-6 py-4">
                                                <span
                                                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${priest.status === "Active"
                                                            ? "bg-green-100 text-green-700"
                                                            : "bg-red-100 text-red-700"
                                                        }`}
                                                >
                                                    {priest.status}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <button className="text-gray-400 hover:text-gray-600">
                                                    <MoreVertical className="w-4 h-4" />
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </CardContent>
                </Card>
            )}

            {activeTab === "onboarding" && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {pendingPriests.map((priest) => (
                        <Card key={priest.id}>
                            <CardHeader className="pb-3">
                                <div className="flex justify-between items-start">
                                    <div className="w-12 h-12 rounded-full bg-yellow-100 flex items-center justify-center text-yellow-600 font-bold text-lg mb-2">
                                        {priest.name.charAt(0)}
                                    </div>
                                    <span className="bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded-full font-medium">
                                        Pending
                                    </span>
                                </div>
                                <CardTitle className="text-lg">{priest.name}</CardTitle>
                                <CardDescription>{priest.location}</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-2 text-sm text-gray-600 mb-6">
                                    <p>Email: {priest.email}</p>
                                    <p>Applied: {priest.applied}</p>
                                </div>
                                <div className="flex gap-2">
                                    <button className="flex-1 bg-[#5cb85c] text-white py-2 rounded-lg font-medium hover:bg-[#4cae4c] transition-colors flex items-center justify-center gap-2">
                                        <Check className="w-4 h-4" /> Approve
                                    </button>
                                    <button className="flex-1 border border-gray-200 text-gray-700 py-2 rounded-lg font-medium hover:bg-gray-50 transition-colors flex items-center justify-center gap-2">
                                        <X className="w-4 h-4" /> Reject
                                    </button>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}

            {activeTab === "add" && (
                <Card className="max-w-2xl mx-auto">
                    <CardHeader>
                        <CardTitle>Add New Priest</CardTitle>
                        <CardDescription>Enter the details to register a new priest manually.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-700">First Name</label>
                                    <input type="text" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5cb85c]" placeholder="First Name" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-700">Last Name</label>
                                    <input type="text" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5cb85c]" placeholder="Last Name" />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-700">Email Address</label>
                                <input type="email" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5cb85c]" placeholder="Email" />
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-700">Phone Number</label>
                                <input type="tel" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5cb85c]" placeholder="+91" />
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-700">Location</label>
                                <input type="text" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5cb85c]" placeholder="City, State" />
                            </div>

                            <div className="pt-4 flex justify-end gap-3">
                                <button type="button" onClick={() => setActiveTab('all')} className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50">Cancel</button>
                                <button type="button" className="px-4 py-2 bg-[#5cb85c] text-white rounded-lg hover:bg-[#4cae4c]">Create Account</button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            )}
        </div>
    );
}
