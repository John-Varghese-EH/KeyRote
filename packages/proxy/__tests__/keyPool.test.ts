import { describe, it, expect, vi, beforeEach } from 'vitest';

const { mockGet, mockSet } = vi.hoisted(() => {
  return {
    mockGet: vi.fn(),
    mockSet: vi.fn(),
  }
});

vi.mock('../src/redis', () => ({
  redis: {
    get: mockGet,
    set: mockSet,
  }
}));

vi.mock('../src/config', () => ({
  config: {
    UPSTREAM_API_KEYS: ['key1', 'key2'],
    ROTATION_STRATEGY: 'round-robin',
    COOLDOWN_MS: 1000,
  }
}));

import { keyPool } from '../src/keyPool';

describe('KeyPool', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should initialize with keys from config', () => {
    expect((keyPool as any).keys).toEqual(['key1', 'key2']);
  });

  it('should get healthy key', async () => {
    mockGet.mockResolvedValueOnce(JSON.stringify({
      healthy: true,
      cooldownUntil: null,
      lastUsed: 0,
      usageCount: 0
    }));
    mockGet.mockResolvedValueOnce(JSON.stringify({
      healthy: true,
      cooldownUntil: null,
      lastUsed: 10,
      usageCount: 0
    }));

    const key = await keyPool.getNextAvailableKey();
    expect(key?.key).toBe('key1'); // key1 has older lastUsed (0 < 10)
  });

  it('should return null if all keys exhausted', async () => {
    mockGet.mockResolvedValue(JSON.stringify({
      healthy: true,
      cooldownUntil: Date.now() + 10000, // in cooldown
      lastUsed: 0,
      usageCount: 0
    }));

    const key = await keyPool.getNextAvailableKey();
    expect(key).toBeNull();
  });
});
