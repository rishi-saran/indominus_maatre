"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { Navbar } from "../../(components)/navbar";
import { VideoCard } from "../../(components)/video-dialog";
import { Search, ArrowRight, Star, Users, BadgeCheck } from "lucide-react";
import { TextAnimate } from "../../../components/ui/text-animate";
import { ShineBorder } from "../../../components/ui/shine-border";
import { ViewCartButton } from "@/components/ui/view-cart";
import {
  PopularServicesSection,
  AboutUsSection,
  CustomerReviewsSection,
  FooterSection,
} from "./_sections";

export default function LandingPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const router = useRouter();

  const handleExplore = () => {
    // Service mapping for direct navigation
    const serviceMap: Record<string, string> = {
      "aavahanthi homam": "/services/homam/aavahanthi-homam",
      "aavani avittam": "/services/homam/aavani-avittam",
      "abdha poorthi ayush homam": "/services/homam/abdha-poorthi-ayush-homam",
      "ayusha homam": "/services/homam/ayusha-homam",
      "ayushya homam": "/services/homam/ayusha-homam",
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

    const lowerQuery = searchQuery.toLowerCase().trim();
    const detailPage = serviceMap[lowerQuery];

    if (detailPage) {
      router.push(detailPage);
    } else if (searchQuery.trim()) {
      router.push(`/services?search=${encodeURIComponent(searchQuery)}`);
    } else {
      router.push("/services");
    }
  };

  return (
    <div className="min-h-screen relative">
      {/* Navbar - always visible */}
      <Navbar />
      <ViewCartButton redirectTo="/cart" />

      {/* Main Landing Content */}
      <section className="min-h-screen relative z-10 pt-28">
        <div className="max-w-7xl mx-auto px-4 md:px-8 pb-16">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6"
          >
            <span className="inline-flex items-center gap-2 px-4 py-2 bg-[var(--spiritual-yellow-light)] border border-[var(--spiritual-yellow)]/30 rounded-full text-sm font-medium text-[var(--spiritual-green-dark)]">
              <span className="w-2 h-2 bg-[var(--spiritual-green)] rounded-full animate-pulse" />
              INDIA&apos;S #1 SPIRITUAL PLATFORM
            </span>
          </motion.div>

          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-start">
            {/* Left Column */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              {/* Heading */}
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-[var(--font-playfair)] leading-tight mb-6">
                <TextAnimate
                  animation="blurInUp"
                  by="word"
                  duration={0.5}
                  className="text-[var(--spiritual-green-dark)] italic inline-block"
                >
                  Connect with the
                </TextAnimate>
                <br />
                <TextAnimate
                  variants={{
                    hidden: {
                      opacity: 0,
                      y: 30,
                      rotate: 45,
                      scale: 0.5,
                    },
                    show: (i) => ({
                      opacity: 1,
                      y: 0,
                      rotate: 0,
                      scale: 1,
                      transition: {
                        delay: i * 0.1 + 0.3,
                        duration: 0.4,
                        y: {
                          type: "spring",
                          damping: 12,
                          stiffness: 200,
                          mass: 0.8,
                        },
                        rotate: {
                          type: "spring",
                          damping: 8,
                          stiffness: 150,
                        },
                        scale: {
                          type: "spring",
                          damping: 10,
                          stiffness: 300,
                        },
                      },
                    }),
                  }}
                  by="character"
                  className="text-[var(--spiritual-green)] font-semibold inline-block"
                >
                  Divine Energy
                </TextAnimate>
              </h2>

              {/* Description */}
              <TextAnimate
                animation="slideUp"
                by="word"
                delay={0.8}
                duration={0.5}
                as="p"
                className="text-lg text-[var(--muted-foreground)] mb-8 max-w-lg"
              >
                Book vedic rituals, join live darshans, and shop authentic
                spiritual products. Experience divinity in a modern way.
              </TextAnimate>

              {/* Search Bar */}
              <div className="flex gap-3 mb-8 max-w-3xl">
                {/* Search Input with Shine Border */}
                <div className="flex-1 relative overflow-hidden rounded-full">
                  <ShineBorder
                    shineColor={["#4CAF50", "#8BC34A", "#FFC107", "#FF9800"]}
                    duration={8}
                    borderWidth={2}
                  />
                  <div className="relative bg-gradient-to-r from-[#E8F5E9] to-[#F1F8E9] rounded-full p-1">
                    <div className="flex items-center bg-white rounded-full px-6 py-3.5">
                      <Search className="w-5 h-5 text-[var(--muted-foreground)]" />
                      <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            handleExplore();
                          }
                        }}
                        placeholder="Search for Puja, Pandit, or Temple..."
                        className="flex-1 ml-3 bg-transparent text-[var(--foreground)] placeholder:text-[var(--muted-foreground)] focus:outline-none"
                      />
                    </div>
                  </div>
                </div>

                {/* Explore Button */}
                <button 
                  onClick={handleExplore}
                  className="px-8 py-4 bg-[var(--spiritual-green-dark)] text-white rounded-full font-semibold flex items-center gap-2 hover:bg-[#2E7D32] transition-all shadow-lg hover:shadow-xl hover:scale-105"
                >
                  Explore
                  <ArrowRight className="w-5 h-5" />
                </button>
              </div>

              {/* Trust Indicators */}
              <div className="flex flex-wrap items-center gap-6">
                <div className="flex items-center gap-2">
                  <div className="w-10 h-10 bg-[var(--spiritual-yellow-light)] rounded-full flex items-center justify-center">
                    <Users className="w-5 h-5 text-[var(--spiritual-gold)]" />
                  </div>
                  <div>
                    <p className="text-xl font-bold text-[var(--foreground)]">
                      15k+
                    </p>
                    <p className="text-xs text-[var(--muted-foreground)]">
                      Happy Devotees
                    </p>
                  </div>
                </div>

                <div className="w-px h-10 bg-[var(--border)] hidden sm:block" />

                <div className="flex items-center gap-2">
                  <div className="w-10 h-10 bg-[var(--spiritual-green-light)] rounded-full flex items-center justify-center">
                    <BadgeCheck className="w-5 h-5 text-[var(--spiritual-green-dark)]" />
                  </div>
                  <div>
                    <p className="text-xl font-bold text-[var(--foreground)]">
                      500+
                    </p>
                    <p className="text-xs text-[var(--muted-foreground)]">
                      Verified Pandits
                    </p>
                  </div>
                </div>

                <div className="w-px h-10 bg-[var(--border)] hidden sm:block" />

                <div className="flex items-center gap-2">
                  <div className="flex -space-x-2">
                    <div className="w-8 h-8 bg-[var(--spiritual-cream)] rounded-full border-2 border-white flex items-center justify-center">
                      <span className="text-xs">👤</span>
                    </div>
                    <div className="w-8 h-8 bg-[var(--spiritual-yellow-light)] rounded-full border-2 border-white flex items-center justify-center">
                      <span className="text-xs">👤</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className="w-3 h-3 fill-[var(--spiritual-gold)] text-[var(--spiritual-gold)]"
                      />
                    ))}
                    <span className="text-sm font-medium ml-1">
                      4.9/5 Rating
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Right Column - Featured Card */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
              className="relative w-full max-w-xl lg:max-w-[720px] mx-auto lg:mx-0"
            >
              <VideoCard
                videoSrc="https://www.youtube.com/embed/Fnir46ENxfg?autoplay=1"
                thumbnailSrc="https://img.youtube.com/vi/Fnir46ENxfg/maxresdefault.jpg"
                thumbnailAlt="Ganga Aarti Live at Kashi Vishwanath Temple"
                title="Ganga Aarti Live"
                subtitle="Kashi Vishwanath Temple"
                isLive={true}
                viewerCount="2.5k"
                animationStyle="from-center"
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Popular Services Section */}
      <PopularServicesSection />

      {/* About Us Section */}
      <AboutUsSection />

      {/* Customer Reviews Section */}
      <CustomerReviewsSection />

      {/* Footer Section */}
      <FooterSection />
    </div>
  );
}
