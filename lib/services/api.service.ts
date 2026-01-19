interface FetchOptions extends RequestInit {
  params?: Record<string, any>;
}

export class ApiService {
  private static buildUrl(endpoint: string, params?: Record<string, any>): string {
    // Build the base URL with query parameters
    let url = endpoint;
    
    if (params) {
      const searchParams = new URLSearchParams();
      Object.entries(params).forEach(([key, value]) => {
        if (value !== null && value !== undefined) {
          searchParams.append(key, String(value));
        }
      });
      const queryString = searchParams.toString();
      url = queryString ? `${endpoint}?${queryString}` : endpoint;
    }
    
    return url;
  }

  static async get<T>(endpoint: string, options?: FetchOptions): Promise<T> {
    const url = this.buildUrl(endpoint, options?.params);
    try {
      const response = await fetch(url, {
        method: 'GET',
        credentials: 'include',
        ...options,
        headers: {
          'Content-Type': 'application/json',
          ...options?.headers,
        },
      });
      
      if (!response.ok) {
        const errorBody = await response.text().catch(() => '');
        console.error(`API Error: ${response.statusText}`, {
          status: response.status,
          statusText: response.statusText,
          endpoint: url,
          body: errorBody
        });
        throw new Error(`API Error: ${response.statusText}`);
      }
      
      return response.json();
    } catch (error) {
      console.error('Fetch error:', error);
      throw error;
    }
  }

  static async post<T>(endpoint: string, data?: any, options?: FetchOptions): Promise<T> {
    const url = this.buildUrl(endpoint, options?.params);
    const response = await fetch(url, {
      method: 'POST',
      credentials: 'include',
      ...options,
      body: JSON.stringify(data),
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
    });
    if (!response.ok) throw new Error(`API Error: ${response.statusText}`);
    return response.json();
  }

  static async delete<T>(endpoint: string, options?: FetchOptions): Promise<T> {
    const response = await fetch(endpoint, {
      method: 'DELETE',
      credentials: 'include',
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
    });
    if (!response.ok) throw new Error(`API Error: ${response.statusText}`);
    return response.json();
  }
}
