import { describe, it, expect, vi } from 'vitest';

vi.mock('./ai.mjs', () => ({
  askAI: vi.fn(() => Promise.resolve('Mocked changelog')),
}));

import { handleRelease } from './release-helper.mjs';

describe('handleRelease', () => {
  it('should be a function', () => {
    expect(typeof handleRelease).toBe('function');
  });
});
