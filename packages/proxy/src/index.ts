import fastify from 'fastify';
import { config } from './config';
import { logger } from './logger';
import { authMiddleware } from './middleware/auth';
import { rateLimitMiddleware } from './middleware/rateLimit';
import { corsMiddleware } from './middleware/cors';
import { registerErrorHandler } from './middleware/errorHandler';
import { registerRouter } from './router';
import { registerAdminRoutes } from './routes/admin';
import { startHealthCheck } from './healthCheck';
import { startCleanupScheduler } from './logRotation';

const server = fastify({
  logger: logger as any,
  trustProxy: true,
  disableRequestLogging: true
});

async function start() {
  // Global middlewares
  server.addHook('preHandler', corsMiddleware);
  
  // Register proxy route and middlewares
  // Note: /admin has its own auth hook, so we apply proxy middleware conditionally
  server.addHook('preHandler', async (req, reply) => {
    if (req.url.startsWith('/proxy')) {
      await authMiddleware(req, reply);
      if (!reply.sent) {
        await rateLimitMiddleware(req, reply);
      }
    }
  });

  // Register Handlers
  registerErrorHandler(server);
  registerRouter(server);
  registerAdminRoutes(server);

  // Background processes
  startHealthCheck(logger);
  startCleanupScheduler(logger);

  try {
    await server.listen({ port: config.PORT, host: '0.0.0.0' });
    logger.info(`Proxy server listening on port ${config.PORT}`);
  } catch (err) {
    logger.error(err);
    process.exit(1);
  }
}

start();
