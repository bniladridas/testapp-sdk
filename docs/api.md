# API Reference

## Authentication

All API requests (except signup and login) require a JWT token in the `Authorization` header: `Bearer <token>`.

### POST /api/auth/signup

Register a new user account.

**Request Body:**

```json
{
  "email": "user@example.com",
  "password": "securepassword123"
}
```

**Success Response (200):**

```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "email": "user@example.com"
  }
}
```

**Error Responses:**

- `400`: Email and password required
- `400`: User already exists

### POST /api/auth/login

Authenticate an existing user.

**Request Body:**

```json
{
  "email": "user@example.com",
  "password": "securepassword123"
}
```

**Success Response (200):**

```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "email": "user@example.com"
  }
}
```

**Error Responses:**

- `400`: Email and password required
- `400`: Invalid credentials

## AI Endpoints

### POST /api/ask-test-ai

Send a message to the AI assistant. Requires authentication.

**Request Body:**

```json
{
  "message": "Your question or prompt here"
}
```

**Success Response (200):**

```json
{
  "text": "AI response text here"
}
```

**Fallback Response (200) - when AI service is busy:**

```json
{
  "text": "I'm a bit busy right now with lots of questions! How's your day going? 😊",
  "fallback": true
}
```

**Error Responses:**

- `400`: Missing message
- `401`: Access token required
- `403`: Invalid or expired token
- `500`: AI service error or API key not configured

**Example:**

```bash
curl -X POST http://localhost:3001/api/ask-test-ai \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \
  -d '{"message": "What is the capital of France?"}'
```

## Utility Endpoints

### GET /api/health

Health check endpoint to verify server and database status.

**Success Response (200):**

```json
{
  "status": "ok",
  "timestamp": "2025-11-14T12:00:00.000Z",
  "database": "connected"
}
```

**Error Response (503):**

```json
{
  "status": "error",
  "timestamp": "2025-11-14T12:00:00.000Z",
  "database": "disconnected",
  "error": "Database connection failed"
}
```

### GET /api/health/database

Detailed database health check with connection pool statistics.

**Success Response (200):**

```json
{
  "status": "ok",
  "timestamp": "2025-11-14T12:00:00.000Z",
  "database": {
    "connected": true,
    "responseTime": "5ms",
    "pool": {
      "total": 2,
      "idle": 1,
      "waiting": 0
    }
  }
}
```

**Error Response (503):**

```json
{
  "status": "error",
  "timestamp": "2025-11-14T12:00:00.000Z",
  "database": {
    "connected": false,
    "error": "Database connection failed",
    "pool": {
      "total": 0,
      "idle": 0,
      "waiting": 0
    }
  }
}
```

### POST /api/test/reset

Reset all user data (development/testing only). This clears all users from the database.

**Response (200):**

```json
{
  "status": "reset"
}
```

**Note:** This endpoint is only available in development mode and should never be exposed in production.

## Error Handling

All error responses follow this format:

```json
{
  "error": "Error description message"
}
```

### HTTP Status Codes

- **400 Bad Request**: Invalid request data or missing required fields
- **401 Unauthorized**: Missing or invalid JWT token
- **403 Forbidden**: Token expired or invalid
- **429 Too Many Requests**: Rate limit exceeded (when rate limiting is enabled)
- **500 Internal Server Error**: Server-side errors, AI service failures, or configuration issues

### Rate Limiting

API endpoints are protected by rate limiting to prevent abuse. When exceeded, requests return HTTP 429 with a retry-after header.

### Authentication Errors

- `Access token required`: Authorization header missing
- `Invalid or expired token`: JWT token is malformed or expired
- `Invalid credentials`: Wrong email/password combination

### AI Service Errors

- `Missing message`: Request body missing required message field
- `AI service error`: Gemini API is unavailable or returned an error
- Fallback responses are provided when the AI service is overloaded

## Webhook Endpoints

### POST /api/webhooks/github

GitHub webhook endpoint for app events (issues, PRs, etc.). Requires proper webhook secret configuration.

**Note:** This endpoint is automatically configured when GitHub App credentials are provided.
