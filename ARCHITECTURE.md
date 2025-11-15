# Architecture Overview

## System Architecture

The TheHelpWorks Housing Engine is built as a modern, scalable application with a clear separation of concerns.

### High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     Frontend Layer                           │
│  (React Native - iOS, Android, Web)                         │
│  - Chatbot Interface                                         │
│  - Decision Pathways UI                                      │
│  - Template Browser                                          │
│  - Updates Dashboard                                         │
└─────────────────────────────────────────────────────────────┘
                            │
                            │ REST API
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                     Backend Layer                            │
│  (Python FastAPI)                                           │
│                                                              │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐     │
│  │   API Layer  │  │   Services   │  │  ETL Pipeline│     │
│  │              │  │              │  │              │     │
│  │ - Chat       │  │ - AI Service │  │ - Extract    │     │
│  │ - Templates  │  │ - Decision   │  │ - Transform  │     │
│  │ - Decisions  │  │ - Templates  │  │ - Load       │     │
│  │ - Updates    │  │ - Legislative│  │              │     │
│  └──────────────┘  └──────────────┘  └──────────────┘     │
│                                                              │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                   Data Layer                                 │
│                                                              │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐     │
│  │  PostgreSQL  │  │    Redis     │  │   OpenAI     │     │
│  │  Database    │  │    Cache     │  │     API      │     │
│  └──────────────┘  └──────────────┘  └──────────────┘     │
└─────────────────────────────────────────────────────────────┘
```

## Backend Components

### 1. API Layer (`app/api/`)
- **Purpose**: Handle HTTP requests and responses
- **Components**:
  - Chat endpoint: AI-powered Q&A
  - Legal templates endpoint: Document management
  - Decisions endpoint: Decision pathway processing
  - Legislative updates endpoint: Law change tracking

### 2. Service Layer (`app/services/`)
- **Purpose**: Business logic implementation
- **Components**:
  - `ai_service.py`: GPT integration and chat processing
  - `template_service.py`: Template management with versioning
  - `decision_service.py`: Decision pathway logic
  - `legislative_service.py`: Legislative update management

### 3. ETL Pipeline (`app/etl/`)
- **Purpose**: Automated data processing
- **Process**:
  1. Extract: Pull data from external sources (APIs, web scraping)
  2. Transform: Clean, normalize, and enrich data
  3. Load: Store processed data in database
- **Schedule**: Runs periodically (configurable interval)

### 4. Database Layer (`app/models/`, `app/db/`)
- **Purpose**: Data persistence
- **Models**:
  - LegalTemplate: Document templates with versioning
  - LegislativeUpdate: Law changes and updates
  - ChatSession: User chat histories
  - DecisionPathway: Decision trees and logic

## Frontend Components

### 1. Screens (`src/screens/`)
- **HomeScreen**: Main navigation hub
- **ChatScreen**: AI chatbot interface using Gifted Chat
- **DecisionScreen**: Interactive decision pathways
- **TemplatesScreen**: Browse and download templates
- **UpdatesScreen**: View legislative updates

### 2. Services (`src/services/`)
- **api.js**: Centralized API communication
  - Chat service
  - Template service
  - Decision service
  - Legislative service

### 3. Navigation
- Stack-based navigation using React Navigation
- Accessible screen transitions
- Deep linking support

## Data Flow

### Chat Interaction Flow
```
User Input → Frontend ChatScreen 
          → API POST /api/v1/chat/
          → AI Service (GPT Processing)
          → Response with suggestions
          → Frontend displays message + actions
```

### Decision Pathway Flow
```
User selects pathway → Load pathway steps
                     → User answers questions
                     → POST /api/v1/decisions/evaluate
                     → Decision Service evaluates
                     → Returns recommendations + templates
                     → Display results to user
```

### Legislative Update Flow
```
Scheduled Task → ETL Pipeline
              → Extract from sources
              → Transform data
              → Load to database
              → Notify frontend
              → Display in UpdatesScreen
```

## Technology Stack

### Backend
- **Framework**: FastAPI (Python)
- **ORM**: SQLAlchemy
- **Database**: PostgreSQL/SQLite
- **Cache**: Redis
- **AI**: OpenAI GPT-4
- **Task Queue**: Celery
- **Testing**: Pytest

### Frontend
- **Framework**: React Native
- **Platform**: Expo
- **UI Library**: React Native Paper
- **Chat UI**: Gifted Chat
- **Navigation**: React Navigation
- **HTTP Client**: Axios

### DevOps
- **CI/CD**: GitHub Actions
- **Testing**: Pytest, Jest
- **Linting**: Flake8, Black, ESLint
- **Version Control**: Git

## Security Considerations

1. **API Security**
   - JWT-based authentication
   - CORS configuration
   - Rate limiting
   - Input validation

2. **Data Protection**
   - Encrypted environment variables
   - Secure database connections
   - No sensitive data in logs

3. **AI Safety**
   - Input sanitization
   - Output validation
   - Context-aware responses
   - User privacy protection

## Scalability

### Horizontal Scaling
- Stateless API design
- Redis for session management
- Load balancer ready

### Vertical Scaling
- Async/await patterns
- Database indexing
- Query optimization
- Caching strategy

## Monitoring & Logging

- Application logs
- Error tracking
- Performance metrics
- API usage analytics
- Health check endpoints
