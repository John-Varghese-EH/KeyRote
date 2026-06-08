import pino from 'pino';
import { config } from './config';
import fs from 'fs';

// Ensure log directory exists
if (!fs.existsSync(config.LOG_DIR)) {
  fs.mkdirSync(config.LOG_DIR, { recursive: true });
}

export const logger = pino({
  level: config.LOG_LEVEL,
  transport: {
    target: 'pino-roll',
    options: {
      file: `${config.LOG_DIR}/audit`,
      extension: '.log',
      frequency: 'daily',
      size: `${config.MAX_LOG_FILE_SIZE_MB}m`,
      mkdir: true,
      sync: false,
    }
  }
});
