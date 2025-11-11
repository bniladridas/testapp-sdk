const express = require('express');
const cors = require('cors');
const path = require('path');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3001;
const isProduction = process.env.NODE_ENV === 'production';

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

const askAIPromise = import('./lib/ai.js').then(({ askAI }) => askAI);

// Rate limiter for API endpoints
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.',
});

// Health check endpoint
app.get('/api/health', (_, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.post('/api/ask-test-ai', apiLimiter, async (req, res) => {
  const { message } = req.body;
  if (!message) return res.status(400).json({ error: 'Missing message' });

  try {
    const askAI = await askAIPromise;
    const text = await askAI(message);
    res.json({ text });
  } catch (error) {
    console.error('Error:', error);

    // Check for specific error types
    if (
      error.message?.includes('503') ||
      error.message?.includes('429') ||
      error.message?.includes('overloaded') ||
      error.message?.includes('temporarily unavailable') ||
      error.message?.includes('quota') ||
      error.message?.includes('rate limit')
    ) {
      return res.json({
        text: "I'm a bit busy right now with lots of questions! How's your day going? 😊",
        fallback: true,
      });
    }

    // Other errors
    res
      .status(500)
      .json({ error: isProduction ? 'Internal server error' : error.message });
  }
});

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

if (require.main === module) {
  app.listen(port, () => {
    console.log(`TestApp server listening at http://localhost:${port}`);
    console.log(`Environment: ${isProduction ? 'Production' : 'Development'}`);
  });
}

module.exports = app;
