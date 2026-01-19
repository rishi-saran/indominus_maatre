"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowLeft } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Star } from "lucide-react";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

export default function AavahanthiHomamPage() {
  const router = useRouter();
  const [tab, setTab] = useState<"description" | "reviews" | "faq">("description");
  const [rating, setRating] = useState<number>(0);
  
  
  // Form state
  const [formData, setFormData] = useState({
    location: '',
    venue: '',
    priestPreference: 'Tamil',
    date: '',
    package: 'Economy',
    flowers: 'No'
  });

  const handleBookService = () => {
    // Save service details to localStorage with current timestamp as ID
    const serviceId = Date.now();
    const serviceData = {
      id: serviceId,
      title: 'AAVAHANTHI HOMAM',
      description: 'Aavahanthi Homam is performed to invoke divine blessings for success, prosperity, and removal of obstacles.',
      image: '/services/virtual/Aavahanthi Homom.png',
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
      description: "Your booking has been added to cart",
      duration: 3000, // 3 seconds
    });
    toast.dismiss(); // clears existing toasts

    
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
        <Link href="/services/virtual" className="inline-flex items-center justify-center rounded-full bg-[#2f9e44] p-3 shadow-lg text-white hover:bg-[#256b32]">
          <ArrowLeft className="h-5 w-5" />
        </Link>
      </div>
     
      {/* Title */}
      <div className="mx-auto mt-4 mb-8 max-w-6xl text-center">
       <h1 className="text-3xl font-serif tracking-wide leading-tight text-[#2f3a1f]">
        AAVAHANTHI HOMAM
        </h1>
        <p className="mt-2 text-sm text-[#4f5d2f]">
          Aavahanthi Homam is performed to invoke divine blessings for success,
          prosperity, and removal of obstacles in your spiritual journey.
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
                  src="/services/virtual/Aavahanthi Homom.png"
                  alt="Aavahanthi Homam"
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
              ₹8,500.00 – ₹18,000.00
            </p>

            <p className="text-sm text-[#4f5d2f]">
              <strong>Duration:</strong> 2-3 hrs
            </p>

            <p className="text-sm text-[#4f5d2f]">
              <strong>Objective:</strong> To invoke divine blessings for success, prosperity, and obstacle removal.
            </p>
          </div>

          {/* BOOKING CARD */}
          <div className="rounded-3xl border border-[#cfd8a3] bg-white p-6">
            {/* Location */}
            <div className="mb-4">
              <label className="mb-1 block text-sm font-medium">Location *</label>
              <input 
                value={formData.location}
                onChange={(e) => setFormData({...formData, location: e.target.value})}
                className="w-full rounded-md border border-[#cfd8a3] bg-white px-3 py-2 text-sm focus:border-[#2f9e44] focus:outline-none focus:ring-1 focus:ring-[#2f9e44]" 
              />
            </div>

            {/* Venue */}
            <div className="mb-4">
              <label className="mb-1 block text-sm font-medium">Pooja Venue *</label>
              <input 
                value={formData.venue}
                onChange={(e) => setFormData({...formData, venue: e.target.value})}
                className="w-full rounded-md border border-[#cfd8a3] bg-white px-3 py-2 text-sm focus:border-[#2f9e44] focus:outline-none focus:ring-1 focus:ring-[#2f9e44]" 
              />
            </div>

            {/* All in one row */}
            <div className="mb-6 grid grid-cols-2 gap-4 md:grid-cols-4">
              <div>
                <label className="mb-1 block text-sm font-medium text-[#2f3a1f]">
                  Priest Preference *
                </label>
                <Select value={formData.priestPreference} onValueChange={(value) => setFormData({...formData, priestPreference: value})}>
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
                  onChange={(e) => setFormData({...formData, date: e.target.value})}
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
                      onChange={() => setFormData({...formData, flowers: 'Yes'})}
                    /> 
                    Yes (+₹250)
                  </label>
                  <label className="flex items-center gap-2">
                    <input 
                      type="radio" 
                      name="flowers" 
                      checked={formData.flowers === 'No'}
                      onChange={() => setFormData({...formData, flowers: 'No'})}
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
              className={`pb-3 ${
                tab === t
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
      <strong>Aavahanthi Homam</strong> is a sacred Vedic ritual performed to invoke divine energies and receive blessings for success, prosperity, and the removal of obstacles in one's spiritual and material journey.
    </p>

    <p>
      <strong>Suitable for:</strong> Individuals seeking divine intervention for success in endeavors, businesses, or spiritual growth.
    </p>

    <p>
      <strong>Scheduling:</strong> The ceremony is typically conducted on auspicious days based on the individual's birth star and planetary positions for maximum spiritual efficacy.
    </p>

    <p>
      <strong>Deity Worshipped:</strong> Lord Agni (God of Fire) and other divine deities as per Vedic traditions
    </p>

    <p>
      <strong>Primary Offerings:</strong> Sacred offerings including ghee, rice, herbs, and other traditional items are offered into the sacred fire during the ritual. This ceremony aims to invoke divine blessings for prosperity, success, and spiritual advancement through ancient Vedic practices.
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
        className={`cursor-pointer transition ${
          star <= rating
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
        1. Can I attend the Homam virtually?
      </p>
      <p className="mt-2 text-[#4f5d2f]">
        Yes, this is a virtual homam service. You can attend the ceremony through a live video stream and receive the blessings remotely. The Prasad will be sent to your address after the ritual.
      </p>
    </div>

    <div>
      <p className="font-semibold">
        2. How Long does the Aavahanthi Homam take to complete?
      </p>
      <p className="mt-2 text-[#4f5d2f]">
        The Aavahanthi Homam typically takes 2-3 hours to complete, depending on the package selected and the number of priests performing the ritual.
      </p>
    </div>

    <div>
      <p className="font-semibold">
        3. When will I receive the Prasad after the virtual Homam?
      </p>
      <p className="mt-2 text-[#4f5d2f]">
        You will receive the Prasad within 10-14 working days after the homam has been performed (delivery time may vary based on your location and local postal services).
      </p>
    </div>

    <div>
      <p className="font-semibold">
        4. What are the benefits of performing Aavahanthi Homam?
      </p>
      <p className="mt-2 text-[#4f5d2f]">
        Aavahanthi Homam helps in removing obstacles, bringing success in endeavors, enhancing prosperity, and providing spiritual protection. It is especially beneficial for those starting new ventures or seeking divine guidance.
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
    <div className="overflow-hidden rounded-2xl border border-[#d8e2a8] bg-white shadow-sm min-h-[460px]">
      <div className="bg-[#f3f4f6] py-4 text-center text-lg font-medium">
        Economy
      </div>

      <div className="p-6">
        <p className="mb-4 text-center text-2xl font-semibold">
          Rs. 8,500
        </p>

        <p className="mb-3 font-medium">1 Vadhyar (Virtual)</p>
        <p className="mb-5 text-sm text-[#4f5d2f]">
          In Economy package 1 Vadhyar will perform the ritual virtually, 1500 japam avartis will be
          performed and homam goes on for 2 to 2:30 hours.
        </p>

        <p className="mb-2 font-medium">Procedure involved:</p>
        <ul className="list-disc space-y-1 pl-5 text-sm text-[#4f5d2f]">
          <li>Virtual Homam with Live Streaming</li>
          <li>Punyaha Vachanam, Maha Sankalpam</li>
          <li>Kalasa Pooja</li>
          <li>Ganapathi Homam (1500 japams and offerings)</li>
          <li>Prasad delivery to your address</li>
        </ul>
      </div>
    </div>

    {/* Standard (Highlighted) */}
    <div className="overflow-hidden rounded-2xl border-2 border-[#2f9e44] bg-white shadow-lg min-h-[460px]">
      <div className="bg-[#2f9e44] py-4 text-center text-lg font-medium text-white">
        Standard
      </div>

      <div className="p-6">
        <p className="mb-4 text-center text-2xl font-semibold text-[#2f9e44]">
          Rs. 12,500
        </p>

        <p className="mb-3 font-medium">2 Vadhyar (Virtual)</p>
        <p className="mb-5 text-sm text-[#4f5d2f]">
          In Standard package 2 Vadhyar will perform the ritual virtually, 2000 japam avartis will be
          performed and homam goes on for 2:30 to 3 hours.
        </p>

        <p className="mb-2 font-medium">Procedure involved:</p>
        <ul className="list-disc space-y-1 pl-5 text-sm text-[#4f5d2f]">
          <li>Virtual Homam with HD Live Streaming</li>
          <li>Punyaha Vachanam, Maha Sankalpam</li>
          <li>Kalasa Pooja</li>
          <li>Ganapathi Homam (2000 japams and offerings)</li>
          <li>Prasad delivery to your address</li>
          <li>Recorded video of the ceremony</li>
        </ul>
      </div>
    </div>

    {/* Premium */}
    <div className="overflow-hidden rounded-2xl border border-[#d8e2a8] bg-white shadow-sm min-h-[460px]">
      <div className="bg-[#f3f4f6] py-4 text-center text-lg font-medium">
        Premium
      </div>

      <div className="p-6">
        <p className="mb-4 text-center text-2xl font-semibold">
          Rs. 18,000
        </p>

        <p className="mb-3 font-medium">4 Vadhyar (Virtual)</p>
        <p className="mb-5 text-sm text-[#4f5d2f]">
          In Premium package 4 Vadhyar will perform the ritual virtually, 3000 japam avartis will be
          performed and homam goes on for 3 to 3:30 hours.
        </p>

        <p className="mb-2 font-medium">Procedure involved:</p>
        <ul className="list-disc space-y-1 pl-5 text-sm text-[#4f5d2f]">
          <li>Virtual Homam with HD Live Streaming</li>
          <li>Punyaha Vachanam, Maha Sankalpam</li>
          <li>Kalasa Pooja</li>
          <li>Ganapathi Homam (3000 japams and offerings)</li>
          <li>Express Prasad delivery</li>
          <li>HD Recorded video of the ceremony</li>
          <li>Personal consultation with priest</li>
        </ul>
        </div>
      </div>

        </div>
      </section>
    </section>
  );
}
