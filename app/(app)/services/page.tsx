//(app)\services\page.tsx

import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight } from "lucide-react";
import Image from "next/image";
import { ViewCartButton } from "@/components/ui/view-cart";

// Type for API response
interface ServiceCategory {
  id: string;
  name: string;
  description: string;
  slug?: string;
  image?: string;
  short_description?: string;
  display_order?: number;
  is_active?: boolean;
}

// Fallback data if API fails
const fallbackServices = [
  {
    id: "chanting",
    name: "Chanting",
    description:
      "Sacred Vedic chants performed with devotion to bring peace, clarity, and positive energy.",
    href: "/services/chanting",
    image: "/services/chanting1.png",
  },
  {
    id: "parihara-pooja",
    name: "Parihara Pooja",
    description:
      "Traditional remedies and poojas performed to resolve doshas and life obstacles.",
    href: "/services/parihara-pooja",
    image: "/services/parihara-pooja.png",
  },
  {
    id: "homam",
    name: "Rituals / Homam",
    description:
      "Powerful fire rituals conducted by expert priests for spiritual upliftment.",
    href: "/services/homam",
    image: "/services/homam.png",
  },
  {
    id: "virtual",
    name: "Virtual",
    description:
      "Participate in sacred rituals and homams remotely through live virtual services.",
    href: "/services/virtual",
    image: "/services/virtual.png",
  },
];

// Map category name to image and href
function getCategoryMeta(name: string): { image: string; href: string } {
  const normalized = name.toLowerCase();

  if (normalized.includes("chant")) {
    return { image: "/services/chanting1.png", href: "/services/chanting" };
  }
  if (normalized.includes("parihara")) {
    return { image: "/services/parihara-pooja.png", href: "/services/parihara-pooja" };
  }
  if (normalized.includes("homam") || normalized.includes("ritual")) {
    return { image: "/services/homam.png", href: "/services/homam" };
  }
  if (normalized.includes("virtual")) {
    return { image: "/services/virtual.png", href: "/services/virtual" };
  }

  // Default fallback
  return { image: "/services/chanting1.png", href: "/services/chanting" };
}

// Fetch categories from backend
async function getServiceCategories(): Promise<typeof fallbackServices> {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_API_URL;
    if (!baseUrl) {
      console.warn("NEXT_PUBLIC_API_URL not set, using fallback data");
      return fallbackServices;
    }

    // baseUrl already includes /api/v1, so just append the endpoint
    const url = `${baseUrl}/service-categories/`;
    console.log("[Services Page] Fetching from:", url);

    const res = await fetch(url, {
      next: { revalidate: 60 }, // Cache for 60 seconds
    });

    if (!res.ok) {
      console.warn(`API returned ${res.status}, using fallback data`);
      return fallbackServices;
    }

    const data: ServiceCategory[] = await res.json();

    if (!Array.isArray(data) || data.length === 0) {
      return fallbackServices;
    }

    // Map API data to service card format (use database fields when available)
    return data.map((category) => {
      const meta = getCategoryMeta(category.name);
      return {
        id: category.id,
        name: category.name,
        description: category.short_description || category.description || "Explore our sacred spiritual services.",
        href: category.slug ? `/services/${category.slug}` : meta.href,
        image: category.image || meta.image,
      };
    });
  } catch (error) {
    console.error("Failed to fetch service categories:", error);
    return fallbackServices;
  }
}

export default async function ServicesPage() {
  const services = await getServiceCategories();

  return (
    <>
      <ViewCartButton redirectTo="/cart" />
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
            <Link key={service.id} href={service.href} data-category-id={service.id}>
              <Card className="group h-full rounded-2xl border border-[#cfd8a3] bg-white ring-1 ring-[#e3ebbd] transition-all hover:-translate-y-1 hover:shadow-lg hover:border-[#2f9e44] hover:ring-[#2f9e44] hover:bg-[#eef4cf]">
                <CardContent className="flex h-[420px] flex-col p-6">

                  {/* Image */}
                  <div className="mb-5 h-40 overflow-hidden rounded-xl border border-[#cfd8a3] bg-[#eef4cf]">
                    <Image
                      src={service.image}
                      alt={service.name}
                      width={400}
                      height={260}
                      className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                      unoptimized
                    />
                  </div>

                  {/* Title + Description */}
                  <div>
                    <h2 className="mb-2 text-xl font-semibold text-[#2f3a1f]">
                      {service.name}
                    </h2>

                    <p className="text-sm leading-relaxed text-[#4f5d2f]">
                      {service.description}
                    </p>
                  </div>

                  {/* CTA – pinned to bottom */}
                  <div className="mt-auto pt-6">
                    <span className="inline-flex items-center gap-2 text-sm font-medium text-[#2f9e44]">
                      View Service
                      <ArrowRight className="h-4 w-4" />
                    </span>
                  </div>

                </CardContent>
              </Card>
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