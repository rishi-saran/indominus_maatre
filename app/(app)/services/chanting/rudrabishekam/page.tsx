"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, Star } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

export default function RudrabishekamPage() {
  const [tab, setTab] = useState<"description" | "reviews" | "faq">("description");
  const [rating, setRating] = useState<number>(0);

  const [formData, setFormData] = useState({
    location: "",
    venue: "",
    priestPreference: "Tamil",
    date: "",
    package: "Economy",
    flowers: "No",
  });

  const handleBookService = () => {
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

    const serviceData = {
      id: Date.now(),
      title: "RUDRABISHEKAM",
      description:
        "Rudrabishekam is a sacred ritual dedicated to Lord Shiva for purification, peace, and spiritual growth.",
      image: "/services/homam/rudrabishekam.png",
      formData,
      addedAt: new Date().toISOString(),
    };

    const existing = JSON.parse(localStorage.getItem("addedServices") || "[]");
    existing.push(serviceData);
    localStorage.setItem("addedServices", JSON.stringify(existing));

    window.dispatchEvent(new Event("servicesUpdated"));

    toast.success("Service booked successfully", {
      description: "Your booking has been added successfully",
      duration: 3000,
    });
  };

  return (
    <section className="w-full px-6 pt-4 pb-16">
      {/* Back Button */}
      <div className="fixed top-6 left-6 z-50">
        <Link
          href="/services/chanting"
          className="inline-flex items-center justify-center rounded-full bg-[#2f9e44] p-3 text-white shadow-lg"
        >
          <ArrowLeft className="h-5 w-5" />
        </Link>
      </div>

      {/* Title */}
      <div className="mx-auto mt-4 mb-8 max-w-6xl text-center">
        <h1 className="text-3xl font-serif text-[#2f3a1f]">
          RUDRABISHEKAM
        </h1>
        <p className="mt-2 text-sm text-[#4f5d2f]">
          A sacred ritual dedicated to Lord Shiva for purification, peace, and divine blessings.
        </p>
      </div>

      {/* Image */}
      <div className="mx-auto max-w-6xl grid grid-cols-1 gap-8">
        <div className="flex justify-center">
          <div className="w-[300px] rounded-2xl border bg-white p-4">
            <div className="aspect-square overflow-hidden rounded-xl bg-[#eef4cf]">
              <Image
                src="/services/chanting/rudrabishegam.png"
                alt="Rudrabishekam"
                width={400}
                height={400}
                className="h-full w-full object-cover"
                unoptimized
              />
            </div>
          </div>
        </div>

        {/* Price */}
        <div className="text-center space-y-3">
          <p className="text-lg font-semibold text-[#2f3a1f]">
            ₹15,000.00 – ₹35,000.00
          </p>
          <p className="text-sm text-[#4f5d2f]">
            <strong>Deity:</strong> Lord Shiva
          </p>
            <p className="text-sm text-[#4f5d2f]">
              <strong>“Rudrabishekam’s meaning can be understood as follows”:</strong>“Rudra” refers to Lord Shiva, and “Abhishekam” means bathing or pouring sacred offerings. So, Rudrabishekam literally translates to “bathing Lord Shiva” with various sacred offerings like water, milk, or ghee, symbolizing purification and spiritual growth.
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
    
    <p><strong>Purpose:</strong></p>
<p>The purpose of Rudrabishekam is to:</p>
<ul className="list-disc pl-5 space-y-1">
  <li>Seek Lord Shiva’s blessings to attain spiritual growth, protection, and guidance</li>
  <li>Purify and cleanse negative energies and karmas</li>
  <li>Attain peace and harmony by experiencing inner balance</li>
  <li>Foster spiritual growth by deepening one’s connection with Lord Shiva</li>
  <li>Overcome challenges by seeking relief from difficulties and obstacles</li>
</ul>

<p><strong>Significance:</strong></p>
<ul className="list-disc pl-5 space-y-1">
  <li>Purification by removing negative energies and karmas</li>
  <li>Spiritual growth by deepening one’s connection with Lord Shiva</li>
  <li>Peace and harmony by bringing inner balance</li>
  <li>Blessings by seeking Lord Shiva’s grace and protection</li>
  <li>Well-being by promoting physical, mental, and emotional health</li>
</ul>

<p>
  This ritual is believed to bring devotees closer to Lord Shiva, fostering
  spiritual growth and positivity.
</p>

<p><strong>Benefits:</strong></p>
<p>The benefits of Rudrabishekam include:</p>
<ul className="list-disc pl-5 space-y-1">
  <li>Spiritual growth by deepening connection with Lord Shiva</li>
  <li>Peace and harmony through inner peace and balance</li>
  <li>Purification by removing negative energies and karmas</li>
  <li>Protection by seeking Lord Shiva’s protection from harm</li>
  <li>Well-being by promoting physical, mental, and emotional health</li>
  <li>Relief from challenges by overcoming difficulties and obstacles</li>
  <li>Divine blessings by receiving Lord Shiva’s grace and blessings</li>
</ul>

<p><strong>When it’s to be Performed:</strong></p>
<p>Rudrabishekam can be performed on various occasions, including:</p>
<ul className="list-disc pl-5 space-y-1">
  <li>Mondays, considered auspicious for Lord Shiva</li>
  <li>Shivaratri, a significant festival dedicated to Lord Shiva</li>
  <li>Special occasions such as birthdays, new beginnings, or important life events</li>
  <li>Astrological events during specific planetary positions or eclipses</li>
  <li>Personal rituals performed regularly as part of spiritual practice</li>
</ul>

<p>
  The timing may vary depending on individual preferences, astrological
  considerations, or traditional guidelines.
</p>

<p><strong>Deity:</strong></p>
<p>
  The deity worshipped in Rudrabishekam is Lord Shiva, one of the principal
  deities in Hinduism. Lord Shiva is revered as the destroyer of evil and
  ignorance, the transformer of energies and aspects of life, and the
  embodiment of divine consciousness, spiritual growth, and enlightenment.
  Rudrabishekam is a sacred way to connect with and seek the blessings of
  Lord Shiva.
</p>

<p><strong>Ritual Details:</strong></p>
<ul className="list-disc pl-5 space-y-1">
  <li>Preparation of the Shiva Linga by purifying and decorating the Linga</li>
  <li>Sankalp (intention) by setting the purpose of the ritual</li>
  <li>Rudram chanting by reciting the Rudram (Sri Rudra Prasna)</li>
  <li>Offerings by pouring sacred substances such as water, milk, or ghee over the Linga</li>
  <li>Abhishekam by bathing the Linga with various sacred substances</li>
  <li>Archana by offering prayers and worship</li>
  <li>Pujas and homams by performing additional rituals and fire ceremonies</li>
</ul>

<p>
  These details may vary depending on the specific tradition or guidance of a
  priest.
</p>

<p><strong>Regional Variations:</strong></p>
<ul className="list-disc pl-5 space-y-1">
  <li>Ritual procedures using different methods and sequences</li>
  <li>Mantras and prayers with variations in recitation</li>
  <li>Offerings using different substances for Abhishekam</li>
  <li>Cultural influences shaped by local customs and traditions</li>
  <li>Temple traditions followed in different Shiva temples</li>
</ul>

<p><strong>Conclusion:</strong></p>
<p>
  Rudrabishekam is a sacred ritual that connects devotees with Lord Shiva,
  seeking purification, spiritual growth, and divine blessings. Through this
  ritual, individuals can experience inner peace, harmony, and a deeper
  connection with the divine. Its significance lies in its ability to bring
  spiritual growth, protection, and overall well-being, making it a revered
  practice in Hinduism.
</p>
</div>)}
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
    