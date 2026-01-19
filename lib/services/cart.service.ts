import { ApiService } from './api.service';
import { API_ENDPOINTS } from '@/lib/config/api.config';

interface CartItem {
  service_name: string;
  package: string;
  addon?: string;
  price: number;
  quantity: number;
}

interface Cart {
  cart_id: string;
  items: CartItem[];
  total_amount: number;
}

interface AddItemRequest {
  service_id: string;
  package_id: string;
  addon_id?: string;
  quantity: number;
}

export class CartService {
  /**
   * Get or create cart for user
   */
  static async getCart(): Promise<Cart> {
    return ApiService.get<Cart>(API_ENDPOINTS.cart.get);
  }

  /**
   * Add item to cart
   */
  static async addItem(data: AddItemRequest): Promise<Cart> {
    return ApiService.post<Cart>(API_ENDPOINTS.cart.addItem, data);
  }

  /**
   * Remove item from cart
   */
  static async removeItem(itemId: string): Promise<{ success: boolean }> {
    return ApiService.delete<{ success: boolean }>(
      API_ENDPOINTS.cart.removeItem(itemId)
    );
  }
}
