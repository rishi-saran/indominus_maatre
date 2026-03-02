"use client";

import React, { useState, useMemo, useRef, useEffect } from "react";
// Optionally import process if using process.env (Next.js exposes env vars prefixed with NEXT_PUBLIC_)
import { 
  BarChart3, 
  TrendingUp, 
  Users, 
  Calendar,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  ArrowUpRight,
  ArrowDownRight,
  UserCheck,
  UserPlus
} from "lucide-react";
import { 
  BarChart, 
  Bar, 
  PieChart, 
  Pie, 
  Cell, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  AreaChart,
  Area,
  RadialBarChart,
  RadialBar
} from "recharts";
import { ApiService } from '@/lib/services/api.service';

const MONTHS_SHORT = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white/95 backdrop-blur-md p-4 border border-gray-100 shadow-[0_10px_30px_-5px_rgba(0,0,0,0.12)] rounded-2xl">
        <p className="font-bold text-gray-900 mb-1.5">{label}</p>
        {payload.map((entry: any, index: number) => (
            <p key={index} style={{ color: entry.color }} className="text-sm font-semibold">
                {entry.name}: {typeof entry.value === 'number' && entry.value >= 1000 ? `₹${(entry.value/1000).toFixed(0)}k` : entry.value}
            </p>
        ))}
      </div>
    );
  }
  return null;
};


export default function ReportsPage() {
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [selectedMonths, setSelectedMonths] = useState<string[]>(MONTHS_SHORT);
  const [showCalendar, setShowCalendar] = useState(false);
  const calendarRef = useRef<HTMLDivElement>(null);

  // Report data state
  const [reportData, setReportData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch report data
  useEffect(() => {
    setLoading(true);
    setError(null);
    async function fetchReportData() {
      try {
        const headers = await ApiService.getAuthHeaders();
        // Use only the base URL from env, do not include /api/v1 in env var
        const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
        // Ensure monthsParam is a valid comma-separated list of numbers
        const monthsParam = selectedMonths.map(m => (MONTHS_SHORT.indexOf(m) + 1)).join(',');
        // Ensure only one /api/v1/ in the path
        const url = `${BASE_URL}/admin/reports/summary?year=${selectedYear}&months=${monthsParam}`;
        console.log("Constructed URL:", url);
        console.log("Headers:", headers);
        const res = await fetch(url, { headers });
        if (!res.ok) throw new Error('Failed to fetch report data');
        const data = await res.json();
        setReportData(data);
      } catch (err: any) {
        setError(err.message || 'Failed to fetch report data');
      } finally {
        setLoading(false);
      }
    }
    fetchReportData();
  }, [selectedYear, selectedMonths]);

  // Calendar logic
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (calendarRef.current && !calendarRef.current.contains(e.target as Node)) {
        setShowCalendar(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const toggleMonth = (month: string) => {
    setSelectedMonths(prev => 
      prev.includes(month) 
        ? prev.filter(m => m !== month) 
        : [...prev, month]
    );
  };

  const selectAllMonths = () => setSelectedMonths([...MONTHS_SHORT]);
  const clearAllMonths = () => setSelectedMonths([]);

  // Filtered bookings from API
  const filteredBookings = reportData?.bookings || [];
  const totalConfirmed = filteredBookings.reduce((s: number, d: any) => s + d.confirmed, 0);
  const totalCancelled = filteredBookings.reduce((s: number, d: any) => s + d.cancelled, 0);

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      <div>
        <h1 className="text-3xl font-black text-gray-900 tracking-tight">Analytical Reports</h1>
        <p className="text-gray-500 mt-2 font-medium">Deep insights into platform performance.</p>
      </div>

      {loading ? (
        <div className="p-12 text-center text-gray-400 text-lg">Loading analytics...</div>
      ) : error ? (
        <div className="p-12 text-center text-red-500 text-lg">{error}</div>
      ) : reportData ? (
        <>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
          {/* Revenue Growth */}
          <div className="bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 p-8 rounded-3xl border border-green-100 shadow-sm relative overflow-hidden group hover:shadow-lg transition-all duration-300">
            {/* Decorative elements */}
            <div className="absolute top-0 right-0 w-40 h-40 bg-green-200/30 rounded-full blur-3xl"></div>
            <div className="absolute -bottom-20 -left-20 w-60 h-60 bg-emerald-200/30 rounded-full blur-3xl"></div>
            <div className="absolute top-6 right-6 w-20 h-20 border border-green-200/30 rounded-full"></div>
            <div className="absolute top-10 right-10 w-12 h-12 border border-green-200/30 rounded-full"></div>

            <div className="flex justify-between items-center mb-8 relative z-10">
              <div>
                <h3 className="text-xl font-bold text-gray-900">Revenue Growth</h3>
                <p className="text-gray-500 text-sm font-medium flex items-center gap-1.5 mt-1.5">
                  <span className="flex items-center gap-1 bg-green-100 text-[#1a5d1a] px-2 py-0.5 rounded-full text-xs font-bold">
                    <TrendingUp className="h-3 w-3" />
                    {reportData.revenue?.growthPercent ? `+${reportData.revenue.growthPercent}%` : ''}
                  </span>
                  <span className="text-gray-400">vs last month</span>
                </p>
              </div>
              <div className="p-3 bg-green-100/80 rounded-2xl border border-green-200/50">
                <BarChart3 className="h-6 w-6 text-[#1a5d1a]" />
              </div>
            </div>

            <div className="flex gap-4 mb-6 relative z-10">
              <div className="bg-white/70 backdrop-blur-sm rounded-xl px-4 py-2.5 border border-green-100">
                <p className="text-[#1a5d1a] text-[10px] font-bold uppercase tracking-wider">Total Revenue</p>
                <p className="text-gray-900 text-xl font-black">₹{reportData.revenue?.total?.toLocaleString()}</p>
              </div>
              <div className="bg-white/70 backdrop-blur-sm rounded-xl px-4 py-2.5 border border-green-100">
                <p className="text-[#1a5d1a] text-[10px] font-bold uppercase tracking-wider">Avg. Monthly</p>
                <p className="text-gray-900 text-xl font-black">₹{reportData.revenue?.averageMonthly?.toLocaleString()}</p>
              </div>
            </div>

            <div className="h-[240px] w-full relative z-10">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={reportData.revenue?.monthly || []}>
                  <defs>
                    {/* ...existing code... */}
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                  <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: '#9ca3af', fontSize: 12 }} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fill: '#9ca3af', fontSize: 12 }} tickFormatter={(value) => `₹${value/1000}k`} />
                  <Tooltip content={<CustomTooltip />} cursor={{ stroke: '#1a5d1a', strokeWidth: 1, strokeDasharray: '4 4' }} />
                  <Area type="monotone" dataKey="revenue" stroke="#1a5d1a" strokeWidth={3} fillOpacity={1} fill="url(#colorRevenue)" dot={{ stroke: '#1a5d1a', strokeWidth: 2, fill: '#fff', r: 4 }} activeDot={{ r: 6, strokeWidth: 0, fill: '#1a5d1a' }} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* User Demographics */}
          <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm flex flex-col group hover:shadow-lg transition-all duration-300 relative overflow-hidden">
            {/* Decorative elements */}
            <div className="absolute -top-16 -right-16 w-48 h-48 bg-gradient-to-br from-green-50 to-amber-50 rounded-full blur-3xl opacity-60"></div>

            <div className="flex justify-between items-center mb-6 relative z-10">
              <div>
                <h3 className="text-xl font-bold text-gray-900">User Demographics</h3>
                <p className="text-gray-500 text-sm font-medium mt-1">Provider vs Customer ratio</p>
              </div>
              <div className="p-3 bg-gradient-to-br from-green-50 to-amber-50 rounded-2xl border border-gray-100">
                <Users className="h-6 w-6 text-green-700" />
              </div>
            </div>

            <div className="flex items-center gap-6 relative z-10 flex-1">
              {/* Pie Chart */}
              <div className="w-[200px] h-[200px] flex-shrink-0 relative">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    {/* ...existing code for PieChart... */}
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
                {/* Center Label */}
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                  <span className="text-2xl font-black text-gray-900">{reportData.users?.total?.toLocaleString()}</span>
                  <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">Total Users</span>
                </div>
              </div>

              {/* Stats Cards */}
              <div className="flex flex-col gap-3 flex-1">
                <div className="bg-green-50 p-3 rounded-xl border border-green-100 flex items-center gap-2">
                  <UserCheck className="h-4 w-4 text-[#1a5d1a]" />
                  <span className="font-bold text-[#1a5d1a]">Customers</span>
                  <span className="text-xs text-gray-500">{reportData.users?.customers?.toLocaleString()} ({reportData.users?.customerPercent}%)</span>
                </div>
                <div className="bg-amber-50 p-3 rounded-xl border border-amber-100 flex items-center gap-2">
                  <UserPlus className="h-4 w-4 text-amber-700" />
                  <span className="font-bold text-amber-700">Priests</span>
                  <span className="text-xs text-gray-500">{reportData.users?.priests?.toLocaleString()} ({reportData.users?.priestPercent}%)</span>
                </div>
                <div className="bg-gray-50 p-3 rounded-xl border border-gray-100 flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-amber-500" />
                  <span className="font-bold text-amber-500">+{reportData.users?.newThisMonth?.toLocaleString()} new users this month</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Booking Trends with Calendar */}
        <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm animate-in fade-in slide-in-from-bottom-8 duration-700 delay-100 group hover:shadow-lg transition-all duration-300">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h3 className="text-xl font-bold text-gray-900">Monthly Booking Trends</h3>
              <p className="text-gray-500 text-sm font-medium mt-1">Confirmed vs Cancelled services</p>
            </div>

            <div className="flex items-center gap-3">
              {/* Summary pills */}
              <div className="hidden md:flex items-center gap-2">
                <span className="bg-green-50 text-green-700 px-3 py-1.5 rounded-full text-xs font-bold border border-green-100">
                  ✓ {totalConfirmed} Confirmed
                </span>
                <span className="bg-red-50 text-red-600 px-3 py-1.5 rounded-full text-xs font-bold border border-red-100">
                  ✕ {totalCancelled} Cancelled
                </span>
              </div>
              {/* Calendar Button and logic should be here */}
            </div>
          </div>
          {/* ...rest of the booking trends and calendar code... */}
        </div>
        </>
      ) : (
        <div className="p-12 text-center text-gray-400 text-lg">No analytics data available.</div>
      )}
    </div>
  );
}