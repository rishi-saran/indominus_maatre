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
            <Link key={service.slug} href={`/services/virtual/${service.slug}`} className="block h-full">
              <HoverCard>
                <Card className="group h-full rounded-2xl border border-[#cfd8a3] bg-white ring-1 ring-[#e3ebbd] transition-all hover:-translate-y-1 hover:shadow-lg hover:border-[#2f9e44] hover:ring-[#2f9e44] hover:bg-[#eef4cf] cursor-pointer">
                  <CardContent className="flex h-full flex-col p-0">
                    {/* Edge-to-edge Image Container */}
                    <div className="aspect-square w-full overflow-hidden rounded-t-2xl bg-[#f4f7e6] relative border-b border-[#cfd8a3]/30">
                      <Image
                        src={service.image}
                        alt={service.title}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        unoptimized
                      />
                    </div>

                    {/* Title Section - Fixed Height */}
                    <div className="flex h-20 items-center justify-center px-4">
                      <h2 className="text-center text-sm font-semibold leading-snug text-[#2f3a1f] line-clamp-2">
                        {service.title}
                      </h2>
                    </div>
                  </CardContent>
                </Card>
              </HoverCard>
            </Link>
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
              className={`rounded-full px-6 py-2 text-sm font-medium transition ${cat.active
                ? "bg-[#2f9e44] text-white shadow-sm"
                : "border border-[#cfd8a3] bg-white text-[#4f5d2f] hover:bg-[#eef4cf]"
                }`}
            >
              {cat.name}
            </Link>
          ))}
        </div>

      </section>    </>);
}
