"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ShoppingCart, Trash2, ArrowRight, ArrowLeft, Check } from 'lucide-react';

interface CartService {
  id: number;
  title: string;
  description?: string;
  image: string;
  price?: number;
  formData?: {
    location?: string;
    venue?: string;
    priestPreference?: string;
    date?: string;
    package?: string;
    flowers?: string;
  };
  addedAt?: string;
  selected?: boolean;
}

export default function CartPage() {
  const router = useRouter();
  const [services, setServices] = useState<CartService[]>([]);
  const [loading, setLoading] = useState(true);
  const [checkoutStep, setCheckoutStep] = useState<0 | 1 | 2 | 3 | 4>(0);
  const [showCouponInput, setShowCouponInput] = useState(false);
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState<string | null>(null);
  
  const [contactInfo, setContactInfo] = useState({
    name: 'Priya Sharma',
    email: 'maathre@gmail.com',
    phone: '9876543210',
    address: '123, Green Meadows, Chennai'
  });

  const getServicePrice = (svc: CartService) => {
    const pkg = (svc.formData?.package || 'Economy') as 'Economy' | 'Standard' | 'Premium';
    const titleKey = (svc.title || '').toLowerCase();

    const defaultPrices: Record<'Economy' | 'Standard' | 'Premium', number> = {
      Economy: 15000,
      Standard: 25000,
      Premium: 35000,
    };

    const specialPrices: Record<string, Record<'Economy' | 'Standard' | 'Premium', number>> = {
      'aavahanthi homam': { Economy: 8500, Standard: 12500, Premium: 18000 },
      'navagraha homam': { Economy: 9999, Standard: 12999, Premium: 20000 },
      'ayusha homam': { Economy: 9999, Standard: 12999, Premium: 20000 },
      'haridra ganapathy homam': { Economy: 9999, Standard: 12999, Premium: 20000 },
      'ganesh / vinayagar chathurthi pooja package': { Economy: 9999, Standard: 12999, Premium: 20000 },
    };

    const priceMap = specialPrices[titleKey] || defaultPrices;
    return svc.price ?? priceMap[pkg] ?? defaultPrices.Economy;
  };

  useEffect(() => {
    const loadServices = () => {
      try {
        const stored = JSON.parse(localStorage.getItem('addedServices') || '[]');
        setServices(Array.isArray(stored) ? stored : []);
      } catch (e) {
        setServices([]);
      } finally {
        setLoading(false);
      }
    };

    loadServices();
    
    const handler = () => loadServices();
    window.addEventListener('storage', handler);
    window.addEventListener('servicesUpdated', handler as EventListener);
    
    return () => {
      window.removeEventListener('storage', handler);
      window.removeEventListener('servicesUpdated', handler as EventListener);
    };
  }, []);

  const toggleSelection = (id: number) => {
    const updated = services.map((svc) =>
      svc.id === id ? { ...svc, selected: !svc.selected } : svc
    );
    setServices(updated);
    localStorage.setItem('addedServices', JSON.stringify(updated));
    window.dispatchEvent(new Event('servicesUpdated'));
  };

  const removeService = (id: number) => {
    const updated = services.filter((svc) => svc.id !== id);
    setServices(updated);
    localStorage.setItem('addedServices', JSON.stringify(updated));
    window.dispatchEvent(new Event('servicesUpdated'));
  };

  const clearAll = () => {
    setServices([]);
    localStorage.removeItem('addedServices');
    window.dispatchEvent(new Event('servicesUpdated'));
  };

  const calculateSubtotal = () => {
    return services
      .filter((svc) => svc.selected !== false)
      .reduce((sum, svc) => sum + getServicePrice(svc), 0);
  };

  const subtotal = calculateSubtotal();
  const discount = appliedCoupon ? 1500 : 0;
  const tax = Math.round((subtotal - discount) * 0.18); // 18% GST
  const total = subtotal - discount + tax;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-[#d6f0a8] via-[#eaf5b5] to-[#ffe6a3]">
        <p className="text-lg text-[#2f3a1f]">Loading cart...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-r from-[#d6f0a8] via-[#eaf5b5] to-[#ffe6a3] py-6 px-4 md:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-4">
          {checkoutStep > 0 && (
            <button
              onClick={() => setCheckoutStep(prev => Math.max(0, prev - 1) as 0 | 1 | 2 | 3 | 4)}
              className="inline-flex items-center gap-1 text-sm font-medium text-[#2f3a1f] hover:text-[#2f9e44] transition-colors mb-3"
            >
              <ArrowLeft className="h-4 w-4" />
              Back
            </button>
          )}
          <h1 className="text-2xl font-semibold text-[#2f3a1f]">
            {checkoutStep === 0 && 'Shopping Cart'}
            {checkoutStep === 1 && 'Contact Details'}
            {checkoutStep === 2 && 'Payment Method'}
            {checkoutStep === 3 && 'Review & Place Order'}
            {checkoutStep === 4 && 'Order Confirmed'}
          </h1>
          {checkoutStep === 0 && services.length > 0 && (
            <p className="text-sm text-[#4f5d2f] mt-1">
              {services.length} {services.length === 1 ? 'item' : 'items'}
            </p>
          )}
        </div>

        {services.length === 0 ? (
          <div className="bg-white rounded-lg border border-[#cfd8a3] p-8 text-center">
            <ShoppingCart className="h-12 w-12 text-[#cfd8a3] mx-auto mb-3" />
            <h2 className="text-lg font-semibold text-[#2f3a1f] mb-1">Your cart is empty</h2>
            <p className="text-sm text-[#4f5d2f] mb-4">Add some services to get started</p>
            <button
              onClick={() => router.push('/services')}
              className="inline-flex items-center gap-2 px-5 py-2 bg-[#2f9e44] text-white text-sm rounded-lg font-semibold hover:bg-[#268a3b] transition-all"
            >
              Browse Services
            </button>
          </div>
        ) : (
          <>
            {/* Step 0: Cart Items */}
            {checkoutStep === 0 && (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
                {/* Cart Items */}
                <div className="lg:col-span-8">
                  <div className="bg-white rounded-lg border border-[#cfd8a3] p-4">
                    <div className="flex items-center justify-between mb-3">
                      <h2 className="text-base font-semibold text-[#2f3a1f]">Cart Items</h2>
                      <button
                        onClick={clearAll}
                        className="text-sm text-red-600 hover:text-red-700 transition-colors"
                      >
                        Clear All
                      </button>
                    </div>

                    <div className="space-y-3">
                      {services.map((svc) => (
                        <div
                          key={svc.id}
                          className="flex gap-3 p-3 rounded-lg border border-[#e5e5e5] hover:border-[#2f9e44] transition-all"
                        >
                          <div className="flex items-start pt-1">
                            <input
                              type="checkbox"
                              checked={svc.selected !== false}
                              onChange={() => toggleSelection(svc.id)}
                              className="h-5 w-5 rounded cursor-pointer"
                              style={{ accentColor: '#2f9e44' }}
                            />
                          </div>
                          <img
                            src={svc.image}
                            alt={svc.title}
                            className="w-20 h-20 rounded-md object-cover border border-[#e5e5e5] flex-shrink-0"
                          />
                          <div className="flex-1 min-w-0">
                            <h3 className="text-sm font-semibold text-[#2f3a1f] mb-1">
                              {svc.title}
                            </h3>
                            {svc.description && (
                              <p className="text-xs text-[#4f5d2f] mb-2 line-clamp-2">{svc.description}</p>
                            )}
                            {svc.formData && (
                              <div className="space-y-0.5 text-xs text-[#4f5d2f] mb-2">
                                {svc.formData.package && (
                                  <p>Package: {svc.formData.package}</p>
                                )}
                                {svc.formData.date && (
                                  <p>Date: {svc.formData.date}</p>
                                )}
                                {svc.formData.flowers && (
                                  <p>Flowers: {svc.formData.flowers}</p>
                                )}
                              </div>
                            )}
                            <p className="text-base font-bold text-[#2f3a1f]">₹{getServicePrice(svc).toLocaleString()}</p>
                          </div>
                          <button
                            onClick={() => removeService(svc.id)}
                            className="self-start p-1.5 text-red-600 hover:bg-red-50 rounded transition-colors"
                            aria-label="Remove item"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Order Summary */}
                <div className="lg:col-span-4">
                  <div className="bg-white rounded-lg border border-[#cfd8a3] p-4 sticky top-24">
                    <h2 className="text-sm font-semibold text-[#2f3a1f] mb-3">Order Summary</h2>
                    
                    <div className="space-y-2 mb-3 pb-3 border-b border-[#e5e5e5]">
                      <div className="flex justify-between text-sm">
                        <span className="text-[#4f5d2f]">Subtotal ({services.length} items)</span>
                        <span className="text-[#2f3a1f]">₹{subtotal.toLocaleString()}</span>
                      </div>
                      {appliedCoupon && (
                        <div className="flex justify-between text-sm">
                          <span className="text-[#4f5d2f]">Discount</span>
                          <span className="text-green-600">-₹{discount.toLocaleString()}</span>
                        </div>
                      )}
                      <div className="flex justify-between text-sm">
                        <span className="text-[#4f5d2f]">GST (18%)</span>
                        <span className="text-[#2f3a1f]">₹{tax.toLocaleString()}</span>
                      </div>
                    </div>

                    <div className="flex justify-between text-base font-bold text-[#2f3a1f] mb-4">
                      <span>Total</span>
                      <span>₹{total.toLocaleString()}</span>
                    </div>

                    <button
                      onClick={() => setCheckoutStep(1)}
                      className="w-full py-2.5 px-4 bg-[#2f9e44] text-white text-sm rounded-lg font-semibold hover:bg-[#268a3b] transition-all"
                    >
                      Proceed to Checkout
                    </button>
                    
                    {/* Coupon Section */}
                    {!appliedCoupon && (
                      <button 
                        onClick={() => setShowCouponInput(!showCouponInput)}
                        className="text-xs text-[#2f9e44] hover:text-[#268a3b] mt-3"
                      >
                        {showCouponInput ? 'Hide' : 'Apply'} coupon code
                      </button>
                    )}
                    
                    {showCouponInput && (
                      <div className="flex gap-2 mt-2">
                        <input 
                          type="text"
                          placeholder="Enter code"
                          value={couponCode}
                          onChange={(e) => setCouponCode(e.target.value)}
                          className="flex-1 px-2 py-1.5 rounded text-xs border border-[#cfd8a3] focus:border-[#2f9e44] focus:ring-1 focus:ring-[#2f9e44]"
                        />
                        <button 
                          onClick={() => {
                            if (couponCode.trim()) {
                              setAppliedCoupon(couponCode);
                              setShowCouponInput(false);
                              setCouponCode('');
                            }
                          }}
                          className="px-3 py-1.5 rounded text-xs bg-[#2f9e44] text-white hover:bg-[#268a3b]"
                        >
                          Apply
                        </button>
                      </div>
                    )}
                    
                    {appliedCoupon && (
                      <div className="flex items-center justify-between bg-[#eef4cf] px-2 py-1.5 rounded mt-2">
                        <span className="text-xs text-[#2f3a1f]">Coupon: <strong>{appliedCoupon}</strong></span>
                        <button 
                          onClick={() => setAppliedCoupon(null)}
                          className="text-xs text-red-600 hover:text-red-700"
                        >
                          Remove
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Step 1: Contact Details */}
            {checkoutStep === 1 && (
              <div className="max-w-3xl mx-auto bg-white rounded-lg border border-[#cfd8a3] p-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-semibold text-[#2f3a1f] mb-1.5 block">Full Name</label>
                    <input 
                      value={contactInfo.name}
                      onChange={(e) => setContactInfo({...contactInfo, name: e.target.value})}
                      className="w-full px-3 py-2 rounded border border-[#cfd8a3] text-sm focus:border-[#2f9e44] focus:ring-1 focus:ring-[#2f9e44]" 
                    />
                  </div>
                  <div>
                    <label className="text-sm font-semibold text-[#2f3a1f] mb-1.5 block">Email</label>
                    <input 
                      type="email"
                      value={contactInfo.email}
                      onChange={(e) => setContactInfo({...contactInfo, email: e.target.value})}
                      className="w-full px-3 py-2 rounded border border-[#cfd8a3] text-sm focus:border-[#2f9e44] focus:ring-1 focus:ring-[#2f9e44]" 
                    />
                  </div>
                  <div>
                    <label className="text-sm font-semibold text-[#2f3a1f] mb-1.5 block">Phone</label>
                    <input 
                      value={contactInfo.phone}
                      onChange={(e) => setContactInfo({...contactInfo, phone: e.target.value})}
                      className="w-full px-3 py-2 rounded border border-[#cfd8a3] text-sm focus:border-[#2f9e44] focus:ring-1 focus:ring-[#2f9e44]" 
                    />
                  </div>
                  <div>
                    <label className="text-sm font-semibold text-[#2f3a1f] mb-1.5 block">Address</label>
                    <textarea 
                      value={contactInfo.address}
                      onChange={(e) => setContactInfo({...contactInfo, address: e.target.value})}
                      className="w-full px-3 py-2 rounded border border-[#cfd8a3] text-sm focus:border-[#2f9e44] focus:ring-1 focus:ring-[#2f9e44]" 
                      rows={3} 
                    />
                  </div>
                </div>
                <div className="flex justify-end mt-4">
                  <button 
                    onClick={() => setCheckoutStep(2)} 
                    className="px-5 py-2 rounded-lg bg-[#2f9e44] text-white text-sm font-semibold hover:bg-[#268a3b]"
                  >
                    Continue to Payment
                  </button>
                </div>
              </div>
            )}

            {/* Step 2: Payment Method */}
            {checkoutStep === 2 && (
              <div className="max-w-3xl mx-auto bg-white rounded-lg border border-[#cfd8a3] p-5">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-4">
                  {['UPI', 'Credit/Debit Card', 'Cash on Delivery'].map((method) => (
                    <button 
                      key={method}
                      className="p-4 rounded-lg border-2 border-[#e5e5e5] bg-white hover:border-[#2f9e44] transition-all text-left"
                    >
                      <span className="text-sm font-semibold text-[#2f3a1f] block">{method}</span>
                      <p className="text-xs text-[#4f5d2f] mt-0.5">Secure checkout</p>
                    </button>
                  ))}
                </div>
                <div className="flex justify-end">
                  <button 
                    onClick={() => setCheckoutStep(3)} 
                    className="px-5 py-2 rounded-lg bg-[#2f9e44] text-white text-sm font-semibold hover:bg-[#268a3b]"
                  >
                    Review Order
                  </button>
                </div>
              </div>
            )}

            {/* Step 3: Review Order */}
            {checkoutStep === 3 && (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
                <div className="lg:col-span-8 bg-white rounded-lg border border-[#cfd8a3] p-4">
                  <h2 className="text-base font-semibold text-[#2f3a1f] mb-3">Services</h2>
                  <div className="space-y-3">
                    {services.map((svc) => (
                      <div key={svc.id} className="flex gap-3 p-3 rounded-lg border border-[#e5e5e5]">
                        <img
                          src={svc.image}
                          alt={svc.title}
                          className="w-16 h-16 rounded object-cover border border-[#e5e5e5]"
                        />
                        <div className="flex-1">
                          <h3 className="text-sm font-semibold text-[#2f3a1f] mb-0.5">{svc.title}</h3>
                          {svc.description && (
                            <p className="text-xs text-[#4f5d2f] mb-1 line-clamp-1">{svc.description}</p>
                          )}
                          {svc.formData && (
                            <div className="space-y-0.5 text-xs text-[#4f5d2f]">
                              {svc.formData.package && <p>Package: {svc.formData.package}</p>}
                              {svc.formData.flowers && <p>Flowers: {svc.formData.flowers}</p>}
                            </div>
                          )}
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-semibold text-[#2f3a1f]">₹{getServicePrice(svc).toLocaleString()}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="lg:col-span-4">
                  <div className="bg-white rounded-lg border border-[#cfd8a3] p-4 sticky top-24">
                    <h2 className="text-sm font-semibold text-[#2f3a1f] mb-3">Order Summary</h2>
                    
                    {appliedCoupon && (
                      <div className="bg-[#eef4cf] px-2 py-1.5 rounded mb-3 text-xs">
                        <strong>Coupon:</strong> {appliedCoupon}
                      </div>
                    )}

                    <div className="space-y-2 mb-3 pb-3 border-b border-[#e5e5e5]">
                      <div className="flex justify-between text-sm">
                        <span className="text-[#4f5d2f]">Subtotal</span>
                        <span className="text-[#2f3a1f]">₹{subtotal.toLocaleString()}</span>
                      </div>
                      {appliedCoupon && (
                        <div className="flex justify-between text-sm">
                          <span className="text-[#4f5d2f]">Discount</span>
                          <span className="text-green-600">-₹{discount.toLocaleString()}</span>
                        </div>
                      )}
                      <div className="flex justify-between text-sm">
                        <span className="text-[#4f5d2f]">GST (18%)</span>
                        <span className="text-[#2f3a1f]">₹{tax.toLocaleString()}</span>
                      </div>
                    </div>

                    <div className="flex justify-between text-base font-bold text-[#2f3a1f] mb-4">
                      <span>Total</span>
                      <span>₹{total.toLocaleString()}</span>
                    </div>

                    <button
                      onClick={() => {
                        setCheckoutStep(4);
                        // Clear cart after order
                        setTimeout(() => {
                          clearAll();
                        }, 3000);
                      }}
                      className="w-full py-2.5 px-4 bg-[#2f9e44] text-white text-sm rounded-lg font-semibold hover:bg-[#268a3b] transition-all"
                    >
                      Confirm Order
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Step 4: Order Success */}
            {checkoutStep === 4 && (
              <div className="max-w-xl mx-auto bg-white rounded-lg border border-[#cfd8a3] p-8 text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Check className="h-8 w-8 text-green-600" />
                </div>
                <h2 className="text-xl font-semibold text-[#2f3a1f] mb-1">Order Placed Successfully!</h2>
                <p className="text-sm text-[#4f5d2f] mb-5">Thank you for your purchase. You will receive a confirmation email shortly.</p>
                <div className="flex gap-3 justify-center">
                  <button
                    onClick={() => router.push('/profile')}
                    className="px-5 py-2 rounded-lg border border-[#2f9e44] text-[#2f9e44] text-sm font-semibold hover:bg-[#eef4cf] transition-all"
                  >
                    View Orders
                  </button>
                  <button
                    onClick={() => router.push('/services')}
                    className="px-5 py-2 rounded-lg bg-[#2f9e44] text-white text-sm font-semibold hover:bg-[#268a3b] transition-all"
                  >
                    Continue Shopping
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
