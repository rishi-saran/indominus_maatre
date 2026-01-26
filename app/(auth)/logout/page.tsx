'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function LogoutPage() {
  const router = useRouter();

  useEffect(() => {
    // Clear localStorage
    localStorage.removeItem('user_id');
    localStorage.removeItem('user_email');
    localStorage.removeItem('addedServices');
    
    // Clear cookies
    document.cookie = 'user_id=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
    document.cookie = 'user_email=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
    
    // Redirect to login
    setTimeout(() => {
      router.push('/login');
    }, 500);
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#E8F5E9] to-[#FFF9E6]">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-[#2f9e44] mb-2">Logging out...</h1>
        <p className="text-gray-600">Please wait while we log you out</p>
      </div>
    </div>
  );
}
