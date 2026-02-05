// lib/utils/razorpay.ts
import { supabase } from '@/lib/supabase/client';

export interface RazorpayOptions {
  key: string;
  amount: number;
  currency: string;
  name: string;
  description: string;
  order_id: string;
  prefill: {
    name: string;
    email: string;
    contact: string;
  };
  theme: {
    color: string;
  };
  handler: (response: RazorpayResponse) => void;
  modal: {
    ondismiss: () => void;
  };
}

export interface RazorpayResponse {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
}

export const initializeRazorpayPayment = async (
  amount: number,
  userInfo: { name: string; email: string; phone: string },
  orderContext: { providerId: string; addressId: string },
  onSuccess: (response: RazorpayResponse) => Promise<void>,
  onDismiss: () => void
): Promise<void> => {
  // Get auth token
  const { data: { session } } = await supabase.auth.getSession();
  const accessToken = session?.access_token || (typeof window !== 'undefined' ? localStorage.getItem('access_token') : null);
  if (!accessToken) {
    console.error('No valid Supabase session found');
    throw new Error('Please login to continue');
  }
  
  console.log('✓ Valid Supabase session found, token exists');
  console.log('Token preview:', accessToken.substring(0, 20) + '...');

  // Step 1: Create order in database FIRST (status: PENDING)
  console.log('📝 Creating order in database...');
  const createOrderResponse = await fetch('/api/orders', {
    method: 'POST',
    headers: { 
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${accessToken}`
    },
    body: JSON.stringify({
      provider_id: orderContext.providerId,
      address_id: orderContext.addressId,
      amount: Math.round(amount * 100),
      currency: 'INR',
    }),
  });

  if (!createOrderResponse.ok) {
    const errorData = await createOrderResponse.json().catch(() => null);
    const detail = errorData?.detail || errorData?.error || errorData?.message;
    throw new Error(detail ? `Failed to create order: ${detail}` : 'Failed to create order in database');
  }

  const orderData = await createOrderResponse.json();
  const databaseOrderId = orderData.id || `order_${Date.now()}`;
  console.log('✓ Order created in database:', databaseOrderId);

  // Step 2: Create Razorpay payment order using database order ID
  console.log('💳 Creating Razorpay payment order...');
  
  const response = await fetch('/api/payments', {
    method: 'POST',
    headers: { 
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${accessToken}`
    },
    body: JSON.stringify({
      order_id: databaseOrderId,
      amount: Math.round(amount * 100), // Convert to paise
      currency: 'INR',
      user_email: userInfo.email,
      notes: {
        customer_name: userInfo.name,
        customer_email: userInfo.email,
        customer_phone: userInfo.phone,
      },
    }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => null);
    const detail = errorData?.detail || errorData?.error || errorData?.message;
    throw new Error(detail ? `Failed to create Razorpay order: ${detail}` : 'Failed to create Razorpay order');
  }

  const razorpayOrderData = await response.json();

  // Open Razorpay Checkout
  const options: RazorpayOptions = {
    key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || '',
    amount: razorpayOrderData.amount,
    currency: razorpayOrderData.currency,
    name: 'Maathre',
    description: 'Sacred Services Payment',
    order_id: razorpayOrderData.razorpay_order_id,
    prefill: {
      name: userInfo.name,
      email: userInfo.email,
      contact: userInfo.phone,
    },
    theme: {
      color: '#2f9e44',
    },
    handler: onSuccess,
    modal: {
      ondismiss: onDismiss,
    },
  };

  const razorpay = new (window as any).Razorpay(options);
  razorpay.open();
};

export const verifyRazorpayPayment = async (
  response: RazorpayResponse
): Promise<boolean> => {
  // Get auth token
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) {
    throw new Error('Session expired');
  }

  const verifyResponse = await fetch('/api/payments/verify', {
    method: 'POST',
    headers: { 
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${session.access_token}`
    },
    body: JSON.stringify(response),
  });

  return verifyResponse.ok;
};
