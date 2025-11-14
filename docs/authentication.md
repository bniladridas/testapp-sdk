# Authentication

This document describes the authentication system implemented in TestApp, including user registration, login, session management, and API security.

## Overview

TestApp uses a JWT-based authentication system with the following components:

- **Frontend**: React context for state management and localStorage for persistence
- **Backend**: Express.js server with JWT tokens and bcrypt password hashing
- **Security**: Password hashing, token expiration, and protected routes

## Frontend Implementation

### AuthContext

The `AuthContext` provides authentication state and methods throughout the application:

```typescript
interface User {
  id: number;
  email: string;
}

interface AuthContextType {
  user: User | null;
  login: (token: string, user: User) => void;
  logout: () => void;
  isLoading: boolean;
}
```

**Key Features:**

- Stores user data and JWT token in localStorage
- Automatically restores session on app reload
- Provides login/logout functionality

### Components

#### Login Component

- Form for email/password authentication
- Calls `/api/auth/login` endpoint
- Redirects to home page on success
- Displays error messages for failed attempts

#### Signup Component

- Form for user registration
- Validates password confirmation
- Calls `/api/auth/signup` endpoint
- Automatically logs in user after successful registration

### Protected Routes

The main application route (`/`) is protected and requires authentication:

```typescript
<Route
  path="/"
  element={user ? <ChatApp /> : <Navigate to="/login" replace />}
/>
```

Unauthenticated users are redirected to the login page.

## Backend Implementation

### Authentication Middleware

JWT tokens are validated using middleware:

```javascript
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Invalid or expired token' });
    }
    req.user = user;
    next();
  });
};
```

### User Storage

For demonstration purposes, users are stored in memory. In production, this should be replaced with a proper database.

## API Endpoints

### POST /api/auth/signup

Creates a new user account.

**Request Body:**

```json
{
  "email": "user@example.com",
  "password": "securepassword"
}
```

**Response (Success):**

```json
{
  "token": "jwt.token.here",
  "user": {
    "id": 1,
    "email": "user@example.com"
  }
}
```

**Error Responses:**

- `400`: Email and password required, or user already exists

### POST /api/auth/login

Authenticates an existing user.

**Request Body:**

```json
{
  "email": "user@example.com",
  "password": "securepassword"
}
```

**Response (Success):**

```json
{
  "token": "jwt.token.here",
  "user": {
    "id": 1,
    "email": "user@example.com"
  }
}
```

**Error Responses:**

- `400`: Email and password required, or invalid credentials

## Security Considerations

### Password Security

- Passwords are hashed using bcrypt with salt rounds of 10
- Plain text passwords are never stored or logged

### Token Security

- JWT tokens expire after 24 hours
- Tokens include user ID and email in payload
- Tokens must be included in Authorization header for protected routes

### Session Management

- User sessions persist across browser refreshes via localStorage
- Logout clears both token and user data from localStorage

### Rate Limiting

API endpoints are protected by rate limiting to prevent abuse.

## Usage

### For Users

1. **Sign Up**: Navigate to `/signup`, enter email and password
2. **Log In**: Navigate to `/login`, enter credentials
3. **Access App**: Authenticated users can access the main chat interface
4. **Log Out**: Click the logout button in the navigation

### For Developers

To add authentication to new components:

```typescript
import { useAuth } from './hooks/useAuth';

function MyComponent() {
  const { user, logout } = useAuth();

  if (!user) {
    return <div>Please log in</div>;
  }

  return (
    <div>
      Welcome, {user.email}!
      <button onClick={logout}>Logout</button>
    </div>
  );
}
```

To protect API routes:

```javascript
app.post('/api/protected', authenticateToken, (req, res) => {
  // req.user contains authenticated user data
  res.json({ message: 'Protected data' });
});
```

## Testing

For testing purposes, there's a reset endpoint:

```
POST /api/test/reset
```

This clears all users from memory. Use only in development/testing environments.</content>
<parameter name="filePath">docs/authentication.md
