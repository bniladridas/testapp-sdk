import { describe, it, expect, vi } from 'vitest';

vi.mock('./ai.mjs', () => ({
  askAI: vi.fn(() => Promise.resolve('Mocked docs suggestion')),
}));

import { handleDocsCheck } from './docs-bot.mjs';

describe('handleDocsCheck', () => {
  it('should be a function', () => {
    expect(typeof handleDocsCheck).toBe('function');
  });
});
