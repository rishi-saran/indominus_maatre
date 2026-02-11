"use client";

import { BarChart, PieChart, TrendingUp, Calendar } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

export default function ReportsPage() {
    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Analytics & Reports</h1>
                <p className="text-gray-600 mt-1">Detailed insights into platform performance</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Placeholder Charts */}
                <Card className="col-span-1 md:col-span-2">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <TrendingUp className="w-5 h-5 text-green-500" />
                            Revenue Growth
                        </CardTitle>
                        <CardDescription>Generated revenue over the last 6 months</CardDescription>
                    </CardHeader>
                    <CardContent className="h-64 flex items-center justify-center bg-gray-50 rounded-lg border border-dashed border-gray-200 m-6 mt-0">
                        <div className="text-center text-gray-400">
                            <TrendingUp className="w-12 h-12 mx-auto mb-2 opacity-30" />
                            <p className="text-sm font-medium">Revenue Chart Visualisation</p>
                        </div>
                    </CardContent>
                </Card>

                <Card className="col-span-1">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <PieChart className="w-5 h-5 text-purple-500" />
                            User Demographics
                        </CardTitle>
                        <CardDescription>Customer vs Priest distribution</CardDescription>
                    </CardHeader>
                    <CardContent className="h-64 flex items-center justify-center bg-gray-50 rounded-lg border border-dashed border-gray-200 m-6 mt-0">
                        <div className="text-center text-gray-400">
                            <PieChart className="w-12 h-12 mx-auto mb-2 opacity-30" />
                            <p className="text-sm font-medium">Distribution Chart</p>
                        </div>
                    </CardContent>
                </Card>

                <Card className="col-span-1 md:col-span-3">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <BarChart className="w-5 h-5 text-blue-500" />
                            Monthly Booking Trends
                        </CardTitle>
                        <CardDescription>Comparison of confirmed, cancelled, and pending bookings</CardDescription>
                    </CardHeader>
                    <CardContent className="h-64 flex items-center justify-center bg-gray-50 rounded-lg border border-dashed border-gray-200 m-6 mt-0">
                        <div className="text-center text-gray-400">
                            <BarChart className="w-12 h-12 mx-auto mb-2 opacity-30" />
                            <p className="text-sm font-medium">Booking Trends Graph</p>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
