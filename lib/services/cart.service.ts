// lib/services/cart.service.ts

import { ApiService } from './api.service';
import { API_ENDPOINTS } from '@/lib/config/api.config';

/* =======================
   Types aligned to backend
======================= */

export interface CartItem {
  id: string;
  service_id: string;
  package_id?: string | null;
  addon_id?: string | null;
  quantity: number;
  price?: number;
}

export interface Cart {
  id: string;
  user_id: string;
  cart_items: CartItem[];
}

export interface AddItemParams {
  service_id: string;
  package_id?: string;
  addon_id?: string;
  quantity?: number;
  price: number;
}

export class CartService {
  /**
   * Get or create cart (auth required)
   */
  static async getCart(): Promise<Cart> {
    return ApiService.get<Cart>(API_ENDPOINTS.cart.get);
  }

  /**
   * Add item to cart (query params, NOT body)
   */
  static async addItem(params: AddItemParams): Promise<CartItem> {
    return ApiService.post<CartItem>(
      API_ENDPOINTS.cart.addItem,
      undefined,
      { params }
    );
  }

  /**
   * Remove item from cart
   */
  static async removeItem(itemId: string): Promise<{ status: string }> {
    return ApiService.delete<{ status: string }>(
      API_ENDPOINTS.cart.removeItem(itemId)
    );
  }
}