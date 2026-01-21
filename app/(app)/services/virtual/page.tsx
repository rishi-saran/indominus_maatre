"use client";

import Link from "next/link";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { HoverCard } from "@/components/ui/magic/hover-card";
import { ViewCartButton } from "@/components/ui/view-cart";
import { virtualServices } from "@/lib/data/virtual-services";

const categories = [
  { name: "Chanting", href: "/services/chanting" },
  { name: "Parihara Pooja", href: "/services/parihara-pooja" },
  { name: "Rituals / Homam", href: "/services/homam" },
  { name: "Virtual", href: "/services/virtual", active: true },
];

export default function VirtualPage() {
  return (
    <>
      <ViewCartButton redirectTo="/cart" />
      <section className="w-full px-6 pt-4 pb-12">
      {/* Page Title */}
      <div className="mx-auto mb-10 max-w-5xl text-center">
        <div className="mx-auto mb-3 h-px w-24 bg-[#cfd8a3]" />
        <h1 className="text-3xl font-serif tracking-wide text-[#2f3a1f]">
          VIRTUAL
        </h1>
        <div className="mx-auto mt-3 h-px w-24 bg-[#cfd8a3]" />
      </div>

      {/* Cards grid matching Homam style */}
      <div className="mx-auto grid max-w-6xl grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {virtualServices.map((service) => (
          <HoverCard key={service.slug}>
            <Link href={`/services/virtual/${service.slug}`}>
            <Card className="group h-full rounded-2xl border border-[#cfd8a3] bg-white ring-1 ring-[#e3ebbd] transition-all hover:-translate-y-1 hover:shadow-lg hover:border-[#2f9e44] hover:ring-[#2f9e44] cursor-pointer">
              <CardContent className="flex h-80 flex-col items-center justify-between p-6">
                <div className="w-full h-52 overflow-hidden rounded-xl border border-[#cfd8a3] bg-[#eef4cf]">
                  <Image
                    src={service.image}
                    alt={service.title}
                    width={280}
                    height={320}
                    className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                    unoptimized
                  />
                </div>
                <h2 className="mt-4 text-center text-sm font-semibold text-[#2f3a1f] line-clamp-2">
                  {service.title}
                </h2>
              </CardContent>
            </Card>
            </Link>
          </HoverCard>
        ))}
      </div>

      {/* Results Counter */}
      <div className="mx-auto mt-8 max-w-5xl text-center">
        <p className="text-sm text-[#4f5d2f]">
          Showing 1-{virtualServices.length} of {virtualServices.length} results
        </p>
      </div>

      {/* Category Switch */}
      <div className="mx-auto mt-14 flex max-w-5xl flex-wrap justify-center gap-4">
        {categories.map((cat) => (
          <Link
            key={cat.name}
            href={cat.href}
            className={`rounded-full px-6 py-2 text-sm font-medium transition ${
              cat.active
                ? "bg-[#6b7a2c] text-white"
                : "border border-[#cfd8a3] bg-white text-[#4f5d2f] hover:bg-[#eef4cf]"
            }`}
          >
            {cat.name}
          </Link>
        ))}
      </div>

    </section>    </>  );
}
