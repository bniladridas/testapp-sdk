// Set mock API key to prevent server exit
process.env.GEMINI_API_KEY = 'test-key';

import { describe, it, expect, vi } from 'vitest';
import request from 'supertest';

// Mock the GoogleGenerativeAI
vi.mock('@google/generative-ai', () => ({
  GoogleGenerativeAI: class MockGoogleGenerativeAI {
    constructor() {}
    getGenerativeModel() {
      return {
        generateContent: vi.fn().mockResolvedValue({
          response: {
            text: vi.fn().mockReturnValue('Mocked AI response'),
          },
        }),
      };
    }
  },
}));

import app from '../server.cjs';

describe('Server API', () => {
  it('should return health check', async () => {
    const response = await request(app).get('/api/health');
    expect(response.status).toBe(200);
    expect(response.body.status).toBe('ok');
  });

  it('should handle AI requests', async () => {
    const response = await request(app)
      .post('/api/ask-test-ai')
      .send({ message: 'Hello' });
    expect(response.status).toBe(200);
    expect(typeof response.body.text).toBe('string');
  });

  it('should return error for missing message', async () => {
    const response = await request(app).post('/api/ask-test-ai').send({});
    expect(response.status).toBe(400);
    expect(response.body.error).toBe('Missing message');
  });
});
