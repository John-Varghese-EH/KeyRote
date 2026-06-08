import { redis } from './redis';
import { config } from './config';
import crypto from 'crypto';

export interface ErrorEntry {
  id: string;
  ts: string;
  category: string;
  httpStatus: number;
  upstream: string;
  keyHint: string;
  message: string;
  requestId: string;
  clientToken: string;
  resolved: boolean;
}

const ERROR_STORE_KEY = 'keyrote:errors';

export const errorStore = {
  /**
   * Pushes a new error to the ZSET and trims the set to MAX_REDIS_ERROR_ENTRIES.
   */
  async pushError(entry: Omit<ErrorEntry, 'id' | 'ts' | 'resolved'>): Promise<void> {
    const id = crypto.randomUUID();
    const ts = new Date().toISOString();
    
    const fullEntry: ErrorEntry = {
      ...entry,
      id,
      ts,
      resolved: false,
    };

    const score = Date.now();
    const member = JSON.stringify(fullEntry);

    const multi = redis.multi();
    multi.zadd(ERROR_STORE_KEY, score, member);
    // Trim to keep only the newest MAX_REDIS_ERROR_ENTRIES
    // Removing ranks 0 to -(MAX_REDIS_ERROR_ENTRIES + 1)
    multi.zremrangebyrank(ERROR_STORE_KEY, 0, -(config.MAX_REDIS_ERROR_ENTRIES + 1));
    await multi.exec();
  },

  /**
   * Retrieves errors, optionally filtered by time range and category.
   * Returns them in descending order (newest first).
   */
  async getErrors(options: {
    category?: string;
    fromMs?: number;
    toMs?: number;
    resolved?: boolean;
    offset?: number;
    limit?: number;
  } = {}) {
    const min = options.fromMs ? options.fromMs.toString() : '-inf';
    const max = options.toMs ? options.toMs.toString() : '+inf';

    // Get all members in the range (we may fetch more than limit if filtering is done in memory)
    // ZREVRANGEBYSCORE gets descending
    const members = await redis.zrevrangebyscore(ERROR_STORE_KEY, max, min);

    let parsed: ErrorEntry[] = members.map(m => JSON.parse(m));

    if (options.category) {
      parsed = parsed.filter(e => e.category === options.category);
    }
    if (options.resolved !== undefined) {
      parsed = parsed.filter(e => e.resolved === options.resolved);
    }

    const total = parsed.length;
    
    const offset = options.offset || 0;
    const limit = options.limit || 50;
    const items = parsed.slice(offset, offset + limit);

    return { total, items };
  },

  /**
   * Marks a specific error as resolved.
   */
  async markResolved(id: string): Promise<boolean> {
    // This is an O(N) operation over the sorted set, but manageable for <= 2000 entries.
    const members = await redis.zrange(ERROR_STORE_KEY, 0, -1);
    
    for (const member of members) {
      const entry: ErrorEntry = JSON.parse(member);
      if (entry.id === id && !entry.resolved) {
        // Remove old member and add new one
        entry.resolved = true;
        const newMember = JSON.stringify(entry);
        
        const multi = redis.multi();
        multi.zrem(ERROR_STORE_KEY, member);
        multi.zadd(ERROR_STORE_KEY, new Date(entry.ts).getTime(), newMember);
        await multi.exec();
        return true;
      }
    }
    return false;
  },

  /**
   * Flushes all errors.
   */
  async flushAll(): Promise<void> {
    await redis.del(ERROR_STORE_KEY);
  }
};
