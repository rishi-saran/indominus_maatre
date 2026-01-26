"use client";

import React, { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { Dock, DockIcon } from "../ui/dock";
import { Brand } from "../brand";
import { Home, Search, Users, User, Calendar, Tv } from "lucide-react";
import { PanchangDropdown } from "../panchang";
import { SearchDialog } from "../search-dialog";
import { getUserWithRole } from "@/lib/stream/auth/getUserWithRole";

const navItems = [
  { icon: Home, label: "Home", id: "home" },
  { icon: Search, label: "Explore", id: "explore" },
  { icon: Users, label: "Service", id: "service" },
    { icon: Tv, label: "Live Streams", id: "live-streams" },
  { icon: Calendar, label: "Panchang", id: "panchang" },
  { icon: User, label: "Profile", id: "profile" },
];

export function Navbar() {
  const [panchangOpen, setPanchangOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [role, setRole] = useState<"priest" | "customer" | null>(null);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    getUserWithRole().then((user) => setRole(user?.role ?? null));
  }, []);

  const isRouteActive = (id: string) => {
    if (id === "home") return pathname === "/" || pathname.startsWith("/landing");
    if (id === "service") return pathname.startsWith("/services");
    if (id === "profile") return pathname.startsWith("/profile");
    if (id === "panchang") return pathname.startsWith("/panchang");
    if (id === "live-streams") {
      if (role === "priest") return pathname.startsWith("/priest/dashboard");
      return pathname.startsWith("/live-streams");
    }
    return false;
  };

  const handleIconClick = (id: string) => {
    // Close other popups first
    if (id !== "panchang") setPanchangOpen(false);
    if (id !== "explore") setSearchOpen(false);

    if (id === "panchang") {
      setPanchangOpen(!panchangOpen);
    } else if (id === "home") {
      router.push("/landing");
    } else if (id === "explore") {
      setSearchOpen(true);
    } else if (id === "service") {
      router.push("/services");
    } else if (id === "live-streams") {
      if (role === "priest") {
        router.push("/priest/dashboard");
      } else {
        router.push("/live-streams");
      }
    } else if (id === "profile") {
      router.push("/profile");
    } else {
      // Handle other navigation here
    }
  };

  return (
    <>
      <motion.nav
        className="fixed top-0 left-0 right-0 z-40 px-4 md:px-8 py-4"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="max-w-7xl mx-auto flex justify-center">
          {/* Single Glass Container with Logo + Dock */}
          <div className="glass rounded-full px-4 py-2 shadow-lg shadow-black/5 flex items-center gap-6 relative">
            {/* Brand Logo */}
            <div className="px-3">
              <Brand isNavbar />
            </div>

            {/* Divider */}
            <div className="w-px h-8 bg-[var(--border)]" />

            {/* Magic UI Dock with built-in tooltips */}
            <Dock
              className="bg-transparent border-none shadow-none h-[52px] gap-2 mt-0 p-0"
              iconSize={42}
              iconMagnification={58}
              iconDistance={100}
            >
              {navItems.map((item, index) => {
                const Icon = item.icon;
                const isActive = 
                  isRouteActive(item.id) || 
                  (item.id === "panchang" && panchangOpen) ||
                  (item.id === "explore" && searchOpen);
                
                return (
                  <DockIcon
                    key={index}
                    label={item.label}
                    className={`${
                      isActive
                        ? "bg-[var(--spiritual-green)] text-white"
                        : "bg-[var(--spiritual-green-light)]/50 text-[var(--spiritual-green-dark)] hover:bg-[var(--spiritual-green-light)]"
                    } transition-colors cursor-pointer`}
                    onClick={() => handleIconClick(item.id)}
                  >
                    <Icon className="w-5 h-5" />
                  </DockIcon>
                );
              })}
            </Dock>

            {/* Panchang Dropdown */}
            <PanchangDropdown 
              isOpen={panchangOpen} 
              onClose={() => setPanchangOpen(false)} 
            />
          </div>
        </div>
      </motion.nav>

      {/* Search Dialog */}
      <SearchDialog 
        isOpen={searchOpen} 
        onClose={() => setSearchOpen(false)} 
      />
    </>
  );
}

export default Navbar;

