import express from 'express';
import cors from 'cors';
import path from 'path';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { fileURLToPath } from 'url';

dotenv.config();

// Simple in-memory user store (for demo purposes)
const users = [];

const { App } = await import('@octokit/app');
const { createNodeMiddleware } = await import('@octokit/webhooks');

const __dirname = path.dirname(fileURLToPath(import.meta.url));

import { askAI } from './lib/ai.mjs';

const app = express();
const port = process.env.PORT || 3001;
const isProduction = process.env.NODE_ENV === 'production';
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

// Security headers
app.use(helmet());

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

// Rate limiter for API endpoints
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.',
});

// JWT authentication middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Invalid or expired token' });
    }
    req.user = user;
    next();
  });
};

// Auth endpoints
app.post('/api/auth/signup', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password required' });
  }

  // Check if user exists
  const existingUser = users.find((u) => u.email === email);
  if (existingUser) {
    return res.status(400).json({ error: 'User already exists' });
  }

  // Hash password
  const hashedPassword = await bcrypt.hash(password, 10);

  // Create user
  const user = { id: users.length + 1, email, password: hashedPassword };
  users.push(user);

  // Generate token
  const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, {
    expiresIn: '24h',
  });

  res.json({ token, user: { id: user.id, email: user.email } });
});

app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password required' });
  }

  // Find user
  const user = users.find((u) => u.email === email);
  if (!user) {
    return res.status(400).json({ error: 'Invalid credentials' });
  }

  // Check password
  const validPassword = await bcrypt.compare(password, user.password);
  if (!validPassword) {
    return res.status(400).json({ error: 'Invalid credentials' });
  }

  // Generate token
  const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, {
    expiresIn: '24h',
  });

  res.json({ token, user: { id: user.id, email: user.email } });
});

// Health check endpoint
app.get('/api/health', (_, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Reset users for testing
app.post('/api/test/reset', (_, res) => {
  users.length = 0;
  res.json({ status: 'reset' });
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

if (import.meta.url === `file://${process.argv[1]}`) {
  app.listen(port, '127.0.0.1', () => {
    console.log(`TestApp server listening at http://127.0.0.1:${port}`);
    console.log(`Environment: ${isProduction ? 'Production' : 'Development'}`);
  });
}

export default app;
