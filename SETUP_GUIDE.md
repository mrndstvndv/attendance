# Setup Guide

## Quick Start

This is a comprehensive authentication and user management system with multi-service support. It includes sign-up forms, secure login, and service selection functionality.

## Prerequisites

- Node.js 18+
- A Supabase account (default database) OR Google Sheets + API credentials

## Installation

1. **Clone/Install the project**
   ```bash
   npx shadcn-cli@latest init
   # or
   npm install
   ```

2. **Set up environment variables**

   Create a `.env.local` file in your project root:

   ### For Supabase (Recommended)
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
   SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
   DB_PROVIDER=supabase
   ```

   ### For Google Sheets (Template)
   ```env
   GOOGLE_SHEETS_API_KEY=your_api_key
   GOOGLE_SHEETS_SPREADSHEET_ID=your_spreadsheet_id
   DB_PROVIDER=google_sheets
   ```

3. **Database Setup (Supabase)**

   The database migration script is already created in `/scripts/setup-database.sql`.
   It will be executed when the project starts.

   Tables created:
   - `users` - Stores user account information
   - `login_sessions` - Tracks login history and service usage

## Features

### Authentication System
- ✅ User Registration with comprehensive form
- ✅ Secure Password Hashing (PBKDF2)
- ✅ Session Management with HTTP-only cookies
- ✅ Login with email/password
- ✅ Query parameter-based login
- ✅ Login history tracking

### User Information Collected
- Full Name/Username
- Email
- Password (hashed)
- Gender
- Age Group
- Birthdate
- Civil Status
- Nationality
- Region
- Address
- Phone Number
- Sector
- Agency
- Office/Affiliation
- Designation/Position
- Senior Citizen Status
- Ability Status
- Solo Parent Status

### Service Selection
After login, users select from:
- Training
- Printing
- PC Use

### Data Persistence
- Login timestamp
- Service used
- User ID
- Secure session token

## Project Structure

```
├── app/
│   ├── api/
│   │   └── auth/
│   │       ├── signup/route.ts       # User registration
│   │       ├── login/route.ts        # Standard login
│   │       └── query-login/route.ts  # URL query-based login
│   ├── signup/page.tsx               # Registration page
│   ├── login/page.tsx                # Login page
│   ├── select-service/page.tsx       # Service selection
│   ├── dashboard/page.tsx            # User dashboard
│   └── page.tsx                      # Home page
├── components/
│   ├── signup-form.tsx               # Registration form component
│   ├── login-form.tsx                # Login form component
│   └── service-selector.tsx          # Service selection component
├── lib/
│   ├── auth.ts                       # Authentication utilities
│   └── database/                     # Database abstraction layer
│       ├── index.ts                  # Database factory
│       ├── types.ts                  # Database interfaces
│       ├── config.ts                 # Configuration
│       ├── supabase-provider.ts      # Supabase implementation
│       └── sheets-provider.ts        # Google Sheets implementation
├── scripts/
│   └── setup-database.sql            # Database migration
├── API_DOCUMENTATION.md              # API reference
└── SETUP_GUIDE.md                    # This file
```

## Usage

### Pages

#### Home Page (`/`)
- Shows signup form if no previous login
- Redirects to login if session cookie exists

#### Signup Page (`/signup`)
- Comprehensive registration form with all user details
- Form validation
- Password confirmation

#### Login Page (`/login`)
- Email/password authentication
- Supports email query parameter: `/login?email=user@example.com`

#### Service Selection (`/select-service`)
- Displayed after successful login
- User selects: Training, Printing, or PC Use
- Records service usage timestamp

#### Dashboard (`/dashboard`)
- Shows "Thanks for signing in!"
- Displays selected service information
- Service-specific quick actions

### API Endpoints

#### Standard Login
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"password123","service":"training"}'
```

#### Query-Based Login
```bash
# GET with automatic redirect
curl "http://localhost:3000/api/auth/query-login?id=user@example.com&pass=password123&service=training&redirect_mode=true"

# Or POST
curl -X POST http://localhost:3000/api/auth/query-login \
  -H "Content-Type: application/json" \
  -d '{"id":"user@example.com","pass":"password123","service":"training"}'
```

#### User Registration
```bash
curl -X POST http://localhost:3000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "full_name":"John Doe",
    "email":"john@example.com",
    "password":"password123",
    "gender":"male",
    "age_group":"26-35",
    "nationality":"Filipino",
    "civil_status":"Married"
  }'
```

## Database Switching

### Switch from Supabase to Google Sheets

1. Update environment variable:
   ```env
   DB_PROVIDER=google_sheets
   GOOGLE_SHEETS_API_KEY=your_key
   GOOGLE_SHEETS_SPREADSHEET_ID=your_spreadsheet_id
   ```

2. The API routes will automatically use the Google Sheets provider

### Creating a Custom Provider

1. Create a new file in `/lib/database/`:
   ```typescript
   import type { DatabaseProvider } from './types';

   export class CustomDatabaseProvider implements DatabaseProvider {
     async getUserByEmail(email: string) {
       // Implementation
     }
     // ... implement other methods
   }
   ```

2. Update `/lib/database/index.ts` to include your provider

3. Set `DB_PROVIDER=custom` in environment variables

## Security Best Practices

✅ Password Hashing
- Uses PBKDF2 with 100,000 iterations
- Unique salt per password

✅ Session Security
- HTTP-only cookies (not accessible from JavaScript)
- Secure flag set in production
- SameSite: strict

✅ Input Validation
- Server-side validation on all inputs
- Client-side validation for UX
- Protected API routes

✅ SQL Security
- Parameterized queries
- No string interpolation in SQL

## Testing

### Test User Registration
1. Visit `http://localhost:3000/signup`
2. Fill in all required fields
3. Click "Create Account"
4. Should redirect to login page

### Test Login
1. Visit `http://localhost:3000/login`
2. Enter email and password from registration
3. Click "Sign In"
4. Select a service
5. Should see dashboard with "Thanks for signing in!"

### Test Query Login
```bash
http://localhost:3000/api/auth/query-login?id=test@example.com&pass=password123&service=training&redirect_mode=true
```

## Troubleshooting

### "Missing required environment variables"
- Check that all `.env.local` variables are set correctly
- Restart the development server

### "Email already registered"
- The email is already in the database
- Use a different email or delete the user from database

### "Invalid email or password"
- Double-check your credentials
- Make sure user is registered first

### Database connection errors
- Verify Supabase credentials
- Check internet connection
- Ensure database tables were created (check `/scripts/setup-database.sql`)

## Next Steps

1. **Add Rate Limiting** - Use Upstash Redis for brute-force protection
2. **Email Verification** - Add email confirmation step
3. **Password Reset** - Implement forgot password flow
4. **2FA** - Add two-factor authentication
5. **Social Login** - Add Google/GitHub OAuth
6. **User Profiles** - Create editable profile page
7. **Admin Dashboard** - View all users and login history
8. **Export Data** - CSV export of user data and logs

## Support

For issues or questions:
1. Check the API_DOCUMENTATION.md
2. Review the code comments
3. Check database schema in `/scripts/setup-database.sql`

## License

MIT
