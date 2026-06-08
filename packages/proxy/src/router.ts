import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { keyPool, KeyState } from './keyPool';
import { classifyUpstreamError, UpstreamErrorCategory } from './errors';
import { config } from './config';
import { auditLog } from './audit';
import crypto from 'crypto';

interface ProxyPayload {
  target: string;
  payload: any;
}

export function registerRouter(fastify: FastifyInstance) {
  fastify.post('/proxy', async (request: FastifyRequest, reply: FastifyReply) => {
    const body = request.body as ProxyPayload;
    if (!body || !body.target || !body.payload) {
      return reply.status(400).send({ error: true, message: 'Missing target or payload' });
    }

    const { target, payload } = body;
    let attempts = 0;
    let finalKey: KeyState | null = null;
    let finalStatus = 500;
    let finalCategory: UpstreamErrorCategory | null = null;
    let startTs = Date.now();
    let rotated = false;
    let attemptLogs: any[] = [];
    
    const clientIp = request.ip;
    const authHeader = request.headers['authorization'] || '';
    const clientTokenHash = authHeader.startsWith('Bearer ') 
      ? 'sha256:' + crypto.createHash('sha256').update(authHeader.substring(7)).digest('hex')
      : 'unknown';

    while (attempts < config.MAX_RETRY_ATTEMPTS) {
      const keyState = await keyPool.getNextAvailableKey();
      
      if (!keyState) {
        finalCategory = 'POOL_EXHAUSTED';
        finalStatus = 503;
        request.log.error('POOL_EXHAUSTED: No healthy keys remain');
        // Alerts module handles POOL_EXHAUSTED in health check but we should also fire here if we want
        // Wait, specification says: "Also fire immediately on POOL_EXHAUSTED — bypass the debounce timer"
        // Let's rely on health check or we can import alerts.
        const { alerts } = require('./alerts');
        const health = await keyPool.getPoolHealth();
        alerts.fireAlert('POOL_EXHAUSTED', {
          healthyKeys: 0,
          totalKeys: health.totalKeyCount,
          instanceId: process.env.HOSTNAME || 'unknown',
          ts: new Date().toISOString()
        }, true);
        
        reply.status(503).send({ error: true, code: 'POOL_EXHAUSTED', message: 'No upstream keys available' });
        break; // escape while loop
      }

      finalKey = keyState;
      attempts++;
      
      if (attempts > 1) {
        rotated = true;
      }

      const headers: Record<string, string> = {
        'Content-Type': 'application/json'
      };
      
      if (config.KEY_HEADER_NAME.toLowerCase() === 'authorization') {
        headers['Authorization'] = `Bearer ${keyState.key}`;
      } else {
        headers[config.KEY_HEADER_NAME] = keyState.key;
      }

      // We use Undici (Node 18+ fetch) for simplicity and performance
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), config.UPSTREAM_TIMEOUT_MS);

      try {
        const fetchStart = Date.now();
        const res = await fetch(target, {
          method: 'POST',
          headers,
          body: JSON.stringify(payload),
          signal: controller.signal
        });
        clearTimeout(timeoutId);

        const category = classifyUpstreamError(res);
        attemptLogs.push({ attempt: attempts, keyHint: keyState.key.slice(-4), status: res.status, category });

        if (category === 'RATE_LIMITED') {
          await keyPool.markRateLimited(keyState.key);
          await sleepWithBackoff(attempts);
          continue;
        }

        if (category === 'AUTH_FAILURE') {
          await keyPool.markDead(keyState.key);
          const { alerts } = require('./alerts');
          const health = await keyPool.getPoolHealth();
          alerts.fireAlert('AUTH_FAILURE', {
            healthyKeys: health.healthyKeyCount,
            totalKeys: health.totalKeyCount,
            instanceId: process.env.HOSTNAME || 'unknown',
            ts: new Date().toISOString()
          }, false);
          continue;
        }

        if (category === 'UPSTREAM_SERVER') {
          await sleepWithBackoff(attempts);
          continue; // Will retry with same or next key depending on getNextAvailableKey
        }

        if (category === 'BAD_REQUEST') {
          finalStatus = res.status;
          finalCategory = category;
          // Send back immediately without rotation
          const errorBody = await res.text();
          reply.status(res.status).send(errorBody); // Send raw
          await keyPool.markSuccess(keyState.key); // It's a client error, key is fine
          break;
        }

        // Success or unknown/malformed success
        if (res.ok) {
          finalStatus = res.status;
          finalCategory = null;
          await keyPool.markSuccess(keyState.key);
          
          // Stream response back
          reply.status(res.status);
          for (const [key, value] of res.headers.entries()) {
            reply.header(key, value);
          }
          
          if (res.body) {
            // Using fastify's reply.send with a stream
            // Need to convert Node Web Stream to Node Readable, or just send text if it's not actually streaming
            // Actually, in fastify 4, you can reply.send() a readable stream. 
            // Web Streams (res.body) are supported in modern Fastify but require conversion if needed.
            // Let's use standard text for simple payloads, or stream if it's SSE.
            // For LLMs, streaming is common. Node's Response.body is a ReadableStream.
            const { Readable } = require('stream');
            reply.send(Readable.fromWeb(res.body as any));
          } else {
            reply.send();
          }
          break;
        } else {
          // Unhandled status code
          finalStatus = res.status;
          finalCategory = category;
          const errorBody = await res.text();
          reply.status(res.status).send(errorBody);
          break;
        }
      } catch (err: any) {
        clearTimeout(timeoutId);
        const category = classifyUpstreamError(undefined, err);
        attemptLogs.push({ attempt: attempts, keyHint: keyState.key.slice(-4), error: err.message, category });

        if (category === 'TIMEOUT' || category === 'NETWORK') {
          await sleepWithBackoff(attempts);
          continue;
        }

        // Throw for global error handler if unknown
        throw err;
      }
    }

    // After while loop finishes
    if (finalKey && attempts >= config.MAX_RETRY_ATTEMPTS && finalCategory !== 'BAD_REQUEST' && finalStatus >= 500) {
      reply.status(502).send({ error: true, code: 'MAX_RETRIES_EXCEEDED', message: 'Upstream failed after max retries' });
    }

    // Write audit log
    if (finalKey) {
       auditLog({
         ts: new Date().toISOString(),
         clientIp,
         clientToken: clientTokenHash,
         keyIndex: 0, // not explicitly indexed, use key hint
         keyHint: finalKey.key.slice(-4),
         upstream: new URL(target).hostname,
         status: finalStatus,
         latencyMs: Date.now() - startTs,
         rotated,
         errorCategory: finalCategory,
         attempts: attemptLogs
       });
    }
  });
}

function sleepWithBackoff(attempt: number): Promise<void> {
  const delay = Math.min(config.BASE_DELAY_MS * Math.pow(2, attempt - 1), config.MAX_DELAY_MS);
  return new Promise(resolve => setTimeout(resolve, delay));
}
