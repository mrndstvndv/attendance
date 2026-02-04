import { createClient } from '@supabase/supabase-js';
import type { DatabaseProvider, User, LoginSession } from './types';

export class SupabaseDatabaseProvider implements DatabaseProvider {
  private supabase: ReturnType<typeof createClient> | null = null;

  private getClient() {
    if (!this.supabase) {
      this.supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!
      );
    }
    return this.supabase;
  }

  async getUserByEmail(email: string): Promise<User | null> {
    try {
      const { data, error } = await this.getClient()
        .from('users')
        .select('*')
        .eq('email', email)
        .single();

      if (error) {
        console.error('Supabase error:', error);
        return null;
      }

      return data as User;
    } catch (err) {
      console.error('Error fetching user:', err);
      return null;
    }
  }

  async createUser(user: Omit<User, 'id' | 'created_at' | 'updated_at'>): Promise<User> {
    const { data, error } = await this.getClient()
      .from('users')
      .insert(user)
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to create user: ${error.message}`);
    }

    return data as User;
  }

  async updateUser(id: string, data: Partial<User>): Promise<User> {
    const { data: updated, error } = await this.getClient()
      .from('users')
      .update(data)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to update user: ${error.message}`);
    }

    return updated as User;
  }

  async createLoginSession(session: Omit<LoginSession, 'id' | 'created_at'>): Promise<LoginSession> {
    const { data, error } = await this.getClient()
      .from('login_sessions')
      .insert(session)
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to create session: ${error.message}`);
    }

    return data as LoginSession;
  }

  async getLoginSession(token: string): Promise<LoginSession | null> {
    try {
      const { data, error } = await this.getClient()
        .from('login_sessions')
        .select('*')
        .eq('session_token', token)
        .single();

      if (error) {
        console.error('Supabase error:', error);
        return null;
      }

      return data as LoginSession;
    } catch (err) {
      console.error('Error fetching session:', err);
      return null;
    }
  }

  async getLoginHistory(userId: string, limit: number = 10): Promise<LoginSession[]> {
    try {
      const { data, error } = await this.getClient()
        .from('login_sessions')
        .select('*')
        .eq('user_id', userId)
        .order('login_timestamp', { ascending: false })
        .limit(limit);

      if (error) {
        console.error('Supabase error:', error);
        return [];
      }

      return (data as LoginSession[]) || [];
    } catch (err) {
      console.error('Error fetching login history:', err);
      return [];
    }
  }
}
