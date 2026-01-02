"use client";

import Link from "next/link";
import { ArrowLeft, User, Mail, Phone, MapPin, LogOut } from "lucide-react";
import { useState } from "react";

export default function AccountPage() {
  const [userInfo, setUserInfo] = useState({
    name: "John Doe",
    email: "john@example.com",
    phone: "+1 (555) 123-4567",
    location: "New York, USA",
  });

  return (
    <>
      {/* Back Button */}
      <div className="w-full px-6 pt-3">
        <Link
          href="/"
          className="inline-flex items-center text-sm font-medium text-[#5f6d2b] hover:underline"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Home
        </Link>
      </div>

      {/* Account Section */}
      <section className="w-full px-6 pt-6 pb-16">
        {/* Header */}
        <div className="mx-auto mb-8 max-w-2xl">
          <h1 className="text-4xl font-serif text-[#2f3a1f]">My Account</h1>
          <p className="mt-2 text-sm text-[#4f5d2f]">
            Manage your profile and account settings
          </p>
        </div>

        {/* Profile Card */}
        <div className="mx-auto max-w-2xl rounded-2xl border border-[#cfd8a3] bg-white p-8 ring-1 ring-[#e3ebbd]">
          {/* Avatar */}
          <div className="mb-6 flex items-center gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#eef4cf]">
              <User className="h-8 w-8 text-[#5f6d2b]" />
            </div>
            <div>
              <h2 className="text-2xl font-semibold text-[#2f3a1f]">
                {userInfo.name}
              </h2>
              <p className="text-sm text-[#4f5d2f]">Premium Member</p>
            </div>
          </div>

          <div className="h-px bg-[#cfd8a3]" />

          {/* User Info */}
          <div className="mt-6 space-y-4">
            <div className="flex items-start gap-4">
              <Mail className="mt-1 h-5 w-5 text-[#5f6d2b]" />
              <div className="flex-1">
                <p className="text-xs font-semibold uppercase text-[#4f5d2f]">
                  Email
                </p>
                <p className="text-base text-[#2f3a1f]">{userInfo.email}</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <Phone className="mt-1 h-5 w-5 text-[#5f6d2b]" />
              <div className="flex-1">
                <p className="text-xs font-semibold uppercase text-[#4f5d2f]">
                  Phone
                </p>
                <p className="text-base text-[#2f3a1f]">{userInfo.phone}</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <MapPin className="mt-1 h-5 w-5 text-[#5f6d2b]" />
              <div className="flex-1">
                <p className="text-xs font-semibold uppercase text-[#4f5d2f]">
                  Location
                </p>
                <p className="text-base text-[#2f3a1f]">{userInfo.location}</p>
              </div>
            </div>
          </div>

          <div className="mt-8 flex gap-4">
            <button className="flex-1 rounded-lg bg-[#5f6d2b] px-4 py-2 text-sm font-medium text-white hover:bg-[#4f5d1f] transition-colors">
              Edit Profile
            </button>
            <button className="flex-1 rounded-lg border border-[#cfd8a3] px-4 py-2 text-sm font-medium text-[#5f6d2b] hover:bg-[#eef4cf] transition-colors">
              Account Settings
            </button>
          </div>
        </div>

        {/* Recent Activity Section */}
        <div className="mx-auto mt-8 max-w-2xl">
          <h3 className="mb-4 text-xl font-semibold text-[#2f3a1f]">
            Recent Bookings
          </h3>
          <div className="rounded-2xl border border-[#cfd8a3] bg-white p-6">
            <p className="text-center text-sm text-[#4f5d2f]">
              No bookings yet. <Link href="/services" className="text-[#5f6d2b] hover:underline font-medium">
                Browse services
              </Link>
            </p>
          </div>
        </div>

        {/* Logout Button */}
        <div className="mx-auto mt-8 max-w-2xl">
          <button className="w-full flex items-center justify-center gap-2 rounded-lg bg-red-50 px-4 py-3 text-sm font-medium text-red-600 hover:bg-red-100 transition-colors border border-red-200">
            <LogOut className="h-4 w-4" />
            Logout
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="w-full px-6 py-6">
        <div className="mx-auto flex max-w-2xl flex-col items-center justify-between gap-4 text-sm text-[#4f5d2f] sm:flex-row">
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