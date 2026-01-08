"use client";
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

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
              className={`animate-pop-strong popup-green px-6 py-4 rounded-2xl font-semibold text-base text-[#5f6d2b] flex items-center gap-3 pointer-events-auto shadow-2xl border-2 border-amber-200 hover:shadow-amber-100/50 cursor-pointer`}
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
            <h2 className="text-lg font-semibold mb-3">Edit Profile</h2>
            <form
              onSubmit={(e: React.FormEvent) => {
                e.preventDefault();
                saveProfile();
              }}
              className="space-y-3"
            >
              <div>
                <label className="text-xs text-text-light">User ID</label>
                <input name="user_id" defaultValue={profile.user_id} className="w-full p-2 border rounded mt-1 bg-gray-50" readOnly />
              </div>
              <div>
                <label className="text-xs text-text-light">Email</label>
                <input 
                  value={editEmail}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEditEmail(e.target.value)}
                  className="w-full p-2 border rounded mt-1" 
                />
              </div>
              <div className="flex justify-end gap-2 mt-2">
                <button type="button" onClick={closeEditModal} className="px-4 py-2 rounded bg-gray-100">Cancel</button>
                <button type="submit" className="px-4 py-2 rounded bg-primary text-white">Save</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Orders Modal */}
      {isOrdersModalOpen && (
        <div className="fixed inset-0 z-60 flex items-center justify-center">
          <div className="absolute inset-0 modal-backdrop" onClick={closeOrdersModal}></div>
          <div className="relative z-70 w-full max-w-2xl p-6 rounded-2xl bg-white shadow-2xl animate-pop-strong max-h-[80vh] overflow-y-auto">
            <h2 className="text-lg font-semibold mb-4">Order History</h2>
            
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
                      <th className="px-4 py-2 text-[9px] font-bold text-text-light uppercase tracking-wider">Product/Service</th>
                      <th className="px-4 py-2 text-[9px] font-bold text-text-light uppercase tracking-wider">Order ID</th>
                      <th className="px-4 py-2 text-[9px] font-bold text-text-light uppercase tracking-wider">Date</th>
                      <th className="px-4 py-2 text-[9px] font-bold text-text-light uppercase tracking-wider">Status</th>
                      <th className="px-4 py-2 text-[9px] font-bold text-text-light uppercase tracking-wider text-right">Amount</th>
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
          <div className="relative z-70 w-full max-w-2xl p-6 rounded-2xl bg-white shadow-2xl animate-pop-strong max-h-[80vh] overflow-y-auto">
            <h2 className="text-lg font-semibold mb-4">Griha Pravesh Pooja - Details</h2>
            <div className="space-y-4">
              <div className="rounded-xl overflow-hidden shadow-lg mb-4">
                <img
                  alt="Griha Pravesh"
                  className="w-full h-64 object-cover"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuBr4CkQZdDBtyiP5TG4kI2jPAKgO9PG9gqOpQCew_k5Kiy09t3kAKd00vzySn_4n25u1rLkqJj9PX3TDadhkGudDl73w3_GvNPR5Te9lbQcdggPDFqrKQ9Cg_l7kWMor-qRbuQ1185SHbniviSZULKNaZRHRFuychoxjarIklVnd5_PLo4dvL9_5Xy59xkmbQEvydncDEu8MXVgtxwunPfQLUoY4vuZAjN_X54uPsCYkVVDHzcpkhSXRr1qjPmw3lfH5q_kR0EHWb7W"
                />
              </div>
              <div>
                <h3 className="text-base font-semibold text-[#5f6d2b] mb-2">Booking Information</h3>
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 bg-amber-50 rounded-lg hover:bg-amber-100 transition-all cursor-pointer">
                    <p className="text-[9px] text-text-light font-bold uppercase">Booking ID</p>
                    <p className="text-sm font-semibold text-[#5f6d2b]">#BK-8902</p>
                  </div>
                  <div className="p-3 bg-amber-50 rounded-lg hover:bg-amber-100 transition-all cursor-pointer">
                    <p className="text-[9px] text-text-light font-bold uppercase">Status</p>
                    <p className="text-sm font-semibold text-[#5f6d2b]">Confirmed</p>
                  </div>
                  <div className="p-3 bg-amber-50 rounded-lg hover:bg-amber-100 transition-all cursor-pointer">
                    <p className="text-[9px] text-text-light font-bold uppercase">Date</p>
                    <p className="text-sm font-semibold text-[#5f6d2b]">Jan 15, 2026</p>
                  </div>
                  <div className="p-3 bg-amber-50 rounded-lg hover:bg-amber-100 transition-all cursor-pointer">
                    <p className="text-[9px] text-text-light font-bold uppercase">Time</p>
                    <p className="text-sm font-semibold text-[#5f6d2b]">09:00 AM IST</p>
                  </div>
                </div>
              </div>
              <div>
                <h3 className="text-base font-semibold text-[#5f6d2b] mb-2">Pandit Information</h3>
                <div className="p-3 bg-amber-50 rounded-lg hover:bg-amber-100 transition-all cursor-pointer">
                  <p className="text-sm font-semibold text-[#5f6d2b]">Pandit Ravi Shastri & Team</p>
                  <p className="text-xs text-text-light mt-1">Experience: 15+ years</p>
                </div>
              </div>
              <div>
                <h3 className="text-base font-semibold text-[#5f6d2b] mb-2">About This Pooja</h3>
                <p className="text-sm text-[#5f6d2b] leading-relaxed p-3 bg-amber-50 rounded-lg hover:bg-amber-100 transition-all cursor-pointer">Griha Pravesh is a sacred Hindu ritual performed to purify and bless a new home. This ceremony invokes divine blessings for prosperity, peace, and well-being in the household.</p>
              </div>
              <div>
                <h3 className="text-base font-semibold text-[#5f6d2b] mb-2">What's Included</h3>
                <div className="p-3 bg-amber-50 rounded-lg hover:bg-amber-100 transition-all cursor-pointer">
                  <ul className="text-sm text-[#5f6d2b] space-y-1">
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
          <div className="relative z-70 w-full max-w-3xl p-6 rounded-2xl bg-white shadow-2xl animate-pop-strong max-h-[80vh] overflow-y-auto font-display">
            <h2 className="text-lg font-semibold mb-4">All Upcoming Bookings</h2>
            <div className="space-y-3">
              {/* Booking 1 */}
              <div className="flex items-center justify-between p-3 bg-white/60 backdrop-blur-md rounded-xl hover:bg-amber-100 transition-all cursor-pointer group shadow-sm">
                <div className="flex items-center gap-2 flex-1">
                  <img alt="Griha Pravesh" className="w-6 h-6 rounded-lg object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBr4CkQZdDBtyiP5TG4kI2jPAKgO9PG9gqOpQCew_k5Kiy09t3kAKd00vzySn_4n25u1rLkqJj9PX3TDadhkGudDl73w3_GvNPR5Te9lbQcdggPDFqrKQ9Cg_l7kWMor-qRbuQ1185SHbniviSZULKNaZRHRFuychoxjarIklVnd5_PLo4dvL9_5Xy59xkmbQEvydncDEu8MXVgtxwunPfQLUoY4vuZAjN_X54uPsCYkVVDHzcpkhSXRr1qjPmw3lfH5q_kR0EHWb7W" />
                  <div>
                    <p className="text-xs font-semibold text-[#5f6d2b]">Griha Pravesh</p>
                    <p className="text-[9px] text-text-light">Ravi Shastri</p>
                  </div>
                </div>
                <div className="flex-1 text-center">
                  <span className="text-xs text-[#5f6d2b] font-medium">Jan 15, 2026</span>
                </div>
                <div className="flex-1 text-center">
                  <span className="text-xs text-[#5f6d2b] font-medium">09:00 AM</span>
                </div>
                <div className="flex-1 text-center">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[9px] font-bold bg-amber-100 text-[#5f6d2b]">CONFIRMED</span>
                </div>
              </div>

              {/* Booking 2 */}
              <div className="flex items-center justify-between p-3 bg-white/60 backdrop-blur-md rounded-xl hover:bg-amber-100 transition-all cursor-pointer group shadow-sm">
                <div className="flex items-center gap-2 flex-1">
                  <img alt="Vivah Sanskar" className="w-6 h-6 rounded-lg object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDs9pbArOnpyzqf-ilR_9wLZtu8V-lAkNDUEaEnZWO3zz7yU4c3jZmvartaUD0tnLHpa39vpdhpsiVC56Zj4IV_V7ivdInaFs9XBCkRvB1BK9R35Pyvgb6RHzriAwFyOnk2LQFy2H5Y4h-BlZfHy-thh_iV8BATUYHWHDWty-3aDae9TPLxLpsqgf1jwRLdfSeJQR7v8ZR9-hNxwj4d8XwXXyaSuvKRkYTTypTjpPvK2vi6qn8WL3-_HJopfprOCw7-cv2rOkauoPIu" />
                  <div>
                    <p className="text-xs font-semibold text-[#5f6d2b]">Vivah Sanskar</p>
                    <p className="text-[9px] text-text-light">Mohan Singh</p>
                  </div>
                </div>
                <div className="flex-1 text-center">
                  <span className="text-xs text-[#5f6d2b] font-medium">Feb 28, 2026</span>
                </div>
                <div className="flex-1 text-center">
                  <span className="text-xs text-[#5f6d2b] font-medium">10:30 AM</span>
                </div>
                <div className="flex-1 text-center">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[9px] font-bold bg-amber-100 text-[#5f6d2b]">PENDING</span>
                </div>
              </div>

              {/* Booking 3 */}
              <div className="flex items-center justify-between p-3 bg-white/60 backdrop-blur-md rounded-xl hover:bg-amber-100 transition-all cursor-pointer group shadow-sm">
                <div className="flex items-center gap-2 flex-1">
                  <img alt="Satyanarayan Pooja" className="w-6 h-6 rounded-lg object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuChu4R7OwQ8ETkPLyBovCUHdrB2jioozFFzmFmd7vgObnmLRo7wsqRueSpgGRdzWQF8sudBJEwKxUIhPl4e6ktt1cWSdTKPo7SKd4R0vQldPZ2kQ93SEGxagNTbpenyKVDOZluRtAG8oHpbWAf61cG5l0WYlUMCeQpg16SZ5y9myjMsJCkCakxue4devmQfpfQHcAR6Y18nMkgfWw1_UEeXvIKjxuNcWNX3SMflBo54elTH8Weba2vb1haWBGDFi7GPNUe5ETXixQ9w" />
                  <div>
                    <p className="text-xs font-semibold text-[#5f6d2b]">Satyanarayan Pooja</p>
                    <p className="text-[9px] text-text-light">Rajesh Sharma</p>
                  </div>
                </div>
                <div className="flex-1 text-center">
                  <span className="text-xs text-[#5f6d2b] font-medium">Mar 10, 2026</span>
                </div>
                <div className="flex-1 text-center">
                  <span className="text-xs text-[#5f6d2b] font-medium">06:00 PM</span>
                </div>
                <div className="flex-1 text-center">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[9px] font-bold bg-amber-100 text-[#5f6d2b]">PROCESSING</span>
                </div>
              </div>

              {/* Booking 4 */}
              <div className="flex items-center justify-between p-3 bg-white/60 backdrop-blur-md rounded-xl hover:bg-amber-100 transition-all cursor-pointer group shadow-sm">
                <div className="flex items-center gap-2 flex-1">
                  <img alt="Durga Pooja" className="w-6 h-6 rounded-lg object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCqo0FhTUrz6-nWNfy8ywHrahiAxYCMI5AvPPfyqpTbRnrLGCsddTnwFM7_yjcWsNfOGGrj9NyDl6Ujj6iF_qiXzeTsdTiznHx4Bvx9ZTRFURZwrairL2hkhD45x63r4TJdZENhaQDHyITjN3bcQg-MwjBs-1urarRYEwTRqn3cwaPjfCaQjEaUlKKTbOFaNLtwZoVSFtc8cWW_ztYuza0bYII2larCYNCQaB1PZ6KpnlKVhyS6hpNijA3BnxJ-ZUoVTXQ7g0tns-cs" />
                  <div>
                    <p className="text-xs font-semibold text-[#5f6d2b]">Durga Pooja</p>
                    <p className="text-[9px] text-text-light">Vikram Gupta</p>
                  </div>
                </div>
                <div className="flex-1 text-center">
                  <span className="text-xs text-[#5f6d2b] font-medium">Mar 25, 2026</span>
                </div>
                <div className="flex-1 text-center">
                  <span className="text-xs text-[#5f6d2b] font-medium">05:00 PM</span>
                </div>
                <div className="flex-1 text-center">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[9px] font-bold bg-amber-100 text-[#5f6d2b]">CONFIRMED</span>
                </div>
              </div>
            </div>
            <div className="flex justify-end gap-2 mt-4">
              <button type="button" onClick={closeBookingsModal} className="px-4 py-2 rounded bg-gray-100">Close</button>
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
    className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all duration-300 font-medium text-xs cursor-pointer group hover:bg-amber-200 ${
      active
        ? 'bg-primary-dark text-white shadow-md shadow-primary-dark/20'
        : 'text-[#5f6d2b] hover:text-[#5f6d2b]'
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
    className={`glass-card p-4 rounded-2xl text-center cursor-pointer transition-all ${
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
      <h3 className="font-serif font-semibold text-base text-[#5f6d2b] m-0">{profile.email}</h3>
    </div>
    <p className="text-text-light text-[11px] mb-2">Devotee since 2022</p>
    <div className="inline-flex items-center gap-1 bg-primary-soft text-[#5f6d2b] text-[9px] font-bold px-2 py-0.5 rounded-full">
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
    <div className={`glass-card rounded-2xl overflow-hidden p-1.5 flex flex-col gap-0.5 transition-all ${
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
    className={`flex items-center gap-3 px-3 py-1.5 rounded-lg transition-all font-medium text-xs cursor-pointer group ${
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
      iconColor="text-[#5f6d2b]"
      title="Active Orders"
      value="3"
      badge="Pending"
      hoverIconBg="group-hover:bg-amber-300 group-hover:text-white"
    />
    <StatCard
      icon="volunteer_activism"
      iconBg="bg-amber-100"
      iconColor="text-[#5f6d2b]"
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
  <div className="bg-white/60 backdrop-blur-md p-3 rounded-2xl shadow-sm transition-all group cursor-pointer hover:bg-amber-100">
    <div className="flex items-start justify-between mb-2">
      <div className={`${iconBg} p-1.5 rounded-xl ${iconColor} ${hoverIconBg} transition-colors`}>
        <span className="material-symbols-outlined text-[18px] group-hover:scale-125 transition-transform" style={{ fontVariationSettings: "'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 20" }}>{icon}</span>
      </div>
      <span className="text-[9px] font-bold text-text-light bg-cream-dark px-2 py-0.5 rounded-md">{badge}</span>
    </div>
    <p className="text-text-light text-xs font-medium">{title}</p>
    <h4 className="text-xl font-serif font-semibold text-[#5f6d2b]">{value}</h4>
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
  <section className="glass-card rounded-2xl p-4">
    <div className="flex items-center justify-between mb-3">
      <h3 className="text-lg font-serif font-semibold text-[#5f6d2b]">Upcoming Ritual</h3>
      <button onClick={() => onViewAllBookings?.()} className="text-xs font-bold text-[#5f6d2b] hover:text-[#4f5d2f] transition-colors cursor-pointer bg-none border-none p-0 inline-flex items-center gap-1">
        <span className="material-symbols-outlined text-[14px] text-[#5f6d2b]">event</span>
        View All Bookings
      </button>
    </div>
    <div className="glass-card rounded-2xl p-1 overflow-hidden group hover:bg-amber-200 transition-all cursor-pointer" onClick={() => onActive?.()}>
      <div className="glass-card rounded-xl flex flex-col md:flex-row gap-3 p-3 md:p-4 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-yellow-200/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>

        <div className="w-full md:w-1/3 h-32 md:h-auto rounded-xl overflow-hidden relative shadow-lg">
          <img
            alt="Griha Pravesh"
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuBr4CkQZdDBtyiP5TG4kI2jPAKgO9PG9gqOpQCew_k5Kiy09t3kAKd00vzySn_4n25u1rLkqJj9PX3TDadhkGudDl73w3_GvNPR5Te9lbQcdggPDFqrKQ9Cg_l7kWMor-qRbuQ1185SHbniviSZULKNaZRHRFuychoxjarIklVnd5_PLo4dvL9_5Xy59xkmbQEvydncDEu8MXVgtxwunPfQLUoY4vuZAjN_X54uPsCYkVVDHzcpkhSXRr1qjPmw3lfH5q_kR0EHWb7W"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
          <div className="absolute top-2 left-2 bg-white/90 backdrop-blur text-[#5f6d2b] text-[9px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
            <span className="w-1.5 h-1.5 bg-amber-400 rounded-full animate-pulse"></span>
            CONFIRMED
          </div>
          <div className="absolute bottom-2 left-2 text-white">
            <p className="text-[9px] font-medium opacity-90">Booking ID: #BK-8902</p>
          </div>
        </div>

        <div className="flex-1 flex flex-col justify-between gap-2 relative z-10">
          <div>
            <div className="flex items-start justify-between">
              <h4 className="text-lg font-serif font-bold text-[#5f6d2b] mb-0.5">Griha Pravesh Pooja</h4>
              <div className="bg-primary/10 text-[#5f6d2b] p-1.5 rounded-md">
                <span className="material-symbols-outlined text-[16px]">calendar_clock</span>
              </div>
            </div>
            <p className="text-text-light mb-2 text-xs font-light">Performed by Pandit Ravi Shastri &amp; Team</p>
            <div className="grid grid-cols-2 gap-2 mb-2">
              <div className="flex items-center gap-2 bg-white/60 backdrop-blur-md p-2 rounded-lg">
                <span className="material-symbols-outlined text-accent-dark text-[16px]">event</span>
                <div>
                  <p className="text-[9px] text-text-light font-bold uppercase">Date</p>
                  <p className="text-[11px] font-semibold text-[#5f6d2b]">Jan 15, 2026</p>
                </div>
              </div>
              <div className="flex items-center gap-2 bg-white/60 backdrop-blur-md p-2 rounded-lg">
                <span className="material-symbols-outlined text-accent-dark text-[16px]">schedule</span>
                <div>
                  <p className="text-[9px] text-text-light font-bold uppercase">Time</p>
                  <p className="text-[11px] font-semibold text-[#5f6d2b]">09:00 AM IST</p>
                </div>
              </div>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            <button onClick={() => handleButtonClick?.('💬 Chat Opened')} className="px-4 py-2 font-bold text-xs text-[#5f6d2b] hover:text-[#5f6d2b] bg-amber-50 hover:bg-amber-100 transition-colors flex items-center gap-2 justify-center flex-1 md:flex-none cursor-pointer rounded-lg">
              <span className="material-symbols-outlined text-[16px]">chat</span>
              Chat with Pandit
            </button>
            <button onClick={(e) => { e.stopPropagation(); onActive?.(); onViewDetails?.(); }} className="px-4 py-2 font-bold text-xs text-[#5f6d2b] hover:text-[#5f6d2b] bg-amber-50 hover:bg-amber-100 transition-colors flex items-center gap-2 justify-center flex-1 md:flex-none cursor-pointer rounded-lg">
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
      className="bg-white/60 backdrop-blur-md rounded-2xl p-4 shadow-sm cursor-pointer transition-all"
    >
      <div className="flex items-start justify-between gap-3 mb-3">
        <h3 className="text-base font-serif font-semibold text-[#5f6d2b] flex-1">Profile Details</h3>
        <button onClick={(e) => { e.stopPropagation(); onEdit?.(); }} className="text-primary hover:text-[#5f6d2b] p-2 hover:bg-primary-soft rounded-full transition-colors cursor-pointer group flex-shrink-0" aria-label="Edit profile details">
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
      <div className="flex items-center gap-3 p-3 bg-white/60 backdrop-blur-md rounded-2xl hover:bg-amber-200 transition-colors cursor-pointer group">
    <div className="w-7 h-7 rounded-full bg-cream-dark flex items-center justify-center text-[#5f6d2b] group-hover:bg-primary group-hover:text-white transition-colors">
      <span className="material-symbols-outlined text-[16px] group-hover:scale-125 transition-transform">{icon}</span>
    </div>
    <div>
      <p className="text-[9px] text-text-light font-bold uppercase">{label}</p>
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
    <section className="bg-white/60 backdrop-blur-md rounded-2xl p-3 shadow-sm flex flex-col">
      <h3 className="text-base font-serif font-semibold text-[#5f6d2b] mb-3">Preferences</h3>
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
        className="w-full mt-4 px-4 py-2 font-bold text-xs text-[#5f6d2b] hover:text-[#5f6d2b] bg-amber-50 hover:bg-amber-100 transition-colors flex items-center justify-center gap-2 cursor-pointer rounded-lg group"
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
  <div className={`flex items-center justify-between p-2 bg-amber-50 rounded-lg cursor-pointer group transition-colors ${
    isActive ? 'bg-amber-100' : 'hover:bg-amber-100'
  }`} onClick={() => onActive?.()}>
    <div className="flex items-center gap-2">
      <span className="material-symbols-outlined text-[#5f6d2b] text-[18px] group-hover:scale-125 transition-transform">{icon}</span>
      <span className="text-xs font-medium text-[#5f6d2b]">{label}</span>
    </div>
    <button
      onClick={(e) => { e.stopPropagation(); onChange(!enabled); onActive?.(); }}
      className={`relative inline-flex h-4 w-8 items-center rounded-full transition-colors cursor-pointer ${enabled ? 'bg-[#5f6d2b]' : 'bg-gray-200'}`}
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
  <div className="flex items-center justify-between p-2 bg-amber-50 rounded-lg cursor-pointer group transition-colors hover:bg-amber-100">
    <div className="flex items-center gap-2">
      <span className="material-symbols-outlined text-primary text-[18px] group-hover:scale-125 transition-transform">{icon}</span>
      <span className="text-xs font-medium text-[#5f6d2b]">{label}</span>
    </div>
    <span className="text-[9px] font-bold text-text-light bg-cream-dark px-2 py-0.5 rounded-full">{value}</span>
  </div>
);

// Component: Recent Orders
interface RecentOrdersProps {
  isActive?: boolean;
  onActive?: () => void;
  onViewFullOrders?: () => void;
}

const RecentOrders: React.FC<RecentOrdersProps> = ({ isActive, onActive, onViewFullOrders }) => (
  <section className="glass-card rounded-2xl p-4">
    <div className="flex items-center justify-between mb-3">
      <h3 className="text-lg font-serif font-semibold text-[#5f6d2b]">Recent Orders</h3>
    </div>
    <div className="bg-white/50 rounded-2xl overflow-hidden" onClick={() => onActive?.()}>
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead className="bg-primary/5">
            <tr>
              <th className="px-4 py-2 text-[11px] font-bold text-text-light uppercase tracking-wider">Product/Service</th>
              <th className="px-4 py-2 text-[11px] font-bold text-text-light uppercase tracking-wider text-center">Order ID</th>
              <th className="px-4 py-2 text-[11px] font-bold text-text-light uppercase tracking-wider text-center">Date</th>
              <th className="px-4 py-2 text-[11px] font-bold text-text-light uppercase tracking-wider text-center">Status</th>
              <th className="px-4 py-2 text-[11px] font-bold text-text-light uppercase tracking-wider text-center">Amount</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/60">
            <OrderRow
              image="https://lh3.googleusercontent.com/aida-public/AB6AXuChu4R7OwQ8ETkPLyBovCUHdrB2jioozFFzmFmd7vgObnmLRo7wsqRueSpgGRdzWQF8sudBJEwKxUIhPl4e6ktt1cWSdTKPo7SKd4R0vQldPZ2kQ93SEGxagNTbpenyKVDOZluRtAG8oHpbWAf61cG5l0WYlUMCeQpg16SZ5y9myjMsJCkCakxue4devmQfpfQHcAR6Y18nMkgfWw1_UEeXvIKjxuNcWNX3SMflBo54elTH8Weba2vb1haWBGDFi7GPNUe5ETXixQ9w"
              productName="Premium Rudraksha Mala"
              category="Spiritual Accessories"
              orderId="#ORD-2891"
              date="Oct 12, 2024"
              status="Delivered"
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
              statusColor="blue"
              amount="₹15,000"
            />
            <OrderRow
              image="https://lh3.googleusercontent.com/aida-public/AB6AXuCqo0FhTUrz6-nWNfy8ywHrahiAxYCMI5AvPPfyqpTbRnrLGCsddTnwFM7_yjcWsNfOGGrj9NyDl6Ujj6iF_qiXzeTsdTiznHx4Bvx9ZTRFURZwrairL2hkhD45x63r4TJdZENhaQDHyITjN3bcQg-MwjBs-1urarRYEwTRqn3cwaPjfCaQjEaUlKKTbOFaNLtwZoVSFtc8cWW_ztYuza0bYII2larCYNCQaB1PZ6KpnlKVhyS6hpNijA3BnxJ-ZUoVTXQ7g0tns-cs"
              productName="Brass Pooja Thali Set"
              category="Home Decor"
              orderId="#ORD-2711"
              date="Sep 15, 2024"
              status="Shipped"
              statusColor="yellow"
              amount="₹2,499"
            />
          </tbody>
        </table>
      </div>
      <div className="p-2 text-center rounded transition-all cursor-pointer bg-white/60 backdrop-blur-md">
        <a onClick={(e) => { e.preventDefault(); onViewFullOrders?.(); }} className="text-xs font-bold text-[#5f6d2b] hover:text-[#4f5d2f] transition-colors inline-flex items-center gap-1 cursor-pointer group" href="#">
          View Full Order History
          <span className="material-symbols-outlined text-[14px] arrow-right group-hover:translate-x-1 text-[#5f6d2b] group-hover:text-[#4f5d2f]">arrow_forward</span>
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
    green: 'bg-amber-100 text-[#5f6d2b] border-amber-200 bg-amber-300',
    blue: 'bg-blue-100 text-blue-700 border-blue-200 bg-blue-600',
    yellow: 'bg-amber-100 text-[#5f6d2b] border-amber-200 bg-amber-300',
  };

  return (
    <tr className="hover:bg-amber-200/50 transition-all cursor-pointer group">
      <td className="px-4 py-3">
        <div className="flex items-center gap-2">
          <img alt="Item" className="w-6 h-6 rounded-lg object-cover" src={image} />
          <div>
            <p className="text-xs font-semibold text-[#5f6d2b]">{productName}</p>
            <p className="text-[9px] text-text-light">{category}</p>
          </div>
        </div>
      </td>
      <td className="px-4 py-3 text-center">
        <span className="text-xs text-[#5f6d2b] font-medium">{orderId}</span>
      </td>
      <td className="px-4 py-3 text-center">
        <span className="text-xs text-[#5f6d2b] font-medium">{date}</span>
      </td>
      <td className="px-4 py-3 text-center">
        <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[9px] font-bold`}>
          <span className={`w-1.5 h-1.5 rounded-full ${statusColors[statusColor]}`}></span>
          {status}
        </span>
      </td>
      <td className="px-4 py-3 text-center">
        <span className="text-xs text-[#5f6d2b] font-semibold">{amount}</span>
      </td>
    </tr>
  );
};
