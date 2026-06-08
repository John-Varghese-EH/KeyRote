import { z } from 'zod';
import dotenv from 'dotenv';

import path from 'path';

// Load .env from monorepo root
dotenv.config({ path: path.resolve(__dirname, '../../../.env') });

const envSchema = z.object({
  // Proxy Auth
  PROXY_SECRET: z.string().min(8, 'PROXY_SECRET must be at least 8 characters long'),
  ADMIN_SECRET: z.string().min(8, 'ADMIN_SECRET must be at least 8 characters long'),
  BASE_URL: z.string().url().optional(),

  // Upstream Keys
  UPSTREAM_API_KEYS: z
    .string()
    .min(1, 'UPSTREAM_API_KEYS is required')
    .transform((str) => str.split(',').map((k) => k.trim()).filter(Boolean)),
  KEY_HEADER_NAME: z.string().default('Authorization'),

  // Rotation
  ROTATION_STRATEGY: z.enum(['round-robin', 'least-used']).default('round-robin'),
  COOLDOWN_MS: z.coerce.number().positive().default(60000),
  MAX_RETRY_ATTEMPTS: z.coerce.number().nonnegative().default(3),
  BASE_DELAY_MS: z.coerce.number().positive().default(500),
  MAX_DELAY_MS: z.coerce.number().positive().default(8000),

  // Redis
  REDIS_URL: z.string().url(),
  MAX_REDIS_AUDIT_ENTRIES: z.coerce.number().positive().default(10000),
  MAX_REDIS_ERROR_ENTRIES: z.coerce.number().positive().default(2000),

  // Security
  ALLOWED_ORIGINS: z
    .string()
    .optional()
    .transform((str) => (str ? str.split(',').map((o) => o.trim()) : [])),
  ALLOWED_IPS: z
    .string()
    .optional()
    .transform((str) => (str ? str.split(',').map((ip) => ip.trim()) : [])),
  MAX_REQUESTS_PER_MINUTE: z.coerce.number().positive().default(60),

  // Health Checks
  HEALTH_CHECK_INTERVAL_MS: z.coerce.number().positive().default(30000),
  HEALTH_CHECK_ENDPOINT: z.string().url(),
  UPSTREAM_TIMEOUT_MS: z.coerce.number().positive().default(30000),

  // Log Rotation & Storage
  LOG_DIR: z.string().default('./logs'),
  MAX_LOG_FILE_SIZE_MB: z.coerce.number().positive().default(50),
  MAX_LOG_FILES: z.coerce.number().positive().default(7),
  MAX_LOG_AGE_DAYS: z.coerce.number().positive().default(30),
  LOG_CLEANUP_INTERVAL_MS: z.coerce.number().positive().default(3600000),

  // Alerts
  DISCORD_WEBHOOK_URL: z.union([z.string().url(), z.literal('')]).optional(),
  SLACK_WEBHOOK_URL: z.union([z.string().url(), z.literal('')]).optional(),
  ALERT_THRESHOLD: z.coerce.number().min(0).max(1).default(0.2),
  ALERT_DEBOUNCE_MS: z.coerce.number().positive().default(300000),

  // Logging
  LOG_LEVEL: z.enum(['debug', 'info', 'warn', 'error']).default('info'),
  PORT: z.coerce.number().positive().default(3000),
  NODE_ENV: z.enum(['development', 'production', 'test']).default('production'),
});

export const config = envSchema.parse(process.env);
export type Config = z.infer<typeof envSchema>;
