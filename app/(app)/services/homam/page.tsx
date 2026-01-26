"use client";

import Link from "next/link";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { HoverCard } from "@/components/ui/magic/hover-card";
import { ViewCartButton } from "@/components/ui/view-cart";
import { homamServices } from "@/data/homams";



const categories = [
  { name: "Chanting", href: "/services/chanting" },
  { name: "Parihara Pooja", href: "/services/parihara-pooja" },
  { name: "Rituals / Homam", href: "/services/homam", active: true },
  { name: "Virtual", href: "/services/virtual" }
];

export default function HomamPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;
  const totalPages = 3;

  const getPageItems = () => {
    const startIdx = (currentPage - 1) * itemsPerPage;
    return homamServices.slice(startIdx, startIdx + itemsPerPage);
  };

  const pageItems = getPageItems();

  return (
    <>
      <ViewCartButton redirectTo="/cart" />
      <section className="w-full px-6 pt-4 pb-12">

        <div className="mx-auto mb-10 max-w-5xl text-center">
          <div className="mx-auto mb-3 h-px w-24 bg-[#cfd8a3]" />
          <h1 className="text-3xl font-serif tracking-wide text-[#2f3a1f]">RITUALS / HOMAM</h1>
          <div className="mx-auto mt-3 h-px w-24 bg-[#cfd8a3]" />
        </div>

        <div className="mx-auto grid max-w-6xl grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">

          {pageItems.map((service, index) => (
            <Link key={`${service.title}-${index}`} href={service.href}>
              <HoverCard>
                <Card className="group h-full cursor-pointer rounded-2xl border border-[#cfd8a3] bg-white ring-1 ring-[#e3ebbd] transition-all hover:-translate-y-1 hover:shadow-lg hover:border-[#2f9e44] hover:ring-[#2f9e44] hover:bg-[#eef4cf]">
                  <CardContent className="flex h-full flex-col p-4">

                    {/* Fixed image */}
                    <div className="mb-4 h-44 overflow-hidden rounded-xl border border-[#cfd8a3] bg-[#eef4cf]">
                      <Image
                        src={service.image}
                        alt={service.title}
                        width={240}
                        height={240}
                        className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                        unoptimized
                      />
                    </div>


                    {/* Fixed-height title */}
                    <h2 className="mt-auto min-h-[3rem] flex items-center justify-center text-center text-sm font-semibold leading-snug text-[#2f3a1f] line-clamp-2">
                      {service.title}
                    </h2>

                  </CardContent>

                </Card>
              </HoverCard>
            </Link>

          ))}
        </div>

        <div className="mx-auto mt-8 max-w-5xl text-center">
          <p className="text-sm text-[#4f5d2f]">
            Showing {(currentPage - 1) * 20 + 1}-{Math.min(currentPage * 20, homamServices.length)} of {homamServices.length} results
          </p>
        </div>

        <div className="mx-auto mt-6 flex max-w-5xl items-center justify-center gap-3">
          <button
            onClick={() => currentPage > 1 && setCurrentPage(currentPage - 1)}
            disabled={currentPage === 1}
            className="flex items-center justify-center rounded-full border border-[#cfd8a3] bg-white p-2 text-[#4f5d2f] transition hover:bg-[#eef4cf] disabled:opacity-50"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>

          <div className="flex gap-2">
            {[1, 2, 3].map((page) => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`rounded-full px-4 py-2 text-sm font-medium transition ${currentPage === page
                  ? "bg-[#2f9e44] text-white shadow-sm"
                  : "border border-[#cfd8a3] bg-white text-[#4f5d2f] hover:bg-[#eef4cf]"
                  }`}
              >
                {page}
              </button>
            ))}
          </div>

          <button
            onClick={() =>
              currentPage < totalPages && setCurrentPage(currentPage + 1)
            }
            disabled={currentPage === totalPages}
            className="flex items-center justify-center rounded-full border border-[#cfd8a3] bg-white p-2 text-[#4f5d2f] transition hover:bg-[#eef4cf] disabled:opacity-50"
          >
            <ChevronRight className="h-5 w-5" />
          </button>

        </div>

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

      </section>
    </>
  );
}