import { describe, it, expect } from 'vitest';

import { handleCommitCheck } from './commit-msg-enforcer.mjs';

describe('handleCommitCheck', () => {
  it('should be a function', () => {
    expect(typeof handleCommitCheck).toBe('function');
  });
});
