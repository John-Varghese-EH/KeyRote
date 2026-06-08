import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    include: ['packages/proxy/__tests__/**/*.test.ts'],
  },
});
