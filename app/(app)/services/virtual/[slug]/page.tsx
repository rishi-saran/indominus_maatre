"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, Star, RotateCcw } from "lucide-react";
import { useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { toast } from "sonner";
import { virtualServices } from "@/lib/data/virtual-services";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

export default function VirtualServicePage() {
  const router = useRouter();
  const params = useParams();
  const slug = params?.slug as string;

  const service = virtualServices.find((s) => s.slug === slug);

  const [tab, setTab] = useState<"description" | "reviews" | "faq">("description");
  const [rating, setRating] = useState<number>(0);

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

    if (!userId || !userEmail) {
      // User not logged in - show toast with action
      toast.error('Please login to book services', {
        description: 'Click the Login button below',
        duration: 5000,
        action: {
          label: 'Login',
          onClick: () => router.push('/login'),
        },
      });
      return;
    }

    const serviceId = Date.now();

    if (!service) {
      toast.error("Service information unavailable");
      return;
    }

    // Calculate price
    const packageKey = (formData.package.toLowerCase()) as keyof typeof service.prices;
    const basePrice = service.prices[packageKey] || 0;
    const flowersPrice = formData.flowers === 'Yes' ? 250 : 0;
    const totalPrice = basePrice + flowersPrice;

    const serviceData = {
      id: serviceId,
      title: service?.title,
      description: service?.description,
      image: service?.image,
      price: totalPrice,
      formData: formData,
      addedAt: new Date().toISOString()
    };

    const existingServices = JSON.parse(localStorage.getItem('addedServices') || '[]');
    existingServices.push(serviceData);
    localStorage.setItem('addedServices', JSON.stringify(existingServices));
    window.dispatchEvent(new Event('servicesUpdated'));

    toast.success("Service booked successfully", {
      description: "Your booking has been added successfully",
      duration: 3000,
    });

    // Redirect to cart page
    setTimeout(() => {
      router.push('/cart');
    }, 1000);
    toast.dismiss();

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
      {/* Back Button */}
      <div className="fixed top-6 left-6 z-50">
        <Link href="/services/virtual" className="inline-flex items-center justify-center rounded-full bg-[#2f9e44] p-3 shadow-lg text-white hover:bg-[#256b32]">
          <ArrowLeft className="h-5 w-5" />
        </Link>
      </div>

      {/* Title */}
      <div className="mx-auto mt-4 mb-8 max-w-6xl text-center">
        <h1 className="text-3xl font-serif tracking-wide leading-tight text-[#2f3a1f]">
          {service?.title}
        </h1>
        {service?.description && (
          <p className="mt-2 text-sm text-[#4f5d2f]">
            {service.description}
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
                  src={service?.image || "/assets/images/bg.jpg"}
                  alt={service?.title || "Virtual service"}
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
              {service?.priceRange}
            </p>
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
                  onValueChange={(value) => setFormData({ ...formData, package: value })}
                >
                  <SelectTrigger className="h-11 rounded-lg border border-[#cfd8a3] bg-white text-sm text-[#2f3a1f] focus:border-[#2f9e44] focus:ring-1 focus:ring-[#2f9e44]">
                    <SelectValue placeholder="Select Package" />
                  </SelectTrigger>
                  <SelectContent className="rounded-lg border border-[#cfd8a3] bg-white">
                    <SelectItem value="Economy">Economy</SelectItem>
                    <SelectItem value="Standard">Standard</SelectItem>
                    <SelectItem value="Premium">Premium</SelectItem>
                  </SelectContent>
                </Select>
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
                    Yes (+₹250)
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
            ...(service?.faqs && service.faqs.length > 0 ? ["faq"] : []),
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
              <p>{service?.content.description}</p>

              <div>
                <p className="font-semibold text-[#2f3a1f]">Benefits:</p>
                <ul className="list-disc pl-5 space-y-1 mt-2">
                  {service?.content.benefits.map((benefit, i) => (
                    <li key={i}>{benefit}</li>
                  ))}
                </ul>
              </div>

              <div>
                <p className="font-semibold text-[#2f3a1f]">What's Included:</p>
                <ul className="list-disc pl-5 space-y-1 mt-2">
                  {service?.content.includes.map((item, i) => (
                    <li key={i}>{item}</li>
                  ))}
                </ul>
              </div>

              <div>
                <p className="font-semibold text-[#2f3a1f]">Process:</p>
                <ul className="list-disc pl-5 space-y-1 mt-2">
                  {service?.content.process.map((step, i) => (
                    <li key={i}>{step}</li>
                  ))}
                </ul>
              </div>
            </div>
          )}

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
                        ? "fill-[#f4c430] text-[#f4c430]"
                        : "text-[#9ca67a]"
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

          {tab === "faq" && service?.faqs && service.faqs.length > 0 && (
            <div className="space-y-6 text-sm leading-relaxed text-[#2f3a1f]">
              {service.faqs.map((item, index) => (
                <div key={index}>
                  <p className="font-semibold">
                    {index + 1}. {item.question}
                  </p>
                  <p className="mt-2 text-[#4f5d2f]">{item.answer}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      {/* PRICING / PACKAGES */}
      {service?.prices && (
        <section className="mt-20">
          <h2 className="mb-10 text-center text-2xl font-serif text-[#2f3a1f]">
            PRICING / PACKAGES
          </h2>

          <div className="mx-auto grid max-w-6xl grid-cols-1 gap-8 md:grid-cols-3">
            {/* Economy */}
            <div className="overflow-hidden rounded-2xl border border-[#d8e2a8] bg-white shadow-sm">
              <div className="bg-[#f3f4f6] py-4 text-center text-lg font-medium">
                Economy
              </div>
              <div className="p-6">
                <p className="mb-4 text-center text-2xl font-semibold">
                  ₹{service.prices.economy.toLocaleString()}
                </p>
                <p className="mb-3 font-medium">Basic Package</p>
                <p className="mb-5 text-sm text-[#4f5d2f]">
                  Essential services for a meaningful ceremony
                </p>
                <p className="mb-2 font-medium">Procedure involved:</p>
                <ul className="list-disc space-y-1 pl-5 text-sm text-[#4f5d2f]">
                  {service.content.includes.slice(0, 3).map((item, i) => (
                    <li key={i}>{item}</li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Standard */}
            <div className="overflow-hidden rounded-2xl border-2 border-[#2f9e44] bg-white shadow-lg">
              <div className="bg-[#2f9e44] py-4 text-center text-lg font-medium text-white">
                Standard
              </div>
              <div className="p-6">
                <p className="mb-4 text-center text-2xl font-semibold text-[#2f9e44]">
                  ₹{service.prices.standard.toLocaleString()}
                </p>
                <p className="mb-3 font-medium">Standard Package</p>
                <p className="mb-5 text-sm text-[#4f5d2f]">
                  Complete ceremony with all traditional elements
                </p>
                <p className="mb-2 font-medium">Procedure involved:</p>
                <ul className="list-disc space-y-1 pl-5 text-sm text-[#4f5d2f]">
                  {service.content.includes.map((item, i) => (
                    <li key={i}>{item}</li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Premium */}
            <div className="overflow-hidden rounded-2xl border border-[#d8e2a8] bg-white shadow-sm">
              <div className="bg-[#f3f4f6] py-4 text-center text-lg font-medium">
                Premium
              </div>
              <div className="p-6">
                <p className="mb-4 text-center text-2xl font-semibold">
                  ₹{service.prices.premium.toLocaleString()}
                </p>
                <p className="mb-3 font-medium">Premium Package</p>
                <p className="mb-5 text-sm text-[#4f5d2f]">
                  Comprehensive ceremony with premium offerings
                </p>
                <p className="mb-2 font-medium">Procedure involved:</p>
                <ul className="list-disc space-y-1 pl-5 text-sm text-[#4f5d2f]">
                  {service.content.includes.map((item, i) => (
                    <li key={i}>{item}</li>
                  ))}
                  <li>Premium offerings and materials</li>
                  <li>Extended ritual duration</li>
                </ul>
              </div>
            </div>
          </div>
        </section>
      )}
    </section>
  );
}
