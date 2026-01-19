import { ApiService } from './api.service';
import { API_ENDPOINTS } from '@/lib/config/api.config';

interface Address {
  address: string;
  city: string;
  state: string;
  pincode: string;
}

interface CreateOrderRequest {
  user_id: string;
  address: Address;
}

interface Order {
  order_id: string;
  status: string;
  total_amount: number;
  items?: any[];
  created_at?: string;
  updated_at?: string;
}

export class OrdersService {
  /**
   * Create a new order
   */
  static async create(data: CreateOrderRequest): Promise<Order> {
    return ApiService.post<Order>(API_ENDPOINTS.orders.create, data);
  }

  /**
   * Get order by ID
   */
  static async getById(orderId: string): Promise<Order> {
    return ApiService.get<Order>(API_ENDPOINTS.orders.getById(orderId));
  }

  /**
   * List all orders for current user
   */
  static async list(params?: { user_id?: string }): Promise<Order[]> {
    // Pass user_id as query parameter to the API route
    return ApiService.get<Order[]>(API_ENDPOINTS.orders.list, { params: params || {} });
  }
}
