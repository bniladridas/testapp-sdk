import { askAI } from '../lib/index.mjs';

async function main() {
  const prompt = process.argv[2] || 'Hello, what is the meaning of life?';
  try {
    const response = await askAI(prompt);
    console.log('AI Response:', response);
    process.exit(0);
  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
}

main();
