// lib/services/addresses.service.ts

import { ApiService } from './api.service';
import { API_ENDPOINTS } from '@/lib/config/api.config';

export interface Address {
  id: string;
  user_id: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
}

export interface CreateAddressPayload {
  line1: string;      // Backend expects line1, not address
  line2?: string;     // Optional second line
  city: string;
  state: string;
  postal_code: string; // Backend expects postal_code, not pincode
}

export class AddressesService {
  /** List addresses for logged-in user */
  static async list(): Promise<Address[]> {
    return ApiService.get<Address[]>(API_ENDPOINTS.addresses.list);
  }

  /** Create address for logged-in user */
  static async create(payload: CreateAddressPayload): Promise<Address> {
    return ApiService.post<Address>(API_ENDPOINTS.addresses.create, payload);
  }
}
