"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
    LayoutDashboard,
    Users,
    Briefcase,
    CalendarCheck, // Changed from Calendar
    Radio, // Changed from Video to Radio for Live Streams
    Wallet, // Changed from DollarSign
    BarChart3, // Changed from FileText for Reports
    Settings2, // Changed from Settings
    LogOut,
    Menu,
    X,
    ChevronRight,
    Sparkles
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Toaster } from "sonner";

const sidebarItems = [
    { name: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
    { name: "Priests", href: "/admin/priests", icon: Users },
    { name: "Services", href: "/admin/services", icon: Briefcase },
    { name: "Bookings", href: "/admin/bookings", icon: CalendarCheck }, // Updated icon
    { name: "Live Streams", href: "/admin/live-streams", icon: Radio }, // Updated icon
    { name: "Finance", href: "/admin/finance", icon: Wallet }, // Updated icon
    { name: "Reports", href: "/admin/reports", icon: BarChart3 }, // Updated icon
    { name: "Settings", href: "/admin/settings", icon: Settings2 }, // Updated icon
];

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const pathname = usePathname();
    const router = useRouter();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const auth = localStorage.getItem("adminAuth");
        if (auth === "true") {
            setIsAuthenticated(true);
        } else {
            router.push("/login");
        }
        setIsLoading(false);
    }, [pathname, router]);

    const handleLogout = () => {
        localStorage.removeItem("adminAuth");
        setIsAuthenticated(false);
        router.push("/login");
    };

    if (isLoading || !isAuthenticated) {
        return null;
    }

    return (
        <div className="fixed inset-0 z-[100] flex bg-gradient-to-br from-[#d6f0a8] via-[#eaf5b5] to-[#ffe6a3] overflow-hidden font-sans">

            <Toaster richColors position="top-right" />

            {/* Mobile Menu Overlay */}
            {isMobileMenuOpen && (
                <div
                    className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[110] lg:hidden transition-opacity"
                    onClick={() => setIsMobileMenuOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside
                className={cn(
                    "fixed lg:relative inset-y-0 left-0 z-[120] w-72 bg-white/40 backdrop-blur-2xl flex flex-col transition-transform duration-300 ease-in-out shadow-[4px_0_30px_rgba(0,0,0,0.03)] border-r border-white/30",
                    isMobileMenuOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
                )}
            >
                {/* Brand */}
                <div className="h-24 px-8 flex items-center justify-between">
                    <Link href="/admin/dashboard" className="flex items-center gap-3 group">
                        <div className="relative">
                            <div className="absolute inset-0 bg-gradient-to-tr from-[#fffbe6] to-[#eaf5b5] rounded-xl blur-lg opacity-60 group-hover:opacity-80 transition-opacity duration-300"></div>
                            <div className="relative w-11 h-11 rounded-xl bg-gradient-to-br from-[#fffbe6] to-[#eaf5b5] flex items-center justify-center text-[#1a5d1a] shadow-xl ring-2 ring-white/60 group-hover:scale-105 transition-transform duration-300">
                                <span className="font-extrabold text-2xl">M</span>
                            </div>
                        </div>
                        <div className="flex flex-col">
                            <span className="text-3xl font-extrabold italic tracking-tight text-transparent bg-clip-text" style={{ background: 'linear-gradient(90deg, #43a047 0%, #bdbd2c 40%, #ffc107 70%, #ff9800 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', fontStyle: 'italic', fontWeight: 800 }}>Maathre</span>
                            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#1a5d1a] ml-0.5">Admin Suite</span>
                        </div>
                    </Link>
                    <button
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="lg:hidden p-2 hover:bg-white/40 rounded-lg text-gray-600 transition-colors"
                    >
                        <X className="h-5 w-5" />
                    </button>
                </div>

                {/* Nav Items */}
                <div className="flex-1 overflow-y-auto px-4 py-2 custom-scrollbar">
                    <p className="px-4 text-[10px] font-bold text-gray-400 uppercase tracking-[0.15em] mb-4">Navigation</p>
                    <nav className="space-y-2">
                        {sidebarItems.map((item) => {
                            const isActive = pathname.startsWith(item.href);
                            return (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    className={cn(
                                        "group relative flex items-center justify-between px-4 py-3.5 text-sm font-semibold rounded-2xl transition-all duration-300",
                                        isActive
                                            ? "bg-white/80 text-[#1a5d1a] shadow-[0_4px_20px_rgba(0,0,0,0.03)] backdrop-blur-md"
                                            : "text-gray-600 hover:bg-white/40 hover:text-gray-900"
                                    )}
                                >
                                    {isActive && (
                                        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-[#5cb85c] rounded-r-full shadow-[0_0_10px_rgba(92,184,92,0.5)]"></div>
                                    )}
                                    <div className="flex items-center gap-4">
                                        <div className={cn(
                                            "p-2 rounded-lg transition-all duration-300",
                                            isActive
                                                ? "bg-[#5cb85c]/10 text-[#5cb85c]"
                                                : "bg-transparent group-hover:bg-white/50 text-gray-400 group-hover:text-gray-700"
                                        )}>
                                            <item.icon className={cn("h-5 w-5", isActive && "stroke-[2.5px]")} />
                                        </div>
                                        <span>{item.name}</span>
                                    </div>
                                    {isActive && (
                                        <div className="w-1.5 h-1.5 rounded-full bg-[#5cb85c] shadow-[0_0_8px_rgba(92,184,92,0.6)]"></div>
                                    )}
                                </Link>
                            );
                        })}
                    </nav>
                </div>

                {/* Footer */}
                <div className="p-6 mt-auto">
                    <div className="relative group overflow-hidden bg-white/90 backdrop-blur-xl rounded-3xl p-1 shadow-2xl border border-[#eaf5b5]">
                        <div className="absolute inset-0 bg-gradient-to-br from-[#eaf5b5]/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                        <div className="relative p-4 flex items-center gap-3.5">
                            <div className="relative">
                                <div className="absolute -inset-1 rounded-full bg-gradient-to-r from-[#eaf5b5] to-[#fffbe6] blur opacity-30 group-hover:opacity-60 transition-all duration-500"></div>
                                <div className="relative w-10 h-10 rounded-full bg-white border border-[#eaf5b5] flex items-center justify-center text-sm font-bold text-[#1a5d1a] shadow-inner">
                                    AU
                                </div>
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-bold text-[#1a5d1a] truncate group-hover:text-[#5cb85c] transition-colors">Admin User</p>
                                <p className="text-[10px] uppercase font-medium tracking-wider text-[#5cb85c] truncate">Super Admin</p>
                            </div>
                            <button
                                onClick={handleLogout}
                                className="p-2 text-[#1a5d1a] hover:text-white hover:bg-[#5cb85c] rounded-full transition-all duration-200 border border-[#eaf5b5] bg-white"
                                title="Sign Out"
                            >
                                <LogOut className="h-4 w-4" />
                            </button>
                        </div>
                    </div>
                </div>
            </aside>

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col h-full overflow-hidden relative bg-transparent">

                {/* Mobile Header */}
                <div className="lg:hidden h-20 px-6 bg-white/30 backdrop-blur-2xl border-b border-white/20 flex items-center justify-between shrink-0 z-30 sticky top-0 shadow-sm">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => setIsMobileMenuOpen(true)}
                            className="p-2.5 -ml-2 text-gray-700 bg-white/40 hover:bg-white/60 rounded-xl transition-all"
                        >
                            <Menu className="h-6 w-6" />
                        </button>
                        <span className="font-bold text-lg text-gray-900">Admin Portal</span>
                    </div>
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#5cb85c] to-[#4cae4c] flex items-center justify-center text-white font-bold shadow-lg ring-2 ring-white/40">
                        M
                    </div>
                </div>

                {/* Scrollable Content */}
                <main className="flex-1 overflow-y-auto px-6 py-8 lg:px-12 lg:py-10 pb-24 scroll-smooth">
                    <div className="max-w-[1600px] mx-auto animate-in fade-in slide-in-from-bottom-6 duration-700 ease-out">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    );
}
