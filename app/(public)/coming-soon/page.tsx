"use client";

import Image from "next/image";
import { Sparkles, Flame } from "lucide-react";

export default function ComingSoonPage() {
    return (
        <main className="relative min-h-screen w-full flex flex-col items-center justify-center overflow-hidden bg-[#fbfdf7] text-[#1a5d1a] selection:bg-[#1a5d1a]/10 font-sans">

            {/* Background Layer */}
            <div className="absolute inset-0 z-0">
                <Image
                    src="/assets/images/vinaygar.png"
                    alt="Sacred Vedic Ritual Background"
                    fill
                    className="object-cover object-center scale-105 opacity-40"
                    priority
                    quality={100}
                />
                {/* Gradient Overlay for spiritual theme (Light Green to Yellow) */}
                <div className="absolute inset-0 bg-gradient-to-br from-[#efffef]/90 via-[#f0fdf4]/80 to-[#fefce8]/90 mix-blend-overlay" />
                <div className="absolute inset-0 bg-gradient-to-t from-white/40 via-transparent to-white/20" />
            </div>

            {/* Floating Spiritual Elements (Animated) */}
            <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
                {/* Floating Deepams/Flames */}
                <div className="absolute top-1/4 left-1/6 animate-bounce duration-[3000ms] opacity-20">
                    <Flame className="w-8 h-8 text-[#d4a017] drop-shadow-[0_0_10px_rgba(212,160,23,0.5)]" />
                </div>
                <div className="absolute top-3/4 right-1/6 animate-bounce duration-[4000ms] delay-700 opacity-20">
                    <Flame className="w-10 h-10 text-[#d4a017] drop-shadow-[0_0_15px_rgba(212,160,23,0.5)]" />
                </div>
                <div className="absolute bottom-1/4 left-1/3 animate-pulse duration-[5000ms] opacity-15">
                    <Sparkles className="w-6 h-6 text-[#1a5d1a]" />
                </div>
                <div className="absolute top-1/3 right-1/4 animate-pulse duration-[4500ms] delay-1000 opacity-15">
                    <Sparkles className="w-5 h-5 text-[#4a6b4a]" />
                </div>
                {/* Decorative Circles */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] border border-[#d4a017]/5 rounded-full animate-spin-slow duration-[20s]" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] border border-[#1a5d1a]/5 rounded-full animate-spin-slow duration-[30s] reverse" />
            </div>

            {/* Content Layer */}
            <div className="relative z-10 container max-w-4xl mx-auto px-6 text-center animate-in fade-in slide-in-from-bottom-8 duration-1000 fill-mode-both">
                {/* Top Branding */}
                <div className="mb-8 md:mb-12 flex justify-center animate-in fade-in zoom-in duration-1000">
                    {/* Using text logo concept if image logo unavailable */}
                    <div className="inline-flex items-center gap-2 border border-[#1a5d1a]/10 bg-white/40 backdrop-blur-md px-6 py-3 rounded-full shadow-sm ring-1 ring-[#1a5d1a]/5 hover:scale-105 transition-transform duration-500">
                        <Sparkles className="w-4 h-4 text-[#d4a017] animate-pulse" />
                        <span className="text-xs font-bold tracking-[0.25em] uppercase text-[#1a5d1a]">Maathre</span>
                    </div>
                </div>

                {/* Main Heading */}
                <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-br from-[#1a5d1a] to-[#2f552f] drop-shadow-sm mb-6 leading-tight animate-in slide-in-from-bottom-4 duration-1000 delay-200">
                    Maathre is Arriving
                </h1>

                {/* Subheading */}
                <p className="text-xl md:text-3xl font-light text-[#4a6b4a] tracking-wide mb-8 md:mb-12 max-w-3xl mx-auto leading-relaxed animate-in slide-in-from-bottom-4 duration-1000 delay-300">
                    Sacred Rituals. Timeless Traditions. <br className="hidden md:block" />
                    <span className="text-[#d4a017] font-semibold">Divine Experience.</span>
                </p>

                {/* Taglines / Features */}
                <div className="flex flex-col md:flex-row items-center justify-center gap-4 md:gap-8 text-sm md:text-base text-[#5c7a5c] font-medium tracking-wider uppercase mb-12 opacity-90 animate-in slide-in-from-bottom-4 duration-1000 delay-500">
                    <span className="hover:text-[#1a5d1a] transition-colors cursor-default hover:scale-105 transform duration-300">Connecting You to Vedic Power</span>
                    <span className="hidden md:inline-block w-1.5 h-1.5 rounded-full bg-[#d4a017] animate-pulse" />
                    <span className="hover:text-[#1a5d1a] transition-colors cursor-default hover:scale-105 transform duration-300">Authentic Homams Online</span>
                    <span className="hidden md:inline-block w-1.5 h-1.5 rounded-full bg-[#d4a017] animate-pulse" />
                    <span className="hover:text-[#1a5d1a] transition-colors cursor-default hover:scale-105 transform duration-300">Tradition Meets Tech</span>
                </div>

                {/* Elegant Divider */}
                <div className="w-32 h-[1px] bg-gradient-to-r from-transparent via-[#1a5d1a]/20 to-transparent mx-auto mb-12 animate-scale-x duration-1000 delay-700" />

                {/* CTA / Badge */}
                <div className="inline-block relative group cursor-pointer animate-in fade-in zoom-in duration-1000 delay-700">
                    <div className="absolute -inset-1 bg-gradient-to-r from-[#1a5d1a]/20 to-[#d4a017]/20 rounded-full blur opacity-40 group-hover:opacity-60 transition duration-1000 animate-pulse"></div>
                    <div className="relative px-8 py-3.5 bg-[#1a5d1a] backdrop-blur-xl border border-[#d4a017]/30 rounded-full text-white font-semibold tracking-[0.2em] text-xs uppercase shadow-lg shadow-[#1a5d1a]/20 hover:bg-[#144414] transition-all duration-500 hover:scale-105 active:scale-95">
                        <span className="flex items-center gap-2">
                            Launching Soon <Flame className="w-3 h-3 text-[#d4a017] animate-flicker" />
                        </span>
                    </div>
                </div>

                {/* Footer */}
                <div className="mt-24 md:mt-32 text-[10px] md:text-xs text-[#5c7a5c] tracking-[0.2em] uppercase opacity-70 animate-in fade-in duration-1000 delay-1000">
                    Stay Tuned for Something Divine ✨
                </div>
            </div>
        </main >
    );
}
