-- Create users table
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  username TEXT NOT NULL UNIQUE,
  email TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  full_name TEXT NOT NULL,
  gender TEXT,
  age_group TEXT,
  sector TEXT,
  agency TEXT,
  is_senior_citizen BOOLEAN DEFAULT FALSE,
  is_abled BOOLEAN DEFAULT TRUE,
  nationality TEXT,
  region TEXT,
  is_solo_parent BOOLEAN DEFAULT FALSE,
  civil_status TEXT,
  office_affiliation TEXT,
  designation TEXT,
  address TEXT,
  phone_number TEXT,
  birthdate DATE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create login sessions table
CREATE TABLE IF NOT EXISTS login_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  service_used TEXT NOT NULL, -- 'training', 'printing', or 'pc_use'
  login_timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  session_token TEXT NOT NULL UNIQUE,
  expires_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_users_username ON users(username);
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_login_sessions_user_id ON login_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_login_sessions_session_token ON login_sessions(session_token);

-- Enable Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE login_sessions ENABLE ROW LEVEL SECURITY;

-- RLS policies for users table
CREATE POLICY "Users can read their own data" ON users
  FOR SELECT USING (auth.uid()::text = id::text);

CREATE POLICY "Anyone can insert (signup)" ON users
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Users can update their own data" ON users
  FOR UPDATE USING (auth.uid()::text = id::text);

-- RLS policies for login_sessions table
CREATE POLICY "Users can read their own sessions" ON login_sessions
  FOR SELECT USING (auth.uid()::text = user_id::text);

CREATE POLICY "Users can insert their own sessions" ON login_sessions
  FOR INSERT WITH CHECK (auth.uid()::text = user_id::text);
