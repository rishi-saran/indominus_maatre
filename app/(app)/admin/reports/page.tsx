"use client";

import React, { useState, useMemo, useRef, useEffect } from "react";
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

// --- Dummy Data (extended with full year + date info) ---
const allBookingData = [
  { month: "Jan", year: 2025, confirmed: 38, cancelled: 6 },
  { month: "Feb", year: 2025, confirmed: 42, cancelled: 3 },
  { month: "Mar", year: 2025, confirmed: 50, cancelled: 5 },
  { month: "Apr", year: 2025, confirmed: 47, cancelled: 4 },
  { month: "May", year: 2025, confirmed: 53, cancelled: 2 },
  { month: "Jun", year: 2025, confirmed: 49, cancelled: 7 },
  { month: "Jul", year: 2025, confirmed: 45, cancelled: 5 },
  { month: "Aug", year: 2025, confirmed: 52, cancelled: 3 },
  { month: "Sep", year: 2025, confirmed: 48, cancelled: 4 },
  { month: "Oct", year: 2025, confirmed: 58, cancelled: 2 },
  { month: "Nov", year: 2025, confirmed: 55, cancelled: 3 },
  { month: "Dec", year: 2025, confirmed: 62, cancelled: 4 },
  { month: "Jan", year: 2026, confirmed: 60, cancelled: 3 },
  { month: "Feb", year: 2026, confirmed: 65, cancelled: 2 },
];

const revenueData = [
  { month: "Jul", revenue: 45000 },
  { month: "Aug", revenue: 52000 },
  { month: "Sep", revenue: 48000 },
  { month: "Oct", revenue: 61000 },
  { month: "Nov", revenue: 55000 },
  { month: "Dec", revenue: 68000 },
];

const userDemographics = [
  { name: "Customers", value: 3400, icon: UserCheck, color: "#16a34a", bgColor: "bg-green-50", textColor: "text-green-700", borderColor: "border-green-100" },
  { name: "Priests", value: 250, icon: UserPlus, color: "#ca8a04", bgColor: "bg-amber-50", textColor: "text-amber-700", borderColor: "border-amber-100" },
];

const COLORS = ["#16a34a", "#ca8a04"];

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
  const [selectedYear, setSelectedYear] = useState(2025);
  const [selectedMonths, setSelectedMonths] = useState<string[]>(["Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]);
  const [showCalendar, setShowCalendar] = useState(false);
  const calendarRef = useRef<HTMLDivElement>(null);

  // Close calendar on outside click
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

  const filteredBookings = useMemo(() => {
    return allBookingData.filter(d => d.year === selectedYear && selectedMonths.includes(d.month));
  }, [selectedYear, selectedMonths]);

  const totalConfirmed = filteredBookings.reduce((s, d) => s + d.confirmed, 0);
  const totalCancelled = filteredBookings.reduce((s, d) => s + d.cancelled, 0);

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      <div>
        <h1 className="text-3xl font-black text-gray-900 tracking-tight">Analytical Reports</h1>
        <p className="text-gray-500 mt-2 font-medium">Deep insights into platform performance.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
        
        {/* Revenue Growth — Soft Green Gradient Card */}
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
                       <span className="flex items-center gap-1 bg-green-100 text-green-700 px-2 py-0.5 rounded-full text-xs font-bold">
                         <TrendingUp className="h-3 w-3" /> +12%
                       </span>
                       <span className="text-gray-400">vs last month</span>
                   </p>
               </div>
               <div className="p-3 bg-green-100/80 rounded-2xl border border-green-200/50">
                    <BarChart3 className="h-6 w-6 text-green-700" />
               </div>
           </div>
           
           <div className="flex gap-4 mb-6 relative z-10">
             <div className="bg-white/70 backdrop-blur-sm rounded-xl px-4 py-2.5 border border-green-100">
               <p className="text-green-600/70 text-[10px] font-bold uppercase tracking-wider">Total Revenue</p>
               <p className="text-gray-900 text-xl font-black">₹3.29L</p>
             </div>
             <div className="bg-white/70 backdrop-blur-sm rounded-xl px-4 py-2.5 border border-green-100">
               <p className="text-green-600/70 text-[10px] font-bold uppercase tracking-wider">Avg. Monthly</p>
               <p className="text-gray-900 text-xl font-black">₹54.8k</p>
             </div>
           </div>

           <div className="h-[240px] w-full relative z-10">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={revenueData}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#16a34a" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#16a34a" stopOpacity={0.02}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: '#9ca3af', fontSize: 12 }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#9ca3af', fontSize: 12 }} tickFormatter={(value) => `₹${value/1000}k`} />
                <Tooltip content={<CustomTooltip />} cursor={{ stroke: '#16a34a', strokeWidth: 1, strokeDasharray: '4 4' }} />
                <Area type="monotone" dataKey="revenue" stroke="#16a34a" strokeWidth={3} fillOpacity={1} fill="url(#colorRevenue)" dot={{ stroke: '#16a34a', strokeWidth: 2, fill: '#fff', r: 4 }} activeDot={{ r: 6, strokeWidth: 0, fill: '#16a34a' }} />
              </AreaChart>
            </ResponsiveContainer>
           </div>
        </div>

        {/* User Demographics — Redesigned */}
        <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm flex flex-col group hover:shadow-lg transition-all duration-300 relative overflow-hidden">
           {/* Background Decoration */}
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
                   <Pie
                     data={userDemographics}
                     cx="50%"
                     cy="50%"
                     innerRadius={65}
                     outerRadius={90}
                     paddingAngle={6}
                     dataKey="value"
                     cornerRadius={8}
                     startAngle={90}
                     endAngle={-270}
                   >
                     {userDemographics.map((entry, index) => (
                       <Cell key={`cell-${index}`} fill={COLORS[index]} stroke="none" />
                     ))}
                   </Pie>
                   <Tooltip />
                 </PieChart>
               </ResponsiveContainer>
               {/* Center Label */}
               <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                   <span className="text-2xl font-black text-gray-900">3.6k</span>
                   <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">Total Users</span>
               </div>
             </div>

             {/* Stats Cards */}
             <div className="flex flex-col gap-3 flex-1">
               {userDemographics.map((entry, index) => {
                 const Icon = entry.icon;
                 const percentage = ((entry.value / 3650) * 100).toFixed(1);
                 return (
                   <div key={entry.name} className={`${entry.bgColor} p-4 rounded-2xl border ${entry.borderColor} transition-all hover:scale-[1.02]`}>
                     <div className="flex items-center justify-between mb-2">
                       <div className="flex items-center gap-2">
                         <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: COLORS[index] }}></div>
                         <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">{entry.name}</span>
                       </div>
                       <Icon className={`h-4 w-4 ${entry.textColor}`} />
                     </div>
                     <div className="flex items-end justify-between">
                       <div>
                         <p className="text-2xl font-black text-gray-900">{entry.value.toLocaleString('en-IN')}</p>
                         <p className={`text-xs font-semibold ${entry.textColor}`}>{percentage}% of total</p>
                       </div>
                       <div className="flex items-center gap-0.5 text-green-600 bg-green-100 px-2 py-0.5 rounded-full">
                         <ArrowUpRight className="h-3 w-3" />
                         <span className="text-[10px] font-bold">{index === 0 ? '+8%' : '+12%'}</span>
                       </div>
                     </div>
                   </div>
                 );
               })}

               {/* Growth indicator */}
               <div className="bg-gray-50 p-3 rounded-xl border border-gray-100 flex items-center gap-2">
                 <Sparkles className="h-4 w-4 text-amber-500" />
                 <p className="text-xs text-gray-500 font-medium">
                   <span className="font-bold text-gray-700">+320</span> new users this month
                 </p>
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

             {/* Calendar Button */}
             <div className="relative" ref={calendarRef}>
               <button 
                 onClick={() => setShowCalendar(!showCalendar)}
                 className={`p-3 rounded-2xl transition-all duration-200 cursor-pointer ${
                   showCalendar 
                     ? 'bg-green-600 text-white shadow-lg shadow-green-600/20' 
                     : 'bg-green-50 text-green-600 hover:bg-green-100 border border-green-100'
                 }`}
               >
                 <Calendar className="h-5 w-5" />
               </button>

               {/* Calendar Dropdown */}
               {showCalendar && (
                 <div className="absolute right-0 top-14 bg-white border border-gray-200 rounded-2xl shadow-[0_20px_60px_-10px_rgba(0,0,0,0.15)] p-5 z-50 w-[320px] animate-in fade-in slide-in-from-top-2 duration-200">
                   {/* Year Selector */}
                   <div className="flex items-center justify-between mb-4">
                     <button 
                       onClick={() => setSelectedYear(prev => prev - 1)}
                       className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors text-gray-500"
                     >
                       <ChevronLeft className="h-4 w-4" />
                     </button>
                     <span className="text-sm font-black text-gray-900 tracking-wide">{selectedYear}</span>
                     <button 
                       onClick={() => setSelectedYear(prev => prev + 1)}
                       className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors text-gray-500"
                     >
                       <ChevronRight className="h-4 w-4" />
                     </button>
                   </div>

                   {/* Month Grid */}
                   <div className="grid grid-cols-4 gap-2 mb-4">
                     {MONTHS_SHORT.map((month) => {
                       const isSelected = selectedMonths.includes(month);
                       const hasData = allBookingData.some(d => d.month === month && d.year === selectedYear);
                       return (
                         <button
                           key={month}
                           onClick={() => toggleMonth(month)}
                           disabled={!hasData}
                           className={`py-2 px-1 rounded-xl text-xs font-bold transition-all duration-150 ${
                             !hasData 
                               ? 'text-gray-300 cursor-not-allowed' 
                               : isSelected 
                                 ? 'bg-green-600 text-white shadow-md shadow-green-600/20 scale-105' 
                                 : 'text-gray-600 hover:bg-gray-100 border border-gray-100'
                           }`}
                         >
                           {month}
                         </button>
                       );
                     })}
                   </div>

                   {/* Quick Actions */}
                   <div className="flex gap-2 pt-3 border-t border-gray-100">
                     <button 
                       onClick={selectAllMonths}
                       className="flex-1 text-[11px] font-bold text-green-700 bg-green-50 py-2 rounded-lg hover:bg-green-100 transition-colors border border-green-100"
                     >
                       Select All
                     </button>
                     <button 
                       onClick={clearAllMonths}
                       className="flex-1 text-[11px] font-bold text-gray-500 bg-gray-50 py-2 rounded-lg hover:bg-gray-100 transition-colors border border-gray-100"
                     >
                       Clear All
                     </button>
                     <button 
                       onClick={() => setShowCalendar(false)}
                       className="flex-1 text-[11px] font-bold text-white bg-gray-900 py-2 rounded-lg hover:bg-gray-800 transition-colors"
                     >
                       Apply
                     </button>
                   </div>
                 </div>
               )}
             </div>
           </div>
        </div>

        {/* Active Filters */}
        {selectedMonths.length > 0 && selectedMonths.length < 12 && (
          <div className="flex items-center gap-2 mb-6 flex-wrap">
            <span className="text-xs text-gray-400 font-medium">Showing:</span>
            {selectedMonths.map(m => (
              <span key={m} className="bg-green-50 text-green-700 px-2.5 py-1 rounded-full text-[11px] font-bold border border-green-100">
                {m} {selectedYear}
              </span>
            ))}
          </div>
        )}
        
        {filteredBookings.length > 0 ? (
          <div className="h-[350px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={filteredBookings} barGap={8}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: '#9ca3af', fontSize: 12 }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#9ca3af', fontSize: 12 }} />
                <Tooltip cursor={{ fill: '#f9fafb', radius: 12 }} content={<CustomTooltip />} />
                <Legend iconType="circle" wrapperStyle={{ paddingTop: '20px' }} />
                <Bar name="Confirmed" dataKey="confirmed" fill="#16a34a" radius={[6, 6, 6, 6]} barSize={32} />
                <Bar name="Cancelled" dataKey="cancelled" fill="#ef4444" radius={[6, 6, 6, 6]} barSize={32} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <div className="h-[350px] w-full flex flex-col items-center justify-center text-gray-400">
            <Calendar className="h-12 w-12 mb-3 text-gray-300" />
            <p className="font-bold text-gray-500">No data for selected period</p>
            <p className="text-sm mt-1">Select months from the calendar to view trends</p>
          </div>
        )}
      </div>
    </div>
  );
}