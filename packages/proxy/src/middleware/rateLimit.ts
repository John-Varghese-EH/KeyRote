import { FastifyRequest, FastifyReply } from 'fastify';
import { config } from '../config';
import { redis } from '../redis';
import crypto from 'crypto';

/**
 * Per-client-token rate limit using Redis sliding-window.
 * Extracts the token hash to identify the client, or IP if token is not available
 * (though auth middleware should guarantee token is present if chained properly).
 */
export async function rateLimitMiddleware(request: FastifyRequest, reply: FastifyReply) {
  const authHeader = request.headers['authorization'];
  
  // Use a hash of the token as the identifier, fallback to IP
  let identifier = request.ip;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.substring(7);
    identifier = crypto.createHash('sha256').update(token).digest('hex');
  }

  const now = Date.now();
  const windowMs = 60000; // 1 minute window
  const key = `keyrote:ratelimit:${identifier}`;
  const clearBefore = now - windowMs;

  // Sliding window using Redis Sorted Sets
  const multi = redis.multi();
  multi.zremrangebyscore(key, 0, clearBefore);
  multi.zadd(key, now, `${now}-${Math.random()}`);
  multi.zcard(key);
  multi.pexpire(key, windowMs); // Set TTL so keys don't linger
  
  const results = await multi.exec();
  if (!results) {
    // If Redis pipeline fails, we allow the request but log error
    request.log.error('Redis multi execution failed in rateLimit');
    return;
  }

  // The 3rd command in the pipeline (zcard) returns the number of requests in the window
  const requestCount = results[2][1] as number;

  if (requestCount > config.MAX_REQUESTS_PER_MINUTE) {
    // Rate limit exceeded
    reply.header('Retry-After', '60');
    return reply.status(429).send({ error: true, message: 'Rate limit exceeded' });
  }
}
