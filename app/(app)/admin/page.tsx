"use client";

import { useEffect, useState } from 'react';
import { fetchUserRole } from '@/lib/supabase/getUserRole';

export default function Dashboard() {
    const [role, setRole] = useState<string | null>(null);

    useEffect(() => {
        fetchUserRole()
            .then(setRole)
            .catch(console.error);
    }, []);

    if (!role) return <p>Loading...</p>;

    return (
        <div>
            <h1>Dashboard</h1>

            {role === 'admin' && <p>Role: Admin</p>}
            {role === 'customer' && <p>Role: Customer</p>}
            {role === 'priest' && <p>Role: Priest</p>}
        </div>
    );
}
