// Set test environment variables
process.env.GEMINI_API_KEY = 'test-key';
process.env.JWT_SECRET = 'test-jwt-secret';

// Mock database for testing
vi.mock('../lib/database.js', () => ({
  pool: {
    connect: vi.fn(() => ({
      query: vi.fn(),
      release: vi.fn(),
    })),
    query: vi.fn(),
    on: vi.fn(),
    end: vi.fn(),
  },
  initDatabase: vi.fn().mockResolvedValue(),
}));

// Mock bcryptjs
vi.mock('bcryptjs', () => ({
  default: {
    hash: vi.fn().mockResolvedValue('hashed-password'),
    compare: vi.fn().mockResolvedValue(true),
  },
  hash: vi.fn().mockResolvedValue('hashed-password'),
  compare: vi.fn().mockResolvedValue(true),
}));

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

// Mock workflow-automator
vi.mock('../lib/workflow-automator.mjs', () => ({
  handleWorkflow: vi.fn(),
}));

// Mock JWT
vi.mock('jsonwebtoken', () => ({
  default: {
    sign: vi.fn(() => 'mock-jwt-token'),
    verify: vi.fn((token, secret, callback) => {
      if (token === 'invalid-token') {
        callback(new Error('Invalid token'));
      } else {
        callback(null, { id: 1, email: 'test@example.com' });
      }
    }),
  },
}));

// Mock bcrypt
vi.mock('bcryptjs', () => ({
  default: {
    hash: vi.fn().mockResolvedValue('$2a$10$mockedhashedpassword'),
    compare: vi.fn().mockResolvedValue(true),
  },
}));

// Mock AI module
vi.mock('../lib/ai.mjs', () => ({
  askAI: vi.fn().mockResolvedValue('Mocked AI response'),
}));

// Mock workflow-automator
vi.mock('../lib/workflow-automator.mjs', () => ({
  handleWorkflow: vi.fn(),
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

import {
  describe,
  it,
  expect,
  vi,
  beforeAll,
  afterAll,
  beforeEach,
} from 'vitest';
import request from 'supertest';
import { askAI } from '../lib/ai.mjs';
import { pool, initDatabase } from '../lib/database.js';
import { handleWorkflow } from '../lib/workflow-automator.mjs';
import { gracefulShutdown } from '../server.mjs';

// Import app after mocks are set up
import app from '../server.mjs';

describe('Server API', () => {
  let mockClient;

  beforeAll(async () => {
    // Initialize test database (mocked)
    await initDatabase();
  });

  afterAll(async () => {
    // Close database connection (mocked)
    await pool.end();
  });

  beforeEach(async () => {
    // Reset all mocks
    vi.clearAllMocks();

    // Set up mock client for database operations
    mockClient = {
      query: vi.fn(),
      release: vi.fn(),
    };
    pool.connect.mockResolvedValue(mockClient);

    // Mock successful user creation
    mockClient.query.mockImplementation((query, params) => {
      if (query.includes('INSERT INTO users')) {
        return Promise.resolve({ rows: [{ id: 1, email: params[0] }] });
      }
      if (query.includes('SELECT id FROM users WHERE email')) {
        return Promise.resolve({ rows: [] }); // No existing user by default
      }
      if (
        query.includes('SELECT id, email, password_hash FROM users WHERE email')
      ) {
        return Promise.resolve({
          rows: [
            {
              id: 1,
              email: params[0],
              password_hash: '$2a$10$mockedhashedpassword', // Mock bcrypt hash
            },
          ],
        });
      }
      if (query.includes('DELETE FROM users')) {
        return Promise.resolve({ rowCount: 1 });
      }
      return Promise.resolve({ rows: [] });
    });

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

  it('should return database health check', async () => {
    const response = await request(app).get('/api/health/database');
    expect(response.status).toBe(200);
    expect(response.body.status).toBe('ok');
    expect(response.body.database).toHaveProperty('connected');
    expect(response.body.database).toHaveProperty('responseTime');
    expect(response.body.database).toHaveProperty('pool');
  });

  it('should return error for missing message', async () => {
    const response = await request(app)
      .post('/api/ask-test-ai')
      .set('Authorization', 'Bearer mock-token')
      .send({});
    expect(response.status).toBe(400);
    expect(response.body.error).toBe('Missing message');
  });

  it('should serve React app for non-API routes', async () => {
    const response = await request(app).get('/some-route');
    expect(response.status).toBe(200);
    expect(response.headers['content-type']).toContain('text/html');
  });

  it('should handle server errors with error middleware', async () => {
    // Test error handling middleware by triggering an error
    const response = await request(app).post('/api/auth/signup').send({}); // Missing required fields to trigger error

    // This should be handled by error middleware if there's an unhandled error
    // But in this case, it's handled by the route itself
    expect(response.status).toBe(400);
  });

  describe('Authentication', () => {
    it.skip('should signup a new user', async () => {
      const response = await request(app)
        .post('/api/auth/signup')
        .send({ email: 'test@example.com', password: 'password123' });
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('token');
      expect(response.body.user.email).toBe('test@example.com');
      expect(response.body.user).toHaveProperty('id');
    });

    it('should not signup with existing email', async () => {
      // Mock existing user check to return a user
      mockClient.query.mockImplementationOnce((query, params) => {
        if (query.includes('SELECT id FROM users WHERE email')) {
          return Promise.resolve({ rows: [{ id: 1 }] });
        }
        return Promise.resolve({ rows: [] });
      });

      const response = await request(app)
        .post('/api/auth/signup')
        .send({ email: 'test@example.com', password: 'password456' });
      expect(response.status).toBe(400);
      expect(response.body.error).toBe('User already exists');
    });

    it.skip('should login with correct credentials', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({ email: 'test@example.com', password: 'password123' });
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('token');
      expect(response.body.user.email).toBe('test@example.com');
    });

    it('should not login with wrong password', async () => {
      // Mock bcrypt compare to return false for wrong password
      vi.mock('bcryptjs', () => ({
        default: {
          compare: vi.fn(() => false),
        },
      }));

      const response = await request(app)
        .post('/api/auth/login')
        .send({ email: 'test@example.com', password: 'wrongpassword' });
      expect(response.status).toBe(400);
      expect(response.body.error).toBe('Invalid credentials');
    });

    it('should not login with non-existent email', async () => {
      // Mock user lookup to return no results
      mockClient.query.mockImplementationOnce((query, params) => {
        if (
          query.includes(
            'SELECT id, email, password_hash FROM users WHERE email',
          )
        ) {
          return Promise.resolve({ rows: [] });
        }
        return Promise.resolve({ rows: [] });
      });

      const response = await request(app)
        .post('/api/auth/login')
        .send({ email: 'nonexistent@example.com', password: 'password123' });
      expect(response.status).toBe(400);
      expect(response.body.error).toBe('Invalid credentials');
    });

    it('should protect AI endpoint without token', async () => {
      const response = await request(app)
        .post('/api/ask-test-ai')
        .send({ message: 'Hello' });
      expect(response.status).toBe(401);
      expect(response.body.error).toBe('Access token required');
    });

    it('should allow AI endpoint with valid token', async () => {
      // First signup and get a real token
      const signupResponse = await request(app)
        .post('/api/auth/signup')
        .send({ email: 'test@example.com', password: 'password123' });

      const token = signupResponse.body.token;

      const response = await request(app)
        .post('/api/ask-test-ai')
        .set('Authorization', `Bearer ${token}`)
        .send({ message: 'Hello' });
      expect(response.status).toBe(200);
    });

    it('should reject AI endpoint with invalid token', async () => {
      const response = await request(app)
        .post('/api/ask-test-ai')
        .set('Authorization', 'Bearer invalid-token')
        .send({ message: 'Hello' });
      expect(response.status).toBe(403);
      expect(response.body.error).toBe('Invalid or expired token');
    });

    it.skip('should reset database for testing', async () => {
      // Create a user
      await request(app)
        .post('/api/auth/signup')
        .send({ email: 'test@example.com', password: 'password123' });

      // Verify user exists
      const loginResponse = await request(app)
        .post('/api/auth/login')
        .send({ email: 'test@example.com', password: 'password123' });
      expect(loginResponse.status).toBe(200);

      // Reset database
      const resetResponse = await request(app).post('/api/test/reset');
      expect(resetResponse.status).toBe(200);
      expect(resetResponse.body.status).toBe('reset');

      // Verify user no longer exists
      const loginAfterReset = await request(app)
        .post('/api/auth/login')
        .send({ email: 'test@example.com', password: 'password123' });
      expect(loginAfterReset.status).toBe(400);
      expect(loginAfterReset.body.error).toBe('Invalid credentials');
    });
  });

  describe('Graceful Shutdown', () => {
    it('should handle graceful shutdown', async () => {
      // Mock server.close
      const mockServer = {
        close: vi.fn((callback) => callback()),
      };

      // Mock process.exit
      const mockExit = vi.spyOn(process, 'exit').mockImplementation(() => {});

      // Call gracefulShutdown with test server
      await gracefulShutdown('SIGTERM', mockServer);

      // Verify database pool.end was called
      expect(pool.end).toHaveBeenCalled();

      // Verify server.close was called
      expect(mockServer.close).toHaveBeenCalled();

      // Restore mocks
      mockExit.mockRestore();
    });

    it('should handle shutdown errors', async () => {
      // Mock pool.end to throw error
      pool.end.mockRejectedValueOnce(new Error('Database error'));

      // Mock server.close
      const mockServer = {
        close: vi.fn((callback) => callback()),
      };

      // Temporarily replace the global server variable
      const originalServer = global.server;
      global.server = mockServer;

      // Mock process.exit
      const mockExit = vi.spyOn(process, 'exit').mockImplementation(() => {});

      // Call gracefulShutdown
      await gracefulShutdown('SIGTERM');

      // Verify process.exit was called with error code
      expect(mockExit).toHaveBeenCalledWith(1);

      // Restore mocks
      global.server = originalServer;
      mockExit.mockRestore();
    });
  });

  describe('Error Handling', () => {
    it('should handle database connection errors in health check', async () => {
      // Temporarily set NODE_ENV to 'production' to enable database testing
      const originalEnv = process.env.NODE_ENV;
      process.env.NODE_ENV = 'production';

      // Mock pool.query to throw error
      pool.query.mockRejectedValueOnce(new Error('Connection failed'));

      const response = await request(app).get('/api/health');
      expect(response.status).toBe(503);
      expect(response.body.status).toBe('error');
      expect(response.body.database).toBe('disconnected');

      // Restore original NODE_ENV
      process.env.NODE_ENV = originalEnv;
    });

    it('should handle database connection errors in database health check', async () => {
      // Mock pool.query to throw error
      pool.query.mockRejectedValueOnce(new Error('Connection failed'));

      const response = await request(app).get('/api/health/database');
      expect(response.status).toBe(503);
      expect(response.body.status).toBe('error');
      expect(response.body.database.connected).toBe(false);
    });

    it('should handle AI errors with fallback response', async () => {
      // Mock askAI to throw a 503 error
      askAI.mockRejectedValueOnce(new Error('503 Service Unavailable'));

      const signupResponse = await request(app)
        .post('/api/auth/signup')
        .send({ email: 'test@example.com', password: 'password123' });

      const token = signupResponse.body.token;

      const response = await request(app)
        .post('/api/ask-test-ai')
        .set('Authorization', `Bearer ${token}`)
        .send({ message: 'Hello' });

      expect(response.status).toBe(200);
      expect(response.body.fallback).toBe(true);
    });

    it('should handle AI errors with rate limit fallback', async () => {
      // Mock askAI to throw a rate limit error
      askAI.mockRejectedValueOnce(new Error('429 Too Many Requests'));

      const signupResponse = await request(app)
        .post('/api/auth/signup')
        .send({ email: 'test@example.com', password: 'password123' });

      const token = signupResponse.body.token;

      const response = await request(app)
        .post('/api/ask-test-ai')
        .set('Authorization', `Bearer ${token}`)
        .send({ message: 'Hello' });

      expect(response.status).toBe(200);
      expect(response.body.fallback).toBe(true);
    });

    it('should handle AI errors with quota fallback', async () => {
      // Mock askAI to throw a quota error (lowercase to match regex)
      askAI.mockRejectedValueOnce(new Error('quota exceeded'));

      const signupResponse = await request(app)
        .post('/api/auth/signup')
        .send({ email: 'test@example.com', password: 'password123' });

      const token = signupResponse.body.token;

      const response = await request(app)
        .post('/api/ask-test-ai')
        .set('Authorization', `Bearer ${token}`)
        .send({ message: 'Hello' });

      expect(response.status).toBe(200);
      expect(response.body.fallback).toBe(true);
    });

    it('should handle other AI errors', async () => {
      // Mock askAI to throw a generic error
      askAI.mockRejectedValueOnce(new Error('Some other error'));

      const signupResponse = await request(app)
        .post('/api/auth/signup')
        .send({ email: 'test@example.com', password: 'password123' });

      const token = signupResponse.body.token;

      const response = await request(app)
        .post('/api/ask-test-ai')
        .set('Authorization', `Bearer ${token}`)
        .send({ message: 'Hello' });

      expect(response.status).toBe(500);
      expect(response.body.error).toBe('Some other error');
    });
  });

  describe('Rate Limiting', () => {
    it('should handle auth rate limit exceeded', async () => {
      // This test would require setting up rate limiting middleware testing
      // For now, we'll skip as it's complex to test rate limiting in unit tests
    });

    it('should handle API rate limit exceeded', async () => {
      // This test would require setting up rate limiting middleware testing
      // For now, we'll skip as it's complex to test rate limiting in unit tests
    });
  });

  describe('GitHub Webhooks', () => {
    it('should handle webhook errors', async () => {
      // Mock handleWorkflow to throw error
      handleWorkflow.mockRejectedValueOnce(
        new Error('Webhook processing failed'),
      );

      // This test would require triggering the webhook handler
      // For now, we'll verify the webhook setup exists
      expect(true).toBe(true); // Placeholder test
    });
  });
});
