"use client"

import { useState, useEffect, useCallback } from "react"
import { createPortal } from "react-dom"
import { usePathname } from "next/navigation"
import { Play, X } from "lucide-react"
import { AnimatePresence, motion } from "framer-motion"

import { cn } from "@/lib/utils"

type AnimationStyle =
  | "from-bottom"
  | "from-center"
  | "from-top"
  | "from-left"
  | "from-right"
  | "fade"
  | "top-in-bottom-out"
  | "left-in-right-out"

interface HeroVideoProps {
  animationStyle?: AnimationStyle
  videoSrc: string
  thumbnailSrc: string
  thumbnailAlt?: string
  className?: string
}

const animationVariants = {
  "from-bottom": {
    initial: { y: "100%", opacity: 0 },
    animate: { y: 0, opacity: 1 },
    exit: { y: "100%", opacity: 0 },
  },
  "from-center": {
    initial: { scale: 0.5, opacity: 0 },
    animate: { scale: 1, opacity: 1 },
    exit: { scale: 0.5, opacity: 0 },
  },
  "from-top": {
    initial: { y: "-100%", opacity: 0 },
    animate: { y: 0, opacity: 1 },
    exit: { y: "-100%", opacity: 0 },
  },
  "from-left": {
    initial: { x: "-100%", opacity: 0 },
    animate: { x: 0, opacity: 1 },
    exit: { x: "-100%", opacity: 0 },
  },
  "from-right": {
    initial: { x: "100%", opacity: 0 },
    animate: { x: 0, opacity: 1 },
    exit: { x: "100%", opacity: 0 },
  },
  fade: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
  },
  "top-in-bottom-out": {
    initial: { y: "-100%", opacity: 0 },
    animate: { y: 0, opacity: 1 },
    exit: { y: "100%", opacity: 0 },
  },
  "left-in-right-out": {
    initial: { x: "-100%", opacity: 0 },
    animate: { x: 0, opacity: 1 },
    exit: { x: "100%", opacity: 0 },
  },
}

function VideoModal({
  isOpen,
  onClose,
  videoSrc,
  animationStyle,
}: {
  isOpen: boolean
  onClose: () => void
  videoSrc: string
  animationStyle: AnimationStyle
}) {
  const selectedAnimation = animationVariants[animationStyle]

  // Handle Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose()
      }
    }
    if (isOpen) {
      document.addEventListener("keydown", handleKeyDown)
      document.body.style.overflow = "hidden"
    }
    return () => {
      document.removeEventListener("keydown", handleKeyDown)
      document.body.style.overflow = ""
    }
  }, [isOpen, onClose])

  if (typeof window === "undefined") return null

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/70 backdrop-blur-md"
          onClick={onClose}
        >
          {/* Close Button - Fixed position at top right */}
          <motion.button
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ delay: 0.1 }}
            className="fixed top-6 right-6 z-[10000] flex items-center justify-center w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 text-white backdrop-blur-md transition-all border border-white/20 shadow-xl"
            onClick={(e) => {
              e.stopPropagation()
              onClose()
            }}
            aria-label="Close video"
          >
            <X className="w-6 h-6" />
          </motion.button>

          {/* Video Container */}
          <motion.div
            {...selectedAnimation}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            className="relative w-full max-w-5xl mx-4 aspect-video"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="size-full overflow-hidden rounded-2xl border-2 border-white/20 shadow-2xl bg-black">
              <iframe
                src={videoSrc}
                title="Video player"
                className="size-full"
                allowFullScreen
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              />
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  )
}

export function HeroVideoDialog({
  animationStyle = "from-center",
  videoSrc,
  thumbnailSrc,
  thumbnailAlt = "Video thumbnail",
  className,
}: HeroVideoProps) {
  const [isVideoOpen, setIsVideoOpen] = useState(false)
  const [mounted, setMounted] = useState(false)
  const pathname = usePathname()

  const closeVideo = useCallback(() => {
    setIsVideoOpen(false)
  }, [])

  // Mount check for portal
  useEffect(() => {
    setMounted(true)
  }, [])

  // Close dialog when route changes
  useEffect(() => {
    setIsVideoOpen(false)
  }, [pathname])

  return (
    <div className={cn("relative", className)}>
      {/* Thumbnail Button */}
      <button
        type="button"
        aria-label="Play video"
        className="group relative w-full cursor-pointer border-0 bg-transparent p-0"
        onClick={() => setIsVideoOpen(true)}
      >
        <img
          src={thumbnailSrc}
          alt={thumbnailAlt}
          width={1920}
          height={1080}
          className="w-full rounded-2xl shadow-lg transition-all duration-300 ease-out group-hover:brightness-75 group-hover:scale-[1.02]"
        />
        {/* Play Button Overlay */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="flex items-center justify-center w-20 h-20 rounded-full bg-white/20 backdrop-blur-sm transition-all duration-300 group-hover:scale-110 group-hover:bg-white/30">
            <div className="flex items-center justify-center w-14 h-14 rounded-full bg-[var(--spiritual-green)] shadow-lg">
              <Play className="w-6 h-6 text-white fill-white ml-1" />
            </div>
          </div>
        </div>
      </button>

      {/* Video Modal - Rendered via Portal */}
      {mounted && (
        <VideoModal
          isOpen={isVideoOpen}
          onClose={closeVideo}
          videoSrc={videoSrc}
          animationStyle={animationStyle}
        />
      )}
    </div>
  )
}
