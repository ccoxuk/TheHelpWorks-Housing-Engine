# TheHelpWorks Housing Engine

An AI-powered application to help users with housing legal issues. This comprehensive platform provides legal assistance through an intelligent chatbot, decision pathways, legal templates, and automated legislative updates.

## 🚀 Features

### Core Capabilities
- **AI-Powered Q&A Chatbot**: GPT-based conversational interface for immediate legal assistance
- **Decision Engine**: Step-by-step guided pathways for housing legal issues
- **Legal Templates**: Version-controlled library of legal document templates
- **Legislative Updates**: Automated tracking and notification of housing law changes
- **ETL Pipeline**: Automated data processing for legal and legislative information
- **Accessible Interface**: Mobile-first React Native application with accessibility features

### Technical Features
- **Scalable Backend**: Python FastAPI with async support
- **Real-time Processing**: Redis for caching and background tasks
- **Database**: SQLAlchemy with support for PostgreSQL/SQLite
- **CI/CD**: Automated testing and deployment pipelines
- **Version Control**: Git-based content versioning for templates and updates

## 📋 Requirements

### Backend
- Python 3.11+
- pip or poetry for package management
- Redis (for background tasks)
- SQLite/PostgreSQL database

### Frontend
- Node.js 18+
- npm or yarn
- Expo CLI (for React Native development)

## 🛠️ Installation

### Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Create and activate a virtual environment:
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

3. Install dependencies:
```bash
pip install -r requirements.txt
```

4. Set up environment variables:
```bash
cp ../.env.example .env
# Edit .env with your configuration
```

5. Run the application:
```bash
uvicorn app.main:app --reload
```

The API will be available at `http://localhost:8000`

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm start
```

4. Run on specific platform:
```bash
npm run ios      # iOS simulator
npm run android  # Android emulator
npm run web      # Web browser
```

## 🏗️ Architecture

### Backend Structure
```
backend/
├── app/
│   ├── api/
│   │   └── endpoints/      # API route handlers
│   ├── core/               # Configuration and utilities
│   ├── db/                 # Database configuration
│   ├── etl/                # ETL pipeline
│   ├── models/             # Database models
│   ├── services/           # Business logic
│   └── tests/              # Unit tests
└── requirements.txt
```

### Frontend Structure
```
frontend/
├── src/
│   ├── components/         # Reusable components
│   ├── screens/            # Screen components
│   ├── services/           # API services
│   ├── navigation/         # Navigation configuration
│   └── utils/              # Utility functions
├── App.js
└── package.json
```

## 🔌 API Documentation

Once the backend is running, visit:
- API Documentation: `http://localhost:8000/docs`
- Alternative Docs: `http://localhost:8000/redoc`

### Main Endpoints

#### Chat API
- `POST /api/v1/chat/` - Send chat message
- `POST /api/v1/chat/analyze` - Analyze legal situation

#### Legal Templates
- `GET /api/v1/legal-templates/` - List all templates
- `GET /api/v1/legal-templates/{id}` - Get specific template
- `GET /api/v1/legal-templates/{id}/versions` - Get version history

#### Decision Pathways
- `GET /api/v1/decisions/pathways` - List decision pathways
- `GET /api/v1/decisions/pathways/{id}` - Get specific pathway
- `POST /api/v1/decisions/evaluate` - Evaluate decision

#### Legislative Updates
- `GET /api/v1/legislative-updates/` - List updates
- `GET /api/v1/legislative-updates/{id}` - Get specific update
- `POST /api/v1/legislative-updates/sync` - Trigger manual sync

## 🧪 Testing

### Backend Tests
```bash
cd backend
pytest app/tests/ -v --cov=app
```

### Frontend Tests
```bash
cd frontend
npm test
```

## 🔧 Development

### Code Quality

**Backend Linting:**
```bash
cd backend
flake8 app
black app --check
mypy app
```

**Frontend Linting:**
```bash
cd frontend
npm run lint
```

### Running ETL Pipeline

The ETL pipeline automatically processes legislative and legal data:

```python
from app.etl.pipeline import LegalDataETL

etl = LegalDataETL()
result = await etl.run_etl_pipeline()
```

## 🚀 Deployment

### Backend Deployment

1. Set environment variables for production
2. Use a production WSGI server (e.g., Gunicorn):
```bash
gunicorn app.main:app -w 4 -k uvicorn.workers.UvicornWorker
```

### Frontend Deployment

**Web:**
```bash
cd frontend
npm run build
```

**Mobile:**
```bash
expo build:android
expo build:ios
```

## 🔐 Environment Variables

See `.env.example` for required environment variables:

- `OPENAI_API_KEY` - OpenAI API key for GPT integration
- `DATABASE_URL` - Database connection string
- `REDIS_URL` - Redis connection URL
- `SECRET_KEY` - Secret key for JWT tokens
- `API_BASE_URL` - Backend API URL for frontend

## 📚 Documentation

### Key Components

1. **AI Service**: Processes user queries using GPT and provides contextual legal assistance
2. **Decision Service**: Guides users through structured decision pathways
3. **Template Service**: Manages legal document templates with version control
4. **Legislative Service**: Tracks and updates housing legislation changes
5. **ETL Pipeline**: Automates data extraction, transformation, and loading

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests and linting
5. Submit a pull request

## 📄 License

See LICENSE file for details.

## 🆘 Support

For issues and questions:
- Create an issue in the GitHub repository
- Contact: support@thehelpworks.org

## 🙏 Acknowledgments

Built to provide assistance and create ownership for those at risk of losing their home.
