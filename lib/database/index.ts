import type { DatabaseProvider } from './types';
import { SupabaseDatabaseProvider } from './supabase-provider';
import { GoogleSheetsDatabaseProvider } from './sheets-provider';

type DatabaseType = 'supabase' | 'google_sheets';

let dbProvider: DatabaseProvider | null = null;

/**
 * Initialize the database provider
 * 
 * Usage:
 * initializeDatabase('supabase') // Uses Supabase
 * initializeDatabase('google_sheets') // Uses Google Sheets
 */
export function initializeDatabase(type: DatabaseType): DatabaseProvider {
  if (dbProvider) {
    return dbProvider;
  }

  switch (type) {
    case 'supabase':
      dbProvider = new SupabaseDatabaseProvider();
      break;
    case 'google_sheets':
      dbProvider = new GoogleSheetsDatabaseProvider();
      break;
    default:
      throw new Error(`Unknown database provider: ${type}`);
  }

  return dbProvider;
}

/**
 * Get the current database provider
 * Call initializeDatabase first!
 */
export function getDatabase(): DatabaseProvider {
  if (!dbProvider) {
    // Default to Supabase if not initialized
    dbProvider = initializeDatabase('supabase');
  }
  return dbProvider;
}

/**
 * Reset the database provider (useful for testing)
 */
export function resetDatabase(): void {
  dbProvider = null;
}

export type { DatabaseProvider, User, LoginSession } from './types';
export { SupabaseDatabaseProvider } from './supabase-provider';
export { GoogleSheetsDatabaseProvider } from './sheets-provider';
