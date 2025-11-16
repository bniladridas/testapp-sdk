import { describe, it, expect, vi, beforeEach } from 'vitest';

vi.mock('../lib/ai.mjs', () => ({
  askAI: vi.fn(),
}));

vi.mock('ora', () => ({
  default: vi.fn(() => ({
    start: vi.fn(() => ({
      stop: vi.fn(),
    })),
  })),
}));

vi.mock('chalk', () => ({
  default: {
    blue: vi.fn((s) => s),
    green: vi.fn((s) => s),
    red: vi.fn((s) => s),
    yellow: vi.fn((s) => s),
    gray: vi.fn((s) => s),
    cyan: vi.fn((s) => s),
  },
}));

vi.mock('boxen', () => ({
  default: vi.fn((s) => s),
}));

vi.mock('yargs', () => ({
  default: vi.fn(() => ({
    option: vi.fn().mockReturnThis(),
    help: vi.fn().mockReturnThis(),
    version: vi.fn().mockReturnThis(),
    parse: vi.fn(() => ({
      _: ['test'],
      interactive: false,
      verbose: false,
      json: false,
    })),
  })),
}));

vi.mock('yargs/helpers', () => ({
  hideBin: vi.fn((args) => args.slice(1)),
}));

import { askAI } from '../lib/ai.mjs';
import { main } from './index.js';

describe('CLI', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.spyOn(console, 'log').mockImplementation(() => {});
    vi.spyOn(console, 'error').mockImplementation(() => {});
    vi.spyOn(process, 'exit').mockImplementation(() => {});
  });

  it('should handle network errors gracefully', async () => {
    const networkError = new Error('Connection refused');
    networkError.code = 'ECONNREFUSED';
    askAI.mockRejectedValue(networkError);

    await main(['node', 'cli/index.js', 'test']);

    expect(console.log).toHaveBeenCalledWith(
      'Network error: Unable to connect to AI service.',
    );
    expect(process.exit).not.toHaveBeenCalled();
  });
});
