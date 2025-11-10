# API Reference

## Endpoints

### POST /api/ask-test-ai

Query the AI with a message.

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

## Error Handling

- 400: Missing message
- 500: API key not configured or AI error