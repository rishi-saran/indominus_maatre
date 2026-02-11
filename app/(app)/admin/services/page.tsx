"use client";

import { useState } from "react";
import { Plus, Folder, Package, Tag, MoreHorizontal } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

// Mock Data
const categories = [
    { id: 1, name: "Homas", count: 12, status: "Active" },
    { id: 2, name: "Pujas", count: 8, status: "Active" },
    { id: 3, name: "Festivals", count: 5, status: "Coming Soon" },
];

const services = [
    { id: "S001", name: "Ganapati Homam", category: "Homas", price: "₹5,000", duration: "2 Hours" },
    { id: "S002", name: "Satyanarayan Puja", category: "Pujas", price: "₹3,500", duration: "1.5 Hours" },
    { id: "S003", name: "Navagraha Shanti", category: "Homas", price: "₹7,000", duration: "3 Hours" }
];

const packages = [
    { id: "P001", name: "Wedding Package", services: ["Ganapati Homam", "Vivah Samskara"], price: "₹25,000" },
    { id: "P002", name: "Housewarming Bundle", services: ["Vastu Puja", "Ganapati Homam", "Navagraha"], price: "₹15,000" }
];

export default function ServicesPage() {
    const [activeTab, setActiveTab] = useState("categories");

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Service Management</h1>
                    <p className="text-gray-600 mt-1">Configure your offerings and prices</p>
                </div>
                <button className="inline-flex items-center justify-center px-4 py-2 bg-[#5cb85c] text-white rounded-lg font-medium hover:bg-[#4cae4c] transition-colors shadow-sm">
                    <Plus className="w-4 h-4 mr-2" />
                    Add New
                </button>
            </div>

            {/* Tabs */}
            <div className="flex border-b border-gray-200">
                <button
                    onClick={() => setActiveTab("categories")}
                    className={`pb-3 px-4 text-sm font-medium border-b-2 transition-colors flex items-center gap-2 ${activeTab === "categories"
                            ? "border-[#5cb85c] text-[#5cb85c]"
                            : "border-transparent text-gray-500 hover:text-gray-700"
                        }`}
                >
                    <Folder className="w-4 h-4" />
                    Categories
                </button>
                <button
                    onClick={() => setActiveTab("services")}
                    className={`pb-3 px-4 text-sm font-medium border-b-2 transition-colors flex items-center gap-2 ${activeTab === "services"
                            ? "border-[#5cb85c] text-[#5cb85c]"
                            : "border-transparent text-gray-500 hover:text-gray-700"
                        }`}
                >
                    <Tag className="w-4 h-4" />
                    Services
                </button>
                <button
                    onClick={() => setActiveTab("packages")}
                    className={`pb-3 px-4 text-sm font-medium border-b-2 transition-colors flex items-center gap-2 ${activeTab === "packages"
                            ? "border-[#5cb85c] text-[#5cb85c]"
                            : "border-transparent text-gray-500 hover:text-gray-700"
                        }`}
                >
                    <Package className="w-4 h-4" />
                    Packages
                </button>
            </div>

            {/* Content */}
            {activeTab === "categories" && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {categories.map((cat) => (
                        <Card key={cat.id} className="hover:shadow-md transition-shadow cursor-pointer">
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Category</CardTitle>
                                <Folder className="h-4 w-4 text-gray-500" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold mb-1">{cat.name}</div>
                                <p className="text-xs text-gray-500">{cat.count} services available</p>
                                <div className="mt-4 flex justify-between items-center">
                                    <span className={`text-xs px-2 py-1 rounded-full ${cat.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                                        {cat.status}
                                    </span>
                                    <button className="text-gray-400 hover:text-gray-600"><MoreHorizontal className="w-4 h-4" /></button>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                    <button className="border-2 border-dashed border-gray-200 rounded-xl p-6 flex flex-col items-center justify-center text-gray-400 hover:text-gray-600 hover:border-gray-300 hover:bg-gray-50 transition-all">
                        <Plus className="w-8 h-8 mb-2" />
                        <span className="font-medium">Add Category</span>
                    </button>
                </div>
            )}

            {activeTab === "services" && (
                <Card>
                    <CardHeader>
                        <CardTitle>All Services</CardTitle>
                        <CardDescription>List of individual services offered to customers.</CardDescription>
                    </CardHeader>
                    <CardContent className="p-0">
                        <table className="w-full text-sm text-left">
                            <thead className="bg-gray-50 text-gray-500 font-medium">
                                <tr>
                                    <th className="px-6 py-3">ID</th>
                                    <th className="px-6 py-3">Service Name</th>
                                    <th className="px-6 py-3">Category</th>
                                    <th className="px-6 py-3">Duration</th>
                                    <th className="px-6 py-3">Base Price</th>
                                    <th className="px-6 py-3 text-right">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {services.map((service) => (
                                    <tr key={service.id} className="hover:bg-gray-50/50">
                                        <td className="px-6 py-4 font-medium text-gray-900">{service.id}</td>
                                        <td className="px-6 py-4 font-medium text-gray-900">{service.name}</td>
                                        <td className="px-6 py-4 text-gray-600">{service.category}</td>
                                        <td className="px-6 py-4 text-gray-600">{service.duration}</td>
                                        <td className="px-6 py-4 font-medium text-[#5cb85c]">{service.price}</td>
                                        <td className="px-6 py-4 text-right">
                                            <button className="text-blue-600 hover:underline text-xs">Edit</button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </CardContent>
                </Card>
            )}

            {activeTab === "packages" && (
                <div className="space-y-4">
                    {packages.map((pkg) => (
                        <Card key={pkg.id}>
                            <CardContent className="p-6">
                                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                    <div>
                                        <h3 className="text-lg font-bold text-gray-900">{pkg.name}</h3>
                                        <div className="flex flex-wrap gap-2 mt-2">
                                            {pkg.services.map((s, i) => (
                                                <span key={i} className="px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs font-medium">
                                                    {s}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-2xl font-bold text-[#5cb85c]">{pkg.price}</p>
                                        <button className="text-sm text-gray-500 hover:text-gray-900 mt-1">Manage Package</button>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
}
