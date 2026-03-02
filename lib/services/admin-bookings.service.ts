import { ApiService } from '@/lib/services/api.service';

/* =======================
   Types
======================= */

export interface BookingPriest {
  id: string;
  priest_id: string;
  name: string;
  commission_percent: number;
  commission_amount: number;
}

export interface Booking {
  id: string;
  order_id?: string | null;
  customer_id?: string | null;
  customer_name: string;
  service_id?: string | null;
  service_name: string;
  booking_date: string;
  booking_time: string;
  location: string;
  total_amount: number;
  admin_net_amount: number | null;
  refund_id?: string | null;
  refund_status?: string | null;
  status: 'pending' | 'completed' | 'cancelled';
  created_type: 'manual' | 'razorpay';
  created_at: string;
  priests: BookingPriest[];
}

interface CreateBookingBase {
  customer_name: string;
  booking_date: string;
  booking_time: string;
  location: string;
  total_amount: number;
  created_type: 'manual' | 'razorpay';
}

export type CreateBookingParams =
  | (CreateBookingBase & { service_id: string; service_name?: string })
  | (CreateBookingBase & { service_name: string; service_id?: string });

export interface AssignPriestEntry {
  priest_id: string;
  commission_percent: number;
}

export interface AssignPriestsParams {
  priests: AssignPriestEntry[];
}

/* =======================
   Admin Bookings Service
======================= */

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1';

export class AdminBookingsService {
  /**
   * List all bookings (admin)
   */
  static async list(): Promise<Booking[]> {
    return ApiService.get<Booking[]>(`${API_BASE}/admin/bookings/`);
  }

  /**
   * Get a single booking by ID
   */
  static async getById(bookingId: string): Promise<Booking> {
    return ApiService.get<Booking>(`${API_BASE}/admin/bookings/${bookingId}`);
  }

  /**
   * Create a manual booking (admin)
   */
  static async create(data: CreateBookingParams): Promise<Booking> {
    return ApiService.post<Booking>(`${API_BASE}/admin/bookings/`, data);
  }

  /**
   * Assign priests to a booking with commission percentages.
   * Backend calculates sequential commission and updates admin_net_amount.
   */
  static async assignPriests(bookingId: string, data: AssignPriestsParams): Promise<Booking> {
    return ApiService.post<Booking>(
      `${API_BASE}/admin/bookings/${bookingId}/assign-priests`,
      data
    );
  }

  /**
   * Mark a booking as completed
   */
  static async markCompleted(bookingId: string): Promise<Booking> {
    const url = `${API_BASE}/admin/bookings/${bookingId}/complete`;
    // Use direct fetch to avoid ApiService logging for expected 404s
    const headers = await ApiService.getAuthHeaders();
    const res = await fetch(url, {
      method: 'PUT',
      headers,
      credentials: 'include',
      body: JSON.stringify({}),
    });

    if (!res.ok) {
      const errorText = await res.text();
      throw new Error(`${res.status}: ${errorText}`);
    }

    return res.json();
  }

  /**
   * Cancel a booking
   */
  static async cancel(bookingId: string): Promise<Booking> {
    return ApiService.put<Booking>(
      `${API_BASE}/admin/bookings/${bookingId}/cancel`,
      {}
    );
  }
}
