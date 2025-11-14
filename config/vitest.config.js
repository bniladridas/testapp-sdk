import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    exclude: ['node_modules/**', 'tests/**', 'e2e/**', 'e2e/**/*'],
    environment: 'jsdom',
    globals: true,
    setupFiles: ['src/test-setup.ts'],
    coverage: {
      reporter: ['text', 'lcov'],
      exclude: [
        'node_modules/**',
        'tests/**',
        'e2e/**',
        'src/main.tsx',
        'src/vite-env.d.ts',
      ],
      thresholds: {
        global: {
          statements: 60,
          branches: 30,
          functions: 40,
          lines: 60,
        },
      },
    },
  },
});
