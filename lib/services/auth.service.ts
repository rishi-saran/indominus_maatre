import { supabase } from '@/lib/supabase/client';
import { AuthError, User } from '@supabase/supabase-js';

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface SignupCredentials {
  email: string;
  password: string;
  first_name: string;
  last_name: string;
  phone: string;
  role?: 'customer' | 'priest';
}

export interface AuthResponse {
  user: User | null;
  session: any;
}

class AuthServiceClass {
  /**
   * Login with email and password
   */
  async login(email: string, password: string): Promise<AuthResponse> {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        throw new Error(error.message || 'Login failed');
      }

      return {
        user: data.user,
        session: data.session,
      };
    } catch (err) {
      throw err;
    }
  }

  /**
   * Sign up with email and password
   */
  async signup(credentials: SignupCredentials): Promise<AuthResponse> {
    try {
      const role = credentials.role || 'customer';

      const { data, error } = await supabase.auth.signUp({
        email: credentials.email,
        password: credentials.password,
        options: {
          data: {
            first_name: credentials.first_name,
            last_name: credentials.last_name,
            phone: credentials.phone,
            role,
          },
        },
      });

      if (error) {
        throw new Error(error.message || 'Signup failed');
      }

      // Optionally create a user profile in a users table
      if (data.user) {
        await this.createUserProfile(data.user.id, credentials, role);
        await this.createProfileRow(data.user.id, role);
      }

      return {
        user: data.user,
        session: data.session,
      };
    } catch (err) {
      throw err;
    }
  }

  /**
   * Create user profile in the users table
   */
  private async createUserProfile(
    userId: string,
    credentials: SignupCredentials,
    role: 'customer' | 'priest'
  ): Promise<void> {
    try {
      const { error } = await supabase.from('users').insert([
        {
          id: userId,
          email: credentials.email,
          first_name: credentials.first_name,
          last_name: credentials.last_name,
          phone: credentials.phone,
          created_at: new Date().toISOString(),
          role,
        },
      ]);

      if (error && error.code !== 'PGRST116') {
        // PGRST116 = unique violation, ignore if user already exists
        console.warn('Error creating user profile:', error);
      }
    } catch (err) {
      console.error('Error creating user profile:', err);
      // Don't throw - signup was successful even if profile creation fails
    }
  }

  /**
   * Create profile row for role-based access (used by streaming guards)
   */
  private async createProfileRow(
    userId: string,
    role: 'customer' | 'priest'
  ): Promise<void> {
    try {
      const { error } = await supabase.from('profiles').upsert(
        { id: userId, role },
        { onConflict: 'id' }
      );

      if (error) {
        console.warn('Error creating profile row:', error);
      }
    } catch (err) {
      console.error('Error creating profile row:', err);
    }
  }

  /**
   * Sign out the current user
   */
  async logout(): Promise<void> {
    try {
      const { error } = await supabase.auth.signOut();

      if (error) {
        throw new Error(error.message || 'Logout failed');
      }
    } catch (err) {
      throw err;
    }
  }

  /**
   * Get the current user session
   */
  async getSession(): Promise<AuthResponse> {
    try {
      const { data, error } = await supabase.auth.getSession();

      if (error) {
        throw new Error(error.message || 'Failed to get session');
      }

      return {
        user: data.session?.user || null,
        session: data.session,
      };
    } catch (err) {
      throw err;
    }
  }

  /**
   * Get the current user
   */
  async getUser(): Promise<User | null> {
    try {
      const { data, error } = await supabase.auth.getUser();

      if (error) {
        console.warn('Failed to get user:', error);
        return null;
      }

      return data.user;
    } catch (err) {
      console.error('Error getting user:', err);
      return null;
    }
  }

  /**
   * Reset password for email
   */
  async resetPassword(email: string): Promise<void> {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/reset-password`,
      });

      if (error) {
        throw new Error(error.message || 'Password reset failed');
      }
    } catch (err) {
      throw err;
    }
  }

  /**
   * Update user password
   */
  async updatePassword(newPassword: string): Promise<void> {
    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword,
      });

      if (error) {
        throw new Error(error.message || 'Password update failed');
      }
    } catch (err) {
      throw err;
    }
  }

  /**
   * Subscribe to auth state changes
   */
  onAuthStateChange(callback: (user: User | null) => void): void {
    supabase.auth.onAuthStateChange((event, session) => {
      callback(session?.user || null);
    });
  }
}

export const AuthService = new AuthServiceClass();
