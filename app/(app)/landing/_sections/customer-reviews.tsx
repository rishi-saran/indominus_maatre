"use client";

import React from "react";
import { motion } from "framer-motion";
import { Star } from "lucide-react";

const reviews = [
  {
    id: 1,
    name: "Ananya P.",
    location: "Bangalore, India",
    rating: 5,
    review: "The astrology reading gave me so much clarity regarding my career path. The pundit was very knowledgeable and kind.",
    avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuBl66nILf9gI5C3nOEwDyWT0pkXBGSUgev1qdB-XF5evUxejDb2bXnTzqO3U_P-BpJ1aPFMqa0z5XOA6HF8L8CYWYEm72bxts6MeR0zEuPFYgRrDP_rECormJTwIhf_5WOG0FePd81yFwZUkgnkrfqJId71hGv_7j8NHbVSpOtAd7DKge6nmZpS6VNJ1itm3HS2QM8cPzKCta_FdWF-jOHd20Y1fOn1RnCWg094y5Ra-YFJ4DkXPxZYGOqIDAtlBJmTh-V5qM24JTyw"
  },
  {
    id: 2,
    name: "Rahul K.",
    location: "Mumbai, India",
    rating: 4,
    review: "Booking was seamless, but the pundit was slightly late to the video call. Otherwise a great experience.",
    avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuCiuxAbCmhmj9Dpt6oVBS-_kYFr4GX8OvDNIEUe9vVVZJymPyi9hdB3oRYgwdNGKOaddHXTmACVhzZwrsnZR94nRzYaXqtFD8UchGv0Bi3cdqD6Bianm7_n5TO8yIrk8yR4LbR8sAXBUk2hTGqsK9fqpUiXDS9YBa2aqY6jTX4chYpwJSCVKW5RMQ1YAJurp7pvTlHnXFKRtoYjSjtI7rugduO-Ds3a03CyWmNRauiPmJ6encvg7OUPE2EVRbbVbV7kUWUIJ_SEcbkL"
  },
  {
    id: 3,
    name: "Sita M.",
    location: "Varanasi, India",
    rating: 5,
    review: "Absolutely transformative puja session. Highly recommend maathre for spiritual needs. The energy was incredible.",
    avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuAJrcxOs4dtoRp4MRBpoN5-frckDJYpIr5z-fV2dbJmyKa-HtXp9c-GtBOsOKp4ir0Wb-UyWOSo76_gWPfKOibMH9Av0C5zDKKLLtHa6A26l5ooZY_OiH6xewoT5W_R9_XesHNyh4ndFHmbtbEDdcFGhmlznzDWpahbX56ltBMmw1chdds5XjRN1u1XHYoMEmlNepz_topLg8P7ARUz34bOll6eXa9vqhBttjQOHRY5Z1TkHqXGJ9pXW-n9IWTGCMjt9vIqAktD-7f6",
    images: [
      "https://lh3.googleusercontent.com/aida-public/AB6AXuD-7Jr0VcXCjiZUpFoWz3mx7qOkf8pQGvhvAcL9CKiS1RFwzmY_vO1OMwZqXE37HWk-2r8zR4s-AyTHd9EW7q_PvefTR_Wr6i11MF_Ii778XWNNE5EOnwn3Rv55eW6T27NgfZuy0E88pQZMdswb7LbwI5PcaAh087d6CwfTwVaEQDHniDrm_d-L2pOoGqUmfRanr9EHuvXL40pA8Wu0ZKsF65CTZggsYWLiZ58JqXbYunJaPfYGUvyw9cMgb8IlDr2Yc5h-7dkCGb18",
      "https://lh3.googleusercontent.com/aida-public/AB6AXuAS6dW5Vh_uRH06UNh1eAAlzrba2jYr64sLNKY2aTmyPl-0dJi9fib2vK_4mmw5l-rDvkYRYB-HQKuvcf73QUzlxWm_l2oU_xK6TldPT-t2GLh8W29gn667l5LiNiaM6Sa_J1M3OnoERJMh4dRp_c4NocahXuuad5lcw4kObJ-d2ko-RQ4nwu3u6XjPM8T_2QzVG98ovwc_Hcm0BZ0O6I57JpwmQseA2k5HDu6_TO-Ez53EAZWds1g_pUoOKm-pKVXbfOSbtARfk7pv"
    ]
  },
  {
    id: 4,
    name: "Priya S.",
    location: "New Delhi, India",
    rating: 5,
    review: "The Live Darshan feature made me feel like I was physically present at Kashi. The video quality was impeccable.",
    initials: "PS"
  },
  {
    id: 5,
    name: "Vikram R.",
    location: "Chennai, India",
    rating: 5,
    review: "Excellent service! The pandit was punctual and performed the homam with great devotion. Very satisfied.",
    avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuBl66nILf9gI5C3nOEwDyWT0pkXBGSUgev1qdB-XF5evUxejDb2bXnTzqO3U_P-BpJ1aPFMqa0z5XOA6HF8L8CYWYEm72bxts6MeR0zEuPFYgRrDP_rECormJTwIhf_5WOG0FePd81yFwZUkgnkrfqJId71hGv_7j8NHbVSpOtAd7DKge6nmZpS6VNJ1itm3HS2QM8cPzKCta_FdWF-jOHd20Y1fOn1RnCWg094y5Ra-YFJ4DkXPxZYGOqIDAtlBJmTh-V5qM24JTyw"
  },
  {
    id: 6,
    name: "Lakshmi M.",
    location: "Hyderabad, India",
    rating: 4,
    review: "Great platform for booking pujas online. The process was smooth and the pandit was knowledgeable.",
    initials: "LM"
  },
  {
    id: 7,
    name: "Arjun K.",
    location: "Pune, India",
    rating: 5,
    review: "I booked Griha Pravesh puja and it was wonderfully done. Highly recommend Maathre to everyone.",
    avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuCiuxAbCmhmj9Dpt6oVBS-_kYFr4GX8OvDNIEUe9vVVZJymPyi9hdB3oRYgwdNGKOaddHXTmACVhzZwrsnZR94nRzYaXqtFD8UchGv0Bi3cdqD6Bianm7_n5TO8yIrk8yR4LbR8sAXBUk2hTGqsK9fqpUiXDS9YBa2aqY6jTX4chYpwJSCVKW5RMQ1YAJurp7pvTlHnXFKRtoYjSjtI7rugduO-Ds3a03CyWmNRauiPmJ6encvg7OUPE2EVRbbVbV7kUWUIJ_SEcbkL"
  },
  {
    id: 8,
    name: "Divya S.",
    location: "Kolkata, India",
    rating: 5,
    review: "The astrologer gave me accurate predictions and helpful guidance. Very happy with the consultation.",
    initials: "DS"
  }
];

const firstRow = reviews.slice(0, 2);
const secondRow = reviews.slice(2);

function ReviewCard({
  name,
  location,
  review,
  rating,
  avatar,
  initials,
  images,
}: {
  name: string;
  location: string;
  review: string;
  rating: number;
  avatar?: string;
  initials?: string;
  images?: string[];
}) {
  const fallbackInitials = React.useMemo(() => {
    if (initials && initials.trim()) return initials.trim();
    const parts = name.trim().split(/\s+/);
    const letters = parts.slice(0, 2).map((p) => p[0]?.toUpperCase()).filter(Boolean);
    return letters.join("") || "--";
  }, [initials, name]);

  return (
    <article className="bg-white p-6 rounded-2xl flex flex-col gap-4 hover:-translate-y-1 transition-all duration-300 ease-out border border-[#cfd8a3] ring-1 ring-[#e3ebbd] hover:border-[#2f9e44] hover:ring-[#2f9e44] hover:shadow-lg" style={{ height: '100%', minHeight: '320px' }}>
      {/* Star Rating */}
      <div className="flex gap-1 text-[var(--spiritual-gold)]">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            className={`w-4 h-4 ${
              i < rating ? "fill-current" : "text-gray-300"
            }`}
          />
        ))}
      </div>

      {/* Review Text */}
      <blockquote className="flex-1">
        <p className="text-gray-700 text-sm font-medium leading-relaxed" style={{ minHeight: '80px' }}>
          &ldquo;{review}&rdquo;
        </p>
      </blockquote>

      {/* Images (if any) - Always reserve space */}
      <div className="pb-2" style={{ minHeight: images && images.length > 0 ? '48px' : '0px' }}>
        {images && images.length > 0 && (
          <div className="flex gap-2">
            {images.map((img, idx) => (
              <div
                key={idx}
                className="w-10 h-10 rounded-lg bg-cover bg-center border border-gray-200"
                style={{ backgroundImage: `url("${img}")` }}
              />
            ))}
          </div>
        )}
      </div>

      {/* Divider */}
      <div className="h-px w-full bg-gray-200"></div>

      {/* User Info */}
      <div className="flex items-center gap-3">
        {avatar ? (
          <div
            className="w-10 h-10 rounded-full bg-cover bg-center ring-2 ring-gray-200"
            style={{ backgroundImage: `url("${avatar}")` }}
          />
        ) : (
          <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 font-bold text-xs ring-2 ring-gray-200">
            {fallbackInitials}
          </div>
        )}
        <div className="flex flex-col">
          <span className="text-xs font-bold text-gray-800">{name}</span>
          <span className="text-[10px] font-bold text-gray-500">{location}</span>
        </div>
      </div>
    </article>
  );
}

export function CustomerReviewsSection() {
  return (
    <section className="py-16 relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-[var(--spiritual-gold)]/10 rounded-full blur-[120px]" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 md:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-10"
        >
          <span className="inline-flex items-center gap-2 px-4 py-2 bg-[var(--spiritual-yellow-light)] rounded-full text-sm font-medium text-[var(--spiritual-green-dark)] mb-4 border border-[var(--spiritual-yellow)]/30">
            <Star className="w-4 h-4 fill-current" />
            Customer Reviews
          </span>
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-[var(--font-playfair)] text-[var(--spiritual-green-dark)] mb-3">
            What Our Devotees Say
          </h2>
          <p className="text-[var(--muted-foreground)] max-w-xl mx-auto text-sm">
            Hear from satisfied devotees who experienced the divine through Maathre.
          </p>
        </motion.div>

        {/* Reviews Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {reviews.map((review, index) => (
            <motion.div
              key={review.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              <ReviewCard {...review} />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
