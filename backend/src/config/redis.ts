import { Redis } from 'ioredis';

const redisUrl = process.env.REDIS_URL || 'redis://localhost:6379';

// We use maxRetriesPerRequest: null for BullMQ compatibility
export const redisConnection = new Redis(redisUrl, {
  maxRetriesPerRequest: null,
});

redisConnection.on('error', (err) => {
  console.warn('Redis Connection Error (Mocking execution if Redis is not running)', err.message);
});
