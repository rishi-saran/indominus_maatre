"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Plus, Search, Filter, MoreVertical, Calendar, Clock, ArrowRight, Sparkles, Layers, Package, Zap, ScrollText, HeartHandshake, Flame, Video, Users, TrendingUp, Activity, ChevronLeft, ChevronRight, ArrowUpDown, ChevronDown, Check, X } from "lucide-react";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { HoverCard } from "@/components/ui/magic/hover-card";
import { homamServices, homams } from "@/data/homams";
import { virtualServices } from "@/lib/data/virtual-services";

const chantingServices = [
    {
        title: "Ayusha Homam",
        image: "/services/chanting/ayusha-homam.png",
        href: "/services/chanting/ayusha-homam",
    },
    {
        title: "Rudrabishekam",
        image: "/services/chanting/rudrabishegam.png",
        href: "/services/chanting/rudrabishekam",
    },
];

// Mock Data
const categories = [
    {
        id: 1,
        name: "Chanting",
        count: 12,
        description: "Sacred Vedic chants performed with devotion to bring peace, clarity, and positive energy.",
        image: "/services/chanting1.png",
    },
    {
        id: 2,
        name: "Parihara Pooja",
        count: 8,
        description: "Traditional remedies and poojas performed to resolve doshas and life obstacles.",
        image: "/services/parihara-pooja.png",
    },
    {
        id: 3,
        name: "Rituals / Homam",
        count: 15,
        description: "Powerful fire rituals conducted by expert priests for spiritual upliftment.",
        image: "/services/homam.png",
    },
    {
        id: 4,
        name: "Virtual Services",
        count: 5,
        description: "Participate in sacred rituals and homams remotely through live virtual services.",
        image: "/services/virtual.png",
    },
];



const packages = [
    {
        id: "P001",
        name: "Wedding Rituals Suite",
        services: ["Ganapati Homam", "Vivah Samskara", "Graha Shanti"],
        price: "₹25,000",
        originalPrice: "₹29,000",
        tag: "Best Value"
    },
    {
        id: "P002",
        name: "New Home Bundle",
        services: ["Vastu Puja", "Ganapati Homam", "Go Puja"],
        price: "₹15,000",
        originalPrice: "₹18,000",
        tag: "Popular"
    }
];

export default function ServicesPage() {
    const [activeTab, setActiveTab] = useState("services");
    const [currentPage, setCurrentPage] = useState(1);
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [selectedFilter, setSelectedFilter] = useState("trending");
    const [currentPackagePage, setCurrentPackagePage] = useState(1);
    const [isConfigModalOpen, setIsConfigModalOpen] = useState(false);
    const [selectedService, setSelectedService] = useState<any>(null);
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
    const [packageTiers, setPackageTiers] = useState<string[]>(['Economy', 'Standard', 'Premium']);

    useEffect(() => {
        if (selectedService?.packages && selectedService.packages.length > 0) {
            setPackageTiers(selectedService.packages.map((p: any) => p.name));
        } else {
            setPackageTiers(['Economy', 'Standard', 'Premium']);
        }
    }, [selectedService]);

    const sortedPackageEntries = Object.entries(homams).sort(([slugA, a], [slugB, b]) => {
        const serviceA = a as any;
        const serviceB = b as any;

        const getPrice = (s: any) => {
            if (!s.priceRange) return 0;
            const match = s.priceRange.match(/[\d,]+/); // Extracts "15,000"
            return match ? parseInt(match[0].replace(/,/g, ''), 10) : 0;
        };

        if (selectedFilter === "az") return serviceA.title.localeCompare(serviceB.title);
        if (selectedFilter === "za") return serviceB.title.localeCompare(serviceA.title);
        if (selectedFilter === "price_low") return getPrice(serviceA) - getPrice(serviceB);
        if (selectedFilter === "price_high") return getPrice(serviceB) - getPrice(serviceA);

        return 0;
    });

    const currentPackages = sortedPackageEntries.slice((currentPackagePage - 1) * 10, currentPackagePage * 10);

    const filterOptions = [
        { id: "trending", label: "Trending" },
        { id: "popular", label: "Most Popular" },
        { id: "az", label: "Name (A-Z)" },
        { id: "za", label: "Name (Z-A)" },
        { id: "price_low", label: "Price (Low-High)" },
        { id: "price_high", label: "Price (High-Low)" },
        { id: "newest", label: "Newest Added" },
    ];

    const itemsPerPage = 16;
    const totalPages = Math.ceil(homamServices.length / itemsPerPage);

    const currentServices = homamServices.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    return (
        <div className="space-y-8 font-sans">
            {/* Page Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Services & Offerings</h1>
                    <p className="text-gray-500 mt-1">Manage your service catalog, prices, and packages.</p>
                </div>
            </div>

            {/* Navigation Tabs */}
            <div className="flex items-center gap-2 mb-4">
                {[
                    { id: "categories", label: "Categories" },
                    { id: "services", label: "All Services" },
                    { id: "packages", label: "Packages" }
                ].map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`relative px-6 py-3 text-sm font-bold transition-all duration-300 rounded-full ${activeTab === tab.id
                            ? "bg-[#1a5d1a] text-white shadow-lg shadow-green-900/20 scale-105"
                            : "text-gray-600 hover:bg-gray-100 hover:text-[#1a5d1a]"
                            }`}
                    >
                        {tab.label}
                    </button>
                ))}
            </div>

            {/* Content Area */}
            <div className="animate-in fade-in slide-in-from-bottom-2 duration-500">

                {/* SERVICES GRID */}
                {activeTab === "services" && (
                    <div className="space-y-6">
                        {/* Filters & Search Toolbar */}
                        <div className="relative z-50 bg-white/80 backdrop-blur-xl p-2 rounded-[2.5rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-white/40 flex flex-col sm:flex-row items-center gap-2">
                            {/* Search Input */}
                            <div className="relative flex-1 w-full group">
                                <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
                                    <Search className="h-5 w-5 text-gray-400 group-focus-within:text-[#5cb85c] transition-colors" />
                                </div>
                                <input
                                    type="text"
                                    className="block w-full pl-12 pr-4 py-4 bg-transparent text-gray-900 placeholder-gray-400 font-medium focus:outline-none text-base"
                                    placeholder="Search services..."
                                />
                            </div>

                            {/* Actions Divider */}
                            <div className="hidden sm:block w-px h-8 bg-gray-200 mx-2"></div>

                            {/* Action Buttons */}
                            <div className="flex items-center gap-2 w-full sm:w-auto pr-2">
                                <div className="relative">
                                    <button
                                        onClick={() => setIsFilterOpen(!isFilterOpen)}
                                        className="flex items-center gap-2 pl-4 pr-10 py-3.5 bg-white border border-gray-100 hover:border-gray-200 text-gray-700 text-sm font-bold rounded-[2rem] transition-all hover:shadow-md min-w-[200px] shadow-sm relative group"
                                    >
                                        <div className="p-1 bg-gray-50 rounded-full group-hover:bg-gray-100 transition-colors">
                                            <Filter className="h-3.5 w-3.5 text-gray-600" />
                                        </div>
                                        <span className="truncate">Filters: {filterOptions.find(f => f.id === selectedFilter)?.label}</span>
                                        <ChevronDown className={`absolute right-4 h-4 w-4 text-gray-400 transition-transform duration-200 ${isFilterOpen ? "rotate-180" : ""}`} />
                                    </button>

                                    {/* Dropdown Menu */}
                                    {isFilterOpen && (
                                        <>
                                            <div className="fixed inset-0 z-10" onClick={() => setIsFilterOpen(false)}></div>
                                            <div className="absolute right-0 top-full mt-2 w-64 bg-white rounded-2xl shadow-xl border border-gray-100 p-2 z-20 transform origin-top-right animate-in fade-in zoom-in-95 duration-200">
                                                <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wider px-3 py-2 mb-1">Sort Services By</div>
                                                {filterOptions.map((option) => (
                                                    <button
                                                        key={option.id}
                                                        onClick={() => {
                                                            setSelectedFilter(option.id);
                                                            setIsFilterOpen(false);
                                                        }}
                                                        className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${selectedFilter === option.id
                                                            ? "bg-[#1a5d1a]/5 text-[#1a5d1a]"
                                                            : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                                                            }`}
                                                    >
                                                        {option.label}
                                                        {selectedFilter === option.id && <Check className="w-4 h-4" />}
                                                    </button>
                                                ))}
                                            </div>
                                        </>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            {currentServices.map((service, index) => {
                                // Generate deterministic mock stats based on service index (preserving consistency across pages)
                                const globalIndex = homamServices.indexOf(service);
                                const activeBookings = (globalIndex * 7 + 3) % 12;
                                const totalBookings = (globalIndex * 123 + 45) % 500;
                                const isTrending = activeBookings > 8;
                                const status = globalIndex % 10 === 0 ? "Draft" : "Active";
                                const lastBooked = ["Rajesh K.", "Priya M.", "Amit B.", "Suresh R.", "Unknown"][globalIndex % 5];

                                return (
                                    <div key={`${service.title}-${globalIndex}`} className="group relative bg-white rounded-3xl border border-gray-100/50 shadow-sm hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.1)] transition-all duration-300 flex flex-col overflow-visible">
                                        {/* Floating Badge */}
                                        <div className="absolute top-4 right-4 z-20 flex flex-col items-end gap-2">
                                            {isTrending && (
                                                <span className="flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-white text-orange-600 shadow-md transform group-hover:scale-110 transition-transform">
                                                    <TrendingUp className="w-3 h-3" /> Trending
                                                </span>
                                            )}
                                        </div>

                                        {/* Image Area */}
                                        <div className="relative aspect-square w-full overflow-hidden rounded-t-3xl">
                                            <div className="absolute inset-0 bg-gray-100 animate-pulse -z-10" />
                                            <Image
                                                src={service.image}
                                                alt={service.title}
                                                fill
                                                className={`w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-110 ${status === 'Draft' ? 'grayscale opacity-70' : ''}`}
                                                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                                unoptimized
                                            />
                                            {/* Status Indicator (Bottom Left of Image) */}
                                            <div className="absolute bottom-3 left-3">
                                                <span className={`px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider backdrop-blur-md shadow-sm border ${status === 'Active'
                                                    ? 'bg-white/95 text-green-700 border-green-100/50'
                                                    : 'bg-white/95 text-gray-500 border-gray-200/50'
                                                    }`}>
                                                    <span className={`inline-block w-1.5 h-1.5 rounded-full mr-1.5 ${status === 'Active' ? 'bg-green-500 animate-pulse' : 'bg-gray-400'}`}></span>
                                                    {status}
                                                </span>
                                            </div>
                                        </div>

                                        {/* Content */}
                                        <div className="p-5 pt-4 flex-1 flex flex-col">
                                            <div className="flex justify-between items-start gap-4 mb-4">
                                                <h3 className="text-lg font-bold text-gray-900 leading-tight group-hover:text-[#1a5d1a] transition-colors line-clamp-2">
                                                    {service.title}
                                                </h3>
                                                <button className="text-gray-300 hover:text-gray-900 transition-colors p-1 hover:bg-gray-50 rounded-full shrink-0">
                                                    <MoreVertical className="w-5 h-5" />
                                                </button>
                                            </div>

                                            {/* Stats Row */}
                                            <div className="flex items-center gap-6 mb-5 px-1">
                                                <div className="flex flex-col">
                                                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-0.5">Active</span>
                                                    <div className="flex items-center gap-1.5">
                                                        <Activity className="w-4 h-4 text-[#1a5d1a]" />
                                                        <span className="text-base font-bold text-gray-900">{activeBookings}</span>
                                                    </div>
                                                </div>
                                                <div className="w-px h-8 bg-gray-100"></div>
                                                <div className="flex flex-col">
                                                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-0.5">Total</span>
                                                    <div className="flex items-center gap-1.5">
                                                        <Users className="w-4 h-4 text-gray-400" />
                                                        <span className="text-base font-bold text-gray-900">{totalBookings}</span>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Footer Info */}
                                            <div className="mt-auto flex items-center justify-between pt-4 border-t border-gray-50/50">
                                                <div className="flex items-center gap-2">
                                                    <div className="w-6 h-6 rounded-full bg-gradient-to-br from-gray-100 to-gray-200 border border-white shadow-sm flex items-center justify-center text-[10px] font-bold text-gray-500">
                                                        {lastBooked.charAt(0)}
                                                    </div>
                                                    <span className="text-xs font-medium text-gray-500">
                                                        Booked by <span className="text-gray-900 font-semibold">{lastBooked}</span>
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>

                        {/* Pagination Controls */}
                        <div className="mx-auto mt-8 flex items-center justify-center gap-3 pb-8">
                            <button
                                onClick={() => currentPage > 1 && setCurrentPage(currentPage - 1)}
                                disabled={currentPage === 1}
                                className="flex items-center justify-center rounded-full border border-gray-200 bg-white p-2 text-gray-600 transition hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <ChevronLeft className="h-5 w-5" />
                            </button>

                            <div className="flex gap-2">
                                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                                    <button
                                        key={page}
                                        onClick={() => setCurrentPage(page)}
                                        className={`rounded-full px-4 py-2 text-sm font-bold transition ${currentPage === page
                                            ? "bg-[#1a5d1a] text-white shadow-lg shadow-green-900/20"
                                            : "border border-gray-200 bg-white text-gray-600 hover:bg-gray-50"
                                            }`}
                                    >
                                        {page}
                                    </button>
                                ))}
                            </div>

                            <button
                                onClick={() => currentPage < totalPages && setCurrentPage(currentPage + 1)}
                                disabled={currentPage === totalPages}
                                className="flex items-center justify-center rounded-full border border-gray-200 bg-white p-2 text-gray-600 transition hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <ChevronRight className="h-5 w-5" />
                            </button>
                        </div>
                    </div>
                )}

                {/* CATEGORIES GRID */}
                {activeTab === "categories" && (
                    !selectedCategory ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                            {categories.map((cat) => (
                                <div
                                    key={cat.id}
                                    onClick={() => setSelectedCategory(cat.name)}
                                    className="group flex flex-col bg-white rounded-3xl p-4 border border-gray-100 shadow-[0_2px_15px_rgba(0,0,0,0.03)] hover:shadow-[0_20px_40px_rgba(0,0,0,0.08)] transition-all duration-300 hover:-translate-y-1 cursor-pointer"
                                >
                                    {/* Image Container */}
                                    <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl mb-5">
                                        <div className="absolute inset-0 bg-gray-100 animate-pulse" />
                                        <img
                                            src={cat.image}
                                            alt={cat.name}
                                            className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                                    </div>

                                    <div className="flex flex-col flex-1 px-2">
                                        <h3 className="text-xl font-black text-gray-900 mb-2 leading-tight">{cat.name}</h3>
                                        <p className="text-sm font-medium text-gray-500 mb-6 leading-relaxed line-clamp-3 flex-1">
                                            {cat.description}
                                        </p>

                                        <div className="flex items-center gap-2 text-[#1a5d1a] font-bold text-sm group-hover:gap-3 transition-all mt-auto py-2">
                                            View Services <ArrowRight className="w-4 h-4" />
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="space-y-6">
                            <div className="flex items-center gap-4 border-b border-gray-100 pb-6 mb-8">
                                <button
                                    onClick={() => setSelectedCategory(null)}
                                    className="group p-2.5 bg-white border border-gray-200 rounded-full hover:bg-gray-50 hover:border-gray-300 transition-all shadow-sm hover:shadow-md hover:-translate-x-0.5"
                                >
                                    <ChevronLeft className="w-5 h-5 text-gray-500 group-hover:text-gray-900 transition-colors" />
                                </button>

                                <div>
                                    <h2 className="text-2xl font-black text-gray-900 leading-tight">{selectedCategory}</h2>
                                    <span className="text-sm font-medium text-gray-500">
                                        {(selectedCategory === "Virtual Services" ? virtualServices :
                                            selectedCategory === "Rituals / Homam" ? homamServices :
                                                selectedCategory === "Chanting" ? chantingServices : []).length} Services Available
                                    </span>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
                                {(selectedCategory === "Virtual Services" ? virtualServices :
                                    selectedCategory === "Rituals / Homam" ? homamServices :
                                        selectedCategory === "Chanting" ? chantingServices : []).map((service: any, idx: number) => {
                                            // Normalize data
                                            let slug = service.slug || service.href?.split('/').pop() || service.title;
                                            let details: any = service;

                                            if (selectedCategory === "Rituals / Homam") {
                                                details = homams[slug as keyof typeof homams] || service;
                                            }

                                            // Stats Logic
                                            const globalIndex = idx;
                                            const activeBookings = (globalIndex * 7 + 3) % 12;
                                            const totalBookings = (globalIndex * 123 + 45) % 500;
                                            const isTrending = activeBookings > 8;
                                            const status = globalIndex % 10 === 0 ? "Draft" : "Active";
                                            const lastBooked = ["Rajesh K.", "Priya M.", "Amit B.", "Suresh R.", "Unknown"][globalIndex % 5];

                                            return (
                                                <div
                                                    key={slug}
                                                    onClick={() => { setSelectedService(details); setIsConfigModalOpen(true); }}
                                                    className="group relative bg-white rounded-3xl border border-gray-100/50 shadow-sm hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.1)] transition-all duration-300 flex flex-col overflow-visible cursor-pointer"
                                                >
                                                    {/* Floating Badge */}
                                                    <div className="absolute top-4 right-4 z-20 flex flex-col items-end gap-2">
                                                        {isTrending && (
                                                            <span className="flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-white text-orange-600 shadow-md transform group-hover:scale-110 transition-transform">
                                                                <TrendingUp className="w-3 h-3" /> Trending
                                                            </span>
                                                        )}
                                                    </div>

                                                    {/* Image Area */}
                                                    <div className="relative aspect-square w-full overflow-hidden rounded-t-3xl">
                                                        <div className="absolute inset-0 bg-gray-100 animate-pulse -z-10" />
                                                        <img
                                                            src={service.image}
                                                            alt={service.title}
                                                            className={`w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-110 ${status === 'Draft' ? 'grayscale opacity-70' : ''}`}
                                                        />
                                                        {/* Status Indicator (Bottom Left of Image) */}
                                                        <div className="absolute bottom-3 left-3">
                                                            <span className={`px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider backdrop-blur-md shadow-sm border ${status === 'Active'
                                                                ? 'bg-white/95 text-green-700 border-green-100/50'
                                                                : 'bg-white/95 text-gray-500 border-gray-200/50'
                                                                }`}>
                                                                <span className={`inline-block w-1.5 h-1.5 rounded-full mr-1.5 ${status === 'Active' ? 'bg-green-500 animate-pulse' : 'bg-gray-400'}`}></span>
                                                                {status}
                                                            </span>
                                                        </div>
                                                    </div>

                                                    {/* Content */}
                                                    <div className="p-5 pt-4 flex-1 flex flex-col">
                                                        <div className="flex justify-between items-start gap-4 mb-4">
                                                            <h3 className="text-lg font-bold text-gray-900 leading-tight group-hover:text-[#1a5d1a] transition-colors line-clamp-2">
                                                                {service.title}
                                                            </h3>
                                                            <button className="text-gray-300 hover:text-gray-900 transition-colors p-1 hover:bg-gray-50 rounded-full shrink-0">
                                                                <MoreVertical className="w-5 h-5" />
                                                            </button>
                                                        </div>

                                                        {/* Stats Row */}
                                                        <div className="flex items-center gap-6 mb-5 px-1">
                                                            <div className="flex flex-col">
                                                                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-0.5">Active</span>
                                                                <div className="flex items-center gap-1.5">
                                                                    <Activity className="w-4 h-4 text-[#1a5d1a]" />
                                                                    <span className="text-base font-bold text-gray-900">{activeBookings}</span>
                                                                </div>
                                                            </div>
                                                            <div className="w-px h-8 bg-gray-100"></div>
                                                            <div className="flex flex-col">
                                                                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-0.5">Total</span>
                                                                <div className="flex items-center gap-1.5">
                                                                    <Users className="w-4 h-4 text-gray-400" />
                                                                    <span className="text-base font-bold text-gray-900">{totalBookings}</span>
                                                                </div>
                                                            </div>
                                                        </div>

                                                        {/* Footer Info */}
                                                        <div className="mt-auto flex items-center justify-between pt-4 border-t border-gray-50/50">
                                                            <div className="flex items-center gap-2">
                                                                <div className="w-6 h-6 rounded-full bg-gradient-to-br from-gray-100 to-gray-200 border border-white shadow-sm flex items-center justify-center text-[10px] font-bold text-gray-500">
                                                                    {lastBooked.charAt(0)}
                                                                </div>
                                                                <span className="text-xs font-medium text-gray-500">
                                                                    Booked by <span className="text-gray-900 font-semibold">{lastBooked}</span>
                                                                </span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            );
                                        })}
                            </div>
                        </div>
                    )
                )}

                {/* PACKAGES GRID */}
                {activeTab === "packages" && (
                    <div className="space-y-6">
                        {/* Filters & Search Toolbar */}
                        <div className="relative z-50 bg-white/80 backdrop-blur-xl p-2 rounded-[2.5rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-white/40 flex flex-col sm:flex-row items-center gap-2">
                            {/* Search Input */}
                            <div className="relative flex-1 w-full group">
                                <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
                                    <Search className="h-5 w-5 text-gray-400 group-focus-within:text-[#5cb85c] transition-colors" />
                                </div>
                                <input
                                    type="text"
                                    className="block w-full pl-12 pr-4 py-4 bg-transparent text-gray-900 placeholder-gray-400 font-medium focus:outline-none text-base"
                                    placeholder="Search services or packages..."
                                />
                            </div>

                            {/* Actions Divider */}
                            <div className="hidden sm:block w-px h-8 bg-gray-200 mx-2"></div>

                            {/* Action Buttons */}
                            <div className="flex items-center gap-2 w-full sm:w-auto pr-2">
                                <div className="relative">
                                    <button
                                        onClick={() => setIsFilterOpen(!isFilterOpen)}
                                        className="flex items-center gap-2 px-5 py-3.5 bg-gray-100/50 hover:bg-gray-100 text-gray-700 text-sm font-bold rounded-[2rem] transition-all hover:scale-105 active:scale-95"
                                    >
                                        <Filter className="w-4 h-4" />
                                        <span className="hidden sm:inline">Filters</span>
                                    </button>

                                    {isFilterOpen && (
                                        <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-2xl shadow-xl border border-gray-100 p-2 z-[60] animate-in fade-in zoom-in-95 duration-200">
                                            {filterOptions.map((option) => (
                                                <button
                                                    key={option.id}
                                                    onClick={() => {
                                                        setSelectedFilter(option.id);
                                                        setIsFilterOpen(false);
                                                    }}
                                                    className={`w-full text-left px-4 py-3 rounded-xl text-sm font-medium transition-colors ${selectedFilter === option.id
                                                        ? "bg-[#1a5d1a]/10 text-[#1a5d1a]"
                                                        : "text-gray-600 hover:bg-gray-50"
                                                        }`}
                                                >
                                                    {option.label}
                                                </button>
                                            ))}
                                        </div>
                                    )}
                                </div>
                                <button
                                    onClick={() => {
                                        setSelectedService(null);
                                        setIsConfigModalOpen(true);
                                    }}
                                    className="flex items-center gap-2 px-5 py-3.5 bg-[#1a5d1a] text-white text-sm font-bold rounded-[2rem] transition-all hover:scale-105 active:scale-95 shadow-lg shadow-green-900/10 hover:bg-[#144414]"
                                >
                                    <Plus className="w-4 h-4" />
                                    <span className="hidden sm:inline">Add Special Package</span>
                                </button>
                            </div>
                        </div>

                        {/* Packages List */}
                        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
                            {currentPackages.map(([slug, service]) => (
                                <div key={slug} className="group bg-white rounded-3xl p-6 md:p-8 border border-gray-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-xl transition-all duration-300">
                                    {/* Service Header */}
                                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8 border-b border-gray-100 pb-6">
                                        <div className="flex items-center gap-5">
                                            <div className="relative w-16 h-16 rounded-2xl overflow-hidden shadow-md">
                                                <Image
                                                    src={service.image || "/services/homam.png"}
                                                    alt={service.title}
                                                    fill
                                                    className="object-cover"
                                                />
                                            </div>
                                            <div>
                                                <h3 className="text-xl md:text-2xl font-black text-gray-900 leading-tight group-hover:text-[#1a5d1a] transition-colors">
                                                    {service.title}
                                                </h3>
                                                <div className="flex items-center gap-2 mt-1">
                                                    <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Service ID: {slug.toUpperCase().slice(0, 8)}</span>
                                                    <span className="w-1 h-1 rounded-full bg-gray-300"></span>
                                                    <span className="flex items-center gap-1 text-xs font-bold text-[#1a5d1a] bg-[#1a5d1a]/5 px-2 py-0.5 rounded-full">
                                                        <Activity className="w-3 h-3" /> Active
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            {/* Addons / Flowers Badge */}
                                            <div className="flex items-center gap-2 px-4 py-2 bg-pink-50 text-pink-700 rounded-xl text-xs font-bold border border-pink-100">
                                                <Sparkles className="w-3.5 h-3.5" />
                                                Addons: Flowers Configured
                                            </div>
                                            <button
                                                onClick={() => {
                                                    setSelectedService({ ...service, slug });
                                                    setIsConfigModalOpen(true);
                                                }}
                                                className="text-sm font-bold text-gray-500 hover:text-[#1a5d1a] px-4 py-2 hover:bg-gray-50 rounded-xl transition-all"
                                            >
                                                Edit Configuration
                                            </button>
                                        </div>
                                    </div>

                                    {/* Packages Cards */}
                                    {(service as any).packages && (service as any).packages.length > 0 ? (
                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                            {(service as any).packages.map((pkg: any, idx: number) => (
                                                <div key={idx} className={`relative p-5 rounded-2xl border transition-all duration-300 ${pkg.name === 'Standard'
                                                    ? 'bg-[#1a5d1a]/[0.02] border-[#1a5d1a]/20 outline outline-2 outline-[#1a5d1a]/10 z-10 scale-[1.02] shadow-lg'
                                                    : 'bg-gray-50/50 border-gray-200 hover:border-gray-300 hover:bg-white'
                                                    }`}>
                                                    {pkg.name === 'Standard' && (
                                                        <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 bg-[#1a5d1a] text-white text-[9px] font-bold uppercase tracking-wider rounded-full shadow-sm">
                                                            Recommended
                                                        </div>
                                                    )}

                                                    <div className="flex justify-between items-start mb-3">
                                                        <h4 className="font-black text-lg text-gray-800">{pkg.name}</h4>
                                                        <Package className={`w-5 h-5 ${pkg.name === 'Premium' ? 'text-amber-500' : 'text-gray-300'}`} />
                                                    </div>

                                                    <div className="text-2xl font-black text-[#5cb85c] mb-4">
                                                        {pkg.price}
                                                    </div>

                                                    <div className="space-y-2 mb-4">
                                                        <div className="flex items-start gap-2 text-xs text-gray-600 font-medium">
                                                            <Users className="w-3.5 h-3.5 mt-0.5 text-gray-400 shrink-0" />
                                                            {pkg.priests}
                                                        </div>
                                                        <p className="text-xs text-gray-500 leading-relaxed line-clamp-3">
                                                            {pkg.description}
                                                        </p>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="py-12 bg-gray-50 rounded-2xl border border-dashed border-gray-200 text-center flex flex-col items-center justify-center">
                                            <div className="p-3 bg-gray-100 rounded-full mb-3">
                                                <Layers className="w-6 h-6 text-gray-400" />
                                            </div>
                                            <p className="text-gray-500 font-medium mb-2">No packages configured yet</p>
                                            <button
                                                onClick={() => {
                                                    setSelectedService({ ...service, slug });
                                                    setIsConfigModalOpen(true);
                                                }}
                                                className="text-sm text-[#1a5d1a] font-bold bg-white border border-gray-200 px-4 py-2 rounded-lg hover:border-[#1a5d1a] transition-colors"
                                            >
                                                Create Packages
                                            </button>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>

                        {/* Package Pagination */}
                        <div className="mx-auto mt-8 flex items-center justify-center gap-3 pb-8">
                            <button
                                onClick={() => currentPackagePage > 1 && setCurrentPackagePage(currentPackagePage - 1)}
                                disabled={currentPackagePage === 1}
                                className="flex items-center justify-center rounded-full border border-gray-200 bg-white p-2 text-gray-600 transition hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <ChevronLeft className="h-5 w-5" />
                            </button>

                            <div className="flex gap-2">
                                {Array.from({ length: Math.ceil(Object.keys(homams).length / 10) }, (_, i) => i + 1).map((page) => (
                                    <button
                                        key={page}
                                        onClick={() => setCurrentPackagePage(page)}
                                        className={`w-8 h-8 flex items-center justify-center rounded-full text-sm font-bold transition ${currentPackagePage === page
                                            ? "bg-[#1a5d1a] text-white shadow-lg shadow-green-900/20"
                                            : "border border-gray-200 bg-white text-gray-600 hover:bg-gray-50"
                                            }`}
                                    >
                                        {page}
                                    </button>
                                ))}
                            </div>

                            <button
                                onClick={() => currentPackagePage < Math.ceil(Object.keys(homams).length / 10) && setCurrentPackagePage(currentPackagePage + 1)}
                                disabled={currentPackagePage === Math.ceil(Object.keys(homams).length / 10)}
                                className="flex items-center justify-center rounded-full border border-gray-200 bg-white p-2 text-gray-600 transition hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <ChevronRight className="h-5 w-5" />
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {/* Configuration Modal */}
            {isConfigModalOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200 m-4">
                        <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                            <div>
                                <h3 className="text-xl font-black text-gray-900">Package Configuration</h3>
                                <p className="text-sm text-gray-500">
                                    {selectedService ? (
                                        <>Manage packages for <span className="font-bold text-[#1a5d1a]">{selectedService.title}</span></>
                                    ) : (
                                        "Select a service to configure"
                                    )}
                                </p>
                            </div>
                            <button
                                onClick={() => setIsConfigModalOpen(false)}
                                className="p-2 hover:bg-gray-200 rounded-full transition-colors"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        {!selectedService ? (
                            <div className="p-8 max-h-[70vh] overflow-y-auto">
                                <div className="grid gap-3">
                                    {homamServices.map((s) => {
                                        const slug = s.href.split('/').pop() || '';
                                        return (
                                            <button
                                                key={slug}
                                                onClick={() => setSelectedService((homams as any)[slug])}
                                                className="w-full text-left p-4 rounded-xl border border-gray-100 hover:border-[#1a5d1a] hover:bg-gray-50 transition-all flex justify-between items-center group"
                                            >
                                                <span className="font-bold text-gray-700 group-hover:text-[#1a5d1a]">{s.title}</span>
                                                <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-[#1a5d1a]" />
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>
                        ) : (
                            <>
                                <div className="p-8 max-h-[70vh] overflow-y-auto">
                                    <div className="grid gap-6">
                                        <div className="space-y-4 p-4 border rounded-xl bg-gray-50/30">
                                            <h4 className="font-bold text-gray-700 flex items-center gap-2">
                                                <Package className="w-4 h-4" /> Global Settings
                                            </h4>
                                            <div className="grid grid-cols-2 gap-4">
                                                <div>
                                                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1 block">Flower Addon</label>
                                                    <select className="w-full p-2 rounded-lg border border-gray-200 bg-white text-sm font-medium focus:outline-none focus:border-[#1a5d1a]">
                                                        <option>Enabled (₹500 - ₹2000)</option>
                                                        <option>Disabled</option>
                                                    </select>
                                                </div>
                                                <div>
                                                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1 block">Status</label>
                                                    <select className="w-full p-2 rounded-lg border border-gray-200 bg-white text-sm font-medium focus:outline-none focus:border-[#1a5d1a]">
                                                        <option>Active</option>
                                                        <option>Draft</option>
                                                        <option>Archived</option>
                                                    </select>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="space-y-4">
                                            <div className="flex justify-between items-center">
                                                <h4 className="font-bold text-gray-900">Package Tiers</h4>
                                                <button
                                                    onClick={() => {
                                                        const newTier = `Special ${packageTiers.filter(t => t.startsWith('Special')).length + 1}`;
                                                        setPackageTiers([...packageTiers, newTier]);
                                                    }}
                                                    className="text-xs font-bold text-[#1a5d1a] hover:underline"
                                                >
                                                    + Add Special Package
                                                </button>
                                            </div>

                                            {packageTiers.map((tier) => (
                                                <div key={tier} className="p-4 border border-gray-100 rounded-xl hover:border-gray-300 transition-colors group">
                                                    <div className="flex justify-between mb-3">
                                                        <span className="font-bold text-gray-800">{tier}</span>
                                                        <span className="text-xs font-bold text-gray-400 bg-gray-100 px-2 py-1 rounded-full uppercase">Configured</span>
                                                    </div>
                                                    <div className="grid grid-cols-2 gap-4">
                                                        <input type="text" placeholder="Price (e.g. ₹15,000)" className="w-full p-2 bg-gray-50 rounded-lg text-sm" defaultValue={selectedService.packages?.find((p: any) => p.name === tier)?.price} />
                                                        <input type="text" placeholder="Priests (e.g. 2 Vadhyar)" className="w-full p-2 bg-gray-50 rounded-lg text-sm" defaultValue={selectedService.packages?.find((p: any) => p.name === tier)?.priests} />
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                <div className="p-6 border-t border-gray-100 bg-gray-50/50 flex justify-end gap-3">
                                    <button
                                        onClick={() => setIsConfigModalOpen(false)}
                                        className="px-6 py-2.5 rounded-xl font-bold text-gray-600 hover:bg-gray-200 transition-colors"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        onClick={() => {
                                            setIsConfigModalOpen(false);
                                            alert('Configuration saved! (Note: This is a demo backend)');
                                        }}
                                        className="px-6 py-2.5 rounded-xl font-bold text-white bg-[#1a5d1a] shadow-lg shadow-green-900/20 hover:bg-[#144414] transition-all transform active:scale-95"
                                    >
                                        Save Changes
                                    </button>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}