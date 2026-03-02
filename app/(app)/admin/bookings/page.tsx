"use client";

import { useState, useEffect } from "react";
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
    ThumbsUp,
    Ban
} from "lucide-react";
import { homamServices } from "@/data/homams";
import { virtualServices } from "@/lib/data/virtual-services";

// Mock Data
const initialBookings = [
    {
        id: "BK001",
        customer: "Rahul Sharma",
        service: "Ganapati Homam",
        date: "Feb 11, 2024",
        time: "10:00 AM",
        priest: "Pandit Ravi",
        amount: "₹5,000",
        status: "Confirmed",
        location: "Mumbai, Bandra West",
        avatarColor: "bg-blue-100 text-blue-600",
        notes: "Please bring flowers."
    },
    {
        id: "BK002",
        customer: "Priya Patel",
        service: "Satyanarayan Puja",
        date: "Feb 11, 2024",
        time: "2:00 PM",
        priest: "Acharya Mishra",
        amount: "₹3,500",
        status: "Pending",
        location: "Pune, Kothrud",
        avatarColor: "bg-pink-100 text-pink-600",
        notes: "No specific requirements."
    },
    {
        id: "BK003",
        customer: "Amit Kumar",
        service: "Griha Pravesh",
        date: "Feb 12, 2024",
        time: "9:00 AM",
        priest: "Swami Iyer",
        amount: "₹12,000",
        status: "Confirmed",
        location: "Chennai, T Nagar",
        avatarColor: "bg-purple-100 text-purple-600",
        notes: "Family of 4."
    },
    {
        id: "BK004",
        customer: "Sneha Gupta",
        service: "Navagraha Shanti",
        date: "Feb 14, 2024",
        time: "11:00 AM",
        priest: "Pandit Ravi",
        amount: "₹4,500",
        status: "Completed",
        location: "Delhi, Dwaraka",
        avatarColor: "bg-orange-100 text-orange-600",
        notes: "Succesfully completed."
    },
    {
        id: "BK005",
        customer: "Vikram Singh",
        service: "Vastu Puja",
        date: "Feb 15, 2024",
        time: "8:00 AM",
        priest: "Unassigned",
        amount: "₹6,000",
        status: "Pending",
        location: "Bangalore, Indiranagar",
        avatarColor: "bg-green-100 text-green-600",
        notes: "Preferred language: Hindi"
    },
];

const statusOptions = ["All", "Confirmed", "Pending", "Completed", "Cancelled"];
const sortOptions = ["Newest", "Oldest", "Amount: High to Low", "Amount: Low to High"];

const stats = [
    { label: "Total Bookings", value: "1,234", icon: Calendar, color: "bg-blue-500", lightColor: "bg-blue-50 text-blue-600" },
    { label: "Pending Review", value: "12", icon: Clock, color: "bg-yellow-500", lightColor: "bg-yellow-50 text-yellow-600" },
    { label: "Confirmed", value: "45", icon: CheckCircle, color: "bg-green-500", lightColor: "bg-green-50 text-green-600" },
    { label: "Cancelled", value: "3", icon: XCircle, color: "bg-red-500", lightColor: "bg-red-50 text-red-600" },
];

export default function BookingsPage() {
    const [bookingsList, setBookingsList] = useState(initialBookings);
    const [statusFilter, setStatusFilter] = useState("All");
    const [serviceFilter, setServiceFilter] = useState("All");
    const [sort, setSort] = useState("Newest");

    // Modal States
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [isViewModalOpen, setIsViewModalOpen] = useState(false);
    const [selectedBooking, setSelectedBooking] = useState<any>(null);

    // Filter/Dropdown UI States
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [isSortOpen, setIsSortOpen] = useState(false);
    const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);
    const [dateFilter, setDateFilter] = useState("");
    const [openDropdownId, setOpenDropdownId] = useState<string | null>(null);

    // Toaster State
    const [toast, setToast] = useState({ message: "", visible: false });

    // Form State
    const [newBooking, setNewBooking] = useState({
        customer: "",
        service: "",
        date: "",
        time: "",
        location: "",
        amount: ""
    });

    const showToaster = (message: string) => {
        setToast({ message, visible: true });
        setTimeout(() => setToast({ message: "", visible: false }), 3000);
    };

    const handleCreateBooking = (e: React.FormEvent) => {
        e.preventDefault();

        // Simple Validation
        if (!newBooking.customer || !newBooking.service || !newBooking.date || !newBooking.time || !newBooking.amount) {
            showToaster("Please fill in all required fields.");
            return;
        }

        const booking = {
            id: `BK00${bookingsList.length + 1}`,
            ...newBooking,
            priest: "Unassigned",
            status: "Pending",
            avatarColor: "bg-blue-100 text-blue-600",
            notes: "New booking created via admin panel."
        };

        setBookingsList([booking, ...bookingsList]);
        setIsCreateModalOpen(false);
        setNewBooking({ customer: "", service: "", date: "", time: "", location: "", amount: "" });
        showToaster("Booking created successfully");
    };

    const handleStatusChange = (id: string, newStatus: string) => {
        setBookingsList(prev => prev.map(b => b.id === id ? { ...b, status: newStatus } : b));
        setOpenDropdownId(null);

        let message = `Booking marked as ${newStatus}`;
        if (newStatus === "Confirmed") message = "Booking confirmed and approved request successfully";
        if (newStatus === "Cancelled") message = "Booking cancelled";

        showToaster(message);
    };

    // Close dropdowns when clicking outside
    useEffect(() => {
        const handleClickOutside = () => setOpenDropdownId(null);
        if (openDropdownId) {
            document.addEventListener('click', handleClickOutside);
        }
        return () => document.removeEventListener('click', handleClickOutside);
    }, [openDropdownId]);

    // Unique Services for Filter
    const uniqueServices = Array.from(new Set(bookingsList.map(b => b.service)));

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
                            <Filter className="w-4 h-4" /> Filters <ChevronDown className={`w-3 h-3 transition-transform ${isFilterOpen ? 'rotate-180' : ''}`} />
                        </button>

                        {isFilterOpen && (
                            <>
                                <div className="fixed inset-0 z-10" onClick={() => setIsFilterOpen(false)} />
                                <div className="absolute right-0 top-full mt-2 w-64 bg-white rounded-2xl shadow-xl border border-gray-100 p-4 z-20 animate-in fade-in zoom-in-95 duration-200 overflow-y-auto max-h-[80vh]">

                                    {/* Status Filter */}
                                    <div className="mb-4">
                                        <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">Status</h4>
                                        <div className="space-y-1">
                                            {statusOptions.map(option => (
                                                <button
                                                    key={option}
                                                    onClick={() => { setStatusFilter(option); }}
                                                    className={`w-full text-left px-3 py-2 rounded-lg text-xs font-bold transition-colors flex justify-between items-center ${statusFilter === option ? 'bg-[#1a5d1a]/10 text-[#1a5d1a]' : 'text-gray-600 hover:bg-gray-50'
                                                        }`}
                                                >
                                                    {option}
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
                                                className={`w-full text-left px-3 py-2 rounded-lg text-xs font-bold transition-colors flex justify-between items-center ${serviceFilter === "All" ? 'bg-[#1a5d1a]/10 text-[#1a5d1a]' : 'text-gray-600 hover:bg-gray-50'}`}
                                            >
                                                All Services
                                                {serviceFilter === "All" && <Check className="w-3 h-3" />}
                                            </button>
                                            {uniqueServices.map(service => (
                                                <button
                                                    key={service}
                                                    onClick={() => setServiceFilter(service)}
                                                    className={`w-full text-left px-3 py-2 rounded-lg text-xs font-bold transition-colors flex justify-between items-center ${serviceFilter === service ? 'bg-[#1a5d1a]/10 text-[#1a5d1a]' : 'text-gray-600 hover:bg-gray-50'}`}
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
                            Sort: {sort} <ChevronDown className={`w-3 h-3 transition-transform ${isSortOpen ? 'rotate-180' : ''}`} />
                        </button>

                        {isSortOpen && (
                            <>
                                <div className="fixed inset-0 z-10" onClick={() => setIsSortOpen(false)} />
                                <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-2xl shadow-xl border border-gray-100 p-2 z-20 animate-in fade-in zoom-in-95 duration-200">
                                    {sortOptions.map(option => (
                                        <button
                                            key={option}
                                            onClick={() => { setSort(option); setIsSortOpen(false); }}
                                            className={`w-full text-left px-4 py-2.5 rounded-xl text-xs font-bold transition-colors flex justify-between items-center ${sort === option ? 'bg-[#1a5d1a]/10 text-[#1a5d1a]' : 'text-gray-600 hover:bg-gray-50'
                                                }`}
                                        >
                                            {option}
                                            {sort === option && <Check className="w-3 h-3" />}
                                        </button>
                                    ))}
                                </div>
                            </>
                        )}
                    </div>

                    <div className="relative">
                        <button
                            onClick={() => setIsDatePickerOpen(!isDatePickerOpen)}
                            className={`p-3 rounded-full transition-colors shadow-lg shadow-green-900/20 ${dateFilter ? 'bg-white text-[#1a5d1a] border-2 border-[#1a5d1a]' : 'bg-[#1a5d1a] text-white hover:bg-[#144414]'}`}
                        >
                            <CalendarDays className="w-5 h-5" />
                        </button>
                        {isDatePickerOpen && (
                            <>
                                <div className="fixed inset-0 z-10" onClick={() => setIsDatePickerOpen(false)} />
                                <div className="absolute right-0 top-full mt-2 w-64 bg-white rounded-2xl shadow-xl border border-gray-100 p-4 z-20 animate-in fade-in zoom-in-95 duration-200">
                                    <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Filter by Date</p>
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

            {/* Bookings Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {bookingsList
                    .filter(b => {
                        const statusMatch = statusFilter === "All" || b.status === statusFilter;
                        const serviceMatch = serviceFilter === "All" || b.service === serviceFilter;

                        const bookingDate = new Date(b.date);
                        const filterDateObj = dateFilter ? new Date(dateFilter) : null;

                        const dateMatch = !filterDateObj || (
                            bookingDate.getDate() === filterDateObj.getDate() &&
                            bookingDate.getMonth() === filterDateObj.getMonth() &&
                            bookingDate.getFullYear() === filterDateObj.getFullYear()
                        );

                        return statusMatch && serviceMatch && dateMatch;
                    })
                    .sort((a, b) => {
                        if (sort === "Newest") return new Date(b.date).getTime() - new Date(a.date).getTime();
                        if (sort === "Oldest") return new Date(a.date).getTime() - new Date(b.date).getTime();
                        if (sort === "Amount: High to Low") return parseInt(b.amount.replace(/[^0-9]/g, '')) - parseInt(a.amount.replace(/[^0-9]/g, ''));
                        if (sort === "Amount: Low to High") return parseInt(a.amount.replace(/[^0-9]/g, '')) - parseInt(b.amount.replace(/[^0-9]/g, ''));
                        return 0;
                    })
                    .map((booking) => (
                        <div key={booking.id} className="group bg-white rounded-[2.5rem] p-6 border border-gray-100 hover:border-gray-200 shadow-[0_2px_10px_rgba(0,0,0,0.02)] hover:shadow-[0_20px_40px_rgba(0,0,0,0.06)] transition-all duration-300 hover:-translate-y-1 relative overflow-hidden flex flex-col h-full">

                            {/* Status Badge */}
                            <div className="absolute top-6 right-6 z-10">
                                <span className={`px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-wider border ${booking.status === 'Confirmed' ? 'bg-green-50 text-green-700 border-green-100' :
                                    booking.status === 'Pending' ? 'bg-yellow-50 text-yellow-700 border-yellow-100' :
                                        booking.status === 'Completed' ? 'bg-blue-50 text-blue-700 border-blue-100' :
                                            booking.status === 'Cancelled' ? 'bg-red-50 text-red-700 border-red-100' :
                                                'bg-gray-50 text-gray-600 border-gray-100'
                                    }`}>
                                    {booking.status}
                                </span>
                            </div>

                            {/* Booking ID */}
                            <div className="mb-6">
                                <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest bg-gray-50 px-2 py-1 rounded-lg">
                                    #{booking.id}
                                </span>
                            </div>

                            {/* Customer & Service Info */}
                            <div className="flex items-start gap-4 mb-6">
                                <div className={`w-14 h-14 rounded-2xl ${booking.avatarColor} flex items-center justify-center text-xl font-black shadow-sm group-hover:scale-105 transition-transform shrink-0`}>
                                    {booking.customer.charAt(0)}
                                </div>
                                <div className="min-w-0">
                                    <h3 className="text-lg font-black text-gray-900 leading-tight mb-1 truncate">{booking.service}</h3>
                                    <div className="flex items-center gap-1.5 text-sm font-bold text-gray-500 truncate">
                                        <User className="w-3.5 h-3.5 shrink-0" /> {booking.customer}
                                    </div>
                                </div>
                            </div>

                            {/* Details Grid */}
                            <div className="grid grid-cols-2 gap-y-4 gap-x-2 py-5 border-y border-dashed border-gray-100 mb-6 flex-1">
                                <div>
                                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Date & Time</p>
                                    <div className="flex items-center gap-1.5 text-sm font-bold text-gray-800">
                                        <Clock className="w-3.5 h-3.5 text-[#5cb85c]" />
                                        {booking.date}
                                    </div>
                                    <p className="text-xs font-medium text-gray-400 pl-5">{booking.time}</p>
                                </div>
                                <div>
                                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Assigned To</p>
                                    <div className="text-sm font-bold text-gray-800 truncate">
                                        {booking.priest}
                                    </div>
                                    {booking.priest === "Unassigned" && booking.status !== "Cancelled" && (
                                        <button className="text-[10px] font-bold text-[#5cb85c] hover:underline">
                                            + Assign Priest
                                        </button>
                                    )}
                                </div>
                            </div>

                            {/* Footer Location & Amount */}
                            <div className="flex items-center justify-between mb-6">
                                <div className="flex items-center gap-1.5 text-gray-500 text-xs font-bold min-w-0">
                                    <MapPin className="w-3.5 h-3.5 shrink-0" />
                                    <span className="truncate">{booking.location}</span>
                                </div>
                                <div className="flex items-center gap-1 bg-gray-50 px-3 py-1.5 rounded-xl shrink-0">
                                    <Banknote className="w-4 h-4 text-gray-400" />
                                    <span className="font-black text-gray-900">{booking.amount}</span>
                                </div>
                            </div>

                            {/* Action Buttons (Always Visible) */}
                            <div className="flex items-center gap-3">
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
                                        className={`p-3 rounded-xl transition-colors ${openDropdownId === booking.id ? 'bg-gray-200 text-gray-900' : 'bg-gray-100 hover:bg-gray-200 text-gray-700'}`}
                                    >
                                        <MoreHorizontal className="w-5 h-5" />
                                    </button>

                                    {openDropdownId === booking.id && (
                                        <div className="absolute right-0 bottom-full mb-2 w-48 bg-white rounded-2xl shadow-xl border border-gray-100 p-2 z-20 animate-in fade-in zoom-in-95 duration-200">
                                            <div className="fixed inset-0 z-10" onClick={() => setOpenDropdownId(null)}></div>
                                            <div className="relative z-20 space-y-1">
                                                <button
                                                    onClick={() => { setSelectedBooking(booking); setIsViewModalOpen(true); setOpenDropdownId(null); }}
                                                    className="w-full text-left px-3 py-2 rounded-xl text-xs font-bold text-gray-600 hover:bg-gray-50 flex items-center gap-2"
                                                >
                                                    <Eye className="w-3.5 h-3.5" /> View Details
                                                </button>

                                                {booking.status === "Pending" && (
                                                    <button
                                                        onClick={() => handleStatusChange(booking.id, "Confirmed")}
                                                        className="w-full text-left px-3 py-2 rounded-xl text-xs font-bold text-emerald-600 hover:bg-emerald-50 flex items-center gap-2"
                                                    >
                                                        <ThumbsUp className="w-3.5 h-3.5" /> Confirm Request
                                                    </button>
                                                )}

                                                {booking.status !== "Completed" && booking.status !== "Cancelled" && (
                                                    <button
                                                        onClick={() => handleStatusChange(booking.id, "Completed")}
                                                        className="w-full text-left px-3 py-2 rounded-xl text-xs font-bold text-blue-600 hover:bg-blue-50 flex items-center gap-2"
                                                    >
                                                        <CheckCircle className="w-3.5 h-3.5" /> Mark Completed
                                                    </button>
                                                )}

                                                {booking.status !== "Cancelled" && (
                                                    <button
                                                        onClick={() => handleStatusChange(booking.id, "Cancelled")}
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

            {/* Create Booking Modal */}
            {isCreateModalOpen && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200" onClick={() => setIsCreateModalOpen(false)}></div>
                    <div className="relative bg-white rounded-[2.5rem] w-full max-w-lg overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200">
                        <div className="p-8">
                            <div className="flex justify-between items-center mb-8">
                                <div>
                                    <h2 className="text-2xl font-black text-gray-900">Create Booking</h2>
                                    <p className="text-sm font-medium text-gray-500">Add a new service appointment</p>
                                </div>
                                <button
                                    onClick={() => setIsCreateModalOpen(false)}
                                    className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                                >
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
                                        value={newBooking.customer}
                                        onChange={(e) => setNewBooking({ ...newBooking, customer: e.target.value })}
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-gray-400 uppercase tracking-wider pl-1">Service *</label>
                                    <div className="relative">
                                        <select
                                            required
                                            className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-5 py-4 font-bold text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#1a5d1a]/20 transition-all appearance-none cursor-pointer"
                                            value={newBooking.service}
                                            onChange={(e) => setNewBooking({ ...newBooking, service: e.target.value })}
                                        >
                                            <option value="">Select Service</option>
                                            {homamServices.map((s, i) => (
                                                <option key={i} value={s.title}>{s.title}</option>
                                            ))}
                                            {virtualServices.map((s, i) => (
                                                <option key={`v-${i}`} value={s.title}>{s.title} (Virtual)</option>
                                            ))}
                                        </select>
                                        <ChevronDown className="absolute right-5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-gray-400 uppercase tracking-wider pl-1">Date *</label>
                                        <input
                                            type="text"
                                            required
                                            className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-5 py-4 font-bold text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#1a5d1a]/20 transition-all"
                                            placeholder="e.g. Feb 20, 2024"
                                            value={newBooking.date}
                                            onChange={(e) => setNewBooking({ ...newBooking, date: e.target.value })}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-gray-400 uppercase tracking-wider pl-1">Time *</label>
                                        <input
                                            type="text"
                                            required
                                            className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-5 py-4 font-bold text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#1a5d1a]/20 transition-all"
                                            placeholder="e.g. 10:00 AM"
                                            value={newBooking.time}
                                            onChange={(e) => setNewBooking({ ...newBooking, time: e.target.value })}
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
                                    <label className="text-xs font-bold text-gray-400 uppercase tracking-wider pl-1">Amount *</label>
                                    <input
                                        type="text"
                                        required
                                        className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-5 py-4 font-bold text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#1a5d1a]/20 transition-all"
                                        placeholder="e.g. ₹5,000"
                                        value={newBooking.amount}
                                        onChange={(e) => setNewBooking({ ...newBooking, amount: e.target.value })}
                                    />
                                </div>

                                <button
                                    type="submit"
                                    className="w-full bg-[#1a5d1a] text-white py-4 rounded-2xl font-bold text-lg shadow-xl shadow-green-900/20 hover:shadow-2xl hover:shadow-green-900/30 hover:-translate-y-0.5 transition-all mt-4 active:scale-95"
                                >
                                    Create Booking
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            )}

            {/* View Details Modal */}
            {isViewModalOpen && selectedBooking && (
                <div className="fixed inset-0 z-[65] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200" onClick={() => setIsViewModalOpen(false)}></div>
                    <div className="relative bg-white rounded-[2.5rem] w-full max-w-lg overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200 flex flex-col max-h-[90vh]">
                        <div className="p-8 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                            <div>
                                <h2 className="text-xl font-black text-gray-900">Booking Details</h2>
                                <p className="text-sm font-medium text-gray-500">#{selectedBooking.id}</p>
                            </div>
                            <button
                                onClick={() => setIsViewModalOpen(false)}
                                className="p-2 hover:bg-gray-200 rounded-full transition-colors"
                            >
                                <X className="w-5 h-5 text-gray-500" />
                            </button>
                        </div>

                        <div className="p-8 space-y-6 overflow-y-auto">
                            {/* Header Info */}
                            <div className="flex items-center gap-4">
                                <div className={`w-16 h-16 rounded-3xl ${selectedBooking.avatarColor} flex items-center justify-center text-2xl font-black`}>
                                    {selectedBooking.customer.charAt(0)}
                                </div>
                                <div>
                                    <h3 className="text-2xl font-black text-gray-900 leading-tight">{selectedBooking.customer}</h3>
                                    <div className="flex items-center gap-2 mt-1">
                                        <span className={`px-2 py-1 rounded-lg text-xs font-bold border ${selectedBooking.status === 'Confirmed' ? 'bg-green-50 text-green-700 border-green-100' :
                                            selectedBooking.status === 'Pending' ? 'bg-yellow-50 text-yellow-700 border-yellow-100' :
                                                selectedBooking.status === 'Completed' ? 'bg-blue-50 text-blue-700 border-blue-100' :
                                                    selectedBooking.status === 'Cancelled' ? 'bg-red-50 text-red-700 border-red-100' :
                                                        'bg-gray-50 text-gray-600 border-gray-100'
                                            }`}>
                                            {selectedBooking.status}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100">
                                    <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Service</p>
                                    <p className="text-lg font-black text-gray-900">{selectedBooking.service}</p>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100">
                                        <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Date</p>
                                        <div className="flex items-center gap-2 font-bold text-gray-900">
                                            <CalendarDays className="w-4 h-4 text-gray-400" /> {selectedBooking.date}
                                        </div>
                                    </div>
                                    <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100">
                                        <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Time</p>
                                        <div className="flex items-center gap-2 font-bold text-gray-900">
                                            <Clock className="w-4 h-4 text-gray-400" /> {selectedBooking.time}
                                        </div>
                                    </div>
                                </div>

                                <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100">
                                    <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Location</p>
                                    <div className="flex items-center gap-2 font-bold text-gray-900">
                                        <MapPin className="w-4 h-4 text-gray-400" /> {selectedBooking.location || "N/A"}
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100">
                                        <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Priest</p>
                                        <div className="flex items-center gap-2 font-bold text-gray-900">
                                            <User className="w-4 h-4 text-gray-400" /> {selectedBooking.priest}
                                        </div>
                                    </div>
                                    <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100">
                                        <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Amount</p>
                                        <div className="flex items-center gap-2 font-bold text-gray-900">
                                            <Banknote className="w-4 h-4 text-gray-400" /> {selectedBooking.amount}
                                        </div>
                                    </div>
                                </div>

                                <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100">
                                    <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Notes</p>
                                    <p className="text-sm font-medium text-gray-600 leading-relaxed">{selectedBooking.notes || "No additional notes provided."}</p>
                                </div>
                            </div>
                        </div>

                        <div className="p-6 border-t border-gray-100 bg-gray-50/50 flex gap-3">
                            <button
                                onClick={() => setIsViewModalOpen(false)}
                                className="w-full py-3 bg-white border border-gray-200 text-gray-700 rounded-xl font-bold hover:bg-gray-50 transition-colors"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Toaster */}
            {toast.visible && (
                <div className="fixed bottom-8 right-8 bg-gray-900 text-white px-6 py-4 rounded-2xl shadow-2xl font-bold text-sm z-[100] animate-in slide-in-from-bottom-5 fade-in duration-300 flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-green-400" />
                    {toast.message}
                </div>
            )}
        </div>
    );
}