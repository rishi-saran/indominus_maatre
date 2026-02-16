"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { fetchUserRole } from "@/lib/supabase/getUserRole";

export default function AdminPagesLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const router = useRouter();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function checkAdmin() {
            try {
                const role = await fetchUserRole();

                if (role !== "admin") {
                    router.replace("/landing");
                    return;
                }

                setLoading(false);
            } catch {
                router.replace("/login");
            }
        }

        checkAdmin();
    }, [router]);

    if (loading) {
        return (
            <div className="p-10 text-center text-gray-500">
                Checking admin access…
            </div>
        );
    }

    return <>{children}</>;
}
