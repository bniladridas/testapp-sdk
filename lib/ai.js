import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';
import { createAIModel } from './ai-shared.js';

dotenv.config();

const askAI = async (message) => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) throw new Error('GEMINI_API_KEY not set');

  const model = createAIModel(apiKey);

  const maxRetries = 3;
  const baseDelay = 1000; // 1 second

  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      const result = await model.generateContent(message);
      const text = await result.response.text();
      return text;
    } catch (error) {
      const isRetryable =
        error.status === 503 ||
        error.status === 429 ||
        error.message?.includes('overloaded') ||
        error.message?.includes('temporarily unavailable') ||
        error.message?.includes('quota') ||
        error.message?.includes('rate limit');

      if (isRetryable && attempt < maxRetries - 1) {
        const delay = baseDelay * Math.pow(2, attempt); // Exponential backoff
        await new Promise((resolve) => setTimeout(resolve, delay));
        continue;
      }

      // If not retryable or max retries reached, throw
      throw error;
    }
  }
};

export { askAI };
