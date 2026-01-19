import { ApiService } from './api.service';
import { API_ENDPOINTS } from '@/lib/config/api.config';

interface CreatePaymentRequest {
  order_id: string;
  method: string;
}

interface Payment {
  payment_id: string;
  status: string;
  amount?: number;
  method?: string;
  created_at?: string;
}

export class PaymentsService {
  /**
   * Create a new payment
   */
  static async create(data: CreatePaymentRequest): Promise<Payment> {
    return ApiService.post<Payment>(API_ENDPOINTS.payments.create, data);
  }

  /**
   * Get payment by ID
   */
  static async getById(paymentId: string): Promise<Payment> {
    return ApiService.get<Payment>(API_ENDPOINTS.payments.getById(paymentId));
  }

  /**
   * List all payments
   */
  static async list(params?: { order_id?: string }): Promise<Payment[]> {
    return ApiService.get<Payment[]>(API_ENDPOINTS.payments.list, { params: params });
  }
}
