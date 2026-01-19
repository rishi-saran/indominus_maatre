"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { HoverCard } from "@/components/ui/magic/hover-card";
import { ViewCartButton } from "@/components/ui/view-cart";

const allHomamServices = [
  // Page 1
  { title: "AAVAHANTHI HOMAM", image: "/services/homam/aavanthii-homam.png", href: "/services/homam/aavahanthi-homam" },
  { title: "Aavani Avittam", image: "/services/homam/aavani-avittam.png", href: "/services/homam/aavani-avittam" },
  { title: "ABDHA POORTHI AYUSH HOMAM", image: "/services/homam/abdha poorthi-ayush-homam.png", href: "/services/homam/abdha-poorthi-ayush-homam" },
  { title: "Ayusha Homam (also called Ayushya Homam)", image: "/services/homam/ayushya-homam.png", href: "/services/homam/ayusha-homam" },
  { title: "AYYAPPA POOJA", image: "/services/homam/ayyapra-pooja.png", href: "/services/homam/ayyappa-pooja" },
  { title: "Bheemaratha Shanti", image: "/services/homam/bheemerattha-shanti.png", href: "/services/homam/bheemaratha-shanti" },
  { title: "Bhoomi Puja", image: "/services/homam/bhoomi-puja.png", href: "/services/homam/bhoomi-puja" },
  { title: "Chandi Homam ( Sapta Sati )", image: "/services/homam/chandi-homam-satpa.png", href: "/services/homam/chandi-homam" },
  { title: "Dhanvantari Homam", image: "/services/homam/dhanvantari-homam.png", href: "/services/homam/dhanvantari-homam-1" },
  { title: "Dhanvantari Homam", image: "/services/homam/dhanvantari-homam-alt.png", href: "/services/homam/dhanvantari-homam-2" },
  { title: "DURGA HOMAM", image: "/services/homam/durga-homam.png", href: "/services/homam/durga-homam" },
  { title: "Durga Shanti Homam", image: "/services/homam/durga-shanti-homam.png", href: "/services/homam/durga-shanti-homam" },
  { title: "Engagement", image: "/services/homam/engagement.png", href: "/services/homam/engagement" },
  { title: "Ganapathi Homam", image: "/services/homam/ganapathi-homam.png", href: "/services/homam/ganapathi-homam" },
  { title: "Haridra Ganapathy Homam", image: "/services/homam/harini-ganapathy-homam.png", href: "/services/homam/haridra-ganapathy-homam" },
  { title: "HIRANYA SRARDHAM", image: "/services/homam/hiranya-shraadh.png", href: "/services/homam/hiranya-srardham" },
  { title: "Housewarming or Grihapravesham", image: "/services/homam/housewarming.png", href: "/services/homam/housewarming" },
  { title: "Jathakarma", image: "/services/homam/jathakarma.png", href: "/services/homam/jathakarma" },
  { title: "Kanakabishekam", image: "/services/homam/kanakabishekam.png", href: "/services/homam/kanakabishekam" },
  { title: "Lakshmi Kubera Homam", image: "/services/homam/lakshmi-kubera-homam.png", href: "/services/homam/lakshmi-kubera-homam" },

  // Page 2
  { title: "MAHALAKSHMI PUJA", image: "/services/homam/mahalakshmi-puja.png", href: "/services/homam/mahalakshmi-puja" },
  { title: "Marriage: (Vivaham)", image: "/services/homam/marriage.png", href: "/services/homam/marriage-vivaham" },
  { title: "Mrutyunjaya Homam", image: "/services/homam/mrutyunjaya-homam.png", href: "/services/homam/mrutyunjaya-homam" },
  { title: "Navagraha Homam", image: "/services/homam/navagraha-homam.png", href: "/services/homam/navagraha-homam" },
  { title: "Nichayathartham (Engagement)", image: "/services/homam/nichayathartham.png", href: "/services/homam/nichayathartham" },
  { title: "Pratyangira Badrakali Homam", image: "/services/homam/pratyangira.png", href: "/services/homam/pratyangira-badrakali" },
  { title: "Punyaha Vachanam", image: "/services/homam/punyaha-vachanam.png", href: "/services/homam/punyaha-vachanam" },
  { title: "Rudra Ekadashi Homam", image: "/services/homam/rudra.png", href: "/services/homam/rudra-ekadashi" },
  { title: "Sadakshari Durga Gayatri Homam", image: "/services/homam/sadakshari.png", href: "/services/homam/sadakshari-durga-gayatri" },
  { title: "SARASWATHI POOJAI", image: "/services/homam/saraswathi.png", href: "/services/homam/saraswathi-poojai" },
  { title: "Sathabhishekam", image: "/services/homam/sathabhishekam.png", href: "/services/homam/sathabhishekam" },
  { title: "SATHYANARAYANA PUJA", image: "/services/homam/satyanarayana.png", href: "/services/homam/sathyanarayana-puja" },
  { title: "Seemantham", image: "/services/homam/seemantham.png", href: "/services/homam/seemantham" },
  { title: "Shashtyabdapoorthiy", image: "/services/homam/shashtyabdapoorthi.png", href: "/services/homam/shashtyabdapoorthiy" },
  { title: "Shatru Samhara Homam", image: "/services/homam/shatru-samhara.png", href: "/services/homam/shatru-samhara-homam" },
  { title: "SIDHI VINAYAGA PUJA", image: "/services/homam/sidhi-vinayaga.png", href: "/services/homam/sidhi-vinayaga-puja" },
  { title: "SRARDHAM", image: "/services/homam/srardham.png", href: "/services/homam/srardham" },
  { title: "Sudarshana Homam", image: "/services/homam/sudarshana.png", href: "/services/homam/sudarshana-homam" },
  { title: "Swayamvara Parvathi Homam", image: "/services/homam/swayamvara.png", href: "/services/homam/swayamvara-parvathi" },
  { title: "UgraRatha Shanti", image: "/services/homam/ugraratha.png", href: "/services/homam/ugraratha-shanti" },

  // Page 3
  { title: "Upanayanam", image: "/services/homam/upanayanam.png", href: "/services/homam/upanayanam" },
  { title: "Vancha Kalpalatha Maha Ganapathi Homam", image: "/services/homam/vancha.png", href: "/services/homam/vancha-kalpalatha-ganapathi" },
  { title: "VASTU SHANTHI", image: "/services/homam/vastu-shanthi.png", href: "/services/homam/vastu-shanthi" },
  { title: "VijayaRatha Shanti", image: "/services/homam/vijayaratha.png", href: "/services/homam/vijayaratha-shanti" }
];

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
    return allHomamServices.slice(startIdx, startIdx + itemsPerPage);
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

      <div className="mx-auto grid w-full max-w-7xl grid-cols-1 gap-6 px-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {pageItems.map((service, index) => (
          <Link key={`${service.title}-${index}`} href={service.href}>
  <HoverCard>
    <Card className="group h-full cursor-pointer rounded-2xl border border-[#cfd8a3] bg-white ring-1 ring-[#e3ebbd] transition-all hover:-translate-y-1 hover:shadow-lg hover:border-[#2f9e44] hover:ring-[#2f9e44] hover:bg-[#eef4cf]">
     <CardContent className="flex h-full flex-col p-4">

  {/* Fixed image */}
  <div className="mb-4 h-44 overflow-hidden rounded-xl border border-[#cfd8a3] bg-[#eef4cf] flex items-center justify-center">
    <Image
      src={service.image}
      alt={service.title}
      width={240}
      height={240}
      className="h-full w-full object-contain transition-transform duration-300 group-hover:scale-105"
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
          Showing {(currentPage - 1) * 20 + 1}-{Math.min(currentPage * 20, allHomamServices.length)} of {allHomamServices.length} results
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
      className={`rounded-full px-4 py-2 text-sm font-medium transition ${
        currentPage === page
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
    </>
  );
}