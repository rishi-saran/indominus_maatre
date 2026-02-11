"use client";

import { Calendar, CheckCircle, Clock, XCircle, MoreVertical } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

// Mock Data
const bookings = [
    { id: "BK001", customer: "Rahul Sharma", service: "Ganapati Homam", date: "Feb 11, 2024", time: "10:00 AM", priest: "Pandit Ravi", amount: "₹5,000", status: "Confirmed" },
    { id: "BK002", customer: "Priya Patel", service: "Satyanarayan Puja", date: "Feb 11, 2024", time: "2:00 PM", priest: "Acharya Mishra", amount: "₹3,500", status: "Pending" },
    { id: "BK003", customer: "Amit Kumar", service: "Griha Pravesh", date: "Feb 12, 2024", time: "9:00 AM", priest: "Swami Iyer", amount: "₹12,000", status: "Confirmed" },
    { id: "BK004", customer: "Sneha Gupta", service: "Navagraha Shanti", date: "Feb 14, 2024", time: "11:00 AM", priest: "Pandit Ravi", amount: "₹4,500", status: "Completed" },
    { id: "BK005", customer: "Vikram Singh", service: "Vastu Puja", date: "Feb 15, 2024", time: "8:00 AM", priest: "Unassigned", amount: "₹6,000", status: "Requested" },
];

export default function BookingsPage() {
    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Booking Management</h1>
                <p className="text-gray-600 mt-1">View and manage all service bookings</p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex items-center justify-between">
                    <div>
                        <p className="text-xs text-gray-500 font-medium uppercase">Total Bookings</p>
                        <p className="text-2xl font-bold text-gray-900">1,234</p>
                    </div>
                    <div className="p-3 bg-blue-50 text-blue-600 rounded-lg">
                        <Calendar className="w-5 h-5" />
                    </div>
                </div>
                <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex items-center justify-between">
                    <div>
                        <p className="text-xs text-gray-500 font-medium uppercase">Pending</p>
                        <p className="text-2xl font-bold text-gray-900">12</p>
                    </div>
                    <div className="p-3 bg-yellow-50 text-yellow-600 rounded-lg">
                        <Clock className="w-5 h-5" />
                    </div>
                </div>
                <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex items-center justify-between">
                    <div>
                        <p className="text-xs text-gray-500 font-medium uppercase">Confirmed</p>
                        <p className="text-2xl font-bold text-gray-900">45</p>
                    </div>
                    <div className="p-3 bg-green-50 text-green-600 rounded-lg">
                        <CheckCircle className="w-5 h-5" />
                    </div>
                </div>
                <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex items-center justify-between">
                    <div>
                        <p className="text-xs text-gray-500 font-medium uppercase">Cancelled</p>
                        <p className="text-2xl font-bold text-gray-900">3</p>
                    </div>
                    <div className="p-3 bg-red-50 text-red-600 rounded-lg">
                        <XCircle className="w-5 h-5" />
                    </div>
                </div>
            </div>

            <Card>
                <CardHeader className="border-b border-gray-100 bg-gray-50/50 pb-4">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <CardTitle>All Bookings</CardTitle>
                        <div className="flex gap-2">
                            <input
                                type="text"
                                placeholder="Search booking ID..."
                                className="px-3 py-2 border border-gray-200 rounded-lg text-sm w-full md:w-64 focus:outline-none focus:ring-2 focus:ring-[#5cb85c]"
                            />
                            <select className="px-3 py-2 border border-gray-200 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#5cb85c]">
                                <option>All Status</option>
                                <option>Confirmed</option>
                                <option>Pending</option>
                                <option>Completed</option>
                            </select>
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="p-0">
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left">
                            <thead className="bg-gray-50 text-gray-500 font-medium border-b border-gray-100">
                                <tr>
                                    <th className="px-6 py-3">Booking ID</th>
                                    <th className="px-6 py-3">Customer</th>
                                    <th className="px-6 py-3">Service</th>
                                    <th className="px-6 py-3">Schedule</th>
                                    <th className="px-6 py-3">Priest</th>
                                    <th className="px-6 py-3">Amount</th>
                                    <th className="px-6 py-3">Status</th>
                                    <th className="px-6 py-3 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {bookings.map((booking) => (
                                    <tr key={booking.id} className="hover:bg-gray-50/50 transition-colors">
                                        <td className="px-6 py-4 font-mono text-gray-600">{booking.id}</td>
                                        <td className="px-6 py-4 font-medium text-gray-900">{booking.customer}</td>
                                        <td className="px-6 py-4 text-gray-600">{booking.service}</td>
                                        <td className="px-6 py-4">
                                            <div className="text-gray-900">{booking.date}</div>
                                            <div className="text-xs text-gray-500">{booking.time}</div>
                                        </td>
                                        <td className="px-6 py-4">
                                            {booking.priest === "Unassigned" ? (
                                                <span className="text-red-500 text-xs italic">Unassigned</span>
                                            ) : (
                                                <span className="text-gray-900">{booking.priest}</span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 font-medium text-gray-900">{booking.amount}</td>
                                        <td className="px-6 py-4">
                                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                        ${booking.status === 'Confirmed' ? 'bg-green-100 text-green-700' :
                                                    booking.status === 'Pending' ? 'bg-yellow-100 text-yellow-700' :
                                                        booking.status === 'Completed' ? 'bg-blue-100 text-blue-700' :
                                                            'bg-gray-100 text-gray-700'}`}>
                                                {booking.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <button className="p-1 hover:bg-gray-100 rounded text-gray-400 hover:text-gray-600">
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
        </div>
    );
}
