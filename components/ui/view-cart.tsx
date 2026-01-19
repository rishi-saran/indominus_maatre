"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ShoppingCart, X } from "lucide-react";

interface CartService {
  id: number;
  title: string;
  image: string;
  description?: string;
  formData?: {
    package?: string;
    date?: string;
    flowers?: string;
  };
  addedAt?: string;
}

const accent = "#2f9e44"; // matches header green

export function ViewCartButton({ redirectTo }: { redirectTo?: string } = {}) {
  const [isOpen, setIsOpen] = useState(false);
  const [services, setServices] = useState<CartService[]>([]);

  // Load services from localStorage and watch for updates
  useEffect(() => {
    const load = () => {
      try {
        const stored = JSON.parse(localStorage.getItem("addedServices") || "[]");
        setServices(Array.isArray(stored) ? stored : []);
      } catch (e) {
        setServices([]);
      }
    };

    load();
    const handler = () => load();
    window.addEventListener("storage", handler);
    window.addEventListener("servicesUpdated", handler as EventListener);
    return () => {
      window.removeEventListener("storage", handler);
      window.removeEventListener("servicesUpdated", handler as EventListener);
    };
  }, []);

  const toggle = () => setIsOpen((o) => !o);

  const removeService = (id: number) => {
    const updated = services.filter((svc) => svc.id !== id);
    setServices(updated);
    localStorage.setItem("addedServices", JSON.stringify(updated));
    window.dispatchEvent(new Event("servicesUpdated"));
  };

  const clearAll = () => {
    setServices([]);
    localStorage.removeItem("addedServices");
    window.dispatchEvent(new Event("servicesUpdated"));
  };

  // If redirectTo is provided, render as Link
  if (redirectTo) {
    return (
      <Link href={redirectTo}>
        <button
          className="fixed top-4 right-4 z-50 inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold text-white shadow-lg transition hover:-translate-y-0.5"
          style={{ backgroundColor: accent }}
          aria-label="View cart"
        >
          <ShoppingCart className="h-4 w-4" />
          <span>View Cart</span>
          {services.length > 0 && (
            <span className="ml-1 rounded-full bg-white/90 px-2 py-0.5 text-xs font-bold text-[#2f3a1f]">
              {services.length}
            </span>
          )}
        </button>
      </Link>
    );
  }

  return (
    <>
      <button
        onClick={toggle}
        className="fixed top-4 right-4 z-50 inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold text-white shadow-lg transition hover:-translate-y-0.5"
        style={{ backgroundColor: accent }}
        aria-label="View cart"
      >
        <ShoppingCart className="h-4 w-4" />
        <span>View Cart</span>
        {services.length > 0 && (
          <span className="ml-1 rounded-full bg-white/90 px-2 py-0.5 text-xs font-bold text-[#2f3a1f]">
            {services.length}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" onClick={toggle} />
          <div className="relative z-10 w-full max-w-lg rounded-2xl border border-[#cfd8a3] bg-white p-5 shadow-2xl ring-1 ring-[#e3ebbd]">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-[#2f3a1f]">Your Cart</h2>
              <div className="flex items-center gap-2">
                {services.length > 0 && (
                  <button
                    onClick={clearAll}
                    className="rounded-full px-3 py-1 text-xs font-semibold text-white shadow-sm"
                    style={{ backgroundColor: accent }}
                  >
                    Clear All
                  </button>
                )}
                <button onClick={toggle} aria-label="Close cart" className="p-1 text-[#4f5d2f] hover:text-[#2f3a1f]">
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>

            {services.length === 0 ? (
              <p className="py-4 text-center text-sm text-[#4f5d2f]">No services in cart yet.</p>
            ) : (
              <div className="space-y-3 max-h-[60vh] overflow-y-auto pr-1">
                {services.map((svc) => (
                  <div
                    key={svc.id}
                    className="flex gap-3 rounded-xl border border-[#cfd8a3] bg-[#fafcf0] p-3 ring-1 ring-[#e3ebbd]"
                  >
                    <img
                      src={svc.image}
                      alt={svc.title}
                      className="h-16 w-16 rounded-lg object-cover border border-[#cfd8a3]"
                    />
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-[#2f3a1f]">{svc.title}</p>
                      {svc.description && (
                        <p className="text-xs text-[#4f5d2f] line-clamp-2">{svc.description}</p>
                      )}
                      {svc.formData && (
                        <div className="mt-1 text-[11px] text-[#4f5d2f]">
                          {svc.formData.package && <div>Package: {svc.formData.package}</div>}
                          {svc.formData.date && <div>Date: {svc.formData.date}</div>}
                          {svc.formData.flowers && <div>Flowers: {svc.formData.flowers}</div>}
                        </div>
                      )}
                    </div>
                    <button
                      onClick={() => removeService(svc.id)}
                      className="self-start rounded-full border border-[#cfd8a3] bg-white px-3 py-1 text-xs font-semibold text-[#2f3a1f] hover:bg-[#eef4cf]"
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}

export default ViewCartButton;
