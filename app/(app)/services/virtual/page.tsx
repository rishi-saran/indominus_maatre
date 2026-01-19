"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowLeft } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { HoverCard } from "@/components/ui/magic/hover-card";
import { ViewCartButton } from "@/components/ui/view-cart";

const virtualServices = [
  { title: "AAVAHANTHI HOMAM", image: "/services/virtual/Aavahanthi Homom.png" },
  { title: "Aavani Avittam", image: "/services/virtual/Aavani Avittam.png" },
  { title: "AYYAPPA POOJA", image: "/services/virtual/AYYAPPA POOJA.jpeg" },
  { title: "Badrakali Homam", image: "/services/virtual/Badrakali Homam.jpeg" },
  { title: "Chandi Homam (Sapta Sati)", image: "/services/virtual/Chandi Homam (Sapta Sati).jpeg" },
  { title: "Dhanvantari Homam", image: "/services/virtual/Dhanvantari Homam.jpeg" },
  { title: "DURGA HOMAM", image: "/services/virtual/DURGA HOMAM.jpeg" },
  { title: "Durga Shanti Homam", image: "/services/virtual/Durga Shanti Homam.jpeg" },
  {
    title: "Ganesh / Vinayagar Chathurthi Pooja Package",
    image: "/services/virtual/Ganesh  Vinayagar Chathurthi Pooja Package.png",
  },
  { title: "Haridra Ganapathy Homam", image: "/services/virtual/Haridra Ganapathy Homam.png" },
  { title: "Lakshmi Kubera Homam", image: "/services/virtual/Lakshmi Kubera Homam.jpeg" },
  { title: "Maha Mrutyunjaya Homam", image: "/services/virtual/Maha Mrutyunjaya Homam.jpeg" },
  { title: "Maha Sudarshana Homam", image: "/services/virtual/Maha Sudarshana Homam.jpeg" },
  { title: "MAHALAKSHMI HOMAM", image: "/services/virtual/MAHALAKSHMI HOMAM.jpeg" },
  { title: "MAHALAKSHMI PUJA", image: "/services/virtual/MAHALAKSHMI PUJA.jpeg" },
  { title: "Mrutyunjaya Homam", image: "/services/virtual/Mrutyunjaya Homam.jpeg" },
  { title: "Navagraha Homam", image: "/services/virtual/Navagraha Homam.jpeg" },
  { title: "Rudra Ekadashi Homam", image: "/services/virtual/rudra-ekadashi-homam.png" },
  { title: "Rudrabishekam", image: "/services/virtual/Rudrabishekam.jpeg" },
  { title: "Sadakshari Durga Gayatri Homam", image: "/services/virtual/Sadakshari Durga Gayatri Homam.jpeg" },
  { title: "SARASWATHI POOJAI", image: "/services/virtual/SARASWATHI POOJAI.png" },
  { title: "SATHYANARAYANA PUJA", image: "/services/virtual/SATHYANARAYANA PUJA.jpeg" },
  { title: "Shatru Samhara Homam", image: "/services/virtual/Shatru Samhara Homam.jpeg" },
  { title: "SIDHI VINAYAGA PUJA", image: "/services/virtual/SIDHI VINAYAGA PUJA.jpeg" },
  { title: "Swayamvara Parvathi Homam", image: "/services/virtual/Swayamvara Parvathi Homam.png" },
  {
    title: "Vancha Kalpalatha Maha Ganapathi Homam",
    image: "/services/virtual/Vancha Kalpalatha Maha Ganapathi Homam.png",
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
    <>
      <ViewCartButton redirectTo="/cart" />
      <section className="w-full px-6 pt-4 pb-12">
      {/* Back Button */}
      <div className="mb-2">
        <Link
          href="/services"
          className="inline-flex items-center text-sm font-medium text-[#5f6d2b] hover:underline"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Services
        </Link>
      </div>

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
        {virtualServices.map((service) => {
          // Map service titles to their routes
          const getServiceRoute = (title: string) => {
            const routes: Record<string, string> = {
              "AAVAHANTHI HOMAM": "/services/virtual/aavahanthi-homam",
              "Aavani Avittam": "/services/virtual/aavani-avittam",
              "AYYAPPA POOJA": "/services/virtual/ayyappa-pooja",
              "Badrakali Homam": "/services/virtual/badrakali-homam",
              "Chandi Homam (Sapta Sati)": "/services/virtual/chandi-homam-sapta-sati",
              "Dhanvantari Homam": "/services/virtual/dhanvantari-homam",
              "DURGA HOMAM": "/services/virtual/durga-homam",
              "Durga Shanti Homam": "/services/virtual/durga-shanti-homam",
              "Ganesh / Vinayagar Chathurthi Pooja Package": "/services/virtual/ganesh-vinayagar-chathurthi-pooja-package",
              "Haridra Ganapathy Homam": "/services/virtual/haridra-ganapathy-homam",
              "Lakshmi Kubera Homam": "/services/virtual/lakshmi-kubera-homam",
              "Maha Mrutyunjaya Homam": "/services/virtual/maha-mrutyunjaya-homam",
              "Maha Sudarshana Homam": "/services/virtual/maha-sudarshana-homam",
              "MAHALAKSHMI HOMAM": "/services/virtual/mahalakshmi-homam",
              "MAHALAKSHMI PUJA": "/services/virtual/mahalakshmi-puja",
              "Mrutyunjaya Homam": "/services/virtual/mrutyunjaya-homam",
              "Navagraha Homam": "/services/virtual/navagraha-homam",
              "Rudra Ekadashi Homam": "/services/virtual/rudra-ekadashi-homam",
              "Rudrabishekam": "/services/virtual/rudrabishekam",
              "Sadakshari Durga Gayatri Homam": "/services/virtual/sadakshari-durga-gayatri-homam",
              "SARASWATHI POOJAI": "/services/virtual/saraswathi-poojai",
              "SATHYANARAYANA PUJA": "/services/virtual/sathyanarayana-puja",
              "Shatru Samhara Homam": "/services/virtual/shatru-samhara-homam",
              "SIDHI VINAYAGA PUJA": "/services/virtual/sidhi-vinayaga-puja",
              "Swayamvara Parvathi Homam": "/services/virtual/swayamvara-parvathi-homam",
              "Vancha Kalpalatha Maha Ganapathi Homam": "/services/virtual/vancha-kalpalatha-maha-ganapathi-homam",
            };
            return routes[title] || "#";
          };
          
          const href = getServiceRoute(service.title);
          
          return (
          <HoverCard key={service.title}>
            <Link href={href}>
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
        );
        })}
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
