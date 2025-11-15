# Quick Start Guide

Get TheHelpWorks Housing Engine up and running in minutes!

## Prerequisites

- Python 3.11+
- Node.js 18+
- Git

## Quick Setup (Development)

### 1. Clone the Repository

```bash
git clone https://github.com/ccoxuk/TheHelpWorks-Housing-Engine.git
cd TheHelpWorks-Housing-Engine
```

### 2. Set Up Backend (5 minutes)

```bash
# Navigate to backend
cd backend

# Create virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Set up environment variables
cp ../.env.example .env
# Edit .env if needed (optional for local development)

# Run the backend server
uvicorn app.main:app --reload
```

Backend API will be available at: http://localhost:8000
API Documentation: http://localhost:8000/docs

### 3. Set Up Frontend (5 minutes)

Open a new terminal:

```bash
# Navigate to frontend
cd frontend

# Install dependencies
npm install

# Start the development server
npm start
```

Choose your preferred platform:
- Press `w` for web browser
- Press `i` for iOS simulator (macOS only)
- Press `a` for Android emulator

## Verify Installation

### Test Backend

```bash
cd backend

# Run tests
pytest app/tests/ -v

# Check code quality
flake8 app
black app --check
```

### Test Frontend

```bash
cd frontend

# Run tests (if available)
npm test
```

## Common Use Cases

### 1. Chat with AI Assistant

1. Start both backend and frontend
2. Navigate to Chat screen in the app
3. Type a housing legal question
4. Receive AI-powered assistance

### 2. Use Decision Pathways

1. Navigate to Decision Guide screen
2. Select a pathway (e.g., "Eviction Process")
3. Answer the questions step by step
4. Receive personalized recommendations

### 3. Browse Legal Templates

1. Navigate to Legal Templates screen
2. Filter by category or search
3. View template details and versions
4. Download templates for use

### 4. Check Legislative Updates

1. Navigate to Legislative Updates screen
2. Filter by jurisdiction
3. View impact levels and effective dates
4. Sync for latest updates

## Environment Variables

Create a `.env` file in the backend directory:

```env
# Required for AI features (get from OpenAI)
OPENAI_API_KEY=your_openai_api_key_here

# Database (default: SQLite)
DATABASE_URL=sqlite:///./housing_engine.db

# Optional: Redis for caching
REDIS_URL=redis://localhost:6379/0

# Security (change for production)
SECRET_KEY=your-secret-key-here
```

## Troubleshooting

### Backend Issues

**Port already in use:**
```bash
uvicorn app.main:app --reload --port 8001
```

**Database errors:**
```bash
# Delete the database and restart
rm backend/housing_engine.db
```

**Import errors:**
```bash
# Ensure virtual environment is activated
source venv/bin/activate  # or venv\Scripts\activate on Windows
pip install -r requirements.txt
```

### Frontend Issues

**Metro bundler errors:**
```bash
# Clear cache
npx expo start -c
```

**Module not found:**
```bash
# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install
```

**Port conflicts:**
```bash
# Expo will automatically use a different port
# Or specify manually: npx expo start --port 19001
```

## API Endpoints Quick Reference

### Chat
- `POST /api/v1/chat/` - Send chat message
- `POST /api/v1/chat/analyze` - Analyze legal situation

### Legal Templates
- `GET /api/v1/legal-templates/` - List templates
- `GET /api/v1/legal-templates/{id}` - Get template
- `GET /api/v1/legal-templates/{id}/versions` - Version history

### Decisions
- `GET /api/v1/decisions/pathways` - List pathways
- `GET /api/v1/decisions/pathways/{id}` - Get pathway
- `POST /api/v1/decisions/evaluate` - Evaluate decision

### Legislative Updates
- `GET /api/v1/legislative-updates/` - List updates
- `GET /api/v1/legislative-updates/{id}` - Get update
- `POST /api/v1/legislative-updates/sync` - Sync updates

## Development Tips

1. **Hot Reload**: Both backend (with `--reload`) and frontend support hot reload
2. **API Testing**: Use the built-in Swagger UI at http://localhost:8000/docs
3. **Debugging**: Check console output in both backend and frontend terminals
4. **Database**: SQLite database file is created automatically on first run

## Next Steps

- Read the full [README.md](README.md) for detailed information
- Check [ARCHITECTURE.md](ARCHITECTURE.md) for system design
- See [DEPLOYMENT.md](DEPLOYMENT.md) for production deployment

## Getting Help

- Check existing issues on GitHub
- Create a new issue for bugs or feature requests
- Contact: support@thehelpworks.org

---

**Happy coding! 🎉**
