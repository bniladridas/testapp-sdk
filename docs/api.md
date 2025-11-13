# API Reference

## Authentication

All API requests (except signup and login) require a JWT token in the `Authorization` header: `Bearer <token>`.

### POST /api/auth/signup

Register a new user.

**Request:**

```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response:**

```json
{
  "message": "User created successfully",
  "token": "jwt-token-here"
}
```

### POST /api/auth/login

Login an existing user.

**Request:**

```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response:**

```json
{
  "message": "Login successful",
  "token": "jwt-token-here"
}
```

## Endpoints

### POST /api/ask-test-ai

Query the AI with a message. Requires authentication.

**Request:**

```json
{
  "message": "Your question"
}
```

**Response:**

```json
{
  "text": "AI response"
}
```

**Example:**

```bash
curl -X POST http://127.0.0.1:3001/api/ask-test-ai \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <your-jwt-token>" \
  -d '{"message": "Hello"}'
```

**Response:**

```json
{
  "text": "AI response"
}
```

**Example:**

```bash
curl -X POST http://localhost:3001/api/ask-test-ai \
  -H "Content-Type: application/json" \
  -d '{"message": "Hello"}'
```

## Health Check

### GET /api/health

Returns server status.

**Response:**

```json
{
  "status": "ok",
  "timestamp": "2025-11-10T12:00:00.000Z"
}
```

### POST /api/test/reset

Reset test data (for testing purposes).

**Response:**

```json
{
  "message": "Test data reset"
}
```

## Error Handling

- 400: Missing message or invalid credentials
- 401: Unauthorized (invalid/missing token)
- 500: API key not configured or AI error
