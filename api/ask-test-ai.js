import { createAIModel } from '../lib/ai-shared.mjs';

export default async (req, res) => {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { message } = req.body;
  if (!message) return res.status(400).json({ error: 'Missing message' });

  // Prevent caching of API responses
  res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
  res.setHeader('Pragma', 'no-cache');
  res.setHeader('Expires', '0');

  // Basic rate limiting (placeholder)
  if (req.headers['x-rate-limit']) {
    return res.status(429).json({ error: 'Rate limit exceeded' });
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: 'API key not configured' });
  }

  try {
    const model = createAIModel(apiKey);

    const result = await model.generateContent(message);
    const text = await result.response.text();
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

    res.status(500).json({ error: error.message || 'Internal server error' });
  }
};
