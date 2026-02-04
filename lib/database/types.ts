// Database abstraction layer to support multiple providers
// (Supabase, Google Sheets, etc.)

export interface User {
  id: string;
  full_name: string;
  email: string;
  password_hash: string;
  gender: string;
  age_group: string;
  sector: string;
  agency: string;
  is_senior_citizen: boolean;
  is_abled: boolean;
  nationality: string;
  region: string;
  is_solo_parent: boolean;
  civil_status: string;
  office_affiliation: string;
  designation: string;
  address: string;
  phone_number: string;
  birthdate: string;
  created_at: string;
  updated_at: string;
}

export interface LoginSession {
  id: string;
  user_id: string;
  session_token: string;
  service_used: string | null;
  login_timestamp: string;
  created_at: string;
}

export interface DatabaseProvider {
  // User operations
  getUserByEmail(email: string): Promise<User | null>;
  createUser(user: Omit<User, 'id' | 'created_at' | 'updated_at'>): Promise<User>;
  updateUser(id: string, data: Partial<User>): Promise<User>;

  // Session operations
  createLoginSession(session: Omit<LoginSession, 'id' | 'created_at'>): Promise<LoginSession>;
  getLoginSession(token: string): Promise<LoginSession | null>;
  getLoginHistory(userId: string, limit?: number): Promise<LoginSession[]>;
}
