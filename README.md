# TaskCore - Modular Productivity & Punch List Platform

![TaskCore Logo](https://via.placeholder.com/800x200/3b82f6/white?text=TaskCore)

## 🚀 Overview

TaskCore is a comprehensive, modular productivity platform that combines the best features of **Asana** (task management), **Notion** (knowledge base), and specialized **punch list workflows** for construction, engineering, and QA teams. Built with a modern microservices architecture, TaskCore offers real-time collaboration, AI assistance, and extensive third-party integrations.

### ✨ Key Features

- **📋 Task & Project Management** - Asana-like functionality with Kanban, Timeline, Calendar, and List views
- **📚 Knowledge Base** - Notion-like pages with rich text editing and real-time collaboration
- **🔧 Punch List Module** - Construction/QA workflows with photo annotations and OCR
- **📸 Media Upload & Annotation** - Photo markup with PaddleOCR text extraction
- **🤖 Integrated AI Assistant** - Powered by Open WebUI for summaries and insights
- **🔍 Advanced Search** - Full-text search including OCR content with Elasticsearch
- **⚡ Zapier-style Integrations** - Connect to Slack, GitHub, Google Drive, Dropbox, and more
- **👥 Team Collaboration** - Role-based permissions and real-time updates
- **📱 Mobile-Friendly** - Responsive PWA with offline capabilities
- **🔌 Plugin Framework** - Extensible architecture for custom features

## 🏗️ Architecture

TaskCore follows a **microservices architecture** built with modern technologies:

### Backend Services
- **API Gateway** (Node.js/Express) - Central routing and authentication
- **Auth Service** (Node.js) - User management and authentication
- **Project Service** (Node.js) - Task and project management
- **Knowledge Service** (Node.js) - Pages and content management
- **Punch List Service** (Node.js) - Specialized QA workflows
- **Search Service** (Node.js) - Full-text search and indexing
- **Integration Service** (Node.js) - Third-party connections
- **AI Assistant** (Node.js) - AI-powered features
- **PaddleOCR Service** (Python/Flask) - Image text extraction

### Frontend
- **Web App** (Next.js 14/React/TypeScript) - Modern, responsive interface
- **Real-time Updates** (Socket.IO) - Live collaboration features
- **Rich Text Editor** (Tiptap) - Notion-like editing experience
- **Image Annotation** (Konva.js) - Photo markup capabilities

### Databases & Storage
- **PostgreSQL** - User data, projects, tasks, and structured data
- **MongoDB** - Documents, images, OCR content, and unstructured data
- **Redis** - Caching and real-time session management
- **Elasticsearch** - Full-text search and analytics
- **MinIO/S3** - File storage and media assets

### Infrastructure
- **Docker & Docker Compose** - Containerized deployment
- **Nginx** - Reverse proxy and load balancing
- **Kubernetes** - Production orchestration (optional)

## 🚀 Quick Start

### Prerequisites
- **Docker** and **Docker Compose**
- **Node.js 18+** (for development)
- **Git**

### 1. Clone the Repository
```bash
git clone https://github.com/your-org/taskcore.git
cd taskcore
```

### 2. Environment Setup
```bash
# Copy environment template
cp .env.example .env

# Edit environment variables
nano .env
```

### 3. Start with Docker Compose
```bash
# Install dependencies
npm install

# Start all services
npm run docker:up

# Or run setup script
npm run setup
```

### 4. Access the Application
- **Web App**: http://localhost:80
- **API Gateway**: http://localhost:3000
- **API Health**: http://localhost:3000/health
- **MinIO Console**: http://localhost:9001

### 5. Development Mode
```bash
# Start individual services for development
npm run dev
```

## 📁 Project Structure

```
taskcore/
├── apps/
│   └── web/                 # Next.js web application
├── services/
│   ├── api-gateway/         # Main API gateway
│   ├── auth/                # Authentication service
│   ├── projects/            # Project & task management
│   ├── knowledge/           # Knowledge base service
│   ├── punch-list/          # Punch list workflows
│   ├── search/              # Search & indexing
│   ├── integrations/        # Third-party integrations
│   ├── ai-assistant/        # AI-powered features
│   └── paddleocr/           # OCR service (Python)
├── packages/
│   └── shared/              # Shared types & utilities
├── nginx/                   # Reverse proxy configuration
├── scripts/                 # Database initialization
├── docker-compose.yml       # Service orchestration
├── turbo.json              # Monorepo build configuration
└── package.json            # Root workspace configuration
```

## 🛠️ Development

### Prerequisites for Development
```bash
# Install Node.js dependencies
npm install

# Install Python dependencies (for OCR service)
cd services/paddleocr
pip install -r requirements.txt
```

### Running Services Individually

```bash
# API Gateway
npm run dev --workspace=@taskcore/api-gateway

# Web Application
npm run dev --workspace=@taskcore/web

# OCR Service
cd services/paddleocr
python app.py
```

### Building the Project
```bash
# Build all packages
npm run build

# Build specific service
npm run build --workspace=@taskcore/web
```

### Database Management
```bash
# Run database migrations
npm run db:migrate

# Seed development data
npm run db:seed

# Reset database
npm run db:reset
```

## 🔧 Configuration

### Environment Variables

Create a `.env` file in the root directory:

```env
# Database Configuration
DATABASE_URL=postgresql://taskcore:taskcore_dev@postgres:5432/taskcore
MONGODB_URI=mongodb://taskcore:taskcore_dev@mongodb:27017/taskcore
REDIS_URL=redis://redis:6379
ELASTICSEARCH_URL=http://elasticsearch:9200

# Authentication
JWT_SECRET=your_jwt_secret_here
JWT_EXPIRES_IN=24h

# File Storage
MINIO_ENDPOINT=minio:9000
MINIO_ACCESS_KEY=taskcore
MINIO_SECRET_KEY=taskcore_dev

# External Services
OPENAI_API_KEY=your_openai_key_here
SLACK_BOT_TOKEN=your_slack_token_here
GITHUB_TOKEN=your_github_token_here

# Frontend
NEXT_PUBLIC_API_URL=http://localhost/api
NEXT_PUBLIC_WS_URL=ws://localhost

# Production Settings
NODE_ENV=development
LOG_LEVEL=info
```

### Service Configuration

Each service can be configured through environment variables or configuration files. See individual service documentation for details.

## 📚 API Documentation

### Core Endpoints

- **Authentication**: `/api/auth/*`
- **Users**: `/api/users/*`
- **Organizations**: `/api/organizations/*`
- **Projects**: `/api/projects/*`
- **Tasks**: `/api/tasks/*`
- **Knowledge Base**: `/api/knowledge/*`
- **Punch Lists**: `/api/punch-lists/*`
- **Search**: `/api/search/*`
- **Integrations**: `/api/integrations/*`
- **AI Assistant**: `/api/ai-assistant/*`
- **Files**: `/api/files/*`

### API Examples

```bash
# Get user profile
curl -H "Authorization: Bearer $TOKEN" \
  http://localhost/api/users/me

# Create a project
curl -X POST \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"name":"My Project","description":"Project description"}' \
  http://localhost/api/projects

# Upload and extract text from image
curl -X POST \
  -H "Authorization: Bearer $TOKEN" \
  -F "file=@image.jpg" \
  http://localhost/api/punch-lists/ocr/extract
```

## 🔌 Integrations

TaskCore supports extensive third-party integrations:

### Supported Platforms
- **Slack** - Notifications and team communication
- **GitHub** - Issue tracking and code repository integration
- **Google Drive** - File storage and document management
- **Dropbox** - Cloud file synchronization
- **OneDrive** - Microsoft cloud storage
- **Trello** - Task board synchronization
- **Jira** - Enterprise project management
- **Email** - SMTP notifications
- **Calendar** - Event and deadline integration
- **Webhooks** - Custom integrations

### Setting Up Integrations

1. Navigate to **Settings > Integrations**
2. Select the desired platform
3. Authorize the connection
4. Configure automation rules

## 🤖 AI Features

TaskCore includes an integrated AI assistant powered by Open WebUI:

### Capabilities
- **Task Summarization** - Automatic project and task summaries
- **Intelligent Search** - Natural language search across all content
- **Content Generation** - Draft tasks, pages, and documentation
- **Project Analytics** - Insights and recommendations
- **OCR Enhancement** - Improve text extraction accuracy

### Usage Examples
```javascript
// Ask AI for project summary
POST /api/ai-assistant/chat
{
  "message": "Summarize the current status of Project Alpha",
  "context": "project",
  "projectId": "uuid"
}

// Search with natural language
POST /api/ai-assistant/search
{
  "query": "Find all overdue tasks assigned to John",
  "filters": {
    "type": "tasks"
  }
}
```

## 📸 Punch List Features

The punch list module is designed for construction, engineering, and QA workflows:

### Key Features
- **Photo Upload** - High-resolution image capture
- **Annotation Tools** - Arrows, circles, text, measurements
- **OCR Integration** - Automatic text extraction using PaddleOCR
- **Location Tracking** - GPS coordinates and building references
- **Reference Documents** - Link to drawings, specifications, manuals
- **Approval Workflows** - Multi-stage review and verification
- **Progress Tracking** - Status updates and completion metrics

### Workflow Example
1. **Create Punch List** - Define scope and location
2. **Add Items** - Upload photos and describe issues
3. **Annotate** - Mark specific areas and add measurements
4. **Extract Text** - Automatic OCR processing
5. **Assign** - Delegate to responsible parties
6. **Track Progress** - Monitor completion status
7. **Verify** - Final approval and sign-off

## 🏢 Deployment

### Production Deployment with Docker

```bash
# Production build
docker-compose -f docker-compose.prod.yml up -d

# With Kubernetes
kubectl apply -f k8s/
```

### Environment-Specific Configurations

- **Development**: Full logging, hot reloading
- **Staging**: Production-like with debugging
- **Production**: Optimized, secure, monitored

### Monitoring & Health Checks

- **Health Endpoints**: `/health` on each service
- **Metrics**: Prometheus-compatible endpoints
- **Logs**: Structured JSON logging
- **Alerts**: Integration with monitoring systems

## 🔒 Security

### Security Features
- **JWT Authentication** - Secure token-based auth
- **Role-Based Access Control** - Granular permissions
- **API Rate Limiting** - DDoS protection
- **Input Validation** - Request sanitization
- **HTTPS Enforcement** - SSL/TLS encryption
- **Security Headers** - XSS, CSRF protection
- **Audit Logging** - Activity tracking

### Best Practices
- Regular security updates
- Environment variable encryption
- Database connection security
- File upload restrictions
- API key rotation

## 🧪 Testing

### Running Tests
```bash
# Run all tests
npm test

# Run tests for specific service
npm test --workspace=@taskcore/api-gateway

# Run integration tests
npm run test:integration

# Run e2e tests
npm run test:e2e
```

### Test Coverage
- **Unit Tests** - Individual component testing
- **Integration Tests** - Service interaction testing
- **E2E Tests** - Full workflow testing
- **API Tests** - Endpoint validation

## 📈 Performance

### Optimization Features
- **Caching Strategy** - Redis for session and data caching
- **Database Indexing** - Optimized query performance
- **Image Optimization** - Automatic compression and resizing
- **CDN Integration** - Fast static asset delivery
- **Lazy Loading** - On-demand content loading
- **Background Jobs** - Async processing for heavy tasks

### Monitoring
- Response time tracking
- Database query optimization
- Memory usage monitoring
- API performance metrics

## 🤝 Contributing

We welcome contributions! Please read our [Contributing Guide](CONTRIBUTING.md) for details.

### Development Workflow
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Submit a pull request

### Code Standards
- **TypeScript** - Type-safe development
- **ESLint** - Code quality enforcement
- **Prettier** - Consistent formatting
- **Conventional Commits** - Standardized commit messages

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

### Getting Help
- **Documentation**: [docs.taskcore.com](https://docs.taskcore.com)
- **GitHub Issues**: [Report bugs or request features](https://github.com/your-org/taskcore/issues)
- **Discord Community**: [Join our Discord](https://discord.gg/taskcore)
- **Email Support**: support@taskcore.com

### Commercial Support
For enterprise deployments and commercial support, contact us at enterprise@taskcore.com.

## 🗺️ Roadmap

### Upcoming Features
- [ ] Mobile applications (iOS/Android)
- [ ] Advanced analytics dashboard
- [ ] Custom field types
- [ ] Workflow automation builder
- [ ] Advanced reporting
- [ ] Third-party plugin marketplace
- [ ] Multi-language support
- [ ] Advanced permission system
- [ ] Data export/import tools
- [ ] Integration with more platforms

### Version History
- **v1.0.0** - Initial release with core features
- **v1.1.0** - Enhanced AI integration
- **v1.2.0** - Advanced punch list features
- **v2.0.0** - Mobile applications (planned)

---

**TaskCore** - Transforming productivity, one task at a time. 🚀