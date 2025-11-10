#!/usr/bin/env node

import { readFileSync } from 'fs';
import { askAI } from '../lib/ai.js';

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
    console.error('Error:', error.message);
    process.exit(1);
  }
}

main();
