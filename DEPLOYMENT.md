# TaskCore Deployment Guide

## 🚀 Quick Start (Development)

### 1. Prerequisites
```bash
# Required
- Docker & Docker Compose
- Node.js 18+
- Git

# Optional (for development)
- Python 3.9+ (for OCR service development)
```

### 2. Clone and Setup
```bash
git clone <your-repo-url>
cd taskcore
cp .env.example .env
```

### 3. Start All Services
```bash
# Install dependencies and start
npm run setup

# Or manually
npm install
npm run docker:up
```

### 4. Access Points
- **Web App**: http://localhost
- **API Gateway**: http://localhost:3000/health
- **MinIO Console**: http://localhost:9001

## 🏗️ Architecture Overview

TaskCore consists of these services:

| Service | Port | Technology | Purpose |
|---------|------|------------|---------|
| Nginx | 80/443 | Reverse Proxy | Load balancing, SSL termination |
| API Gateway | 3000 | Node.js/Express | Central routing, authentication |
| Auth Service | 3001 | Node.js | User management, JWT |
| Project Service | 3002 | Node.js | Tasks, projects, workflows |
| Knowledge Service | 3003 | Node.js | Pages, documents, collaboration |
| Punch List Service | 3004 | Node.js | QA workflows, file uploads |
| Search Service | 3005 | Node.js | Full-text search, indexing |
| Integration Service | 3006 | Node.js | Third-party connections |
| AI Assistant | 3007 | Node.js | AI features, chat |
| PaddleOCR | 8888 | Python/Flask | Image text extraction |
| Web App | 3100 | Next.js | Frontend application |

### Supporting Infrastructure
| Service | Port | Purpose |
|---------|------|---------|
| PostgreSQL | 5432 | Primary database |
| MongoDB | 27017 | Document storage |
| Redis | 6379 | Caching, sessions |
| Elasticsearch | 9200 | Search engine |
| MinIO | 9000/9001 | Object storage |

## 📋 Development Setup

### Individual Service Development
```bash
# API Gateway
npm run dev --workspace=@taskcore/api-gateway

# Web App
npm run dev --workspace=@taskcore/web

# Build shared package
npm run build --workspace=@taskcore/shared
```

### Database Operations
```bash
# Reset database
docker-compose down -v
docker-compose up postgres mongodb redis elasticsearch

# View logs
docker-compose logs -f api-gateway
```

## 🌐 Production Deployment

### 1. Environment Configuration
```bash
# Copy and edit production environment
cp .env.example .env.production

# Key changes for production:
NODE_ENV=production
JWT_SECRET=<strong-random-secret>
MINIO_SECRET_KEY=<strong-random-secret>
OPENAI_API_KEY=<your-openai-key>
```

### 2. Docker Production Build
```bash
# Build production images
docker-compose -f docker-compose.prod.yml build

# Start production services
docker-compose -f docker-compose.prod.yml up -d
```

### 3. SSL/HTTPS Setup
```bash
# Add SSL certificates to nginx/ssl/
# Update nginx/nginx.conf for SSL configuration
# Update environment variables:
NEXT_PUBLIC_API_URL=https://yourdomain.com/api
NEXT_PUBLIC_WS_URL=wss://yourdomain.com
```

## ☸️ Kubernetes Deployment

### 1. Create Namespace
```bash
kubectl create namespace taskcore
```

### 2. Deploy ConfigMaps and Secrets
```bash
# Create environment config
kubectl create configmap taskcore-config \
  --from-env-file=.env.production \
  -n taskcore

# Create secrets
kubectl create secret generic taskcore-secrets \
  --from-literal=jwt-secret=<your-jwt-secret> \
  --from-literal=db-password=<your-db-password> \
  -n taskcore
```

### 3. Deploy Services
```bash
kubectl apply -f k8s/ -n taskcore
```

## 🔧 Service Configuration

### API Gateway Environment
```env
# Core settings
NODE_ENV=production
PORT=3000
LOG_LEVEL=info

# Database connections
DATABASE_URL=postgresql://user:pass@postgres:5432/taskcore
MONGODB_URI=mongodb://user:pass@mongodb:27017/taskcore
REDIS_URL=redis://redis:6379

# Authentication
JWT_SECRET=your-super-secret-key
JWT_EXPIRES_IN=24h

# Service URLs
AUTH_SERVICE_URL=http://auth-service:3001
PROJECT_SERVICE_URL=http://project-service:3002
# ... other services
```

### Frontend Configuration
```env
NEXT_PUBLIC_API_URL=https://api.yourdomain.com
NEXT_PUBLIC_WS_URL=wss://api.yourdomain.com
NODE_ENV=production
```

## 📊 Monitoring & Health Checks

### Health Endpoints
```bash
# Check all services
curl http://localhost/api/health

# Individual services
curl http://localhost:3000/health  # API Gateway
curl http://localhost:3001/health  # Auth Service
curl http://localhost:8888/health  # OCR Service
```

### Logging
```bash
# View service logs
docker-compose logs -f api-gateway
docker-compose logs -f web-app
docker-compose logs -f paddleocr

# In Kubernetes
kubectl logs -f deployment/api-gateway -n taskcore
```

### Metrics
- Health checks: Available on `/health` for each service
- Metrics: Prometheus-compatible endpoints on `/metrics`
- Uptime monitoring: Built-in health check intervals

## 🛡️ Security Considerations

### Production Security Checklist
- [ ] Change all default passwords and secrets
- [ ] Enable HTTPS/SSL with valid certificates
- [ ] Configure firewall rules (only expose necessary ports)
- [ ] Set up rate limiting and DDoS protection
- [ ] Enable audit logging
- [ ] Regular security updates for all dependencies
- [ ] Database connection encryption
- [ ] API key rotation policy
- [ ] File upload restrictions and scanning

### Environment Variables Security
```bash
# Use secrets management in production
# Never commit .env files to git
# Encrypt sensitive environment variables
# Use separate environments for dev/staging/prod
```

## 🔄 Backup and Recovery

### Database Backups
```bash
# PostgreSQL backup
docker exec postgres pg_dump -U taskcore taskcore > backup.sql

# MongoDB backup
docker exec mongodb mongodump --uri="mongodb://taskcore:pass@localhost/taskcore"

# Restore PostgreSQL
docker exec -i postgres psql -U taskcore taskcore < backup.sql
```

### File Storage Backup
```bash
# MinIO/S3 backup
aws s3 sync s3://taskcore-files /backup/files

# Or use MinIO client
mc mirror taskcore/taskcore-files /backup/files
```

## 🐛 Troubleshooting

### Common Issues

#### Services Not Starting
```bash
# Check logs
docker-compose logs <service-name>

# Check resource usage
docker stats

# Restart specific service
docker-compose restart <service-name>
```

#### Database Connection Issues
```bash
# Check database is running
docker-compose ps postgres mongodb

# Test connection
docker exec api-gateway npm run test:db

# Reset database
docker-compose down -v
docker-compose up -d postgres mongodb
```

#### OCR Service Issues
```bash
# Check Python dependencies
docker exec paddleocr pip list

# Test OCR endpoint
curl -X POST -F "file=@test.jpg" http://localhost:8888/ocr/extract

# Rebuild OCR service
docker-compose build paddleocr
```

### Performance Issues
```bash
# Monitor resource usage
docker stats

# Check slow queries
docker exec postgres psql -U taskcore -c "SELECT * FROM pg_stat_activity;"

# Clear Redis cache
docker exec redis redis-cli FLUSHALL
```

## 📚 Additional Resources

### Development Tools
- **Database Admin**: Connect to PostgreSQL at `localhost:5432`
- **Redis Admin**: Use Redis CLI or RedisInsight
- **MinIO Console**: Access at `http://localhost:9001`
- **API Documentation**: Available at `/api/docs` (if Swagger enabled)

### Useful Commands
```bash
# Scale services
docker-compose up -d --scale api-gateway=3

# Update single service
docker-compose build api-gateway
docker-compose up -d --no-deps api-gateway

# View service dependencies
docker-compose config

# Clean up
docker-compose down -v --remove-orphans
docker system prune -a
```

---

For additional help, see the main [README.md](README.md) or contact support.