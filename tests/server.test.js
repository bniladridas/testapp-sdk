const { describe, it, expect } = require('vitest');
const request = require('supertest');
const express = require('express');

// Mock the askAI function
const mockAskAI = require('../lib/ai').askAI;
jest.mock('../lib/ai', () => ({
  askAI: jest.fn(),
}));

const app = require('../server.cjs'); // Assuming server.cjs exports the app

describe('Server API', () => {
  it('should return health check', async () => {
    const response = await request(app).get('/api/health');
    expect(response.status).toBe(200);
    expect(response.body.status).toBe('ok');
  });

  it('should handle AI requests', async () => {
    mockAskAI.mockResolvedValue('Test response');
    const response = await request(app)
      .post('/api/ask-brat-ai')
      .send({ message: 'Hello' });
    expect(response.status).toBe(200);
    expect(response.body.text).toBe('Test response');
  });

  it('should return error for missing message', async () => {
    const response = await request(app).post('/api/ask-brat-ai').send({});
    expect(response.status).toBe(400);
    expect(response.body.error).toBe('Missing message');
  });
});
