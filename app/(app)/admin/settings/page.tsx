"use client";

import { Save, UserCog, Video, Percent } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

export default function SettingsPage() {
    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Platform Settings</h1>
                <p className="text-gray-600 mt-1">Configure global platform parameters</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

                {/* Commission Settings */}
                <Card>
                    <CardHeader>
                        <div className="flex items-center gap-2">
                            <div className="p-2 bg-green-100 rounded-lg text-green-600">
                                <Percent className="w-5 h-5" />
                            </div>
                            <div>
                                <CardTitle>Commission Rates</CardTitle>
                                <CardDescription>Set percentage taken from transactions</CardDescription>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700">Platform Fee (%)</label>
                            <input type="number" defaultValue={15} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5cb85c]" />
                            <p className="text-xs text-gray-500">Applied to all service bookings automatically.</p>
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700">Priest Payout Threshold (₹)</label>
                            <input type="number" defaultValue={5000} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5cb85c]" />
                        </div>
                        <div className="pt-2">
                            <button className="px-4 py-2 bg-[#5cb85c] text-white rounded-lg font-medium hover:bg-[#4cae4c] flex items-center gap-2 shadow-sm transition-colors">
                                <Save className="w-4 h-4" /> Save Changes
                            </button>
                        </div>
                    </CardContent>
                </Card>

                {/* Streaming Config */}
                <Card>
                    <CardHeader>
                        <div className="flex items-center gap-2">
                            <div className="p-2 bg-blue-100 rounded-lg text-blue-600">
                                <Video className="w-5 h-5" />
                            </div>
                            <div>
                                <CardTitle>Streaming Configuration</CardTitle>
                                <CardDescription>Manage live stream quality and limits</CardDescription>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700">Max Stream Duration (Minutes)</label>
                            <input type="number" defaultValue={60} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5cb85c]" />
                        </div>
                        <div className="flex items-center gap-2 mt-4">
                            <input type="checkbox" id="hd-video" defaultChecked className="w-4 h-4 text-[#5cb85c] focus:ring-[#5cb85c] border-gray-300 rounded" />
                            <label htmlFor="hd-video" className="text-sm text-gray-700">Enable HD Video (720p+)</label>
                        </div>
                        <div className="flex items-center gap-2">
                            <input type="checkbox" id="recording" defaultChecked className="w-4 h-4 text-[#5cb85c] focus:ring-[#5cb85c] border-gray-300 rounded" />
                            <label htmlFor="recording" className="text-sm text-gray-700">Auto-record sessions</label>
                        </div>
                        <div className="pt-2">
                            <button className="px-4 py-2 bg-[#5cb85c] text-white rounded-lg font-medium hover:bg-[#4cae4c] flex items-center gap-2 shadow-sm transition-colors">
                                <Save className="w-4 h-4" /> Save Config
                            </button>
                        </div>
                    </CardContent>
                </Card>

                {/* Admin Management */}
                <Card className="lg:col-span-2">
                    <CardHeader>
                        <div className="flex items-center gap-2">
                            <div className="p-2 bg-purple-100 rounded-lg text-purple-600">
                                <UserCog className="w-5 h-5" />
                            </div>
                            <div>
                                <CardTitle>Admin Users</CardTitle>
                                <CardDescription>Manage access to the admin dashboard</CardDescription>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm text-left mb-4">
                                <thead className="bg-gray-50 text-gray-500 font-medium border-b border-gray-100">
                                    <tr>
                                        <th className="px-6 py-3">Name</th>
                                        <th className="px-6 py-3">Email</th>
                                        <th className="px-6 py-3">Role</th>
                                        <th className="px-6 py-3">Last Active</th>
                                        <th className="px-6 py-3 text-right">Action</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    <tr className="hover:bg-gray-50/50">
                                        <td className="px-6 py-4 font-medium text-gray-900">Admin User</td>
                                        <td className="px-6 py-4 text-gray-600">admin@maatre.com</td>
                                        <td className="px-6 py-4"><span className="bg-purple-100 text-purple-700 px-2 py-0.5 rounded text-xs font-medium">Super Admin</span></td>
                                        <td className="px-6 py-4 text-gray-500">Just now</td>
                                        <td className="px-6 py-4 text-right"><button className="text-gray-400 hover:text-gray-600">Edit</button></td>
                                    </tr>
                                </tbody>
                            </table>
                            <button className="text-[#5cb85c] font-medium text-sm hover:underline">+ Invite New Admin</button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
