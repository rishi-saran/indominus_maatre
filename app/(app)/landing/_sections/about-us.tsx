"use client";

import React from "react";
import { motion } from "framer-motion";
import { Heart, Users, Globe, Award } from "lucide-react";

const stats = [
  { value: "15K+", label: "Happy Devotees", icon: Heart },
  { value: "500+", label: "Verified Pandits", icon: Users },
  { value: "100+", label: "Sacred Temples", icon: Globe },
  { value: "4.9★", label: "User Rating", icon: Award },
];

export function AboutUsSection() {
  return (
    <section className="py-20">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left Column - Content */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <span className="inline-flex items-center gap-2 px-4 py-2 bg-[var(--spiritual-yellow-light)] rounded-full text-sm font-medium text-[var(--spiritual-green-dark)] mb-6">
              About Maathre
            </span>

            <h2 className="text-3xl md:text-4xl lg:text-5xl font-[var(--font-playfair)] text-[var(--spiritual-green-dark)] leading-tight mb-6">
              Bridging{" "}
              <span className="text-[var(--spiritual-green)] italic">
                Tradition
              </span>{" "}
              with Technology
            </h2>

            <p className="text-lg text-[var(--muted-foreground)] mb-6">
              Maathre is India&apos;s leading spiritual platform that connects devotees
              with authentic pandits, live temple darshans, and sacred rituals —
              all from the comfort of your home.
            </p>

            <p className="text-[var(--muted-foreground)] mb-8">
              Our mission is to make spirituality accessible to everyone.
              Whether you&apos;re seeking blessings for a new beginning, peace of
              mind through meditation, or guidance from experienced pandits,
              Maathre is your trusted spiritual companion.
            </p>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 gap-4">
              {stats.map((stat, index) => {
                const Icon = stat.icon;
                return (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-center gap-3 p-4 bg-white/60 backdrop-blur-sm rounded-2xl border border-white/50"
                  >
                    <div className="w-10 h-10 bg-[var(--spiritual-green-light)] rounded-xl flex items-center justify-center">
                      <Icon className="w-5 h-5 text-[var(--spiritual-green-dark)]" />
                    </div>
                    <div>
                      <p className="text-xl font-bold text-[var(--foreground)]">
                        {stat.value}
                      </p>
                      <p className="text-xs text-[var(--muted-foreground)]">
                        {stat.label}
                      </p>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>

          {/* Right Column - Image/Visual */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="relative"
          >
            {/* Main Image Container */}
            <div className="relative rounded-3xl overflow-hidden shadow-2xl shadow-black/10">
              <img
                src="https://images.unsplash.com/photo-1609766857041-ed402ea8069a?w=600&h=700&fit=crop"
                alt="Traditional Indian Temple"
                className="w-full h-[500px] object-cover"
              />
              {/* Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />

              {/* Floating Card */}
              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
                className="absolute bottom-6 left-6 right-6 glass rounded-2xl p-4"
              >
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-[var(--spiritual-green)] rounded-xl flex items-center justify-center">
                    <span className="text-2xl">🙏</span>
                  </div>
                  <div>
                    <p className="font-semibold text-[var(--foreground)]">
                      Join 15,000+ Devotees
                    </p>
                    <p className="text-sm text-[var(--muted-foreground)]">
                      Experience divine blessings today
                    </p>
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Decorative Element */}
            <div className="absolute -top-4 -right-4 w-24 h-24 bg-[var(--spiritual-yellow)]/30 rounded-full blur-2xl" />
            <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-[var(--spiritual-green)]/20 rounded-full blur-2xl" />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
