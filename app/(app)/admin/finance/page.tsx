"use client";

import { useState } from "react";
import { Download, CreditCard, Wallet, TrendingUp } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

// Mock Data
const payments = [
    { id: "TXN1001", user: "Rahul Sharma", amount: "₹5,000", date: "Feb 10, 2024", status: "Success", method: "UPI" },
    { id: "TXN1002", user: "Priya Patel", amount: "₹3,500", date: "Feb 09, 2024", status: "Success", method: "Credit Card" },
    { id: "TXN1003", user: "Amit Kumar", amount: "₹12,000", date: "Feb 09, 2024", status: "Failed", method: "Net Banking" },
];

const payouts = [
    { id: "PO881", priest: "Pandit Ravi", amount: "₹15,000", date: "Feb 01, 2024", status: "Processed" },
    { id: "PO882", priest: "Acharya Mishra", amount: "₹8,500", date: "Feb 01, 2024", status: "Processing" },
];

export default function FinancePage() {
    const [activeTab, setActiveTab] = useState("payments");

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Finance Overview</h1>
                    <p className="text-gray-600 mt-1">Track payments, commissions, and payouts</p>
                </div>
                <button className="inline-flex items-center justify-center px-4 py-2 border border-gray-300 bg-white text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors shadow-sm">
                    <Download className="w-4 h-4 mr-2" />
                    Export Report
                </button>
            </div>

            {/* Tabs */}
            <div className="flex border-b border-gray-200">
                <button
                    onClick={() => setActiveTab("payments")}
                    className={`pb-3 px-4 text-sm font-medium border-b-2 transition-colors flex items-center gap-2 ${activeTab === "payments"
                            ? "border-[#5cb85c] text-[#5cb85c]"
                            : "border-transparent text-gray-500 hover:text-gray-700"
                        }`}
                >
                    <CreditCard className="w-4 h-4" />
                    Incoming Payments
                </button>
                <button
                    onClick={() => setActiveTab("payouts")}
                    className={`pb-3 px-4 text-sm font-medium border-b-2 transition-colors flex items-center gap-2 ${activeTab === "payouts"
                            ? "border-[#5cb85c] text-[#5cb85c]"
                            : "border-transparent text-gray-500 hover:text-gray-700"
                        }`}
                >
                    <Wallet className="w-4 h-4" />
                    Priest Payouts
                </button>
                <button
                    onClick={() => setActiveTab("commission")}
                    className={`pb-3 px-4 text-sm font-medium border-b-2 transition-colors flex items-center gap-2 ${activeTab === "commission"
                            ? "border-[#5cb85c] text-[#5cb85c]"
                            : "border-transparent text-gray-500 hover:text-gray-700"
                        }`}
                >
                    <TrendingUp className="w-4 h-4" />
                    Commission Summary
                </button>
            </div>

            {activeTab === "payments" && (
                <Card>
                    <CardHeader>
                        <CardTitle>Recent Transactions</CardTitle>
                    </CardHeader>
                    <CardContent className="p-0">
                        <table className="w-full text-sm text-left">
                            <thead className="bg-gray-50 text-gray-500 font-medium">
                                <tr>
                                    <th className="px-6 py-3">Transaction ID</th>
                                    <th className="px-6 py-3">User</th>
                                    <th className="px-6 py-3">Date</th>
                                    <th className="px-6 py-3">Method</th>
                                    <th className="px-6 py-3">Amount</th>
                                    <th className="px-6 py-3">Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {payments.map((p) => (
                                    <tr key={p.id} className="hover:bg-gray-50/50">
                                        <td className="px-6 py-4 font-mono text-gray-600">{p.id}</td>
                                        <td className="px-6 py-4 font-medium text-gray-900">{p.user}</td>
                                        <td className="px-6 py-4 text-gray-500">{p.date}</td>
                                        <td className="px-6 py-4 text-gray-600">{p.method}</td>
                                        <td className="px-6 py-4 font-medium text-gray-900">{p.amount}</td>
                                        <td className="px-6 py-4">
                                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${p.status === 'Success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                                                }`}>
                                                {p.status}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </CardContent>
                </Card>
            )}

            {activeTab === "payouts" && (
                <Card>
                    <CardHeader>
                        <CardTitle>Priest Withdrawals</CardTitle>
                    </CardHeader>
                    <CardContent className="p-0">
                        <table className="w-full text-sm text-left">
                            <thead className="bg-gray-50 text-gray-500 font-medium">
                                <tr>
                                    <th className="px-6 py-3">Payout ID</th>
                                    <th className="px-6 py-3">Priest</th>
                                    <th className="px-6 py-3">Date</th>
                                    <th className="px-6 py-3">Amount</th>
                                    <th className="px-6 py-3">Status</th>
                                    <th className="px-6 py-3 text-right">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {payouts.map((p) => (
                                    <tr key={p.id} className="hover:bg-gray-50/50">
                                        <td className="px-6 py-4 font-mono text-gray-600">{p.id}</td>
                                        <td className="px-6 py-4 font-medium text-gray-900">{p.priest}</td>
                                        <td className="px-6 py-4 text-gray-500">{p.date}</td>
                                        <td className="px-6 py-4 font-medium text-gray-900">{p.amount}</td>
                                        <td className="px-6 py-4">
                                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${p.status === 'Processed' ? 'bg-blue-100 text-blue-700' : 'bg-yellow-100 text-yellow-700'
                                                }`}>
                                                {p.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <button className="text-[#5cb85c] font-medium text-xs hover:underline">Details</button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </CardContent>
                </Card>
            )}

            {activeTab === "commission" && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <Card>
                        <CardHeader className="pb-2"><CardTitle className="text-sm font-medium text-gray-500">Total Revenue</CardTitle></CardHeader>
                        <CardContent><div className="text-3xl font-bold text-gray-900">₹4,20,000</div></CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="pb-2"><CardTitle className="text-sm font-medium text-gray-500">Platform Commission (15%)</CardTitle></CardHeader>
                        <CardContent><div className="text-3xl font-bold text-[#5cb85c]">₹63,000</div></CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="pb-2"><CardTitle className="text-sm font-medium text-gray-500">Priest Earnings</CardTitle></CardHeader>
                        <CardContent><div className="text-3xl font-bold text-blue-600">₹3,57,000</div></CardContent>
                    </Card>

                    <Card className="md:col-span-3">
                        <CardHeader><CardTitle>Monthly Commission Breakdown</CardTitle></CardHeader>
                        <CardContent className="h-64 flex items-center justify-center bg-gray-50 rounded-lg border border-dashed border-gray-200">
                            <span className="text-gray-400">Chart Placeholder</span>
                        </CardContent>
                    </Card>
                </div>
            )}
        </div>
    );
}
