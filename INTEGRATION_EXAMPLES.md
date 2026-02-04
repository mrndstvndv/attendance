# Integration Examples

This document shows how to integrate with the authentication system from external applications.

## Example 1: Simple HTML Form Login

```html
<!DOCTYPE html>
<html>
<head>
    <title>External Login</title>
</head>
<body>
    <h1>Login to Our Service</h1>
    
    <!-- Redirect to signup if not registered -->
    <a href="https://your-app.com/signup">
        Don't have an account? Sign up here
    </a>
    
    <!-- Login form -->
    <form method="GET" action="https://your-app.com/api/auth/query-login">
        <input 
            type="email" 
            name="id" 
            placeholder="Email or Username" 
            required 
        />
        <input 
            type="password" 
            name="pass" 
            placeholder="Password" 
            required 
        />
        
        <select name="service">
            <option value="training">Training</option>
            <option value="printing">Printing</option>
            <option value="pc_use">PC Use</option>
        </select>
        
        <input 
            type="hidden" 
            name="redirect_mode" 
            value="true" 
        />
        <input 
            type="hidden" 
            name="redirect" 
            value="https://your-external-app.com/welcome" 
        />
        
        <button type="submit">Sign In</button>
    </form>
</body>
</html>
```

## Example 2: JavaScript/Fetch Login

```javascript
async function login(email, password, service) {
    try {
        const response = await fetch(
            'https://your-app.com/api/auth/query-login',
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    id: email,
                    pass: password,
                    service: service,
                    redirect: 'https://your-external-app.com/welcome'
                })
            }
        );

        if (response.ok) {
            const data = await response.json();
            console.log('Login successful!', data);
            
            // Store session info
            localStorage.setItem('userId', data.user.id);
            localStorage.setItem('sessionToken', data.session.token);
            
            // Redirect to redirect URL
            window.location.href = data.session.redirect;
        } else {
            const error = await response.json();
            console.error('Login failed:', error.error);
        }
    } catch (err) {
        console.error('Error:', err);
    }
}

// Usage
login('user@example.com', 'password123', 'training');
```

## Example 3: React Component Integration

```jsx
import { useState } from 'react';

export function ExternalLogin() {
    const [loading, setLoading] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [service, setService] = useState('training');
    const [error, setError] = useState('');

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const response = await fetch(
                'https://your-app.com/api/auth/query-login',
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        id: email,
                        pass: password,
                        service: service,
                    })
                }
            );

            const data = await response.json();

            if (!response.ok) {
                setError(data.error);
                return;
            }

            // Success - save and redirect
            sessionStorage.setItem('userId', data.user.id);
            sessionStorage.setItem('sessionToken', data.session.token);
            
            // Redirect after a short delay
            setTimeout(() => {
                window.location.href = data.session.redirect;
            }, 500);

        } catch (err) {
            setError('An error occurred. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-form">
            <h2>Sign In</h2>
            
            {error && <div className="error">{error}</div>}
            
            <form onSubmit={handleLogin}>
                <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Email"
                    required
                />
                
                <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Password"
                    required
                />
                
                <select 
                    value={service} 
                    onChange={(e) => setService(e.target.value)}
                >
                    <option value="training">Training</option>
                    <option value="printing">Printing</option>
                    <option value="pc_use">PC Use</option>
                </select>
                
                <button type="submit" disabled={loading}>
                    {loading ? 'Signing in...' : 'Sign In'}
                </button>
            </form>
            
            <p>
                Don't have an account?{' '}
                <a href="https://your-app.com/signup">Sign up here</a>
            </p>
        </div>
    );
}
```

## Example 4: URL Query Parameter Login (Single Sign-On)

Direct user to login with pre-filled credentials:

```javascript
// User clicks button in your app
function loginWithSSO() {
    const email = 'user@example.com'; // from your system
    const password = 'their_password'; // from form
    const service = 'training'; // what they want to use
    
    // Build URL
    const params = new URLSearchParams({
        id: email,
        pass: password,
        service: service,
        redirect_mode: 'true',
        redirect: `${window.location.origin}/welcome`
    });
    
    // Redirect
    window.location.href = `https://your-app.com/api/auth/query-login?${params.toString()}`;
}
```

## Example 5: Backend Integration (Node.js)

```javascript
// In your Node.js backend
const fetch = require('node-fetch');

async function authenticateUser(email, password, service) {
    try {
        const response = await fetch(
            'https://your-app.com/api/auth/query-login',
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    id: email,
                    pass: password,
                    service: service
                })
            }
        );

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error);
        }

        // Save session info in your database
        await saveSession({
            userId: data.user.id,
            sessionToken: data.session.token,
            service: data.session.service_used,
            timestamp: new Date()
        });

        return data;
    } catch (error) {
        console.error('Authentication failed:', error);
        throw error;
    }
}

// Usage
authenticateUser('user@example.com', 'password123', 'training')
    .then(result => console.log('Authenticated:', result))
    .catch(err => console.error('Error:', err));
```

## Example 6: Verification in Your App

After user logs in via query-login, verify they're authenticated:

```javascript
async function verifySession(sessionToken) {
    // You might want to call your own backend to verify
    // The session token is returned from the login response
    
    if (!sessionToken) {
        return false;
    }

    // Store verification
    localStorage.setItem('sessionToken', sessionToken);
    return true;
}

// Check if user is logged in
function isLoggedIn() {
    return !!localStorage.getItem('sessionToken');
}

// Logout
function logout() {
    localStorage.removeItem('sessionToken');
    localStorage.removeItem('userId');
    window.location.href = 'https://your-app.com/login';
}
```

## Example 7: Redirect After Service Selection

Your app receives redirect with all parameters:

```javascript
// At https://your-external-app.com/welcome
const urlParams = new URLSearchParams(window.location.search);
const service = urlParams.get('service');
const userId = urlParams.get('userId');

console.log('User logged in with service:', service);
console.log('User ID:', userId);

// Customize based on service
switch(service) {
    case 'training':
        // Show training materials
        break;
    case 'printing':
        // Show print job interface
        break;
    case 'pc_use':
        // Show computer booking system
        break;
}
```

## Example 8: Error Handling

```javascript
async function loginWithErrorHandling(email, password, service) {
    try {
        const response = await fetch(
            'https://your-app.com/api/auth/query-login',
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    id: email,
                    pass: password,
                    service: service
                }),
                timeout: 5000 // 5 second timeout
            }
        );

        if (response.status === 400) {
            console.error('Invalid request');
            return { error: 'Invalid request parameters' };
        }

        if (response.status === 401) {
            console.error('Invalid credentials');
            return { error: 'Invalid email or password' };
        }

        if (response.status === 500) {
            console.error('Server error');
            return { error: 'Server error. Please try again later.' };
        }

        const data = await response.json();
        return data;

    } catch (error) {
        if (error.name === 'AbortError') {
            return { error: 'Request timeout' };
        }
        return { error: 'Network error' };
    }
}
```

## Example 9: Python Backend Integration

```python
import requests
import json

def login_user(email, password, service):
    """
    Authenticate user with the authentication system
    """
    url = 'https://your-app.com/api/auth/query-login'
    
    payload = {
        'id': email,
        'pass': password,
        'service': service
    }
    
    headers = {
        'Content-Type': 'application/json'
    }
    
    try:
        response = requests.post(url, json=payload, headers=headers, timeout=5)
        
        if response.status_code == 200:
            data = response.json()
            return {
                'success': True,
                'user_id': data['user']['id'],
                'session_token': data['session']['token'],
                'service': data['session']['service_used']
            }
        elif response.status_code == 401:
            return {
                'success': False,
                'error': 'Invalid credentials'
            }
        else:
            return {
                'success': False,
                'error': 'Authentication failed'
            }
    except requests.exceptions.Timeout:
        return {
            'success': False,
            'error': 'Request timeout'
        }
    except Exception as e:
        return {
            'success': False,
            'error': str(e)
        }

# Usage
result = login_user('user@example.com', 'password123', 'training')
if result['success']:
    print(f"Logged in! User ID: {result['user_id']}")
else:
    print(f"Login failed: {result['error']}")
```

## Best Practices

1. **Always use HTTPS** in production
2. **Store session tokens securely** - don't expose them
3. **Validate responses** - check HTTP status codes
4. **Handle timeouts** - implement request timeouts
5. **Never log passwords** - remove from logs immediately
6. **Use POST** - for sensitive data, not GET query params
7. **CORS considerations** - ensure proper headers if cross-origin
8. **Rate limiting** - implement on your client side too
9. **Session validation** - re-validate periodically if needed
10. **Error messages** - don't expose internal details

## Common Issues

### "Redirect not working"
- Ensure `redirect_mode=true` is set
- Verify the redirect URL is accessible
- Check browser console for errors

### "Session cookie not setting"
- HTTPS required in production (secure flag)
- Check browser cookie settings
- Verify SameSite policy compatibility

### "CORS errors"
- The API handles CORS automatically
- If issues persist, ensure requests include proper headers

### "Invalid credentials"
- Double-check email/password
- Ensure user is registered first
- Verify character encoding in parameters

## Testing

```bash
# Test with curl
curl -X POST https://your-app.com/api/auth/query-login \
  -H "Content-Type: application/json" \
  -d '{"id":"user@example.com","pass":"password123","service":"training"}'

# Test with GET
curl "https://your-app.com/api/auth/query-login?id=user@example.com&pass=password123&service=training&redirect_mode=true"
```

---

For more details, see:
- `API_DOCUMENTATION.md` - Complete API reference
- `SETUP_GUIDE.md` - Installation guide
- `PROJECT_SUMMARY.md` - Project overview
