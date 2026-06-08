import fs from 'fs';
import path from 'path';
import { config } from './config';
import { redis } from './redis';
import { pino } from 'pino';

export function startCleanupScheduler(logger: pino.Logger) {
  // Run on startup
  runCleanup(logger);

  // Then schedule
  setInterval(() => {
    runCleanup(logger);
  }, config.LOG_CLEANUP_INTERVAL_MS);
}

async function runCleanup(logger: pino.Logger) {
  try {
    let filesDeleted = 0;
    
    // 1. Delete old log files
    if (fs.existsSync(config.LOG_DIR)) {
      const files = fs.readdirSync(config.LOG_DIR);
      const now = Date.now();
      const maxAgeMs = config.MAX_LOG_AGE_DAYS * 24 * 60 * 60 * 1000;
      
      const logFiles = files.filter(f => f.startsWith('audit') && f.endsWith('.log'));
      
      // Delete files older than MAX_LOG_AGE_DAYS
      for (const file of logFiles) {
        const filePath = path.join(config.LOG_DIR, file);
        const stats = fs.statSync(filePath);
        if (now - stats.mtimeMs > maxAgeMs) {
          fs.unlinkSync(filePath);
          filesDeleted++;
        }
      }

      // Keep maximum of MAX_LOG_FILES
      const remainingFiles = fs.readdirSync(config.LOG_DIR)
        .filter(f => f.startsWith('audit') && f.endsWith('.log'))
        .map(f => ({ name: f, time: fs.statSync(path.join(config.LOG_DIR, f)).mtimeMs }))
        .sort((a, b) => b.time - a.time); // Newest first

      if (remainingFiles.length > config.MAX_LOG_FILES) {
        const toDelete = remainingFiles.slice(config.MAX_LOG_FILES);
        for (const fileObj of toDelete) {
          fs.unlinkSync(path.join(config.LOG_DIR, fileObj.name));
          filesDeleted++;
        }
      }
    }

    // 2. Trim Redis audit ZSET (should be handled on push, but as a fallback)
    const auditTrimmed = await redis.zremrangebyrank('keyrote:audit', 0, -(config.MAX_REDIS_AUDIT_ENTRIES + 1));
    
    // 3. Trim Redis error ZSET
    const errorTrimmed = await redis.zremrangebyrank('keyrote:errors', 0, -(config.MAX_REDIS_ERROR_ENTRIES + 1));

    logger.info({
      task: 'cleanup',
      filesDeleted,
      redisAuditTrimmed: auditTrimmed || 0,
      redisErrorsTrimmed: errorTrimmed || 0
    });
  } catch (err) {
    logger.error({ err }, 'Cleanup scheduler failed');
  }
}
