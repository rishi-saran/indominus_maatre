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
  address: string;
  city: string;
  state: string;
  pincode: string;
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
