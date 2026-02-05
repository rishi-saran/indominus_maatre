"use client";

import React, { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { Search, X, Clock, TrendingUp } from "lucide-react";

interface SearchDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

const trendingSearches = [
  "Ayyappa Pooja",
  "Ayusha Homam (Ayushya Homam)",
  "Engagement",
  "Ganapathi Homam",
  "Marriage (Vivaham)",
];

const recentSearches = [
  "Pandit near me",
  "Live Darshan",
];

export function SearchDialog({ isOpen, onClose }: SearchDialogProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [mounted, setMounted] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  useEffect(() => {
    setMounted(true);
  }, []);

  // Focus input when dialog opens
  useEffect(() => {
    if (isOpen && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  // Handle Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };
    if (isOpen) {
      document.addEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [isOpen, onClose]);

  const handleSearch = (query: string) => {
    console.log("Searching for:", query);
    
    // Service mapping for direct navigation
    const serviceMap: Record<string, string> = {
      "aavahanthi homam": "/services/homam/aavahanthi-homam",
      "aavani avittam": "/services/homam/aavani-avittam",
      "abdha poorthi ayush homam": "/services/homam/abdha-poorthi-ayush-homam",
      "ayusha homam": "/services/chanting/ayusha-homam",
      "ayushya homam": "/services/chanting/ayusha-homam",
      "ayusha homam (ayushya homam)": "/services/chanting/ayusha-homam",
      "ayyappa pooja": "/services/homam/ayyappa-pooja",
      "bheemaratha shanti": "/services/homam/bheemaratha-shanti",
      "bhoomi puja": "/services/homam/bhoomi-puja",
      "chandi homam": "/services/homam/chandi-homam",
      "sapta sati": "/services/homam/chandi-homam",
      "dhanvantari homam": "/services/homam/dhanvantari-homam",
      "durga homam": "/services/homam/durga-homam",
      "durga shanti homam": "/services/homam/durga-shanti-homam",
      "engagement": "/services/homam/engagement",
      "ganapathi homam": "/services/homam/ganapathi-homam",
      "ganapathi": "/services/homam/ganapathi-homam",
      "ganesh chathurthi": "/services/homam/ganesh-vinyagar-chathurthi-pooja",
      "vinayagar chathurthi": "/services/homam/ganesh-vinyagar-chathurthi-pooja",
      "haridra ganapathy homam": "/services/homam/haridra-ganapathy-homam",
      "hiranya srardham": "/services/homam/hiranya-srardham",
      "housewarming": "/services/homam/housewarming",
      "grihapravesham": "/services/homam/housewarming",
      "jathakarma": "/services/homam/jathakarma",
      "kanakabhishekam": "/services/homam/kanakabishekam",
      "lakshmi kubera homam": "/services/homam/lakshmi-kubera-homam",
      "maha mrutyunjaya homam": "/services/homam/maha-mrutynjaya-homam",
      "mahalakshmi homam": "/services/homam/mahalakshmi-homam",
      "mahalakshmi puja": "/services/homam/mahalakshmi-puja",
      "marriage": "/services/homam/marriage-vivaham",
      "marriage (vivaham)": "/services/homam/marriage-vivaham",
      "vivaham": "/services/homam/marriage-vivaham",
      "mrutyunjaya homam": "/services/homam/mrutyunjaya-homam",
      "navagraha homam": "/services/homam/navagraha-homam",
      "nichayathartham": "/services/homam/nichayathartham",
      "pratyangira badrakali homam": "/services/homam/pratyangira-badrakali",
      "badrakali homam": "/services/homam/pratyangira-badrakali",
      "punyaha vachanam": "/services/homam/punyaha-vachanam",
      "rudra ekadashi homam": "/services/homam/rudra-ekadashi",
      "rudrabhishekam": "/services/homam/rudrabhishekam",
      "rudrabhishek": "/services/homam/rudrabhishekam",
      "sadakshari durga gayatri homam": "/services/homam/sadakshari-durga-gayatri",
      "saraswathi poojai": "/services/homam/saraswathi-poojai",
      "sathabhishekam": "/services/homam/sathabhishekam",
      "sathyanarayana puja": "/services/homam/sathyanarayana-puja",
      "seemantham": "/services/homam/seemantham",
      "shashtyabdapoorthi": "/services/homam/shashtyabdapoorthiy",
      "shatru samhara homam": "/services/homam/shatru-samhara-homam",
      "sidhi vinayaga puja": "/services/homam/sidhi-vinayaga-puja",
      "srardham": "/services/homam/srardham",
      "sudarshana homam": "/services/homam/sudarshana-homam",
      "maha sudarshana homam": "/services/homam/sudarshana-homam",
      "swayamvara parvathi homam": "/services/homam/swayamvara-parvathi",
      "ugraratha shanti": "/services/homam/ugraratha-shanti",
      "upanayanam": "/services/homam/upanayanam",
      "vancha kalpalatha maha ganapathi homam": "/services/homam/vancha-kalpalatha-ganapathi",
      "vastu shanthi": "/services/homam/vastu-shanthi",
      "vijayaratha shanti": "/services/homam/vijayaratha-shanti",
      "namakarana": "/services/homam/namakarana",
    };

    // Check if query matches a known service (case-insensitive)
    const lowerQuery = query.toLowerCase().trim();
    const detailPage = serviceMap[lowerQuery];

    onClose();

    if (lowerQuery === "pandit near me") {
      router.push("/services");
    } else if (lowerQuery === "live darshan") {
      router.push("/live-streams");
    } else if (detailPage) {
      // Navigate directly to service detail page
      router.push(detailPage);
    } else {
      // Navigate to services page with search query
      router.push(`/services?search=${encodeURIComponent(query)}`);
    }
  };

  if (!mounted) return null;

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[9999] flex items-start justify-center pt-20 bg-black/60 backdrop-blur-md"
          onClick={onClose}
        >
          {/* Search Container */}
          <motion.div
            initial={{ opacity: 0, y: -50, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -50, scale: 0.95 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="w-full max-w-2xl mx-4"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Main Search Card */}
            <div className="bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 overflow-hidden">
              {/* Search Input Area */}
              <div className="p-4 border-b border-gray-200/50">
                <div className="flex items-center gap-3">
                  <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-[var(--spiritual-green)] to-[var(--spiritual-green-dark)]">
                    <Search className="w-5 h-5 text-white" />
                  </div>
                  <input
                    ref={inputRef}
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && searchQuery.trim()) {
                        handleSearch(searchQuery);
                      }
                    }}
                    placeholder="Search for Puja, Pandit, Temple, Darshan..."
                    className="flex-1 text-lg bg-transparent text-gray-800 placeholder:text-gray-400 focus:outline-none"
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery("")}
                      className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                    >
                      <X className="w-5 h-5 text-gray-400" />
                    </button>
                  )}
                  <button
                    onClick={onClose}
                    className="p-2 rounded-xl bg-gray-100 hover:bg-gray-200 transition-colors"
                  >
                    <span className="text-xs font-medium text-gray-500">ESC</span>
                  </button>
                </div>
              </div>

              {/* Search Suggestions */}
              <div className="p-4 max-h-[60vh] overflow-y-auto">


                {/* Recent Searches */}
                {recentSearches.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.15 }}
                    className="mb-6"
                  >
                    <div className="flex items-center gap-2 mb-3">
                      <Clock className="w-4 h-4 text-gray-400" />
                      <span className="text-sm font-medium text-gray-500">Recent</span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {recentSearches.map((search, index) => (
                        <button
                          key={index}
                          onClick={() => handleSearch(search)}
                          className="px-4 py-2 rounded-full bg-gray-100 hover:bg-gray-200 text-sm text-gray-700 transition-colors"
                        >
                          {search}
                        </button>
                      ))}
                    </div>
                  </motion.div>
                )}

                {/* Trending Searches */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  <div className="flex items-center gap-2 mb-3">
                    <TrendingUp className="w-4 h-4 text-[var(--spiritual-gold)]" />
                    <span className="text-sm font-medium text-gray-500">Trending</span>
                  </div>
                  <div className="space-y-1">
                    {trendingSearches.map((search, index) => (
                      <button
                        key={index}
                        onClick={() => handleSearch(search)}
                        className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-gray-100 transition-colors text-left group"
                      >
                        <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-gradient-to-br from-[var(--spiritual-yellow-light)] to-[var(--spiritual-gold)]/20 text-sm font-bold text-[var(--spiritual-gold)]">
                          {index + 1}
                        </span>
                        <span className="flex-1 text-gray-700 group-hover:text-[var(--spiritual-green-dark)]">
                          {search}
                        </span>
                        <Search className="w-4 h-4 text-gray-300 group-hover:text-gray-400" />
                      </button>
                    ))}
                  </div>
                </motion.div>
              </div>

              {/* Footer */}
              <div className="px-4 py-3 bg-gray-50/80 border-t border-gray-200/50">
                <div className="flex items-center justify-between text-xs text-gray-400">
                  <span>Press <kbd className="px-1.5 py-0.5 bg-white rounded border text-gray-500">Enter</kbd> to search</span>
                  <span className="text-[var(--spiritual-green)]">Maathre</span>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  );
}
