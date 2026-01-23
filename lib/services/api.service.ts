import { supabase } from '@/lib/supabase/client';

interface FetchOptions extends RequestInit {
  params?: Record<string, any>;
}

export class ApiService {
  private static async buildHeaders(extraHeaders?: HeadersInit) {
    const {
      data: { session },
    } = await supabase.auth.getSession();

    return {
      'Content-Type': 'application/json',
      ...(session?.access_token && {
        Authorization: `Bearer ${session.access_token}`,
      }),
      ...extraHeaders,
    };
  }

  private static buildUrl(endpoint: string, params?: Record<string, any>) {
    if (!params) return endpoint;

    const search = new URLSearchParams();
    Object.entries(params).forEach(([k, v]) => {
      if (v !== undefined && v !== null) {
        search.append(k, String(v));
      }
    });

    return search.toString() ? `${endpoint}?${search}` : endpoint;
  }

  static async get<T>(endpoint: string, options?: FetchOptions): Promise<T> {
    const url = this.buildUrl(endpoint, options?.params);
    const headers = await this.buildHeaders(options?.headers);

    const res = await fetch(url, {
      method: 'GET',
      credentials: 'include',
      ...options,
      headers,
    });

    if (!res.ok) throw new Error(await res.text());
    return res.json();
  }

  static async post<T>(
    endpoint: string,
    body?: any,
    options?: FetchOptions
  ): Promise<T> {
    const url = this.buildUrl(endpoint, options?.params);
    const headers = await this.buildHeaders(options?.headers);

    const res = await fetch(url, {
      method: 'POST',
      credentials: 'include',
      ...options,
      headers,
      body: body ? JSON.stringify(body) : undefined,
    });

    if (!res.ok) throw new Error(await res.text());
    return res.json();
  }

  static async delete<T>(
    endpoint: string,
    options?: FetchOptions
  ): Promise<T> {
    const headers = await this.buildHeaders(options?.headers);

    const res = await fetch(endpoint, {
      method: 'DELETE',
      credentials: 'include',
      ...options,
      headers,
    });

    if (!res.ok) throw new Error(await res.text());
    return res.json();
  }
}