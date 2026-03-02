"use client";

import { useState, useEffect, useMemo } from "react";
import {
    Calendar,
    CheckCircle,
    Clock,
    XCircle,
    MoreHorizontal,
    Search,
    Filter,
    MapPin,
    User,
    ArrowUpRight,
    CalendarDays,
    Banknote,
    Sparkles,
    X,
    ChevronDown,
    Check,
    Eye,
    Ban,
    Users,
    Loader2,
    Plus,
    Percent,
    Pencil,
    AlertTriangle,
    RefreshCw,
} from "lucide-react";
import { homamServices } from "@/data/homams";
import { virtualServices } from "@/lib/data/virtual-services";
import { AdminBookingsService, Booking, CreateBookingParams } from "@/lib/services/admin-bookings.service";
import { AdminPriestsService, AdminPriest } from "@/lib/services/priests.service";
import { ServicesService, Service } from "@/lib/services/services.service";

/* =======================
   Status & Sort Options
======================= */
const statusOptions = ["All", "pending", "completed", "cancelled"];
const sortOptions = ["Newest", "Oldest", "Amount: High to Low", "Amount: Low to High"];

/* =======================
   Helpers
======================= */
const statusLabel = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

const statusBadgeClass = (status: string) => {
    switch (status) {
        case "completed":
            return "bg-blue-50 text-blue-700 border-blue-100";
        case "pending":
            return "bg-yellow-50 text-yellow-700 border-yellow-100";
        case "cancelled":
            return "bg-red-50 text-red-700 border-red-100";
        default:
            return "bg-gray-50 text-gray-600 border-gray-100";
    }
};

const avatarColors = [
    "bg-blue-100 text-blue-600",
    "bg-pink-100 text-pink-600",
    "bg-purple-100 text-purple-600",
    "bg-orange-100 text-orange-600",
    "bg-green-100 text-green-600",
    "bg-teal-100 text-teal-600",
    "bg-indigo-100 text-indigo-600",
    "bg-rose-100 text-rose-600",
];

const getAvatarColor = (name: string) => {
    let hash = 0;
    for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash);
    return avatarColors[Math.abs(hash) % avatarColors.length];
};

const formatCurrency = (amount: number | null | undefined) => {
    if (amount == null) return "—";
    return `₹${amount.toLocaleString("en-IN")}`;
};

/* =======================
   Component
======================= */
export default function BookingsPage() {
    // Data State
    const [bookingsList, setBookingsList] = useState<Booking[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Filter State
    const [searchQuery, setSearchQuery] = useState("");
    const [statusFilter, setStatusFilter] = useState("All");
    const [serviceFilter, setServiceFilter] = useState("All");
    const [sort, setSort] = useState("Newest");
    const [dateFilter, setDateFilter] = useState("");

    // Modal States
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [isViewModalOpen, setIsViewModalOpen] = useState(false);
    const [isAssignPriestsModalOpen, setIsAssignPriestsModalOpen] = useState(false);
    const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);

    // Filter/Dropdown UI States
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [isSortOpen, setIsSortOpen] = useState(false);
    const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);
    const [openDropdownId, setOpenDropdownId] = useState<string | null>(null);
    const [isServiceDropdownOpen, setIsServiceDropdownOpen] = useState(false);
    const [openPriestDropdownIndex, setOpenPriestDropdownIndex] = useState<number | null>(null);

    // Toaster State
    const [toast, setToast] = useState({ message: "", visible: false, type: "success" as "success" | "error" });

    // Create Form State
    const [newBooking, setNewBooking] = useState({
        customer_name: "",
        service_id: "",
        service_name: "",
        booking_date: "",
        booking_time: "",
        location: "",
        total_amount: "",
    });
    const [createLoading, setCreateLoading] = useState(false);

    // Services catalog for create booking
    const [serviceOptions, setServiceOptions] = useState<Service[]>([]);

    // Assign Priests State
    const [availablePriests, setAvailablePriests] = useState<AdminPriest[]>([]);
    const [priestAssignments, setPriestAssignments] = useState<{ priest_id: string; commission_percent: string }[]>([
        { priest_id: "", commission_percent: "" },
    ]);
    const [assignLoading, setAssignLoading] = useState(false);

    // Cancel Confirmation State
    const [cancelConfirmBooking, setCancelConfirmBooking] = useState<Booking | null>(null);
    const [cancelLoading, setCancelLoading] = useState(false);

    // Edit Commission State
    const [editCommissionData, setEditCommissionData] = useState<{ booking: Booking; priestIdx: number; newPercent: string } | null>(null);
    const [editCommissionLoading, setEditCommissionLoading] = useState(false);

    /* =======================
       Toaster
    ======================= */
    const showToaster = (message: string, type: "success" | "error" = "success") => {
        setToast({ message, visible: true, type });
        setTimeout(() => setToast({ message: "", visible: false, type: "success" }), 3000);
    };

    /* =======================
       Fetch Bookings
    ======================= */
    const fetchBookings = async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await AdminBookingsService.list();
            setBookingsList(Array.isArray(data) ? data : []);
        } catch (err: any) {
            console.error("Failed to fetch bookings:", err);
            setError("Failed to load bookings. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const fetchServices = async () => {
        try {
            const data = await ServicesService.list();
            setServiceOptions(Array.isArray(data) ? data : []);
        } catch (err) {
            console.error("Failed to fetch services:", err);
            setServiceOptions([]);
        }
    };

    useEffect(() => {
        fetchBookings();
        fetchServices();
    }, []);

    /* =======================
       Fetch Priests (for assign modal)
    ======================= */
    const fetchPriests = async () => {
        try {
            const res = await AdminPriestsService.list({ limit: 100 });
            setAvailablePriests(res.priests || []);
        } catch (err) {
            console.error("Failed to fetch priests:", err);
        }
    };

    /* =======================
       Create Booking
    ======================= */
    const handleCreateBooking = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!newBooking.customer_name || (!newBooking.service_id && !newBooking.service_name) || !newBooking.booking_date || !newBooking.booking_time || !newBooking.total_amount) {
            showToaster("Please fill in all required fields.", "error");
            return;
        }

        setCreateLoading(true);
        try {
            const normalizedServiceName = (newBooking.service_name || "").replace(/\s*\(Virtual\)\s*$/i, "").trim();

            const commonParams = {
                customer_name: newBooking.customer_name,
                booking_date: newBooking.booking_date,
                booking_time: newBooking.booking_time,
                location: newBooking.location,
                total_amount: parseFloat(newBooking.total_amount.replace(/[^0-9.]/g, "")),
                created_type: "manual" as const,
            };

            const params: CreateBookingParams = newBooking.service_id
                ? {
                      ...commonParams,
                      service_id: newBooking.service_id,
                      ...(normalizedServiceName ? { service_name: normalizedServiceName } : {}),
                  }
                : {
                      ...commonParams,
                      service_name: normalizedServiceName,
                  };

            const created = await AdminBookingsService.create(params);
            setBookingsList((prev) => [...prev, created]);
            setIsCreateModalOpen(false);
            setNewBooking({ customer_name: "", service_id: "", service_name: "", booking_date: "", booking_time: "", location: "", total_amount: "" });
            showToaster("Booking created successfully");
        } catch (err: any) {
            console.error("Failed to create booking:", err);
            showToaster("Failed to create booking. Please try again.", "error");
        } finally {
            setCreateLoading(false);
        }
    };

    /* =======================
       Assign Priests
    ======================= */
    const openAssignPriestsModal = (booking: Booking) => {
        setSelectedBooking(booking);
        setPriestAssignments([{ priest_id: "", commission_percent: "" }]);
        setIsAssignPriestsModalOpen(true);
        fetchPriests();
    };

    const addPriestRow = () => {
        setPriestAssignments((prev) => [...prev, { priest_id: "", commission_percent: "" }]);
    };

    const removePriestRow = (index: number) => {
        setPriestAssignments((prev) => prev.filter((_, i) => i !== index));
    };

    const updatePriestRow = (index: number, field: "priest_id" | "commission_percent", value: string) => {
        setPriestAssignments((prev) => prev.map((row, i) => (i === index ? { ...row, [field]: value } : row)));
    };

    const handleAssignPriests = async () => {
        if (!selectedBooking) return;

        const valid = priestAssignments.every((p) => p.priest_id && p.commission_percent && parseFloat(p.commission_percent) > 0);
        if (!valid) {
            showToaster("Please fill in all priest fields with valid commission.", "error");
            return;
        }

        setAssignLoading(true);
        try {
            const assignPayload = priestAssignments.map((p) => ({
                priest_id: p.priest_id,
                commission_percent: parseFloat(p.commission_percent),
            }));

            const updated = await AdminBookingsService.assignPriests(selectedBooking.id, {
                priests: assignPayload,
            });

            // Build local priests array as a fallback in case the response priests are empty
            const localPriests = assignPayload.map((p) => {
                const priestInfo = availablePriests.find((ap) => ap.id === p.priest_id);
                const commissionAmount = (selectedBooking.total_amount * p.commission_percent) / 100;
                return {
                    id: p.priest_id,
                    priest_id: p.priest_id,
                    name: priestInfo
                        ? priestInfo.name || `${priestInfo.first_name || ""} ${priestInfo.last_name || ""}`.trim()
                        : "Unknown Priest",
                    commission_percent: p.commission_percent,
                    commission_amount: commissionAmount,
                };
            });

            const totalCommission = localPriests.reduce((sum, p) => sum + p.commission_amount, 0);

            // Use backend response priests (always returned); fall back to local if somehow empty
            const priests =
                updated.priests && updated.priests.length > 0 ? updated.priests : localPriests;

            // After assigning priests, mark booking as completed
            let finalBooking = {
                ...updated,
                priests,
                admin_net_amount: updated.admin_net_amount ?? (selectedBooking.total_amount - totalCommission),
                status: "completed" as const,
            };

            try {
                const completed = await AdminBookingsService.markCompleted(selectedBooking.id);
                finalBooking = {
                    ...finalBooking,
                    ...completed,
                    priests: completed.priests && completed.priests.length > 0 ? completed.priests : priests,
                    admin_net_amount: completed.admin_net_amount ?? finalBooking.admin_net_amount,
                    status: "completed" as const,
                };
            } catch (err) {
                console.warn("markCompleted call failed, setting status locally:", err);
            }

            setBookingsList((prev) => prev.map((b) => (b.id === finalBooking.id ? finalBooking : b)));
            setIsAssignPriestsModalOpen(false);
            showToaster("Priests assigned and booking marked as completed");
        } catch (err: any) {
            console.error("Failed to assign priests:", err);
            showToaster("Failed to assign priests. Please try again.", "error");
        } finally {
            setAssignLoading(false);
        }
    };

    /* =======================
       Cancel Booking
    ======================= */
    const handleCancelBooking = (booking: Booking) => {
        setCancelConfirmBooking(booking);
        setOpenDropdownId(null);
    };

    const confirmCancelBooking = async () => {
        if (!cancelConfirmBooking) return;
        setCancelLoading(true);
        try {
            const updated = await AdminBookingsService.cancel(cancelConfirmBooking.id);
            // Replace the booking in list with the full updated response (includes refund_id, refund_status)
            setBookingsList((prev) => prev.map((b) => (b.id === updated.id ? updated : b)));
            // If view modal is open for this booking, sync it with updated refund info
            if (selectedBooking?.id === updated.id) {
                setSelectedBooking(updated);
            }
            const message =
                updated.created_type === "razorpay"
                    ? "Booking cancelled. Refund initiated for the customer."
                    : "Booking cancelled successfully.";
            showToaster(message);
        } catch (err: any) {
            console.error("Cancel booking failed:", err);
            showToaster("Failed to cancel booking. Please try again.", "error");
        } finally {
            setCancelLoading(false);
            setCancelConfirmBooking(null);
        }
    };

    /* =======================
       Edit Commission
    ======================= */
    const handleEditCommission = async () => {
        if (!editCommissionData) return;
        const { booking, priestIdx, newPercent } = editCommissionData;
        const percent = parseFloat(newPercent);
        if (!percent || percent <= 0 || percent > 100) {
            showToaster("Enter a valid commission percentage (1–100).", "error");
            return;
        }
        setEditCommissionLoading(true);
        try {
            const priest = booking.priests[priestIdx];
            // Recalculate amounts locally
            const updatedPriests = booking.priests.map((p, i) =>
                i === priestIdx
                    ? { ...p, commission_percent: percent, commission_amount: (booking.total_amount * percent) / 100 }
                    : p
            );
            const totalCommission = updatedPriests.reduce((sum, p) => sum + p.commission_amount, 0);
            const updatedBooking: Booking = {
                ...booking,
                priests: updatedPriests,
                admin_net_amount: booking.total_amount - totalCommission,
            };

            // Try calling backend update endpoint
            try {
                await AdminBookingsService.assignPriests(booking.id, {
                    priests: updatedPriests.map((p) => ({ priest_id: p.priest_id, commission_percent: p.commission_percent })),
                });
            } catch (err) {
                console.warn("Commission update API failed, updating locally:", err);
            }

            setBookingsList((prev) => prev.map((b) => (b.id === updatedBooking.id ? updatedBooking : b)));
            setSelectedBooking(updatedBooking);
            setEditCommissionData(null);
            showToaster("Commission updated successfully");
        } catch (err: any) {
            showToaster("Failed to update commission.", "error");
        } finally {
            setEditCommissionLoading(false);
        }
    };

    /* =======================
       Close dropdowns on outside click
    ======================= */
    useEffect(() => {
        const handleClickOutside = () => setOpenDropdownId(null);
        if (openDropdownId) {
            document.addEventListener("click", handleClickOutside);
        }
        return () => document.removeEventListener("click", handleClickOutside);
    }, [openDropdownId]);

    /* =======================
       Computed Stats (Dynamic)
    ======================= */
    const stats = useMemo(() => {
        const total = bookingsList.length;
        const pending = bookingsList.filter((b) => b.status === "pending").length;
        const completed = bookingsList.filter((b) => b.status === "completed").length;
        const cancelled = bookingsList.filter((b) => b.status === "cancelled").length;

        return [
            { label: "Total Bookings", value: total.toLocaleString(), icon: Calendar, color: "bg-blue-500", lightColor: "bg-blue-50 text-blue-600" },
            { label: "Pending", value: pending.toString(), icon: Clock, color: "bg-yellow-500", lightColor: "bg-yellow-50 text-yellow-600" },
            { label: "Completed", value: completed.toString(), icon: CheckCircle, color: "bg-green-500", lightColor: "bg-green-50 text-green-600" },
            { label: "Cancelled", value: cancelled.toString(), icon: XCircle, color: "bg-red-500", lightColor: "bg-red-50 text-red-600" },
        ];
    }, [bookingsList]);

    /* =======================
       Unique Services for Filter
    ======================= */
    const uniqueServices = useMemo(() => Array.from(new Set(bookingsList.map((b) => b.service_name).filter(Boolean))), [bookingsList]);

    /* =======================
       Filtered & Sorted Bookings
    ======================= */
    const filteredBookings = useMemo(() => {
        return bookingsList
            .filter((b) => {
                const statusMatch = statusFilter === "All" || b.status === statusFilter;
                const serviceMatch = serviceFilter === "All" || b.service_name === serviceFilter;

                const searchLower = searchQuery.toLowerCase();
                const searchMatch =
                    !searchQuery ||
                    b.id.toLowerCase().includes(searchLower) ||
                    b.customer_name?.toLowerCase().includes(searchLower) ||
                    b.service_name?.toLowerCase().includes(searchLower);

                const bookingDate = b.booking_date ? new Date(b.booking_date) : null;
                const filterDateObj = dateFilter ? new Date(dateFilter) : null;
                const dateMatch =
                    !filterDateObj ||
                    !bookingDate ||
                    (bookingDate.getDate() === filterDateObj.getDate() &&
                        bookingDate.getMonth() === filterDateObj.getMonth() &&
                        bookingDate.getFullYear() === filterDateObj.getFullYear());

                return statusMatch && serviceMatch && searchMatch && dateMatch;
            })
            .sort((a, b) => {
                if (sort === "Newest") return new Date(b.created_at || b.booking_date).getTime() - new Date(a.created_at || a.booking_date).getTime();
                if (sort === "Oldest") return new Date(a.created_at || a.booking_date).getTime() - new Date(b.created_at || b.booking_date).getTime();
                if (sort === "Amount: High to Low") return (b.total_amount || 0) - (a.total_amount || 0);
                if (sort === "Amount: Low to High") return (a.total_amount || 0) - (b.total_amount || 0);
                return 0;
            });
    }, [bookingsList, statusFilter, serviceFilter, searchQuery, dateFilter, sort]);

    /* =======================
       Commission summary helper
    ======================= */
    const getTotalCommission = (booking: Booking) => {
        if (!booking.priests || booking.priests.length === 0) return 0;
        return booking.priests.reduce((sum, p) => sum + (p.commission_amount || 0), 0);
    };

    /* =======================
       Render
    ======================= */
    return (
        <div className="space-y-8 font-sans relative min-h-screen pb-20">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div>
                    <h1 className="text-4xl font-black text-gray-900 tracking-tight">Bookings</h1>
                    <p className="text-gray-500 font-medium mt-2 text-lg">Track and manage service appointments.</p>
                </div>
                <button
                    onClick={() => setIsCreateModalOpen(true)}
                    className="group relative bg-[#1a5d1a] text-white px-8 py-4 rounded-full font-bold shadow-xl shadow-green-900/20 hover:shadow-2xl hover:shadow-green-900/30 hover:-translate-y-1 transition-all overflow-hidden"
                >
                    <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
                    <span className="relative flex items-center gap-2">
                        <Sparkles className="w-5 h-5 fill-current" /> Create New Booking
                    </span>
                </button>
            </div>

            {/* Stats Overview */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat, i) => (
                    <div key={i} className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-[0_4px_20px_rgba(0,0,0,0.02)] hover:shadow-[0_10px_30px_rgba(0,0,0,0.05)] transition-all duration-300 group">
                        <div className="flex items-start justify-between mb-4">
                            <div className={`p-3 rounded-2xl ${stat.lightColor} group-hover:scale-110 transition-transform duration-300`}>
                                <stat.icon className="w-6 h-6 stroke-[2.5]" />
                            </div>
                            <button className="p-2 text-gray-300 hover:text-gray-600 hover:bg-gray-50 rounded-full transition-colors">
                                <ArrowUpRight className="w-4 h-4" />
                            </button>
                        </div>
                        <div>
                            <p className="text-4xl font-black text-gray-900 mb-1">{stat.value}</p>
                            <p className="text-sm font-bold text-gray-400 uppercase tracking-wider">{stat.label}</p>
                        </div>
                    </div>
                ))}
            </div>

            {/* Filters & Search Toolbar */}
            <div className="relative z-30 bg-white/60 backdrop-blur-xl p-2 rounded-[2.5rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-white/60 flex flex-col md:flex-row items-center gap-2">
                <div className="relative flex-1 w-full">
                    <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search by Booking ID, Customer, or Service..."
                        className="w-full pl-14 pr-6 py-4 bg-transparent text-gray-800 placeholder-gray-400 font-bold focus:outline-none"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
                <div className="hidden md:block w-px h-8 bg-gray-200 mx-2"></div>
                <div className="flex items-center gap-2 w-full md:w-auto p-2">
                    {/* Filter Dropdown */}
                    <div className="relative">
                        <button
                            onClick={() => { setIsFilterOpen(!isFilterOpen); setIsSortOpen(false); }}
                            className="flex items-center gap-2 px-6 py-3 bg-gray-100 text-gray-700 rounded-full font-bold text-sm hover:bg-gray-200 transition-colors"
                        >
                            <Filter className="w-4 h-4" /> Filters <ChevronDown className={`w-3 h-3 transition-transform ${isFilterOpen ? "rotate-180" : ""}`} />
                        </button>

                        {isFilterOpen && (
                            <>
                                <div className="fixed inset-0 z-10" onClick={() => setIsFilterOpen(false)} />
                                <div className="absolute right-0 top-full mt-2 w-64 bg-white rounded-2xl shadow-xl border border-gray-100 p-4 z-20 animate-in fade-in zoom-in-95 duration-200 overflow-y-auto max-h-[80vh]">
                                    {/* Header with close button */}
                                    <div className="flex items-center justify-between mb-3">
                                        <span className="text-xs font-black text-gray-700 uppercase tracking-wider">Filters</span>
                                        <button
                                            onClick={() => setIsFilterOpen(false)}
                                            className="p-1 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-700 transition-colors"
                                        >
                                            <X className="w-3.5 h-3.5" />
                                        </button>
                                    </div>
                                    {/* Status Filter */}
                                    <div className="mb-4">
                                        <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">Status</h4>
                                        <div className="space-y-1">
                                            {statusOptions.map((option) => (
                                                <button
                                                    key={option}
                                                    onClick={() => setStatusFilter(option)}
                                                    className={`w-full text-left px-3 py-2 rounded-lg text-xs font-bold transition-colors flex justify-between items-center ${statusFilter === option ? "bg-[#1a5d1a]/10 text-[#1a5d1a]" : "text-gray-600 hover:bg-gray-50"}`}
                                                >
                                                    {option === "All" ? "All" : statusLabel(option)}
                                                    {statusFilter === option && <Check className="w-3 h-3" />}
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="h-px bg-gray-100 mb-4"></div>

                                    {/* Service Filter */}
                                    <div>
                                        <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">Service Type</h4>
                                        <div className="space-y-1">
                                            <button
                                                onClick={() => setServiceFilter("All")}
                                                className={`w-full text-left px-3 py-2 rounded-lg text-xs font-bold transition-colors flex justify-between items-center ${serviceFilter === "All" ? "bg-[#1a5d1a]/10 text-[#1a5d1a]" : "text-gray-600 hover:bg-gray-50"}`}
                                            >
                                                All Services
                                                {serviceFilter === "All" && <Check className="w-3 h-3" />}
                                            </button>
                                            {uniqueServices.map((service) => (
                                                <button
                                                    key={service}
                                                    onClick={() => setServiceFilter(service)}
                                                    className={`w-full text-left px-3 py-2 rounded-lg text-xs font-bold transition-colors flex justify-between items-center ${serviceFilter === service ? "bg-[#1a5d1a]/10 text-[#1a5d1a]" : "text-gray-600 hover:bg-gray-50"}`}
                                                >
                                                    {service}
                                                    {serviceFilter === service && <Check className="w-3 h-3" />}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </>
                        )}
                    </div>

                    {/* Sort Dropdown */}
                    <div className="relative">
                        <button
                            onClick={() => { setIsSortOpen(!isSortOpen); setIsFilterOpen(false); }}
                            className="flex items-center gap-2 px-6 py-3 bg-gray-100 text-gray-700 rounded-full font-bold text-sm hover:bg-gray-200 transition-colors"
                        >
                            Sort: {sort} <ChevronDown className={`w-3 h-3 transition-transform ${isSortOpen ? "rotate-180" : ""}`} />
                        </button>

                        {isSortOpen && (
                            <>
                                <div className="fixed inset-0 z-10" onClick={() => setIsSortOpen(false)} />
                                <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-2xl shadow-xl border border-gray-100 p-2 z-20 animate-in fade-in zoom-in-95 duration-200">
                                    {/* Header with close button */}
                                    <div className="flex items-center justify-between px-2 pt-1 pb-2">
                                        <span className="text-xs font-black text-gray-700 uppercase tracking-wider">Sort By</span>
                                        <button
                                            onClick={() => setIsSortOpen(false)}
                                            className="p-1 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-700 transition-colors"
                                        >
                                            <X className="w-3.5 h-3.5" />
                                        </button>
                                    </div>
                                    {sortOptions.map((option) => (
                                        <button
                                            key={option}
                                            onClick={() => { setSort(option); setIsSortOpen(false); }}
                                            className={`w-full text-left px-4 py-2.5 rounded-xl text-xs font-bold transition-colors flex justify-between items-center ${sort === option ? "bg-[#1a5d1a]/10 text-[#1a5d1a]" : "text-gray-600 hover:bg-gray-50"}`}
                                        >
                                            {option}
                                            {sort === option && <Check className="w-3 h-3" />}
                                        </button>
                                    ))}
                                </div>
                            </>
                        )}
                    </div>

                    {/* Date Picker */}
                    <div className="relative">
                        <button
                            onClick={() => setIsDatePickerOpen(!isDatePickerOpen)}
                            className={`p-3 rounded-full transition-colors shadow-lg shadow-green-900/20 ${dateFilter ? "bg-white text-[#1a5d1a] border-2 border-[#1a5d1a]" : "bg-[#1a5d1a] text-white hover:bg-[#144414]"}`}
                        >
                            <CalendarDays className="w-5 h-5" />
                        </button>
                        {isDatePickerOpen && (
                            <>
                                <div className="fixed inset-0 z-10" onClick={() => setIsDatePickerOpen(false)} />
                                <div className="absolute right-0 top-full mt-2 w-64 bg-white rounded-2xl shadow-xl border border-gray-100 p-4 z-20 animate-in fade-in zoom-in-95 duration-200">
                                    <div className="flex items-center justify-between mb-2">
                                        <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Filter by Date</p>
                                        <button
                                            onClick={() => setIsDatePickerOpen(false)}
                                            className="p-1 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-700 transition-colors"
                                        >
                                            <X className="w-4 h-4" />
                                        </button>
                                    </div>
                                    <input
                                        type="date"
                                        className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-2 text-sm font-bold text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#1a5d1a]/20 mb-2"
                                        value={dateFilter}
                                        onChange={(e) => setDateFilter(e.target.value)}
                                    />
                                    {dateFilter && (
                                        <button
                                            onClick={() => { setDateFilter(""); setIsDatePickerOpen(false); }}
                                            className="w-full text-center text-xs font-bold text-red-500 hover:bg-red-50 py-2 rounded-lg transition-colors"
                                        >
                                            Clear Date Filter
                                        </button>
                                    )}
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </div>

            {/* Loading / Error State */}
            {loading && (
                <div className="flex items-center justify-center py-20">
                    <Loader2 className="w-8 h-8 animate-spin text-[#1a5d1a]" />
                    <span className="ml-3 text-gray-500 font-bold">Loading bookings...</span>
                </div>
            )}

            {error && !loading && (
                <div className="bg-red-50 border border-red-100 rounded-2xl p-6 text-center">
                    <p className="text-red-600 font-bold">{error}</p>
                    <button onClick={fetchBookings} className="mt-3 text-sm font-bold text-red-700 underline hover:no-underline">
                        Retry
                    </button>
                </div>
            )}

            {/* Empty State */}
            {!loading && !error && filteredBookings.length === 0 && (
                <div className="bg-white rounded-[2.5rem] p-12 text-center border border-gray-100">
                    <Calendar className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-xl font-black text-gray-900 mb-2">No bookings found</h3>
                    <p className="text-gray-500 font-medium">
                        {bookingsList.length === 0
                            ? "Create your first booking to get started."
                            : "Try adjusting your filters or search query."}
                    </p>
                </div>
            )}

            {/* Bookings Grid */}
            {!loading && !error && filteredBookings.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    {filteredBookings.map((booking) => (
                        <div
                            key={booking.id}
                            className="group bg-white rounded-[2.5rem] p-6 border border-gray-100 hover:border-gray-200 shadow-[0_2px_10px_rgba(0,0,0,0.02)] hover:shadow-[0_20px_40px_rgba(0,0,0,0.06)] transition-all duration-300 hover:-translate-y-1 relative overflow-hidden flex flex-col h-full"
                        >
                            {/* Status Badge */}
                            <div className="absolute top-6 right-6 z-10">
                                <span className={`px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-wider border ${statusBadgeClass(booking.status)}`}>
                                    {statusLabel(booking.status)}
                                </span>
                            </div>

                            {/* Booking ID + Type Badge */}
                            <div className="mb-6 flex items-center gap-2">
                                <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest bg-gray-50 px-2 py-1 rounded-lg">
                                    #{booking.id.slice(0, 8)}
                                </span>
                                <span className={`text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md ${booking.created_type === "razorpay" ? "bg-indigo-50 text-indigo-600" : "bg-emerald-50 text-emerald-600"}`}>
                                    {booking.created_type}
                                </span>
                            </div>

                            {/* Customer & Service Info */}
                            <div className="flex items-start gap-4 mb-6">
                                <div className={`w-14 h-14 rounded-2xl ${getAvatarColor(booking.customer_name || "")} flex items-center justify-center text-xl font-black shadow-sm group-hover:scale-105 transition-transform shrink-0`}>
                                    {(booking.customer_name || "?").charAt(0)}
                                </div>
                                <div className="min-w-0">
                                    <h3 className="text-lg font-black text-gray-900 leading-tight mb-1 truncate">{booking.service_name}</h3>
                                    <div className="flex items-center gap-1.5 text-sm font-bold text-gray-500 truncate">
                                        <User className="w-3.5 h-3.5 shrink-0" /> {booking.customer_name}
                                    </div>
                                </div>
                            </div>

                            {/* Details Grid */}
                            <div className="grid grid-cols-2 gap-y-4 gap-x-2 py-5 border-y border-dashed border-gray-100 mb-4 flex-1">
                                <div>
                                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Date & Time</p>
                                    <div className="flex items-center gap-1.5 text-sm font-bold text-gray-800">
                                        <Clock className="w-3.5 h-3.5 text-[#5cb85c]" />
                                        {booking.booking_date || "—"}
                                    </div>
                                    <p className="text-xs font-medium text-gray-400 pl-5">{booking.booking_time || ""}</p>
                                </div>
                                <div>
                                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Assigned Priests</p>
                                    {booking.priests && booking.priests.length > 0 ? (
                                        <div className="space-y-1">
                                            {booking.priests.map((p, idx) => (
                                                <div key={idx} className="text-xs font-bold text-gray-800 truncate">
                                                    {p.name} <span className="text-gray-400">({p.commission_percent}%)</span>
                                                    <span className="text-[#5cb85c] ml-1">→ {formatCurrency(p.commission_amount)}</span>
                                                    {booking.status !== "cancelled" && (
                                                        <button
                                                            onClick={(e) => { e.stopPropagation(); setEditCommissionData({ booking, priestIdx: idx, newPercent: String(p.commission_percent) }); }}
                                                            className="ml-2 inline-flex items-center p-1 rounded hover:bg-gray-100"
                                                            title="Edit commission"
                                                        >
                                                            <Pencil className="w-3.5 h-3.5 text-gray-400" />
                                                        </button>
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <div>
                                            <p className="text-sm font-bold text-gray-400">Unassigned</p>
                                            {booking.status !== "cancelled" && (
                                                <button
                                                    onClick={() => openAssignPriestsModal(booking)}
                                                    className="text-[10px] font-bold text-[#5cb85c] hover:underline"
                                                >
                                                    + Assign Priests
                                                </button>
                                            )}
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Footer Location, Amount & Refund Status */}
                            <div className="flex items-center justify-between mb-6">
                                <div className="flex items-center gap-1.5 text-gray-500 text-xs font-bold min-w-0">
                                    <MapPin className="w-3.5 h-3.5 shrink-0" />
                                    <span className="truncate">{booking.location || "N/A"}</span>
                                </div>
                                <div className="flex items-center gap-1 bg-gray-50 px-3 py-1.5 rounded-xl shrink-0">
                                    <Banknote className="w-4 h-4 text-gray-400" />
                                    <span className="font-black text-gray-900">{formatCurrency(booking.total_amount)}</span>
                                </div>
                                {booking.refund_status && (
                                    <div className="flex items-center gap-2 bg-gray-50 px-3 py-1.5 rounded-xl">
                                        <span className="text-[10px] font-bold text-orange-600 uppercase">Refund</span>
                                        <span className={`px-2 py-1 rounded-full text-xs font-bold ${booking.refund_status === 'completed' ? 'bg-green-50 text-green-700' : booking.refund_status === 'failed' ? 'bg-red-50 text-red-700' : 'bg-yellow-50 text-yellow-700'}`}>
                                            {booking.refund_status}
                                        </span>
                                    </div>
                                )}
                            </div>

                            {/* Action Buttons */}
                            <div className="flex items-center gap-3 relative">
                                <button
                                    onClick={() => { setSelectedBooking(booking); setIsViewModalOpen(true); }}
                                    className="flex-1 bg-[#1a5d1a] text-white py-3 rounded-xl font-bold text-sm hover:bg-[#144414] transition-colors shadow-lg shadow-green-900/10 flex items-center justify-center gap-2"
                                >
                                    <Eye className="w-4 h-4" /> View Details
                                </button>

                                <div className="relative">
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setOpenDropdownId(openDropdownId === booking.id ? null : booking.id);
                                        }}
                                        className={`p-3 rounded-xl transition-colors ${openDropdownId === booking.id ? "bg-gray-200 text-gray-900" : "bg-gray-100 hover:bg-gray-200 text-gray-700"}`}
                                    >
                                        <MoreHorizontal className="w-5 h-5" />
                                    </button>

                                    {openDropdownId === booking.id && (
                                        <div className="absolute right-0 bottom-full mb-2 w-52 bg-white rounded-2xl shadow-xl border border-gray-100 p-2 z-20 animate-in fade-in zoom-in-95 duration-200 overflow-hidden">
                                            <div className="fixed inset-0 z-10" onClick={() => setOpenDropdownId(null)}></div>
                                            <div className="relative z-20 space-y-1">
                                                <button
                                                    onClick={() => { setSelectedBooking(booking); setIsViewModalOpen(true); setOpenDropdownId(null); }}
                                                    className="w-full text-left px-3 py-2 rounded-xl text-xs font-bold text-gray-600 hover:bg-gray-50 flex items-center gap-2"
                                                >
                                                    <Eye className="w-3.5 h-3.5" /> View Details
                                                </button>

                                                {booking.status === "pending" && (
                                                    <button
                                                        onClick={() => { openAssignPriestsModal(booking); setOpenDropdownId(null); }}
                                                        className="w-full text-left px-3 py-2 rounded-xl text-xs font-bold text-emerald-600 hover:bg-emerald-50 flex items-center gap-2"
                                                    >
                                                        <Users className="w-3.5 h-3.5" /> Assign Priests
                                                    </button>
                                                )}

                                                {booking.status !== "cancelled" && (
                                                    <button
                                                        onClick={() => handleCancelBooking(booking)}
                                                        className="w-full text-left px-3 py-2 rounded-xl text-xs font-bold text-red-600 hover:bg-red-50 flex items-center gap-2"
                                                    >
                                                        <Ban className="w-3.5 h-3.5" /> Cancel Booking
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* ============================== */}
            {/* Create Booking Modal           */}
            {/* ============================== */}
            {isCreateModalOpen && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200" onClick={() => { setIsCreateModalOpen(false); setIsServiceDropdownOpen(false); }}></div>
                    <div className="relative bg-white rounded-[2.5rem] w-full max-w-lg shadow-2xl animate-in zoom-in-95 duration-200 flex flex-col max-h-[90vh]">
                        <div className="p-8 overflow-y-auto flex-1" onClick={() => isServiceDropdownOpen && setIsServiceDropdownOpen(false)}>
                            <div className="flex justify-between items-center mb-8">
                                <div>
                                    <h2 className="text-2xl font-black text-gray-900">Create Booking</h2>
                                    <p className="text-sm font-medium text-gray-500">Add a new service appointment</p>
                                </div>
                                <button onClick={() => { setIsCreateModalOpen(false); setIsServiceDropdownOpen(false); }} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                                    <X className="w-5 h-5 text-gray-400" />
                                </button>
                            </div>

                            <form onSubmit={handleCreateBooking} className="space-y-6">
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-gray-400 uppercase tracking-wider pl-1">Customer Name *</label>
                                    <input
                                        type="text"
                                        required
                                        className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-5 py-4 font-bold text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#1a5d1a]/20 transition-all"
                                        placeholder="e.g. Rahul Sharma"
                                        value={newBooking.customer_name}
                                        onChange={(e) => setNewBooking({ ...newBooking, customer_name: e.target.value })}
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-gray-400 uppercase tracking-wider pl-1">Service *</label>
                                    <div className="relative">
                                        {/* Custom dropdown trigger */}
                                        <button
                                            type="button"
                                            onClick={(e) => { e.stopPropagation(); setIsServiceDropdownOpen((v) => !v); }}
                                            className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-5 py-4 font-bold text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#1a5d1a]/20 transition-all flex items-center justify-between text-left"
                                        >
                                            <span className={newBooking.service_name ? "text-gray-900" : "text-gray-400 font-medium"}>
                                                {newBooking.service_name || "Select Service"}
                                            </span>
                                            <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${isServiceDropdownOpen ? "rotate-180" : ""}`} />
                                        </button>

                                        {/* Custom dropdown list — fully contained, scrolls internally */}
                                        {isServiceDropdownOpen && (
                                            <div
                                                className="absolute left-0 right-0 top-full mt-2 bg-white border border-gray-100 rounded-2xl shadow-xl z-50 overflow-hidden"
                                                onClick={(e) => e.stopPropagation()}
                                            >
                                                <div className="max-h-52 overflow-y-auto">
                                                    {(serviceOptions.length > 0
                                                        ? serviceOptions.map((s) => ({
                                                              key: s.id,
                                                              label: s.name + (s.is_virtual ? " (Virtual)" : ""),
                                                              service_id: s.id,
                                                              service_name: s.name + (s.is_virtual ? " (Virtual)" : ""),
                                                          }))
                                                        : [
                                                              ...homamServices.map((s, i) => ({ key: `h-${i}`, label: s.title, service_id: "", service_name: s.title })),
                                                              ...virtualServices.map((s, i) => ({ key: `v-${i}`, label: `${s.title} (Virtual)`, service_id: "", service_name: `${s.title} (Virtual)` })),
                                                          ]
                                                    ).map((opt) => (
                                                        <button
                                                            key={opt.key}
                                                            type="button"
                                                            onClick={() => {
                                                                setNewBooking({ ...newBooking, service_id: opt.service_id, service_name: opt.service_name });
                                                                setIsServiceDropdownOpen(false);
                                                            }}
                                                            className={`w-full text-left px-5 py-3 text-sm font-bold transition-colors hover:bg-gray-50 ${
                                                                newBooking.service_name === opt.service_name
                                                                    ? "bg-green-50 text-[#1a5d1a]"
                                                                    : "text-gray-800"
                                                            }`}
                                                        >
                                                            {opt.label}
                                                        </button>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-gray-400 uppercase tracking-wider pl-1">Date *</label>
                                        <input
                                            type="date"
                                            required
                                            className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-5 py-4 font-bold text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#1a5d1a]/20 transition-all"
                                            value={newBooking.booking_date}
                                            onChange={(e) => setNewBooking({ ...newBooking, booking_date: e.target.value })}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-gray-400 uppercase tracking-wider pl-1">Time *</label>
                                        <input
                                            type="time"
                                            required
                                            className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-5 py-4 font-bold text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#1a5d1a]/20 transition-all"
                                            value={newBooking.booking_time}
                                            onChange={(e) => setNewBooking({ ...newBooking, booking_time: e.target.value })}
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-gray-400 uppercase tracking-wider pl-1">Location</label>
                                    <input
                                        type="text"
                                        className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-5 py-4 font-bold text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#1a5d1a]/20 transition-all"
                                        placeholder="e.g. Mumbai, Bandra West"
                                        value={newBooking.location}
                                        onChange={(e) => setNewBooking({ ...newBooking, location: e.target.value })}
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-gray-400 uppercase tracking-wider pl-1">Total Amount *</label>
                                    <input
                                        type="text"
                                        required
                                        className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-5 py-4 font-bold text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#1a5d1a]/20 transition-all"
                                        placeholder="e.g. 9000"
                                        value={newBooking.total_amount}
                                        onChange={(e) => setNewBooking({ ...newBooking, total_amount: e.target.value })}
                                    />
                                </div>

                                <button
                                    type="submit"
                                    disabled={createLoading}
                                    className="w-full bg-[#1a5d1a] text-white py-4 rounded-2xl font-bold text-lg shadow-xl shadow-green-900/20 hover:shadow-2xl hover:shadow-green-900/30 hover:-translate-y-0.5 transition-all mt-4 active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                >
                                    {createLoading && <Loader2 className="w-5 h-5 animate-spin" />}
                                    Create Booking
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            )}

            {/* ============================== */}
            {/* View Details Modal             */}
            {/* ============================== */}
            {isViewModalOpen && selectedBooking && (
                <div className="fixed inset-0 z-[65] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200" onClick={() => setIsViewModalOpen(false)}></div>
                    <div className="relative bg-white rounded-[2.5rem] w-full max-w-lg overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200 flex flex-col max-h-[90vh]">
                        <div className="p-8 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                            <div>
                                <h2 className="text-xl font-black text-gray-900">Booking Details</h2>
                                <p className="text-sm font-medium text-gray-500">#{selectedBooking.id.slice(0, 8)}</p>
                            </div>
                            <button onClick={() => setIsViewModalOpen(false)} className="p-2 hover:bg-gray-200 rounded-full transition-colors">
                                <X className="w-5 h-5 text-gray-500" />
                            </button>
                        </div>

                        <div className="p-8 space-y-6 overflow-y-auto">
                            {/* Header Info */}
                            <div className="flex items-center gap-4">
                                <div className={`w-16 h-16 rounded-3xl ${getAvatarColor(selectedBooking.customer_name || "")} flex items-center justify-center text-2xl font-black`}>
                                    {(selectedBooking.customer_name || "?").charAt(0)}
                                </div>
                                <div>
                                    <h3 className="text-2xl font-black text-gray-900 leading-tight">{selectedBooking.customer_name}</h3>
                                    <div className="flex items-center gap-2 mt-1">
                                        <span className={`px-2 py-1 rounded-lg text-xs font-bold border ${statusBadgeClass(selectedBooking.status)}`}>
                                            {statusLabel(selectedBooking.status)}
                                        </span>
                                        <span className={`px-2 py-1 rounded-lg text-xs font-bold ${selectedBooking.created_type === "razorpay" ? "bg-indigo-50 text-indigo-600" : "bg-emerald-50 text-emerald-600"}`}>
                                            {selectedBooking.created_type}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100">
                                    <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Service</p>
                                    <p className="text-lg font-black text-gray-900">{selectedBooking.service_name}</p>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100">
                                        <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Date</p>
                                        <div className="flex items-center gap-2 font-bold text-gray-900">
                                            <CalendarDays className="w-4 h-4 text-gray-400" /> {selectedBooking.booking_date || "—"}
                                        </div>
                                    </div>
                                    <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100">
                                        <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Time</p>
                                        <div className="flex items-center gap-2 font-bold text-gray-900">
                                            <Clock className="w-4 h-4 text-gray-400" /> {selectedBooking.booking_time || "—"}
                                        </div>
                                    </div>
                                </div>

                                <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100">
                                    <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Location</p>
                                    <div className="flex items-center gap-2 font-bold text-gray-900">
                                        <MapPin className="w-4 h-4 text-gray-400" /> {selectedBooking.location || "N/A"}
                                    </div>
                                </div>

                                {/* Priests & Commission */}
                                <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100">
                                    <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Assigned Priests</p>
                                    {selectedBooking.priests && selectedBooking.priests.length > 0 ? (
                                        <div className="space-y-2">
                                            {selectedBooking.priests.map((p, idx) => (
                                                <div key={idx} className="flex items-center justify-between bg-white rounded-xl px-4 py-3 border border-gray-100">
                                                    <div className="flex items-center gap-2">
                                                        <User className="w-4 h-4 text-gray-400" />
                                                        <span className="font-bold text-gray-900">{p.name}</span>
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <span className="text-xs font-bold text-gray-500">{p.commission_percent}%</span>
                                                        <span className="font-black text-[#1a5d1a]">{formatCurrency(p.commission_amount)}</span>
                                                        {selectedBooking.status !== "cancelled" && (
                                                            <button
                                                                onClick={() => setEditCommissionData({ booking: selectedBooking, priestIdx: idx, newPercent: String(p.commission_percent) })}
                                                                className="p-1.5 rounded-lg hover:bg-blue-50 text-blue-400 hover:text-blue-600 transition-colors"
                                                                title="Edit commission"
                                                            >
                                                                <Pencil className="w-3.5 h-3.5" />
                                                            </button>
                                                        )}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <p className="text-sm font-medium text-gray-400">No priests assigned yet.</p>
                                    )}
                                </div>

                                {/* Financial Summary */}
                                <div className="p-4 bg-gradient-to-br from-gray-50 to-green-50/30 rounded-2xl border border-gray-100">
                                    <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Financial Summary</p>
                                    <div className="space-y-2">
                                        <div className="flex justify-between items-center">
                                            <span className="text-sm font-bold text-gray-600">Total Amount</span>
                                            <span className="font-black text-gray-900">{formatCurrency(selectedBooking.total_amount)}</span>
                                        </div>
                                        {selectedBooking.priests && selectedBooking.priests.length > 0 && (
                                            <>
                                                <div className="flex justify-between items-center">
                                                    <span className="text-sm font-bold text-gray-600">Total Commission</span>
                                                    <span className="font-bold text-orange-600">{formatCurrency(getTotalCommission(selectedBooking))}</span>
                                                </div>
                                                <div className="h-px bg-gray-200 my-1"></div>
                                                <div className="flex justify-between items-center">
                                                    <span className="text-sm font-black text-gray-900">Admin Net Amount</span>
                                                    <span className="font-black text-[#1a5d1a] text-lg">{formatCurrency(selectedBooking.admin_net_amount)}</span>
                                                </div>
                                            </>
                                        )}
                                        {selectedBooking.refund_status && (
                                            <>
                                                <div className="h-px bg-gray-200 my-1"></div>
                                                <div className="flex justify-between items-center">
                                                    <span className="text-sm font-bold text-gray-600">Refund Status</span>
                                                    <div className="flex items-center gap-2">
                                                        <span className={`px-2 py-1 rounded-full text-xs font-bold ${selectedBooking.refund_status === 'completed' ? 'bg-green-50 text-green-700' : selectedBooking.refund_status === 'failed' ? 'bg-red-50 text-red-700' : 'bg-yellow-50 text-yellow-700'}`}>
                                                            {selectedBooking.refund_status}
                                                        </span>
                                                        {selectedBooking.refund_id && (
                                                            <span className="text-xs text-gray-500">#{selectedBooking.refund_id.slice(0,8)}</span>
                                                        )}
                                                    </div>
                                                </div>
                                            </>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="p-6 border-t border-gray-100 bg-gray-50/50 flex gap-3">
                            {selectedBooking.status === "pending" && (!selectedBooking.priests || selectedBooking.priests.length === 0) && (
                                <button
                                    onClick={() => { setIsViewModalOpen(false); openAssignPriestsModal(selectedBooking); }}
                                    className="flex-1 py-3 bg-[#1a5d1a] text-white rounded-xl font-bold hover:bg-[#144414] transition-colors flex items-center justify-center gap-2"
                                >
                                    <Users className="w-4 h-4" /> Assign Priests
                                </button>
                            )}
                            <button
                                onClick={() => setIsViewModalOpen(false)}
                                className="flex-1 py-3 bg-white border border-gray-200 text-gray-700 rounded-xl font-bold hover:bg-gray-50 transition-colors"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* ============================== */}
            {/* Assign Priests Modal           */}
            {/* ============================== */}
            {isAssignPriestsModalOpen && selectedBooking && (
                <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200" onClick={() => { setIsAssignPriestsModalOpen(false); setOpenPriestDropdownIndex(null); }}></div>
                    <div className="relative bg-white rounded-[2.5rem] w-full max-w-lg overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200 flex flex-col max-h-[90vh]">
                        <div className="p-8 border-b border-gray-100 flex justify-between items-center bg-gray-50/50" onClick={() => setOpenPriestDropdownIndex(null)}>
                            <div>
                                <h2 className="text-xl font-black text-gray-900">Assign Priests</h2>
                                <p className="text-sm font-medium text-gray-500">
                                    {selectedBooking.service_name} — {formatCurrency(selectedBooking.total_amount)}
                                </p>
                            </div>
                            <button onClick={() => setIsAssignPriestsModalOpen(false)} className="p-2 hover:bg-gray-200 rounded-full transition-colors">
                                <X className="w-5 h-5 text-gray-500" />
                            </button>
                        </div>

                        <div className="p-8 space-y-4 overflow-y-auto">
                            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                                Commission is calculated sequentially from the remaining amount.
                            </p>

                            {priestAssignments.map((row, index) => (
                                <div key={index} className="flex items-end gap-3 bg-gray-50 rounded-2xl p-4 border border-gray-100">
                                    <div className="flex-1 space-y-2">
                                        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Priest</label>
                                        <div className="relative">
                                            <button
                                                type="button"
                                                onClick={(e) => { e.stopPropagation(); setOpenPriestDropdownIndex(openPriestDropdownIndex === index ? null : index); }}
                                                className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-sm font-bold text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#1a5d1a]/20 flex items-center justify-between text-left"
                                            >
                                                <span className={row.priest_id ? "text-gray-900" : "text-gray-400 font-medium"}>
                                                    {row.priest_id
                                                        ? (() => { const p = availablePriests.find((p) => p.id === row.priest_id); return p ? (p.name || `${p.first_name || ""} ${p.last_name || ""}`.trim()) : "Select Priest"; })()
                                                        : "Select Priest"}
                                                </span>
                                                <ChevronDown className={`w-3.5 h-3.5 text-gray-400 transition-transform duration-200 shrink-0 ${openPriestDropdownIndex === index ? "rotate-180" : ""}`} />
                                            </button>

                                            {openPriestDropdownIndex === index && (
                                                <div
                                                    className="absolute left-0 right-0 top-full mt-1 bg-white border border-gray-100 rounded-xl shadow-xl z-50 overflow-hidden"
                                                    onClick={(e) => e.stopPropagation()}
                                                >
                                                    <div className="max-h-44 overflow-y-auto">
                                                        {availablePriests.map((p) => {
                                                            const label = p.name || `${p.first_name || ""} ${p.last_name || ""}`.trim();
                                                            return (
                                                                <button
                                                                    key={p.id}
                                                                    type="button"
                                                                    onClick={() => { updatePriestRow(index, "priest_id", p.id); setOpenPriestDropdownIndex(null); }}
                                                                    className={`w-full text-left px-4 py-2.5 text-sm font-bold transition-colors hover:bg-gray-50 ${
                                                                        row.priest_id === p.id ? "bg-green-50 text-[#1a5d1a]" : "text-gray-800"
                                                                    }`}
                                                                >
                                                                    {label}
                                                                </button>
                                                            );
                                                        })}
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                    <div className="w-28 space-y-2">
                                        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider flex items-center gap-1">
                                            <Percent className="w-3 h-3" /> Commission
                                        </label>
                                        <input
                                            type="number"
                                            min="0"
                                            max="100"
                                            step="0.5"
                                            className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-sm font-bold text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#1a5d1a]/20"
                                            placeholder="%"
                                            value={row.commission_percent}
                                            onChange={(e) => updatePriestRow(index, "commission_percent", e.target.value)}
                                        />
                                    </div>
                                    {priestAssignments.length > 1 && (
                                        <button
                                            onClick={() => removePriestRow(index)}
                                            className="p-3 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors"
                                        >
                                            <X className="w-4 h-4" />
                                        </button>
                                    )}
                                </div>
                            ))}

                            <button
                                onClick={addPriestRow}
                                className="w-full py-3 border-2 border-dashed border-gray-200 rounded-2xl text-sm font-bold text-gray-500 hover:border-[#1a5d1a] hover:text-[#1a5d1a] transition-colors flex items-center justify-center gap-2"
                            >
                                <Plus className="w-4 h-4" /> Add Another Priest
                            </button>
                        </div>

                        <div className="p-6 border-t border-gray-100 bg-gray-50/50 flex gap-3">
                            <button
                                onClick={() => setIsAssignPriestsModalOpen(false)}
                                className="flex-1 py-3 bg-white border border-gray-200 text-gray-700 rounded-xl font-bold hover:bg-gray-50 transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleAssignPriests}
                                disabled={assignLoading}
                                className="flex-1 py-3 bg-[#1a5d1a] text-white rounded-xl font-bold hover:bg-[#144414] transition-colors shadow-lg shadow-green-900/10 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                            >
                                {assignLoading && <Loader2 className="w-4 h-4 animate-spin" />}
                                Assign & Calculate
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* ============================== */}
            {/* Cancel Confirmation Modal       */}
            {/* ============================== */}
            {cancelConfirmBooking && (
                <div className="fixed inset-0 z-[90] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200" onClick={() => !cancelLoading && setCancelConfirmBooking(null)}></div>
                    <div className="relative bg-white rounded-[2.5rem] w-full max-w-md shadow-2xl animate-in zoom-in-95 duration-200 overflow-hidden">
                        <div className="p-8">
                            <div className="flex flex-col items-center text-center gap-4">
                                <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center">
                                    <AlertTriangle className="w-8 h-8 text-red-500" />
                                </div>
                                <div>
                                    <h2 className="text-xl font-black text-gray-900">Cancel Booking?</h2>
                                    <p className="text-sm font-medium text-gray-500 mt-1">
                                        #{cancelConfirmBooking.id.slice(0, 8)} · {cancelConfirmBooking.customer_name}
                                    </p>
                                </div>
                                <div className="w-full bg-orange-50 border border-orange-100 rounded-2xl p-4 text-left">
                                    <div className="flex items-start gap-3">
                                        <RefreshCw className="w-4 h-4 text-orange-500 mt-0.5 shrink-0" />
                                        <div>
                                            <p className="text-sm font-black text-orange-800">Refund will be initiated</p>
                                            <p className="text-xs font-medium text-orange-600 mt-0.5">
                                                {formatCurrency(cancelConfirmBooking.total_amount)} will be refunded to the customer. This action cannot be undone.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="px-8 pb-8 flex gap-3">
                            <button
                                onClick={() => setCancelConfirmBooking(null)}
                                disabled={cancelLoading}
                                className="flex-1 py-3 bg-white border border-gray-200 text-gray-700 rounded-xl font-bold hover:bg-gray-50 transition-colors disabled:opacity-50"
                            >
                                Go Back
                            </button>
                            <button
                                onClick={confirmCancelBooking}
                                disabled={cancelLoading}
                                className="flex-1 py-3 bg-red-600 text-white rounded-xl font-bold hover:bg-red-700 transition-colors shadow-lg shadow-red-900/20 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                            >
                                {cancelLoading && <Loader2 className="w-4 h-4 animate-spin" />}
                                Yes, Cancel & Refund
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* ============================== */}
            {/* Edit Commission Modal          */}
            {/* ============================== */}
            {editCommissionData && (
                <div className="fixed inset-0 z-[90] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200" onClick={() => !editCommissionLoading && setEditCommissionData(null)}></div>
                    <div className="relative bg-white rounded-[2.5rem] w-full max-w-sm shadow-2xl animate-in zoom-in-95 duration-200 overflow-hidden">
                        <div className="p-8">
                            <div className="flex justify-between items-center mb-6">
                                <div>
                                    <h2 className="text-xl font-black text-gray-900">Edit Commission</h2>
                                    <p className="text-sm font-medium text-gray-500">
                                        {editCommissionData.booking.priests[editCommissionData.priestIdx]?.name}
                                    </p>
                                </div>
                                <button onClick={() => setEditCommissionData(null)} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                                    <X className="w-5 h-5 text-gray-400" />
                                </button>
                            </div>

                            <div className="space-y-4">
                                <div className="bg-gray-50 rounded-2xl p-4 border border-gray-100">
                                    <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Booking Total</p>
                                    <p className="text-lg font-black text-gray-900">{formatCurrency(editCommissionData.booking.total_amount)}</p>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-gray-400 uppercase tracking-wider pl-1 flex items-center gap-1">
                                        <Percent className="w-3 h-3" /> New Commission %
                                    </label>
                                    <input
                                        type="number"
                                        min="0"
                                        max="100"
                                        step="0.5"
                                        autoFocus
                                        className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-5 py-4 font-bold text-gray-900 text-xl focus:outline-none focus:ring-2 focus:ring-[#1a5d1a]/20 transition-all"
                                        value={editCommissionData.newPercent}
                                        onChange={(e) => setEditCommissionData({ ...editCommissionData, newPercent: e.target.value })}
                                    />
                                </div>
                                {editCommissionData.newPercent && parseFloat(editCommissionData.newPercent) > 0 && (
                                    <div className="bg-green-50 border border-green-100 rounded-2xl p-4">
                                        <p className="text-xs font-bold text-green-600 uppercase tracking-wider mb-1">New Commission Amount</p>
                                        <p className="text-xl font-black text-[#1a5d1a]">
                                            {formatCurrency((editCommissionData.booking.total_amount * parseFloat(editCommissionData.newPercent)) / 100)}
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>
                        <div className="px-8 pb-8 flex gap-3">
                            <button
                                onClick={() => setEditCommissionData(null)}
                                disabled={editCommissionLoading}
                                className="flex-1 py-3 bg-white border border-gray-200 text-gray-700 rounded-xl font-bold hover:bg-gray-50 transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleEditCommission}
                                disabled={editCommissionLoading}
                                className="flex-1 py-3 bg-[#1a5d1a] text-white rounded-xl font-bold hover:bg-[#144414] transition-colors shadow-lg shadow-green-900/10 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                            >
                                {editCommissionLoading && <Loader2 className="w-4 h-4 animate-spin" />}
                                Save Changes
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Toaster */}
            {toast.visible && (
                <div className={`fixed bottom-8 right-8 ${toast.type === "error" ? "bg-red-600" : "bg-gray-900"} text-white px-6 py-4 rounded-2xl shadow-2xl font-bold text-sm z-[100] animate-in slide-in-from-bottom-5 fade-in duration-300 flex items-center gap-3`}>
                    {toast.type === "error" ? <XCircle className="w-5 h-5 text-red-200" /> : <CheckCircle className="w-5 h-5 text-green-400" />}
                    {toast.message}
                </div>
            )}
        </div>
    );
}
