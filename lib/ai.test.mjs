import { describe, it, expect, vi, beforeEach } from 'vitest';

vi.mock('@google/generative-ai', () => ({
  GoogleGenerativeAI: vi.fn(),
}));

vi.mock('./ai-shared.mjs', () => ({
  createAIModel: vi.fn(),
}));

vi.mock('dotenv', () => ({
  default: {
    config: vi.fn(),
  },
}));

import { askAI } from './ai.mjs';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { createAIModel } from './ai-shared.mjs';
import dotenv from 'dotenv';

describe('askAI', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    process.env.GEMINI_API_KEY = 'test-key';
  });

  it('should return response text on success', async () => {
    const mockModel = {
      generateContent: vi.fn().mockResolvedValue({
        response: { text: vi.fn().mockReturnValue('AI response') },
      }),
    };
    createAIModel.mockReturnValue(mockModel);

    const result = await askAI('Test message');

    expect(createAIModel).toHaveBeenCalledWith('test-key');
    expect(mockModel.generateContent).toHaveBeenCalledWith('Test message');
    expect(result).toBe('AI response');
  });

  it('should throw error if API key not set', async () => {
    delete process.env.GEMINI_API_KEY;

    await expect(askAI('Test')).rejects.toThrow('GEMINI_API_KEY not set');
  });

  it('should retry on 503 error', async () => {
    const mockModel = {
      generateContent: vi
        .fn()
        .mockRejectedValueOnce({ status: 503 })
        .mockResolvedValueOnce({
          response: { text: vi.fn().mockReturnValue('Success after retry') },
        }),
    };
    createAIModel.mockReturnValue(mockModel);

    const result = await askAI('Test');

    expect(mockModel.generateContent).toHaveBeenCalledTimes(2);
    expect(result).toBe('Success after retry');
  });

  it('should retry on quota error', async () => {
    const mockModel = {
      generateContent: vi
        .fn()
        .mockRejectedValueOnce({ message: 'quota exceeded' })
        .mockResolvedValueOnce({
          response: { text: vi.fn().mockReturnValue('Success') },
        }),
    };
    createAIModel.mockReturnValue(mockModel);

    const result = await askAI('Test');

    expect(mockModel.generateContent).toHaveBeenCalledTimes(2);
    expect(result).toBe('Success');
  });

  it('should throw after max retries', async () => {
    const mockModel = {
      generateContent: vi.fn().mockRejectedValue({ status: 503 }),
    };
    createAIModel.mockReturnValue(mockModel);

    await expect(askAI('Test')).rejects.toThrow();
    expect(mockModel.generateContent).toHaveBeenCalledTimes(3);
  });

  it('should not retry on non-retryable error', async () => {
    const mockModel = {
      generateContent: vi.fn().mockRejectedValue({ status: 400 }),
    };
    createAIModel.mockReturnValue(mockModel);

    await expect(askAI('Test')).rejects.toThrow();
    expect(mockModel.generateContent).toHaveBeenCalledTimes(1);
  });
});
