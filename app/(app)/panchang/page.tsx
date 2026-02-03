"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  Sun,
  Moon,
  Star,
  Sunrise,
  Sunset,
  Clock,
  Loader2,
  MapPin,
  Sparkles,
  AlertTriangle
} from "lucide-react";
import {
  fetchRawPanchang,
  formatTime,
  formatTimeRange,
  type PanchangApiResponse,
  type AuspiciousPeriod
} from "@/lib/api/panchang";

export default function PanchangPage() {
  const [panchangData, setPanchangData] = useState<PanchangApiResponse | null>(null);
  const [dateStr, setDateStr] = useState<string>("");
  const [location, setLocation] = useState<string>("Chennai");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadPanchang() {
      setIsLoading(true);
      setError(null);

      const result = await fetchRawPanchang();

      if (result.error) {
        setError(result.error);
      }

      if (result.data) {
        setPanchangData(result.data);
        setDateStr(result.date);
        setLocation(result.location);
      }

      setIsLoading(false);
    }

    loadPanchang();
  }, []);

  // Format date for display
  const formattedDate = dateStr ? new Date(dateStr).toLocaleDateString("en-IN", {
    weekday: "long",
    day: "2-digit",
    month: "long",
    year: "numeric",
  }) : "";

  return (
    <div className="min-h-screen w-full bg-gradient-to-r from-[#d6f0a8] via-[#eaf5b5] to-[#ffe6a3] pt-4 pb-12 px-4 md:px-8 flex justify-center font-sans">
      {/* Main Dashboard Card - Auto Height for Scrolling */}
      <div className="w-full max-w-[1600px] bg-white rounded-[2rem] shadow-2xl border border-gray-200 flex flex-col relative">

        {/* Decorative Background Pattern */}
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[radial-gradient(#4a7c4e_1px,transparent_1px)] [background-size:16px_16px]"></div>

        {/* Header Bar */}
        <div className="bg-[#4a7c4e] px-8 py-5 flex items-center justify-between shadow-md z-10 shrink-0 rounded-t-[2rem]">
          {/* Left: Branding & Location */}
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2 text-white/90 bg-white/10 px-4 py-2 rounded-full backdrop-blur-sm border border-white/10">
              <MapPin className="w-4 h-4" />
              <span className="text-sm font-medium tracking-wide">{location}</span>
            </div>
            <div className="hidden md:block h-8 w-px bg-white/20"></div>
            <h1 className="text-white text-2xl font-serif font-bold tracking-wide hidden md:block">Panchang</h1>
          </div>

          {/* Center: Date */}
          <div className="text-center absolute left-1/2 -translate-x-1/2 hidden md:block">
            <h2 className="text-2xl font-serif font-bold text-white drop-shadow-sm">
              {formattedDate}
            </h2>
            {panchangData?.vaara && (
              <p className="text-emerald-100 text-sm font-medium tracking-widest uppercase mt-0.5">{panchangData.vaara}</p>
            )}
          </div>

          {/* Right: Status */}
          <div>
            {panchangData?.isMock ? (
              <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold bg-amber-400 text-amber-950 shadow-lg border border-white/20">
                <span className="w-2 h-2 rounded-full bg-amber-700 animate-pulse" />
                DEMO MODE
              </span>
            ) : (
              <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold bg-emerald-400 text-emerald-950 shadow-lg border border-white/20">
                <span className="w-2 h-2 rounded-full bg-emerald-700" />
                LIVE
              </span>
            )}
          </div>
        </div>

        {/* Dashboard Grid Content */}
        {!isLoading && panchangData ? (
          <div className="flex-1 p-6 md:p-8">
            <div className="grid grid-cols-12 gap-6">

              {/* Left Column: Tithi Hero (4 cols) */}
              <div className="col-span-12 lg:col-span-4 flex flex-col gap-6">
                {/* Tithi Card - Full Height */}
                <div className="flex-1 bg-gradient-to-br from-[var(--spiritual-green)] to-[#2e5231] rounded-3xl p-8 relative overflow-hidden text-white shadow-xl flex flex-col justify-center text-center group min-h-[400px]">
                  <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -mr-16 -mt-16 group-hover:bg-white/10 transition-all duration-700"></div>
                  <div className="absolute bottom-0 left-0 w-48 h-48 bg-emerald-400/10 rounded-full blur-3xl -ml-10 -mb-10"></div>

                  <div className="relative z-10 flex flex-col items-center">
                    <div className="p-4 bg-white/10 rounded-full mb-6 backdrop-blur-md border border-white/10">
                      <Moon className="w-10 h-10 text-emerald-100" />
                    </div>
                    <h3 className="text-sm uppercase tracking-[0.2em] text-emerald-200 mb-2">Current Tithi</h3>
                    {panchangData.tithi?.map((t, i) => (
                      <div key={i} className="flex flex-col items-center">
                        <p className="text-5xl md:text-6xl font-serif font-bold mb-3 drop-shadow-md">{t.name}</p>
                        {t.paksha && <p className="text-xl text-emerald-100 mb-8 font-light italic">{t.paksha} Paksha</p>}

                        <div className="flex flex-col items-center gap-1 bg-black/20 px-6 py-3 rounded-xl border border-white/10 backdrop-blur-sm">
                          <p className="text-xs text-emerald-300 uppercase font-semibold">Ends Today At</p>
                          <p className="text-2xl font-bold font-mono tracking-tight">{formatTime(t.end)}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Middle Column: Details (4 cols) */}
              <div className="col-span-12 lg:col-span-4 flex flex-col gap-6">
                {/* Nakshatra */}
                <div className="flex-1 bg-[#fff8e1] rounded-3xl p-6 border border-amber-100 flex flex-col relative overflow-hidden min-h-[250px]">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-amber-400/5 rounded-full blur-2xl"></div>
                  <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 bg-amber-100 rounded-lg text-amber-600">
                      <Star className="w-5 h-5" />
                    </div>
                    <h3 className="text-lg font-bold text-amber-900 font-serif">Nakshatra</h3>
                  </div>

                  <div className="flex-1 flex flex-col justify-center">
                    {panchangData.nakshatra?.slice(0, 1).map((n, i) => (
                      <div key={i} className="text-center">
                        <p className="text-4xl font-serif font-bold text-amber-900 mb-2">{n.name}</p>
                        <p className="text-amber-700/70 mb-6 font-medium">Lord: {n.lord?.name}</p>
                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-amber-100/50 rounded-lg border border-amber-200/50">
                          <span className="text-xs text-amber-800 uppercase font-bold">Until</span>
                          <span className="text-lg font-bold text-amber-900">{formatTime(n.end)}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Yoga */}
                <div className="flex-1 bg-[#f3e5f5] rounded-3xl p-6 border border-purple-100 flex flex-col relative overflow-hidden min-h-[250px]">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-purple-400/5 rounded-full blur-2xl"></div>
                  <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 bg-purple-100 rounded-lg text-purple-600">
                      <Sparkles className="w-5 h-5" />
                    </div>
                    <h3 className="text-lg font-bold text-purple-900 font-serif">Yoga</h3>
                  </div>

                  <div className="flex-1 flex flex-col justify-center">
                    {panchangData.yoga?.slice(0, 1).map((y, i) => (
                      <div key={i} className="text-center">
                        <p className="text-4xl font-serif font-bold text-purple-900 mb-6">{y.name}</p>
                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-purple-100/50 rounded-lg border border-purple-200/50">
                          <span className="text-xs text-purple-800 uppercase font-bold">Until</span>
                          <span className="text-lg font-bold text-purple-900">{formatTime(y.end)}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Right Column: Timings (4 cols) */}
              <div className="col-span-12 lg:col-span-4 flex flex-col gap-6">
                {/* Sun & Moon Grid */}
                <div className="grid grid-cols-2 gap-4">
                  {/* Sunrise */}
                  <div className="bg-orange-50 p-4 rounded-2xl border border-orange-100/50 flex flex-col items-center justify-center min-h-[120px]">
                    <Sunrise className="w-6 h-6 text-orange-500 mb-2" />
                    <span className="text-xs font-bold text-orange-400 uppercase tracking-widest">Sunrise</span>
                    <span className="text-xl font-bold text-orange-900">{formatTime(panchangData.sunrise)}</span>
                  </div>
                  {/* Sunset */}
                  <div className="bg-blue-50 p-4 rounded-2xl border border-blue-100/50 flex flex-col items-center justify-center min-h-[120px]">
                    <Sunset className="w-6 h-6 text-blue-500 mb-2" />
                    <span className="text-xs font-bold text-blue-400 uppercase tracking-widest">Sunset</span>
                    <span className="text-xl font-bold text-blue-900">{formatTime(panchangData.sunset)}</span>
                  </div>
                </div>

                {/* Auspicious Timings Card */}
                <div className="flex-1 bg-white rounded-3xl border border-gray-100 shadow-sm p-6 overflow-hidden flex flex-col">
                  <div className="flex items-center gap-2 mb-4 pb-4 border-b border-gray-100">
                    <Sparkles className="w-5 h-5 text-emerald-500" />
                    <h3 className="font-bold text-gray-800">Auspicious Timings</h3>
                  </div>
                  <div className="space-y-3">
                    {panchangData.auspicious_period?.slice(0, 3).map((p, i) => (
                      <div key={i} className="flex justify-between items-center group bg-gray-50 p-2 rounded-lg">
                        <span className="text-sm font-medium text-gray-600 group-hover:text-emerald-600 transition-colors">{p.name}</span>
                        <span className="text-sm font-bold text-gray-800">{formatTimeRange(p.period[0])}</span>
                      </div>
                    ))}
                    {(!panchangData.auspicious_period || panchangData.auspicious_period.length === 0) && (
                      <p className="text-sm text-gray-400 italic">No special timings today</p>
                    )}
                  </div>
                </div>

                {/* Inauspicious Timings Card */}
                <div className="flex-1 bg-white rounded-3xl border border-gray-100 shadow-sm p-6 overflow-hidden flex flex-col">
                  <div className="flex items-center gap-2 mb-4 pb-4 border-b border-gray-100">
                    <AlertTriangle className="w-5 h-5 text-amber-500" />
                    <h3 className="font-bold text-gray-800">Inauspicious Timings</h3>
                  </div>
                  <div className="space-y-3">
                    {panchangData.inauspicious_period?.slice(0, 3).map((p, i) => (
                      <div key={i} className="flex justify-between items-center group bg-gray-50 p-2 rounded-lg">
                        <span className="text-sm font-medium text-gray-600 group-hover:text-amber-600 transition-colors">{p.name}</span>
                        <span className="text-sm font-bold text-gray-800">{formatTimeRange(p.period[0])}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

            </div>
          </div>
        ) : (
          <div className="flex-1 flex items-center justify-center min-h-[500px]">
            {isLoading ? (
              <div className="flex flex-col items-center gap-4">
                <Loader2 className="w-12 h-12 animate-spin text-[#4a7c4e]" />
                <p className="text-[#4a7c4e] font-serif italic text-lg animate-pulse">Consulting the stars...</p>
              </div>
            ) : null}
            {!isLoading && error && (
              <div className="text-center p-8 max-w-md">
                <AlertTriangle className="w-12 h-12 text-orange-500 mx-auto mb-4" />
                <p className="text-orange-800 font-bold mb-2">Unable to load Panchang</p>
                <p className="text-orange-600 text-sm">{error}</p>
                <button
                  onClick={() => window.location.reload()}
                  className="mt-4 px-4 py-2 bg-[#4a7c4e] text-white rounded-lg text-sm hover:bg-[#3d6941]"
                >
                  Retry
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

// Section Component (Updated for new styling if needed, but keeping basic for compatibility)
function Section({
  title,
  icon,
  children,
  compact = false
}: {
  title: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
  compact?: boolean;
}) {
  return (
    <div className={compact ? "space-y-2" : "space-y-3"}>
      <h3 className="font-serif text-[var(--spiritual-green-dark)] flex items-center justify-center gap-2 text-base md:text-lg lg:text-xl">
        {icon}
        {title}
      </h3>
      <div className="space-y-2">
        {children}
      </div>
    </div>
  );
}

// Time Card Component
function TimeCard({
  icon,
  label,
  time,
  bgClass,
  borderClass,
  textClass,
  valueClass
}: {
  icon: React.ReactNode;
  label: string;
  time: string;
  bgClass: string;
  borderClass: string;
  textClass: string;
  valueClass: string;
}) {
  return (
    <div className={`p-4 bg-gradient-to-br ${bgClass} rounded-xl border ${borderClass}`}>
      <div className="flex items-center justify-center gap-2 mb-2">
        {icon}
        <span className={`text-sm ${textClass}`}>{label}</span>
      </div>
      <p className={`text-xl font-bold text-center ${valueClass}`}>{time}</p>
    </div>
  );
}

// Period Card Component - Updated for dashboard grid
function PeriodCard({
  period,
  type
}: {
  period: AuspiciousPeriod;
  type: "auspicious" | "inauspicious"
}) {
  const isAuspicious = type === "auspicious";

  return (
    <div className={`p-3 rounded-xl border ${isAuspicious
      ? 'bg-gradient-to-r from-emerald-50 to-green-50 border-emerald-200/50'
      : 'bg-gradient-to-r from-amber-50 to-yellow-50 border-amber-200/50'
      }`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-base">{isAuspicious ? '✨' : '⚠️'}</span>
          <span className={`text-sm font-medium ${isAuspicious ? 'text-emerald-700' : 'text-amber-700'}`}>
            {period.name}
          </span>
        </div>
        <div className="flex flex-col text-right">
          {period.period[0] && (
            <span className={`text-sm font-bold ${isAuspicious ? 'text-emerald-900' : 'text-amber-900'}`}>
              {formatTimeRange(period.period[0])}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
