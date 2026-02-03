"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Calendar, X, Sunrise, Sunset, Moon, Star, Loader2, Sun } from "lucide-react";
import Link from "next/link";
import {
  fetchPanchang,
  fallbackPanchangData,
  type PanchangData
} from "@/lib/api/panchang";

export function FloatingPanchang() {
  const [isExpanded, setIsExpanded] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);
  const [panchangData, setPanchangData] = useState<PanchangData>(fallbackPanchangData);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch Panchang data on mount
  useEffect(() => {
    async function loadPanchang() {
      setIsLoading(true);
      setError(null);

      const result = await fetchPanchang();

      if (result.error) {
        setError(result.error);
      }

      if (result.data) {
        setPanchangData(result.data);
      }

      setIsLoading(false);
    }

    loadPanchang();

    // Refresh every hour
    const interval = setInterval(loadPanchang, 60 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <>
      {/* Floating Button */}
      <motion.div
        className="fixed bottom-6 right-6 z-50"
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.5, type: "spring", stiffness: 260, damping: 20 }}
      >
        {/* Tooltip */}
        <AnimatePresence>
          {showTooltip && !isExpanded && (
            <motion.div
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 10 }}
              className="absolute right-full mr-3 top-1/2 -translate-y-1/2 px-3 py-2 bg-white rounded-lg shadow-lg whitespace-nowrap border border-[#4a7c4e]/20"
            >
              <p className="text-sm font-medium text-[#4a7c4e]">
                Today&apos;s Panchang
              </p>
              <p className="text-xs text-gray-500">
                {isLoading ? "Loading..." : panchangData.tithi}
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Main Button */}
        <motion.button
          onClick={() => setIsExpanded(!isExpanded)}
          onMouseEnter={() => setShowTooltip(true)}
          onMouseLeave={() => setShowTooltip(false)}
          className="relative w-14 h-14 rounded-full bg-[#4a7c4e] shadow-2xl flex items-center justify-center group overflow-hidden"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
        >
          {/* Icon */}
          {isLoading ? (
            <Loader2 className="w-6 h-6 text-white relative z-10 animate-spin" />
          ) : (
            <Calendar className="w-6 h-6 text-white relative z-10" />
          )}
        </motion.button>

        {/* Expanded Card */}
        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.8, y: 20 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
              className="absolute bottom-0 right-0 mb-20 w-80 bg-white rounded-2xl shadow-2xl overflow-hidden border border-[#4a7c4e]/20"
            >
              {/* Header - Solid Green */}
              <div className="bg-[#4a7c4e] px-4 py-4 relative">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-white font-serif font-semibold text-lg">
                      Today&apos;s Panchang
                    </h3>
                    <p className="text-white/80 text-sm">{panchangData.date}</p>
                  </div>
                  <button
                    onClick={() => setIsExpanded(false)}
                    className="text-white/80 hover:text-white transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Content */}
              <div className="p-4 space-y-3 bg-white">
                {/* Error State */}
                {error && (
                  <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-center">
                    <p className="text-xs text-amber-600">{error}</p>
                    <p className="text-xs text-amber-500 mt-1">Showing cached data</p>
                  </div>
                )}

                {/* Loading State */}
                {isLoading ? (
                  <div className="flex items-center justify-center py-8">
                    <Loader2 className="w-8 h-8 text-[#4a7c4e] animate-spin" />
                  </div>
                ) : (
                  <>
                    {/* Tithi */}
                    <div className="flex items-center gap-3 p-3 bg-[#f5f0d8] rounded-xl">
                      <div className="w-10 h-10 bg-[#4a7c4e] rounded-full flex items-center justify-center">
                        <Moon className="w-5 h-5 text-white" />
                      </div>
                      <div className="flex-1">
                        <p className="text-xs text-[#4a7c4e]">Tithi</p>
                        <p className="font-semibold text-[#2f3a1f]">
                          {panchangData.tithi}
                        </p>
                      </div>
                    </div>

                    {/* Nakshatra & Yoga */}
                    <div className="grid grid-cols-2 gap-3">
                      <div className="p-3 bg-gray-50 rounded-xl">
                        <div className="flex items-center gap-2 mb-1">
                          <Star className="w-4 h-4 text-[#d4a853]" />
                          <p className="text-xs text-gray-500">Nakshatra</p>
                        </div>
                        <p className="font-medium text-sm text-[#2f3a1f]">
                          {panchangData.nakshatra}
                        </p>
                      </div>
                      <div className="p-3 bg-gray-50 rounded-xl">
                        <p className="text-xs text-gray-500 mb-1">Yoga</p>
                        <p className="font-medium text-sm text-[#2f3a1f]">
                          {panchangData.yoga}
                        </p>
                      </div>
                    </div>

                    {/* Sunrise & Sunset */}
                    <div className="grid grid-cols-2 gap-3">
                      <div className="p-3 bg-[#fff8e6] rounded-xl">
                        <div className="flex items-center gap-2 mb-1">
                          <Sunrise className="w-4 h-4 text-[#d4a853]" />
                          <p className="text-xs text-[#d4a853]">Sunrise</p>
                        </div>
                        <p className="font-semibold text-sm text-[#8b6914]">
                          {panchangData.sunrise}
                        </p>
                      </div>
                      <div className="p-3 bg-[#e8f5e0] rounded-xl">
                        <div className="flex items-center gap-2 mb-1">
                          <Sunset className="w-4 h-4 text-[#4a7c4e]" />
                          <p className="text-xs text-[#4a7c4e]">Sunset</p>
                        </div>
                        <p className="font-semibold text-sm text-[#3d6941]">
                          {panchangData.sunset}
                        </p>
                      </div>
                    </div>

                    {/* Auspicious Time */}
                    <div className="p-3 bg-[#fff8e6] rounded-xl">
                      <p className="text-xs text-[#d4a853] font-medium mb-1">
                        ⭐ Auspicious Muhurat
                      </p>
                      <p className="font-semibold text-[#8b6914]">
                        {panchangData.auspiciousTime}
                      </p>
                    </div>

                    {/* View Full Details Button */}
                    <Link href="/panchang">
                      <button className="w-full py-2.5 bg-[#4a7c4e] text-white rounded-xl font-medium text-sm hover:bg-[#3d6941] transition-colors">
                        View Full Panchang
                      </button>
                    </Link>
                  </>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </>
  );
}
