import { getRedis } from './redis';
import { KeyPool } from './keyPool';
import { classifyUpstreamError, UpstreamErrorCategory } from './errors';
import { validateToken } from './middleware';

export interface Env {
  UPSTREAM_API_KEYS: string;
  PROXY_SECRET: string;
  UPSTASH_REDIS_REST_URL: string;
  UPSTASH_REDIS_REST_TOKEN: string;
  KEY_HEADER_NAME: string;
  ROTATION_STRATEGY: string;
  COOLDOWN_MS: string;
  MAX_RETRY_ATTEMPTS: string;
  BASE_DELAY_MS: string;
  MAX_DELAY_MS: string;
  MAX_REDIS_AUDIT_ENTRIES: string;
  MAX_REDIS_ERROR_ENTRIES: string;
}

export default {
  async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
    if (request.method === 'OPTIONS') {
      return new Response(null, {
        status: 204,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        }
      });
    }

    const url = new URL(request.url);
    if (url.pathname !== '/proxy') {
      return new Response('Not Found', { status: 404 });
    }

    if (request.method !== 'POST') {
      return new Response('Method Not Allowed', { status: 405 });
    }

    const isValid = await validateToken(request, env as any);
    if (!isValid) {
      return new Response(JSON.stringify({ error: true, message: 'Unauthorized' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    let body: any;
    try {
      body = await request.clone().json();
    } catch {
      return new Response(JSON.stringify({ error: true, message: 'Invalid JSON body' }), { status: 400 });
    }

    if (!body || !body.target || !body.payload) {
      return new Response(JSON.stringify({ error: true, message: 'Missing target or payload' }), { status: 400 });
    }

    const { target, payload } = body;
    const redis = getRedis(env as any);
    
    const keys = (env.UPSTREAM_API_KEYS || '').split(',').map(k => k.trim()).filter(Boolean);
    const keyPool = new KeyPool(
      redis, 
      keys, 
      env.ROTATION_STRATEGY || 'round-robin', 
      parseInt(env.COOLDOWN_MS || '60000', 10)
    );

    const maxRetries = parseInt(env.MAX_RETRY_ATTEMPTS || '3', 10);
    const baseDelayMs = parseInt(env.BASE_DELAY_MS || '500', 10);
    const maxDelayMs = parseInt(env.MAX_DELAY_MS || '8000', 10);

    let attempts = 0;
    let finalKeyHint = '';
    let finalCategory: UpstreamErrorCategory | null = null;
    let finalStatus = 500;
    const startTs = Date.now();
    let rotated = false;
    let attemptLogs: any[] = [];

    while (attempts < maxRetries) {
      const keyState = await keyPool.getNextAvailableKey();
      if (!keyState) {
        finalCategory = 'POOL_EXHAUSTED';
        finalStatus = 503;
        break;
      }

      finalKeyHint = keyState.key.slice(-4);
      attempts++;
      if (attempts > 1) rotated = true;

      const headers = new Headers();
      headers.set('Content-Type', 'application/json');
      const headerName = env.KEY_HEADER_NAME || 'Authorization';
      if (headerName.toLowerCase() === 'authorization') {
        headers.set(headerName, `Bearer ${keyState.key}`);
      } else {
        headers.set(headerName, keyState.key);
      }

      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 30000);
        
        const res = await fetch(target, {
          method: 'POST',
          headers,
          body: JSON.stringify(payload),
          signal: controller.signal as any
        });
        clearTimeout(timeoutId);

        const category = classifyUpstreamError(res as any);
        attemptLogs.push({ attempt: attempts, keyHint: finalKeyHint, status: res.status, category });

        if (category === 'RATE_LIMITED') {
          ctx.waitUntil(keyPool.markRateLimited(keyState.key));
          await sleep(Math.min(baseDelayMs * Math.pow(2, attempts - 1), maxDelayMs));
          continue;
        }

        if (category === 'AUTH_FAILURE') {
          ctx.waitUntil(keyPool.markDead(keyState.key));
          continue;
        }

        if (category === 'UPSTREAM_SERVER') {
          await sleep(Math.min(baseDelayMs * Math.pow(2, attempts - 1), maxDelayMs));
          continue;
        }

        if (category === 'BAD_REQUEST') {
          finalStatus = res.status;
          finalCategory = category;
          ctx.waitUntil(keyPool.markSuccess(keyState.key));
          // Log asynchronously
          ctx.waitUntil(logAudit(redis, request, finalStatus, Date.now() - startTs, target, finalKeyHint, rotated, finalCategory, attemptLogs, env));
          // We can return the response directly, streams and all
          const responseHeaders = new Headers(res.headers);
          responseHeaders.set('Access-Control-Allow-Origin', '*');
          return new Response(res.body, { status: res.status, headers: responseHeaders });
        }

        if (res.ok) {
          finalStatus = res.status;
          finalCategory = null;
          ctx.waitUntil(keyPool.markSuccess(keyState.key));
          ctx.waitUntil(logAudit(redis, request, finalStatus, Date.now() - startTs, target, finalKeyHint, rotated, finalCategory, attemptLogs, env));
          const responseHeaders = new Headers(res.headers);
          responseHeaders.set('Access-Control-Allow-Origin', '*');
          return new Response(res.body, { status: res.status, headers: responseHeaders });
        }

        // Unhandled status code
        finalStatus = res.status;
        finalCategory = category;
        ctx.waitUntil(logAudit(redis, request, finalStatus, Date.now() - startTs, target, finalKeyHint, rotated, finalCategory, attemptLogs, env));
        return new Response(await res.text(), { status: res.status });
      } catch (err: any) {
        const category = classifyUpstreamError(undefined, err);
        attemptLogs.push({ attempt: attempts, keyHint: finalKeyHint, error: err.message, category });

        if (category === 'TIMEOUT' || category === 'NETWORK') {
          await sleep(Math.min(baseDelayMs * Math.pow(2, attempts - 1), maxDelayMs));
          continue;
        }

        return new Response(JSON.stringify({ error: true, message: err.message }), { status: 500 });
      }
    }

    // Exhausted
    const errorRes = {
      error: true,
      code: finalCategory === 'POOL_EXHAUSTED' ? 'POOL_EXHAUSTED' : 'MAX_RETRIES_EXCEEDED',
      message: finalCategory === 'POOL_EXHAUSTED' ? 'No healthy keys remain' : 'Upstream failed after max retries'
    };

    ctx.waitUntil(logAudit(redis, request, finalStatus, Date.now() - startTs, target, finalKeyHint, rotated, finalCategory, attemptLogs, env));

    return new Response(JSON.stringify(errorRes), { 
      status: finalStatus === 200 ? 502 : finalStatus, 
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' } 
    });
  }
};

function sleep(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function logAudit(redis: any, req: Request, status: number, latencyMs: number, target: string, keyHint: string, rotated: boolean, errorCategory: string | null, attempts: any[], env: Env) {
  const ts = new Date().toISOString();
  const clientIp = req.headers.get('cf-connecting-ip') || 'unknown';
  const url = new URL(target);
  
  const record = {
    ts,
    clientIp,
    clientToken: 'hidden',
    keyIndex: 0,
    keyHint,
    upstream: url.hostname,
    status,
    latencyMs,
    rotated,
    errorCategory,
    attempts
  };

  console.log(JSON.stringify(record));

  try {
    const score = Date.now();
    await redis.zadd('keyrote:audit', { score, member: JSON.stringify(record) });
    // Note: Upstash REST API doesn't easily pipeline ZREMRANGEBYRANK with ZADD without a pipeline object.
    // To keep it simple, we don't trim here, or we use a separate call occasionally.
  } catch (err) {
    console.error('Audit push failed', err);
  }
}
