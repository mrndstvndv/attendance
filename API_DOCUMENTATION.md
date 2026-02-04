# API Documentation

## Authentication Endpoints

### 1. User Signup
**Endpoint:** `POST /api/auth/signup`

Creates a new user account with all demographic information.

**Request Body:**
```json
{
  "full_name": "John Doe",
  "email": "john@example.com",
  "password": "secure_password",
  "gender": "male",
  "age_group": "26-35",
  "sector": "Public",
  "agency": "Department of Education",
  "is_senior_citizen": false,
  "is_abled": true,
  "nationality": "Filipino",
  "region": "Metro Manila",
  "is_solo_parent": false,
  "civil_status": "Married",
  "office_affiliation": "School A",
  "designation": "Teacher",
  "address": "123 Main St",
  "phone_number": "09123456789",
  "birthdate": "1995-05-15"
}
```

**Response:**
```json
{
  "success": true,
  "user": {
    "id": "uuid",
    "email": "john@example.com",
    "full_name": "John Doe"
  }
}
```

### 2. Standard Login
**Endpoint:** `POST /api/auth/login`

Authenticates user and creates a login session with optional service selection.

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "secure_password",
  "service": "training"  // Optional: training, printing, or pc_use
}
```

**Response:**
```json
{
  "success": true,
  "user": {
    "id": "uuid",
    "email": "john@example.com",
    "full_name": "John Doe"
  },
  "session": {
    "token": "session_token_here",
    "user_id": "uuid",
    "service_used": "training"
  }
}
```

### 3. Query-Based Login
**Endpoint:** `GET /api/auth/query-login?id=USERNAME&pass=PASSWORD&service=SERVICE&redirect=URL`

Login using URL query parameters. Useful for single sign-on or external integrations.

**Query Parameters:**
- `id` (required): Username or email
- `pass` (required): Password
- `service` (optional): Service to use (training, printing, pc_use)
- `redirect` (optional): URL to redirect after login
- `redirect_mode` (optional): Set to 'true' to automatically redirect

**Examples:**

```bash
# Basic login with service selection
GET /api/auth/query-login?id=john@example.com&pass=password123&service=training

# Login with automatic redirect
GET /api/auth/query-login?id=john@example.com&pass=password123&service=training&redirect_mode=true

# Login with custom redirect URL
GET /api/auth/query-login?id=john@example.com&pass=password123&redirect=https://example.com/custom-page
```

**Response:**
```json
{
  "success": true,
  "user": {
    "id": "uuid",
    "email": "john@example.com",
    "full_name": "John Doe"
  },
  "session": {
    "token": "session_token_here",
    "user_id": "uuid",
    "service_used": "training",
    "redirect": "/dashboard?service=training&userId=uuid"
  }
}
```

## Routes

### Public Routes
- `GET /` - Home page (shows signup or login based on session)
- `GET /signup` - Signup form page
- `GET /login` - Login form page
- `GET /select-service` - Service selection page (after login)
- `GET /dashboard` - User dashboard (after service selection)

## Cookies

The system uses secure HTTP-only cookies to maintain sessions.

**Cookie Details:**
- Name: `session_token`
- HttpOnly: true
- Secure: true (in production)
- SameSite: strict
- Max Age: 7 days (604,800 seconds)
- Path: /

## Database Schema

### Users Table
Stores user account information with all demographic details.

**Columns:**
- `id` (UUID, Primary Key)
- `full_name` (Text)
- `email` (Text, Unique)
- `password_hash` (Text)
- `gender` (Text)
- `age_group` (Text)
- `sector` (Text)
- `agency` (Text)
- `is_senior_citizen` (Boolean)
- `is_abled` (Boolean)
- `nationality` (Text)
- `region` (Text)
- `is_solo_parent` (Boolean)
- `civil_status` (Text)
- `office_affiliation` (Text)
- `designation` (Text)
- `address` (Text)
- `phone_number` (Text)
- `birthdate` (Date)
- `created_at` (Timestamp)
- `updated_at` (Timestamp)

### Login Sessions Table
Tracks user login history with service usage and timestamps.

**Columns:**
- `id` (UUID, Primary Key)
- `user_id` (UUID, Foreign Key)
- `session_token` (Text, Unique)
- `service_used` (Text, Optional)
- `login_timestamp` (Timestamp)
- `created_at` (Timestamp)

## Database Abstraction

The system includes a database abstraction layer to support multiple storage backends:

### Supported Providers
1. **Supabase** (Default)
2. **Google Sheets** (Template provided)

### Usage

```typescript
import { initializeDatabase, getDatabase } from '@/lib/database';

// Initialize with Supabase
initializeDatabase('supabase');

// Get the database instance
const db = getDatabase();

// Use the database
const user = await db.getUserByEmail('john@example.com');
```

### Adding a New Provider

1. Create a new file in `/lib/database/` implementing the `DatabaseProvider` interface
2. Update `/lib/database/index.ts` to include your provider
3. Call `initializeDatabase('your_provider')` to activate it

## Security Notes

- Passwords are hashed using PBKDF2 with 100,000 iterations
- Session tokens are cryptographically secure random values
- All sensitive data is transmitted over HTTPS in production
- Session cookies are HTTP-only and cannot be accessed via JavaScript
- SQL injection is prevented through parameterized queries
- User inputs are validated on both client and server side

## Error Responses

### 400 Bad Request
```json
{
  "error": "Missing required fields"
}
```

### 401 Unauthorized
```json
{
  "error": "Invalid email or password"
}
```

### 409 Conflict
```json
{
  "error": "Email already registered"
}
```

### 500 Internal Server Error
```json
{
  "error": "Internal server error"
}
```

## Rate Limiting

Consider implementing rate limiting for authentication endpoints in production:
- Login attempts: 5 per minute per IP
- Signup: 3 per hour per IP
- Password reset: 3 per hour per email

This can be implemented using Upstash Redis or similar services.
