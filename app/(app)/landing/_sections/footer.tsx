"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  Facebook,
  Instagram,
  Twitter,
  Youtube,
  Mail,
  Phone,
  MapPin,
  Send,
} from "lucide-react";

const footerLinks = {
  services: [
    { label: "Puja Booking", href: "#" },
    { label: "Virtual Darshan", href: "#" },
    { label: "Find Pandit", href: "#" },
    { label: "Homam & Havans", href: "#" },
    { label: "Parihara", href: "#" },
  ],
  quickLinks: [
    { label: "About Us", href: "#" },
    { label: "Services", href: "#" },
    { label: "My Account", href: "#" },
    { label: "Privacy Policy", href: "#" },
    { label: "Terms and Conditions", href: "#" },
  ],
};

const socialLinks = [
  { icon: Facebook, href: "#", label: "Facebook" },
  { icon: Instagram, href: "#", label: "Instagram" },
  { icon: Twitter, href: "#", label: "Twitter" },
  { icon: Youtube, href: "#", label: "YouTube" },
];

export function FooterSection() {
  const [email, setEmail] = useState("");

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Subscribe:", email);
    setEmail("");
    // Add subscription logic here
  };

  return (
    <footer className="relative mt-20 overflow-hidden">
      {/* Background Gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[var(--spiritual-gold)]/10 to-[var(--spiritual-gold)]/20" />
      
      {/* Floating Glow Orbs */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-[var(--spiritual-green)]/10 rounded-full blur-[150px]" />
      <div className="absolute bottom-0 right-0 w-80 h-80 bg-[var(--spiritual-gold)]/15 rounded-full blur-[120px]" />

      <div className="relative z-10">
        {/* Top Section - Newsletter */}
        <div className="border-b border-[var(--border)]">
          <div className="max-w-7xl mx-auto px-4 md:px-8 py-12">
            <div className="grid lg:grid-cols-2 gap-8 items-center">
              {/* Tagline */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
              >
                <h3 className="text-2xl md:text-3xl font-[var(--font-playfair)] text-[var(--spiritual-green-dark)] mb-3">
                  We don&apos;t just book packages
                </h3>
                <p className="text-[var(--muted-foreground)]">
                  We serve peace of mind. From the moment you book until your
                  pooja event, we handle everything with attention and transparency.
                </p>
              </motion.div>

              {/* Newsletter Form */}
              <motion.form
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                onSubmit={handleSubscribe}
                className="flex gap-3"
              >
                <div className="flex-1 relative">
                  <div className="glass rounded-full p-1 border border-white/30">
                    <div className="flex items-center bg-white/80 rounded-full px-5 py-3">
                      <Mail className="w-5 h-5 text-[var(--muted-foreground)]" />
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Enter your email"
                        required
                        className="flex-1 ml-3 bg-transparent text-[var(--foreground)] placeholder:text-[var(--muted-foreground)] focus:outline-none"
                      />
                    </div>
                  </div>
                </div>
                <button
                  type="submit"
                  className="px-6 py-3 bg-[var(--spiritual-green-dark)] text-white rounded-full font-semibold flex items-center gap-2 hover:bg-[#2E7D32] transition-all shadow-lg hover:shadow-xl"
                >
                  Subscribe
                  <Send className="w-4 h-4" />
                </button>
              </motion.form>
            </div>
          </div>
        </div>

        {/* Main Footer Content */}
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-12">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-10">
            {/* Brand Column */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="lg:col-span-1"
            >
              <h3 className="text-3xl font-[var(--font-playfair)] italic text-[var(--spiritual-green-dark)] mb-4">
                Maathre
              </h3>
              <p className="text-[var(--muted-foreground)] mb-6">
                Your trusted spiritual companion. Experience divine blessings
                in a modern way.
              </p>

              {/* Social Links */}
              <div className="flex items-center gap-3">
                {socialLinks.map((social, index) => {
                  const Icon = social.icon;
                  return (
                    <motion.a
                      key={index}
                      href={social.href}
                      aria-label={social.label}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                      className="w-10 h-10 glass rounded-full flex items-center justify-center text-[var(--muted-foreground)] hover:text-[var(--spiritual-green-dark)] hover:bg-[var(--spiritual-green-light)]/50 transition-colors border border-white/30"
                    >
                      <Icon className="w-5 h-5" />
                    </motion.a>
                  );
                })}
              </div>
            </motion.div>

            {/* Quick Links */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
            >
              <h4 className="font-semibold text-[var(--foreground)] mb-4">
                Quick Links
              </h4>
              <ul className="space-y-3">
                {footerLinks.quickLinks.map((link, index) => (
                  <li key={index}>
                    <a
                      href={link.href}
                      className="text-sm text-[var(--muted-foreground)] hover:text-[var(--spiritual-green-dark)] transition-colors"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </motion.div>

            {/* Services Links */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
            >
              <h4 className="font-semibold text-[var(--foreground)] mb-4">
                Services
              </h4>
              <ul className="space-y-3">
                {footerLinks.services.map((link, index) => (
                  <li key={index}>
                    <a
                      href={link.href}
                      className="text-sm text-[var(--muted-foreground)] hover:text-[var(--spiritual-green-dark)] transition-colors"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </motion.div>

            {/* Contact Column */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
            >
              <h4 className="font-semibold text-[var(--foreground)] mb-4">
                Contact
              </h4>
              <div className="space-y-4">
                <div className="flex items-start gap-3 text-sm text-[var(--muted-foreground)]">
                  <MapPin className="w-4 h-4 text-[var(--spiritual-green)] mt-0.5 flex-shrink-0" />
                  <span>#000, Building, Street<br />Area, City</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-[var(--muted-foreground)]">
                  <Phone className="w-4 h-4 text-[var(--spiritual-green)]" />
                  <span>+91 9876543210</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-[var(--muted-foreground)]">
                  <Mail className="w-4 h-4 text-[var(--spiritual-green)]" />
                  <a
                    href="mailto:info@maathre.com"
                    className="hover:text-[var(--spiritual-green-dark)] transition-colors"
                  >
                    info@maathre.com
                  </a>
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-[var(--border)]">
          <div className="max-w-7xl mx-auto px-4 md:px-8 py-6">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <p className="text-sm text-[var(--muted-foreground)]">
                Copyright © {new Date().getFullYear()} Maathre. All rights reserved.
              </p>
              <p className="text-sm text-[var(--muted-foreground)]">
                Made with 🙏 in India
              </p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
