import { GoogleGenerativeAI } from '@google/generative-ai';

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

  // Basic rate limiting (placeholder)
  if (req.headers['x-rate-limit']) {
    return res.status(429).json({ error: 'Rate limit exceeded' });
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: 'API key not configured' });
  }

  try {
    const ai = new GoogleGenerativeAI(apiKey);
    const config = { responseMimeType: 'text/plain' };
    const model = ai.getGenerativeModel({
      model: 'gemini-2.5-flash',
      generationConfig: config,
      systemInstruction:
        'Respond in plain text without any markdown formatting, asterisks, bold, italics, or special characters. Keep responses clean, natural, and easy to read.',
    });

    const result = await model.generateContent(message);
    const text = await result.response.text();
    res.json({ text });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: error.message || 'Internal server error' });
  }
};
