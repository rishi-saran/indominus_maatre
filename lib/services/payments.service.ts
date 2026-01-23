// lib/services/payments.service.ts

import { ApiService } from './api.service';
import { API_ENDPOINTS } from '@/lib/config/api.config';

/* =======================
   Types aligned to backend
======================= */

export interface Payment {
  id: string;
  order_id: string;
  method: string;
  status: string;
  amount: number;
  currency?: string;
  razorpay_order_id?: string;
  razorpay_payment_id?: string;
  created_at?: string;
}

/* =======================
   Payment Service
======================= */

export class PaymentsService {
  /**
   * Get payment by ID
   */
  static async getById(paymentId: string): Promise<Payment> {
    return ApiService.get<Payment>(
      API_ENDPOINTS.payments.getById(paymentId)
    );
  }

  /**
   * List payments for an order
   */
  static async listByOrder(orderId: string): Promise<Payment[]> {
    return ApiService.get<Payment[]>(
      API_ENDPOINTS.payments.list,
      { params: { order_id: orderId } }
    );
  }
}