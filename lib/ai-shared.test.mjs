import { describe, it, expect, vi } from 'vitest';

vi.mock('@google/generative-ai');

import { createAIModel } from './ai-shared.mjs';
import { GoogleGenerativeAI } from '@google/generative-ai';

describe('createAIModel', () => {
  it('should create model with correct config', () => {
    const mockAI = {
      getGenerativeModel: vi.fn().mockReturnValue('mock-model'),
    };
    GoogleGenerativeAI.mockImplementation(function (apiKey) {
      return mockAI;
    });

    const result = createAIModel('test-key');

    expect(GoogleGenerativeAI).toHaveBeenCalledWith('test-key');
    expect(mockAI.getGenerativeModel).toHaveBeenCalledWith({
      model: 'gemini-2.5-flash',
      generationConfig: { responseMimeType: 'text/plain' },
      systemInstruction:
        'Respond in plain text without any markdown formatting, asterisks, bold, italics, or special characters. Keep responses clean, natural, and easy to read.',
    });
    expect(result).toBe('mock-model');
  });
});
