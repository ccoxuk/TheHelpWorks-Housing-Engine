# API Documentation

Complete API reference for TheHelpWorks Housing Engine.

## Base URL

```
Development: http://localhost:8000/api/v1
Production: https://api.yourdomain.com/api/v1
```

## Authentication

Currently, the API doesn't require authentication for development. In production, endpoints will require JWT tokens.

**Future Authentication Header:**
```
Authorization: Bearer <your_jwt_token>
```

## Chat API

### Send Chat Message

Process a chat message using AI for housing legal assistance.

**Endpoint:** `POST /chat/`

**Request Body:**
```json
{
  "messages": [
    {
      "role": "user",
      "content": "I received an eviction notice, what should I do?"
    }
  ],
  "context": {
    "jurisdiction": "England",
    "situation_type": "eviction"
  }
}
```

**Response:**
```json
{
  "message": "I understand you're asking about: I received an eviction notice, what should I do?. Let me help you with your housing legal issue.",
  "suggestions": [
    "Review your tenancy agreement",
    "Document all communications with your landlord",
    "Check your local housing laws"
  ],
  "legal_templates": [
    "eviction_notice_response",
    "rent_dispute_letter"
  ]
}
```

### Analyze Legal Situation

Get a detailed analysis of a housing legal situation.

**Endpoint:** `POST /chat/analyze`

**Request Body:**
```json
{
  "situation_type": "eviction",
  "details": "Received Section 21 notice",
  "jurisdiction": "England",
  "urgency": "high"
}
```

**Response:**
```json
{
  "severity": "medium",
  "recommended_actions": [
    "Seek legal advice",
    "Document the situation",
    "Review your rights"
  ],
  "applicable_laws": [
    "Housing Act 2004",
    "Landlord and Tenant Act 1985"
  ],
  "next_steps": [
    "Gather evidence",
    "Contact housing authority",
    "Consider mediation"
  ]
}
```

## Legal Templates API

### List Templates

Get a list of all legal templates, optionally filtered by category.

**Endpoint:** `GET /legal-templates/`

**Query Parameters:**
- `category` (optional): Filter by category (e.g., "eviction", "rent", "repairs")

**Example Request:**
```
GET /legal-templates/?category=eviction
```

**Response:**
```json
{
  "templates": [
    {
      "id": 1,
      "name": "Eviction Notice Response",
      "category": "eviction",
      "content": "Template content for responding to eviction notice...",
      "version": "1.0.0",
      "created_at": "2024-01-15T10:30:00Z",
      "updated_at": "2024-01-15T10:30:00Z"
    }
  ],
  "total": 1
}
```

### Get Specific Template

Retrieve a specific legal template by ID.

**Endpoint:** `GET /legal-templates/{id}`

**Example Request:**
```
GET /legal-templates/1
```

**Response:**
```json
{
  "id": 1,
  "name": "Eviction Notice Response",
  "category": "eviction",
  "content": "Template content for responding to eviction notice...",
  "version": "1.0.0",
  "created_at": "2024-01-15T10:30:00Z",
  "updated_at": "2024-01-15T10:30:00Z"
}
```

### Create Template

Create a new legal template.

**Endpoint:** `POST /legal-templates/`

**Request Body:**
```json
{
  "name": "New Template",
  "category": "rent",
  "content": "Template content here..."
}
```

**Response:**
```json
{
  "id": 4,
  "name": "New Template",
  "category": "rent",
  "content": "Template content here...",
  "version": "1.0.0",
  "created_at": "2024-01-15T10:35:00Z",
  "updated_at": "2024-01-15T10:35:00Z"
}
```

### Get Template Versions

Retrieve version history for a template.

**Endpoint:** `GET /legal-templates/{id}/versions`

**Response:**
```json
{
  "versions": [
    {
      "version": "1.0.0",
      "created_at": "2024-01-15T10:30:00Z",
      "changes": "Initial version"
    }
  ]
}
```

## Decision Pathways API

### List Decision Pathways

Get all available decision pathways.

**Endpoint:** `GET /decisions/pathways`

**Response:**
```json
[
  {
    "id": "eviction",
    "name": "Eviction Process",
    "description": "Navigate the eviction process and understand your rights",
    "steps": [
      {
        "id": "step1",
        "question": "Have you received an eviction notice?",
        "options": ["Yes", "No"],
        "next_steps": {
          "Yes": "step2",
          "No": "end_no_notice"
        }
      }
    ]
  }
]
```

### Get Specific Pathway

Retrieve a specific decision pathway.

**Endpoint:** `GET /decisions/pathways/{pathway_id}`

**Example Request:**
```
GET /decisions/pathways/eviction
```

**Response:**
```json
{
  "id": "eviction",
  "name": "Eviction Process",
  "description": "Navigate the eviction process and understand your rights",
  "steps": [
    {
      "id": "step1",
      "question": "Have you received an eviction notice?",
      "options": ["Yes", "No"],
      "next_steps": {
        "Yes": "step2",
        "No": "end_no_notice"
      }
    }
  ]
}
```

### Evaluate Decision

Evaluate a decision pathway based on user inputs.

**Endpoint:** `POST /decisions/evaluate`

**Request Body:**
```json
{
  "answers": {
    "received_notice": "yes",
    "notice_type": "section_21"
  },
  "context": {
    "jurisdiction": "England"
  }
}
```

**Response:**
```json
{
  "recommendation": "Based on your situation, you should respond to the eviction notice within 14 days.",
  "applicable_templates": [
    "eviction_notice_response",
    "legal_rights_summary"
  ],
  "next_actions": [
    "Document all communications",
    "Seek legal advice",
    "Prepare your defense"
  ],
  "confidence": 0.85
}
```

## Legislative Updates API

### List Updates

Get legislative updates, optionally filtered by jurisdiction.

**Endpoint:** `GET /legislative-updates/`

**Query Parameters:**
- `jurisdiction` (optional): Filter by jurisdiction (e.g., "England", "Wales")

**Example Request:**
```
GET /legislative-updates/?jurisdiction=England
```

**Response:**
```json
{
  "updates": [
    {
      "id": 1,
      "title": "Renters Reform Bill 2024",
      "description": "Major reforms to rental housing including abolition of Section 21 evictions",
      "source": "UK Parliament",
      "jurisdiction": "England",
      "effective_date": "2024-06-01T00:00:00Z",
      "impact_level": "high",
      "created_at": "2024-01-15T10:30:00Z"
    }
  ],
  "total": 1
}
```

### Get Specific Update

Retrieve a specific legislative update.

**Endpoint:** `GET /legislative-updates/{id}`

**Response:**
```json
{
  "id": 1,
  "title": "Renters Reform Bill 2024",
  "description": "Major reforms to rental housing including abolition of Section 21 evictions",
  "source": "UK Parliament",
  "jurisdiction": "England",
  "effective_date": "2024-06-01T00:00:00Z",
  "impact_level": "high",
  "created_at": "2024-01-15T10:30:00Z"
}
```

### Sync Updates

Trigger manual synchronization of legislative updates.

**Endpoint:** `POST /legislative-updates/sync`

**Response:**
```json
{
  "status": "success",
  "updates_processed": 3
}
```

## Error Responses

All endpoints may return the following error responses:

### 400 Bad Request
```json
{
  "detail": "Invalid request parameters"
}
```

### 404 Not Found
```json
{
  "detail": "Resource not found"
}
```

### 500 Internal Server Error
```json
{
  "detail": "Internal server error message"
}
```

## Rate Limiting

Currently, no rate limiting is implemented in development. In production:
- Limit: 100 requests per minute per IP
- Headers: `X-RateLimit-Limit`, `X-RateLimit-Remaining`, `X-RateLimit-Reset`

## Pagination

For endpoints that return lists, pagination is planned:
- `page`: Page number (default: 1)
- `per_page`: Items per page (default: 20, max: 100)

## CORS

The API allows requests from:
- `http://localhost:3000`
- `http://localhost:8081`
- `http://localhost:19006`

In production, configure `ALLOWED_ORIGINS` in `.env`.

## Interactive Documentation

Visit these URLs when the backend is running:
- Swagger UI: http://localhost:8000/docs
- ReDoc: http://localhost:8000/redoc
