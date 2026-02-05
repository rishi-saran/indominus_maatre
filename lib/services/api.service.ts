import { supabase } from '@/lib/supabase/client';

interface FetchOptions extends RequestInit {
  params?: Record<string, any>;
}

export class ApiService {
  private static async buildHeaders(extraHeaders?: HeadersInit) {
    let accessToken: string | null = null;

    // Always get fresh token from Supabase session
    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      
      if (session?.access_token) {
        accessToken = session.access_token;
        // Update localStorage with fresh token
        if (typeof window !== 'undefined') {
          localStorage.setItem('access_token', session.access_token);
        }
      }
    } catch (error) {
      console.warn("[ApiService] Failed to get Supabase session:", error);
    }

    // Fallback to localStorage token if session not available yet
    if (!accessToken && typeof window !== 'undefined') {
      const storedToken = localStorage.getItem('access_token');
      if (storedToken) {
        accessToken = storedToken;
        console.log('[ApiService] Using access token from localStorage');
      }
    }

    if (accessToken) {
      console.log('[ApiService] Access token available');
    } else {
      console.warn('[ApiService] No access token available');
    }

    return {
      'Content-Type': 'application/json',
      ...(accessToken && {
        Authorization: `Bearer ${accessToken}`,
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

  private static async retryWithBackoff<T>(
    fn: () => Promise<T>,
    maxRetries: number = 3,
    initialDelay: number = 500
  ): Promise<T> {
    let lastError: Error | undefined;
    
    for (let attempt = 0; attempt < maxRetries; attempt++) {
      try {
        return await fn();
      } catch (error) {
        lastError = error as Error;
        
        // Only retry on 500 errors or network errors
        const is500Error = lastError.message.includes('500:');
        const isNetworkError = lastError.message.includes('Failed to fetch');
        
        if ((is500Error || isNetworkError) && attempt < maxRetries - 1) {
          const delay = initialDelay * Math.pow(2, attempt);
          console.warn(
            `[ApiService] Request failed (attempt ${attempt + 1}/${maxRetries}). Retrying in ${delay}ms...`,
            lastError.message
          );
          await new Promise(resolve => setTimeout(resolve, delay));
        } else {
          throw error;
        }
      }
    }
    
    throw lastError || new Error('Max retries exceeded');
  }

  static async get<T>(endpoint: string, options?: FetchOptions): Promise<T> {
    return this.retryWithBackoff(() => this.getOnce<T>(endpoint, options));
  }

  private static async getOnce<T>(endpoint: string, options?: FetchOptions): Promise<T> {
    try {
      const url = this.buildUrl(endpoint, options?.params);
      const headers = await this.buildHeaders(options?.headers);

      const res = await fetch(url, {
        method: 'GET',
        credentials: 'include',
        ...options,
        headers,
      });

      if (!res.ok) {
        const errorText = await res.text();
        console.error(`[ApiService] GET ${endpoint} failed:`, res.status, errorText);
        throw new Error(`${res.status}: ${errorText}`);
      }

      return res.json();
    } catch (error) {
      console.error(`[ApiService] GET request failed for ${endpoint}:`, error);
      throw error;
    }
  }

  static async post<T>(
    endpoint: string,
    body?: any,
    options?: FetchOptions
  ): Promise<T> {
    return this.retryWithBackoff(() => this.postOnce<T>(endpoint, body, options));
  }

  private static async postOnce<T>(
    endpoint: string,
    body?: any,
    options?: FetchOptions
  ): Promise<T> {
    try {
      const url = this.buildUrl(endpoint, options?.params);
      const headers = await this.buildHeaders(options?.headers);

      const res = await fetch(url, {
        method: 'POST',
        credentials: 'include',
        ...options,
        headers,
        body: body ? JSON.stringify(body) : undefined,
      });

      if (!res.ok) {
        const errorText = await res.text();
        console.error(`[ApiService] POST ${endpoint} failed:`, res.status, errorText);
        throw new Error(`${res.status}: ${errorText}`);
      }

      return res.json();
    } catch (error) {
      console.error(`[ApiService] POST request failed for ${endpoint}:`, error);
      throw error;
    }
  }

  static async delete<T>(
    endpoint: string,
    options?: FetchOptions
  ): Promise<T> {
    try {
      const headers = await this.buildHeaders(options?.headers);

      const res = await fetch(endpoint, {
        method: 'DELETE',
        credentials: 'include',
        ...options,
        headers,
      });

      if (!res.ok) {
        const errorText = await res.text();
        console.error(`[ApiService] DELETE ${endpoint} failed:`, res.status, errorText);
        throw new Error(`${res.status}: ${errorText}`);
      }

      return res.json();
    } catch (error) {
      console.error(`[ApiService] DELETE request failed for ${endpoint}:`, error);
      throw error;
    }
  }
}