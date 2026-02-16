'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { fetchUserRole } from '@/lib/supabase/getUserRole';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const router = useRouter();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchUserRole()
            .then((role) => {
                if (role !== 'admin') {
                    router.replace('/landing');
                }
            })
            .catch(() => router.replace('/login'))
            .finally(() => setLoading(false));
    }, [router]);

    if (loading) return null;

    return <>{children}</>;
}
