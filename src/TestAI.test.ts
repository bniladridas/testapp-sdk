import { describe, it, expect, vi } from 'vitest';
import { askTestAI } from './TestAI';

const mockFetchSuccess = (mockResponse: Record<string, unknown>) => {
  vi.stubGlobal(
    'fetch',
    vi.fn(() =>
      Promise.resolve({
        json: () => Promise.resolve(mockResponse),
      }),
    ),
  );
};

describe('askTestAI', () => {
  it('should return the text from successful response', async () => {
    const mockResponse = { text: 'Hello from AI' };
    mockFetchSuccess(mockResponse);

    const result = await askTestAI('Test message');
    expect(result).toBe('Hello from AI');
    expect(fetch).toHaveBeenCalledWith('/api/ask-test-ai', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: 'Test message' }),
    });
  });

  it('should return error message on fetch failure', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn(() => Promise.reject(new Error('Network error'))),
    );

    const result = await askTestAI('Test message');
    expect(result).toBe('Error: Could not connect to Test AI backend.');
  });

  it('should return fallback message on rate limit', async () => {
    const error = new Error('Too many requests');
    vi.stubGlobal(
      'fetch',
      vi.fn(() => Promise.reject(error)),
    );

    const result = await askTestAI('Test message');
    expect(result).toBe(
      "I'm getting a lot of questions right now. How's your day going? 😊",
    );
  });

  it('should return error message when response has no text but has error', async () => {
    const mockResponse = { error: 'Backend error occurred' };
    mockFetchSuccess(mockResponse);

    const result = await askTestAI('Test message');
    expect(result).toBe('Backend error occurred');
  });

  it('should return default error message when response has neither text nor error', async () => {
    const mockResponse = { someOtherField: 'value' };
    mockFetchSuccess(mockResponse);

    const result = await askTestAI('Test message');
    expect(result).toBe('Unknown error from Test AI backend.');
  });
});
