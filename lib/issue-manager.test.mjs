import { describe, it, expect, vi } from 'vitest';

vi.mock('./ai.mjs', () => ({
  askAI: vi.fn(() => Promise.resolve('Mocked response')),
}));

import { handleIssue } from './issue-manager.mjs';

describe('handleIssue', () => {
  it('should be a function', () => {
    expect(typeof handleIssue).toBe('function');
  });
});
