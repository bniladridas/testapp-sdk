import express from 'express';
import cors from 'cors';
import path from 'path';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { fileURLToPath } from 'url';
import * as Sentry from '@sentry/node';

dotenv.config();

// Initialize Sentry for backend error monitoring
Sentry.init({
  dsn: process.env.SENTRY_DSN,
  integrations: [
    // enable HTTP { request, response } logging
    Sentry.httpIntegration(),
  ],
  // Performance Monitoring
  tracesSampleRate: 1.0, // Capture 100% of the transactions
});

console.log('Starting TestApp server...');

import { createNodeMiddleware } from '@octokit/webhooks';
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const { App } = require('@octokit/app');

// Database setup
import { pool, initDatabase } from './lib/database.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

import { askAI } from './lib/ai.mjs';

const app = express();
const port = process.env.PORT || 3001;
const isProduction = process.env.NODE_ENV === 'production';
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

// Sentry request handler must be the first middleware
// Note: expressIntegration is configured in Sentry.init(), not used as middleware

// Security headers
app.use(
  helmet({
    contentSecurityPolicy: isProduction
      ? {
          directives: {
            defaultSrc: ["'self'"],
            scriptSrc: ["'self'"],
            styleSrc: ["'self'"],
            imgSrc: ["'self'", 'data:', 'https:'],
            connectSrc: ["'self'"],
            fontSrc: ["'self'"],
            objectSrc: ["'none'"],
            mediaSrc: ["'self'"],
            frameSrc: ["'none'"],
          },
        }
      : false,
  }),
);

app.use(
  cors({
    origin: isProduction ? process.env.ALLOWED_ORIGINS?.split(',') : true,
    credentials: true,
  }),
);
app.use(express.json({ limit: '1mb' }));

// Serve static files from the dist directory (built frontend)
app.use(
  express.static(path.join(__dirname, 'dist'), {
    maxAge: isProduction ? '1y' : 0,
    etag: true,
  }),
);

// GitHub App setup (conditional for testing)
const githubApp = process.env.GITHUB_APP_ID
  ? new App({
      appId: process.env.GITHUB_APP_ID,
      privateKey: process.env.GITHUB_PRIVATE_KEY.replace(/\\n/g, '\n'),
      webhooks: { secret: process.env.GITHUB_WEBHOOK_SECRET },
    })
  : null;

// Webhook handlers
if (githubApp) {
  githubApp.webhooks.on('issues.labeled', async ({ octokit, payload }) => {
    try {
      await handleWorkflow(octokit, payload);
    } catch (error) {
      console.error('Error handling workflow:', error);
    }
  });

  // GitHub webhook endpoint
  app.use(
    '/api/webhooks/github',
    createNodeMiddleware(githubApp.webhooks, { path: '/api/webhooks/github' }),
  );
}

// Rate limiter for auth endpoints
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // limit each IP to 5 auth attempts per windowMs
  message:
    'Too many authentication attempts from this IP, please try again later.',
  handler: (req, res, next, options) => {
    console.log(
      'Security: Auth rate limit exceeded for IP: ' +
        req.ip +
        ', URL: ' +
        req.url,
    );
    res.status(options.statusCode).send(options.message);
  },
});

// Rate limiter for API endpoints
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.',
  handler: (req, res, next, options) => {
    console.log(
      'Security: API rate limit exceeded for IP: ' +
        req.ip +
        ', URL: ' +
        req.url,
    );
    res.status(options.statusCode).send(options.message);
  },
});

// JWT authentication middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    console.log(`Security: Missing token from IP: ${req.ip}`);
    return res.status(401).json({ error: 'Access token required' });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      console.log(`Security: Invalid token from IP: ${req.ip}`);
      return res.status(403).json({ error: 'Invalid or expired token' });
    }
    req.user = user;
    next();
  });
};

// Auth endpoints
app.post('/api/auth/signup', authLimiter, async (req, res) => {
  const client = await pool.connect();
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password required' });
    }

    // Check if user exists
    const existingUser = await client.query(
      'SELECT id FROM users WHERE email = $1',
      [email],
    );

    if (existingUser.rows.length > 0) {
      return res.status(400).json({ error: 'User already exists' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const result = await client.query(
      'INSERT INTO users (email, password_hash) VALUES ($1, $2) RETURNING id, email',
      [email, hashedPassword],
    );

    const user = result.rows[0];

    // Generate token
    const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, {
      expiresIn: '24h',
    });

    res.json({ token, user: { id: user.id, email: user.email } });
  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).json({ error: 'Internal server error' });
  } finally {
    client.release();
  }
});

app.post('/api/auth/login', authLimiter, async (req, res) => {
  const client = await pool.connect();
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password required' });
    }

    // Find user
    const result = await client.query(
      'SELECT id, email, password_hash FROM users WHERE email = $1',
      [email],
    );

    if (result.rows.length === 0) {
      console.log(
        'Security: Failed login attempt for non-existent email: ' +
          email +
          ' from IP: ' +
          req.ip,
      );
      return res.status(400).json({ error: 'Invalid credentials' });
    }

    const user = result.rows[0];

    // Check password
    const validPassword = await bcrypt.compare(password, user.password_hash);
    if (!validPassword) {
      console.log(
        'Security: Failed login attempt for email: ' +
          email +
          ' from IP: ' +
          req.ip,
      );
      return res.status(400).json({ error: 'Invalid credentials' });
    }

    // Generate token
    const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, {
      expiresIn: '24h',
    });

    res.json({ token, user: { id: user.id, email: user.email } });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Internal server error' });
  } finally {
    client.release();
  }
});

// Health check endpoint
app.get('/api/health', async (_, res) => {
  try {
    // Test database connection (skip in test environment to allow server startup)
    if (process.env.NODE_ENV !== 'test') {
      await pool.query('SELECT 1');
    }
    res.json({
      status: 'ok',
      timestamp: new Date().toISOString(),
      database: process.env.NODE_ENV === 'test' ? 'skipped' : 'connected',
    });
  } catch (error) {
    console.error('Database health check failed:', error);
    res.status(503).json({
      status: 'error',
      timestamp: new Date().toISOString(),
      database: 'disconnected',
      error: isProduction ? 'Database connection failed' : error.message,
    });
  }
});

// Database status endpoint (detailed monitoring)
app.get('/api/health/database', async (_, res) => {
  try {
    const startTime = Date.now();
    await pool.query('SELECT 1');
    const responseTime = Date.now() - startTime;

    res.json({
      status: 'ok',
      timestamp: new Date().toISOString(),
      database: {
        connected: true,
        responseTime: `${responseTime}ms`,
        pool: {
          total: pool.totalCount,
          idle: pool.idleCount,
          waiting: pool.waitingCount,
        },
      },
    });
  } catch (error) {
    console.error('Database status check failed:', error);
    res.status(503).json({
      status: 'error',
      timestamp: new Date().toISOString(),
      database: {
        connected: false,
        error: isProduction ? 'Database connection failed' : error.message,
        pool: {
          total: pool.totalCount,
          idle: pool.idleCount,
          waiting: pool.waitingCount,
        },
      },
    });
  }
});

// Reset users for testing
app.post('/api/test/reset', async (req, res) => {
  try {
    await pool.query('DELETE FROM users');
    res.json({ status: 'reset' });
  } catch (error) {
    console.error('Reset error:', error);
    res.status(500).json({ error: 'Failed to reset database' });
  }
});

app.post(
  '/api/ask-test-ai',
  apiLimiter,
  authenticateToken,
  async (req, res) => {
    const { message } = req.body;
    if (!message) return res.status(400).json({ error: 'Missing message' });

    // Prevent caching of API responses
    res.set('Cache-Control', 'no-cache, no-store, must-revalidate');
    res.set('Pragma', 'no-cache');
    res.set('Expires', '0');

    try {
      const text = await askAI(message);
      res.json({ text });
    } catch (error) {
      console.error('Error:', error);

      // Check for specific error types
      const errorText = error.message || error.toString();
      if (
        errorText.includes('503') ||
        errorText.includes('429') ||
        errorText.includes('Too Many Requests') ||
        errorText.includes('overloaded') ||
        errorText.includes('temporarily unavailable') ||
        errorText.includes('quota') ||
        errorText.includes('rate limit') ||
        error.status === 429
      ) {
        return res.json({
          text: "I'm a bit busy right now with lots of questions! How's your day going? 😊",
          fallback: true,
        });
      }

      // Other errors
      res.status(500).json({
        error: isProduction ? 'Internal server error' : error.message,
      });
    }
  },
);

// Serve the React app for any non-API routes
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

// Error handling middleware
app.use((err, _, res) => {
  console.error('Server Error:', err);
  res
    .status(500)
    .json({ error: isProduction ? 'Internal server error' : err.message });
});

// Graceful shutdown function
const gracefulShutdown = async (signal) => {
  console.log(`Received ${signal}. Starting graceful shutdown...`);

  try {
    // Close database connections
    await pool.end();
    console.log('Database connections closed.');

    // Close server
    server.close(() => {
      console.log('Server closed.');
      process.exit(0);
    });

    // Force close after 10 seconds
    setTimeout(() => {
      console.error('Forced shutdown after timeout.');
      process.exit(1);
    }, 10000);
  } catch (error) {
    console.error('Error during shutdown:', error);
    process.exit(1);
  }
};

let server;

if (import.meta.url === `file://${process.argv[1]}`) {
  // Initialize database before starting server
  (async () => {
    try {
      await initDatabase();
      console.log('Database initialized successfully');
    } catch (error) {
      console.error('Failed to initialize database:', error);
    }

    // Sentry error handler must be before any other error middleware
    app.use(Sentry.expressErrorHandler());

    console.log(`Attempting to start server on port ${port}...`);
    server = app.listen(port, '127.0.0.1', () => {
      console.log(`TestApp server listening at http://127.0.0.1:${port}`);
      console.log(
        `Environment: ${isProduction ? 'Production' : 'Development'}`,
      );
      console.log(
        `Database: ${process.env.DATABASE_URL ? 'Configured' : 'Not configured'}`,
      );
    });
  })();

  // Handle graceful shutdown
  process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
  process.on('SIGINT', () => gracefulShutdown('SIGINT'));

  // Handle uncaught exceptions
  process.on('uncaughtException', (error) => {
    console.error('Uncaught Exception:', error);
    gracefulShutdown('uncaughtException');
  });

  process.on('unhandledRejection', (reason, promise) => {
    console.error('Unhandled Rejection at:', promise, 'reason:', reason);
    gracefulShutdown('unhandledRejection');
  });
}

export default app;
