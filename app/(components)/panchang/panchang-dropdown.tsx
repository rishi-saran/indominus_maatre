"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Moon, Star, Sunrise, Sunset, Loader2 } from "lucide-react";
import Link from "next/link";
import {
  fetchPanchang,
  fallbackPanchangData,
  type PanchangData
} from "@/lib/api/panchang";

interface PanchangDropdownProps {
  isOpen: boolean;
  onClose: () => void;
}

export function PanchangDropdown({ isOpen, onClose }: PanchangDropdownProps) {
  const [panchangData, setPanchangData] = useState<PanchangData>(fallbackPanchangData);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch panchang data when dropdown opens
  useEffect(() => {
    if (!isOpen) return;

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
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop - click to close */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-30"
          />

          {/* Dropdown Card */}
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className="absolute top-full right-0 mt-2 w-80 glass rounded-2xl shadow-2xl overflow-hidden border border-[var(--spiritual-green)]/20 z-40"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-[var(--spiritual-green)] to-[var(--spiritual-gold)] p-4 relative overflow-hidden">
              <motion.div
                className="absolute inset-0 bg-white/10"
                animate={{
                  x: ["-100%", "100%"],
                }}
                transition={{
                  repeat: Infinity,
                  duration: 3,
                  ease: "linear",
                }}
              />
              <div className="flex items-center justify-between relative z-10">
                <div>
                  <h3 className="text-white font-[var(--font-playfair)] font-semibold text-lg">
                    Today&apos;s Panchang
                  </h3>
                  <div className="flex items-center gap-2">
                    <p className="text-white/80 text-xs">{panchangData.date}</p>
                    {panchangData.isMock && (
                      <span className="px-1.5 py-0.5 rounded text-[10px] font-medium bg-amber-500/80 text-white border border-white/20">
                        Demo Data
                      </span>
                    )}
                    {!panchangData.isMock && !isLoading && (
                      <span className="px-1.5 py-0.5 rounded text-[10px] font-medium bg-emerald-500/80 text-white border border-white/20">
                        Live Data
                      </span>
                    )}
                  </div>
                </div>
                <button
                  onClick={onClose}
                  className="text-white/80 hover:text-white transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="p-4 space-y-3 bg-white/50 backdrop-blur-xl">
              {/* Error State */}
              {error && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-center">
                  <p className="text-xs text-red-600">{error}</p>
                  <p className="text-xs text-red-500 mt-1">Showing cached data</p>
                </div>
              )}

              {/* Loading State */}
              {isLoading ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="w-8 h-8 text-[var(--spiritual-green)] animate-spin" />
                </div>
              ) : (
                <>
                  {/* Tithi */}
                  <div className="flex items-center gap-3 p-3 bg-[var(--spiritual-yellow-light)] rounded-xl border border-[var(--spiritual-yellow)]/20">
                    <div className="w-10 h-10 bg-[var(--spiritual-green-light)] rounded-full flex items-center justify-center">
                      <Moon className="w-5 h-5 text-[var(--spiritual-green-dark)]" />
                    </div>
                    <div className="flex-1">
                      <p className="text-xs text-[var(--muted-foreground)]">Tithi</p>
                      <p className="font-medium text-[var(--spiritual-green-dark)]">
                        {panchangData.tithi}
                      </p>
                    </div>
                  </div>

                  {/* Nakshatra & Yoga */}
                  <div className="grid grid-cols-2 gap-3">
                    <div className="p-3 glass rounded-xl border border-[var(--border)]">
                      <div className="flex items-center gap-2 mb-1">
                        <Star className="w-4 h-4 text-[var(--spiritual-gold)]" />
                        <p className="text-xs text-[var(--muted-foreground)]">
                          Nakshatra
                        </p>
                      </div>
                      <p className="font-medium text-sm text-[var(--foreground)]">
                        {panchangData.nakshatra}
                      </p>
                    </div>
                    <div className="p-3 glass rounded-xl border border-[var(--border)]">
                      <p className="text-xs text-[var(--muted-foreground)] mb-1">
                        Yoga
                      </p>
                      <p className="font-medium text-sm text-[var(--foreground)]">
                        {panchangData.yoga}
                      </p>
                    </div>
                  </div>

                  {/* Sunrise & Sunset */}
                  <div className="grid grid-cols-2 gap-3">
                    <div className="p-3 bg-gradient-to-br from-orange-50 to-yellow-50 rounded-xl border border-orange-200/50">
                      <div className="flex items-center gap-2 mb-1">
                        <Sunrise className="w-4 h-4 text-orange-500" />
                        <p className="text-xs text-orange-700">Sunrise</p>
                      </div>
                      <p className="font-semibold text-sm text-orange-900">
                        {panchangData.sunrise}
                      </p>
                    </div>
                    <div className="p-3 bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl border border-purple-200/50">
                      <div className="flex items-center gap-2 mb-1">
                        <Sunset className="w-4 h-4 text-purple-500" />
                        <p className="text-xs text-purple-700">Sunset</p>
                      </div>
                      <p className="font-semibold text-sm text-purple-900">
                        {panchangData.sunset}
                      </p>
                    </div>
                  </div>

                  {/* Auspicious Time */}
                  <div className="p-3 bg-gradient-to-r from-[var(--spiritual-green-light)] to-[var(--spiritual-yellow-light)] rounded-xl border border-[var(--spiritual-green)]/20">
                    <p className="text-xs text-[var(--spiritual-green-dark)] font-medium mb-1">
                      🌟 Auspicious Muhurat
                    </p>
                    <p className="font-semibold text-[var(--spiritual-green-dark)]">
                      {panchangData.auspiciousTime}
                    </p>
                  </div>

                  {/* View Full Details Button */}
                  <Link href="/panchang">
                    <button
                      onClick={onClose}
                      className="w-full py-2.5 bg-gradient-to-r from-[var(--spiritual-green)] to-[var(--spiritual-gold)] text-white rounded-xl font-medium text-sm hover:shadow-lg transition-all hover:scale-[1.02]"
                    >
                      View Full Panchang
                    </button>
                  </Link>
                </>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
