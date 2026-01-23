// lib/services/orders.service.ts

import { ApiService } from './api.service';
import { API_ENDPOINTS } from '@/lib/config/api.config';

/* =======================
   Types aligned to backend
======================= */

export interface OrderItem {
  id: string;
  service_id: string;
  package_id?: string | null;
  addon_id?: string | null;
  price: number;
}

export interface Order {
  id: string;
  user_id: string;
  provider_id: string;
  address_id: string;
  total_amount: number;
  status: string;
  order_items?: OrderItem[];
  created_at?: string;
}

/* =======================
   Create Order Params
======================= */

export interface CreateOrderParams {
  provider_id: string;
  address_id: string;
}

export class OrdersService {
  /**
   * Create order from cart (auth required)
   */
  static async create(params: CreateOrderParams): Promise<Order> {
    return ApiService.post<Order>(
      API_ENDPOINTS.orders.create,
      undefined,
      { params }
    );
  }

  /**
   * Get order by ID (owner only)
   */
  static async getById(orderId: string): Promise<Order> {
    return ApiService.get<Order>(
      API_ENDPOINTS.orders.getById(orderId)
    );
  }

  /**
   * List current user's orders
   */
  static async list(): Promise<Order[]> {
    return ApiService.get<Order[]>(
      API_ENDPOINTS.orders.list
    );
  }
}