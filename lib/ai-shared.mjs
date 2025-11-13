import { GoogleGenerativeAI } from '@google/generative-ai';

function createAIModel(apiKey) {
  const ai = new GoogleGenerativeAI(apiKey);
  const config = { responseMimeType: 'text/plain' };
  const model = ai.getGenerativeModel({
    model: 'gemini-2.5-flash',
    generationConfig: config,
    systemInstruction:
      'Respond in plain text without any markdown formatting, asterisks, bold, italics, or special characters. Keep responses clean, natural, and easy to read.',
  });
  return model;
}

export { createAIModel };
