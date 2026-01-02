"use client";

import React from "react";
import { motion } from "framer-motion";
import { Star, Quote } from "lucide-react";
import { Marquee } from "@/components/ui/marquee";

const reviews = [
  {
    id: 1,
    name: "Naveen",
    username: "@naveen",
    rating: 4,
    review: "Very well done. I'm very pleased with how easy it is to book a homam.",
  },
  {
    id: 2,
    name: "Priya",
    username: "@priya",
    rating: 5,
    review: "After a long search, I finally discovered Maathre. Simply outstanding!",
  },
  {
    id: 3,
    name: "Rajesh",
    username: "@rajesh",
    rating: 5,
    review: "Quality puja at my doorstep. The pandit was very knowledgeable.",
  },
  {
    id: 4,
    name: "Anita",
    username: "@anita",
    rating: 5,
    review: "Amazing experience! The entire process was seamless. Highly recommend!",
  },
  {
    id: 5,
    name: "Suresh",
    username: "@suresh",
    rating: 5,
    review: "The Navgraha Shanti puja brought so much positivity to my life.",
  },
  {
    id: 6,
    name: "Meera",
    username: "@meera",
    rating: 4,
    review: "Live darshan feature is incredible. Felt like I was at the temple.",
  },
];

const firstRow = reviews.slice(0, 3);
const secondRow = reviews.slice(3);

function ReviewCard({
  name,
  username,
  review,
  rating,
}: {
  name: string;
  username: string;
  review: string;
  rating: number;
}) {
  return (
    <div className="relative w-64 glass rounded-2xl p-4 border border-white/30 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
      {/* Quote Icon */}
      <Quote className="absolute top-3 right-3 w-5 h-5 text-[var(--spiritual-gold)]/30" />

      {/* Header with Avatar */}
      <div className="flex items-center gap-2 mb-3">
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[var(--spiritual-green)] via-[var(--spiritual-gold)] to-[var(--spiritual-green-dark)] flex items-center justify-center text-white font-bold text-sm">
          {name.charAt(0)}
        </div>
        <div>
          <h4 className="font-semibold text-sm text-[var(--foreground)]">{name}</h4>
          <p className="text-xs text-[var(--muted-foreground)]">{username}</p>
        </div>
      </div>

      {/* Review Text */}
      <p className="text-[var(--muted-foreground)] text-sm leading-relaxed mb-3 line-clamp-3">
        &ldquo;{review}&rdquo;
      </p>

      {/* Star Rating */}
      <div className="flex items-center gap-0.5">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            className={`w-3.5 h-3.5 ${
              i < rating
                ? "fill-[var(--spiritual-gold)] text-[var(--spiritual-gold)]"
                : "text-gray-300"
            }`}
          />
        ))}
      </div>
    </div>
  );
}

export function CustomerReviewsSection() {
  return (
    <section className="py-16 relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-[var(--spiritual-gold)]/10 rounded-full blur-[120px]" />

      <div className="relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-10 px-4"
        >
          <span className="inline-flex items-center gap-2 px-4 py-2 glass rounded-full text-sm font-medium text-[var(--spiritual-green-dark)] mb-4 border border-white/30">
            <Star className="w-4 h-4 fill-current" />
            Testimonials
          </span>
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-[var(--font-playfair)] text-[var(--spiritual-green-dark)] mb-3">
            Our Customer Reviews
          </h2>
          <p className="text-[var(--muted-foreground)] max-w-xl mx-auto text-sm">
            Hear from satisfied devotees who experienced the divine through Maathre.
          </p>
        </motion.div>

        {/* Marquee Reviews - Two Rows */}
        <div className="space-y-4">
          {/* First Row - Left to Right */}
          <Marquee pauseOnHover className="[--duration:30s] [--gap:1rem]">
            {firstRow.map((review) => (
              <ReviewCard key={review.id} {...review} />
            ))}
          </Marquee>

          {/* Second Row - Right to Left */}
          <Marquee pauseOnHover reverse className="[--duration:30s] [--gap:1rem]">
            {secondRow.map((review) => (
              <ReviewCard key={review.id} {...review} />
            ))}
          </Marquee>
        </div>

        {/* View All Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mt-10 px-4"
        >
          <button className="px-6 py-3 glass border border-[var(--spiritual-green)]/30 text-[var(--spiritual-green-dark)] rounded-full font-medium text-sm hover:bg-[var(--spiritual-green)] hover:text-white hover:border-transparent transition-all duration-300 shadow-lg">
            View All Reviews →
          </button>
        </motion.div>
      </div>
    </section>
  );
}
