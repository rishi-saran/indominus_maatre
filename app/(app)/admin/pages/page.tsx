'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

export default function AdminPages() {
    const [pages, setPages] = useState<any[]>([]);

    useEffect(() => {
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/pages`)
            .then((r) => r.json())
            .then((d) => setPages(d.items || []));
    }, []);

    return (
        <div className="p-6 max-w-4xl mx-auto">
            <div className="flex justify-between mb-6">
                <h1 className="text-2xl font-bold">Pages</h1>
                <Link
                    href="/dashboard/admin/pages/new"
                    className="bg-green-600 text-white px-4 py-2 rounded"
                >
                    + New Page
                </Link>
            </div>

            <ul className="space-y-3">
                {pages.map((p) => (
                    <li key={p.slug} className="border p-3 rounded flex justify-between">
                        <span>{p.title}</span>
                        <Link
                            href={`/dashboard/admin/pages/${p.slug}/edit`}
                            className="text-blue-600"
                        >
                            Edit
                        </Link>
                    </li>
                ))}
            </ul>
        </div>
    );
}
