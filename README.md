# KeyRote - API Key Rotation & Load Balancer Proxy

KeyRote is an open-source, enterprise-grade API Key Rotation & Load Balancer Proxy. It transparently rotates upstream API keys (e.g., Gemini, OpenAI) when `429` rate limits are hit, presenting a single stable endpoint to any client.

## Features
- **Intelligent Rotation:** Round-robin or least-used strategies.
- **Resilient State:** Cooldowns and key health persist across restarts using Redis.
- **Security:** Bearer token authentication, per-client Redis-backed sliding window rate limiting, and configurable CORS/IP filtering.
- **High-Performance Logging:** Automated log rotation with Pino-roll, structured JSON logging.
- **Admin & Monitoring:** Full admin API to query errors, clear queues, and check proxy health.
- **Alerting:** Webhook integrations for Slack and Discord when key pools are low or exhausted.

## Architecture
See [Architecture Document](./docs/architecture.md)

## Quickstart (Docker)

1. Clone the repository and copy the environment template:
   ```bash
   cp .env.example .env
   ```
2. Configure your `PROXY_SECRET`, `ADMIN_SECRET`, and `UPSTREAM_API_KEYS` in `.env`.
3. Bring up the stack:
   ```bash
   docker-compose up -d
   ```

## Usage Example

Send a request to the proxy exactly as you would to the upstream API:

```bash
curl -X POST http://localhost:3000/proxy \
  -H "Authorization: Bearer <YOUR_PROXY_SECRET>" \
  -H "Content-Type: application/json" \
  -d '{
    "target": "https://api.openai.com/v1/chat/completions",
    "payload": {
      "model": "gpt-4",
      "messages": [{"role": "user", "content": "Hello"}]
    }
  }'
```

## Deployment Guides
See [Deployment Document](./docs/deployment.md)

## Environment Variables
See the comprehensive `.env.example` file included in the repository.

---
**License**: MIT  
**Author**: John Varghese (J0X) <https://github.com/John-Varghese-EH>  
**LinkedIn**: [/in/John--Varghese](https://linkedin.com/in/John--Varghese)
