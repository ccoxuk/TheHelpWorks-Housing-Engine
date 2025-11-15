# Deployment Guide

## Prerequisites

### System Requirements
- Linux server (Ubuntu 20.04+ recommended)
- 2GB+ RAM
- 20GB+ storage
- Domain name (optional, for production)

### Software Requirements
- Python 3.11+
- Node.js 18+
- PostgreSQL 14+
- Redis 6+
- Nginx (for reverse proxy)
- Certbot (for SSL certificates)

## Backend Deployment

### 1. Server Setup

```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Python and dependencies
sudo apt install python3.11 python3.11-venv python3-pip -y

# Install PostgreSQL
sudo apt install postgresql postgresql-contrib -y

# Install Redis
sudo apt install redis-server -y

# Install Nginx
sudo apt install nginx -y
```

### 2. Database Setup

```bash
# Create database and user
sudo -u postgres psql

CREATE DATABASE housing_engine;
CREATE USER housing_user WITH PASSWORD 'your_secure_password';
GRANT ALL PRIVILEGES ON DATABASE housing_engine TO housing_user;
\q
```

### 3. Application Setup

```bash
# Clone repository
git clone https://github.com/ccoxuk/TheHelpWorks-Housing-Engine.git
cd TheHelpWorks-Housing-Engine/backend

# Create virtual environment
python3.11 -m venv venv
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt
pip install gunicorn

# Set up environment variables
cp ../.env.example .env
nano .env  # Edit with production values
```

### 4. Create Systemd Service

Create `/etc/systemd/system/housing-engine.service`:

```ini
[Unit]
Description=TheHelpWorks Housing Engine API
After=network.target

[Service]
User=www-data
Group=www-data
WorkingDirectory=/path/to/TheHelpWorks-Housing-Engine/backend
Environment="PATH=/path/to/TheHelpWorks-Housing-Engine/backend/venv/bin"
ExecStart=/path/to/TheHelpWorks-Housing-Engine/backend/venv/bin/gunicorn app.main:app -w 4 -k uvicorn.workers.UvicornWorker -b 127.0.0.1:8000

[Install]
WantedBy=multi-user.target
```

Enable and start service:

```bash
sudo systemctl enable housing-engine
sudo systemctl start housing-engine
sudo systemctl status housing-engine
```

### 5. Nginx Configuration

Create `/etc/nginx/sites-available/housing-engine`:

```nginx
server {
    listen 80;
    server_name api.yourdomain.com;

    location / {
        proxy_pass http://127.0.0.1:8000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

Enable site:

```bash
sudo ln -s /etc/nginx/sites-available/housing-engine /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

### 6. SSL Certificate (Production)

```bash
sudo apt install certbot python3-certbot-nginx -y
sudo certbot --nginx -d api.yourdomain.com
```

## Frontend Deployment

### Web Deployment

```bash
cd frontend

# Install dependencies
npm install

# Build for production
npm run build

# Deploy to hosting service
# (Netlify, Vercel, AWS S3, etc.)
```

### Mobile App Deployment

#### iOS (requires macOS)

```bash
# Build iOS app
expo build:ios

# Upload to App Store Connect
# Follow Apple's app submission process
```

#### Android

```bash
# Build Android APK/AAB
expo build:android

# Upload to Google Play Console
# Follow Google's app submission process
```

## Environment Variables

### Backend (.env)

```env
# Database
DATABASE_URL=postgresql://housing_user:password@localhost/housing_engine

# Redis
REDIS_URL=redis://localhost:6379/0

# OpenAI
OPENAI_API_KEY=your_openai_api_key

# Security
SECRET_KEY=your_very_secure_random_secret_key
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30

# CORS
ALLOWED_ORIGINS=["https://yourdomain.com","https://app.yourdomain.com"]
```

### Frontend

```env
API_BASE_URL=https://api.yourdomain.com/api/v1
```

## Database Migrations

```bash
# Create migration
alembic revision --autogenerate -m "Initial migration"

# Run migrations
alembic upgrade head
```

## Monitoring

### Setup PM2 (Alternative to Systemd)

```bash
npm install -g pm2

# Start application
pm2 start "gunicorn app.main:app -w 4 -k uvicorn.workers.UvicornWorker" --name housing-engine

# Save PM2 configuration
pm2 save

# Setup PM2 to start on boot
pm2 startup
```

### Log Monitoring

```bash
# View systemd logs
sudo journalctl -u housing-engine -f

# View Nginx logs
sudo tail -f /var/log/nginx/access.log
sudo tail -f /var/log/nginx/error.log

# View PM2 logs
pm2 logs housing-engine
```

## Backup Strategy

### Database Backup

```bash
# Create backup script
cat > /opt/backup-db.sh << 'EOF'
#!/bin/bash
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="/var/backups/housing-engine"
mkdir -p $BACKUP_DIR
pg_dump -U housing_user housing_engine > $BACKUP_DIR/backup_$TIMESTAMP.sql
# Keep only last 7 days of backups
find $BACKUP_DIR -name "backup_*.sql" -mtime +7 -delete
EOF

chmod +x /opt/backup-db.sh

# Add to crontab (daily at 2 AM)
(crontab -l 2>/dev/null; echo "0 2 * * * /opt/backup-db.sh") | crontab -
```

## Performance Tuning

### PostgreSQL

Edit `/etc/postgresql/14/main/postgresql.conf`:

```conf
shared_buffers = 256MB
effective_cache_size = 1GB
maintenance_work_mem = 64MB
checkpoint_completion_target = 0.9
wal_buffers = 16MB
default_statistics_target = 100
random_page_cost = 1.1
effective_io_concurrency = 200
work_mem = 2621kB
min_wal_size = 1GB
max_wal_size = 4GB
max_connections = 100
```

### Redis

Edit `/etc/redis/redis.conf`:

```conf
maxmemory 256mb
maxmemory-policy allkeys-lru
```

## Security Hardening

```bash
# Enable UFW firewall
sudo ufw allow 22/tcp
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw enable

# Disable password authentication for SSH
sudo nano /etc/ssh/sshd_config
# Set: PasswordAuthentication no
sudo systemctl reload sshd

# Keep system updated
sudo apt update && sudo apt upgrade -y
sudo apt autoremove -y
```

## Scaling Considerations

### Load Balancing

Use Nginx or cloud load balancers to distribute traffic across multiple backend instances.

### Caching

- Use Redis for session management
- Implement API response caching
- Use CDN for static assets

### Database

- Set up read replicas for PostgreSQL
- Implement connection pooling
- Regular index optimization

## Troubleshooting

### Check Service Status

```bash
sudo systemctl status housing-engine
sudo systemctl status nginx
sudo systemctl status postgresql
sudo systemctl status redis
```

### Common Issues

1. **Database connection errors**: Check PostgreSQL is running and credentials are correct
2. **502 Bad Gateway**: Backend service is down or unreachable
3. **CORS errors**: Check ALLOWED_ORIGINS in backend config
4. **Slow responses**: Check database queries and add indexes as needed

## Rollback Procedure

```bash
# Stop service
sudo systemctl stop housing-engine

# Restore from backup
git checkout previous-version-tag
source venv/bin/activate
pip install -r requirements.txt

# Restore database
psql -U housing_user housing_engine < /var/backups/housing-engine/backup_TIMESTAMP.sql

# Restart service
sudo systemctl start housing-engine
```
