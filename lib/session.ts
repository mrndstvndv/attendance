import { cookies } from 'next/headers';

/**
 * Get the current session token from cookies
 */
export async function getSessionToken(): Promise<string | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get('session_token')?.value;
  return token || null;
}

/**
 * Check if user has active session
 */
export async function isAuthenticated(): Promise<boolean> {
  const token = await getSessionToken();
  return !!token;
}

/**
 * Clear session (logout)
 */
export async function clearSession(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete('session_token');
}

/**
 * Validate session token (can be used in API routes)
 */
export async function validateSessionToken(token: string): Promise<boolean> {
  // This is a simple check - in production, validate against database
  return token.length > 0;
}

/**
 * Get user info from session (if needed)
 * Extend this to fetch from database if required
 */
export async function getUserFromSession() {
  const token = await getSessionToken();
  if (!token) {
    return null;
  }

  // Extend this to query database for user info
  return {
    token,
  };
}
