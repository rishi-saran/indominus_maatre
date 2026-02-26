"use client";

import { useState } from "react";
import { UserPlus, Search, Filter, MoreHorizontal, Check, X, MapPin, Star, Phone, Mail, GraduationCap, Trash2, Edit, Eye } from "lucide-react";
import { toast } from "sonner";

import { useEffect } from "react";
import { AdminPriestsService, AdminPriest } from "@/lib/services/priests.service";
// Helper to get admin JWT token (use the same key as the rest of the admin app)
function getAdminToken() {
    if (typeof window !== "undefined") {
        return localStorage.getItem("adminToken") || "";
    }
    return "";
}
import { supabase } from "@/lib/supabase/client";
import { AdminOnboardingService, AdminOnboardingRequest } from "@/lib/services/admin-onboarding.service";

export default function PriestsPage() {
    const [priests, setPriests] = useState<AdminPriest[]>([]);
    const [pendingAdmins, setPendingAdmins] = useState<AdminOnboardingRequest[]>([]);
    const [totalPriests, setTotalPriests] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [activeTab, setActiveTab] = useState("all");
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
    const [selectedPriest, setSelectedPriest] = useState<any>(null);
    const [isSortOpen, setIsSortOpen] = useState(false);
    const [sortOption, setSortOption] = useState('Newest');
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [filters, setFilters] = useState({
        location: [] as string[],
        status: [] as string[]
    });

    // Edit State
    const [isEditing, setIsEditing] = useState(false);
    const [editForm, setEditForm] = useState<any>(null);

    // New Priest Form State
    const [newAdmin, setNewAdmin] = useState({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        password: "",
        retypePassword: ""
    });

    // --- Fetch Priests ---
    useEffect(() => {
        setLoading(true);
        setError(null);
        AdminPriestsService.list({
            limit: 20,
            offset: 0,
            search: searchTerm,
            status: filters.status[0],
            location: filters.location[0],
        })
            .then((res) => {
                setPriests(res.priests);
                setTotalPriests(res.total);
            })
            .catch((err) => {
                setError("Failed to load priests");
            })
            .finally(() => setLoading(false));
    }, [searchTerm, filters]);

    const handleEditProfile = () => {
        setEditForm(selectedPriest);
        setIsEditing(true);
    };

    const API_BASE = "http://localhost:8000/api/v1/admin/priests";

    const handleSaveProfile = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const token = getAdminToken();
            const res = await fetch(`${API_BASE}/${editForm.id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    ...(token ? { Authorization: `Bearer ${token}` } : {}),
                },
                body: JSON.stringify({
                    first_name: editForm.first_name,
                    last_name: editForm.last_name,
                    email: editForm.email,
                    phone: editForm.phone,
                    is_active: editForm.is_active,
                }),
            });
            if (!res.ok) {
                let errMsg = "Failed to update priest";
                try {
                    const err = await res.json();
                    errMsg = err.message || errMsg;
                } catch {
                    errMsg = `Server error: ${res.status}`;
                }
                throw new Error(errMsg);
            }
            setPriests(priests.map(p => p.id === editForm.id ? { ...p, ...editForm } : p));
            setSelectedPriest({ ...selectedPriest, ...editForm });
            setIsEditing(false);
            toast.success("Priest profile updated successfully");
        } catch (err: any) {
            toast.error(err.message || "Failed to update priest");
        }
    };

    const handleDeletePriest = async (id: string) => {
        try {
            const token = getAdminToken();
            const res = await fetch(`${API_BASE}/${id}`, {
                method: "DELETE",
                headers: {
                    ...(token ? { Authorization: `Bearer ${token}` } : {}),
                },
            });
            if (!res.ok) {
                let errMsg = "Failed to delete priest";
                try {
                    const err = await res.json();
                    errMsg = err.message || errMsg;
                } catch {
                    errMsg = `Server error: ${res.status}`;
                }
                throw new Error(errMsg);
            }
            setPriests(priests.filter(p => p.id !== id));
            setSelectedPriest(null);
            toast.success("Priest deleted successfully");
        } catch (err: any) {
            toast.error(err.message || "Failed to delete priest");
        }
    };

    const handleCreateAdmin = () => {
        if (!newAdmin.firstName || !newAdmin.lastName || !newAdmin.email || !newAdmin.password || !newAdmin.retypePassword) {
            toast.error("Please fill in all required fields");
            return;
        }
        if (newAdmin.password !== newAdmin.retypePassword) {
            toast.error("Passwords do not match");
            return;
        }
        toast.success("Priest account created (mock)");
        setActiveTab("all");
        setNewAdmin({ firstName: "", lastName: "", email: "", phone: "", password: "", retypePassword: "" });
    };

    const fetchPendingAdmins = async () => {
        try {
            const data = await AdminOnboardingService.list();
            setPendingAdmins(data);
        } catch (err) {
            setPendingAdmins([]);
        }
    };

    useEffect(() => {
        if (activeTab === "onboarding") {
            fetchPendingAdmins();
        }
    }, [activeTab]);

    const handleApproveAdmin = async (id: string) => {
        try {
            await AdminOnboardingService.approve(id);
            toast.success("Admin approved and created.");
            fetchPendingAdmins();
        } catch (err: any) {
            toast.error(err?.message || "Failed to approve admin");
        }
    };

    const handleRejectAdmin = async (id: string) => {
        try {
            await AdminOnboardingService.reject(id);
            toast.success("Admin onboarding request rejected.");
            fetchPendingAdmins();
        } catch (err: any) {
            toast.error(err?.message || "Failed to reject admin");
        }
    };

    const toggleFilter = (type: 'location' | 'status', value: string) => {
        setFilters(prev => {
            const current = prev[type];
            const updated = current.includes(value)
                ? current.filter(item => item !== value)
                : [...current, value];
            return { ...prev, [type]: updated };
        });
    };

    const filteredPriests = priests;

    return (
        <div className="space-y-8 font-sans">
            {loading && (
                <div className="text-center py-20 text-gray-400">Loading priests...</div>
            )}
            {error && (
                <div className="text-center py-20 text-red-500">{error}</div>
            )}

            {/* Page Header */}
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                <button
                    onClick={() => setActiveTab("add")}
                    className="group inline-flex items-center justify-center px-6 py-2.5 bg-[#1a5d1a] text-white rounded-full font-bold text-sm hover:bg-[#144414] transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5"
                >
                    <UserPlus className="w-4 h-4 mr-2 group-hover:scale-110 transition-transform" />
                    Add New Priest
                </button>
            </div>

            {/* Navigation Tabs */}
            <div className="flex items-center gap-2 mb-4">
                {[
                    { id: "all", label: "All Priests" },
                    { id: "onboarding", label: "Onboarding", count: pendingAdmins.length },
                    { id: "add", label: "Register New" }
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
                        {tab.count !== undefined && (
                            <span className={`ml-2 px-2 py-0.5 rounded-full text-[10px] ${activeTab === tab.id ? "bg-white text-black" : "bg-gray-100 text-gray-600"
                                }`}>
                                {tab.count}
                            </span>
                        )}
                    </button>
                ))}
            </div>

            {/* ── ALL PRIESTS TAB ── */}
            {activeTab === "all" && (
                <div className="space-y-6">
                    {/* Filters & Search Toolbar */}
                    <div className="relative z-30 bg-white/80 backdrop-blur-xl p-2 rounded-[2.5rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-white/40 flex flex-col sm:flex-row items-center gap-2 mb-8">
                        {/* Search Input */}
                        <div className="relative flex-1 w-full group">
                            <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
                                <Search className="h-5 w-5 text-gray-400 group-focus-within:text-[#5cb85c] transition-colors" />
                            </div>
                            <input
                                type="text"
                                className="block w-full pl-12 pr-4 py-4 bg-transparent text-gray-900 placeholder-gray-400 font-medium focus:outline-none text-base"
                                placeholder="Search network..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>

                        <div className="hidden sm:block w-px h-8 bg-gray-200 mx-2"></div>

                        {/* Action Buttons */}
                        <div className="flex items-center gap-2 w-full sm:w-auto pr-2 relative z-20">
                            {/* Filter Button */}
                            <div className="relative">
                                <button
                                    onClick={() => setIsFilterOpen(!isFilterOpen)}
                                    className={`flex items-center gap-2 px-5 py-3.5 text-sm font-bold rounded-[2rem] transition-all hover:scale-105 active:scale-95 ${isFilterOpen ? 'bg-[#1a5d1a] text-white shadow-lg shadow-green-900/20' : 'bg-gray-100/50 hover:bg-gray-100 text-gray-700'}`}
                                >
                                    <Filter className="w-4 h-4" />
                                    <span className="hidden sm:inline">Filters</span>
                                </button>
                                {isFilterOpen && (
                                    <>
                                        <div className="fixed inset-0 z-10" onClick={() => setIsFilterOpen(false)} />
                                        <div className="absolute right-0 top-full mt-2 w-64 bg-white rounded-2xl shadow-xl border border-gray-100 p-4 z-20 animate-in fade-in zoom-in-95 duration-200">
                                            <div className="space-y-4">
                                                <div>
                                                    <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Location</h4>
                                                    {['Mumbai', 'Delhi', 'Chennai', 'Pune'].map(loc => (
                                                        <label key={loc} className="flex items-center gap-2 p-2 hover:bg-gray-50 rounded-lg cursor-pointer">
                                                            <input
                                                                type="checkbox"
                                                                className="rounded text-[#1a5d1a] focus:ring-[#1a5d1a]"
                                                                checked={filters.location.includes(loc)}
                                                                onChange={() => toggleFilter('location', loc)}
                                                            />
                                                            <span className="text-sm font-medium text-gray-700">{loc}</span>
                                                        </label>
                                                    ))}
                                                </div>
                                                <div className="h-px bg-gray-100"></div>
                                                <div>
                                                    <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Status</h4>
                                                    {['Active', 'Away'].map(status => (
                                                        <label key={status} className="flex items-center gap-2 p-2 hover:bg-gray-50 rounded-lg cursor-pointer">
                                                            <input
                                                                type="checkbox"
                                                                className="rounded text-[#1a5d1a] focus:ring-[#1a5d1a]"
                                                                checked={filters.status.includes(status)}
                                                                onChange={() => toggleFilter('status', status)}
                                                            />
                                                            <span className="text-sm font-medium text-gray-700">{status}</span>
                                                        </label>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    </>
                                )}
                            </div>

                            {/* Sort Button */}
                            <div className="relative">
                                <button
                                    onClick={() => setIsSortOpen(!isSortOpen)}
                                    className={`flex items-center gap-2 px-5 py-3.5 text-sm font-bold rounded-[2rem] transition-all hover:scale-105 active:scale-95 ${isSortOpen ? 'bg-[#1a5d1a] text-white shadow-lg shadow-green-900/20' : 'bg-gray-100/50 hover:bg-gray-100 text-gray-700'}`}
                                >
                                    <span>Sort: {sortOption}</span>
                                    <MoreHorizontal className={`w-4 h-4 transition-transform duration-300 ${isSortOpen ? 'rotate-180' : 'rotate-90'}`} />
                                </button>
                                {isSortOpen && (
                                    <>
                                        <div className="fixed inset-0 z-10" onClick={() => setIsSortOpen(false)} />
                                        <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-2xl shadow-xl border border-gray-100 p-1 z-20 animate-in fade-in zoom-in-95 duration-200">
                                            {['Newest', 'Name: A-Z', 'Name: Z-A', 'Rating: High to Low', 'Experience'].map((option) => (
                                                <button
                                                    key={option}
                                                    onClick={() => { setSortOption(option); setIsSortOpen(false); }}
                                                    className={`w-full text-left px-3 py-2.5 rounded-xl text-xs font-bold transition-colors flex items-center justify-between
                                                        ${sortOption === option ? 'bg-[#1a5d1a]/10 text-[#1a5d1a]' : 'text-gray-600 hover:bg-gray-50'}`}
                                                >
                                                    {option}
                                                    {sortOption === option && <Check className="w-4 h-4" />}
                                                </button>
                                            ))}
                                        </div>
                                    </>
                                )}
                            </div>

                            {/* View Toggle */}
                            <div className="hidden sm:flex items-center gap-1 bg-gray-100/50 p-1.5 rounded-[2rem] ml-2">
                                <button
                                    onClick={() => setViewMode('grid')}
                                    className={`p-2 rounded-full transition-all duration-300 ${viewMode === 'grid' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-400 hover:text-gray-600 hover:bg-white/50'}`}
                                >
                                    <div className="w-4 h-4 grid grid-cols-2 gap-0.5">
                                        <div className="bg-current rounded-[1px]"></div><div className="bg-current rounded-[1px]"></div>
                                        <div className="bg-current rounded-[1px]"></div><div className="bg-current rounded-[1px]"></div>
                                    </div>
                                </button>
                                <button
                                    onClick={() => setViewMode('list')}
                                    className={`p-2 rounded-full transition-all duration-300 ${viewMode === 'list' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-400 hover:text-gray-600 hover:bg-white/50'}`}
                                >
                                    <div className="w-4 h-4 flex flex-col gap-0.5">
                                        <div className="h-1 bg-current rounded-[1px] w-full"></div>
                                        <div className="h-1 bg-current rounded-[1px] w-full"></div>
                                        <div className="h-1 bg-current rounded-[1px] w-full"></div>
                                    </div>
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Priest Cards Grid/List */}
                    <div className={viewMode === 'grid' ? "grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6" : "space-y-4"}>
                        {(filteredPriests || []).map((priest) => (
                            <div key={priest.id} className={`group relative bg-white rounded-[2rem] border border-gray-100 hover:border-gray-200 shadow-[0_2px_20px_rgba(0,0,0,0.02)] hover:shadow-[0_20px_40px_rgba(0,0,0,0.08)] transition-all duration-300 hover:-translate-y-1 ${viewMode === 'list' ? 'p-4 flex items-center justify-between gap-6' : 'p-6'}`}>

                                {/* Grid View */}
                                {viewMode === 'grid' && (
                                    <>
                                        <div className="flex items-start gap-5 mb-6">
                                            <div className="w-20 h-20 rounded-2xl bg-gray-100 text-gray-600 flex items-center justify-center text-2xl font-black shadow-inner">
                                                {priest.name.charAt(0)}
                                            </div>
                                            <div className="pt-1">
                                                <h3 className="text-lg font-bold text-gray-900 leading-tight mb-1">{priest.name}</h3>
                                                <div className="flex items-center gap-1.5 text-xs font-medium text-gray-500 mb-2">
                                                    <MapPin className="w-3 h-3 text-gray-400" />
                                                    {priest.location}
                                                </div>
                                                <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wide border ${priest.status === 'Active'
                                                    ? 'bg-green-50 text-green-700 border-green-100'
                                                    : 'bg-gray-50 text-gray-600 border-gray-100'
                                                    }`}>
                                                    <div className={`w-1.5 h-1.5 rounded-full mr-1.5 ${priest.status === 'Active' ? 'bg-green-500' : 'bg-gray-400'}`}></div>
                                                    {priest.status}
                                                </span>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-2 gap-4 mb-6 py-4 border-y border-gray-50">
                                            <div className="flex items-center gap-3">
                                                <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg">
                                                    <GraduationCap className="w-4 h-4" />
                                                </div>
                                                <div>
                                                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Expertise</p>
                                                    <p className="text-sm font-bold text-gray-800">{priest.specialty}</p>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-3">
                                                <div className="p-2 bg-amber-50 text-amber-600 rounded-lg">
                                                    <Star className="w-4 h-4" />
                                                </div>
                                                <div>
                                                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Rating</p>
                                                    <p className="text-sm font-bold text-gray-800">{priest.rating} <span className="text-gray-400 font-normal">/ 5.0</span></p>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="space-y-3">
                                            <div className="flex items-center gap-3 text-sm text-gray-500 hover:text-gray-800 transition-colors cursor-pointer group/item">
                                                <div className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center group-hover/item:bg-gray-100 transition-colors">
                                                    <Mail className="w-4 h-4" />
                                                </div>
                                                <span className="truncate flex-1">{priest.email}</span>
                                            </div>
                                            <div className="flex items-center gap-3 text-sm text-gray-500 hover:text-gray-800 transition-colors cursor-pointer group/item">
                                                <div className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center group-hover/item:bg-gray-100 transition-colors">
                                                    <Phone className="w-4 h-4" />
                                                </div>
                                                <span>{priest.phone}</span>
                                            </div>
                                            <button
                                                onClick={() => { setSelectedPriest(priest); setIsEditing(false); }}
                                                className="w-full mt-4 py-3 rounded-xl bg-[#1a5d1a] border border-[#1a5d1a] text-white font-black text-xs hover:bg-[#144414] hover:border-[#144414] transition-all shadow-sm uppercase tracking-wide">
                                                View Full Profile
                                            </button>
                                        </div>
                                    </>
                                )}

                                {/* List View */}
                                {viewMode === 'list' && (
                                    <>
                                        <div className="flex items-center gap-6 flex-1">
                                            <div className="w-16 h-16 rounded-2xl bg-gray-100 text-gray-600 flex items-center justify-center text-xl font-black shadow-inner">
                                                {priest.name.charAt(0)}
                                            </div>
                                            <div>
                                                <h3 className="text-base font-bold text-gray-900 leading-tight mb-1">{priest.name}</h3>
                                                <div className="flex items-center gap-3 text-xs">
                                                    <div className="flex items-center gap-1 font-medium text-gray-500">
                                                        <MapPin className="w-3 h-3 text-gray-400" />
                                                        {priest.location}
                                                    </div>
                                                    <span className="text-gray-300">•</span>
                                                    <span className="text-gray-600 font-semibold">{priest.specialty}</span>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="hidden md:flex items-center gap-8">
                                            <div className="text-right">
                                                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Rating</p>
                                                <div className="flex items-center gap-1 justify-end">
                                                    <Star className="w-3 h-3 text-amber-500 fill-amber-500" />
                                                    <span className="text-sm font-bold text-gray-900">{priest.rating}</span>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Status</p>
                                                <div className={`inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wide border ${priest.status === 'Active'
                                                    ? 'bg-green-50 text-green-700 border-green-100'
                                                    : 'bg-gray-50 text-gray-600 border-gray-100'
                                                    }`}>
                                                    <div className={`w-1.5 h-1.5 rounded-full mr-1.5 ${priest.status === 'Active' ? 'bg-green-500' : 'bg-gray-400'}`}></div>
                                                    {priest.status}
                                                </div>
                                            </div>
                                        </div>

                                        <button
                                            onClick={() => { setSelectedPriest(priest); setIsEditing(false); }}
                                            className="px-4 py-2.5 rounded-xl bg-[#1a5d1a] border border-[#1a5d1a] text-white font-black text-[10px] hover:bg-[#144414] hover:border-[#144414] transition-all shadow-sm uppercase tracking-wide whitespace-nowrap">
                                            View Profile
                                        </button>
                                    </>
                                )}
                            </div>
                        ))}
                    </div>

                    {/* Priest Detail Modal */}
                    {selectedPriest && (
                        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                            <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => { setSelectedPriest(null); setIsEditing(false); }}></div>
                            <div className="relative bg-white rounded-[2.5rem] w-full max-w-lg max-h-[90vh] overflow-y-auto shadow-2xl animate-in fade-in zoom-in-95 duration-300">

                                {/* Header / Cover */}
                                <div className="h-32 bg-gray-100 relative sticky top-0 z-10">
                                    <button
                                        onClick={() => { setSelectedPriest(null); setIsEditing(false); }}
                                        className="absolute top-4 right-4 p-2 bg-white/60 hover:bg-white/80 text-gray-900 rounded-full transition-colors backdrop-blur-md shadow-sm border border-white/40"
                                    >
                                        <X className="w-5 h-5" />
                                    </button>
                                </div>

                                {/* Content */}
                                <div className="px-8 pb-8 -mt-12 relative z-20">
                                    <div className="flex justify-between items-end mb-6">
                                        <div className="w-24 h-24 rounded-[2rem] bg-gray-100 text-gray-600 flex items-center justify-center text-3xl font-black shadow-lg border-4 border-white">
                                            {selectedPriest.name.charAt(0)}
                                        </div>
                                        <div className="mb-2">
                                            <span className={`inline-flex items-center px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide border ${selectedPriest.status === 'Active'
                                                ? 'bg-green-50 text-green-700 border-green-100'
                                                : 'bg-gray-50 text-gray-600 border-gray-100'
                                                }`}>
                                                <div className={`w-1.5 h-1.5 rounded-full mr-1.5 ${selectedPriest.status === 'Active' ? 'bg-green-500' : 'bg-gray-400'}`}></div>
                                                {selectedPriest.status}
                                            </span>
                                        </div>
                                    </div>

                                    {/* VIEW MODE */}
                                    {!isEditing ? (
                                        <div className="space-y-6">
                                            <div>
                                                <h2 className="text-2xl font-black text-gray-900 leading-tight mb-1">{selectedPriest.name}</h2>
                                                <div className="flex items-center gap-2 text-sm font-medium text-gray-500">
                                                    <MapPin className="w-4 h-4 text-gray-400" />
                                                    {selectedPriest.location}
                                                </div>
                                            </div>

                                            <div className="grid grid-cols-2 gap-4">
                                                <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100">
                                                    <div className="flex items-center gap-3 mb-2">
                                                        <div className="p-2 bg-indigo-100 text-indigo-600 rounded-lg">
                                                            <GraduationCap className="w-4 h-4" />
                                                        </div>
                                                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Expertise</span>
                                                    </div>
                                                    <p className="text-sm font-bold text-gray-900">{selectedPriest.specialty}</p>
                                                </div>
                                                <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100">
                                                    <div className="flex items-center gap-3 mb-2">
                                                        <div className="p-2 bg-amber-100 text-amber-600 rounded-lg">
                                                            <Star className="w-4 h-4" />
                                                        </div>
                                                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Rating</span>
                                                    </div>
                                                    <p className="text-sm font-bold text-gray-900">{selectedPriest.rating} <span className="text-gray-400 font-medium">/ 5.0</span></p>
                                                </div>
                                            </div>

                                            <div className="space-y-4">
                                                <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider">Contact Information</h3>
                                                <div className="space-y-3">
                                                    <div className="flex items-center gap-4 p-4 rounded-2xl border border-gray-100 bg-white hover:border-gray-200 transition-colors group cursor-pointer">
                                                        <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 group-hover:bg-[#1a5d1a] group-hover:text-white transition-all">
                                                            <Mail className="w-5 h-5" />
                                                        </div>
                                                        <div>
                                                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-0.5">Email Address</p>
                                                            <p className="text-sm font-bold text-gray-900">{selectedPriest.email}</p>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center gap-4 p-4 rounded-2xl border border-gray-100 bg-white hover:border-gray-200 transition-colors group cursor-pointer">
                                                        <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 group-hover:bg-[#1a5d1a] group-hover:text-white transition-all">
                                                            <Phone className="w-5 h-5" />
                                                        </div>
                                                        <div>
                                                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-0.5">Phone Number</p>
                                                            <p className="text-sm font-bold text-gray-900">{selectedPriest.phone}</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="pt-4 border-t border-gray-100 flex gap-3">
                                                <button
                                                    onClick={handleEditProfile}
                                                    className="w-full py-3.5 rounded-xl border border-[#1a5d1a] text-[#1a5d1a] font-bold text-sm hover:bg-[#1a5d1a] hover:text-white transition-all">
                                                    Edit Profile
                                                </button>
                                                <button
                                                    onClick={() => handleDeletePriest(selectedPriest.id)}
                                                    className="w-full py-3.5 rounded-xl border border-red-500 text-red-500 font-bold text-sm hover:bg-red-500 hover:text-white transition-all">
                                                    Delete Priest
                                                </button>
                                            </div>
                                        </div>
                                    ) : (
                                        /* EDIT MODE */
                                        <div className="space-y-6">
                                            <h2 className="text-2xl font-black text-gray-900">Edit Priest Profile</h2>
                                            <form onSubmit={handleSaveProfile} className="space-y-4">
                                                <input
                                                    type="text"
                                                    value={editForm?.name || ''}
                                                    onChange={e => setEditForm({ ...editForm, name: e.target.value })}
                                                    placeholder="Full Name"
                                                    className="w-full border rounded-lg p-3"
                                                />
                                                <input
                                                    type="email"
                                                    value={editForm?.email || ''}
                                                    onChange={e => setEditForm({ ...editForm, email: e.target.value })}
                                                    placeholder="Email"
                                                    className="w-full border rounded-lg p-3"
                                                />
                                                <input
                                                    type="text"
                                                    value={editForm?.phone || ''}
                                                    onChange={e => setEditForm({ ...editForm, phone: e.target.value })}
                                                    placeholder="Phone Number"
                                                    className="w-full border rounded-lg p-3"
                                                />
                                                <div className="flex gap-2 pt-2">
                                                    <button type="submit" className="w-full py-3 rounded-xl bg-[#1a5d1a] text-white font-bold">Save</button>
                                                    <button type="button" onClick={() => setIsEditing(false)} className="w-full py-3 rounded-xl bg-gray-200 text-gray-700 font-bold">Cancel</button>
                                                </div>
                                            </form>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            )}

            {/* ── ONBOARDING TAB ── */}
            {activeTab === "onboarding" && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {pendingAdmins.map((admin) => (
                        <div key={admin.id} className="bg-white rounded-[2rem] p-2 border border-yellow-100 mx-auto w-full group hover:shadow-xl hover:shadow-yellow-900/5 transition-all duration-300">
                            <div className="bg-yellow-50/50 rounded-[1.5rem] p-6 h-full flex flex-col">
                                <div className="flex justify-between items-start mb-6">
                                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-yellow-200 to-amber-300 flex items-center justify-center text-yellow-900 font-black text-xl shadow-lg shadow-yellow-500/20">
                                        {admin.first_name.charAt(0)}
                                    </div>
                                    <span className="bg-white/80 backdrop-blur-sm text-yellow-700 text-[10px] font-bold uppercase tracking-wider px-3 py-1.5 rounded-full shadow-sm">
                                        Pending Review
                                    </span>
                                </div>
                                <div className="mb-6">
                                    <h3 className="text-lg font-bold text-gray-900 mb-1">{admin.first_name} {admin.last_name}</h3>
                                    <p className="text-sm font-medium text-gray-500">{admin.email} {admin.phone && <>• {admin.phone}</>}</p>
                                </div>
                                <div className="mt-auto flex gap-3">
                                    <button
                                        onClick={() => handleApproveAdmin(admin.id)}
                                        className="flex-1 bg-[#1a5d1a] text-white py-3 rounded-xl font-bold text-sm hover:bg-[#154a15] hover:shadow-lg hover:shadow-green-900/20 transition-all active:scale-95 flex items-center justify-center gap-2">
                                        <Check className="w-4 h-4" /> Approve
                                    </button>
                                    <button
                                        onClick={() => handleRejectAdmin(admin.id)}
                                        className="w-12 h-12 flex items-center justify-center bg-white text-gray-400 rounded-xl hover:text-red-500 hover:bg-red-50 transition-colors shadow-sm">
                                        <X className="w-5 h-5" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                    {pendingAdmins.length === 0 && (
                        <div className="col-span-full text-center py-20 text-gray-400">
                            No pending onboarding requests.
                        </div>
                    )}
                </div>
            )}

            {/* ── ADD / REGISTER TAB ── */}
            {activeTab === "add" && (
                <div className="max-w-3xl mx-auto bg-white rounded-[2rem] p-8 md:p-12 shadow-[0_10px_40px_rgba(0,0,0,0.03)] border border-gray-100">
                    <div className="text-center mb-10">
                        <div className="w-16 h-16 bg-[#5cb85c]/10 text-[#5cb85c] rounded-2xl flex items-center justify-center mx-auto mb-6">
                            <UserPlus className="w-8 h-8" />
                        </div>
                        <h2 className="text-2xl font-black text-gray-900">Register New Admin</h2>
                        <p className="text-gray-500 mt-2">Create a new admin account. The account will be created only after approval.</p>
                    </div>

                    <form className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider ml-1">First Name <span className="text-red-500">*</span></label>
                                <input
                                    type="text"
                                    value={newAdmin.firstName}
                                    onChange={(e) => setNewAdmin({ ...newAdmin, firstName: e.target.value })}
                                    className="w-full px-5 py-4 bg-gray-50 border-2 border-gray-100 rounded-2xl text-gray-900 font-medium focus:outline-none focus:border-[#5cb85c] focus:bg-white transition-all"
                                    placeholder="e.g. Rahul"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider ml-1">Last Name <span className="text-red-500">*</span></label>
                                <input
                                    type="text"
                                    value={newAdmin.lastName}
                                    onChange={(e) => setNewAdmin({ ...newAdmin, lastName: e.target.value })}
                                    className="w-full px-5 py-4 bg-gray-50 border-2 border-gray-100 rounded-2xl text-gray-900 font-medium focus:outline-none focus:border-[#5cb85c] focus:bg-white transition-all"
                                    placeholder="e.g. Sharma"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-bold text-gray-500 uppercase tracking-wider ml-1">Email Address <span className="text-red-500">*</span></label>
                            <input
                                type="email"
                                value={newAdmin.email}
                                onChange={(e) => setNewAdmin({ ...newAdmin, email: e.target.value })}
                                className="w-full px-5 py-4 bg-gray-50 border-2 border-gray-100 rounded-2xl text-gray-900 font-medium focus:outline-none focus:border-[#5cb85c] focus:bg-white transition-all"
                                placeholder="admin@example.com"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-bold text-gray-500 uppercase tracking-wider ml-1">Phone Number</label>
                            <input
                                type="tel"
                                value={newAdmin.phone}
                                onChange={(e) => setNewAdmin({ ...newAdmin, phone: e.target.value })}
                                className="w-full px-5 py-4 bg-gray-50 border-2 border-gray-100 rounded-2xl text-gray-900 font-medium focus:outline-none focus:border-[#5cb85c] focus:bg-white transition-all"
                                placeholder="+91 98765 43210"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-bold text-gray-500 uppercase tracking-wider ml-1">Password <span className="text-red-500">*</span></label>
                            <input
                                type="password"
                                value={newAdmin.password}
                                onChange={(e) => setNewAdmin({ ...newAdmin, password: e.target.value })}
                                className="w-full px-5 py-4 bg-gray-50 border-2 border-gray-100 rounded-2xl text-gray-900 font-medium focus:outline-none focus:border-[#5cb85c] focus:bg-white transition-all"
                                placeholder="Enter password"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-bold text-gray-500 uppercase tracking-wider ml-1">Retype Password <span className="text-red-500">*</span></label>
                            <input
                                type="password"
                                value={newAdmin.retypePassword}
                                onChange={(e) => setNewAdmin({ ...newAdmin, retypePassword: e.target.value })}
                                className="w-full px-5 py-4 bg-gray-50 border-2 border-gray-100 rounded-2xl text-gray-900 font-medium focus:outline-none focus:border-[#5cb85c] focus:bg-white transition-all"
                                placeholder="Retype password"
                            />
                        </div>

                        <div className="pt-6 flex flex-col md:flex-row justify-end gap-3">
                            <button type="button" onClick={() => setActiveTab('all')} className="px-8 py-4 rounded-xl font-bold text-gray-500 hover:text-gray-900 hover:bg-gray-50 transition-colors">Cancel</button>
                            <button
                                type="button"
                                onClick={handleCreateAdmin}
                                className="px-8 py-4 bg-[#1a5d1a] text-white rounded-xl font-bold hover:bg-[#144414] shadow-lg hover:shadow-green-900/20 active:scale-95 transition-all">
                                Create Priest Account
                            </button>
                        </div>
                    </form>
                </div>
            )}
        </div>
    );
}