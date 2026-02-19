"use client";

import { useState } from "react";
import { UserPlus, Search, Filter, MoreHorizontal, Check, X, MapPin, Star, Phone, Mail, GraduationCap, Trash2, Edit, Eye } from "lucide-react";
import { toast } from "sonner";
// import {
//     DropdownMenu,
//     DropdownMenuContent,
//     DropdownMenuItem,
//     DropdownMenuSeparator,
//     DropdownMenuTrigger,
// } from "@/components/ui/dropdown-menu";

// Mock Data
const initialPriests = [
    {
        id: "PR001",
        name: "Pandit Ravi Shastri",
        email: "ravi.shastri@example.com",
        phone: "+91 98765 43210",
        location: "Mumbai, MH",
        status: "Active",
        rating: 4.9,
        specialty: "Rig Veda",
        experience: "12 Years",
        imageColor: "bg-orange-100 text-orange-600"
    },
    {
        id: "PR002",
        name: "Acharya Amit Mishra",
        email: "amit.mishra@example.com",
        phone: "+91 98765 43211",
        location: "New Delhi, DL",
        status: "Active",
        rating: 4.7,
        specialty: "Yajur Veda",
        experience: "8 Years",
        imageColor: "bg-blue-100 text-blue-600"
    },
    {
        id: "PR003",
        name: "Swami Iyer",
        email: "swami.iyer@example.com",
        phone: "+91 98765 43212",
        location: "Chennai, TN",
        status: "Away",
        rating: 4.8,
        specialty: "Sama Veda",
        experience: "15 Years",
        imageColor: "bg-yellow-100 text-yellow-600"
    },
    {
        id: "PR006",
        name: "Pandit Vikram Joshi",
        email: "vikram.j@example.com",
        phone: "+91 98765 43215",
        location: "Pune, MH",
        status: "Active",
        rating: 4.6,
        specialty: "Atharva Veda",
        experience: "6 Years",
        imageColor: "bg-purple-100 text-purple-600"
    },
];

const initialPendingPriests = [
    { id: "PR004", name: "Guru Sharma", email: "sharma@example.com", location: "Bangalore", applied: "2 days ago", type: "Vedic Scholar" },
    { id: "PR005", name: "Pandit Verma", email: "verma@example.com", location: "Pune", applied: "5 days ago", type: "Purohit" },
];

export default function PriestsPage() {
    const [priests, setPriests] = useState(initialPriests);
    const [pendingPriests, setPendingPriests] = useState(initialPendingPriests);
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
    const [newPriest, setNewPriest] = useState({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        location: "",
        experience: "",
        specialty: ""
    });

    // --- Actions ---

    const handleEditProfile = () => {
        setEditForm(selectedPriest);
        setIsEditing(true);
    };

    const handleSaveProfile = (e: React.FormEvent) => {
        e.preventDefault();
        setPriests(priests.map(p => p.id === editForm.id ? editForm : p));
        setSelectedPriest(editForm);
        setIsEditing(false);
        toast.success("Priest profile updated successfully");
    };

    const handleDeletePriest = (id: string) => {
        setPriests(priests.filter(p => p.id !== id));
        toast.success("Priest removed successfully");
        if (selectedPriest?.id === id) setSelectedPriest(null);
    };

    const handleApprove = (id: string) => {
        const priestToApprove = pendingPriests.find(p => p.id === id);
        if (priestToApprove) {
            const newPriestProfile = {
                id: priestToApprove.id,
                name: priestToApprove.name,
                email: priestToApprove.email,
                phone: "",
                location: priestToApprove.location,
                status: "Active",
                rating: 0,
                specialty: priestToApprove.type,
                experience: "0 Years",
                imageColor: "bg-green-100 text-green-600"
            };
            setPriests([...priests, newPriestProfile]);
            setPendingPriests(pendingPriests.filter(p => p.id !== id));
            toast.success("Priest approved successfully");
        }
    };

    const handleReject = (id: string) => {
        setPendingPriests(pendingPriests.filter(p => p.id !== id));
        toast.success("Priest rejected");
    };

    const handleCreatePriest = () => {
        if (!newPriest.firstName || !newPriest.lastName || !newPriest.email) {
            toast.error("Please fill in all required fields");
            return;
        }

        const newProfile = {
            id: `PR${Date.now()}`,
            name: `${newPriest.firstName} ${newPriest.lastName}`,
            email: newPriest.email,
            phone: newPriest.phone,
            location: newPriest.location,
            status: "Active",
            rating: 0,
            specialty: newPriest.specialty || "General",
            experience: newPriest.experience + " Years",
            imageColor: "bg-emerald-100 text-emerald-600"
        };

        setPriests([...priests, newProfile]);
        toast.success("Priest account created successfully");
        setNewPriest({ firstName: "", lastName: "", email: "", phone: "", location: "", experience: "", specialty: "" });
        setActiveTab("all");
    };

    // --- Filtering & Sorting ---

    const toggleFilter = (type: 'location' | 'status', value: string) => {
        setFilters(prev => {
            const current = prev[type];
            const updated = current.includes(value)
                ? current.filter(item => item !== value)
                : [...current, value];
            return { ...prev, [type]: updated };
        });
    };

    const filteredPriests = priests
        .filter(priest => {
            const matchesSearch = priest.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                priest.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                priest.location.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesLocation = filters.location.length === 0 || filters.location.some(loc => priest.location.includes(loc));
            const matchesStatus = filters.status.length === 0 || filters.status.includes(priest.status);
            return matchesSearch && matchesLocation && matchesStatus;
        })
        .sort((a, b) => {
            if (sortOption === 'Name: A-Z') return a.name.localeCompare(b.name);
            if (sortOption === 'Name: Z-A') return b.name.localeCompare(a.name); // Added Z-A
            if (sortOption === 'Rating: High to Low') return b.rating - a.rating;
            if (sortOption === 'Experience') return parseInt(b.experience) - parseInt(a.experience);
            // Newest/Oldest usually implies creation date, effectively using ID here as proxy or maintaining order
            if (sortOption === 'Newest') return -1;
            return 0;
        });

    return (
        <div className="space-y-8 font-sans">
            {/* Page Header */}
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-black text-gray-900 tracking-tight">Priests</h1>
                    <p className="text-gray-500 font-medium mt-1">Manage your network of spiritual guides.</p>
                </div>
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
                    { id: "onboarding", label: "Onboarding", count: pendingPriests.length },
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
                            <span className={`ml-2 px-2 py-0.5 rounded-full text-[10px] ${activeTab === tab.id ? "bg-white text-black" : "bg-gray-100 text-gray-600 group-hover:bg-gray-200"
                                }`}>
                                {tab.count}
                            </span>
                        )}
                    </button>
                ))}
            </div>

            {/* Main Content Area */}
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

                        {/* Actions Divider */}
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
                                                    onClick={() => {
                                                        setSortOption(option);
                                                        setIsSortOpen(false);
                                                    }}
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
                        {filteredPriests.map((priest) => (
                            <div key={priest.id} className={`group relative bg-white rounded-[2rem] border border-gray-100 hover:border-gray-200 shadow-[0_2px_20px_rgba(0,0,0,0.02)] hover:shadow-[0_20px_40px_rgba(0,0,0,0.08)] transition-all duration-300 hover:-translate-y-1 ${viewMode === 'list' ? 'p-4 flex items-center justify-between gap-6' : 'p-6'}`}>
                                {/* Grid View Structure */}
                                {viewMode === 'grid' && (
                                    <>
                                        {/* Top Actions */}
                                        {/* <div className="absolute top-6 right-6 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                                            <button className="p-2 hover:bg-gray-50 rounded-full text-gray-400 hover:text-gray-600 transition-colors">
                                                <MoreHorizontal className="w-5 h-5" />
                                            </button>
                                        </div> */}

                                        {/* Profile Header */}
                                        <div className="flex items-start gap-5 mb-6">
                                            <div className={`w-20 h-20 rounded-2xl ${priest.imageColor} flex items-center justify-center text-2xl font-black shadow-inner`}>
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

                                        {/* Stats / Info Row */}
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

                                        {/* Contact & Actions */}
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

                                {/* List View Structure */}
                                {viewMode === 'list' && (
                                    <>
                                        <div className="flex items-center gap-6 flex-1">
                                            <div className={`w-16 h-16 rounded-2xl ${priest.imageColor} flex items-center justify-center text-xl font-black shadow-inner bg-opacity-80`}>
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

                                        <div className="flex items-center gap-3">
                                            <button
                                                onClick={() => { setSelectedPriest(priest); setIsEditing(false); }}
                                                className="px-4 py-2.5 rounded-xl bg-[#1a5d1a] border border-[#1a5d1a] text-white font-black text-[10px] hover:bg-[#144414] hover:border-[#144414] transition-all shadow-sm uppercase tracking-wide whitespace-nowrap">
                                                View Profile
                                            </button>

                                            {/* <button className="p-2 hover:bg-gray-50 rounded-full text-gray-400 hover:text-gray-600 transition-colors">
                                                <MoreHorizontal className="w-5 h-5" />
                                            </button> */}
                                        </div>
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
                                <div className={`h-32 ${selectedPriest.imageColor} relative sticky top-0 z-10`}>
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
                                        <div className={`w-24 h-24 rounded-[2rem] ${selectedPriest.imageColor} flex items-center justify-center text-3xl font-black shadow-lg border-4 border-white`}>
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

                                    {!isEditing ? (
                                        // VIEW MODE
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
                                            </div>
                                        </div>
                                    ) : (
                                        // EDIT MODE
                                        <form onSubmit={handleSaveProfile} className="space-y-4">
                                            <div>
                                                <label className="text-xs font-bold text-gray-400 uppercase tracking-wider block mb-2">Full Name</label>
                                                <input
                                                    type="text"
                                                    value={editForm.name}
                                                    onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                                                    className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 font-bold text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#1a5d1a]/20"
                                                />
                                            </div>
                                            <div>
                                                <label className="text-xs font-bold text-gray-400 uppercase tracking-wider block mb-2">Location</label>
                                                <input
                                                    type="text"
                                                    value={editForm.location}
                                                    onChange={(e) => setEditForm({ ...editForm, location: e.target.value })}
                                                    className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 font-bold text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#1a5d1a]/20"
                                                />
                                            </div>
                                            <div className="grid grid-cols-2 gap-4">
                                                <div>
                                                    <label className="text-xs font-bold text-gray-400 uppercase tracking-wider block mb-2">Phone</label>
                                                    <input
                                                        type="text"
                                                        value={editForm.phone}
                                                        onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
                                                        className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 font-bold text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#1a5d1a]/20"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="text-xs font-bold text-gray-400 uppercase tracking-wider block mb-2">Experience</label>
                                                    <input
                                                        type="text"
                                                        value={editForm.experience}
                                                        onChange={(e) => setEditForm({ ...editForm, experience: e.target.value })}
                                                        className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 font-bold text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#1a5d1a]/20"
                                                    />
                                                </div>
                                            </div>
                                            <div>
                                                <label className="text-xs font-bold text-gray-400 uppercase tracking-wider block mb-2">Specialty</label>
                                                <input
                                                    type="text"
                                                    value={editForm.specialty}
                                                    onChange={(e) => setEditForm({ ...editForm, specialty: e.target.value })}
                                                    className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 font-bold text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#1a5d1a]/20"
                                                />
                                            </div>
                                            <div>
                                                <label className="text-xs font-bold text-gray-400 uppercase tracking-wider block mb-2">Status</label>
                                                <select
                                                    value={editForm.status}
                                                    onChange={(e) => setEditForm({ ...editForm, status: e.target.value })}
                                                    className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 font-bold text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#1a5d1a]/20"
                                                >
                                                    <option value="Active">Active</option>
                                                    <option value="Away">Away</option>
                                                </select>
                                            </div>

                                            <div className="pt-4 border-t border-gray-100">
                                                <div className="flex gap-3 mb-3">
                                                    <button
                                                        type="button"
                                                        onClick={() => setIsEditing(false)}
                                                        className="flex-1 py-3 text-sm font-bold text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors"
                                                    >
                                                        Cancel
                                                    </button>
                                                    <button
                                                        type="submit"
                                                        className="flex-1 py-3 text-sm font-bold text-white bg-[#1a5d1a] hover:bg-[#144414] rounded-xl transition-colors shadow-lg shadow-green-900/10"
                                                    >
                                                        Save Changes
                                                    </button>
                                                </div>
                                                <button
                                                    type="button"
                                                    onClick={() => {
                                                        if (confirm('Are you sure you want to delete this priest?')) {
                                                            handleDeletePriest(editForm.id);
                                                            setIsEditing(false); // Close modal implicitly via logic in handleDeletePriest if selectedPriest is cleared
                                                        }
                                                    }}
                                                    className="w-full py-3 text-sm font-bold text-red-500 hover:bg-red-50 rounded-xl transition-colors flex items-center justify-center gap-2"
                                                >
                                                    <Trash2 className="w-4 h-4" /> Delete Priest Account
                                                </button>
                                            </div>
                                        </form>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            )}

            {activeTab === "onboarding" && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {pendingPriests.map((priest) => (
                        <div key={priest.id} className="bg-white rounded-[2rem] p-2 border border-yellow-100 mx-auto w-full group hover:shadow-xl hover:shadow-yellow-900/5 transition-all duration-300">
                            <div className="bg-yellow-50/50 rounded-[1.5rem] p-6 h-full flex flex-col">
                                <div className="flex justify-between items-start mb-6">
                                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-yellow-200 to-amber-300 flex items-center justify-center text-yellow-900 font-black text-xl shadow-lg shadow-yellow-500/20">
                                        {priest.name.charAt(0)}
                                    </div>
                                    <span className="bg-white/80 backdrop-blur-sm text-yellow-700 text-[10px] font-bold uppercase tracking-wider px-3 py-1.5 rounded-full shadow-sm">
                                        Pending Review
                                    </span>
                                </div>
                                <div className="mb-6">
                                    <h3 className="text-lg font-bold text-gray-900 mb-1">{priest.name}</h3>
                                    <p className="text-sm font-medium text-gray-500">{priest.type} • {priest.location}</p>
                                    <p className="text-xs text-gray-400 mt-2">Applied {priest.applied}</p>
                                </div>

                                <div className="mt-auto flex gap-3">
                                    <button
                                        onClick={() => handleApprove(priest.id)}
                                        className="flex-1 bg-[#1a5d1a] text-white py-3 rounded-xl font-bold text-sm hover:bg-[#154a15] hover:shadow-lg hover:shadow-green-900/20 transition-all active:scale-95 flex items-center justify-center gap-2">
                                        <Check className="w-4 h-4" /> Approve
                                    </button>
                                    <button
                                        onClick={() => handleReject(priest.id)}
                                        className="w-12 h-12 flex items-center justify-center bg-white text-gray-400 rounded-xl hover:text-red-500 hover:bg-red-50 transition-colors shadow-sm">
                                        <X className="w-5 h-5" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                    {pendingPriests.length === 0 && (
                        <div className="col-span-full text-center py-20 text-gray-400">
                            No pending onboarding requests.
                        </div>
                    )}
                </div>
            )}

            {activeTab === "add" && (
                <div className="max-w-3xl mx-auto bg-white rounded-[2rem] p-8 md:p-12 shadow-[0_10px_40px_rgba(0,0,0,0.03)] border border-gray-100">
                    <div className="text-center mb-10">
                        <div className="w-16 h-16 bg-[#5cb85c]/10 text-[#5cb85c] rounded-2xl flex items-center justify-center mx-auto mb-6">
                            <UserPlus className="w-8 h-8" />
                        </div>
                        <h2 className="text-2xl font-black text-gray-900">Register New Priest</h2>
                        <p className="text-gray-500 mt-2">Create a new priest account manually. They will receive an email to set their password.</p>
                    </div>

                    <form className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider ml-1">First Name <span className="text-red-500">*</span></label>
                                <input
                                    type="text"
                                    value={newPriest.firstName}
                                    onChange={(e) => setNewPriest({ ...newPriest, firstName: e.target.value })}
                                    className="w-full px-5 py-4 bg-gray-50 border-2 border-gray-100 rounded-2xl text-gray-900 font-medium focus:outline-none focus:border-[#5cb85c] focus:bg-white transition-all"
                                    placeholder="e.g. Rahul"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider ml-1">Last Name <span className="text-red-500">*</span></label>
                                <input
                                    type="text"
                                    value={newPriest.lastName}
                                    onChange={(e) => setNewPriest({ ...newPriest, lastName: e.target.value })}
                                    className="w-full px-5 py-4 bg-gray-50 border-2 border-gray-100 rounded-2xl text-gray-900 font-medium focus:outline-none focus:border-[#5cb85c] focus:bg-white transition-all"
                                    placeholder="e.g. Sharma"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-bold text-gray-500 uppercase tracking-wider ml-1">Email Address <span className="text-red-500">*</span></label>
                            <input
                                type="email"
                                value={newPriest.email}
                                onChange={(e) => setNewPriest({ ...newPriest, email: e.target.value })}
                                className="w-full px-5 py-4 bg-gray-50 border-2 border-gray-100 rounded-2xl text-gray-900 font-medium focus:outline-none focus:border-[#5cb85c] focus:bg-white transition-all"
                                placeholder="priest@example.com"
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider ml-1">Phone Number</label>
                                <input
                                    type="tel"
                                    value={newPriest.phone}
                                    onChange={(e) => setNewPriest({ ...newPriest, phone: e.target.value })}
                                    className="w-full px-5 py-4 bg-gray-50 border-2 border-gray-100 rounded-2xl text-gray-900 font-medium focus:outline-none focus:border-[#5cb85c] focus:bg-white transition-all"
                                    placeholder="+91 98765 43210"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider ml-1">Location</label>
                                <input
                                    type="text"
                                    value={newPriest.location}
                                    onChange={(e) => setNewPriest({ ...newPriest, location: e.target.value })}
                                    className="w-full px-5 py-4 bg-gray-50 border-2 border-gray-100 rounded-2xl text-gray-900 font-medium focus:outline-none focus:border-[#5cb85c] focus:bg-white transition-all"
                                    placeholder="City, State"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider ml-1">Experience (Years)</label>
                                <input
                                    type="number"
                                    value={newPriest.experience}
                                    onChange={(e) => setNewPriest({ ...newPriest, experience: e.target.value })}
                                    className="w-full px-5 py-4 bg-gray-50 border-2 border-gray-100 rounded-2xl text-gray-900 font-medium focus:outline-none focus:border-[#5cb85c] focus:bg-white transition-all"
                                    placeholder="e.g. 5"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider ml-1">Specialty</label>
                                <input
                                    type="text"
                                    value={newPriest.specialty}
                                    onChange={(e) => setNewPriest({ ...newPriest, specialty: e.target.value })}
                                    className="w-full px-5 py-4 bg-gray-50 border-2 border-gray-100 rounded-2xl text-gray-900 font-medium focus:outline-none focus:border-[#5cb85c] focus:bg-white transition-all"
                                    placeholder="e.g. Vedic Rituals"
                                />
                            </div>
                        </div>

                        <div className="pt-6 flex flex-col md:flex-row justify-end gap-3">
                            <button type="button" onClick={() => setActiveTab('all')} className="px-8 py-4 rounded-xl font-bold text-gray-500 hover:text-gray-900 hover:bg-gray-50 transition-colors">Cancel</button>
                            <button
                                type="button"
                                onClick={handleCreatePriest}
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