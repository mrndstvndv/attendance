import crypto from 'crypto';

// Hash password using PBKDF2
export async function hashPassword(password: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const salt = crypto.randomBytes(16).toString('hex');
    crypto.pbkdf2(password, salt, 100000, 64, 'sha512', (err, derivedKey) => {
      if (err) reject(err);
      resolve(salt + ':' + derivedKey.toString('hex'));
    });
  });
}

// Verify password
export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return new Promise((resolve, reject) => {
    const [salt, key] = hash.split(':');
    crypto.pbkdf2(password, salt, 100000, 64, 'sha512', (err, derivedKey) => {
      if (err) reject(err);
      resolve(key === derivedKey.toString('hex'));
    });
  });
}

// Generate a secure token for sessions
export function generateSessionToken(): string {
  return crypto.randomBytes(32).toString('hex');
}

// Parse query parameters from URL
export function parseQueryParams(url: string): Record<string, string> {
  if (typeof window === 'undefined') return {};
  
  const urlParams = new URLSearchParams(new URL(url, window.location.origin).search);
  const params: Record<string, string> = {};
  
  urlParams.forEach((value, key) => {
    params[key] = value;
  });
  
  return params;
}
