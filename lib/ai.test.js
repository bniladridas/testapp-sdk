const { describe, it, expect, vi, beforeEach } = require('vitest');
const { askAI } = require('./ai');

// Mock the GoogleGenerativeAI
vi.mock('@google/generative-ai', () => ({
  GoogleGenerativeAI: vi.fn().mockImplementation(() => ({
    getGenerativeModel: vi.fn().mockReturnValue({
      generateContent: vi.fn().mockResolvedValue({
        response: {
          text: vi.fn().mockReturnValue('Mocked AI response'),
        },
      }),
    }),
  })),
}));

describe('askAI', () => {
  beforeEach(() => {
    // Set mock API key
    process.env.GEMINI_API_KEY = 'mock-key';
  });

  it('should return "Harpertoken" for name questions', async () => {
    const result = await askAI('What is your name?');
    expect(result).toBe('Harpertoken');
  });

  it('should return project info for repo questions', async () => {
    const result = await askAI('What is this project?');
    expect(result).toContain('Together API CLI Tools');
  });

  it('should call Gemini API for general questions', async () => {
    const result = await askAI('Hello world');
    expect(result).toBe('Mocked AI response');
  });

  it('should throw error if no API key', async () => {
    delete process.env.GEMINI_API_KEY;
    await expect(askAI('test')).rejects.toThrow('GEMINI_API_KEY not set');
  });

  it('should throw error for empty message', async () => {
    await expect(askAI('')).rejects.toThrow('Missing message');
  });
});
