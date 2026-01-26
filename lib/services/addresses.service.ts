// lib/services/addresses.service.ts

import { ApiService } from './api.service';
import { API_ENDPOINTS } from '@/lib/config/api.config';

export interface Address {
  id: string;
  line1: string;
  line2?: string | null;
  city: string;
  state: string;
  postal_code: string;
  country?: string;
  created_at?: string;
}

export interface CreateAddressPayload {
  line1: string;
  line2?: string;
  city: string;
  state: string;
  postal_code: string;
  country?: string;
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
