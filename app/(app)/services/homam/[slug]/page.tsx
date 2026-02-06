"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, RotateCcw } from "lucide-react";
import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { toast } from "sonner";
import { homams } from "@/data/homams";
import { Star } from "lucide-react";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
type Homam = {
  title: string;
  image: string;
  priceRange: string;
  shortDescription?: string;
  duration?: string;
  objective?: string;
  description?: any[];
  faq?: { question: string; answer: string }[];
  packages?: {
    name: string;
    price: string;
    priests: string;
    description: string;
    procedures: string[];
  }[];
};


import { PagesService } from "@/lib/services/pages.service";
import { ServicesService, Service } from "@/lib/services/services.service";
import { ServicePackagesService, ServicePackage } from "@/lib/services/service-packages.service";
import { CartService } from "@/lib/services/cart.service";

// ... previous imports

export default function HomamDetailPage() {
  const router = useRouter();
  const params = useParams();
  const slug = params?.slug as string;

  // Local Mock Data
  const homam = homams[slug as keyof typeof homams] as Homam | undefined;

  // API Data State
  const [apiPage, setApiPage] = useState<any>(null);
  const [apiService, setApiService] = useState<Service | null>(null);
  const [apiPackages, setApiPackages] = useState<ServicePackage[]>([]);
  const [serviceAvailability, setServiceAvailability] = useState<'loading' | 'available' | 'not-found'>('loading');

  // Fetch Service from API using title to match
  useEffect(() => {
    // Specific API call for Abdha Poorthi Ayush Homam
    if (slug === 'abdha-poorthi-ayush-homam') {
      setServiceAvailability('loading');
      ServicesService.getById('550e8400-e29b-41d4-a716-446655440003')
        .then((service) => {
          setApiService(service);
          setServiceAvailability('available');

          // Fetch packages for this specific service
          ServicePackagesService.list({ service_id: service.id })
            .then(packages => {
              const sorted = packages.sort((a, b) => a.price - b.price);
              setApiPackages(sorted);

              if (sorted.length > 0) {
                const hasCurrent = sorted.some(p => p.name === formData.package);
                if (!hasCurrent) {
                  setFormData(prev => ({ ...prev, package: sorted[0].name }));
                }
              }
            })
            .catch(err => console.error("Error fetching packages:", err));
        })
        .catch(() => {
          setServiceAvailability('not-found');
        });
      return;
    }

    if (homam?.title) {

      setServiceAvailability('loading');

      ServicesService.list()
        .then((services) => {

          // Try to match by title (case-insensitive)
          const matchedService = services.find(
            (s) => s.name.toLowerCase().includes(homam.title.toLowerCase()) ||
              homam.title.toLowerCase().includes(s.name.toLowerCase())
          );

          if (matchedService) {

            setApiService(matchedService);
            setServiceAvailability('available');

            // Fetch packages for this service
            ServicePackagesService.list({ service_id: matchedService.id })
              .then(packages => {

                const sorted = packages.sort((a, b) => a.price - b.price);
                setApiPackages(sorted);

                // Set default package if available and current selection is not valid or just to ensure valid state
                if (sorted.length > 0) {
                  const hasCurrent = sorted.some(p => p.name === formData.package);
                  if (!hasCurrent) {
                    setFormData(prev => ({ ...prev, package: sorted[0].name }));
                  }
                }
              })
              .catch(err => console.error("Error fetching packages:", err));

          } else {

            setServiceAvailability('not-found');
          }
        })
        .catch(() => {
          setServiceAvailability('not-found');
        });
    }
  }, [homam?.title, slug]);

  // Fetch from API (kept for backward compatibility)
  useEffect(() => {
    if (slug) {
      PagesService.getBySlug(slug).then((data) => {
        if (data) setApiPage(data);
      });
    }
  }, [slug]);

  const [tab, setTab] = useState<"description" | "reviews" | "faq">("description");
  const [rating, setRating] = useState<number>(0);


  // Form state
  const [formData, setFormData] = useState({
    location: '',
    venue: '',
    priestPreference: '',
    date: '',
    package: '',
    flowers: ''
  });

  const handleBookService = () => {
    // Check mandatory fields
    if (!formData.priestPreference || !formData.date || !formData.package || !formData.flowers) {
      toast.error("Please fill the mandatory fields", {
        description: "Priest Preference, Date, Package, and Flowers are required.",
        duration: 3000,
      });
      return;
    }

    // Check authentication first
    const userId = localStorage.getItem('user_id');
    const userEmail = localStorage.getItem('user_email');

    // ... existing imports

    if (!userId || !userEmail) {
      // User not logged in - show toast with action
      toast.error('Please login to book services', {
        description: 'Click here to go to login page',
        duration: 5000,
        action: {
          label: 'Login',
          onClick: () => router.push('/login'),
        },
      });
      return;
    }

    // Try to add to backend cart if API service is available
    if (apiService) {
      const apiPkg = apiPackages.find(p => p.name === formData.package);
      if (apiPkg) {
        CartService.addItem({
          service_id: apiService.id,
          package_id: apiPkg.id,
          quantity: 1,
          price: apiPkg.price
        }).then(() => {
          console.log("Added to backend cart successfully");
        }).catch(err => {
          console.error("Failed to add to backend cart:", err);
          toast.error("Failed to sync with server cart, but saved locally.");
        });
      }
    }

    // Save service details to localStorage with current timestamp as ID
    const serviceId = Date.now();
    // Calculate price
    let basePrice = 0;

    // Try to find in API packages first
    const apiPkg = apiPackages.find(p => p.name === formData.package);

    if (apiPkg) {
      basePrice = apiPkg.price;
    } else {
      // Fallback to local data
      const selectedPkg = homam?.packages?.find(p => p.name === formData.package);
      const priceString = selectedPkg?.price?.replace(/[^0-9]/g, '') || "0";
      basePrice = parseInt(priceString, 10);
    }

    const flowersPrice = formData.flowers === 'Yes' ? 250 : 0;
    const totalPrice = basePrice + flowersPrice;

    const finalServiceId = apiService?.id || (slug === 'abdha-poorthi-ayush-homam' ? '550e8400-e29b-41d4-a716-446655440003' : undefined);

    const serviceData = {
      id: serviceId,
      service_id: finalServiceId,
      package_id: apiPkg?.id,
      title: homam?.title,
      description: homam?.shortDescription,
      image: homam?.image,
      price: totalPrice,
      formData: formData,
      addedAt: new Date().toISOString()
    };

    // Get existing services from localStorage
    const existingServices = JSON.parse(localStorage.getItem('addedServices') || '[]');
    existingServices.push(serviceData);
    localStorage.setItem('addedServices', JSON.stringify(existingServices));

    // Dispatch custom event to notify other components
    window.dispatchEvent(new Event('servicesUpdated'));

    toast.success("Service booked successfully", {
      description: "Your booking has been added successfully",
      duration: 3000, // 3 seconds
    });

    // Redirect to cart page
    setTimeout(() => {
      router.push('/cart');
    }, 1000);
    toast.dismiss(); // clears existing toasts


    // Clear form after adding
    setFormData({
      location: '',
      venue: '',
      priestPreference: '',
      date: '',
      package: '',
      flowers: ''
    });
  };


  return (
    <section className="w-full px-6 pt-4 pb-16">

      {/* API Status Indicator - Top Right */}


      {/* Back Button */}
      <div className="fixed top-6 left-6 z-50">
        <Link href="/services/homam" className="inline-flex items-center justify-center rounded-full bg-[#2f9e44] p-3 shadow-lg text-white hover:bg-[#256b32]">
          <ArrowLeft className="h-5 w-5" />
        </Link>
      </div>

      {/* Title */}
      <div className="mx-auto mt-4 mb-8 max-w-6xl text-center">
        <h1 className="text-3xl font-serif tracking-wide leading-tight text-[#2f3a1f]">
          {homam?.title}
        </h1>
        {homam?.shortDescription && (
          <p className="mt-2 text-sm text-[#4f5d2f]">
            {homam.shortDescription}
          </p>
        )}

      </div>

      {/* Main Layout */}
      <div className="mx-auto max-w-6xl">
        <div className="grid grid-cols-1 gap-8 items-start">

          {/* Image */}
          <div className="flex justify-center">
            <div className="w-[300px] rounded-2xl border border-[#cfd8a3] bg-white p-4 shadow-sm">
              <div className="aspect-square overflow-hidden rounded-xl bg-[#eef4cf]">
                <Image
                  src={homam?.image || "/assets/images/bg.jpg"}
                  alt={homam?.title ?? "Homam Image"}
                  width={400}
                  height={400}
                  className="h-full w-full object-cover"
                  unoptimized
                />

              </div>
            </div>
          </div>

          {/* Info */}
          <div className="space-y-4 text-center">
            <p className="text-lg font-semibold text-[#2f3a1f]">
              {homam?.priceRange}
            </p>


            {homam?.duration && (
              <p className="text-sm text-[#4f5d2f]">
                <strong>Duration:</strong> {homam.duration}
              </p>
            )}


            {homam?.objective && (
              <p className="text-sm text-[#4f5d2f]">
                <strong>Objective:</strong> {homam.objective}
              </p>
            )}

          </div>

          {/* BOOKING CARD */}
          <div className="rounded-3xl border border-[#cfd8a3] bg-white p-6">
            {/* Location */}
            <div className="mb-4">
              <label className="mb-1 block text-sm font-medium">Location</label>
              <input
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                className="w-full rounded-md border border-[#cfd8a3] bg-white px-3 py-2 text-sm focus:border-[#2f9e44] focus:outline-none focus:ring-1 focus:ring-[#2f9e44]"
              />
            </div>

            {/* Venue */}
            <div className="mb-4">
              <label className="mb-1 block text-sm font-medium">Pooja Venue</label>
              <input
                value={formData.venue}
                onChange={(e) => setFormData({ ...formData, venue: e.target.value })}
                className="w-full rounded-md border border-[#cfd8a3] bg-white px-3 py-2 text-sm focus:border-[#2f9e44] focus:outline-none focus:ring-1 focus:ring-[#2f9e44]"
              />
            </div>

            {/* All in one row */}
            <div className="mb-6 grid grid-cols-2 gap-4 md:grid-cols-4">
              <div>
                <label className="mb-1 block text-sm font-medium text-[#2f3a1f]">
                  Priest Preference *
                </label>
                <Select value={formData.priestPreference} onValueChange={(value) => setFormData({ ...formData, priestPreference: value })}>
                  <SelectTrigger className="h-11 rounded-lg border border-[#cfd8a3] bg-white text-sm text-[#2f3a1f] focus:border-[#2f9e44] focus:ring-1 focus:ring-[#2f9e44]">
                    <SelectValue placeholder="Select Language" />
                  </SelectTrigger>
                  <SelectContent className="rounded-lg border border-[#cfd8a3] bg-white">
                    <SelectItem value="Tamil">Tamil</SelectItem>
                    <SelectItem value="Sanskrit">Sanskrit</SelectItem>
                    <SelectItem value="Kannada">Kannada</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium">Select Date *</label>
                <input
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  className="w-full rounded-md border border-[#cfd8a3] bg-white px-3 py-2 text-sm focus:border-[#2f9e44] focus:outline-none focus:ring-1 focus:ring-[#2f9e44]"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-sm font-medium text-[#2f3a1f]">
                    Select Package *
                  </label>
                  <button
                    onClick={() => {
                      setFormData({
                        location: '',
                        venue: '',
                        priestPreference: '',
                        date: '',
                        package: '',
                        flowers: ''
                      });
                      toast.success("Form cleared");
                    }}
                    className="flex items-center gap-1 text-xs text-blue-600 hover:text-blue-800"
                  >
                    <RotateCcw className="h-3 w-3" />
                    Clear
                  </button>
                </div>
                <Select
                  value={formData.package}
                  onValueChange={(value) =>
                    setFormData({ ...formData, package: value })
                  }
                >
                  <SelectTrigger className="h-11 rounded-lg border border-[#cfd8a3] bg-white text-sm text-[#2f3a1f] focus:border-[#2f9e44] focus:ring-1 focus:ring-[#2f9e44]">
                    <SelectValue placeholder="Select Package" />
                  </SelectTrigger>

                  <SelectContent className="rounded-lg border border-[#cfd8a3] bg-white">
                    {apiPackages.length > 0 ? (
                      apiPackages.map((pkg) => (
                        <SelectItem key={pkg.id} value={pkg.name}>
                          {pkg.name}
                        </SelectItem>
                      ))
                    ) : (
                      <>
                        <SelectItem value="Economy">Economy</SelectItem>
                        <SelectItem value="Standard">Standard</SelectItem>
                        <SelectItem value="Premium">Premium</SelectItem>
                      </>
                    )}
                  </SelectContent>
                </Select>

                {/* Dynamic Price Display */}

              </div>

              <div>
                <label className="mb-1 block text-sm font-medium">Add-on: Flowers *</label>
                <div className="mt-2 flex gap-4">
                  <label className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="flowers"
                      checked={formData.flowers === 'Yes'}
                      onChange={() => setFormData({ ...formData, flowers: 'Yes' })}
                    />
                    Yes
                  </label>
                  <label className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="flowers"
                      checked={formData.flowers === 'No'}
                      onChange={() => setFormData({ ...formData, flowers: 'No' })}
                    />
                    No
                  </label>
                </div>
              </div>
            </div>

            <button
              onClick={handleBookService}
              className="w-full rounded-full bg-[#2f9e44] py-3 text-sm font-medium text-white hover:bg-[#256b32]">
              Book Service
            </button>
          </div>
        </div>
      </div>

      {/* TABS */}
      <div className="mx-auto mt-14 max-w-6xl">
        <div className="flex gap-6 border-b text-sm">
          {[
            "description",
            "reviews",
            ...(homam?.faq && homam.faq.length > 0 ? ["faq"] : []),
          ].map((t) => (

            <button
              key={t}
              onClick={() => setTab(t as any)}
              className={`pb-3 ${tab === t
                ? "border-b-2 border-[#2f9e44] font-semibold text-[#2f9e44]"
                : "text-[#4f5d2f]"
                }`}
            >
              {t === "description" && "Description"}
              {t === "reviews" && "Reviews (0)"}
              {t === "faq" && "FAQ"}
            </button>
          ))}
        </div>

        {/* TAB CONTENT */}
        <div className="mt-6 text-sm text-[#4f5d2f]">
          {tab === "description" && (
            <div className="space-y-5 text-sm text-[#4f5d2f] leading-relaxed">
              {apiPage?.content?.sections?.[0]?.delta?.ops ? (
                <div className="whitespace-pre-wrap text-[15px] leading-7 text-gray-700">
                  {apiPage.content.sections[0].delta.ops.map((op: any, i: number) => (
                    <span key={i}>{op.insert}</span>
                  ))}
                </div>
              ) : homam?.description?.map((block: any, index: number) => {
                // Heading
                if (block.type === "h") {
                  return (
                    <p
                      key={index}
                      className="pt-4 text-base font-semibold text-[#2f3a1f]"
                    >
                      {block.text}
                    </p>
                  );
                }

                // Paragraph
                if (block.type === "p") {
                  return <p key={index}>{block.text}</p>;
                }

                // Bullet list
                if (block.type === "ul") {
                  return (
                    <ul key={index} className="list-disc pl-5 space-y-1">
                      {block.items.map((item: string, i: number) => (
                        <li key={i}>{item}</li>
                      ))}
                    </ul>
                  );
                }

                // ✅ TABLE (for Ganesh / Vinayagar Chaturthi kit etc.)
                if (block.type === "table") {
                  return (
                    <div key={index} className="overflow-x-auto pt-2">
                      <table className="w-full border border-[#cfd8a3] text-sm">
                        <thead className="bg-[#eef4cf]">
                          <tr>
                            {block.headers.map((head: string, i: number) => (
                              <th
                                key={i}
                                className="border border-[#cfd8a3] px-3 py-2 text-left font-semibold text-[#2f3a1f]"
                              >
                                {head}
                              </th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {block.rows.map((row: string[], rIdx: number) => (
                            <tr key={rIdx} className="bg-white">
                              {row.map((cell: string, cIdx: number) => (
                                <td
                                  key={cIdx}
                                  className="border border-[#cfd8a3] px-3 py-2 text-[#4f5d2f]"
                                >
                                  {cell}
                                </td>
                              ))}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  );
                }

                return null;
              })}
            </div>
          )}
        </div>



        {tab === "reviews" && (
          <div className="mt-6 space-y-6 text-sm text-[#4f5d2f]">

            {/* No reviews message */}
            <div className="rounded-lg bg-[#2f9e44] px-4 py-3 text-white shadow-sm">
              There are no reviews yet.
            </div>


            <p>
              Your email address will not be published. Required fields are marked{" "}
              <span className="text-red-500">*</span>
            </p>

            {/* Rating */}
            <div className="mb-6">
              <label className="mb-2 block text-sm font-medium text-[#2f3a1f]">
                Your rating <span className="text-red-500">*</span>
              </label>

              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    size={24}
                    onClick={() => setRating(star)}
                    className={`cursor-pointer transition ${star <= rating
                      ? "fill-[#f4c430] text-[#f4c430]"   // GOLD
                      : "text-[#9ca67a]"                  // visible grey
                      }`}
                  />
                ))}
              </div>
            </div>


            {/* Review textarea */}
            <div>
              <label className="mb-2 block font-medium text-[#2f3a1f]">
                Your review <span className="text-red-500">*</span>
              </label>
              <textarea
                rows={4}
                className="w-full rounded-md border border-[#cfd8a3] bg-white px-3 py-2 text-sm text-[#2f3a1f] outline-none focus:border-[#2f9e44] focus:ring-1 focus:ring-[#2f9e44]"
              />
            </div>

            {/* Name & Email */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1 block font-medium text-[#2f3a1f]">
                  Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  className="w-full rounded-md border border-[#cfd8a3] bg-white px-3 py-2 text-sm text-[#2f3a1f] outline-none focus:border-[#2f9e44] focus:ring-1 focus:ring-[#2f9e44]"
                />
              </div>

              <div>
                <label className="mb-1 block font-medium text-[#2f3a1f]">
                  Email <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  className="w-full rounded-md border border-[#cfd8a3] bg-white px-3 py-2 text-sm text-[#2f3a1f] outline-none focus:border-[#2f9e44] focus:ring-1 focus:ring-[#2f9e44]"
                />
              </div>
            </div>

            <button className="rounded-full bg-[#2f9e44] px-8 py-3 text-sm font-semibold text-white shadow-md hover:bg-[#268a3b]">
              Submit
            </button>

          </div>
        )}


        {tab === "faq" && (
          <div className="space-y-6 text-sm leading-relaxed text-[#2f3a1f]">
            {homam?.faq?.map((item, index) => (
              <div key={index}>
                <p className="font-semibold">
                  {index + 1}. {item.question}
                </p>
                <p className="mt-2 text-[#4f5d2f]">{item.answer}</p>
              </div>
            ))}
          </div>
        )}
        {/* PRICING / PACKAGES */}
        {homam?.packages && homam.packages.length > 0 && (
          <section className="mt-20">
            <h2 className="mb-10 text-center text-2xl font-serif text-[#2f3a1f]">
              PRICING / PACKAGES
            </h2>

            <div className="mx-auto grid max-w-6xl grid-cols-1 gap-8 md:grid-cols-3">
              {homam.packages.map(
                (
                  pkg: {
                    name: string;
                    price: string;
                    priests: string;
                    description: string;
                    procedures: string[];
                  },
                  index: number
                ) => (
                  <div
                    key={index}
                    className={`overflow-hidden rounded-2xl border ${pkg.name === "Standard"
                      ? "border-2 border-[#2f9e44] shadow-lg"
                      : "border-[#d8e2a8] shadow-sm"
                      } bg-white`}
                  >
                    <div
                      className={`py-4 text-center text-lg font-medium ${pkg.name === "Standard"
                        ? "bg-[#2f9e44] text-white"
                        : "bg-[#f3f4f6]"
                        }`}
                    >
                      {pkg.name}
                    </div>

                    <div className="p-6">
                      <p className="mb-4 text-center text-2xl font-semibold">
                        {pkg.price}
                      </p>

                      <p className="mb-3 font-medium">{pkg.priests}</p>

                      <p className="mb-5 text-sm text-[#4f5d2f]">
                        {pkg.description}
                      </p>

                      <p className="mb-2 font-medium">Procedure involved:</p>
                      <ul className="list-disc space-y-1 pl-5 text-sm text-[#4f5d2f]">
                        {pkg.procedures.map((item: string, i: number) => (
                          <li key={i}>{item}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )
              )}
            </div>
          </section>
        )}
      </div>
    </section>
  );
}
