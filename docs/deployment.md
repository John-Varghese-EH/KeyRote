# Deployment

## Docker (Self-Hosted)
This is the recommended deployment method. It ensures Redis and the Node.js proxy are co-located in the same network for minimal latency.

1. Ensure Docker and Docker Compose are installed.
2. Edit `.env` with your API keys and webhook URLs.
3. Run `docker-compose up -d --build`.

**Note:** Redis is configured with `maxmemory-policy allkeys-lru` to ensure it automatically evicts stale state if memory limits are reached.

## Cloudflare Workers (Future)
*Scaffolding planned for future release in `packages/worker/`.*

## Vercel/Railway/Render
1. Provision a managed Redis instance (e.g. Upstash).
2. Set the `REDIS_URL` environment variable.
3. Deploy the `packages/proxy` directory, setting the build command to `pnpm run build` and start command to `pnpm run start`.
