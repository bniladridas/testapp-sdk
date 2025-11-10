import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    exclude: ['node_modules/**', 'tests/**'],
    environment: 'jsdom',
    globals: true,
  },
});
