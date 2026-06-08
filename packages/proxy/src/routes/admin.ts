import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { errorStore } from '../errorStore';
import { keyPool } from '../keyPool';
import { config } from '../config';
import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { redis } from '../redis';

export function registerAdminRoutes(fastify: FastifyInstance) {
  // Admin Auth Middleware
  fastify.addHook('preHandler', async (request: FastifyRequest, reply: FastifyReply) => {
    // Only apply to /admin routes
    if (!request.url.startsWith('/admin')) return;

    const authHeader = request.headers['authorization'];
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return reply.status(401).send();
    }
    
    const token = authHeader.substring(7);
    const tokenBuf = Buffer.from(token);
    const secretBuf = Buffer.from(config.ADMIN_SECRET);

    if (tokenBuf.length !== secretBuf.length || !crypto.timingSafeEqual(tokenBuf, secretBuf)) {
      return reply.status(401).send();
    }
  });

  // GET /admin/errors
  fastify.get('/admin/errors', async (request, reply) => {
    const query = request.query as any;
    
    const category = query.category;
    const fromMs = query.from ? parseInt(query.from) : undefined;
    const toMs = query.to ? parseInt(query.to) : undefined;
    let resolved = undefined;
    if (query.resolved === 'true') resolved = true;
    if (query.resolved === 'false') resolved = false;

    const page = query.page ? parseInt(query.page) : 1;
    const limit = query.limit ? parseInt(query.limit) : 50;
    const offset = (page - 1) * limit;

    const result = await errorStore.getErrors({ category, fromMs, toMs, resolved, offset, limit });
    return reply.send({ ...result, page, limit });
  });

  // GET /admin/errors/:id
  fastify.get('/admin/errors/:id', async (request, reply) => {
    const { id } = request.params as { id: string };
    // This is O(N) but the set is small
    const result = await errorStore.getErrors({ limit: config.MAX_REDIS_ERROR_ENTRIES });
    const entry = result.items.find(e => e.id === id);
    if (!entry) {
      return reply.status(404).send({ error: true, message: 'Error not found' });
    }
    return reply.send(entry);
  });

  // PATCH /admin/errors/:id/resolve
  fastify.patch('/admin/errors/:id/resolve', async (request, reply) => {
    const { id } = request.params as { id: string };
    const success = await errorStore.markResolved(id);
    if (!success) {
      return reply.status(404).send({ error: true, message: 'Error not found or already resolved' });
    }
    return reply.send({ success: true });
  });

  // DELETE /admin/errors
  fastify.delete('/admin/errors', async (request, reply) => {
    // Requires ADMIN_SECRET header as second factor, but they already authenticated with it.
    // The spec says "requires ADMIN_SECRET header as second factor". We can check `x-admin-secret` if we want strict adherence.
    const secondFactor = request.headers['x-admin-secret'];
    if (secondFactor !== config.ADMIN_SECRET) {
      return reply.status(401).send({ error: true, message: 'Missing or invalid x-admin-secret header for destructive operation' });
    }
    await errorStore.flushAll();
    return reply.send({ success: true });
  });

  // GET /admin/logs/status
  fastify.get('/admin/logs/status', async (request, reply) => {
    let fileCount = 0;
    let totalSizeMb = 0;
    let oldestFile = null;
    let newestFile = null;

    if (fs.existsSync(config.LOG_DIR)) {
      const files = fs.readdirSync(config.LOG_DIR).filter(f => f.startsWith('audit') && f.endsWith('.log'));
      fileCount = files.length;
      let oldestTime = Infinity;
      let newestTime = 0;

      for (const file of files) {
        const stats = fs.statSync(path.join(config.LOG_DIR, file));
        totalSizeMb += stats.size / (1024 * 1024);
        if (stats.mtimeMs < oldestTime) oldestTime = stats.mtimeMs;
        if (stats.mtimeMs > newestTime) newestTime = stats.mtimeMs;
      }

      if (fileCount > 0) {
        oldestFile = new Date(oldestTime).toISOString();
        newestFile = new Date(newestTime).toISOString();
      }
    }

    const redisAuditCount = await redis.zcard('keyrote:audit');
    const redisErrorCount = await redis.zcard('keyrote:errors');

    return reply.send({
      fileCount,
      totalSizeMb: parseFloat(totalSizeMb.toFixed(2)),
      oldestFile,
      newestFile,
      redisAuditCount,
      redisErrorCount
    });
  });

  // GET /admin/health
  fastify.get('/admin/health', async (request, reply) => {
    const health = await keyPool.getPoolHealth();
    return reply.send(health);
  });
}
