import { logger } from './logger';

interface RedisClient {
  connect(): Promise<void>;
  disconnect(): Promise<void>;
  get(key: string): Promise<string | null>;
  set(key: string, value: string, ttl?: number): Promise<void>;
  del(key: string): Promise<void>;
  ping(): Promise<string>;
}

class MockRedisClient implements RedisClient {
  private store: Map<string, { value: string; expiry?: number }> = new Map();

  async connect(): Promise<void> {
    logger.info('Mock Redis client connected');
  }

  async disconnect(): Promise<void> {
    logger.info('Mock Redis client disconnected');
    this.store.clear();
  }

  async get(key: string): Promise<string | null> {
    const item = this.store.get(key);
    if (!item) return null;
    
    if (item.expiry && Date.now() > item.expiry) {
      this.store.delete(key);
      return null;
    }
    
    return item.value;
  }

  async set(key: string, value: string, ttl?: number): Promise<void> {
    const item: { value: string; expiry?: number } = { value };
    if (ttl) {
      item.expiry = Date.now() + (ttl * 1000);
    }
    this.store.set(key, item);
  }

  async del(key: string): Promise<void> {
    this.store.delete(key);
  }

  async ping(): Promise<string> {
    return 'PONG';
  }
}

let redisClient: RedisClient;

export async function connectRedis(): Promise<void> {
  try {
    // For now, use mock Redis client
    // In production, replace with actual Redis client
    redisClient = new MockRedisClient();
    await redisClient.connect();
    
    // Test connection
    const pong = await redisClient.ping();
    logger.info(`Redis connected: ${pong}`);
  } catch (error) {
    logger.error('Failed to connect to Redis:', error);
    throw error;
  }
}

export function getRedisClient(): RedisClient {
  if (!redisClient) {
    throw new Error('Redis client not initialized. Call connectRedis() first.');
  }
  return redisClient;
}