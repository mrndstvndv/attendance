/**
 * Database Configuration
 * 
 * Switch between different database providers by changing DB_PROVIDER
 * 
 * Supported providers:
 * - 'supabase': PostgreSQL via Supabase
 * - 'google_sheets': Google Sheets API
 */

export const DB_PROVIDER = (process.env.DB_PROVIDER || 'supabase') as 'supabase' | 'google_sheets';

/**
 * Database Configuration Objects
 */

export const DATABASE_CONFIG = {
  supabase: {
    url: process.env.NEXT_PUBLIC_SUPABASE_URL,
    anonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    serviceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY,
  },
  google_sheets: {
    apiKey: process.env.GOOGLE_SHEETS_API_KEY,
    spreadsheetId: process.env.GOOGLE_SHEETS_SPREADSHEET_ID,
  },
};

/**
 * Validate database configuration
 */
export function validateDatabaseConfig(): boolean {
  if (DB_PROVIDER === 'supabase') {
    return !!(
      DATABASE_CONFIG.supabase.url &&
      DATABASE_CONFIG.supabase.serviceRoleKey
    );
  }

  if (DB_PROVIDER === 'google_sheets') {
    return !!(
      DATABASE_CONFIG.google_sheets.apiKey &&
      DATABASE_CONFIG.google_sheets.spreadsheetId
    );
  }

  return false;
}

/**
 * Get configuration status
 */
export function getDatabaseConfigStatus(): {
  provider: string;
  configured: boolean;
  missingVars: string[];
} {
  const missingVars: string[] = [];

  if (DB_PROVIDER === 'supabase') {
    if (!DATABASE_CONFIG.supabase.url)
      missingVars.push('NEXT_PUBLIC_SUPABASE_URL');
    if (!DATABASE_CONFIG.supabase.serviceRoleKey)
      missingVars.push('SUPABASE_SERVICE_ROLE_KEY');
  } else if (DB_PROVIDER === 'google_sheets') {
    if (!DATABASE_CONFIG.google_sheets.apiKey)
      missingVars.push('GOOGLE_SHEETS_API_KEY');
    if (!DATABASE_CONFIG.google_sheets.spreadsheetId)
      missingVars.push('GOOGLE_SHEETS_SPREADSHEET_ID');
  }

  return {
    provider: DB_PROVIDER,
    configured: missingVars.length === 0,
    missingVars,
  };
}
