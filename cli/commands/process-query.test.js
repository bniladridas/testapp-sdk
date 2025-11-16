import { describe, it, expect, vi, beforeEach } from 'vitest';
import { processQuery } from './process-query.js';

vi.mock('../../lib/ai.mjs', () => ({
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
  },
}));

vi.mock('boxen', () => ({
  default: vi.fn((s) => s),
}));

import { askAI } from '../../lib/ai.mjs';

describe('processQuery', () => {
  const mockArgv = {
    json: false,
    verbose: false,
    version: '1.0.0',
  };

  beforeEach(() => {
    vi.clearAllMocks();
    vi.spyOn(console, 'log').mockImplementation(() => {});
    vi.spyOn(console, 'error').mockImplementation(() => {});
    vi.spyOn(process, 'exit').mockImplementation(() => {});
  });

  it('should return undefined for empty message', async () => {
    const result = await processQuery('', mockArgv);
    expect(result).toBeUndefined();
    expect(askAI).not.toHaveBeenCalled();
  });

  it('should process valid query and return response', async () => {
    const mockResponse = 'AI response';
    askAI.mockResolvedValue(mockResponse);

    const result = await processQuery('test query', mockArgv);

    expect(askAI).toHaveBeenCalledWith('test query', []);
    expect(result).toBe(mockResponse);
  });

  it('should pass history to askAI', async () => {
    const mockResponse = 'AI response';
    const history = [{ role: 'user', text: 'previous' }];
    askAI.mockResolvedValue(mockResponse);

    const result = await processQuery('test query', mockArgv, history);

    expect(askAI).toHaveBeenCalledWith('test query', history);
    expect(result).toBe(mockResponse);
  });

  it('should handle API errors gracefully', async () => {
    const apiError = new Error('API error');
    askAI.mockRejectedValue(apiError);

    const result = await processQuery('test query', mockArgv);

    expect(result).toBeUndefined();
    expect(process.exit).toHaveBeenCalledWith(1);
  });

  it('should handle auth errors', async () => {
    const authError = new Error('GEMINI_API_KEY not set');
    askAI.mockRejectedValue(authError);

    const result = await processQuery('test query', mockArgv);

    expect(result).toBeUndefined();
    expect(process.exit).toHaveBeenCalledWith(1);
  });

  it('should handle network errors without exiting', async () => {
    const networkError = new Error('Connection refused');
    networkError.code = 'ECONNREFUSED';
    askAI.mockRejectedValue(networkError);

    const result = await processQuery('test query', mockArgv);

    expect(result).toBeUndefined();
    expect(process.exit).not.toHaveBeenCalled();
  });
});
