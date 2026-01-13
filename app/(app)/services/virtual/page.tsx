"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowLeft } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { HoverCard } from "@/components/ui/magic/hover-card";


const virtualServices = [
  {
    title: "Rudra Ekadashi Homam",
    image: "/services/virtual/rudra-ekadashi-homam.png",
  },
];

const categories = [
  { name: "Chanting", href: "/services/chanting" },
  { name: "Parihara Pooja", href: "/services/parihara-pooja" },
  { name: "Rituals / Homam", href: "/services/homam" },
  { name: "Virtual", href: "/services/virtual", active: true },
];

export default function VirtualPage() {
  return (
    <section className="w-full px-6 pt-4 pb-10">
    
      {/* Page Title */}
      <div className="mx-auto mb-6 max-w-5xl text-center">
        <div className="mx-auto mb-3 h-px w-24 bg-[#cfd8a3]" />
        <h1 className="text-3xl font-serif tracking-wide text-[#2f3a1f]">
          VIRTUAL
        </h1>
        <div className="mx-auto mt-3 h-px w-24 bg-[#cfd8a3]" />
      </div>

      {/* Virtual Card */}
<div className="mx-auto flex max-w-5xl justify-center">
  {virtualServices.map((service) => (
    <HoverCard key={service.title}>
      <Card className="group w-full max-w-md cursor-pointer rounded-2xl border border-[#cfd8a3] bg-white ring-1 ring-[#e3ebbd] transition-all hover:-translate-y-1 hover:shadow-lg hover:border-[#2f9e44] hover:ring-[#2f9e44] hover:bg-[#eef4cf]">
        <CardContent className="flex flex-col p-5">
          
          {/* Image – SAME hover behavior */}
          <div className="mb-4 overflow-hidden rounded-2xl border border-[#cfd8a3] bg-[#eef4cf]">
            <Image
              src={service.image}
              alt={service.title}
              width={360}
              height={420}
              className="w-full object-contain transition-transform duration-300 group-hover:scale-105"
              unoptimized
            />
          </div>

          {/* Title */}
          <h2 className="mt-auto text-center text-base font-semibold text-[#2f3a1f]">
            {service.title}
          </h2>

        </CardContent>
      </Card>
    </HoverCard>
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

    </section>
  );
}
