"use client";

import React from "react";
import { motion, MotionValue, useTransform } from "framer-motion";

interface BrandProps {
  scrollProgress?: MotionValue<number>;
  isNavbar?: boolean;
  className?: string;
}

export function Brand({ scrollProgress, isNavbar = false, className = "" }: BrandProps) {
  // If in navbar mode, just render the small logo with gradient
  if (isNavbar) {
    return (
      <span 
        className={`font-[var(--font-playfair)] text-2xl font-bold italic tracking-wide bg-gradient-to-r from-[#4CAF50] via-[#8BC34A] via-[#FFC107] to-[#FF9800] bg-clip-text text-transparent ${className}`}
      >
        Maathre
      </span>
    );
  }

  // Hero mode with scroll-based transform
  const scale = scrollProgress
    ? useTransform(scrollProgress, [0, 0.3], [1, 0.25])
    : 1;
  
  const y = scrollProgress
    ? useTransform(scrollProgress, [0, 0.3], ["0vh", "-42vh"])
    : "0vh";
  
  const x = scrollProgress
    ? useTransform(scrollProgress, [0, 0.3], ["0vw", "-38vw"])
    : "0vw";
  
  const opacity = scrollProgress
    ? useTransform(scrollProgress, [0.25, 0.35], [1, 0])
    : 1;

  return (
    <motion.div
      className={`fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 pointer-events-none ${className}`}
      style={{
        scale,
        y,
        x,
        opacity,
      }}
    >
      <h1 
        className="font-[var(--font-playfair)] text-[18vw] md:text-[16vw] lg:text-[14vw] font-black italic tracking-tight bg-gradient-to-r from-[#4CAF50] via-[#8BC34A] via-50% via-[#FFC107] to-[#FF9800] bg-clip-text text-transparent drop-shadow-2xl"
      >
        Maathre
      </h1>
    </motion.div>
  );
}

export default Brand;
