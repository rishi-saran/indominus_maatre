"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ShoppingCart, Trash2, ArrowRight, ArrowLeft, Check } from 'lucide-react';
import Script from 'next/script';
import { initializeRazorpayPayment, verifyRazorpayPayment, type RazorpayResponse } from '@/lib/utils/razorpay';
import { AddressesService, type CreateAddressPayload } from '@/lib/services/addresses.service';
import { ServiceProvidersService, type ServiceProvider } from '@/lib/services/service-providers.service';
import { ApiService } from '@/lib/services/api.service';
import { ServicesService, type Service } from '@/lib/services/services.service';

interface CartService {
  id: string | number;
  service_id?: string;
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
  const [razorpayLoaded, setRazorpayLoaded] = useState(false);
  const [processingPayment, setProcessingPayment] = useState(false);
  const [savingAddress, setSavingAddress] = useState(false);
  const [loadingProviders, setLoadingProviders] = useState(false);
  const [addressId, setAddressId] = useState<string | null>(null);
  const [providerId, setProviderId] = useState<string | null>(null);
  const [providers, setProviders] = useState<ServiceProvider[]>([]);
  const [addressForm, setAddressForm] = useState({
    line1: '',
    line2: '',
    city: '',
    state: '',
    postal_code: '',
    country: '',
  });

  // Safe setter that ensures country is never undefined
  const safeSetAddressForm = (form: any) => {
    setAddressForm({
      ...form,
      country: form.country ?? '',
    });
  };
  
  const [contactInfo, setContactInfo] = useState({
    name: 'Priya Sharma',
    email: 'maathre@gmail.com',
    phone: '9876543210',
    address: '123, Green Meadows, Chennai'
  });

  const syncLocalCartToBackend = async () => {
    const stored = JSON.parse(localStorage.getItem('addedServices') || '[]');
    const localServices: CartService[] = Array.isArray(stored) ? stored : [];

    if (localServices.length === 0) return;

    let backendCart: any = null;
    try {
      backendCart = await ApiService.get<any>('/api/cart');
    } catch (error) {
      console.warn('[Cart] Backend cart unavailable during sync');
    }

    const existingServiceIds = new Set<string>();
    if (backendCart?.cart_items && Array.isArray(backendCart.cart_items)) {
      backendCart.cart_items.forEach((item: any) => {
        if (item?.service?.id) existingServiceIds.add(String(item.service.id));
      });
    }

    let catalog: Service[] = [];
    try {
      catalog = await ServicesService.list();
    } catch (error) {
      console.warn('[Cart] Failed to fetch service catalog for sync');
    }

    const normalize = (value: string) => value.toLowerCase().trim();

    for (const item of localServices) {
      const directId = item.service_id || (item as any).serviceId || (item as any).apiServiceId;
      let serviceId = directId ? String(directId) : null;

      if (!serviceId && item.title) {
        const matched = catalog.find(
          (svc) =>
            normalize(svc.name).includes(normalize(item.title)) ||
            normalize(item.title).includes(normalize(svc.name))
        );
        serviceId = matched?.id ? String(matched.id) : null;
      }

      if (!serviceId || existingServiceIds.has(serviceId)) continue;

      try {
        const price = getServicePrice(item);
        await ApiService.post<any>('/api/cart/items', undefined, {
          params: { service_id: serviceId, quantity: 1, price },
        });
        existingServiceIds.add(serviceId);
      } catch (error) {
        console.warn('[Cart] Failed to sync cart item to backend', error);
      }
    }
  };

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
    const loadServices = async () => {
      try {
        // Load local services
        const stored = JSON.parse(localStorage.getItem('addedServices') || '[]');
        const localServices = Array.isArray(stored) ? stored : [];

        // Load backend cart items
        let backendServices: CartService[] = [];
        try {
          const cartData = await ApiService.get<any>('/api/cart');
          if (cartData?.cart_items && Array.isArray(cartData.cart_items)) {
            console.log('[Cart] Raw cart items:', cartData.cart_items);
            console.log('[Cart] ===== CART ITEM IDs FOR DELETE CHECK =====');
            cartData.cart_items.forEach((item: any, index: number) => {
              const idString = String(item.id);
              const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(idString);
              console.log(`[Cart] Item ${index}: ID="${idString}", Length=${idString.length}, IsUUID=${isUUID}`);
            });
            backendServices = cartData.cart_items
              .filter((item: any) => item.service) // Only include items with valid service data
              .map((item: any) => {
                const cartItem = {
                  id: item.id,
                  title: item.service.name,
                  description: item.service.description,
                  image: item.service.image || '/assets/images/bg.jpg',
                  price: item.service.price,
                  selected: true,
                };
                console.log('[Cart] Mapped cart item:', cartItem, 'ID type:', typeof cartItem.id, 'ID value:', cartItem.id);
                return cartItem;
              });
            console.log('[Cart] Backend items loaded:', backendServices);
          }
        } catch (error) {
          console.log('[Cart] Backend cart unavailable (expected if not logged in)');
        }

        // Merge both sources
        const mergedServices = [...localServices, ...backendServices];
        setServices(mergedServices);
        console.log('[Cart] Merged services (local + backend):', mergedServices);
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
    
    // Fallback: Enable payment gateway after 5 seconds if script hasn't loaded
    const timeout = setTimeout(() => {
      if (!razorpayLoaded) {
        console.log('Razorpay script slow to load, enabling fallback');
        setRazorpayLoaded(true);
      }
    }, 5000);
    
    return () => {
      clearTimeout(timeout);
      window.removeEventListener('storage', handler);
      window.removeEventListener('servicesUpdated', handler as EventListener);
    };
  }, [razorpayLoaded]);

  // Load available service providers
  useEffect(() => {
    const loadProviders = async () => {
      try {
        setLoadingProviders(true);
        const list = await ServiceProvidersService.list();
        setProviders(list);
        if (!providerId && list.length > 0) {
          setProviderId(list[0].id);
        }
      } catch (error) {
        console.error('Failed to load providers', error);
      } finally {
        setLoadingProviders(false);
      }
    };

    loadProviders();
  }, [providerId]);

  // Fetch addresses when entering checkout
  useEffect(() => {
    if (checkoutStep >= 1) {
      console.log('[Cart] Checkout step >= 1, fetching addresses...');
      const loadAddresses = async () => {
        try {
          const accessToken = localStorage.getItem('access_token');
          console.log('[Cart] Access token exists:', !!accessToken);
          
          if (!accessToken) {
            console.warn('[Cart] No access token found, skipping address fetch');
            return;
          }
          
          console.log('[Cart] Calling GET /api/addresses with Authorization header...');
          const response = await fetch('/api/addresses', {
            method: 'GET',
            headers: {
              'Authorization': `Bearer ${accessToken}`,
              'Content-Type': 'application/json',
            },
          });
          
          console.log('[Cart] GET /api/addresses response status:', response.status);
          
          if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            console.warn('[Cart] Failed to fetch addresses, status:', response.status, 'error:', errorData);
            return;
          }
          
          const addresses = await response.json();
          console.log('[Cart] Addresses loaded successfully, count:', addresses.length);
          
          // Auto-populate first address if available
          if (Array.isArray(addresses) && addresses.length > 0) {
            const firstAddr = addresses[0];
            console.log('[Cart] Auto-populating address form with first address:', firstAddr);
            safeSetAddressForm({
              line1: firstAddr.address || '',
              line2: firstAddr.landmark || '',
              city: firstAddr.city || '',
              state: firstAddr.state || '',
              postal_code: firstAddr.pincode || '',
              country: firstAddr.country || '',
            });
            setAddressId(firstAddr.id);
          }
        } catch (error) {
          console.error('[Cart] Error loading addresses:', error);
        }
      };
      
      loadAddresses();
    }
  }, [checkoutStep]);

  const toggleSelection = (id: string | number) => {
    const updated = services.map((svc) =>
      svc.id === id ? { ...svc, selected: !svc.selected } : svc
    );
    setServices(updated);
    localStorage.setItem('addedServices', JSON.stringify(updated));
    window.dispatchEvent(new Event('servicesUpdated'));
  };

  const removeService = async (id: string | number) => {
    console.log('========== DELETE FUNCTION START ==========');
    console.log('[Cart] removeService called for id:', id, 'type:', typeof id);
    console.log('[Cart] All services:', services);
    console.log('[Cart] Services count:', services.length);
    
    // Check if ID is a UUID (backend cart item) or local ID (timestamp)
    const idString = String(id);
    console.log('[Cart] idString:', idString);
    console.log('[Cart] idString length:', idString.length);
    const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(idString);
    
    console.log('[Cart] ID is UUID:', isUUID);
    console.log('[Cart] UUID regex test result:', isUUID);
    
    if (isUUID) {
      // Backend cart item - DELETE from server first
      console.log('[Cart] ===== BACKEND ITEM - ATTEMPTING API DELETE =====');
      try {
        const accessToken = localStorage.getItem('access_token');
        console.log('[Cart] access_token exists:', !!accessToken);
        console.log('[Cart] access_token value:', accessToken ? accessToken.substring(0, 20) + '...' : 'MISSING');
        
        const url = `/api/cart/items/${idString}`;
        console.log('[Cart] URL to call:', url);
        console.log('[Cart] About to fetch...');
        
        const response = await fetch(url, {
          method: 'DELETE',
          headers: {
            ...(accessToken && { 'Authorization': `Bearer ${accessToken}` }),
            'Content-Type': 'application/json',
          },
        });
        
        console.log('[Cart] ===== API RESPONSE RECEIVED =====');
        console.log(`[Cart] DELETE ${url} Status:`, response.status);
        console.log('[Cart] Response OK:', response.ok);
        const data = await response.json().catch(() => response.text());
        console.log(`[Cart] DELETE response:`, data);
        
        if (!response.ok) {
          console.warn('[Cart] Delete returned non-OK status:', response.status, 'Response:', data);
          console.log('[Cart] NOT removing from local state due to API failure');
          return; // Don't remove from local state if API failed
        }
        
        console.log('[Cart] Item deleted successfully from backend - now removing from local state');
      } catch (error) {
        console.error('[Cart] Delete API error:', error);
        console.log('[Cart] NOT removing from local state due to error');
        return; // Don't remove from local state if API call failed
      }
    } else {
      console.log('[Cart] ===== LOCAL ITEM - NO API DELETE =====');
      console.log('[Cart] Local item (non-UUID), deleting from local state only');
    }
    
    // Only remove from local state if we reach here (success for backend items, or local items)
    console.log('[Cart] ===== REMOVING FROM LOCAL STATE =====');
    console.log('[Cart] Removing from local state, id:', id);
    const updated = services.filter((svc) => svc.id !== id);
    setServices(updated);
    localStorage.setItem('addedServices', JSON.stringify(updated));
    window.dispatchEvent(new Event('servicesUpdated'));
    console.log('[Cart] Item removed. Services remaining:', updated.length);
    console.log('========== DELETE FUNCTION END ==========');
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

  const handleContinueToReview = async () => {
    console.log('========== HANDLE CONTINUE TO REVIEW CLICKED ==========');
    try {
      console.log('[Cart] Step 1: Ensuring address exists...');
      const resolvedAddressId = await ensureAddress();
      console.log('[Cart] Step 1 ✓: Address resolved:', resolvedAddressId);
      
      console.log('[Cart] Step 2: Ensuring provider is selected...');
      if (!providerId && providers.length > 0) {
        console.log('[Cart] Setting provider to first available:', providers[0].id);
        setProviderId(providers[0].id);
      }
      console.log('[Cart] Step 2 ✓: Provider set:', providerId);
      
      if (!resolvedAddressId) {
        console.error('[Cart] No address ID resolved');
        throw new Error('Please add an address');
      }
      
      console.log('[Cart] Step 3: Moving to checkout step 3 (Review Order)...');
      setCheckoutStep(3);
      console.log('========== HANDLE CONTINUE TO REVIEW SUCCESS ==========');
    } catch (error) {
      console.error('========== HANDLE CONTINUE TO REVIEW ERROR ==========');
      console.error('[Cart] Error:', error);
      const message = error instanceof Error ? error.message : 'Please complete address details';
      alert(message);
    }
  };

  const requireAddressFields = () => {
    const requiredFields: Array<keyof CreateAddressPayload> = [
      'line1',
      'city',
      'state',
      'postal_code',
    ];
    return requiredFields.every((key) => addressForm[key]?.trim());
  };

  const ensureAddress = async (): Promise<string> => {
    console.log('[Cart] ===== ensureAddress called =====');
    console.log('[Cart] Current addressId:', addressId);
    
    // If address already exists, return it
    if (addressId) {
      console.log('[Cart] Address already exists, returning:', addressId);
      return addressId;
    }
    
    // Check if all required fields are filled
    console.log('[Cart] Checking required fields...');
    if (!requireAddressFields()) {
      console.warn('[Cart] Required fields missing:', {
        line1: addressForm.line1,
        city: addressForm.city,
        state: addressForm.state,
        postal_code: addressForm.postal_code,
      });
      throw new Error('Please fill all required address fields (line1, city, state, postal_code)');
    }

    console.log('[Cart] All fields filled, creating address...');
    setSavingAddress(true);
    try {
      console.log('[Cart] Calling AddressesService.create with payload:', addressForm);
      const created = await AddressesService.create(addressForm);
      console.log('[Cart] ===== ADDRESS CREATED SUCCESSFULLY =====');
      console.log('[Cart] Created address ID:', created.id);
      console.log('[Cart] Created address details:', created);
      setAddressId(created.id);
      return created.id;
    } catch (error) {
      console.error('[Cart] ===== ERROR CREATING ADDRESS =====');
      console.error('[Cart] Error details:', error);
      throw error;
    } finally {
      setSavingAddress(false);
    }
  };

  const ensureProvider = () => {
    if (providerId) return providerId;
    if (providers.length > 0) {
      setProviderId(providers[0].id);
      return providers[0].id;
    }
    throw new Error('Please select a service provider');
  };

  // Handle Razorpay payment
  const handlePayment = async () => {
    if (!razorpayLoaded) {
      alert('Payment gateway is loading. Please try again.');
      return;
    }

    setProcessingPayment(true);

    try {
      await syncLocalCartToBackend();
      const resolvedAddressId = await ensureAddress();
      const resolvedProviderId = ensureProvider();

      await initializeRazorpayPayment(
        total,
        {
          name: contactInfo.name,
          email: contactInfo.email,
          phone: contactInfo.phone,
        },
        {
          providerId: resolvedProviderId,
          addressId: resolvedAddressId,
        },
        async (response: RazorpayResponse) => {
          // Verify payment
          const verified = await verifyRazorpayPayment(response);
          if (verified) {
            setCheckoutStep(4);
            setTimeout(() => clearAll(), 3000);
          } else {
            alert('Payment verification failed. Please contact support.');
          }
          setProcessingPayment(false);
        },
        () => {
          setProcessingPayment(false);
          alert('Payment cancelled');
        }
      );
    } catch (error) {
      console.error('Payment error:', error);
      alert(error instanceof Error ? error.message : 'Failed to initiate payment. Please try again.');
      setProcessingPayment(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-[#d6f0a8] via-[#eaf5b5] to-[#ffe6a3]">
        <p className="text-lg text-[#2f3a1f]">Loading cart...</p>
      </div>
    );
  }

  return (
    <>
      {/* Load Razorpay Script */}
      <Script
        src="https://checkout.razorpay.com/v1/checkout.js"
        strategy="lazyOnload"
        onLoad={() => setRazorpayLoaded(true)}
        onError={() => {
          console.error('Failed to load Razorpay SDK, allowing fallback');
          setRazorpayLoaded(true); // Allow payment anyway with fallback
        }}
      />
      
      <div className="min-h-screen bg-gradient-to-r from-[#d6f0a8] via-[#eaf5b5] to-[#ffe6a3] py-6 px-4 md:px-8">
        <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-4">
          {checkoutStep > 0 && (
            <button
              onClick={() => setCheckoutStep(prev => Math.max(0, prev - 1) as 0 | 1 | 2 | 3 | 4)}
              className="inline-flex items-center justify-center rounded-full bg-[#2f9e44] p-3 shadow-lg text-white hover:bg-[#256b32] transition-colors mb-3"
            >
              <ArrowLeft className="h-5 w-5" />
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
                            onClick={() => {
                              console.log('[Cart] DELETE BUTTON CLICKED for svc.id:', svc.id);
                              removeService(svc.id);
                            }}
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
                  <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-semibold text-[#2f3a1f] mb-1.5 block">Address Line 1 *</label>
                      <input
                        value={addressForm.line1}
                        onChange={(e) => setAddressForm({ ...addressForm, line1: e.target.value })}
                        className="w-full px-3 py-2 rounded border border-[#cfd8a3] text-sm focus:border-[#2f9e44] focus:ring-1 focus:ring-[#2f9e44]"
                        placeholder="House / Flat / Street"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-semibold text-[#2f3a1f] mb-1.5 block">Address Line 2</label>
                      <input
                        value={addressForm.line2}
                        onChange={(e) => setAddressForm({ ...addressForm, line2: e.target.value })}
                        className="w-full px-3 py-2 rounded border border-[#cfd8a3] text-sm focus:border-[#2f9e44] focus:ring-1 focus:ring-[#2f9e44]"
                        placeholder="Landmark / Area"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-semibold text-[#2f3a1f] mb-1.5 block">City *</label>
                      <input
                        value={addressForm.city}
                        onChange={(e) => setAddressForm({ ...addressForm, city: e.target.value })}
                        className="w-full px-3 py-2 rounded border border-[#cfd8a3] text-sm focus:border-[#2f9e44] focus:ring-1 focus:ring-[#2f9e44]"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-semibold text-[#2f3a1f] mb-1.5 block">State *</label>
                      <input
                        value={addressForm.state}
                        onChange={(e) => setAddressForm({ ...addressForm, state: e.target.value })}
                        className="w-full px-3 py-2 rounded border border-[#cfd8a3] text-sm focus:border-[#2f9e44] focus:ring-1 focus:ring-[#2f9e44]"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-semibold text-[#2f3a1f] mb-1.5 block">Postal Code *</label>
                      <input
                        value={addressForm.postal_code}
                        onChange={(e) => setAddressForm({ ...addressForm, postal_code: e.target.value })}
                        className="w-full px-3 py-2 rounded border border-[#cfd8a3] text-sm focus:border-[#2f9e44] focus:ring-1 focus:ring-[#2f9e44]"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-semibold text-[#2f3a1f] mb-1.5 block">Country</label>
                      <input
                        value={addressForm.country}
                        onChange={(e) => setAddressForm({ ...addressForm, country: e.target.value })}
                        className="w-full px-3 py-2 rounded border border-[#cfd8a3] text-sm focus:border-[#2f9e44] focus:ring-1 focus:ring-[#2f9e44]"
                      />
                    </div>
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
                <div className="space-y-4">
                  <div>
                    <h3 className="text-sm font-semibold text-[#2f3a1f] mb-2">Select Service Provider</h3>
                    <div className="space-y-2">
                      {loadingProviders && (
                        <p className="text-xs text-[#4f5d2f]">Loading providers...</p>
                      )}
                      {!loadingProviders && providers.length === 0 && (
                        <p className="text-xs text-red-600">No providers available.</p>
                      )}
                      {!loadingProviders && providers.length > 0 && (
                        <select
                          value={providerId || ''}
                          onChange={(e) => setProviderId(e.target.value)}
                          className="w-full px-3 py-2 rounded border border-[#cfd8a3] text-sm focus:border-[#2f9e44] focus:ring-1 focus:ring-[#2f9e44]"
                        >
                          {providers.map((prov) => (
                            <option key={prov.id} value={prov.id}>
                              {prov.name} {prov.verified ? '✅' : ''}
                            </option>
                          ))}
                        </select>
                      )}
                    </div>
                  </div>

                  <div>
                    <h3 className="text-sm font-semibold text-[#2f3a1f] mb-2">Payment Method</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      {['UPI', 'Credit/Debit Card', 'Cash on Delivery'].map((method) => (
                        <div 
                          key={method}
                          className="p-4 rounded-lg border-2 border-[#e5e5e5] bg-white hover:border-[#2f9e44] transition-all text-left"
                        >
                          <span className="text-sm font-semibold text-[#2f3a1f] block">{method}</span>
                          <p className="text-xs text-[#4f5d2f] mt-0.5">Secure checkout</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="flex justify-end">
                    <button 
                      onClick={handleContinueToReview} 
                      disabled={savingAddress || loadingProviders}
                      className="px-5 py-2 rounded-lg bg-[#2f9e44] text-white text-sm font-semibold hover:bg-[#268a3b] disabled:opacity-50"
                    >
                      {savingAddress ? 'Saving address...' : 'Review Order'}
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Step 3: Review Order */}
            {checkoutStep === 3 && (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
                <div className="lg:col-span-8 bg-white rounded-lg border border-[#cfd8a3] p-4 space-y-4">
                  <div className="bg-[#f7fbe9] border border-[#e5eec4] rounded-lg p-3 text-sm text-[#2f3a1f]">
                    <div className="flex justify-between gap-2 flex-wrap">
                      <div>
                        <p className="font-semibold">Contact</p>
                        <p>{contactInfo.name}</p>
                        <p>{contactInfo.email}</p>
                        <p>{contactInfo.phone}</p>
                      </div>
                      <div>
                        <p className="font-semibold">Address</p>
                        <p>{addressForm.line1}</p>
                        {addressForm.line2 && <p>{addressForm.line2}</p>}
                        <p>{addressForm.city}, {addressForm.state} {addressForm.postal_code}</p>
                        {addressForm.country && <p>{addressForm.country}</p>}
                      </div>
                      <div>
                        <p className="font-semibold">Provider</p>
                        <p>{providers.find(p => p.id === providerId)?.name || 'Not selected'}</p>
                      </div>
                    </div>
                  </div>

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
                      onClick={handlePayment}
                      disabled={!razorpayLoaded || processingPayment}
                      className="w-full py-2.5 px-4 bg-[#2f9e44] text-white text-sm rounded-lg font-semibold hover:bg-[#268a3b] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {!razorpayLoaded ? 'Loading Payment Gateway...' : processingPayment ? 'Processing...' : 'Pay Now'}
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
    </>
  );
}
