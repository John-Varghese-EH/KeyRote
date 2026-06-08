import { config } from './config';
import { redis } from './redis';

export interface KeyState {
  key: string;
  usageCount: number;
  lastUsed: number;
  healthy: boolean;
  cooldownUntil: number | null;
}

export class KeyPool {
  private keys: string[];

  constructor() {
    this.keys = config.UPSTREAM_API_KEYS;
    if (this.keys.length === 0) {
      throw new Error('No UPSTREAM_API_KEYS configured');
    }
  }

  /**
   * Redis key prefix for health states
   */
  private getStateKey(keyStr: string) {
    return `keyrote:health:${keyStr}`;
  }

  /**
   * Retrieves the current state of a key from Redis.
   */
  public async getKeyState(key: string): Promise<KeyState> {
    const data = await redis.get(this.getStateKey(key));
    if (data) {
      try {
        const parsed = JSON.parse(data);
        return {
          key,
          usageCount: parsed.usageCount || 0,
          lastUsed: parsed.lastUsed || 0,
          healthy: parsed.healthy !== undefined ? parsed.healthy : true,
          cooldownUntil: parsed.cooldownUntil || null,
        };
      } catch (err) {
        // Fallback to default if JSON is malformed
      }
    }
    return {
      key,
      usageCount: 0,
      lastUsed: 0,
      healthy: true,
      cooldownUntil: null,
    };
  }

  /**
   * Saves the key state to Redis.
   */
  public async saveKeyState(state: KeyState): Promise<void> {
    // Keys in cooldown get a TTL of COOLDOWN_MS * 2
    // Healthy keys with usage stats can live indefinitely, but we'll set a reasonable TTL
    // so Redis isn't polluted if keys are removed from the config.
    const ttl = config.COOLDOWN_MS * 2;
    await redis.set(
      this.getStateKey(state.key),
      JSON.stringify({
        usageCount: state.usageCount,
        lastUsed: state.lastUsed,
        healthy: state.healthy,
        cooldownUntil: state.cooldownUntil,
      }),
      'PX',
      Math.max(ttl, 86400000) // At least 1 day, or 2x cooldown
    );
  }

  /**
   * Gets the next available key based on the rotation strategy.
   * If all healthy keys are exhausted or in cooldown, returns null.
   */
  public async getNextAvailableKey(): Promise<KeyState | null> {
    const states = await Promise.all(this.keys.map((k) => this.getKeyState(k)));
    const now = Date.now();

    const available = states.filter((s) => {
      if (!s.healthy) return false;
      if (s.cooldownUntil !== null && s.cooldownUntil > now) return false;
      return true;
    });

    if (available.length === 0) {
      return null;
    }

    if (config.ROTATION_STRATEGY === 'least-used') {
      return available.reduce((prev, curr) => (curr.usageCount < prev.usageCount ? curr : prev));
    } else {
      // Default: round-robin (approximated by oldest `lastUsed`)
      return available.reduce((prev, curr) => (curr.lastUsed < prev.lastUsed ? curr : prev));
    }
  }

  /**
   * Marks a key as rate-limited (429). Sets cooldown and increments usage.
   */
  public async markRateLimited(key: string): Promise<void> {
    const state = await this.getKeyState(key);
    state.cooldownUntil = Date.now() + config.COOLDOWN_MS;
    state.lastUsed = Date.now();
    state.usageCount += 1;
    await this.saveKeyState(state);
  }

  /**
   * Marks a key as permanently dead (401/403).
   */
  public async markDead(key: string): Promise<void> {
    const state = await this.getKeyState(key);
    state.healthy = false;
    state.cooldownUntil = null; // Doesn't matter, it's dead
    state.lastUsed = Date.now();
    await this.saveKeyState(state);
  }

  /**
   * Records a successful usage of the key.
   */
  public async markSuccess(key: string): Promise<void> {
    const state = await this.getKeyState(key);
    state.usageCount += 1;
    state.lastUsed = Date.now();
    // Clear cooldown if it was somehow set
    state.cooldownUntil = null;
    await this.saveKeyState(state);
  }
  
  /**
   * Returns a summary of all key states.
   */
  public async getPoolHealth() {
    const states = await Promise.all(this.keys.map((k) => this.getKeyState(k)));
    const now = Date.now();
    let healthyCount = 0;
    let cooldownCount = 0;
    let deadCount = 0;

    for (const s of states) {
      if (!s.healthy) {
        deadCount++;
      } else if (s.cooldownUntil && s.cooldownUntil > now) {
        cooldownCount++;
      } else {
        healthyCount++;
      }
    }

    return {
      totalKeyCount: this.keys.length,
      healthyKeyCount: healthyCount,
      cooldownKeyCount: cooldownCount,
      deadKeyCount: deadCount,
      states,
    };
  }
}

// Singleton export
export const keyPool = new KeyPool();
