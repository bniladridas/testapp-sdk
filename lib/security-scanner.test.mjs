import { describe, it, expect } from 'vitest';

import { handleSecurityScan } from './security-scanner.mjs';

describe('handleSecurityScan', () => {
  it('should be a function', () => {
    expect(typeof handleSecurityScan).toBe('function');
  });
});
