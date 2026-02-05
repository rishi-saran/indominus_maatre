"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowLeft } from "lucide-react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Star } from "lucide-react";
import { CartService } from '@/lib/services/cart.service';
import { ServicesService } from '@/lib/services/services.service';
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

export default function AyushaHomamPage() {
  const router = useRouter();
  const [tab, setTab] = useState<"description" | "reviews" | "faq">("description");
  const [rating, setRating] = useState<number>(0);
  const [serviceId, setServiceId] = useState<string | null>(null);
  const [servicePrice, setServicePrice] = useState<number | null>(null);

  // Fetch service UUID from backend (optional - works without it)
  useEffect(() => {
    const fetchServiceId = async () => {
      try {
        const services = await ServicesService.list();
        // Handle case where services is an array
        if (Array.isArray(services)) {
          const ayushaService = services.find(
            (s: any) => s.name?.toLowerCase().includes('ayusha') || s.slug === 'ayusha-homam'
          );
          if (ayushaService) {
            setServiceId(ayushaService.id);
            setServicePrice(typeof ayushaService.base_price === 'number' ? ayushaService.base_price : null);
            return;
          }
        }
        // If not found in backend, use a local identifier
        setServiceId('ayusha-homam-local');
      } catch (error) {
        // API not available - use local identifier for localStorage-based cart
        console.log('Using local service ID (backend not available)');
        setServiceId('ayusha-homam-local');
      }
    };
    fetchServiceId();
  }, []);

  const getSelectedPrice = () => {
    const packagePriceMap: Record<'Economy' | 'Standard' | 'Premium', number> = {
      Economy: 15000,
      Standard: 25000,
      Premium: 35000,
    };

    return servicePrice ?? packagePriceMap[formData.package as 'Economy' | 'Standard' | 'Premium'] ?? packagePriceMap.Economy;
  };

  // Form state
  const [formData, setFormData] = useState({
    location: '',
    venue: '',
    priestPreference: 'Tamil',
    date: '',
    package: 'Economy',
    flowers: 'No'
  });

  const handleBookService = async () => {
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

    // Check if service is available
    if (!serviceId) {
      toast.error("Service not available. Please try again.", {
        duration: 3000,
      });
      return;
    }

    // Try to add to backend cart (optional - works without it)
    const isLocalOnly = serviceId.includes('-local');
    if (!isLocalOnly) {
      try {
        await CartService.addItem({
          service_id: serviceId,
          price: getSelectedPrice(),
          quantity: 1,
        });
      } catch (error) {
        console.log('Backend cart not available, using localStorage only');
        // Continue with localStorage - don't block the user
      }
    }

    // Save to localStorage for UI
    const localId = Date.now();
    const serviceData = {
      id: localId,
      title: 'AYUSHA HOMAM',
      description: 'Ayusha Homam is performed to revere divine energies for vitality, wellness, and longevity.',
      image: '/services/chanting/ayusha-homam.png',
      formData: formData,
      addedAt: new Date().toISOString()
    };

    const existingServices = JSON.parse(localStorage.getItem('addedServices') || '[]');
    existingServices.push(serviceData);
    localStorage.setItem('addedServices', JSON.stringify(existingServices));

    // Dispatch custom event to notify other components
    window.dispatchEvent(new Event('servicesUpdated'));

    toast.success("Service booked successfully", {
      description: "Your booking has been added to cart",
      duration: 3000,
    });

    // Clear form after adding
    setFormData({
      location: '',
      venue: '',
      priestPreference: 'Tamil',
      date: '',
      package: 'Economy',
      flowers: 'No'
    });

    // Redirect to cart page
    setTimeout(() => {
      router.push('/cart');
    }, 1000);
  };


  return (
    <section className="w-full px-6 pt-4 pb-16">
      {/* Back Button */}
      <div className="fixed top-6 left-6 z-50">
        <Link href="/services/chanting" className="inline-flex items-center justify-center rounded-full bg-[#2f9e44] p-3 shadow-lg text-white hover:bg-[#256b32]">
          <ArrowLeft className="h-5 w-5" />
        </Link>
      </div>

      {/* Title */}
      <div className="mx-auto mt-4 mb-8 max-w-6xl text-center">
        <h1 className="text-3xl font-serif tracking-wide leading-tight text-[#2f3a1f]">
          AYUSHA HOMAM
        </h1>
        <p className="mt-2 text-sm text-[#4f5d2f]">
          Ayusha Homam is performed to revere divine energies for vitality,
          wellness, and longevity.
        </p>
      </div>

      {/* Main Layout */}
      <div className="mx-auto max-w-6xl">
        <div className="grid grid-cols-1 gap-8 items-start">

          {/* Image */}
          <div className="flex justify-center">
            <div className="w-[300px] rounded-2xl border border-[#cfd8a3] bg-white p-4 shadow-sm">
              <div className="aspect-square overflow-hidden rounded-xl bg-[#eef4cf]">
                <Image
                  src="/services/chanting/ayusha-homam.png"
                  alt="Ayusha Homam"
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
              ₹9,500.00 – ₹20,000.00
            </p>

            <p className="text-sm text-[#4f5d2f]">
              <strong>Duration:</strong> 2 hrs
            </p>

            <p className="text-sm text-[#4f5d2f]">
              <strong>Objective:</strong> To promote health and extend the longevity of life.
            </p>
          </div>

          {/* BOOKING CARD */}
          <div className="rounded-3xl border border-[#cfd8a3] bg-white p-6">
            {/* Location */}
            <div className="mb-4">
              <label className="mb-1 block text-sm font-medium">Location *</label>
              <input
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                className="w-full rounded-md border border-[#cfd8a3] bg-white px-3 py-2 text-sm focus:border-[#2f9e44] focus:outline-none focus:ring-1 focus:ring-[#2f9e44]"
              />
            </div>

            {/* Venue */}
            <div className="mb-4">
              <label className="mb-1 block text-sm font-medium">Pooja Venue *</label>
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
                <label className="mb-1 block text-sm font-medium text-[#2f3a1f]">
                  Select Package
                </label>
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
                    <SelectItem value="Economy">Economy</SelectItem>
                    <SelectItem value="Standard">Standard</SelectItem>
                    <SelectItem value="Premium">Premium</SelectItem>
                  </SelectContent>
                </Select>

              </div>

              <div>
                <label className="mb-1 block text-sm font-medium">Add-on: Flowers</label>
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
          {["description", "reviews", "faq"].map((t) => (
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

              <p>
                <strong>Ayusha Homam</strong> is performed to Revered for bestowing vitality
                and wellness.
              </p>

              <p>
                <strong>Suitable for:</strong> Individuals of all ages.
              </p>

              <p>
                <strong>Scheduling:</strong> The ceremony date is determined based on the
                individual’s birth star for optimal efficacy.
              </p>

              <p>
                <strong>Deity Worshipped:</strong> Ayur Devata (God of Fire)
              </p>

              <p>
                <strong>Primary Offerings:</strong> Steamed rice and ghee are the main
                sacrificial elements used during the ritual. “This sacred ceremony aims
                to invoke divine blessings for a robust and enduring life through
                traditional Vedic practices.”
              </p>

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
              <div>
                <p className="font-semibold">
                  1. Can I pay a Partial amount in advance to confirm the Homam and pay the
                  balance as cash or pay online after the Homam?
                </p>
                <p className="mt-2 text-[#4f5d2f]">
                  Yes, you can pay the partial amount as a token advance to confirm your
                  booking. You can pay the balance amount after the Homam with cash
                  directly to our Priests or through an Online transfer (Click on the
                  “Pay-Balance” button in your My- Account section corresponding to your
                  order number).
                </p>
              </div>

              <div>
                <p className="font-semibold">
                  2. How Long does the Homam take to complete?
                </p>
                <p className="mt-2 text-[#4f5d2f]">
                  Homams are typically performed for 2+ hours at the same time it also
                  depends on the package selected for the homam.
                </p>
              </div>

              <div>
                <p className="font-semibold">
                  3. When will I get the Prasad for my Homam if I select Vedic Pooja Center
                  since I'm abroad?
                </p>
                <p className="mt-2 text-[#4f5d2f]">
                  You will receive the Prasad for your Homam within 14 working days after
                  the homam has been performed (Subject to the country and the customs
                  department of that particular country).
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* PRICING / PACKAGES */}
      <section className="mt-20">
        <h2 className="mb-10 text-center text-2xl font-serif text-[#2f3a1f]">
          PRICING / PACKAGES
        </h2>

        <div className="mx-auto grid max-w-6xl grid-cols-1 gap-8 md:grid-cols-3">
          <div className="overflow-hidden rounded-2xl border border-[#d8e2a8] bg-white shadow-sm">
            <div className="bg-[#f3f4f6] py-4 text-center text-lg font-medium">
              Economy
            </div>

            <div className="p-6">
              <p className="mb-4 text-center text-2xl font-semibold">
                Rs. 9,999
              </p>

              <p className="mb-3 font-medium">1 Vadhyar</p>
              <p className="mb-5 text-sm text-[#4f5d2f]">
                In Economy package 1 Vadhyar will be there, 2000 japam avartis will be
                performed and homam goes on for 2:30 to 3 hours.
              </p>

              <p className="mb-2 font-medium">Procedure involved:</p>
              <ul className="list-disc space-y-1 pl-5 text-sm text-[#4f5d2f]">
                <li>Homam</li>
                <li>Punyaha Vachanam, Maha Sankalpam</li>
                <li>Kalasa Pooja</li>
                <li>Ganapathi Homam (2000 japams and tat dasams homam)</li>
              </ul>
            </div>
          </div>

          {/* Standard (Highlighted) */}
          <div className="overflow-hidden rounded-2xl border-2 border-[#2f9e44] bg-white shadow-lg">
            <div className="bg-[#2f9e44] py-4 text-center text-lg font-medium text-white">
              Standard
            </div>

            <div className="p-6">
              <p className="mb-4 text-center text-2xl font-semibold text-[#2f9e44]">
                Rs. 12,999
              </p>

              <p className="mb-3 font-medium">2 Vadhyar</p>
              <p className="mb-5 text-sm text-[#4f5d2f]">
                In Standard package 2 Vadhyar will be there, 2000 japam avartis will be
                performed and homam goes on for 2:30 to 3 hours.
              </p>

              <p className="mb-2 font-medium">Procedure involved:</p>
              <ul className="list-disc space-y-1 pl-5 text-sm text-[#4f5d2f]">
                <li>Homam</li>
                <li>Punyaha Vachanam, Maha Sankalpam</li>
                <li>Kalasa Pooja</li>
                <li>Ganapathi Homam (2000 japams and tat dasams homam)</li>
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
                Rs. 20,000
              </p>

              <p className="mb-3 font-medium">4 Vadhyar</p>
              <p className="mb-5 text-sm text-[#4f5d2f]">
                In Premium package 4 Vadhyar will be there, 2000 japam avartis will be
                performed and homam goes on for 2:30 to 3 hours.
              </p>

              <p className="mb-2 font-medium">Procedure involved:</p>
              <ul className="list-disc space-y-1 pl-5 text-sm text-[#4f5d2f]">
                <li>Homam</li>
                <li>Punyaha Vachanam, Maha Sankalpam</li>
                <li>Kalasa Pooja</li>
                <li>Ganapathi Homam (2000 japams and tat dasams homam)</li>
              </ul>
            </div>
          </div>

        </div>
      </section>
    </section>
  );
}