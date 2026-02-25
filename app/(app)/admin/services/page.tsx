"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Plus, Search, Filter, MoreVertical, Calendar, Clock, ArrowRight, Sparkles, Layers, Package, Zap, ScrollText, HeartHandshake, Flame, Video, Users, TrendingUp, Activity, ChevronLeft, ChevronRight, ArrowUpDown, ChevronDown, Check, X } from "lucide-react";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { HoverCard } from "@/components/ui/magic/hover-card";
import { getAdminServices, createAdminService, updateAdminService, deleteAdminService } from "@/lib/api/admin/services";



export default function ServicesPage() {
    const [servicesData, setServicesData] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 16;

    function getAdminToken() {
        if (typeof window !== "undefined") {
            return localStorage.getItem("adminToken") || "";
        }
        return "";
    }

    useEffect(() => {
        async function fetchServices() {
            setLoading(true);
            setError(null);
            try {
                const token = getAdminToken();
                const res = await getAdminServices(token);
                setServicesData(res.data.items || []);
            } catch (e: any) {
                setError(e.message || "Failed to fetch services");
            } finally {
                setLoading(false);
            }
        }
        fetchServices();
    }, []);

    const filteredServices = servicesData.filter((service: any) => {
        if (searchQuery) {
            const query = searchQuery.toLowerCase();
            return service.title?.toLowerCase().includes(query) || service.description?.toLowerCase().includes(query);
        }
        return true;
    });

    const totalPages = Math.ceil(filteredServices.length / itemsPerPage);
    const displayedServices = filteredServices.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

    return (
        <div className="space-y-8 font-sans">
            {loading && <div className="text-center text-gray-500">Loading services...</div>}
            {error && <div className="text-center text-red-500">{error}</div>}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Services & Offerings</h1>
                    <p className="text-gray-500 mt-1">Manage your service catalog, prices, and packages.</p>
                </div>
            </div>
            <div className="mb-4">
                <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="block w-full max-w-md px-4 py-2 border border-gray-200 rounded-lg"
                    placeholder="Search services..."
                />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {displayedServices.length > 0 ? (
                    displayedServices.map((service, index) => (
                        <div key={`${service.title}-${index}`} className="bg-white rounded-3xl border border-gray-100/50 shadow-sm p-6 flex flex-col">
                            <h2 className="font-bold text-lg mb-2">{service.title}</h2>
                            <p className="text-gray-500 mb-2">{service.description}</p>
                            <div className="text-xs text-gray-400">ID: {service.id}</div>
                        </div>
                    ))
                ) : (
                    <div className="col-span-full text-center text-gray-400 py-12">No services found.</div>
                )}
            </div>
            {/* Pagination */}
            {totalPages > 1 && (
                <div className="flex justify-center gap-2 mt-8">
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                        <button
                            key={page}
                            onClick={() => setCurrentPage(page)}
                            className={`px-4 py-2 rounded ${currentPage === page ? "bg-[#1a5d1a] text-white" : "bg-gray-100 text-gray-700"}`}
                        >
                            {page}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}


