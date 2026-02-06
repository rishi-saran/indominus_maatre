"use client";

import React from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { Sparkles } from "lucide-react";
import Link from "next/link";

const services = [
  {
    id: 1,
    title: "Rudrabhishekam",
    description: "Holy abhishekam to Lord Shiva",
    image: "/services/chanting/rudrabishegam.png",
    href: "/services/homam/rudrabhishekam",
  },
  {
    id: 2,
    title: "Engagement",
    description: "Blessings for your engagement ceremony",
    image: "/services/homam/engagement.png",
    href: "/services/homam/engagement",
  },
  {
    id: 3,
    title: "Ganapathi Homam",
    description: "Seek Lord Ganesha's blessings",
    image: "/services/homam/Ganapathi Homam.png",
    href: "/services/homam/ganapathi-homam",
  },
  {
    id: 4,
    title: "Marriage (Vivaham)",
    description: "Sacred union of two souls with divine blessings",
    image: "/services/homam/marriage.png",
    href: "/services/homam/marriage-vivaham",
  },
];

export function PopularServicesSection() {
  const router = useRouter();

  const handleServiceClick = (href: string) => {
    router.push(href);
  };

  return (
    <section className="py-20 relative overflow-hidden">
      {/* Floating Glow Orbs */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-[var(--spiritual-green)]/20 rounded-full blur-[100px] animate-pulse" />
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-[var(--spiritual-gold)]/15 rounded-full blur-[120px]" />

      <div className="max-w-7xl mx-auto px-4 md:px-8 relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-14"
        >
          <span className="inline-flex items-center gap-2 px-5 py-2.5 glass rounded-full text-sm font-medium text-[var(--spiritual-green-dark)] mb-4 border border-white/30">
            <Sparkles className="w-4 h-4" />
            Popular Services
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-[var(--font-playfair)] text-[var(--spiritual-green-dark)] mb-4">
            Explore Our Sacred Offerings
          </h2>
          <p className="text-[var(--muted-foreground)] max-w-2xl mx-auto text-lg">
            From traditional pujas to sacred homams, discover spiritual services
            for your divine journey.
          </p>
        </motion.div>

        {/* Services Grid - show only 4 items */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {services.slice(0, 4).map((service, index) => (
            <motion.div
              key={service.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.05 }}
            >
              <Link href={service.href} className="block h-full">
                <div className="group h-full rounded-2xl border border-[#cfd8a3] bg-white ring-1 ring-[#e3ebbd] transition-all hover:-translate-y-1 hover:shadow-lg hover:border-[#2f9e44] hover:ring-[#2f9e44] hover:bg-[#eef4cf] flex flex-col p-0 cursor-pointer overflow-hidden">
                  {/* Edge-to-edge Image Container */}
                  <div className="aspect-square w-full overflow-hidden bg-[#f4f7e6] relative border-b border-[#cfd8a3]/30">
                    <img
                      src={service.image}
                      alt={service.title}
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>

                  {/* Title + Description */}
                  <div className="flex-1 p-5">
                    <h2 className="mb-2 text-lg font-semibold text-[#2f3a1f] line-clamp-1 text-center">
                      {service.title}
                    </h2>

                    <p className="text-sm leading-relaxed text-[#4f5d2f] line-clamp-2 text-center">
                      {service.description}
                    </p>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        {/* View All Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mt-12"
        >
          <Link href="/services">
            <button className="px-8 py-3 bg-[#2f9e44] text-white rounded-lg font-semibold hover:bg-[#268a3b] transition-all duration-300 shadow-lg hover:shadow-xl hover:-translate-y-1">
              View All Services →
            </button>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
