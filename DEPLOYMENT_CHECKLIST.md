# Deployment Checklist

Complete this checklist before deploying to production.

## Pre-Deployment Setup

### Database Configuration
- [ ] Supabase project created and configured
- [ ] Database credentials obtained (URL, keys)
- [ ] Database migration executed (`/scripts/setup-database.sql`)
- [ ] Tables verified in Supabase dashboard:
  - [ ] `users` table exists with all 20+ columns
  - [ ] `login_sessions` table exists
  - [ ] Indexes created for email and user_id
  - [ ] Row Level Security (RLS) policies in place (optional but recommended)

### Environment Variables
- [ ] `.env.local` file created locally
- [ ] All required variables set:
  ```
  NEXT_PUBLIC_SUPABASE_URL=
  NEXT_PUBLIC_SUPABASE_ANON_KEY=
  SUPABASE_SERVICE_ROLE_KEY=
  ```
- [ ] No sensitive values hardcoded in code
- [ ] `.env.local` added to `.gitignore`

### Code Review
- [ ] All TypeScript errors resolved
- [ ] No console.log() statements (debug code removed)
- [ ] Security best practices followed:
  - [ ] No passwords in logs
  - [ ] No sensitive data in localStorage
  - [ ] All inputs validated server-side
  - [ ] Parameterized queries used
- [ ] Form validation complete
- [ ] Error messages user-friendly

### Testing
- [ ] User registration works end-to-end
- [ ] Login works with email/password
- [ ] Query-based login works
- [ ] Service selection records correctly
- [ ] Session cookies set properly
- [ ] Logout functionality works
- [ ] Form validation shows errors
- [ ] Handles invalid input gracefully
- [ ] Database connection stable

### Dependencies
- [ ] All npm packages installed
- [ ] No duplicate dependencies
- [ ] Version conflicts resolved
- [ ] `next`, `@supabase/supabase-js` installed

## Vercel Deployment

### Project Setup
- [ ] GitHub repository created and pushed
- [ ] GitHub repository connected to Vercel
- [ ] Project name appropriate
- [ ] Region selected (closest to users)

### Environment Variables in Vercel
- [ ] Navigate to Project Settings → Environment Variables
- [ ] Add all required variables:
  - [ ] `NEXT_PUBLIC_SUPABASE_URL`
  - [ ] `NEXT_PUBLIC_SUPABASE_ANON_KEY`
  - [ ] `SUPABASE_SERVICE_ROLE_KEY`
- [ ] Set for Production environment specifically
- [ ] Verified no typos in variable names

### Deployment
- [ ] Trigger first deployment
- [ ] Wait for build to complete
- [ ] Check build logs for errors
- [ ] Verify deployment successful

### Post-Deployment Testing
- [ ] Visit deployed URL
- [ ] Signup form loads correctly
- [ ] Registration works end-to-end
- [ ] Login works with created credentials
- [ ] Service selection functions properly
- [ ] Dashboard displays correctly
- [ ] Redirects work as expected
- [ ] No 404 errors
- [ ] No console errors in browser DevTools
- [ ] Database queries executing successfully

## Security Review

### HTTPS & Headers
- [ ] Site accessible only via HTTPS
- [ ] HTTP requests redirect to HTTPS
- [ ] Security headers set:
  - [ ] `Content-Security-Policy`
  - [ ] `X-Frame-Options: DENY`
  - [ ] `X-Content-Type-Options: nosniff`

### Cookie Security
- [ ] Cookies set with Secure flag
- [ ] HttpOnly flag enabled
- [ ] SameSite: strict or lax
- [ ] Domain and path correct
- [ ] Expiration appropriate (7 days)

### Input Validation
- [ ] Email validation server-side
- [ ] Password requirements enforced
- [ ] No SQL injection vulnerabilities
- [ ] XSS protection in place
- [ ] CSRF tokens if forms used

### API Security
- [ ] Error messages don't leak info
- [ ] Rate limiting considered
- [ ] Sensitive data not in logs
- [ ] Session tokens secure
- [ ] Unauthorized requests rejected

## Monitoring & Logging

### Error Monitoring
- [ ] Error logging configured (Sentry/similar optional)
- [ ] Alerts set for critical errors
- [ ] Logs reviewed for issues

### Performance
- [ ] Page load times acceptable
- [ ] Database queries optimized
- [ ] No memory leaks
- [ ] Assets compressed

### Backups
- [ ] Database backup strategy planned
- [ ] Backup frequency set (daily recommended)
- [ ] Restore process tested

## Documentation

### For Team
- [ ] API documentation reviewed (`API_DOCUMENTATION.md`)
- [ ] Setup guide shared (`SETUP_GUIDE.md`)
- [ ] Database schema documented
- [ ] Deployment process documented
- [ ] Emergency contact info available

### For Users
- [ ] User instructions clear
- [ ] Error messages helpful
- [ ] Terms of service reviewed
- [ ] Privacy policy in place

## Post-Deployment

### Day 1
- [ ] Monitor error logs closely
- [ ] Check user signup/login flows
- [ ] Verify session management
- [ ] Monitor database performance

### Week 1
- [ ] Review authentication logs
- [ ] Check for any failed logins
- [ ] Verify backup working
- [ ] Monitor email if notifications enabled

### Ongoing
- [ ] Regular security updates
- [ ] Database optimization
- [ ] User feedback monitoring
- [ ] Performance tracking

## Rollback Plan

In case of critical issues:

1. [ ] Have previous version tagged in GitHub
2. [ ] Document rollback steps
3. [ ] Know how to revert environment variables
4. [ ] Have database backup strategy
5. [ ] Communication plan ready

### Rollback Steps
```bash
# In Vercel
1. Go to Deployments
2. Find previous working deployment
3. Click "Redeploy" button

# Or via Git
1. Revert problematic commit
2. Push to main branch
3. Vercel auto-deploys
```

## Optional Enhancements (Post-Deployment)

Consider these after successful deployment:

- [ ] Email verification for new users
- [ ] Password reset functionality
- [ ] Rate limiting with Upstash Redis
- [ ] Two-factor authentication
- [ ] Social login (Google/GitHub)
- [ ] User profile management
- [ ] Admin dashboard
- [ ] Export user data functionality
- [ ] Detailed activity logs
- [ ] Email notifications

## Success Criteria

✅ All checks completed
✅ Application deployed to Vercel
✅ All pages load without errors
✅ Authentication flows work end-to-end
✅ Database connections stable
✅ Security measures in place
✅ Team trained on system
✅ Documentation complete
✅ Monitoring/logging configured
✅ Backup strategy in place

## Sign-Off

- [ ] Development lead: _________________ Date: _______
- [ ] QA lead: _________________ Date: _______
- [ ] Deployment engineer: _________________ Date: _______

## Notes

Use this space for any additional notes or issues discovered:

```

```

---

**For Support:**
- Review API_DOCUMENTATION.md
- Check SETUP_GUIDE.md
- See INTEGRATION_EXAMPLES.md
- Read PROJECT_SUMMARY.md

**Last Updated:** 2026-02-04
