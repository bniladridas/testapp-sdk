#!/usr/bin/env node

import { askAI } from '../lib/ai.js';

async function main() {
  const message = process.argv.slice(2).join(' ');
  if (!message) {
    console.error('Usage: npm run cli "Your prompt here"');
    process.exit(1);
  }

  try {
    const response = await askAI(message);
    console.log(response);
  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
}

main();
