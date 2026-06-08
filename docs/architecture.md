# KeyRote Architecture

## High Level Overview

KeyRote sits between your application and upstream LLM providers (OpenAI, Gemini).
1. **Client** sends request with `Authorization: Bearer <PROXY_SECRET>`.
2. **KeyRote** validates the token, rate limits the client using Redis, and routes the request to the upstream target.
3. If KeyRote hits a `429 Too Many Requests`, it immediately rotates the key and retries seamlessly.

## Components

- **Proxy Core**: Fastify Node.js server. Streaming optimized.
- **KeyPool**: Redis-backed state manager holding usage counts and cooldown timers for every configured API key.
- **Error Store**: Redis ZSET storing up to 2000 non-quota errors (500s, 401s).
- **Log Rotation**: Pino logging to disk with automatic compression and deletion after 30 days.
- **Admin API**: `GET /admin/errors`, `GET /admin/health` to monitor the proxy status.
