# Multi-Service Authentication System

A production-ready authentication and user management system with comprehensive user data collection, multi-service support, and flexible database integration.

## 🎯 Features

- ✅ **Complete Registration** - 23 data fields with validation
- ✅ **Secure Login** - PBKDF2 password hashing, HTTP-only cookies
- ✅ **Query-Based Login** - URL parameters for external integrations
- ✅ **Service Selection** - Training, Printing, or PC Use
- ✅ **Session Tracking** - Automatic timestamp and service recording
- ✅ **Database Abstraction** - Switch between Supabase & Google Sheets
- ✅ **Professional UI** - Clean forms with Tailwind CSS & shadcn/ui
- ✅ **Complete Documentation** - API, setup, integration guides
- ✅ **Production Ready** - Security, validation, error handling

## 🚀 Quick Start

### 1. Prerequisites
```bash
Node.js 18+
Supabase account
```

### 2. Setup Environment
```bash
# Create .env.local
NEXT_PUBLIC_SUPABASE_URL=your_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_key
```

### 3. Install & Deploy
```bash
npm install
npm run dev
# or
vercel
```

### 4. Visit
```
http://localhost:3000/signup
```

## 📋 User Information Collected

**Identity & Auth**
- Full Name / Username
- Email
- Password (hashed)

**Personal Details**
- Gender
- Age Group
- Birthdate
- Nationality
- Civil Status
- Senior Citizen Status
- Ability Status
- Solo Parent Status

**Contact & Location**
- Address
- Phone Number
- Region

**Employment**
- Sector
- Agency
- Office/Affiliation
- Designation/Position

## 🔐 Security Features

- **PBKDF2 Password Hashing** - 100,000 iterations
- **HTTP-Only Cookies** - JavaScript can't access
- **Secure Sessions** - 7-day expiration
- **Input Validation** - Client & server-side
- **SQL Injection Prevention** - Parameterized queries
- **XSS Protection** - Proper output encoding
- **CSRF Protection** - SameSite cookies

## 📖 Documentation

| Document | Purpose |
|----------|---------|
| **SETUP_GUIDE.md** | Installation, configuration, usage |
| **API_DOCUMENTATION.md** | Complete API reference |
| **PROJECT_SUMMARY.md** | Feature overview, architecture |
| **INTEGRATION_EXAMPLES.md** | Code examples for integration |
| **DEPLOYMENT_CHECKLIST.md** | Pre-deployment verification |

## 🛣️ Routes

| Route | Purpose |
|-------|---------|
| `/` | Home (signup or login) |
| `/signup` | Registration form |
| `/login` | Login form |
| `/select-service` | Service selection |
| `/dashboard` | User dashboard |

## 🔌 API Endpoints

### User Registration
```bash
POST /api/auth/signup
Content-Type: application/json

{
  "full_name": "John Doe",
  "email": "john@example.com",
  "password": "secure_password",
  "gender": "male",
  "age_group": "26-35",
  ...
}
```

### Standard Login
```bash
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "secure_password",
  "service": "training"
}
```

### Query-Based Login
```bash
GET /api/auth/query-login?id=user@example.com&pass=password&service=training&redirect_mode=true

POST /api/auth/query-login
Content-Type: application/json

{
  "id": "user@example.com",
  "pass": "password",
  "service": "training"
}
```

## 💾 Database Schema

### Users Table
Stores user account information with 20+ fields including demographics, contact info, and employment details.

### Login Sessions Table
Tracks login history with user ID, session token, service used, and timestamp.

## 🗄️ Database Support

### Default: Supabase
```env
DB_PROVIDER=supabase
```

### Alternative: Google Sheets
```env
DB_PROVIDER=google_sheets
GOOGLE_SHEETS_API_KEY=your_key
GOOGLE_SHEETS_SPREADSHEET_ID=your_id
```

### Custom Providers
Implement `DatabaseProvider` interface in `/lib/database/`

## 📁 Project Structure

```
├── app/
│   ├── api/auth/
│   │   ├── signup/
│   │   ├── login/
│   │   └── query-login/
│   ├── signup/
│   ├── login/
│   ├── select-service/
│   ├── dashboard/
│   └── page.tsx
├── components/
│   ├── signup-form.tsx
│   ├── login-form.tsx
│   └── service-selector.tsx
├── lib/
│   ├── auth.ts
│   ├── session.ts
│   └── database/
│       ├── index.ts
│       ├── types.ts
│       ├── config.ts
│       ├── supabase-provider.ts
│       └── sheets-provider.ts
├── scripts/
│   └── setup-database.sql
├── API_DOCUMENTATION.md
├── SETUP_GUIDE.md
├── PROJECT_SUMMARY.md
├── INTEGRATION_EXAMPLES.md
└── DEPLOYMENT_CHECKLIST.md
```

## 🔄 Authentication Flow

```
1. User visits / → Home page
   ↓
2. Click "Sign Up" → /signup form
   ↓
3. Submit form → POST /api/auth/signup
   ↓
4. Valid? Redirect to /login
   ↓
5. Enter credentials → POST /api/auth/login
   ↓
6. Valid? → /select-service
   ↓
7. Choose service → Update session, save timestamp
   ↓
8. → /dashboard with "Thanks for signing in!"
```

## 🧪 Testing

### Register User
1. Go to `/signup`
2. Fill all fields
3. Submit
4. Redirect to `/login`

### Login User
1. Go to `/login`
2. Enter email & password
3. Select service
4. See dashboard with timestamp

### Query Login
```bash
curl "http://localhost:3000/api/auth/query-login?id=test@example.com&pass=password&service=training&redirect_mode=true"
```

## 📦 Installation Methods

### Method 1: Vercel (Recommended)
```bash
git push origin main
# Deploy from Vercel dashboard
```

### Method 2: Local
```bash
git clone [repo]
npm install
npm run dev
```

### Method 3: Docker
```bash
docker build -t auth-system .
docker run -p 3000:3000 auth-system
```

## 🌐 Deployment

### Vercel
1. Connect GitHub repo
2. Add environment variables
3. Deploy automatically

### Other Platforms
- Ensure Node.js 18+
- Set environment variables
- Ensure HTTPS
- Configure database access

See `DEPLOYMENT_CHECKLIST.md` for detailed steps.

## 🔗 Integration

### From External App
```html
<a href="https://your-app.com/api/auth/query-login?id=user@example.com&pass=password&service=training&redirect_mode=true">
  Login
</a>
```

See `INTEGRATION_EXAMPLES.md` for more.

## 🛠️ Tech Stack

- **Framework:** Next.js 16 (App Router)
- **Database:** Supabase (PostgreSQL)
- **Auth:** Custom secure implementation
- **Styling:** Tailwind CSS + shadcn/ui
- **Hashing:** Node.js crypto (PBKDF2)
- **Validation:** Zod (schema validation ready)

## 📊 Data Flow

```
Client                    Server                 Database
─────────────────────────────────────────────────────────
Form Submit
   │────────────────── POST /api/auth/signup ──────────→
   │                                            Create User
   │←────────────── { success, user } ──────────────────
   │
   │ Redirect to /login
   │
Form Submit
   │────────────────── POST /api/auth/login ──────────→
   │                                      Verify Password
   │                                    Create Session
   │←────────────── { user, session } ──────────────────
   │ Set Cookie
   │
   │ Redirect to /select-service
   │
Select Service
   │────────────────── Update Session ─────────────────→
   │                                   Save Service & Time
   │←────────────────── { redirect } ──────────────────
   │
   │ Redirect to /dashboard
```

## 🚨 Error Handling

| Status | Response |
|--------|----------|
| 400 | Missing required fields |
| 401 | Invalid email or password |
| 409 | Email already registered |
| 500 | Server error |

## 🔄 Session Management

- **Duration:** 7 days
- **Storage:** HTTP-only secure cookies
- **Validation:** Server-side
- **Token:** Cryptographically secure random

## 📈 Monitoring

Consider implementing:
- Error logging (Sentry)
- Performance monitoring (Vercel Analytics)
- Database monitoring (Supabase dashboard)
- User analytics

## 🚀 Future Enhancements

- Email verification
- Password reset
- Rate limiting
- 2FA (Two-factor authentication)
- Social login
- Admin dashboard
- User profiles
- Activity logs
- Data export

## 📞 Support

**Read First:**
- `/SETUP_GUIDE.md` - Setup & configuration
- `/API_DOCUMENTATION.md` - API details
- `/INTEGRATION_EXAMPLES.md` - Code examples

**Still need help?**
Check code comments or create an issue.

## 📄 License

MIT

## 📅 Version

v1.0 - 2026-02-04

---

**Ready to deploy?** Follow the `DEPLOYMENT_CHECKLIST.md` ✅
