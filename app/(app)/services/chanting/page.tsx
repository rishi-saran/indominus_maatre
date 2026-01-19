//(app)\services\chanting\page.tsx
"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowLeft } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { HoverCard } from "@/components/ui/magic/hover-card";
import { ViewCartButton } from "@/components/ui/view-cart";

const chantingServices = [
  {
    title: "Ayusha Homam",
    image: "/services/chanting/ayusha-homam.png",
    href: "/services/chanting/ayusha-homam",
  },
  {
    title: "Rudrabishekam",
    image: "/services/chanting/rudrabishegam.png",
    href: "/services/chanting/rudrabishekam",
  },
];


const categories = [
  { name: "Chanting", href: "/services/chanting", active: true },
  { name: "Parihara Pooja", href: "/services/parihara-pooja" },
  { name: "Rituals / Homam", href: "/services/homam" },
  { name: "Virtual", href: "/services/virtual" },
];

export default function ChantingPage() {
  return (
    <>
      <ViewCartButton redirectTo="/cart" />
      <section className="w-full px-6 pt-4 pb-12">
      {/* Page Title */}
      <div className="mx-auto mb-10 max-w-5xl text-center">
        <div className="mx-auto mb-3 h-px w-24 bg-[#cfd8a3]" />
        <h1 className="text-3xl font-serif tracking-wide text-[#2f3a1f]">
          CHANTING
        </h1>
        <div className="mx-auto mt-3 h-px w-24 bg-[#cfd8a3]" />
      </div>

      {/* Cards */}
      <div className="mx-auto grid max-w-2xl grid-cols-1 gap-8 sm:grid-cols-2">
        {chantingServices.map((service) => (
          <Link key={service.title} href={service.href}>
            <Card className="group aspect-square cursor-pointer rounded-2xl border border-[#cfd8a3] bg-white ring-1 ring-[#e3ebbd] transition-all hover:-translate-y-1 hover:shadow-lg hover:border-[#2f9e44] hover:ring-[#2f9e44] hover:bg-[#eef4cf]">
              <CardContent className="flex h-full flex-col p-4">
                
                {/* Image */}
                <div className="mb-4 flex flex-1 items-center justify-center overflow-hidden rounded-xl border border-[#cfd8a3] bg-[#eef4cf]">
                  <Image
                    src={service.image}
                    alt={service.title}
                    width={260}
                    height={160}
                    className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                    unoptimized
                  />
                </div>

                {/* Title */}
                <h2 className="mt-auto text-center text-lg font-semibold text-[#2f3a1f]">
                  {service.title}
                </h2>

              </CardContent>
            </Card>
          </Link>
        ))}
      </div>


      {/* Category Switch */}
      <div className="mx-auto mt-14 flex max-w-5xl flex-wrap justify-center gap-4">
        {categories.map((cat) => (
          <Link
            key={cat.name}
            href={cat.href}
            className={`rounded-full px-6 py-2 text-sm font-medium transition ${
             cat.active
  ? "bg-[#2f9e44] text-white shadow-sm"

                : "border border-[#cfd8a3] bg-white text-[#4f5d2f] hover:bg-[#eef4cf]"
            }`}
          >
            {cat.name}
          </Link>
        ))}
      </div>
    </section>    </>  );
}
