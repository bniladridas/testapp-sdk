const { GoogleGenerativeAI } = require('@google/generative-ai');
require('dotenv').config();

const askAI = async (message) => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) throw new Error('GEMINI_API_KEY not set');

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
  return text;
};

module.exports = { askAI };
