"use client";

import React from "react";
import { motion } from "framer-motion";
import { HeroVideoDialog } from "../../../components/ui/hero-video-dialog";

interface VideoCardProps {
  videoSrc: string;
  thumbnailSrc: string;
  thumbnailAlt?: string;
  title: string;
  subtitle?: string;
  isLive?: boolean;
  viewerCount?: string;
  animationStyle?: "from-center" | "from-bottom" | "from-top" | "fade";
  className?: string;
}

export function VideoCard({
  videoSrc,
  thumbnailSrc,
  thumbnailAlt = "Video thumbnail",
  title,
  subtitle,
  isLive = false,
  viewerCount,
  animationStyle = "from-center",
  className,
}: VideoCardProps) {
  return (
    <div className={`relative ${className || ""}`}>
      {/* LIVE NOW Badge - Floating */}
      {isLive && (
        <motion.div
          className="absolute -top-3 right-4 z-20"
          animate={{ y: [0, -6, 0] }}
          transition={{
            repeat: Infinity,
            duration: 3,
            ease: "easeInOut",
          }}
        >
          <div className="glass px-3 py-2 rounded-xl shadow-xl">
            <p className="text-[10px] text-[var(--muted-foreground)] font-medium">
              LIVE NOW
            </p>
            <p className="text-lg font-bold text-[var(--spiritual-green-dark)]">
              🔴 LIVE
            </p>
          </div>
        </motion.div>
      )}

      {/* Main Video Card with HeroVideoDialog */}
      <div className="relative rounded-2xl overflow-hidden shadow-2xl shadow-black/15">
        <HeroVideoDialog
          animationStyle={animationStyle}
          videoSrc={videoSrc}
          thumbnailSrc={thumbnailSrc}
          thumbnailAlt={thumbnailAlt}
          className="w-full"
        />

        {/* Overlay with title and info */}
        <div className="absolute inset-x-0 bottom-0 p-4 text-white bg-gradient-to-t from-black/80 via-black/40 to-transparent pointer-events-none">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-[var(--font-playfair)] font-semibold">
                {title}
              </h3>
              {subtitle && (
                <p className="text-white/70 text-xs">{subtitle}</p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Viewers Badge - Floating */}
      {viewerCount && (
        <motion.div
          className="absolute -bottom-3 left-4 z-20"
          animate={{ y: [0, 4, 0] }}
          transition={{
            repeat: Infinity,
            duration: 2.5,
            ease: "easeInOut",
            delay: 0.5,
          }}
        >
          <div className="glass px-3 py-2 rounded-xl shadow-xl flex items-center gap-2">
            <div className="flex -space-x-1">
              <div className="w-6 h-6 rounded-full bg-[var(--spiritual-green)] flex items-center justify-center text-white text-xs">
                👤
              </div>
              <div className="w-6 h-6 rounded-full bg-[var(--spiritual-yellow)] flex items-center justify-center text-xs">
                👤
              </div>
              <div className="w-6 h-6 rounded-full bg-[var(--spiritual-gold)] flex items-center justify-center text-white text-xs">
                +
              </div>
            </div>
            <div>
              <p className="text-xs font-semibold text-[var(--foreground)]">
                {viewerCount} watching
              </p>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}
