import { Redis } from "@upstash/redis/cloudflare";

export interface KeyState {
  key: string;
  healthy: boolean;
  cooldownUntil: number | null;
  lastUsed: number;
  usageCount: number;
}

export class KeyPool {
  private redis: Redis;
  private keys: string[];
  private strategy: string;
  private cooldownMs: number;

  constructor(redis: Redis, keys: string[], strategy: string, cooldownMs: number) {
    this.redis = redis;
    this.keys = keys;
    this.strategy = strategy;
    this.cooldownMs = cooldownMs;
  }

  async getNextAvailableKey(): Promise<KeyState | null> {
    if (this.keys.length === 0) return null;

    const states: KeyState[] = [];
    const now = Date.now();
    let requiresSave = false;

    for (const key of this.keys) {
      const stateStr = await this.redis.get<string>(`keyrote:state:${key}`);
      let state: KeyState;
      if (!stateStr) {
        state = { key, healthy: true, cooldownUntil: null, lastUsed: 0, usageCount: 0 };
        states.push(state);
      } else {
        // Upstash auto-parses JSON sometimes, check type
        state = typeof stateStr === 'string' ? JSON.parse(stateStr) : stateStr;
        state.key = key;

        if (state.cooldownUntil !== null && state.cooldownUntil <= now) {
          state.healthy = true;
          state.cooldownUntil = null;
          requiresSave = true;
          // Optimistically update
          await this.redis.set(`keyrote:state:${key}`, JSON.stringify(state));
        }
        states.push(state);
      }
    }

    const available = states.filter(s => s.healthy && s.cooldownUntil === null);
    if (available.length === 0) return null;

    let selected: KeyState;
    if (this.strategy === 'least-used') {
      selected = available.reduce((prev, curr) => (prev.usageCount < curr.usageCount ? prev : curr));
    } else {
      selected = available.reduce((prev, curr) => (prev.lastUsed < curr.lastUsed ? prev : curr));
    }

    selected.lastUsed = Date.now();
    selected.usageCount++;
    await this.redis.set(`keyrote:state:${selected.key}`, JSON.stringify(selected));

    return selected;
  }

  async markRateLimited(key: string): Promise<void> {
    const stateStr = await this.redis.get<string>(`keyrote:state:${key}`);
    if (!stateStr) return;
    const state = typeof stateStr === 'string' ? JSON.parse(stateStr) : stateStr;
    state.healthy = false;
    state.cooldownUntil = Date.now() + this.cooldownMs;
    await this.redis.set(`keyrote:state:${key}`, JSON.stringify(state));
  }

  async markDead(key: string): Promise<void> {
    const stateStr = await this.redis.get<string>(`keyrote:state:${key}`);
    if (!stateStr) return;
    const state = typeof stateStr === 'string' ? JSON.parse(stateStr) : stateStr;
    state.healthy = false;
    state.cooldownUntil = Date.now() + (this.cooldownMs * 10); // Much longer cooldown for auth failure
    await this.redis.set(`keyrote:state:${key}`, JSON.stringify(state));
  }

  async markSuccess(key: string): Promise<void> {
    const stateStr = await this.redis.get<string>(`keyrote:state:${key}`);
    if (!stateStr) return;
    const state = typeof stateStr === 'string' ? JSON.parse(stateStr) : stateStr;
    if (!state.healthy || state.cooldownUntil !== null) {
      state.healthy = true;
      state.cooldownUntil = null;
      await this.redis.set(`keyrote:state:${key}`, JSON.stringify(state));
    }
  }
}
