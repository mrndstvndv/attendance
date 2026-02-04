import type { DatabaseProvider, User, LoginSession } from './types';

/**
 * Google Sheets Database Provider
 * 
 * This is a template for implementing Google Sheets as a database backend.
 * To use this, you'll need to:
 * 1. Set up Google Sheets API credentials
 * 2. Create two sheets: "users" and "login_sessions"
 * 3. Set environment variables:
 *    - GOOGLE_SHEETS_API_KEY
 *    - GOOGLE_SHEETS_SPREADSHEET_ID
 */
export class GoogleSheetsDatabaseProvider implements DatabaseProvider {
  private spreadsheetId: string;
  private apiKey: string;

  constructor() {
    this.spreadsheetId = process.env.GOOGLE_SHEETS_SPREADSHEET_ID || '';
    this.apiKey = process.env.GOOGLE_SHEETS_API_KEY || '';

    if (!this.spreadsheetId || !this.apiKey) {
      throw new Error('Google Sheets API credentials not configured');
    }
  }

  private async fetchSheetData(sheetName: string) {
    const url = `https://sheets.googleapis.com/v4/spreadsheets/${this.spreadsheetId}/values/${sheetName}?key=${this.apiKey}`;
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch sheet data: ${response.statusText}`);
    }

    return response.json();
  }

  private async appendSheetData(sheetName: string, values: any[]) {
    const url = `https://sheets.googleapis.com/v4/spreadsheets/${this.spreadsheetId}/values/${sheetName}:append?valueInputOption=USER_ENTERED&key=${this.apiKey}`;
    
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        values: [values],
      }),
    });

    if (!response.ok) {
      throw new Error(`Failed to append data: ${response.statusText}`);
    }

    return response.json();
  }

  private rowToUser(row: any[]): User {
    return {
      id: row[0],
      full_name: row[1],
      email: row[2],
      password_hash: row[3],
      gender: row[4],
      age_group: row[5],
      sector: row[6],
      agency: row[7],
      is_senior_citizen: row[8] === 'true',
      is_abled: row[9] === 'true',
      nationality: row[10],
      region: row[11],
      is_solo_parent: row[12] === 'true',
      civil_status: row[13],
      office_affiliation: row[14],
      designation: row[15],
      address: row[16],
      phone_number: row[17],
      birthdate: row[18],
      created_at: row[19],
      updated_at: row[20],
    };
  }

  private userToRow(user: User): any[] {
    return [
      user.id,
      user.full_name,
      user.email,
      user.password_hash,
      user.gender,
      user.age_group,
      user.sector,
      user.agency,
      user.is_senior_citizen.toString(),
      user.is_abled.toString(),
      user.nationality,
      user.region,
      user.is_solo_parent.toString(),
      user.civil_status,
      user.office_affiliation,
      user.designation,
      user.address,
      user.phone_number,
      user.birthdate,
      user.created_at,
      user.updated_at,
    ];
  }

  async getUserByEmail(email: string): Promise<User | null> {
    try {
      const data = await this.fetchSheetData('users');
      const rows = data.values || [];

      for (let i = 1; i < rows.length; i++) {
        if (rows[i][2] === email) {
          return this.rowToUser(rows[i]);
        }
      }

      return null;
    } catch (err) {
      console.error('Error fetching user from Google Sheets:', err);
      return null;
    }
  }

  async createUser(user: Omit<User, 'id' | 'created_at' | 'updated_at'>): Promise<User> {
    const id = Date.now().toString();
    const now = new Date().toISOString();

    const newUser: User = {
      ...user,
      id,
      created_at: now,
      updated_at: now,
    };

    try {
      await this.appendSheetData('users', this.userToRow(newUser));
      return newUser;
    } catch (err) {
      console.error('Error creating user in Google Sheets:', err);
      throw err;
    }
  }

  async updateUser(id: string, data: Partial<User>): Promise<User> {
    // This is a simplified implementation
    // In production, you'd need to update the specific row
    throw new Error('updateUser not fully implemented for Google Sheets yet');
  }

  async createLoginSession(session: Omit<LoginSession, 'id' | 'created_at'>): Promise<LoginSession> {
    const id = Date.now().toString();
    const now = new Date().toISOString();

    const newSession: LoginSession = {
      ...session,
      id,
      created_at: now,
    };

    try {
      await this.appendSheetData('login_sessions', [
        newSession.id,
        newSession.user_id,
        newSession.session_token,
        newSession.service_used || '',
        newSession.login_timestamp,
        newSession.created_at,
      ]);

      return newSession;
    } catch (err) {
      console.error('Error creating session in Google Sheets:', err);
      throw err;
    }
  }

  async getLoginSession(token: string): Promise<LoginSession | null> {
    try {
      const data = await this.fetchSheetData('login_sessions');
      const rows = data.values || [];

      for (let i = 1; i < rows.length; i++) {
        if (rows[i][2] === token) {
          return {
            id: rows[i][0],
            user_id: rows[i][1],
            session_token: rows[i][2],
            service_used: rows[i][3] || null,
            login_timestamp: rows[i][4],
            created_at: rows[i][5],
          };
        }
      }

      return null;
    } catch (err) {
      console.error('Error fetching session from Google Sheets:', err);
      return null;
    }
  }

  async getLoginHistory(userId: string, limit: number = 10): Promise<LoginSession[]> {
    try {
      const data = await this.fetchSheetData('login_sessions');
      const rows = data.values || [];
      const history: LoginSession[] = [];

      for (let i = 1; i < rows.length && history.length < limit; i++) {
        if (rows[i][1] === userId) {
          history.push({
            id: rows[i][0],
            user_id: rows[i][1],
            session_token: rows[i][2],
            service_used: rows[i][3] || null,
            login_timestamp: rows[i][4],
            created_at: rows[i][5],
          });
        }
      }

      return history;
    } catch (err) {
      console.error('Error fetching login history from Google Sheets:', err);
      return [];
    }
  }
}
