import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Playfair_Display } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Maathre - India's #1 Spiritual Platform",
  description: "Book vedic rituals, join live darshans, and shop authentic spiritual products. Experience divinity in a modern way.",
  keywords: ["spiritual", "puja", "pandit", "temple", "vedic", "rituals", "darshan", "hindu"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${playfair.variable} antialiased min-h-screen bg-gradient-to-r from-[#d6f0a8] via-[#eaf5b5] to-[#ffe6a3]`}
        suppressHydrationWarning
      >
        {children}
      </body>
    </html>
  );
}
