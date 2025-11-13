// Set mock API key to prevent server exit
process.env.GEMINI_API_KEY = 'test-key';

import { describe, it, expect, vi } from 'vitest';
import request from 'supertest';

// Mock the GoogleGenerativeAI with a configurable generateContent
const mockGenerateContent = vi.fn();
vi.mock('@google/generative-ai', () => ({
  GoogleGenerativeAI: class MockGoogleGenerativeAI {
    constructor() {}
    getGenerativeModel() {
      return {
        generateContent: mockGenerateContent,
      };
    }
  },
}));

// Mock Octokit modules
vi.mock('@octokit/app', () => ({
  App: class MockApp {
    constructor() {
      this.webhooks = {
        on: vi.fn(),
      };
    }
  },
}));

// Mock AI module
vi.mock('./lib/ai.mjs', () => ({
  askAI: vi.fn(),
}));

vi.mock('@octokit/webhooks', () => ({
  createNodeMiddleware: vi.fn(
    () =>
      function (req, res, next) {
        next();
      },
  ),
}));

// Set default mock behavior
mockGenerateContent.mockResolvedValue({
  response: {
    text: vi.fn().mockReturnValue('Mocked AI response'),
  },
});

import { askAI } from '../lib/ai.mjs';
import app from '../server.mjs';

describe('Server API', () => {
  beforeEach(() => {
    // Clear mock and reset to default behavior before each test
    mockGenerateContent.mockClear();
    mockGenerateContent.mockResolvedValue({
      response: {
        text: vi.fn().mockReturnValue('Mocked AI response'),
      },
    });
  });

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

  it.each([
    '503 Service Unavailable',
    '429 Too Many Requests',
    'Model is overloaded',
    'Service temporarily unavailable',
  ])('should handle %s error with fallback response', async (errorMessage) => {
    // Mock to fail all 3 retry attempts
    mockGenerateContent.mockImplementation(() => {
      throw new Error(errorMessage);
    });

    const response = await request(app)
      .post('/api/ask-test-ai')
      .send({ message: 'Hello' });
    expect(response.status).toBe(200);
    expect(response.body.text).toBe(
      "I'm a bit busy right now with lots of questions! How's your day going? 😊",
    );
    expect(response.body.fallback).toBe(true);
  });

  it('should handle other errors with 500 status', async () => {
    mockGenerateContent.mockImplementationOnce(() => {
      throw new Error('Some other error');
    });

    const response = await request(app)
      .post('/api/ask-test-ai')
      .send({ message: 'Hello' });
    expect(response.status).toBe(500);
    expect(response.body.error).toBe('Some other error'); // In non-production mode, returns actual error
  });

  it('should serve React app for non-API routes', async () => {
    const response = await request(app).get('/some-route');
    expect(response.status).toBe(200);
    expect(response.headers['content-type']).toContain('text/html');
  });
});
