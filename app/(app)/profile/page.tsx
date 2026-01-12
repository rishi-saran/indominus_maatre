"use client";
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import ServiceCard from '@/app/components/ui/ServiceCard';

interface Notification {
  id: string;
  message: string;
  type: 'success' | 'info' | 'green' | 'profile';
  emoji?: string;
}

interface Order {
  order_id: string;
  status: string;
  total_amount: number;
  created_at: string;
  product_name?: string;
  category?: string;
  image?: string;
}

interface Booking {
  service: string;
  person: string;
  image: string;
  date: string; // e.g., 'Jan 15, 2026'
  time: string; // e.g., '09:00 AM'
  status: 'PENDING' | 'CONFIRMED' | 'PROCESSING';
}

const API_BASE_URL = 'http://localhost:8000/api/v1';

export default function MyAccount() {
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  const [popupNotifications, setPopupNotifications] = useState<Notification[]>([]);
  const [activeSection, setActiveSection] = useState<string | null>(null);
  const [activePreference, setActivePreference] = useState<string | null>(null);

  // Orders API state
  const [orders, setOrders] = useState<Order[]>([]);
  const [ordersLoading, setOrdersLoading] = useState(false);
  const [ordersError, setOrdersError] = useState<string | null>(null);

  // Profile state from API response
  const [profile, setProfile] = useState({
    user_id: '',
    email: '',
    is_new_user: false,
  });
  const [authLoading, setAuthLoading] = useState(false);
  const [editEmail, setEditEmail] = useState('');

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isOrdersModalOpen, setIsOrdersModalOpen] = useState(false);
  const [isRitualDetailsModalOpen, setIsRitualDetailsModalOpen] = useState(false);
  const [isBookingsModalOpen, setIsBookingsModalOpen] = useState(false);
  const [isAddServicesModalOpen, setIsAddServicesModalOpen] = useState(false);
  const [selectedServiceIds, setSelectedServiceIds] = useState<number[]>([]);
  const [checkoutStep, setCheckoutStep] = useState<0 | 1 | 2 | 3 | 4>(0);
  
  // Service configurations
  const [serviceConfigs, setServiceConfigs] = useState<Record<number, { flowers: string; package: string }>>({});
  
  // Coupon state
  const [showCouponInput, setShowCouponInput] = useState(false);
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState<string | null>(null);
  
  // Available services from backend
  const [availableServices, setAvailableServices] = useState<Array<{
    id: number;
    title: string;
    description: string;
    image: string;
    price?: number;
    packages?: Array<{ name: string; price: number }>;
    formData?: {
      location?: string;
      venue?: string;
      priestPreference?: string;
      date?: string;
      package?: string;
      flowers?: string;
    };
  }>>([]);

  // Demo bookings data (can be replaced with API later)
  const allBookings: Booking[] = [
    {
      service: 'Griha Pravesh',
      person: 'Ravi Shastri',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBr4CkQZdDBtyiP5TG4kI2jPAKgO9PG9gqOpQCew_k5Kiy09t3kAKd00vzySn_4n25u1rLkqJj9PX3TDadhkGudDl73w3_GvNPR5Te9lbQcdggPDFqrKQ9Cg_l7kWMor-qRbuQ1185SHbniviSZULKNaZRHRFuychoxjarIklVnd5_PLo4dvL9_5Xy59xkmbQEvydncDEu8MXVgtxwunPfQLUoY4vuZAjN_X54uPsCYkVVDHzcpkhSXRr1qjPmw3lfH5q_kR0EHWb7W',
      date: 'Jan 15, 2026',
      time: '09:00 AM',
      status: 'CONFIRMED',
    },
    {
      service: 'Vivah Sanskar',
      person: 'Mohan Singh',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDs9pbArOnpyzqf-ilR_9wLZtu8V-lAkNDUEaEnZWO3zz7yU4c3jZmvartaUD0tnLHpa39vpdhpsiVC56Zj4IV_V7ivdInaFs9XBCkRvB1BK9R35Pyvgb6RHzriAwFyOnk2LQFy2H5Y4h-BlZfHy-thh_iV8BATUYHWHDWty-3aDae9TPLxLpsqgf1jwRLdfSeJQR7v8ZR9-hNxwj4d8XwXXyaSuvKRkYTTypTjpPvK2vi6qn8WL3-_HJopfprOCw7-cv2rOkauoPIu',
      date: 'Feb 28, 2026',
      time: '10:30 AM',
      status: 'PENDING',
    },
    {
      service: 'Satyanarayan Pooja',
      person: 'Rajesh Sharma',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuChu4R7OwQ8ETkPLyBovCUHdrB2jioozFFzmFmd7vgObnmLRo7wsqRueSpgGRdzWQF8sudBJEwKxUIhPl4e6ktt1cWSdTKPo7SKd4R0vQldPZ2kQ93SEGxagNTbpenyKVDOZluRtAG8oHpbWAf61cG5l0WYlUMCeQpg16SZ5y9myjMsJCkCakxue4devmQfpfQHcAR6Y18nMkgfWw1_UEeXvIKjxuNcWNX3SMflBo54elTH8Weba2vb1haWBGDFi7GPNUe5ETXixQ9w',
      date: 'Mar 10, 2026',
      time: '06:00 PM',
      status: 'PENDING',
    },
    {
      service: 'Durga Pooja',
      person: 'Vikram Gupta',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCqo0FhTUrz6-nWNfy8ywHrahiAxYCMI5AvPPfyqpTbRnrLGCsddTnwFM7_yjcWsNfOGGrj9NyDl6Ujj6iF_qiXzeTsdTiznHx4Bvx9ZTRFURZwrairL2hkhD45x63r4TJdZENhaQDHyITjN3bcQg-MwjBs-1urarRYEwTRqn3cwaPjfCaQjEaUlKKTbOFaNLtwZoVSFtc8cWW_ztYuza0bYII2larCYNCQaB1PZ6KpnlKVhyS6hpNijA3BnxJ-ZUoVTXQ7g0tns-cs',
      date: 'Mar 25, 2026',
      time: '05:00 PM',
      status: 'CONFIRMED',
    },
  ];

  const isToday = (dateStr: string) => {
    const d = new Date(dateStr);
    const now = new Date();
    return d.getFullYear() === now.getFullYear() && d.getMonth() === now.getMonth() && d.getDate() === now.getDate();
  };

  const pendingBookings: Booking[] = allBookings
    .filter(b => b.status === 'PENDING')
    .map(b => ({
      ...b,
      status: isToday(b.date) ? 'PROCESSING' : b.status,
    }));
  const confirmedBooking: Booking | undefined = allBookings.find(b => b.status === 'CONFIRMED');

  // Authenticate user on component mount
  useEffect(() => {
    const authenticateUser = async () => {
      try {
        setAuthLoading(true);
        // Check if user is already logged in
        const storedUserId = localStorage.getItem('user_id');
        const storedEmail = localStorage.getItem('user_email');
        
        if (storedUserId && storedEmail) {
          setProfile({
            user_id: storedUserId,
            email: storedEmail,
            is_new_user: false,
          });
        } else {
          // Try to login with demo account
          const response = await fetch(`${API_BASE_URL}/auth/login`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              email: 'priya.sharma@example.com',
            }),
          });
          
          if (response.ok) {
            const data = await response.json();
            setProfile(data);
            // Store in localStorage for future use
            localStorage.setItem('user_id', data.user_id);
            localStorage.setItem('user_email', data.email);
          } else {
            // Use demo data if API not available
            setProfile({
              user_id: 'demo-user',
              email: 'priya.sharma@example.com',
              is_new_user: false,
            });
          }
        }
      } catch (error) {
        console.warn('Authentication error:', error);
        // Use demo data as fallback
        setProfile({
          user_id: 'demo-user',
          email: 'priya.sharma@example.com',
          is_new_user: false,
        });
      } finally {
        setAuthLoading(false);
      }
    };

    authenticateUser();
  }, []);

  // Fetch orders from API
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setOrdersLoading(true);
        setOrdersError(null);
        const userId = localStorage.getItem('user_id') || 'demo-user';
        const response = await fetch(`${API_BASE_URL}/orders/${userId}`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch orders');
        }
        
        const data = await response.json();
        setOrders(data.orders || []);
      } catch (error) {
        // No orders - backend not available
        setOrders([]);
        setOrdersError(null);
        console.warn('Orders not available');
      } finally {
        setOrdersLoading(false);
      }
    };

    fetchOrders();
  }, []);

  // Load available services
  useEffect(() => {
    const loadServices = () => {
      try {
        const savedServices = JSON.parse(localStorage.getItem('addedServices') || '[]');
        setAvailableServices(savedServices);
      } catch (e) {
        setAvailableServices([]);
      }
    };

    loadServices();
    
    // Listen for service updates
    const handleStorageChange = () => {
      loadServices();
    };
    
    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('servicesUpdated', handleStorageChange);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('servicesUpdated', handleStorageChange);
    };
  }, []);

  // Load Material Symbols font
  useEffect(() => {
    const link = document.createElement('link');
    link.href = 'https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200';
    link.rel = 'stylesheet';
    document.head.appendChild(link);
    
    return () => {
      document.head.removeChild(link);
    };
  }, []);

  const openEditModal = () => {
    setEditEmail(profile.email);
    setIsEditModalOpen(true);
  };
  const closeEditModal = () => setIsEditModalOpen(false);
  const openOrdersModal = () => setIsOrdersModalOpen(true);
  const closeOrdersModal = () => setIsOrdersModalOpen(false);
  const openRitualDetailsModal = () => setIsRitualDetailsModalOpen(true);
  const closeRitualDetailsModal = () => setIsRitualDetailsModalOpen(false);
  const openBookingsModal = () => setIsBookingsModalOpen(true);
  const closeBookingsModal = () => setIsBookingsModalOpen(false);
  const openAddServicesModal = () => { 
    setIsAddServicesModalOpen(true); 
    setCheckoutStep(0); 
  };
  const closeAddServicesModal = () => { setIsAddServicesModalOpen(false); setSelectedServiceIds([]); setCheckoutStep(0); };
  const saveProfile = () => {
    const updated = {
      user_id: profile.user_id,
      email: editEmail,
      is_new_user: profile.is_new_user,
    };
    setProfile(updated);
    closeEditModal();
    showNotification('Profile updated successfully', 'profile', '✅');
  };

  const showNotification = (
    message: string,
    type: 'success' | 'info' | 'green' | 'profile' = 'green',
    emoji = '✓'
  ) => {
    const id = Date.now().toString();
    const notification: Notification = { id, message, type, emoji };

    setPopupNotifications((prev: Notification[]) => [...prev, notification]);

    setTimeout(() => {
      setPopupNotifications((prev: Notification[]) => prev.filter((n: Notification) => n.id !== id));
    }, 3000);
  };

  const handleButtonClick = (message: string, type: Notification['type'] = 'green', emoji = '✓') => {
    showNotification(message, type, emoji);
  };

  return (
    <div className="text-sm text-[#2f3a1f] antialiased min-h-screen flex flex-col relative overflow-x-hidden selection:bg-accent/30 bg-gradient-to-r from-[#d6f0a8] via-[#eaf5b5] to-[#ffe6a3]">
      {/* Notification Popups */}
      <div className="fixed top-8 right-8 z-80 space-y-3 pointer-events-none">
        {popupNotifications.map((notification: Notification) => {
          const isProfile = notification.type === 'profile';
          if (!isProfile) return null;
          return (
            <div
              key={notification.id}
              role="button"
              tabIndex={0}
              onClick={() => { if (isProfile) openEditModal(); }}
              onKeyDown={(e: React.KeyboardEvent) => { if ((e.key === 'Enter' || e.key === ' ') && isProfile) { e.preventDefault(); openEditModal(); } }}
              className={`animate-pop-strong popup-green px-6 py-4 rounded-2xl font-semibold text-sm text-[#4f5d2f] flex items-center gap-3 pointer-events-auto shadow-2xl border-2 border-amber-200 hover:shadow-amber-100/50 cursor-pointer`}
            >
              <span className="text-2xl animate-pulse">{notification.emoji}</span>
              <span className="flex-1">{notification.message}</span>
            </div>
          );
        })}
      </div>

      {/* Background Blobs */}
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] right-[-10%] w-[70vw] h-[70vw] bg-yellow-300/30 rounded-full mix-blend-multiply filter blur-[100px] animate-blob"></div>
        <div
          className="absolute bottom-[-10%] left-[-10%] w-[60vw] h-[60vw] bg-lime-400/30 rounded-full mix-blend-multiply filter blur-[80px] animate-blob"
          style={{ animationDelay: '2s' }}
        ></div>
        <div
          className="absolute top-[40%] left-[30%] w-[40vw] h-[40vw] bg-yellow-200/40 rounded-full mix-blend-multiply filter blur-[60px] animate-blob"
          style={{ animationDelay: '4s' }}
        ></div>
        <div
          className="absolute inset-0 opacity-[0.3]"
          style={{
            backgroundImage: `url('data:image/svg+xml,%3Csvg width="80" height="80" viewBox="0 0 80 80" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%23a16207" fill-opacity="0.08"%3E%3Cpath d="M40 40c0-8.8-7.2-16-16-16V8c17.7 0 32 14.3 32 32h-16zM0 40c0-8.8 7.2-16 16-16V8C-1.7 8-16 22.3-16 40h16zm40 0c0 8.8-7.2 16-16 16v16c17.7 0 32-14.3 32-32h-16zM0 40c0 8.8 7.2 16 16 16v16C-1.7 72-16 57.7-16 40h16z"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')`,
          }}
        ></div>
      </div>

      {/* Header backdrop to match body gradient without transparency shift */}
      <div className="fixed inset-x-0 top-0 h-40 bg-gradient-to-r from-[#d6f0a8] via-[#eaf5b5] to-[#ffe6a3] opacity-100 mix-blend-normal pointer-events-none z-0"></div>

      {/* Edit Profile Modal */}
      {isEditModalOpen && (
        <div className="fixed inset-0 z-60 flex items-center justify-center">
          <div className="absolute inset-0 modal-backdrop" onClick={closeEditModal}></div>
          <div className="relative z-70 w-full max-w-md p-6 rounded-2xl bg-white shadow-2xl">
            <h2 className="text-xl font-serif font-semibold text-[#2f3a1f] mb-3">Edit Profile</h2>
            <form
              onSubmit={(e: React.FormEvent) => {
                e.preventDefault();
                saveProfile();
              }}
              className="space-y-3"
            >
              <div>
                <label className="text-sm text-[#4f5d2f] font-medium">User ID</label>
                <input name="user_id" defaultValue={profile.user_id} className="w-full p-2 border rounded mt-1 bg-gray-50 text-sm" readOnly />
              </div>
              <div>
                <label className="text-sm text-[#4f5d2f] font-medium">Email</label>
                <input 
                  value={editEmail}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEditEmail(e.target.value)}
                  className="w-full p-2 border rounded mt-1 text-sm" 
                />
              </div>
              <div className="flex justify-end gap-2 mt-2">
                <button type="button" onClick={closeEditModal} className="px-4 py-2 rounded bg-gray-100 text-sm">Cancel</button>
                <button type="submit" className="px-4 py-2 rounded bg-[#2f9e44] text-white hover:bg-[#268a3b] text-sm">Save</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add To Services Modal */}
      {isAddServicesModalOpen && (
        <div className="fixed inset-0 z-60 flex items-center justify-center">
          <div className="absolute inset-0 modal-backdrop" onClick={closeAddServicesModal}></div>
          <div className="relative z-70 w-full max-w-4xl p-6 rounded-2xl bg-white shadow-2xl animate-pop-strong max-h-[85vh] overflow-y-auto border border-[#cfd8a3] ring-1 ring-[#e3ebbd]">
            {checkoutStep === 0 && (
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-serif font-semibold text-[#2f3a1f]">Add Services</h2>
                  {selectedServiceIds.length > 0 && (
                    <button 
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        // Clear selected services
                        setSelectedServiceIds([]);
                        setServiceConfigs({});
                        setShowCouponInput(false);
                        setCouponCode('');
                        setAppliedCoupon(null);
                        // Clear from localStorage and update available services
                        localStorage.removeItem('addedServices');
                        setAvailableServices([]);
                        window.dispatchEvent(new Event('servicesUpdated'));
                      }}
                      className="px-4 py-2 text-sm font-semibold text-white bg-[#2f9e44] hover:bg-[#268a3b] rounded-lg transition-all shadow-md hover:shadow-lg"
                    >
                      Clear All ({selectedServiceIds.length})
                    </button>
                  )}
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
                  <div className="lg:col-span-3 grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {availableServices.length === 0 ? (
                      <p className="col-span-2 text-center text-sm text-[#4f5d2f] py-8">No services available yet. Please add services from the services page.</p>
                    ) : availableServices.map((svc) => {
                      const checked = selectedServiceIds.includes(svc.id);
                      const config = serviceConfigs[svc.id] || { flowers: 'No', package: 'Economy' };
                      
                      if (!checked) {
                        // Compact view when not selected
                        return (
                          <div
                            key={svc.id}
                            onClick={() => {
                              setSelectedServiceIds((prev) => {
                                // Use formData from service if available, otherwise use defaults
                                const serviceFormData = svc.formData || { flowers: 'No', package: 'Economy' };
                                setServiceConfigs(configs => ({
                                  ...configs,
                                  [svc.id]: { 
                                    flowers: serviceFormData.flowers || 'No', 
                                    package: serviceFormData.package || 'Economy' 
                                  }
                                }));
                                return [...prev, svc.id];
                              });
                            }}
                            className="rounded-xl border border-[#cfd8a3] bg-white ring-1 ring-[#e3ebbd] hover:border-[#2f9e44] hover:ring-[#2f9e44] hover:bg-[#eef4cf] transition-all p-3 cursor-pointer"
                          >
                            <div className="relative mb-2">
                              <input 
                                type="checkbox" 
                                checked={checked} 
                                readOnly
                                className="absolute top-2 right-2 z-10 w-5 h-5 rounded border-[#cfd8a3] cursor-pointer" 
                              />
                              <img src={svc.image} alt={svc.title} className="w-full h-20 rounded-lg object-cover border border-[#cfd8a3]" />
                            </div>
                            <h3 className="text-sm font-semibold text-[#2f3a1f] mb-1">{svc.title}</h3>
                            <p className="text-xs text-[#4f5d2f]">{svc.description}</p>
                          </div>
                        );
                      }
                      
                      // Expanded view when selected
                      return (
                        <div
                          key={svc.id}
                          className="sm:col-span-2 rounded-2xl border border-[#2f9e44] bg-white ring-1 ring-[#2f9e44] transition-all p-4"
                        >
                          <div className="flex gap-4">
                            {/* Checkbox + Image */}
                            <div className="flex-shrink-0">
                              <input 
                                type="checkbox" 
                                checked={checked} 
                                onChange={() => {
                                  setSelectedServiceIds((prev) => prev.filter(id => id !== svc.id));
                                }}
                                className="w-5 h-5 rounded border-[#cfd8a3] cursor-pointer mb-3" 
                              />
                              <img src={svc.image} alt={svc.title} className="w-20 h-20 rounded-lg object-cover border border-[#cfd8a3]" />
                            </div>

                            {/* Details */}
                            <div className="flex-1">
                              <h3 className="text-base font-semibold text-[#2f3a1f] mb-1">{svc.title}</h3>
                              <p className="text-xs text-[#4f5d2f] mb-2">{svc.description}</p>
                              
                              <div className="space-y-2">
                                {/* Add-on: Flowers */}
                                <div>
                                  <label className="text-xs font-semibold text-[#2f3a1f] mb-1 block">Add-on: Flowers</label>
                                  <div className="flex gap-3">
                                    <label className="flex items-center gap-2 cursor-pointer">
                                      <input 
                                        type="radio" 
                                        name={`flowers-${svc.id}`} 
                                        checked={config.flowers === 'Yes'}
                                        onChange={() => setServiceConfigs(configs => ({
                                          ...configs,
                                          [svc.id]: { ...config, flowers: 'Yes' }
                                        }))}
                                        className="cursor-pointer"
                                      />
                                      <span className="text-xs text-[#4f5d2f]">Yes (+₹250)</span>
                                    </label>
                                    <label className="flex items-center gap-2 cursor-pointer">
                                      <input 
                                        type="radio" 
                                        name={`flowers-${svc.id}`} 
                                        checked={config.flowers === 'No'}
                                        onChange={() => setServiceConfigs(configs => ({
                                          ...configs,
                                          [svc.id]: { ...config, flowers: 'No' }
                                        }))}
                                        className="cursor-pointer"
                                      />
                                      <span className="text-xs text-[#4f5d2f]">No</span>
                                    </label>
                                  </div>
                                </div>

                                {/* Select Package */}
                                <div>
                                  <label className="text-xs font-semibold text-[#2f3a1f] mb-1 block">Select Package</label>
                                  <select 
                                    value={config.package}
                                    onChange={(e) => setServiceConfigs(configs => ({
                                      ...configs,
                                      [svc.id]: { ...config, package: e.target.value }
                                    }))}
                                    className="w-full px-2 py-1 rounded text-xs border border-[#cfd8a3] focus:border-[#2f9e44] focus:ring-1 focus:ring-[#2f9e44]"
                                  >
                                    <option value="Economy">Economy - ₹9,999</option>
                                    <option value="Standard">Standard - ₹12,999</option>
                                    <option value="Premium">Premium - ₹20,000</option>
                                  </select>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                  <div className="lg:col-span-1">
                    <div className="p-4 rounded-2xl border border-[#cfd8a3] bg-white ring-1 ring-[#e3ebbd] sticky top-4">
                      <div className="flex items-center gap-2 mb-3">
                        <span className="material-symbols-outlined text-[#2f9e44]">task_alt</span>
                        <span className="text-sm font-semibold text-[#2f3a1f]">Selected ({selectedServiceIds.length})</span>
                      </div>
                      <ul className="space-y-2 mb-4 text-xs">
                        {selectedServiceIds.length === 0 && (
                          <li className="text-text-light">No services selected.</li>
                        )}
                        {selectedServiceIds.map(id => {
                          const svc = availableServices.find(s => s.id === id)!;
                          return <li key={id} className="text-[#4f5d2f]">• {svc?.title || 'Service'}</li>;
                        })}
                      </ul>
                      <button
                        disabled={selectedServiceIds.length === 0}
                        onClick={() => setCheckoutStep(1)}
                        className={`w-full px-4 py-2 rounded-lg font-semibold text-sm transition-all ${selectedServiceIds.length === 0 ? 'bg-gray-200 text-gray-500 cursor-not-allowed' : 'bg-[#2f9e44] text-white hover:bg-[#268a3b] hover:-translate-y-0.5'}`}
                      >
                        Proceed to Checkout
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
            {checkoutStep === 1 && (
              <div>
                <h2 className="text-xl font-serif font-semibold text-[#2f3a1f] mb-4">Contact Details</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 rounded-2xl border border-[#cfd8a3] bg-white ring-1 ring-[#e3ebbd]">
                    <label className="text-xs font-bold text-text-light uppercase">Full Name</label>
                    <input className="w-full mt-1 p-2 rounded-md border border-[#cfd8a3] text-sm focus:border-[#2f9e44] focus:ring-1 focus:ring-[#2f9e44]" defaultValue="Priya Sharma" />
                  </div>
                  <div className="p-4 rounded-2xl border border-[#cfd8a3] bg-white ring-1 ring-[#e3ebbd]">
                    <label className="text-xs font-bold text-text-light uppercase">Email</label>
                    <input 
                      type="email"
                      className="w-full mt-1 p-2 rounded-md border border-[#cfd8a3] text-sm focus:border-[#2f9e44] focus:ring-1 focus:ring-[#2f9e44]" 
                      value={profile.email}
                      readOnly
                    />
                  </div>
                  <div className="p-4 rounded-2xl border border-[#cfd8a3] bg-white ring-1 ring-[#e3ebbd]">
                    <label className="text-xs font-bold text-text-light uppercase">Phone</label>
                    <input className="w-full mt-1 p-2 rounded-md border border-[#cfd8a3] text-sm focus:border-[#2f9e44] focus:ring-1 focus:ring-[#2f9e44]" defaultValue="9876543210" />
                  </div>
                  <div className="p-4 rounded-2xl border border-[#cfd8a3] bg-white ring-1 ring-[#e3ebbd]">
                    <label className="text-xs font-bold text-text-light uppercase">Address</label>
                    <textarea className="w-full mt-1 p-2 rounded-md border border-[#cfd8a3] text-sm focus:border-[#2f9e44] focus:ring-1 focus:ring-[#2f9e44]" rows={3} defaultValue="123, Green Meadows, Chennai" />
                  </div>
                </div>
                <div className="flex justify-between gap-2 mt-4">
                  <button onClick={() => setCheckoutStep(0)} className="px-4 py-2 rounded bg-gray-100 hover:bg-gray-200">Back</button>
                  <button onClick={() => setCheckoutStep(2)} className="px-4 py-3 rounded-lg bg-[#2f9e44] text-white font-semibold hover:bg-[#268a3b]">Continue to Payment</button>
                </div>
              </div>
            )}
            {checkoutStep === 2 && (
              <div>
                <h2 className="text-xl font-serif font-semibold text-[#2f3a1f] mb-4">Payment Method</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {['UPI', 'Credit/Debit Card', 'Cash on Delivery'].map((m, i) => (
                    <button key={i} className="p-4 rounded-2xl border border-[#cfd8a3] bg-white ring-1 ring-[#e3ebbd] hover:border-[#2f9e44] hover:ring-[#2f9e44] hover:-translate-y-0.5 transition-all text-left">
                      <span className="text-sm font-semibold text-[#2f3a1f]">{m}</span>
                      <p className="text-xs text-[#4f5d2f] mt-1">Secure and fast checkout</p>
                    </button>
                  ))}
                </div>
                <div className="flex justify-between gap-2 mt-4">
                  <button onClick={() => setCheckoutStep(1)} className="px-4 py-2 rounded bg-gray-100 hover:bg-gray-200">Back</button>
                  <button onClick={() => setCheckoutStep(3)} className="px-4 py-3 rounded-lg bg-[#2f9e44] text-white font-semibold hover:bg-[#268a3b]">Review Order</button>
                </div>
              </div>
            )}
            {checkoutStep === 3 && (
              <div>
                <h2 className="text-xl font-serif font-semibold text-[#2f3a1f] mb-6">Review & Place Order</h2>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Selected Services */}
                  <div className="lg:col-span-2">
                    <h3 className="text-sm font-semibold mb-4 text-[#2f3a1f]">SERVICES</h3>
                    <div className="space-y-4">
                      {selectedServiceIds.map(id => {
                        const svc = availableServices.find(s => s.id === id)!;
                        const config = serviceConfigs[id] || { flowers: 'No', package: 'Economy' };
                        return (
                          <div key={id} className="flex gap-4 p-4 rounded-2xl border border-[#cfd8a3] bg-white ring-1 ring-[#e3ebbd]">
                            {/* Product Image */}
                            <div className="flex-shrink-0">
                              <img src={svc.image} alt={svc.title} className="w-24 h-24 rounded-lg object-cover border border-[#cfd8a3]" />
                            </div>
                            
                            {/* Product Details */}
                            <div className="flex-1">
                              <h4 className="font-semibold text-[#2f3a1f] mb-2">{svc.title}</h4>
                              <p className="text-sm text-[#4f5d2f] mb-3">{svc.description}</p>
                              
                              {/* Details like in the screenshot */}
                              <div className="space-y-1 text-xs text-[#4f5d2f]">
                                <p><strong>Add-on:</strong> Flowers: {config.flowers}</p>
                                <p><strong>Select Package:</strong> {config.package}</p>
                              </div>
                              
                              {/* Remove Button */}
                              <button 
                                onClick={() => setSelectedServiceIds(prev => prev.filter(sid => sid !== id))}
                                className="text-xs text-[#2f9e44] hover:text-[#268a3b] mt-3 underline"
                              >
                                Remove item
                              </button>
                            </div>
                            
                            {/* Price */}
                            <div className="text-right flex-shrink-0">
                              <p className="font-semibold text-[#2f3a1f]">₹15,000.00</p>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                  
                  {/* Cart Totals */}
                  <div className="lg:col-span-1">
                    <div className="p-4 rounded-2xl border border-[#cfd8a3] bg-white ring-1 ring-[#e3ebbd] sticky top-4">
                      <h3 className="text-sm font-semibold mb-4 text-[#2f3a1f]">CART TOTALS</h3>
                      
                      <div className="space-y-3 mb-4 pb-4 border-b border-[#cfd8a3]">
                        {!showCouponInput && !appliedCoupon && (
                          <button 
                            onClick={() => setShowCouponInput(true)}
                            className="text-xs text-[#2f9e44] hover:text-[#268a3b] font-semibold"
                          >
                            Add coupons ▼
                          </button>
                        )}
                        
                        {showCouponInput && (
                          <div className="flex gap-2">
                            <input 
                              type="text"
                              placeholder="Enter coupon code"
                              value={couponCode}
                              onChange={(e) => setCouponCode(e.target.value)}
                              className="flex-1 px-2 py-1 rounded text-xs border border-[#cfd8a3] focus:border-[#2f9e44] focus:ring-1 focus:ring-[#2f9e44]"
                            />
                            <button 
                              onClick={() => {
                                if (couponCode.trim()) {
                                  setAppliedCoupon(couponCode);
                                  setShowCouponInput(false);
                                  setCouponCode('');
                                }
                              }}
                              className="px-3 py-1 rounded text-xs bg-[#2f9e44] text-white hover:bg-[#268a3b]"
                            >
                              Apply
                            </button>
                          </div>
                        )}
                        
                        {appliedCoupon && (
                          <div className="flex items-center justify-between bg-[#eef4cf] px-3 py-2 rounded">
                            <span className="text-xs text-[#2f3a1f]">Coupon: <strong>{appliedCoupon}</strong></span>
                            <button 
                              onClick={() => setAppliedCoupon(null)}
                              className="text-xs text-[#2f9e44] hover:text-[#268a3b] underline"
                            >
                              Remove
                            </button>
                          </div>
                        )}
                      </div>
                      
                      <div className="mb-6">
                        <div className="flex justify-between items-center mb-3">
                          <span className="text-xs text-[#4f5d2f]">Subtotal</span>
                          <span className="font-semibold text-[#2f3a1f]">₹{selectedServiceIds.length * 15000}.00</span>
                        </div>
                        {appliedCoupon && (
                          <div className="flex justify-between items-center mb-3">
                            <span className="text-xs text-[#4f5d2f]">Discount</span>
                            <span className="font-semibold text-[#2f9e44]">-₹1,500.00</span>
                          </div>
                        )}
                        <div className="flex justify-between items-center pt-3 border-t border-[#cfd8a3]">
                          <span className="font-semibold text-[#2f3a1f]">Estimated total</span>
                          <span className="font-semibold text-lg text-[#2f3a1f]">
                            ₹{appliedCoupon ? (selectedServiceIds.length * 15000 - 1500).toFixed(2) : (selectedServiceIds.length * 15000).toFixed(2)}.00
                          </span>
                        </div>
                      </div>
                      
                      <button onClick={() => setCheckoutStep(4)} className="w-full px-4 py-3 rounded-lg bg-[#2f9e44] text-white font-semibold hover:bg-[#268a3b] transition-all">
                        Confirm Order
                      </button>
                    </div>
                  </div>
                </div>
                
                <div className="flex justify-between gap-2 mt-6">
                  <button onClick={() => setCheckoutStep(2)} className="px-4 py-2 rounded bg-gray-100 hover:bg-gray-200">Back</button>
                </div>
              </div>
            )}
            {checkoutStep === 4 && (
              <div className="text-center">
                <span className="material-symbols-outlined text-[#2f9e44] text-5xl">check_circle</span>
                <h2 className="mt-3 text-xl font-serif font-semibold text-[#2f3a1f]">Order Placed Successfully</h2>
                <p className="text-sm text-[#4f5d2f] mt-1">You will receive a confirmation email shortly.</p>
                <div className="mt-4">
                  <button onClick={closeAddServicesModal} className="px-4 py-2 rounded bg-[#2f9e44] text-white hover:bg-[#268a3b]">Close</button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Orders Modal */}
      {isOrdersModalOpen && (
        <div className="fixed inset-0 z-60 flex items-center justify-center">
          <div className="absolute inset-0 modal-backdrop" onClick={closeOrdersModal}></div>
          <div className="relative z-70 w-full max-w-2xl p-6 rounded-2xl bg-white shadow-2xl animate-pop-strong max-h-[80vh] overflow-y-auto">
            <h2 className="text-xl font-serif font-semibold text-[#2f3a1f] mb-4">Order History</h2>
            
            {ordersLoading && <p className="text-center text-text-light">Loading orders...</p>}
            {ordersError && <p className="text-center text-red-500">Error: {ordersError}</p>}
            
            {!ordersLoading && orders.length === 0 && (
              <p className="text-center text-text-light">No orders found</p>
            )}
            
            {!ordersLoading && orders.length > 0 && (
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead className="bg-primary/5">
                    <tr>
                      <th className="px-4 py-2 text-xs font-bold text-text-light uppercase tracking-wider">Product/Service</th>
                      <th className="px-4 py-2 text-xs font-bold text-text-light uppercase tracking-wider">Order ID</th>
                      <th className="px-4 py-2 text-xs font-bold text-text-light uppercase tracking-wider">Date</th>
                      <th className="px-4 py-2 text-xs font-bold text-text-light uppercase tracking-wider">Status</th>
                      <th className="px-4 py-2 text-xs font-bold text-text-light uppercase tracking-wider text-right">Amount</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/60">
                    {orders.map((order) => {
                      const orderDate = new Date(order.created_at).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric'
                      });
                      
                      const statusColor = 
                        order.status === 'CONFIRMED' || order.status === 'Delivered' ? 'green' :
                        order.status === 'COMPLETED' || order.status === 'Completed' ? 'blue' :
                        order.status === 'SHIPPED' || order.status === 'Shipped' ? 'yellow' : 'blue';
                      
                      return (
                        <OrderRow
                          key={order.order_id}
                          image={order.image || "https://lh3.googleusercontent.com/aida-public/AB6AXuChu4R7OwQ8ETkPLyBovCUHdrB2jioozFFzmFmd7vgObnmLRo7wsqRueSpgGRdzWQF8sudBJEwKxUIhPl4e6ktt1cWSdTKPo7SKd4R0vQldPZ2kQ93SEGxagNTbpenyKVDOZluRtAG8oHpbWAf61cG5l0WYlUMCeQpg16SZ5y9myjMsJCkCakxue4devmQfpfQHcAR6Y18nMkgfWw1_UEeXvIKjxuNcWNX3SMflBo54elTH8Weba2vb1haWBGDFi7GPNUe5ETXixQ9w"}
                          productName={order.product_name || `Order ${order.order_id}`}
                          category={order.category || 'Service'}
                          orderId={order.order_id}
                          date={orderDate}
                          status={order.status}
                          statusColor={statusColor}
                          amount={`₹${order.total_amount}`}
                        />
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
            
            <div className="flex justify-end gap-2 mt-4">
              <button type="button" onClick={closeOrdersModal} className="px-4 py-2 rounded bg-gray-100">Close</button>
            </div>
          </div>
        </div>
      )}

      {/* Ritual Details Modal */}
      {isRitualDetailsModalOpen && (
        <div className="fixed inset-0 z-60 flex items-center justify-center">
          <div className="absolute inset-0 modal-backdrop" onClick={closeRitualDetailsModal}></div>
          <div className="relative z-70 w-full max-w-2xl p-6 rounded-2xl bg-white shadow-2xl animate-pop-strong max-h-[80vh] overflow-y-auto border border-[#cfd8a3] ring-1 ring-[#e3ebbd]">
            <h2 className="text-xl font-serif font-semibold text-[#2f3a1f] mb-4">Griha Pravesh Pooja - Details</h2>
            <div className="space-y-4">
              <div className="rounded-xl overflow-hidden shadow-lg mb-4">
                <img
                  alt="Griha Pravesh"
                  className="w-full h-64 object-cover"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuBr4CkQZdDBtyiP5TG4kI2jPAKgO9PG9gqOpQCew_k5Kiy09t3kAKd00vzySn_4n25u1rLkqJj9PX3TDadhkGudDl73w3_GvNPR5Te9lbQcdggPDFqrKQ9Cg_l7kWMor-qRbuQ1185SHbniviSZULKNaZRHRFuychoxjarIklVnd5_PLo4dvL9_5Xy59xkmbQEvydncDEu8MXVgtxwunPfQLUoY4vuZAjN_X54uPsCYkVVDHzcpkhSXRr1qjPmw3lfH5q_kR0EHWb7W"
                />
              </div>
              <div>
                <h3 className="text-lg font-serif font-semibold text-[#2f3a1f] mb-2">Booking Information</h3>
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 bg-white rounded-lg border border-[#cfd8a3] ring-1 ring-[#e3ebbd] hover:border-[#2f9e44] hover:ring-[#2f9e44] hover:-translate-y-0.5 transition-all cursor-pointer">
                    <p className="text-xs text-text-light font-bold uppercase">Booking ID</p>
                    <p className="text-sm font-semibold text-[#4f5d2f]">#BK-8902</p>
                  </div>
                  <div className="p-3 bg-white rounded-lg border border-[#cfd8a3] ring-1 ring-[#e3ebbd] hover:border-[#2f9e44] hover:ring-[#2f9e44] hover:-translate-y-0.5 transition-all cursor-pointer">
                    <p className="text-xs text-text-light font-bold uppercase">Status</p>
                    <p className="text-sm font-semibold text-[#4f5d2f]">Confirmed</p>
                  </div>
                  <div className="p-3 bg-white rounded-lg border border-[#cfd8a3] ring-1 ring-[#e3ebbd] hover:border-[#2f9e44] hover:ring-[#2f9e44] hover:-translate-y-0.5 transition-all cursor-pointer">
                    <p className="text-xs text-text-light font-bold uppercase">Date</p>
                    <p className="text-sm font-semibold text-[#4f5d2f]">Jan 15, 2026</p>
                  </div>
                  <div className="p-3 bg-white rounded-lg border border-[#cfd8a3] ring-1 ring-[#e3ebbd] hover:border-[#2f9e44] hover:ring-[#2f9e44] hover:-translate-y-0.5 transition-all cursor-pointer">
                    <p className="text-xs text-text-light font-bold uppercase">Time</p>
                    <p className="text-sm font-semibold text-[#4f5d2f]">09:00 AM IST</p>
                  </div>
                </div>
              </div>
              <div>
                <h3 className="text-lg font-serif font-semibold text-[#2f3a1f] mb-2">Pandit Information</h3>
                <div className="p-3 bg-white rounded-lg border border-[#cfd8a3] ring-1 ring-[#e3ebbd] hover:border-[#2f9e44] hover:ring-[#2f9e44] hover:-translate-y-0.5 transition-all cursor-pointer">
                  <p className="text-sm font-semibold text-[#4f5d2f]">Pandit Ravi Shastri & Team</p>
                  <p className="text-xs text-text-light mt-1">Experience: 15+ years</p>
                </div>
              </div>
              <div>
                <h3 className="text-lg font-serif font-semibold text-[#2f3a1f] mb-2">About This Pooja</h3>
                <p className="text-sm text-[#4f5d2f] leading-relaxed p-3 bg-white rounded-lg border border-[#cfd8a3] ring-1 ring-[#e3ebbd] hover:border-[#2f9e44] hover:ring-[#2f9e44] hover:-translate-y-0.5 transition-all cursor-pointer">Griha Pravesh is a sacred Hindu ritual performed to purify and bless a new home. This ceremony invokes divine blessings for prosperity, peace, and well-being in the household.</p>
              </div>
              <div>
                <h3 className="text-lg font-serif font-semibold text-[#2f3a1f] mb-2">What's Included</h3>
                <div className="p-3 bg-white rounded-lg border border-[#cfd8a3] ring-1 ring-[#e3ebbd] hover:border-[#2f9e44] hover:ring-[#2f9e44] hover:-translate-y-0.5 transition-all cursor-pointer">
                  <ul className="text-sm text-[#4f5d2f] space-y-1">
                    <li>✓ Full Griha Pravesh ceremony</li>
                    <li>✓ All required materials and offerings</li>
                    <li>✓ Prasad for all attendees</li>
                    <li>✓ Certificate of completion</li>
                  </ul>
                </div>
              </div>
            </div>
            <div className="flex justify-end gap-2 mt-4">
              <button type="button" onClick={closeRitualDetailsModal} className="px-4 py-2 rounded bg-gray-100">Close</button>
            </div>
          </div>
        </div>
      )}

      {/* All Bookings Modal */}
      {isBookingsModalOpen && (
        <div className="fixed inset-0 z-60 flex items-center justify-center">
          <div className="absolute inset-0 modal-backdrop" onClick={closeBookingsModal}></div>
          <div className="relative z-70 w-full max-w-3xl p-6 rounded-2xl bg-white shadow-2xl animate-pop-strong max-h-[80vh] overflow-y-auto border border-[#cfd8a3] ring-1 ring-[#e3ebbd]">
            <h2 className="text-xl font-serif font-semibold text-[#2f3a1f] mb-4">All Upcoming Bookings</h2>
            <div className="space-y-3">
              {/* Column Headers */}
              <div className="flex items-center justify-between px-3 py-1.5 bg-primary/5 rounded-lg">
                <div className="flex items-center gap-2 flex-[2]">
                  <span className="text-[10px] font-bold text-text-light uppercase tracking-wider">Service</span>
                </div>
                <div className="flex-1 text-center">
                  <span className="text-[10px] font-bold text-text-light uppercase tracking-wider">Date</span>
                </div>
                <div className="flex-1 text-center">
                  <span className="text-[10px] font-bold text-text-light uppercase tracking-wider">Time</span>
                </div>
                <div className="flex-1 text-center">
                  <span className="text-[10px] font-bold text-text-light uppercase tracking-wider">Status</span>
                </div>
              </div>
              {confirmedBooking && (
                <div className="flex items-center justify-between p-2 bg-white rounded-xl border border-[#cfd8a3] ring-1 ring-[#e3ebbd] hover:-translate-y-1 hover:shadow-lg hover:border-[#2f9e44] hover:ring-[#2f9e44] transition-all cursor-pointer group">
                  <div className="flex items-center gap-2 flex-[2]">
                    <img alt={confirmedBooking.service} className="w-6 h-6 rounded-lg object-cover" src={confirmedBooking.image} />
                    <div>
                      <p className="text-xs font-semibold text-[#2f3a1f]">{confirmedBooking.service}</p>
                      <p className="text-[10px] text-text-light">{confirmedBooking.person}</p>
                    </div>
                  </div>
                  <div className="flex-1 text-center">
                    <span className="text-xs text-[#4f5d2f] font-medium">{confirmedBooking.date}</span>
                  </div>
                  <div className="flex-1 text-center">
                    <span className="text-xs text-[#4f5d2f] font-medium">{confirmedBooking.time}</span>
                  </div>
                  <div className="flex-1 text-center">
                    <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-[10px] font-bold bg-amber-100 text-[#4f5d2f]">CONFIRMED</span>
                  </div>
                </div>
              )}
              {pendingBookings.length === 0 && (
                <div className="p-3 text-center text-text-light bg-white rounded-xl border border-[#cfd8a3] ring-1 ring-[#e3ebbd]">
                  No pending bookings.
                </div>
              )}
              {pendingBookings.map((b, idx) => (
                <div key={`${b.service}-${idx}`} className="flex items-center justify-between p-2 bg-white rounded-xl border border-[#cfd8a3] ring-1 ring-[#e3ebbd] hover:-translate-y-1 hover:shadow-lg hover:border-[#2f9e44] hover:ring-[#2f9e44] transition-all cursor-pointer group">
                  <div className="flex items-center gap-2 flex-[2]">
                    <img alt={b.service} className="w-6 h-6 rounded-lg object-cover" src={b.image} />
                    <div>
                      <p className="text-xs font-semibold text-[#2f3a1f]">{b.service}</p>
                      <p className="text-[10px] text-text-light">{b.person}</p>
                    </div>
                  </div>
                  <div className="flex-1 text-center">
                    <span className="text-xs text-[#4f5d2f] font-medium">{b.date}</span>
                  </div>
                  <div className="flex-1 text-center">
                    <span className="text-xs text-[#4f5d2f] font-medium">{b.time}</span>
                  </div>
                  <div className="flex-1 text-center">
                    <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-[10px] font-bold bg-amber-100 text-[#4f5d2f]">{b.status}</span>
                  </div>
                </div>
              ))}
            </div>
            <div className="flex justify-end gap-2 mt-4">
              <button type="button" onClick={closeBookingsModal} className="px-4 py-2 font-semibold text-sm text-[#2f9e44] border border-[#2f9e44] rounded-lg bg-white hover:bg-[#eef4cf]">Close</button>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="flex-1 w-full max-w-[1400px] mx-auto px-4 md:px-6 pt-24 pb-8 flex flex-col gap-4 relative z-10">

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
          {/* Sidebar with Preferences */}
          <aside className="lg:col-span-3 flex flex-col gap-4 sticky top-24">
            <UserProfileCard handleButtonClick={handleButtonClick} profile={profile} onEdit={openEditModal} isActive={activeSection === 'profilecard'} onActive={() => setActiveSection('profilecard')} />
            <Preferences
              notificationsEnabled={notificationsEnabled}
              setNotificationsEnabled={setNotificationsEnabled}
              twoFactorEnabled={twoFactorEnabled}
              setTwoFactorEnabled={setTwoFactorEnabled}
              handleButtonClick={handleButtonClick}
              isActive={activeSection === 'preferences'}
              activePreference={activePreference}
              setActivePreference={setActivePreference}
            />
          </aside>

          {/* Content Area */}
          <div className="lg:col-span-9 flex flex-col gap-4">
            <div id="section-stats">
              <StatsCards isActive={activeSection === 'stats'} onActive={() => setActiveSection('stats')} />
            </div>
            <div id="section-ritual">
              <UpcomingRitual handleButtonClick={handleButtonClick} isActive={activeSection === 'ritual'} onActive={() => setActiveSection('ritual')} onViewDetails={openRitualDetailsModal} onViewAllBookings={openBookingsModal} />
            </div>
            <div id="section-orders">
              <RecentOrders isActive={activeSection === 'orders'} onActive={() => setActiveSection('orders')} onViewFullOrders={openOrdersModal} />
              <AddToServices 
                onOpen={openAddServicesModal}
                selectedServiceIds={selectedServiceIds}
                availableServices={availableServices}
                setSelectedServiceIds={setSelectedServiceIds}
                setServiceConfigs={setServiceConfigs}
                setShowCouponInput={setShowCouponInput}
                setCouponCode={setCouponCode}
                setAppliedCoupon={setAppliedCoupon}
              />
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-primary/10 relative overflow-hidden mt-8">
        <div className="absolute top-0 left-0 w-full h-2 bg-maathre-gradient"></div>
        <div className="max-w-7xl mx-auto px-6 py-8 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-3">
            <h2 className="font-serif text-[24px] font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-[#dca500] to-[#65a30d]">maathre</h2>
          </div>
          <div className="text-text-light/80 text-xs font-medium">© 2026 Maathre Spiritual Services. All rights reserved.</div>
          <div className="flex gap-6">
            <a className="text-[#5f6d2b] hover:text-primary transition-colors text-xs font-semibold" href="#">
              Privacy Policy
            </a>
            <a className="text-[#5f6d2b] hover:text-primary transition-colors text-xs font-semibold" href="#">
              Terms of Service
            </a>
            <a className="text-[#5f6d2b] hover:text-primary transition-colors text-xs font-semibold" href="#">
              Support
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
};

// Component: Navigation Link
interface NavLinkProps {
  icon: string;
  label: string;
  active?: boolean;
  onClick?: () => void;
}

const NavLink: React.FC<NavLinkProps> = ({ icon, label, active = false, onClick }) => (
  <a
    className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all duration-300 font-medium text-sm cursor-pointer group hover:bg-amber-200 ${
      active
        ? 'bg-primary-dark text-white shadow-md shadow-primary-dark/20'
        : 'text-[#4f5d2f] hover:text-[#4f5d2f]'
    }`}
    href="#"
    onClick={(e) => { e.preventDefault(); onClick?.(); }}
  >
    <span className="material-symbols-outlined text-[18px]">{icon}</span>
    {label}
  </a>
);

// Component: User Profile Card
interface UserProfileCardProps {
  handleButtonClick?: (message: string) => void;
  profile: { user_id: string; email: string; is_new_user: boolean };
  onEdit?: () => void;
  isActive?: boolean;
  onActive?: () => void;
}

const UserProfileCard: React.FC<UserProfileCardProps> = ({ handleButtonClick, profile, onEdit, isActive, onActive }) => (
  <div
    className={`p-4 rounded-2xl text-center cursor-pointer transition-all border border-[#cfd8a3] bg-white ring-1 ring-[#e3ebbd] hover:-translate-y-1 hover:shadow-lg hover:border-[#2f9e44] hover:ring-[#2f9e44] ${
      isActive ? 'bg-amber-100' : ''
    }`}
    role="button"
    tabIndex={0}
    onClick={() => { onActive?.(); onEdit?.(); }}
    onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onActive?.(); onEdit?.(); } }}
  >
    <div className="relative w-16 h-16 mx-auto mb-2">
      <img
        alt="User"
        className="w-full h-full rounded-full border-4 border-white shadow-md object-cover"
        src="https://lh3.googleusercontent.com/aida-public/AB6AXuD75A468_-fBi_vcTbkEZACzaDvcSB5tw1PDfm1n5qswMud0TCg6NV-ouCW2HbFvqHSymEqsxUKQ0ox_nSPwirVoVPJgIhKJfQlq35fUsfQgAqnkz2zbmfcYnklLl4_-Uq3MtDgO0tEI9yP2ga5aoPuBawqZB5eKc_uvzFbbbW3VEMFpm2v5eIMqDvYGHJX0AmXwjflF8Ny99pnVvRm67T3Dvr7Skv6RTfYUrFvL8PPyIs6RRORwMgCcL3NiaIdVsPsZN-ks6q6kjjF"
      />
    </div>
    <div className="flex items-center justify-center gap-2">
      <h3 className="font-serif font-semibold text-lg text-[#2f3a1f] m-0">{profile.email}</h3>
    </div>
    <p className="text-text-light text-xs mb-2">Devotee since 2022</p>
    <div className="inline-flex items-center gap-1 bg-primary-soft text-[#4f5d2f] text-xs font-bold px-2 py-0.5 rounded-full">
      <span className="material-symbols-outlined text-[10px] filled">stars</span>
      Premium Member
    </div>
  </div>
);

// Component: Sidebar Menu
interface SidebarMenuProps {
  onItemClick?: (message: string) => void;
  isActive?: boolean;
  onActive?: () => void;
  onNavigate?: (section: string) => void;
}

const SidebarMenu: React.FC<SidebarMenuProps> = ({ onItemClick, isActive, onActive, onNavigate }) => {
  const handleScroll = (sectionId: string, section: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
    onActive?.();
    onNavigate?.(section);
  };

  return (
    <div className={`rounded-2xl overflow-hidden p-1.5 flex flex-col gap-0.5 transition-all border border-[#cfd8a3] bg-white ring-1 ring-[#e3ebbd] hover:-translate-y-1 hover:shadow-lg hover:border-[#2f9e44] hover:ring-[#2f9e44] ${
      isActive ? 'bg-amber-100' : ''
    }`} onClick={() => onActive?.()}>
      <SidebarItem icon="dashboard" label="Dashboard" active={true} onItemClick={() => { handleScroll('section-stats', 'stats'); }} />
      <SidebarItem icon="person" label="Personal Info" onItemClick={() => { handleScroll('section-profilecard', 'profilecard'); }} />
      <SidebarItem icon="temple_hindu" label="My Bookings" onItemClick={() => { handleScroll('section-ritual', 'ritual'); }} />
      <SidebarItem icon="shopping_bag" label="Order History" onItemClick={() => { handleScroll('section-orders', 'orders'); }} />
      <SidebarItem icon="settings" label="Settings" onItemClick={() => { handleScroll('section-profileprefs', 'profileprefs'); }} />
      <div className="h-px bg-primary/10 my-0.5 mx-2"></div>
      <SidebarItem icon="logout" label="Log Out" isLogout={true} onItemClick={() => { onActive?.(); }} />
    </div>
  );
};

interface SidebarItemProps {
  icon: string;
  label: string;
  active?: boolean;
  badge?: string;
  isLogout?: boolean;
  onItemClick?: () => void;
}

const SidebarItem: React.FC<SidebarItemProps> = ({ icon, label, active = false, badge, isLogout = false, onItemClick }) => (
  <a
    className={`flex items-center gap-3 px-3 py-1.5 rounded-lg transition-all font-medium text-xs cursor-pointer group hover:-translate-y-0.5 hover:drop-shadow-md ${
      isLogout
        ? 'text-red-400 hover:bg-amber-200'
        : active
          ? 'sidebar-item-active'
          : 'sidebar-item-inactive hover:bg-amber-200'
    }`}
    href="#"
    onClick={(e) => {
      e.preventDefault();
      onItemClick?.();
    }}
  >
    <span className={`material-symbols-outlined text-[16px] transition-transform`} style={active ? { fontVariationSettings: "'FILL' 1" } : {}}>
      {icon}
    </span>
    {label}
    {badge && <span className="ml-auto bg-accent text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full">{badge}</span>}
  </a>
);

// Component: Stats Cards
interface StatsCardsProps {
  isActive?: boolean;
  onActive?: () => void;
}

const StatsCards: React.FC<StatsCardsProps> = ({ isActive, onActive }) => (
  <div className={`grid grid-cols-1 md:grid-cols-3 gap-2 transition-all ${
    isActive ? 'bg-amber-50 p-4 rounded-2xl' : ''
  }`} onClick={() => onActive?.()}>
    <StatCard
      icon="temple_hindu"
      iconBg="bg-amber-100"
      iconColor="text-[#5f6d2b]"
      title="Total Poojas"
      value="12"
      badge="This Year"
      hoverIconBg="group-hover:bg-amber-300 group-hover:text-white"
    />
    <StatCard
      icon="shopping_bag"
      iconBg="bg-amber-100"
      iconColor="text-[#4f5d2f]"
      title="Active Orders"
      value="3"
      badge="Pending"
      hoverIconBg="group-hover:bg-amber-300 group-hover:text-white"
    />
    <StatCard
      icon="volunteer_activism"
      iconBg="bg-amber-100"
      iconColor="text-[#4f5d2f]"
      title="Contribution"
      value="₹5k+"
      badge="Donations"
      hoverIconBg="group-hover:bg-amber-300 group-hover:text-white"
    />
  </div>
);

interface StatCardProps {
  icon: string;
  iconBg: string;
  iconColor: string;
  title: string;
  value: string;
  badge: string;
  hoverIconBg: string;
}

const StatCard: React.FC<StatCardProps> = ({ icon, iconBg, iconColor, title, value, badge, hoverIconBg }) => (
  <div className="bg-white p-3 rounded-2xl shadow-sm transition-all group cursor-pointer border border-[#cfd8a3] ring-1 ring-[#e3ebbd] hover:-translate-y-1 hover:border-[#2f9e44] hover:ring-[#2f9e44]">
    <div className="flex items-start justify-between mb-2">
      <div className={`${iconBg} p-1.5 rounded-xl ${iconColor} transition-colors`}>
        <span className="material-symbols-outlined text-[18px]" style={{ fontVariationSettings: "'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 20" }}>{icon}</span>
      </div>
      <span className="text-xs font-bold text-text-light bg-cream-dark px-2 py-0.5 rounded-md">{badge}</span>
    </div>
    <p className="text-[#4f5d2f] text-sm font-medium">{title}</p>
    <h4 className="text-xl font-serif font-semibold text-[#2f3a1f]">{value}</h4>
  </div>
);

// Component: Upcoming Ritual
interface UpcomingRitualProps {
  handleButtonClick?: (message: string) => void;
  isActive?: boolean;
  onActive?: () => void;
  onViewDetails?: () => void;
  onViewAllBookings?: () => void;
}

const UpcomingRitual: React.FC<UpcomingRitualProps> = ({ handleButtonClick, isActive, onActive, onViewDetails, onViewAllBookings }) => (
  <section className="rounded-2xl p-4 border border-[#cfd8a3] bg-white ring-1 ring-[#e3ebbd] transition-all">
    <div className="flex items-center justify-between mb-3">
      <h3 className="text-xl font-serif font-semibold text-[#2f3a1f]">Upcoming Ritual</h3>
      <button onClick={() => onViewAllBookings?.()} className="text-sm font-medium text-black hover:text-gray-800 transition-all cursor-pointer bg-none border-none p-0 inline-flex items-center gap-1 hover:-translate-y-0.5 hover:drop-shadow-md">
        <span className="material-symbols-outlined text-[14px] text-black">event</span>
        View All Bookings
      </button>
    </div>
    <div className="rounded-2xl overflow-hidden group hover:-translate-y-1 hover:shadow-lg hover:border-[#2f9e44] hover:ring-[#2f9e44] transition-all cursor-pointer border border-[#cfd8a3] ring-1 ring-[#e3ebbd]" onClick={() => onActive?.()}>
      <div className="rounded-xl flex flex-col md:flex-row gap-3 p-3 md:p-4 relative overflow-hidden bg-white">
        <div className="absolute top-0 right-0 w-64 h-64 bg-yellow-200/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>

        <div className="w-full md:w-1/3 h-32 md:h-auto rounded-xl overflow-hidden relative shadow-lg">
          <img
            alt="Griha Pravesh"
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuBr4CkQZdDBtyiP5TG4kI2jPAKgO9PG9gqOpQCew_k5Kiy09t3kAKd00vzySn_4n25u1rLkqJj9PX3TDadhkGudDl73w3_GvNPR5Te9lbQcdggPDFqrKQ9Cg_l7kWMor-qRbuQ1185SHbniviSZULKNaZRHRFuychoxjarIklVnd5_PLo4dvL9_5Xy59xkmbQEvydncDEu8MXVgtxwunPfQLUoY4vuZAjN_X54uPsCYkVVDHzcpkhSXRr1qjPmw3lfH5q_kR0EHWb7W"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
          <div className="absolute top-2 left-2 bg-white/90 backdrop-blur text-[#4f5d2f] text-xs font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
            <span className="w-1.5 h-1.5 bg-amber-400 rounded-full animate-pulse"></span>
            CONFIRMED
          </div>
          <div className="absolute bottom-2 left-2 text-white">
            <p className="text-xs font-medium opacity-90">Booking ID: #BK-8902</p>
          </div>
        </div>

        <div className="flex-1 flex flex-col justify-between gap-2 relative z-10">
          <div>
            <div className="flex items-start justify-between">
              <h4 className="text-xl font-serif font-bold text-[#2f3a1f] mb-0.5">Griha Pravesh Pooja</h4>
              <div className="bg-primary/10 text-[#4f5d2f] p-1.5 rounded-md">
                <span className="material-symbols-outlined text-[16px]">calendar_clock</span>
              </div>
            </div>
            <p className="text-sm text-text-light mb-2 font-medium">Performed by Pandit Ravi Shastri &amp; Team</p>
            <div className="grid grid-cols-2 gap-2 mb-2">
              <div className="flex items-center gap-2 bg-white/60 backdrop-blur-md p-2 rounded-lg">
                <span className="material-symbols-outlined text-accent-dark text-[16px]">event</span>
                <div>
                  <p className="text-xs text-text-light font-bold uppercase">Date</p>
                  <p className="text-sm font-semibold text-[#4f5d2f]">Jan 15, 2026</p>
                </div>
              </div>
              <div className="flex items-center gap-2 bg-white/60 backdrop-blur-md p-2 rounded-lg">
                <span className="material-symbols-outlined text-accent-dark text-[16px]">schedule</span>
                <div>
                  <p className="text-xs text-text-light font-bold uppercase">Time</p>
                  <p className="text-sm font-semibold text-[#4f5d2f]">09:00 AM IST</p>
                </div>
              </div>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            <button onClick={() => handleButtonClick?.('💬 Chat Opened')} className="px-4 py-2 font-semibold text-sm text-[#2f9e44] hover:text-[#2f9e44] bg-white border border-[#2f9e44] hover:bg-white hover:border-[#2f9e44] hover:ring-1 hover:ring-[#2f9e44] transition-all flex items-center gap-2 justify-center flex-1 md:flex-none cursor-pointer rounded-lg hover:-translate-y-1">
              <span className="material-symbols-outlined text-[16px]">chat</span>
              Chat with Pandit
            </button>
            <button onClick={(e) => { e.stopPropagation(); onActive?.(); onViewDetails?.(); }} className="px-4 py-2 font-semibold text-sm text-[#2f9e44] hover:text-[#2f9e44] bg-white border border-[#2f9e44] hover:bg-white hover:border-[#2f9e44] hover:ring-1 hover:ring-[#2f9e44] transition-all flex items-center gap-2 justify-center flex-1 md:flex-none cursor-pointer rounded-lg hover:-translate-y-1">
              View Details
            </button>
          </div>
        </div>
      </div>
    </div>
  </section>
);

// Component: Profile and Preferences
interface ProfileAndPreferencesProps {
  notificationsEnabled: boolean;
  setNotificationsEnabled: (value: boolean) => void;
  twoFactorEnabled: boolean;
  setTwoFactorEnabled: (value: boolean) => void;
  handleButtonClick?: (message: string, type?: Notification['type'], emoji?: string) => void;
  handleEditOpen?: () => void;
  profile: { user_id: string; email: string; is_new_user: boolean };
  isActive?: boolean;
  onActive?: () => void;
  activePreference?: string | null;
  setActivePreference?: (value: string | null) => void;
}

const ProfileAndPreferences: React.FC<ProfileAndPreferencesProps> = ({
  notificationsEnabled,
  setNotificationsEnabled,
  twoFactorEnabled,
  setTwoFactorEnabled,
  handleButtonClick,
  handleEditOpen,
    profile,
    isActive,
    onActive,
    activePreference,
    setActivePreference,
  }) => (
    <div className={`grid grid-cols-1 md:grid-cols-2 gap-4 transition-all ${
      isActive ? 'bg-amber-50 p-4 rounded-2xl' : ''
    }`} onClick={() => onActive?.()}>
      <ProfileDetails handleButtonClick={handleButtonClick} onEdit={handleEditOpen} profile={profile} isActive={isActive} />
      <Preferences
        notificationsEnabled={notificationsEnabled}
        setNotificationsEnabled={setNotificationsEnabled}
        twoFactorEnabled={twoFactorEnabled}
        setTwoFactorEnabled={setTwoFactorEnabled}
        handleButtonClick={handleButtonClick}
        isActive={isActive}
        activePreference={activePreference}
        setActivePreference={setActivePreference}
      />
    </div>
  );

interface ProfileDetailsProps {
  profile: { user_id: string; email: string; is_new_user: boolean };
  onEdit?: () => void;
  handleButtonClick?: (message: string, type?: Notification['type'], emoji?: string) => void;
  isActive?: boolean;
}

const ProfileDetails: React.FC<ProfileDetailsProps> = ({ profile, onEdit, handleButtonClick, isActive }) => {
  return (
    <section
      role="button"
      tabIndex={0}
      onClick={() => onEdit?.()}
      onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onEdit?.(); } }}
      className="bg-white rounded-2xl p-4 shadow-sm cursor-pointer transition-all border border-[#cfd8a3] ring-1 ring-[#e3ebbd] hover:-translate-y-1 hover:shadow-lg hover:border-[#2f9e44] hover:ring-[#2f9e44]"
    >
      <div className="flex items-start justify-between gap-3 mb-3">
        <h3 className="text-xl font-serif font-semibold text-[#2f3a1f] flex-1">Profile Details</h3>
        <button onClick={(e) => { e.stopPropagation(); onEdit?.(); }} className="text-primary hover:text-[#4f5d2f] p-2 hover:bg-primary-soft rounded-full transition-all cursor-pointer group flex-shrink-0 hover:-translate-y-0.5 hover:drop-shadow-md" aria-label="Edit profile details">
          <span className="material-symbols-outlined text-[16px] group-hover:scale-125 transition-transform">edit_square</span>
        </button>
      </div>
      <div className="space-y-1.5 divide-y divide-white/60">
        <ProfileDetailItem icon="person" label="User ID" value={profile.user_id} />
        <ProfileDetailItem icon="mail" label="Email Address" value={profile.email} />
      </div>
    </section>
  );
};

interface ProfileDetailItemProps {
  icon: string;
  label: string;
  value: string;
}

const ProfileDetailItem: React.FC<ProfileDetailItemProps> = ({ icon, label, value }) => (
      <div className="flex items-center gap-3 p-3 bg-white rounded-2xl border border-[#cfd8a3] ring-1 ring-[#e3ebbd] hover:bg-amber-200 transition-all cursor-pointer group hover:-translate-y-0.5 hover:shadow-md hover:border-[#2f9e44] hover:ring-[#2f9e44]">
    <div className="w-7 h-7 rounded-full bg-cream-dark flex items-center justify-center text-[#5f6d2b] group-hover:bg-primary group-hover:text-white transition-colors">
      <span className="material-symbols-outlined text-[16px] group-hover:scale-125 transition-transform">{icon}</span>
    </div>
    <div>
      <p className="text-xs text-text-light font-bold uppercase">{label}</p>
      <p className="text-xs text-[#5f6d2b] font-medium">{value}</p>
    </div>
  </div>
);

interface PreferencesProps {
  notificationsEnabled: boolean;
  setNotificationsEnabled: (value: boolean) => void;
  twoFactorEnabled: boolean;
  setTwoFactorEnabled: (value: boolean) => void;
  handleButtonClick?: (message: string, type?: Notification['type'], emoji?: string) => void;
  isActive?: boolean;
  activePreference?: string | null;
  setActivePreference?: (value: string | null) => void;
}

const Preferences: React.FC<PreferencesProps> = ({
  notificationsEnabled,
  setNotificationsEnabled,
  twoFactorEnabled,
  setTwoFactorEnabled,
  handleButtonClick,
  isActive,
  activePreference,
  setActivePreference,
}) => {
  const router = useRouter();

  const handleLogout = () => {
    // Clear auth data if stored
    localStorage.removeItem('authToken');
    localStorage.removeItem('userProfile');
    // Redirect to login
    router.push('/login');
  };

  return (
    <section className="rounded-2xl border border-[#cfd8a3] bg-white ring-1 ring-[#e3ebbd] p-6 transition-all flex flex-col">
      <h3 className="text-xl font-serif font-semibold text-[#2f3a1f] mb-4">Preferences</h3>
      <div className="space-y-2 flex-1">
        <PreferenceToggle
          icon="notifications"
          label="Notifications"
          enabled={notificationsEnabled}
          onChange={setNotificationsEnabled}
          isActive={activePreference === 'notifications'}
          onActive={() => setActivePreference?.('notifications')}
        />
        <PreferenceToggle
          icon="security"
          label="Two-Factor Auth"
          enabled={twoFactorEnabled}
          onChange={setTwoFactorEnabled}
          isActive={activePreference === 'twofa'}
          onActive={() => setActivePreference?.('twofa')}
        />
      </div>
      <button
        onClick={handleLogout}
        className="w-full mt-4 px-4 py-2 font-semibold text-sm text-white bg-[#2f9e44] hover:bg-[#268a3b] transition-all flex items-center justify-center gap-2 cursor-pointer rounded-lg group hover:-translate-y-1"
      >
        <span className="material-symbols-outlined text-[18px] group-hover:scale-125 transition-transform">logout</span>
        Logout
      </button>
    </section>
  );
};

interface PreferenceToggleProps {
  icon: string;
  label: string;
  enabled: boolean;
  onChange: (value: boolean) => void;
  isActive?: boolean;
  onActive?: () => void;
}

const PreferenceToggle: React.FC<PreferenceToggleProps> = ({ icon, label, enabled, onChange, isActive, onActive }) => (
  <div className={`flex items-center justify-between p-3 bg-white rounded-2xl cursor-pointer group transition-all border ${
    isActive ? 'border-[#2f9e44] ring-1 ring-[#2f9e44]' : 'border-[#cfd8a3] ring-1 ring-[#e3ebbd]'
  } hover:-translate-y-0.5 hover:shadow-lg hover:border-[#2f9e44] hover:ring-[#2f9e44]`} onClick={() => onActive?.()}>
    <div className="flex items-center gap-2">
      <span className="material-symbols-outlined text-[#4f5d2f] text-[18px] group-hover:text-[#2f9e44] transition-colors">{icon}</span>
      <span className="text-sm font-medium text-[#2f3a1f] group-hover:text-[#2f9e44] transition-colors">{label}</span>
    </div>
    <button
      onClick={(e) => { e.stopPropagation(); onChange(!enabled); onActive?.(); }}
      className={`relative inline-flex h-4 w-8 items-center rounded-full transition-colors cursor-pointer ${enabled ? 'bg-[#2f9e44]' : 'bg-gray-200'}`}
    >
      <span
        className={`inline-block h-3 w-3 transform rounded-full bg-white transition-transform ${
          enabled ? 'translate-x-4' : 'translate-x-1'
        }`}
      ></span>
    </button>
  </div>
);

interface PreferenceItemProps {
  icon: string;
  label: string;
  value: string;
}

const PreferenceItem: React.FC<PreferenceItemProps> = ({ icon, label, value }) => (
  <div className="flex items-center justify-between p-3 bg-white rounded-2xl cursor-pointer group transition-all border border-[#cfd8a3] ring-1 ring-[#e3ebbd] hover:-translate-y-0.5 hover:shadow-lg hover:border-[#2f9e44] hover:ring-[#2f9e44]">
    <div className="flex items-center gap-2">
      <span className="material-symbols-outlined text-[#4f5d2f] text-[18px] group-hover:text-[#2f9e44] transition-colors">{icon}</span>
      <span className="text-sm font-medium text-[#2f3a1f] group-hover:text-[#2f9e44] transition-colors">{label}</span>
    </div>
    <span className="text-sm font-semibold text-text-light bg-[#eef4cf] px-2 py-0.5 rounded-full">{value}</span>
  </div>
);

// Component: Recent Orders
interface RecentOrdersProps {
  isActive?: boolean;
  onActive?: () => void;
  onViewFullOrders?: () => void;
}

const RecentOrders: React.FC<RecentOrdersProps> = ({ isActive, onActive, onViewFullOrders }) => (
  <section className="rounded-2xl p-4 border border-[#cfd8a3] bg-white ring-1 ring-[#e3ebbd] transition-all">
    <div className="flex items-center justify-between mb-3">
      <h3 className="text-xl font-serif font-semibold text-[#2f3a1f]">Recent Orders</h3>
    </div>
    <div className="space-y-3" onClick={() => onActive?.()}>
      {/* Column Headers */}
      <div className="flex items-center justify-between px-3 py-1.5 bg-primary/5 rounded-lg">
        <div className="flex items-center gap-2 flex-[2]">
          <span className="text-[10px] font-bold text-text-light uppercase tracking-wider">Product/Service</span>
        </div>
        <div className="flex-1 text-center">
          <span className="text-[10px] font-bold text-text-light uppercase tracking-wider">Order ID</span>
        </div>
        <div className="flex-1 text-center">
          <span className="text-[10px] font-bold text-text-light uppercase tracking-wider">Date</span>
        </div>
        <div className="flex-1 text-center">
          <span className="text-[10px] font-bold text-text-light uppercase tracking-wider">Status</span>
        </div>
        <div className="flex-1 text-center">
          <span className="text-[10px] font-bold text-text-light uppercase tracking-wider">Amount</span>
        </div>
      </div>
      
      <OrderRow
        image="https://lh3.googleusercontent.com/aida-public/AB6AXuChu4R7OwQ8ETkPLyBovCUHdrB2jioozFFzmFmd7vgObnmLRo7wsqRueSpgGRdzWQF8sudBJEwKxUIhPl4e6ktt1cWSdTKPo7SKd4R0vQldPZ2kQ93SEGxagNTbpenyKVDOZluRtAG8oHpbWAf61cG5l0WYlUMCeQpg16SZ5y9myjMsJCkCakxue4devmQfpfQHcAR6Y18nMkgfWw1_UEeXvIKjxuNcWNX3SMflBo54elTH8Weba2vb1haWBGDFi7GPNUe5ETXixQ9w"
        productName="Premium Rudraksha Mala"
        category="Spiritual Accessories"
        orderId="#ORD-2891"
        date="Oct 12, 2024"
        status="Completed"
        statusColor="green"
        amount="₹1,299"
      />
      <OrderRow
        image="https://lh3.googleusercontent.com/aida-public/AB6AXuDs9pbArOnpyzqf-ilR_9wLZtu8V-lAkNDUEaEnZWO3zz7yU4c3jZmvartaUD0tnLHpa39vpdhpsiVC56Zj4IV_V7ivdInaFs9XBCkRvB1BK9R35Pyvgb6RHzriAwFyOnk2LQFy2H5Y4h-BlZfHy-thh_iV8BATUYHWHDWty-3aDae9TPLxLpsqgf1jwRLdfSeJQR7v8ZR9-hNxwj4d8XwXXyaSuvKRkYTTypTjpPvK2vi6qn8WL3-_HJopfprOCw7-cv2rOkauoPIu"
        productName="Vivah Sanskar Package"
        category="Ritual Service"
        orderId="#ORD-2845"
        date="Sep 28, 2024"
        status="Completed"
        statusColor="green"
        amount="₹15,000"
      />
      <OrderRow
        image="https://lh3.googleusercontent.com/aida-public/AB6AXuCqo0FhTUrz6-nWNfy8ywHrahiAxYCMI5AvPPfyqpTbRnrLGCsddTnwFM7_yjcWsNfOGGrj9NyDl6Ujj6iF_qiXzeTsdTiznHx4Bvx9ZTRFURZwrairL2hkhD45x63r4TJdZENhaQDHyITjN3bcQg-MwjBs-1urarRYEwTRqn3cwaPjfCaQjEaUlKKTbOFaNLtwZoVSFtc8cWW_ztYuza0bYII2larCYNCQaB1PZ6KpnlKVhyS6hpNijA3BnxJ-ZUoVTXQ7g0tns-cs"
        productName="Brass Pooja Thali Set"
        category="Home Decor"
        orderId="#ORD-2711"
        date="Sep 15, 2024"
        status="Completed"
        statusColor="green"
        amount="₹2,499"
      />
      <div className="p-2 text-center rounded-lg transition-all cursor-pointer bg-white border border-[#cfd8a3] ring-1 ring-[#e3ebbd] hover:-translate-y-1 hover:border-[#2f9e44] hover:ring-[#2f9e44]">
        <a onClick={(e) => { e.preventDefault(); onViewFullOrders?.(); }} className="text-sm font-medium text-[#2f9e44] hover:text-[#2f9e44] transition-colors inline-flex items-center gap-1 cursor-pointer group" href="#">
          View Full Order History
          <span className="material-symbols-outlined text-[14px] arrow-right group-hover:translate-x-1 text-[#2f9e44] group-hover:text-[#2f9e44]">arrow_forward</span>
        </a>
      </div>
    </div>
  </section>
);

interface OrderCardProps {
  image: string;
  productName: string;
  category: string;
  orderId: string;
  date: string;
  status: string;
  statusColor: 'green' | 'blue' | 'yellow';
  amount: string;
}

interface OrderRowProps {
  image: string;
  productName: string;
  category: string;
  orderId: string;
  date: string;
  status: string;
  statusColor: 'green' | 'blue' | 'yellow';
  amount: string;
}

const OrderRow: React.FC<OrderRowProps> = ({
  image,
  productName,
  category,
  orderId,
  date,
  status,
  statusColor,
  amount,
}) => {
  const statusColors = {
    green: 'bg-amber-100 text-[#4f5d2f]',
    blue: 'bg-blue-100 text-blue-700',
    yellow: 'bg-amber-100 text-[#4f5d2f]',
  };

  return (
    <div className="flex items-center justify-between p-2 bg-white rounded-xl border border-[#cfd8a3] ring-1 ring-[#e3ebbd] hover:-translate-y-1 hover:border-[#2f9e44] hover:ring-[#2f9e44] transition-all cursor-pointer group">
      <div className="flex items-center gap-2 flex-[2]">
        <img alt={productName} className="w-6 h-6 rounded-lg object-cover" src={image} />
        <div>
          <p className="text-xs font-semibold text-[#2f3a1f]">{productName}</p>
          <p className="text-[10px] text-text-light">{category}</p>
        </div>
      </div>
      <div className="flex-1 text-center">
        <span className="text-xs text-[#4f5d2f] font-medium">{orderId}</span>
      </div>
      <div className="flex-1 text-center">
        <span className="text-xs text-[#4f5d2f] font-medium">{date}</span>
      </div>
      <div className="flex-1 text-center">
        <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-[10px] font-bold ${statusColors[statusColor]}`}>
          {status}
        </span>
      </div>
      <div className="flex-1 text-center">
        <span className="text-xs text-[#4f5d2f] font-semibold">{amount}</span>
      </div>
    </div>
  );
};

// Component: Add To Services
const AddToServices: React.FC<{ 
  onOpen?: () => void;
  selectedServiceIds: number[];
  availableServices: any[];
  setSelectedServiceIds: (ids: number[]) => void;
  setServiceConfigs: (configs: any) => void;
  setShowCouponInput: (show: boolean) => void;
  setCouponCode: (code: string) => void;
  setAppliedCoupon: (coupon: string | null) => void;
}> = ({ 
  onOpen, 
  selectedServiceIds, 
  availableServices, 
  setSelectedServiceIds, 
  setServiceConfigs,
  setShowCouponInput,
  setCouponCode,
  setAppliedCoupon
}) => (
  <section className="rounded-2xl p-4 mt-4 border border-[#cfd8a3] bg-white ring-1 ring-[#e3ebbd] transition-all cursor-pointer hover:shadow-lg hover:-translate-y-1" onClick={() => onOpen?.()}>
    <div className="flex items-center justify-between mb-3">
      <h3 className="text-xl font-serif font-semibold text-[#2f3a1f]">
        Add to Services
      </h3>
    </div>
    
    {availableServices.length === 0 ? (
      <div className="py-8 text-center">
        <p className="text-sm text-[#4f5d2f] mb-1">No services available yet</p>
        <p className="text-xs text-text-light">Book services from the Services page</p>
      </div>
    ) : (
      <div>
        <p className="text-sm text-[#4f5d2f] mb-3">Available Services:</p>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {availableServices.map((svc) => (
            <div 
              key={svc.id} 
              className="flex flex-col items-center p-2 rounded-lg border border-[#cfd8a3] bg-[#fafcf0] hover:bg-[#eef4cf] transition-all"
            >
              <img 
                src={svc.image} 
                alt={svc.title} 
                className="w-16 h-16 rounded-lg object-cover border border-[#cfd8a3] mb-2"
              />
              <span className="text-xs font-semibold text-[#2f3a1f] text-center line-clamp-2">
                {svc.title}
              </span>
            </div>
          ))}
        </div>
        <p className="text-xs text-text-light mt-3 text-center">
          Click to select services and proceed to checkout
        </p>
      </div>
    )}
  </section>
);
