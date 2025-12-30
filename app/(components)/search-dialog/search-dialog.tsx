"use client";

import React, { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Search, X, Clock, TrendingUp } from "lucide-react";

interface SearchDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

const trendingSearches = [
  "Ganga Aarti",
  "Satyanarayan Puja",
  "Navgraha Shanti",
  "Griha Pravesh",
  "Rudrabhishek",
];

const recentSearches = [
  "Pandit near me",
  "Live Darshan",
  "Temple booking",
];

export function SearchDialog({ isOpen, onClose }: SearchDialogProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [mounted, setMounted] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

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
    // Add search logic here
    onClose();
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
