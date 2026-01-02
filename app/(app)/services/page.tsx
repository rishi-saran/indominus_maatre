"use client";

import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { HoverCard } from "@/components/ui/magic/hover-card";
import Image from "next/image";


const services = [
  {
    title: "Chanting",
    description:
      "Sacred Vedic chants performed with devotion to bring peace, clarity, and positive energy.",
    href: "/services/chanting",
    image: "/services/chanting1.svg",
  },
  {
    title: "Parihara Pooja",
    description:
      "Traditional remedies and poojas performed to resolve doshas and life obstacles.",
    href: "/services/parihara-pooja",
    image: "/services/parihara-pooja.svg",
  },
  {
    title: "Rituals / Homam",
    description:
      "Powerful fire rituals conducted by expert priests for spiritual upliftment.",
    href: "/services/homam",
    image: "/services/homam.svg",
  },
  {
    title: "Virtual",
    description:
      "Participate in sacred rituals and homams remotely through live virtual services.",
    href: "/services/virtual",
    image: "/services/virtual.svg",
  },
];



export default function ServicesPage() {
  return (
    <>
      {/* Services Section */}
      <section className="w-full px-6 pt-6 pb-16">
        {/* Header */}
        <div className="mx-auto mb-6 max-w-7xl text-center">
          <h1 className="text-4xl font-serif text-[#2f3a1f]">
            Sacred Services
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-sm text-[#4f5d2f]">
            Services that are attractive packages, easy to explore and flexible
            with minimal time and effort for booking.
          </p>
        </div>

        {/* Cards */}
        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4">

          {services.map((service) => (
            <Link key={service.title} href={service.href}>
              <HoverCard>
                <Card className="group h-full rounded-2xl border border-[#cfd8a3] bg-white ring-1 ring-[#e3ebbd]">

                  <CardContent className="flex h-full flex-col justify-between p-6">
                    
              {/* Image container */}
<div className="mb-6 overflow-hidden rounded-xl border border-[#cfd8a3] bg-[#eef4cf]">
  <Image
    src={service.image}
    alt={service.title}
    width={400}
    height={260}
    className="h-44 w-full object-cover transition-transform duration-300 group-hover:scale-105"
    unoptimized
  />
</div>

                    {/* Text */}
                    <div>
                      <h2 className="mb-2 text-xl font-semibold text-[#2f3a1f]">
                        {service.title}
                      </h2>
                      <p className="text-sm text-[#4f5d2f]">
                        {service.description}
                      </p>
                    </div>

                    {/* CTA */}
                    <div className="mt-6 flex items-center text-sm font-medium text-[#6b7a2c]">
                      View Service
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </div>
                  </CardContent>
                </Card>
              </HoverCard>
            </Link>
          ))}
        </div>

        {/* Divider line below cards */}
        <div className="mx-auto mt-16 h-px max-w-7xl bg-[#cfd8a3]" />
      </section>

      {/* Footer */}
      <footer className="w-full px-6 py-6">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 text-sm text-[#4f5d2f] sm:flex-row">
          <p>© 2026 Maathre Spiritual Services. All rights reserved.</p>

          <div className="flex gap-4">
            <Link href="/privacy-policy" className="hover:underline">
              Privacy Policy
            </Link>
            <Link href="/terms" className="hover:underline">
              Terms of Service
            </Link>
            <Link href="/support" className="hover:underline">
              Support
            </Link>
          </div>
        </div>
      </footer>
    </>
  );
}
