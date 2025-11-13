#!/usr/bin/env node

import { readFileSync } from 'fs';
import { askAI } from '../lib/ai.mjs';

const version = readFileSync('VERSION', 'utf8').trim();

async function main() {
  const message = process.argv.slice(2).join(' ');
  if (!message) {
    console.error('Usage: npm run cli "Your prompt here"');
    process.exit(1);
  }

  console.log(`TestApp CLI v${version} - Cross-platform AI assistant`);
  console.log(
    'Processing your query... (may take a few seconds for AI inference)\n',
  );

  try {
    const response = await askAI(message);
    console.log(response);
    console.log('\n---');
    console.log('Response generated cleanly without noise.');
  } catch (error) {
    // Check for specific error types and provide fallback
    const errorText = error.message || error.toString();
    if (
      errorText.includes('429') ||
      errorText.includes('Too Many Requests') ||
      errorText.includes('quota') ||
      errorText.includes('rate limit') ||
      error.status === 429
    ) {
      console.log(
        "I'm a bit busy right now with lots of questions! How's your day going? 😊",
      );
      console.log('\n---');
      console.log('Response generated with fallback (quota exceeded).');
    } else {
      console.error('Error:', error.message);
      process.exit(1);
    }
  }
}

main();
