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
import { AuthService } from '@/lib/services/auth.service';
import { ServicePackagesService } from '@/lib/services/service-packages.service';

interface CartService {
  id: string | number;
  service_id?: string;
  package_id?: string;
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
      console.log(`[Cart] Fetched catalog of ${catalog.length} services for sync`);
    } catch (error) {
      console.error('[Cart] Failed to fetch service catalog for sync:', error);
    }

    const normalize = (value: string) => value.toLowerCase().trim();

    for (const item of localServices) {
      const directId = item.service_id || (item as any).serviceId || (item as any).apiServiceId;
      let serviceId = directId ? String(directId) : null;

      console.log(`[Cart] Processing local item: "${item.title}" (Direct ID: ${serviceId})`);

      if (!serviceId && item.title) {
        // Manual override for specific services
        if (normalize(item.title).includes('abdha poorthi ayush homam')) {
          serviceId = '550e8400-e29b-41d4-a716-446655440003';
          console.log('[Cart] Applied manual override for Abdha Poorthi Ayush Homam');
        } else {
          const normalizedTitle = normalize(item.title);
          const matched = catalog.find((svc) => {
            const svcName = normalize(svc.name);
            return svcName.includes(normalizedTitle) || normalizedTitle.includes(svcName);
          });

          if (matched) {
            serviceId = String(matched.id);
            console.log(`[Cart] Matched "${item.title}" to backend service: "${matched.name}" (${serviceId})`);
          } else {
            console.warn(`[Cart] NO MATCH FOUND for "${item.title}" in catalog.`);
            // Optional: Log similar names to help debug
            const similar = catalog.filter(svc => normalize(svc.name).includes(normalizedTitle.substring(0, 5)));
            if (similar.length > 0) {
              console.log('[Cart] Did you mean one of these?', similar.map(s => s.name));
            }
          }
        }
      }

      if (!serviceId) {
        console.warn(`[Cart] Skipping item "${item.title}" - No Service ID resolved`);
        continue;
      }

      if (existingServiceIds.has(serviceId)) {
        console.log(`[Cart] Item "${item.title}" already exists in backend cart (ID: ${serviceId})`);
        continue;
      }

      // Fetch package ID if applicable
      let packageId: string | undefined = item.package_id;
      if (!packageId && item.formData?.package) {
        try {
          const packages = await ServicePackagesService.list({ service_id: serviceId });
          const matchedPkg = packages.find(p => p.name.toLowerCase() === item.formData?.package?.toLowerCase());
          if (matchedPkg) {
            packageId = matchedPkg.id;
            console.log(`[Cart] Resolved package "${item.formData.package}" to ID: ${packageId}`);
          } else {
            console.warn(`[Cart] Could not find backend package matching "${item.formData.package}" for service ${serviceId}`);

            // Generic fallback: If user selected a package but we can't match it by name (e.g. spelling diff),
            // safely default to the first available package for this service to ensure the item gets added to cart.
            if (packages.length > 0) {
              console.warn(`[Cart] Package name mismatch for "${item.title}". Defaulting to first available package: ${packages[0].name}`);
              packageId = packages[0].id;
            }
          }
        } catch (pkgError) {
          console.error('[Cart] Error fetching packages for service:', pkgError);
        }
      }

      try {
        console.log(`[Cart] Adding item to backend: "${item.title}" (ID: ${serviceId}, Pkg: ${packageId})`);
        const price = getServicePrice(item);
        await ApiService.post<any>('/api/cart/items', undefined, {
          params: {
            service_id: serviceId,
            quantity: 1,
            price,
            ...(packageId && { package_id: packageId })
          },
        });
        existingServiceIds.add(serviceId);
        console.log(`[Cart] Successfully synced "${item.title}"`);
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
    let finalPrice = svc.price ?? priceMap[pkg] ?? defaultPrices.Economy;

    // Fallback: Add flowers cost if not already included (if svc.price was missing)
    if (!svc.price && svc.formData?.flowers === 'Yes') {
      finalPrice += 250;
    }

    return finalPrice;
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

      // Wait for backend cart to settle
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Verify cart has items before creating order
      try {
        const cartverification = await ApiService.get<any>('/api/cart');
        console.log('[Cart] Post-sync verification items:', cartverification?.cart_items?.length);

        if (!cartverification?.cart_items || cartverification.cart_items.length === 0) {
          throw new Error("Unable to sync your cart with the server. Please check your connection or refresh the page.");
        }
      } catch (verifyError) {
        console.error('[Cart] Cart verification failed:', verifyError);
        throw verifyError;
      }

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

      <button
        onClick={() => {
          if (checkoutStep > 0) {
            setCheckoutStep(prev => Math.max(0, prev - 1) as 0 | 1 | 2 | 3 | 4);
          } else {
            router.push('/services');
          }
        }}
        className="fixed top-6 left-6 z-50 inline-flex items-center justify-center rounded-full bg-[#2f9e44] p-3 shadow-lg text-white hover:bg-[#25873a] transition-all"
        aria-label="Go back"
      >
        <ArrowLeft className="h-5 w-5" />
      </button>

      <div className="min-h-screen bg-gradient-to-r from-[#d6f0a8] via-[#eaf5b5] to-[#ffe6a3] py-6 px-4 md:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8 flex flex-col items-center text-center">
            <h1 className="text-3xl md:text-4xl font-serif font-medium text-[#2f3a1f] tracking-tight">
              {checkoutStep === 0 && 'Shopping Cart'}
              {checkoutStep === 1 && 'Contact & Delivery'}
              {checkoutStep === 2 && 'Payment Method'}
              {checkoutStep === 3 && 'Review Order'}
              {checkoutStep === 4 && 'Order Confirmed'}
            </h1>
            {checkoutStep === 0 && services.length > 0 && (
              <div className="mt-3 flex items-center gap-2">
                <span className="h-px w-8 bg-[#2f3a1f]/20"></span>
                <p className="text-sm font-medium text-[#4f5d2f] uppercase tracking-widest">
                  {services.length} {services.length === 1 ? 'Item' : 'Items'} in Cart
                </p>
                <span className="h-px w-8 bg-[#2f3a1f]/20"></span>
              </div>
            )}
            {checkoutStep > 0 && (
              <div className="mt-4 flex items-center gap-2 text-sm text-[#6c7d47]">
                <div className={`flex items-center justify-center w-6 h-6 rounded-full ${checkoutStep >= 1 ? 'bg-[#2f9e44] text-white' : 'bg-[#e5e5e5]'}`}>1</div>
                <div className={`w-12 h-1 rounded-full ${checkoutStep >= 2 ? 'bg-[#2f9e44]' : 'bg-[#e5e5e5]'}`}></div>
                <div className={`flex items-center justify-center w-6 h-6 rounded-full ${checkoutStep >= 2 ? 'bg-[#2f9e44] text-white' : 'bg-[#e5e5e5]'}`}>2</div>
                <div className={`w-12 h-1 rounded-full ${checkoutStep >= 3 ? 'bg-[#2f9e44]' : 'bg-[#e5e5e5]'}`}></div>
                <div className={`flex items-center justify-center w-6 h-6 rounded-full ${checkoutStep >= 3 ? 'bg-[#2f9e44] text-white' : 'bg-[#e5e5e5]'}`}>3</div>
              </div>
            )}
          </div>

          {services.length === 0 ? (
            <div className="bg-white/80 backdrop-blur-sm rounded-3xl border border-[#cfd8a3]/50 p-12 text-center shadow-sm max-w-2xl mx-auto">
              <div className="mb-6 inline-flex h-20 w-20 items-center justify-center rounded-full bg-[#f4f7e6] text-[#cfd8a3]">
                <ShoppingCart className="h-10 w-10 text-[#8ba15e]" />
              </div>
              <h2 className="text-2xl font-serif font-medium text-[#2f3a1f] mb-3">Your cart is empty</h2>
              <p className="text-[#6c7d47] mb-8 max-w-md mx-auto">Looks like you haven't added any poojas or homams yet. Explore our divine services to find peace and prosperity.</p>
              <button
                onClick={() => router.push('/services')}
                className="inline-flex items-center gap-2 px-8 py-3 bg-[#2f9e44] text-white rounded-xl font-semibold hover:bg-[#25873a] shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all"
              >
                Browse Divine Services
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          ) : (
            <>
              {/* Step 0: Cart Items */}
              {checkoutStep === 0 && (
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                  {/* Cart Items */}
                  <div className="lg:col-span-8">
                    <div className="bg-white rounded-2xl border border-[#cfd8a3]/60 shadow-sm overflow-hidden">
                      <div className="px-6 py-4 border-b border-[#f0f4df] flex items-center justify-between bg-[#fcfdf7]">
                        <h2 className="text-lg font-serif font-medium text-[#2f3a1f] tracking-wide">Cart Items ({services.length})</h2>
                        <button
                          onClick={clearAll}
                          className="flex items-center gap-1.5 text-xs font-medium text-red-500 hover:text-red-700 transition-colors uppercase tracking-wider"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                          Clear All
                        </button>
                      </div>

                      <div className="divide-y divide-[#f0f4df]">
                        {services.map((svc) => (
                          <div
                            key={svc.id}
                            className="p-6 flex gap-6 hover:bg-[#fafbf5] transition-colors group"
                          >
                            <div className="flex items-center pt-2">
                              <div className="relative">
                                <input
                                  type="checkbox"
                                  checked={svc.selected !== false}
                                  onChange={() => toggleSelection(svc.id)}
                                  className="peer h-5 w-5 cursor-pointer appearance-none rounded-md border border-[#cfd8a3] checked:bg-[#2f9e44] checked:border-[#2f9e44] transition-all"
                                />
                                <Check className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-3.5 w-3.5 text-white opacity-0 peer-checked:opacity-100 transition-opacity" />
                              </div>
                            </div>

                            <div className="relative h-28 w-28 flex-shrink-0 overflow-hidden rounded-xl border border-[#cfd8a3]/40 shadow-sm">
                              <img
                                src={svc.image}
                                alt={svc.title}
                                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                              />
                            </div>

                            <div className="flex flex-1 flex-col justify-between">
                              <div>
                                <div className="flex justify-between items-start">
                                  <h3 className="text-lg font-serif font-medium text-[#2f3a1f] leading-snug">
                                    {svc.title}
                                  </h3>
                                  <p className="text-lg font-bold text-[#2f9e44]">
                                    ₹{getServicePrice(svc).toLocaleString()}
                                  </p>
                                </div>

                                {svc.description && (
                                  <p className="mt-1 line-clamp-2 text-sm text-[#6c7d47] max-w-xl">
                                    {svc.description}
                                  </p>
                                )}

                                {svc.formData && (
                                  <div className="mt-3 flex flex-wrap gap-2">
                                    {svc.formData.package && (
                                      <span className="inline-flex items-center rounded-full bg-[#f4f7e6] px-2.5 py-0.5 text-xs font-medium text-[#4f5d2f] border border-[#d6e0b6]">
                                        Package: {svc.formData.package}
                                      </span>
                                    )}
                                    {svc.formData.date && (
                                      <span className="inline-flex items-center rounded-full bg-[#f4f7e6] px-2.5 py-0.5 text-xs font-medium text-[#4f5d2f] border border-[#d6e0b6]">
                                        Date: {svc.formData.date}
                                      </span>
                                    )}
                                    {svc.formData.flowers && svc.formData.flowers !== 'No' && (
                                      <span className="inline-flex items-center rounded-full bg-[#e6f7e9] px-2.5 py-0.5 text-xs font-medium text-[#2f9e44] border border-[#b6e0c2]">
                                        Flowers: {svc.formData.flowers}
                                      </span>
                                    )}
                                  </div>
                                )}
                              </div>

                              <div className="mt-4 flex justify-end">
                                <button
                                  onClick={() => removeService(svc.id)}
                                  className="text-xs font-medium text-red-500 hover:text-red-700 hover:bg-red-50 px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5"
                                >
                                  <Trash2 className="h-3.5 w-3.5" />
                                  Remove Item
                                </button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Order Summary */}
                  <div className="lg:col-span-4">
                    <div className="bg-white rounded-2xl border border-[#cfd8a3]/60 shadow-sm p-6 sticky top-24">
                      <h2 className="text-lg font-serif font-medium text-[#2f3a1f] mb-6 tracking-wide">
                        Order Summary
                      </h2>

                      <div className="space-y-4 mb-6">
                        <div className="flex justify-between items-center text-sm">
                          <span className="text-[#6c7d47]">Subtotal ({services.length} items)</span>
                          <span className="font-medium text-[#2f3a1f]">₹{subtotal.toLocaleString()}</span>
                        </div>
                        {appliedCoupon && (
                          <div className="flex justify-between items-center text-sm">
                            <span className="text-[#6c7d47] flex items-center gap-1">
                              Discount
                              <span className="text-xs bg-green-100 text-green-700 px-1.5 rounded">
                                {appliedCoupon}
                              </span>
                            </span>
                            <span className="font-medium text-green-600">-₹{discount.toLocaleString()}</span>
                          </div>
                        )}
                        <div className="flex justify-between items-center text-sm">
                          <span className="text-[#6c7d47]">GST (18%)</span>
                          <span className="font-medium text-[#2f3a1f]">₹{tax.toLocaleString()}</span>
                        </div>

                        <div className="pt-4 border-t border-dashed border-[#d8e2a8] flex justify-between items-end">
                          <span className="text-base font-serif font-medium text-[#2f3a1f]">Total Amount</span>
                          <span className="text-2xl font-bold text-[#2f9e44] leading-none">₹{total.toLocaleString()}</span>
                        </div>
                      </div>

                      <button
                        onClick={() => setCheckoutStep(1)}
                        className="w-full group relative flex items-center justify-center gap-2 overflow-hidden rounded-xl bg-[#2f9e44] px-6 py-4 text-white shadow-lg transition-all hover:bg-[#25873a] hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0"
                      >
                        <span className="font-semibold tracking-wide">Proceed to Checkout</span>
                        <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                      </button>

                      {/* Coupon Section */}
                      <div className="mt-6 pt-6 border-t border-[#f0f4df]">
                        {!appliedCoupon ? (
                          <>
                            {!showCouponInput ? (
                              <button
                                onClick={() => setShowCouponInput(true)}
                                className="text-sm font-medium text-[#2f9e44] hover:text-[#268a3b] hover:underline decoration-dashed underline-offset-4 flex items-center gap-2"
                              >
                                <span className="h-5 w-5 rounded-full bg-[#e9f5e0] flex items-center justify-center text-xs">+</span>
                                Add Coupon Code
                              </button>
                            ) : (
                              <div className="flex gap-2 animate-in fade-in slide-in-from-top-2 duration-300">
                                <input
                                  type="text"
                                  placeholder="Enter code"
                                  value={couponCode}
                                  onChange={(e) => setCouponCode(e.target.value)}
                                  className="flex-1 px-3 py-2 text-sm rounded-lg border border-[#cfd8a3] focus:border-[#2f9e44] focus:ring-2 focus:ring-[#2f9e44]/20 outline-none uppercase placeholder:normal-case placeholder:text-gray-400"
                                />
                                <button
                                  onClick={() => {
                                    if (couponCode.trim()) {
                                      setAppliedCoupon(couponCode);
                                      setShowCouponInput(false);
                                      setCouponCode('');
                                    }
                                  }}
                                  className="px-4 py-2 rounded-lg bg-[#2f3a1f] text-white text-sm font-medium hover:bg-black transition-colors"
                                >
                                  Apply
                                </button>
                                <button
                                  onClick={() => setShowCouponInput(false)}
                                  className="p-2 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100"
                                >
                                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                                </button>
                              </div>
                            )}
                          </>
                        ) : (
                          <div className="flex items-center justify-between bg-[#f0fdf4] border border-[#dcfce7] px-3 py-2 rounded-lg">
                            <div className="flex items-center gap-2">
                              <div className="h-5 w-5 rounded-full bg-green-100 flex items-center justify-center">
                                <Check className="h-3 w-3 text-green-600" />
                              </div>
                              <span className="text-sm text-[#2f3a1f]">Coupon <strong>{appliedCoupon}</strong> applied</span>
                            </div>
                            <button
                              onClick={() => setAppliedCoupon(null)}
                              className="text-xs font-medium text-red-500 hover:text-red-700 hover:underline"
                            >
                              Remove
                            </button>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Trust/Info Badges */}
                    <div className="mt-6 flex items-center justify-center gap-6 text-[#6c7d47] opacity-80">
                      <div className="flex items-center gap-1.5 text-xs">
                        <div className="h-2 w-2 rounded-full bg-[#2f9e44]"></div>
                        Secure Payment
                      </div>
                      <div className="flex items-center gap-1.5 text-xs">
                        <div className="h-2 w-2 rounded-full bg-[#2f9e44]"></div>
                        Verified Priests
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Step 1: Contact Details */}
              {checkoutStep === 1 && (
                <div className="max-w-3xl mx-auto bg-white rounded-2xl border border-[#cfd8a3]/60 shadow-sm p-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="text-sm font-semibold text-[#2f3a1f] mb-1.5 block">Full Name</label>
                      <input
                        value={contactInfo.name}
                        onChange={(e) => setContactInfo({ ...contactInfo, name: e.target.value })}
                        className="w-full px-4 py-2.5 rounded-lg border border-[#cfd8a3] text-sm focus:border-[#2f9e44] focus:ring-2 focus:ring-[#2f9e44]/20 outline-none transition-all"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-semibold text-[#2f3a1f] mb-1.5 block">Email</label>
                      <input
                        type="email"
                        value={contactInfo.email}
                        onChange={(e) => setContactInfo({ ...contactInfo, email: e.target.value })}
                        className="w-full px-4 py-2.5 rounded-lg border border-[#cfd8a3] text-sm focus:border-[#2f9e44] focus:ring-2 focus:ring-[#2f9e44]/20 outline-none transition-all"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-semibold text-[#2f3a1f] mb-1.5 block">Phone</label>
                      <input
                        value={contactInfo.phone}
                        onChange={(e) => setContactInfo({ ...contactInfo, phone: e.target.value })}
                        className="w-full px-4 py-2.5 rounded-lg border border-[#cfd8a3] text-sm focus:border-[#2f9e44] focus:ring-2 focus:ring-[#2f9e44]/20 outline-none transition-all"
                      />
                    </div>
                    <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="md:col-span-2 border-t border-[#f0f4df] pt-4 mt-2">
                        <h3 className="text-base font-serif font-medium text-[#2f3a1f] mb-4">Address Details</h3>
                      </div>
                      <div>
                        <label className="text-sm font-semibold text-[#2f3a1f] mb-1.5 block">Address Line 1 *</label>
                        <input
                          value={addressForm.line1}
                          onChange={(e) => setAddressForm({ ...addressForm, line1: e.target.value })}
                          className="w-full px-4 py-2.5 rounded-lg border border-[#cfd8a3] text-sm focus:border-[#2f9e44] focus:ring-2 focus:ring-[#2f9e44]/20 outline-none transition-all"
                          placeholder="House / Flat / Street"
                        />
                      </div>
                      <div>
                        <label className="text-sm font-semibold text-[#2f3a1f] mb-1.5 block">Address Line 2</label>
                        <input
                          value={addressForm.line2}
                          onChange={(e) => setAddressForm({ ...addressForm, line2: e.target.value })}
                          className="w-full px-4 py-2.5 rounded-lg border border-[#cfd8a3] text-sm focus:border-[#2f9e44] focus:ring-2 focus:ring-[#2f9e44]/20 outline-none transition-all"
                          placeholder="Landmark / Area"
                        />
                      </div>
                      <div>
                        <label className="text-sm font-semibold text-[#2f3a1f] mb-1.5 block">City *</label>
                        <input
                          value={addressForm.city}
                          onChange={(e) => setAddressForm({ ...addressForm, city: e.target.value })}
                          className="w-full px-4 py-2.5 rounded-lg border border-[#cfd8a3] text-sm focus:border-[#2f9e44] focus:ring-2 focus:ring-[#2f9e44]/20 outline-none transition-all"
                        />
                      </div>
                      <div>
                        <label className="text-sm font-semibold text-[#2f3a1f] mb-1.5 block">State *</label>
                        <input
                          value={addressForm.state}
                          onChange={(e) => setAddressForm({ ...addressForm, state: e.target.value })}
                          className="w-full px-4 py-2.5 rounded-lg border border-[#cfd8a3] text-sm focus:border-[#2f9e44] focus:ring-2 focus:ring-[#2f9e44]/20 outline-none transition-all"
                        />
                      </div>
                      <div>
                        <label className="text-sm font-semibold text-[#2f3a1f] mb-1.5 block">Postal Code *</label>
                        <input
                          value={addressForm.postal_code}
                          onChange={(e) => setAddressForm({ ...addressForm, postal_code: e.target.value })}
                          className="w-full px-4 py-2.5 rounded-lg border border-[#cfd8a3] text-sm focus:border-[#2f9e44] focus:ring-2 focus:ring-[#2f9e44]/20 outline-none transition-all"
                        />
                      </div>
                      <div>
                        <label className="text-sm font-semibold text-[#2f3a1f] mb-1.5 block">Country</label>
                        <input
                          value={addressForm.country}
                          onChange={(e) => setAddressForm({ ...addressForm, country: e.target.value })}
                          className="w-full px-4 py-2.5 rounded-lg border border-[#cfd8a3] text-sm focus:border-[#2f9e44] focus:ring-2 focus:ring-[#2f9e44]/20 outline-none transition-all"
                        />
                      </div>
                    </div>
                  </div>
                  <div className="flex justify-end mt-8 border-t border-[#f0f4df] pt-6">
                    <button
                      onClick={() => setCheckoutStep(2)}
                      className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#2f9e44] text-white font-semibold hover:bg-[#25873a] shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all"
                    >
                      Continue to Payment
                      <ArrowRight className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              )}

              {/* Step 2: Payment Method */}
              {checkoutStep === 2 && (
                <div className="max-w-3xl mx-auto bg-white rounded-2xl border border-[#cfd8a3]/60 shadow-sm p-8">
                  <div className="space-y-8">
                    <div>
                      <h3 className="text-base font-serif font-medium text-[#2f3a1f] mb-4">Select Service Provider</h3>
                      <div className="space-y-2">
                        {loadingProviders && (
                          <div className="flex items-center gap-2 text-sm text-[#4f5d2f]">
                            <div className="h-4 w-4 rounded-full border-2 border-[#2f9e44] border-t-transparent animate-spin"></div>
                            Loading available priests...
                          </div>
                        )}
                        {!loadingProviders && providers.length === 0 && (
                          <p className="text-sm text-red-600 bg-red-50 p-3 rounded-lg border border-red-100">
                            No providers currently available for this area.
                          </p>
                        )}
                        {!loadingProviders && providers.length > 0 && (
                          <div className="relative">
                            <select
                              value={providerId || ''}
                              onChange={(e) => setProviderId(e.target.value)}
                              className="w-full appearance-none px-4 py-3 rounded-xl border border-[#cfd8a3] text-sm bg-white focus:border-[#2f9e44] focus:ring-2 focus:ring-[#2f9e44]/20 outline-none transition-all cursor-pointer"
                            >
                              {providers.map((prov) => (
                                <option key={prov.id} value={prov.id}>
                                  {prov.name} {prov.verified ? '(Verified Priest)' : ''}
                                </option>
                              ))}
                            </select>
                            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-gray-500">
                              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    <div>
                      <h3 className="text-base font-serif font-medium text-[#2f3a1f] mb-4">Payment Method</h3>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {['UPI', 'Credit/Debit Card', 'Cash on Delivery'].map((method) => (
                          <div
                            key={method}
                            className="group cursor-pointer p-5 rounded-xl border border-[#cfd8a3] bg-[#fafbf5] hover:bg-white hover:border-[#2f9e44] hover:shadow-md transition-all text-left relative overflow-hidden"
                          >
                            <div className="flex flex-col gap-1 relative z-10">
                              <span className="text-sm font-semibold text-[#2f3a1f] group-hover:text-[#2f9e44] transition-colors">{method}</span>
                              <p className="text-xs text-[#6c7d47]">Secure checkout</p>
                            </div>
                            <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                              <div className="h-4 w-4 rounded-full bg-[#2f9e44] flex items-center justify-center">
                                <Check className="h-2.5 w-2.5 text-white" />
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="flex justify-end pt-6 border-t border-[#f0f4df]">
                      <button
                        onClick={handleContinueToReview}
                        disabled={savingAddress || loadingProviders}
                        className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#2f9e44] text-white font-semibold hover:bg-[#25873a] shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {savingAddress ? 'Saving Details...' : 'Review Order'}
                        <ArrowRight className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Step 3: Review Order */}
              {checkoutStep === 3 && (
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                  <div className="lg:col-span-8 space-y-6">
                    {/* Booking Details */}
                    <div className="bg-white rounded-2xl border border-[#cfd8a3]/60 shadow-sm p-8 space-y-6">
                      <h2 className="text-xl font-serif font-medium text-[#2f3a1f]">Booking Details</h2>

                      <div className="bg-[#f7fbe9]/50 border border-[#e5eec4] rounded-xl p-6 text-sm text-[#2f3a1f]">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                          <div className="space-y-1">
                            <p className="font-semibold text-[#6c7d47] uppercase tracking-wide text-xs mb-2">Billing Contact</p>
                            <p className="font-medium text-base">{contactInfo.name}</p>
                            <p className="text-[#4f5d2f]">{contactInfo.email}</p>
                            <p className="text-[#4f5d2f]">{contactInfo.phone}</p>
                          </div>
                          <div className="space-y-1">
                            <p className="font-semibold text-[#6c7d47] uppercase tracking-wide text-xs mb-2">Location</p>
                            <p className="text-[#2f3a1f]">{addressForm.line1}</p>
                            {addressForm.line2 && <p className="text-[#4f5d2f]">{addressForm.line2}</p>}
                            <p className="text-[#4f5d2f]">{addressForm.city}, {addressForm.state} {addressForm.postal_code}</p>
                          </div>
                          <div className="space-y-1">
                            <p className="font-semibold text-[#6c7d47] uppercase tracking-wide text-xs mb-2">Priest</p>
                            <div className="flex items-center gap-2">
                              <span className="font-medium">{providers.find(p => p.id === providerId)?.name || 'Not selected'}</span>
                              {providers.find(p => p.id === providerId)?.verified && (
                                <span className="bg-green-100 text-green-700 text-[10px] px-1.5 py-0.5 rounded-full font-medium">Verified</span>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Order Items Review */}
                    <div className="bg-white rounded-2xl border border-[#cfd8a3]/60 shadow-sm p-8">
                      <h2 className="text-xl font-serif font-medium text-[#2f3a1f] mb-4">Services</h2>
                      <div className="divide-y divide-[#f0f4df]">
                        {services.map((svc) => (
                          <div key={svc.id} className="flex gap-4 py-4 first:pt-0 last:pb-0">
                            <img
                              src={svc.image}
                              alt={svc.title}
                              className="w-16 h-16 rounded-lg object-cover border border-[#cfd8a3]/40"
                            />
                            <div className="flex-1 min-w-0">
                              <h3 className="text-sm font-semibold text-[#2f3a1f] mb-1">{svc.title}</h3>
                              {svc.description && (
                                <p className="text-xs text-[#6c7d47] mb-1 line-clamp-1">{svc.description}</p>
                              )}
                              {svc.formData && (
                                <div className="flex gap-2 text-xs text-[#6c7d47]">
                                  {svc.formData.package && <span className="bg-[#f4f7e6] px-1.5 py-0.5 rounded">Pkg: {svc.formData.package}</span>}
                                  {svc.formData.flowers && svc.formData.flowers !== 'No' && <span className="bg-[#f4f7e6] px-1.5 py-0.5 rounded">Flowers: Yes</span>}
                                </div>
                              )}
                            </div>
                            <div className="text-right">
                              <p className="text-sm font-bold text-[#2f3a1f] bg-[#eef4cf] px-2 py-1 rounded">₹{getServicePrice(svc).toLocaleString()}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Payment Summary */}
                  <div className="lg:col-span-4">
                    <div className="bg-white rounded-2xl border border-[#cfd8a3]/60 shadow-sm p-6 sticky top-24">
                      <h2 className="text-lg font-serif font-medium text-[#2f3a1f] mb-4">Payment Summary</h2>

                      {appliedCoupon && (
                        <div className="bg-[#eef4cf] px-3 py-2 rounded-lg mb-4 text-xs flex justify-between items-center text-[#2f3a1f] border border-[#d6e0b6]">
                          <span><strong>Coupon Applied:</strong> {appliedCoupon}</span>
                          <Check className="h-3 w-3 text-[#2f9e44]" />
                        </div>
                      )}

                      <div className="space-y-3 mb-6 pb-6 border-b border-[#f0f4df]">
                        <div className="flex justify-between text-sm">
                          <span className="text-[#6c7d47]">Subtotal</span>
                          <span className="text-[#2f3a1f] font-medium">₹{subtotal.toLocaleString()}</span>
                        </div>
                        {appliedCoupon && (
                          <div className="flex justify-between text-sm">
                            <span className="text-[#6c7d47]">Discount</span>
                            <span className="text-green-600 font-medium">-₹{discount.toLocaleString()}</span>
                          </div>
                        )}
                        <div className="flex justify-between text-sm">
                          <span className="text-[#6c7d47]">GST (18%)</span>
                          <span className="text-[#2f3a1f] font-medium">₹{tax.toLocaleString()}</span>
                        </div>
                      </div>

                      <div className="flex justify-between items-end mb-6">
                        <span className="text-base font-serif font-medium text-[#2f3a1f]">Total Amount</span>
                        <span className="text-2xl font-bold text-[#2f9e44] leading-none">₹{total.toLocaleString()}</span>
                      </div>

                      <button
                        onClick={handlePayment}
                        disabled={!razorpayLoaded || processingPayment}
                        className="w-full relative flex items-center justify-center gap-2 overflow-hidden rounded-xl bg-[#2f9e44] px-6 py-4 text-white shadow-lg transition-all hover:bg-[#25873a] hover:shadow-xl hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0"
                      >
                        {!razorpayLoaded ? (
                          'Loading Gateway...'
                        ) : processingPayment ? (
                          <>
                            <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                            <span>Processing...</span>
                          </>
                        ) : (
                          <>
                            <span className="font-semibold tracking-wide">Pay Now</span>
                            <ArrowRight className="h-4 w-4" />
                          </>
                        )}
                      </button>

                      <p className="text-center text-xs text-[#6c7d47] mt-3">
                        By clicking pay, you agree to our terms of service
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Step 4: Order Success */}
              {checkoutStep === 4 && (
                <div className="max-w-xl mx-auto bg-white rounded-3xl border border-[#cfd8a3]/60 shadow-sm p-10 text-center animate-in fade-in zoom-in duration-500">
                  <div className="w-20 h-20 bg-[#f0fdf4] rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm border border-[#dcfce7]">
                    <Check className="h-10 w-10 text-[#2f9e44]" />
                  </div>
                  <h2 className="text-3xl font-serif font-medium text-[#2f3a1f] mb-2">Order Placed Successfully!</h2>
                  <p className="text-[#6c7d47] mb-8 max-w-sm mx-auto leading-relaxed">
                    Thank you for your booking. May the divine blessings bring peace and prosperity to your life.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <button
                      onClick={() => router.push('/profile')}
                      className="px-6 py-3 rounded-xl border-2 border-[#cfd8a3] text-[#2f3a1f] font-semibold hover:bg-[#fcfdf7] hover:border-[#2f9e44] transition-all"
                    >
                      View Booking Details
                    </button>
                    <button
                      onClick={() => router.push('/services')}
                      className="px-6 py-3 rounded-xl bg-[#2f9e44] text-white font-semibold hover:bg-[#25873a] shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all"
                    >
                      Continue Shopping
                    </button>
                  </div>
                </div>
              )}
            </>
          )
          }
        </div >
      </div >
    </>
  );
}
