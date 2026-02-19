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
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/pages`)
            .then((r) => r.json())
            .then((d) => setPages(d.items || []));
    }, []);

    return (
        <div className="max-w-4xl mx-auto p-6">
            <div className="flex justify-between mb-6">
                <h1 className="text-2xl font-semibold">Pages</h1>
                <button
                    onClick={() => router.push("/admin/pages/new")}
                    className="bg-blue-600 text-white px-4 py-2 rounded"
                >
                    New Page
                </button>
            </div>

            <ul className="space-y-3">
                {pages.map((p) => (
                    <li
                        key={p.slug}
                        className="border p-3 rounded flex justify-between"
                    >
                        <div>
                            <p className="font-medium">{p.title}</p>
                            <p className="text-sm text-gray-500">{p.slug}</p>
                        </div>
                        <button
                            onClick={() =>
                                router.push(`/admin/pages/${p.slug}`)
                            }
                            className="text-blue-600"
                        >
                            Edit
                        </button>
                    </li>
                ))}
            </ul>
        </div>
    );
}
