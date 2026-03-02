import { supabase } from '@/lib/supabase/client';

interface FetchOptions extends RequestInit {
  params?: Record<string, any>;
}

export class ApiService {
  private static loggedUrls = new Set<string>();
  private static loggedTokenSubs = new Set<string>();

  private static logTokenSubject(token: string) {
    try {
      const parts = token.split('.');
      if (parts.length !== 3) return;
      const payload = JSON.parse(atob(parts[1]));
      const sub = payload?.sub;
      if (!sub) return;
      if (this.loggedTokenSubs.has(sub)) return;
      console.info('[ApiService] JWT sub:', sub);
      this.loggedTokenSubs.add(sub);
    } catch {
      // ignore decode errors for debug logging
    }
  }
  // Public method to get headers for authenticated requests
  static async getAuthHeaders(extraHeaders?: HeadersInit) {
    return await this.buildHeaders(undefined, extraHeaders);
  }
  private static async buildHeaders(endpoint?: string, extraHeaders?: HeadersInit) {
    let accessToken: string | null = null;
    const isAdminEndpoint = endpoint?.includes('/admin/') ?? false;

    // Always prefer fresh Supabase session token first
    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (session?.access_token) {
        accessToken = session.access_token;
        if (typeof window !== 'undefined') {
          localStorage.setItem('access_token', session.access_token);
          if (isAdminEndpoint) {
            localStorage.setItem('adminToken', session.access_token);
          }
        }
      }
    } catch (error) {
      console.warn("[ApiService] Failed to get Supabase session:", error);
    }

    // Fallback to localStorage token if session not available yet
    if (!accessToken && typeof window !== 'undefined') {
      const storedToken = isAdminEndpoint
        ? localStorage.getItem('adminToken') || localStorage.getItem('access_token')
        : localStorage.getItem('access_token');
      if (storedToken) {
        accessToken = storedToken;
        console.log('[ApiService] Using access token from localStorage');
      }
    }

    if (accessToken) {
      console.log('[ApiService] Access token available');
      if (isAdminEndpoint) {
        this.logTokenSubject(accessToken);
      }
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
      const headers = await this.buildHeaders(endpoint, options?.headers);

      if (!this.loggedUrls.has(url)) {
        console.info('[ApiService] Resolved GET URL:', url);
        this.loggedUrls.add(url);
      }

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
      const headers = await this.buildHeaders(endpoint, options?.headers);

      if (!this.loggedUrls.has(url)) {
        console.info('[ApiService] Resolved POST URL:', url);
        this.loggedUrls.add(url);
      }

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

  static async put<T>(
    endpoint: string,
    body?: any,
    options?: FetchOptions
  ): Promise<T> {
    return this.retryWithBackoff(() => this.putOnce<T>(endpoint, body, options));
  }

  private static async putOnce<T>(
    endpoint: string,
    body?: any,
    options?: FetchOptions
  ): Promise<T> {
    try {
      const url = this.buildUrl(endpoint, options?.params);
      const headers = await this.buildHeaders(endpoint, options?.headers);

      if (!this.loggedUrls.has(url)) {
        console.info('[ApiService] Resolved PUT URL:', url);
        this.loggedUrls.add(url);
      }

      const res = await fetch(url, {
        method: 'PUT',
        credentials: 'include',
        ...options,
        headers,
        body: body ? JSON.stringify(body) : undefined,
      });

      if (!res.ok) {
        const errorText = await res.text();
        console.error(`[ApiService] PUT ${endpoint} failed:`, res.status, errorText);
        throw new Error(`${res.status}: ${errorText}`);
      }

      return res.json();
    } catch (error) {
      console.error(`[ApiService] PUT request failed for ${endpoint}:`, error);
      throw error;
    }
  }

  static async delete<T>(
    endpoint: string,
    options?: FetchOptions
  ): Promise<T> {
    try {
      const headers = await this.buildHeaders(endpoint, options?.headers);

      if (!this.loggedUrls.has(endpoint)) {
        console.info('[ApiService] Resolved DELETE URL:', endpoint);
        this.loggedUrls.add(endpoint);
      }

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