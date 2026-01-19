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

export default function HaridraGanapathyHomamPage() {
  const router = useRouter();
  const [tab, setTab] = useState<"description" | "reviews" | "faq">("description");
  const [rating, setRating] = useState<number>(0);
  
  const [formData, setFormData] = useState({
    location: '',
    venue: '',
    priestPreference: 'Tamil',
    date: '',
    package: 'Economy',
    flowers: 'No'
  });

  const handleBookService = () => {
    const serviceId = Date.now();
    const serviceData = {
      id: serviceId,
      title: 'Haridra Ganapathy Homam',
      description: 'Special homam to Lord Ganesha with turmeric for removing obstacles and success.',
      image: '/services/virtual/Haridra Ganapathy Homam.png',
      formData: formData,
      addedAt: new Date().toISOString()
    };
    
    const existingServices = JSON.parse(localStorage.getItem('addedServices') || '[]');
    existingServices.push(serviceData);
    localStorage.setItem('addedServices', JSON.stringify(existingServices));
    window.dispatchEvent(new Event('servicesUpdated'));

    toast.success("Service booked successfully", {
      description: "Your booking has been added to cart",
      duration: 3000,
    });
    toast.dismiss();

    setFormData({
      location: '',
      venue: '',
      priestPreference: 'Tamil',
      date: '',
      package: 'Economy',
      flowers: 'No'
    });

    setTimeout(() => {
      router.push('/cart');
    }, 1000);
  };

  return (
    <section className="w-full px-6 pt-4 pb-16">
      <div className="fixed top-6 left-6 z-50">
        <Link href="/services/virtual" className="inline-flex items-center justify-center rounded-full bg-[#2f9e44] p-3 shadow-lg text-white hover:bg-[#256b32]">
          <ArrowLeft className="h-5 w-5" />
        </Link>
      </div>
     
      <div className="mx-auto mt-4 mb-8 max-w-6xl text-center">
       <h1 className="text-3xl font-serif tracking-wide leading-tight text-[#2f3a1f]">
        Haridra Ganapathy Homam
        </h1>
        <p className="mt-2 text-sm text-[#4f5d2f]">
          Special homam to Lord Ganesha with turmeric for removing obstacles and success.
        </p>
      </div>

      <div className="mx-auto max-w-6xl">
        <div className="grid grid-cols-1 gap-8 items-start">
          
          <div className="flex justify-center">
            <div className="w-[300px] rounded-2xl border border-[#cfd8a3] bg-white p-4 shadow-sm">
              <div className="aspect-square overflow-hidden rounded-xl bg-[#eef4cf]">
                <Image
                  src="/services/virtual/Haridra Ganapathy Homam.png"
                  alt="Haridra Ganapathy Homam"
                  width={400}
                  height={400}
                  className="h-full w-full object-cover"
                  unoptimized
                />
              </div>
            </div>
          </div>

          <div className="space-y-4 text-center">
            <p className="text-lg font-semibold text-[#2f3a1f]">
              ₹9,999.00 – ₹20,000.00
            </p>

            <p className="text-sm text-[#4f5d2f]">
              <strong>Duration:</strong> 2.5-3 hrs
            </p>

            <p className="text-sm text-[#4f5d2f]">
              <strong>Objective:</strong> To invoke Lord Ganesha with turmeric (Haridra) for removal of obstacles, prosperity, and success in all endeavors.
            </p>
          </div>

          <div className="rounded-3xl border border-[#cfd8a3] bg-white p-6">
            <div className="mb-4">
              <label className="mb-1 block text-sm font-medium">Location *</label>
              <input 
                value={formData.location}
                onChange={(e) => setFormData({...formData, location: e.target.value})}
                className="w-full rounded-md border border-[#cfd8a3] bg-white px-3 py-2 text-sm focus:border-[#2f9e44] focus:outline-none focus:ring-1 focus:ring-[#2f9e44]" 
              />
            </div>

            <div className="mb-4">
              <label className="mb-1 block text-sm font-medium">Pooja Venue *</label>
              <input 
                value={formData.venue}
                onChange={(e) => setFormData({...formData, venue: e.target.value})}
                className="w-full rounded-md border border-[#cfd8a3] bg-white px-3 py-2 text-sm focus:border-[#2f9e44] focus:outline-none focus:ring-1 focus:ring-[#2f9e44]" 
              />
            </div>

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
                <Select value={formData.package} onValueChange={(value) => setFormData({ ...formData, package: value })}>
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

        <div className="mt-6 text-sm text-[#4f5d2f]">
         {tab === "description" && (
  <div className="space-y-5 text-sm text-[#4f5d2f] leading-relaxed">
    
    <p>
      <strong>Haridra Ganapathy Homam</strong> is a special Vedic ritual dedicated to Lord Ganesha in his Haridra (turmeric) form, performed for removing obstacles, prosperity, and success in all endeavors.
    </p>

    <p>
      <strong>Deity Worshipped:</strong> Lord Haridra Ganapathy (Turmeric Ganesha - Form of Ganesha)
    </p>

    <p>
      <strong>Purpose:</strong> This homam is performed for removal of obstacles in all aspects of life, success in new ventures and projects, prosperity and abundance, good health and well-being, and protection from negative forces.
    </p>

    <p>
      <strong>Benefits:</strong> Complete removal of obstacles, success in endeavors, prosperity and wealth, good health and healing, protection and divine blessings, and wisdom and intelligence.
    </p>

    <p>
      <strong>Suitable for:</strong> Individuals starting new ventures, those facing obstacles, people seeking prosperity, students and professionals, and families desiring overall well-being.
    </p>

    <p>
      <strong>Best time to perform:</strong> Wednesdays, Chaturthi (4th day), Ganesh Chaturthi, or during auspicious periods as recommended by your priest.
    </p>

        </div>
      )}

      {tab === "reviews" && (
  <div className="mt-6 space-y-6 text-sm text-[#4f5d2f]">
<div className="rounded-lg bg-[#2f9e44] px-4 py-3 text-white shadow-sm">
  There are no reviews yet.
</div>

    <p>
      Your email address will not be published. Required fields are marked{" "}
      <span className="text-red-500">*</span>
    </p>

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
            ? "fill-[#f4c430] text-[#f4c430]"
            : "text-[#9ca67a]"
        }`}
      />
    ))}
  </div>
</div>

    <div>
      <label className="mb-2 block font-medium text-[#2f3a1f]">
        Your review <span className="text-red-500">*</span>
      </label>
      <textarea
        rows={4}
        className="w-full rounded-md border border-[#cfd8a3] bg-white px-3 py-2 text-sm text-[#2f3a1f] outline-none focus:border-[#2f9e44] focus:ring-1 focus:ring-[#2f9e44]"
      />
    </div>

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
        "Pay-Balance" button in your My- Account section corresponding to your
        order number).
      </p>
    </div>

    <div>
      <p className="font-semibold">
        2. How Long does the Homam take to complete?
      </p>
      <p className="mt-2 text-[#4f5d2f]">
        Homams are typically performed for 2.5-3 hours at the same time it also
        depends on the package selected for the homam.
      </p>
    </div>

    <div>
      <p className="font-semibold">
        3. When will I get the Prasad for my Homam if I select Vedic Pooja Center
        since I\'m abroad?
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
          <li>Haridra Ganapathy Homam (2000 japams and tat dasams homam)</li>
        </ul>
      </div>
    </div>

    <div className="overflow-hidden rounded-2xl border-2 border-[#2f9e44] bg-white shadow-lg min-h-[460px]">
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
          <li>Haridra Ganapathy Homam (2000 japams and tat dasams homam)</li>
        </ul>
      </div>
    </div>

    <div className="overflow-hidden rounded-2xl border border-[#d8e2a8] bg-white shadow-sm min-h-[460px]">
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
          <li>Haridra Ganapathy Homam (2000 japams and tat dasams homam)</li>
        </ul>
        </div>
      </div>
    </div>
      </section>
    </section>
  );
}
