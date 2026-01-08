"use client";

import React from "react";
import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";

const services = [
  {
    id: 1,
    title: "Rudrabhishekam",
    description: "Holy abhishekam to Lord Shiva",
    image: "/popular/Abhishekam.png",
  },
  {
    id: 2,
    title: "Engagement",
    description: "Blessings for your engagement ceremony",
    image: "/popular/Engagement.png",
  },
  {
    id: 3,
    title: "Ganapathi Homam",
    description: "Seek Lord Ganesha's blessings",
    image: "/popular/Ganapathi Homom.png",
  },
  {
    id: 4,
    title: "Namakarana",
    description: "Baby naming ceremony with divine blessings",
    image: "/popular/Namakarana.png",
  },
];

export function PopularServicesSection() {
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
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {services.slice(0, 4).map((service, index) => (
            <motion.div
              key={service.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.05 }}
              whileHover={{ y: -8, scale: 1.02 }}
              className="group cursor-pointer"
            >
              {/* Glass Card */}
              <div className="relative rounded-3xl overflow-hidden glass border border-white/30 shadow-xl shadow-black/5 transition-all duration-300 group-hover:border-[var(--spiritual-green)]/30 group-hover:shadow-2xl group-hover:shadow-[var(--spiritual-green)]/10">
                {/* Image Container */}
                <div className="aspect-square relative overflow-hidden bg-gradient-to-br from-[var(--spiritual-cream)] to-[var(--spiritual-yellow-light)]">
                  {service.image ? (
                    <img
                      src={service.image}
                      alt={service.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                  ) : (
                    /* Placeholder - Replace with actual images later */
                    <div className="w-full h-full flex items-center justify-center">
                      <div className="text-center p-4">
                        <div className="w-16 h-16 mx-auto mb-3 rounded-2xl bg-gradient-to-br from-[var(--spiritual-green)]/20 to-[var(--spiritual-gold)]/20 flex items-center justify-center">
                          <span className="text-3xl">🙏</span>
                        </div>
                        <p className="text-xs text-[var(--muted-foreground)]">
                          Image coming soon
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Hover Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                  {/* Hover Text */}
                  <div className="absolute inset-x-0 bottom-0 p-4 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                    <p className="text-white/80 text-sm">
                      {service.description}
                    </p>
                  </div>
                </div>

                {/* Title Bar */}
                <div className="p-4 bg-white/50 backdrop-blur-sm border-t border-white/20">
                  <h3 className="font-semibold text-[var(--foreground)] text-center group-hover:text-[var(--spiritual-green-dark)] transition-colors">
                    {service.title}
                  </h3>
                </div>

                {/* Glow Effect on Hover */}
                <div className="absolute -inset-1 bg-gradient-to-r from-[var(--spiritual-green)]/20 via-[var(--spiritual-gold)]/10 to-[var(--spiritual-green)]/20 rounded-3xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10" />
              </div>
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
          <button className="px-8 py-4 bg-white/50 backdrop-blur-sm border border-[var(--spiritual-green)]/30 text-[var(--spiritual-green-dark)] rounded-full font-semibold hover:bg-[var(--spiritual-green)] hover:text-white hover:border-transparent transition-all duration-300 shadow-lg hover:shadow-xl hover:shadow-[var(--spiritual-green)]/20">
            View All Services →
          </button>
        </motion.div>
      </div>
    </section>
  );
}
