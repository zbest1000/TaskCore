import { Server } from 'socket.io';
import { logger } from '../utils/logger';

interface AuthenticatedSocket {
  userId?: string;
  organizationId?: string;
  projectIds?: string[];
}

export function setupWebSocket(io: Server): void {
  // Authentication middleware for Socket.IO
  io.use((socket: any, next) => {
    try {
      const token = socket.handshake.auth.token;
      
      if (!token) {
        return next(new Error('Authentication error'));
      }

      // Mock authentication - in production, verify JWT token
      const user = {
        userId: 'mock-user-id',
        organizationId: 'mock-org-id',
        projectIds: ['mock-project-id']
      };

      (socket as any).user = user;
      next();
    } catch (error) {
      next(new Error('Authentication error'));
    }
  });

  io.on('connection', (socket: any) => {
    const user = socket.user as AuthenticatedSocket;
    logger.info(`User ${user.userId} connected via WebSocket`);

    // Join user to their organization and project rooms
    if (user.organizationId) {
      socket.join(`org:${user.organizationId}`);
    }

    if (user.projectIds) {
      user.projectIds.forEach(projectId => {
        socket.join(`project:${projectId}`);
      });
    }

    // Handle real-time events
    socket.on('join_project', (projectId: string) => {
      socket.join(`project:${projectId}`);
      logger.info(`User ${user.userId} joined project ${projectId}`);
    });

    socket.on('leave_project', (projectId: string) => {
      socket.leave(`project:${projectId}`);
      logger.info(`User ${user.userId} left project ${projectId}`);
    });

    socket.on('task_update', (data: any) => {
      // Broadcast task updates to project members
      socket.to(`project:${data.projectId}`).emit('task_updated', {
        ...data,
        updatedBy: user.userId,
        timestamp: new Date()
      });
    });

    socket.on('comment_added', (data: any) => {
      // Broadcast new comments
      socket.to(`project:${data.projectId}`).emit('comment_added', {
        ...data,
        authorId: user.userId,
        timestamp: new Date()
      });
    });

    socket.on('typing_start', (data: any) => {
      socket.to(`project:${data.projectId}`).emit('user_typing', {
        userId: user.userId,
        taskId: data.taskId,
        isTyping: true
      });
    });

    socket.on('typing_stop', (data: any) => {
      socket.to(`project:${data.projectId}`).emit('user_typing', {
        userId: user.userId,
        taskId: data.taskId,
        isTyping: false
      });
    });

    socket.on('disconnect', () => {
      logger.info(`User ${user.userId} disconnected from WebSocket`);
    });
  });

  // Broadcast system events
  setInterval(() => {
    io.emit('system_heartbeat', {
      timestamp: new Date(),
      connectedUsers: io.sockets.sockets.size
    });
  }, 30000); // Every 30 seconds
}