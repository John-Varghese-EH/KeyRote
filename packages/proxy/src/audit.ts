import { logger } from './logger';
import { redis } from './redis';
import { config } from './config';

export interface AuditRecord {
  ts: string;
  clientIp: string;
  clientToken: string;
  keyIndex: number;
  keyHint: string;
  upstream: string;
  status: number;
  latencyMs: number;
  rotated: boolean;
  errorCategory: string | null;
  attempts?: any[];
}

const AUDIT_STORE_KEY = 'keyrote:audit';

export async function auditLog(record: AuditRecord): Promise<void> {
  // 1. Log to rotating file
  logger.info(record, 'audit');

  // 2. Log to Redis ZSET for fast admin querying
  const score = new Date(record.ts).getTime();
  const member = JSON.stringify(record);

  try {
    const multi = redis.multi();
    multi.zadd(AUDIT_STORE_KEY, score, member);
    multi.zremrangebyrank(AUDIT_STORE_KEY, 0, -(config.MAX_REDIS_AUDIT_ENTRIES + 1));
    await multi.exec();
  } catch (err) {
    logger.error({ err }, 'Failed to write audit to Redis');
  }
}
