"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface PageItem {
    slug: string;
    title: string;
    type: string;
}

export default function AdminPagesList() {
    const router = useRouter();
    const [pages, setPages] = useState<PageItem[]>([]);
    useEffect(() => {
        async function loadPages() {
            const token = localStorage.getItem("access_token");

            const res = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL}/pages`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            if (!res.ok) return;

            const data = await res.json();
            setPages(data.items || []);
        }

        loadPages();
    }, []);

    return (
        <div className="max-w-4xl mx-auto p-6">
            <div className="flex justify-between mb-6">
                <h1 className="text-3xl font-black mb-6 text-[#1a5d1a]">Pages</h1>
                <button
                    onClick={() => router.push("/admin/pages/new")}
                    className="bg-[#1a5d1a] hover:bg-[#144414] text-white px-6 py-3 rounded-full font-bold shadow-lg shadow-green-900/20 transition-all active:scale-95"
                >
                    New Page
                </button>
            </div>

            <ul className="space-y-3">
                {pages.map((p) => (
                    <li
                        key={p.slug}
                        className="bg-white/70 backdrop-blur-sm border border-white/40 p-4 rounded-2xl flex justify-between items-center shadow-sm hover:shadow-md transition-all"
                    >
                        <div>
                            <p className="font-medium">{p.title}</p>
                            <p className="text-sm text-gray-500">{p.slug}</p>
                        </div>
                        <button
                            onClick={() =>
                                router.push(`/admin/pages/${p.slug}`)
                            }
                            className="bg-[#5cb85c]/10 text-[#1a5d1a] px-4 py-2 rounded-full font-semibold hover:bg-[#5cb85c]/20 transition"
                        >
                            Edit
                        </button>
                    </li>
                ))}
            </ul>
        </div>
    );
}
