"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Calendar, X, Sunrise, Sunset, Moon, Star } from "lucide-react";

export function FloatingPanchang() {
  const [isExpanded, setIsExpanded] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);

  // Sample Panchang data - Replace with API call later
  const panchangData = {
    date: "29 December 2025",
    tithi: "Shukla Paksha Dashami",
    nakshatra: "Pushya",
    yoga: "Shiva Yoga",
    karana: "Baalava",
    sunrise: "06:45 AM",
    sunset: "05:42 PM",
    moonrise: "11:30 PM",
    auspiciousTime: "10:30 AM - 12:00 PM",
  };

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
              className="absolute right-full mr-3 top-1/2 -translate-y-1/2 px-3 py-2 glass rounded-lg shadow-lg whitespace-nowrap"
            >
              <p className="text-sm font-medium text-[var(--spiritual-green-dark)]">
                Today&apos;s Panchang
              </p>
              <p className="text-xs text-[var(--muted-foreground)]">
                {panchangData.tithi}
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Main Button */}
        <motion.button
          onClick={() => setIsExpanded(!isExpanded)}
          onMouseEnter={() => setShowTooltip(true)}
          onMouseLeave={() => setShowTooltip(false)}
          className="relative w-14 h-14 rounded-full bg-gradient-to-br from-[var(--spiritual-green)] to-[var(--spiritual-gold)] shadow-2xl flex items-center justify-center group overflow-hidden"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
        >
          {/* Glow effect */}
          <motion.div
            className="absolute inset-0 rounded-full bg-[var(--spiritual-yellow-light)]"
            animate={{
              opacity: [0.3, 0.6, 0.3],
              scale: [1, 1.2, 1],
            }}
            transition={{
              repeat: Infinity,
              duration: 3,
              ease: "easeInOut",
            }}
          />

          {/* Icon */}
          <Calendar className="w-6 h-6 text-white relative z-10" />
        </motion.button>

        {/* Expanded Card */}
        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.8, y: 20 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
              className="absolute bottom-0 right-0 mb-20 w-80 glass rounded-2xl shadow-2xl overflow-hidden border border-[var(--spiritual-green)]/20"
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
                    <p className="text-white/80 text-xs">{panchangData.date}</p>
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
              <div className="p-4 space-y-3 bg-white/50 backdrop-blur-xl">
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
                <button className="w-full py-2.5 bg-gradient-to-r from-[var(--spiritual-green)] to-[var(--spiritual-gold)] text-white rounded-xl font-medium text-sm hover:shadow-lg transition-all hover:scale-[1.02]">
                  View Full Panchang
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </>
  );
}
