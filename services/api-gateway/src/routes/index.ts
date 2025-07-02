import { Express } from 'express';
import { authMiddleware } from '../middleware/auth';

export function setupRoutes(app: Express): void {
  // Health and status routes
  app.get('/api/health', (req, res) => {
    res.json({
      success: true,
      data: {
        status: 'healthy',
        timestamp: new Date().toISOString(),
        services: {
          auth: 'healthy',
          projects: 'healthy',
          knowledge: 'healthy',
          punchlist: 'healthy',
          search: 'healthy',
          integrations: 'healthy',
          ai: 'healthy'
        }
      }
    });
  });

  // API version info
  app.get('/api', (req, res) => {
    res.json({
      success: true,
      data: {
        name: 'TaskCore API Gateway',
        version: '1.0.0',
        endpoints: [
          '/api/auth',
          '/api/users',
          '/api/organizations',
          '/api/projects',
          '/api/tasks',
          '/api/knowledge',
          '/api/punch-lists',
          '/api/search',
          '/api/integrations',
          '/api/ai-assistant',
          '/api/files'
        ]
      }
    });
  });

  // Service proxy routes (these would proxy to microservices)
  app.use('/api/auth', createServiceProxy('http://auth-service:3001'));
  app.use('/api/users', authMiddleware, createServiceProxy('http://auth-service:3001'));
  app.use('/api/organizations', authMiddleware, createServiceProxy('http://auth-service:3001'));
  app.use('/api/projects', authMiddleware, createServiceProxy('http://project-service:3002'));
  app.use('/api/tasks', authMiddleware, createServiceProxy('http://project-service:3002'));
  app.use('/api/knowledge', authMiddleware, createServiceProxy('http://knowledge-service:3003'));
  app.use('/api/punch-lists', authMiddleware, createServiceProxy('http://punch-list-service:3004'));
  app.use('/api/search', authMiddleware, createServiceProxy('http://search-service:3005'));
  app.use('/api/integrations', authMiddleware, createServiceProxy('http://integration-service:3006'));
  app.use('/api/ai-assistant', authMiddleware, createServiceProxy('http://ai-assistant:3007'));
  app.use('/api/files', authMiddleware, createServiceProxy('http://punch-list-service:3004'));
}

// Mock service proxy for development
function createServiceProxy(target: string) {
  return (req: any, res: any) => {
    // For now, return a mock response
    // In production, this would use http-proxy-middleware
    res.json({
      success: true,
      data: {
        message: `Mock response from ${target}`,
        method: req.method,
        path: req.path,
        query: req.query,
        body: req.body
      }
    });
  };
}