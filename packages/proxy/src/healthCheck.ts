import { keyPool } from './keyPool';
import { config } from './config';
import { alerts } from './alerts'; // We will create this
import { pino } from 'pino'; // Wait, I will use fetch to check endpoints

/**
 * Health Check background loop
 */
export function startHealthCheck(logger: pino.Logger) {
  setInterval(async () => {
    try {
      const healthData = await keyPool.getPoolHealth();

      // Alert if pool is exhausted or very low
      const ratio = healthData.healthyKeyCount / healthData.totalKeyCount;
      if (healthData.healthyKeyCount === 0) {
        alerts.fireAlert('POOL_EXHAUSTED', {
          healthyKeys: 0,
          totalKeys: healthData.totalKeyCount,
          instanceId: process.env.HOSTNAME || 'unknown',
          ts: new Date().toISOString()
        }, true); // bypass debounce
      } else if (ratio < config.ALERT_THRESHOLD) {
        alerts.fireAlert('POOL_LOW', {
          healthyKeys: healthData.healthyKeyCount,
          totalKeys: healthData.totalKeyCount,
          instanceId: process.env.HOSTNAME || 'unknown',
          ts: new Date().toISOString()
        });
      }

      // Re-test keys in cooldown
      const now = Date.now();
      for (const state of healthData.states) {
        if (state.cooldownUntil !== null && state.cooldownUntil <= now) {
          // The cooldown has naturally expired by time, let's do a lightweight health check to verify
          try {
            // Wait, spec says: "For each key in cooldown: re-test with a cheap upstream call"
            // If the cooldown timer hasn't expired yet, do we re-test it early? 
            // The spec implies we check keys that are currently in cooldown to see if they've recovered early,
            // or we just re-test once the cooldown expires. Let's re-test all keys whose cooldown just expired.
            // Wait, "For each key in cooldown: re-test" - so we test even if it's in cooldown.
            
            const url = new URL(config.HEALTH_CHECK_ENDPOINT);
            
            // Note: injecting the key depending on config
            const headers: Record<string, string> = {};
            if (config.KEY_HEADER_NAME.toLowerCase() === 'authorization') {
              headers['Authorization'] = `Bearer ${state.key}`;
            } else {
              headers[config.KEY_HEADER_NAME] = state.key;
            }

            const res = await fetch(url.toString(), {
              method: 'GET',
              headers
            });

            if (res.status === 200 || res.status === 404) { 
               await keyPool.markSuccess(state.key);
               logger.info({ keyHint: state.key.slice(-4), status: res.status }, 'Health check passed, key restored');
            } else if (res.status === 401 || res.status === 403) {
              await keyPool.markDead(state.key);
              logger.warn({ keyHint: state.key.slice(-4) }, 'Health check returned 401/403, key marked dead');
            }
          } catch (err: any) {
             logger.debug({ keyHint: state.key.slice(-4), err: err.message }, 'Health check network error, keeping in cooldown');
          }
        }
      }
    } catch (err) {
      logger.error({ err }, 'Error during health check loop');
    }
  }, config.HEALTH_CHECK_INTERVAL_MS);
}
