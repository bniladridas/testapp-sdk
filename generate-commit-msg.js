/**
 * Generates a conventional commit message using AI from git diff.
 * @param {string} diff - The git diff output.
 * @returns {Promise<string>} The generated commit message.
 */
async function generateCommitMessage(diff) {
  if (!diff) {
    throw new Error('No diff provided');
  }

  const prompt = `Generate a conventional commit message (type: description) for these git changes:

${diff}

Keep it under 50 characters, lowercase, no period.`;

  const msg = await askAI(prompt);
  return msg.trim();
}

// Main execution
import { askAI } from './lib/ai.mjs';

async function main() {
  const diff = process.argv[2];

  try {
    const msg = await generateCommitMessage(diff);
    console.log(msg);
  } catch (err) {
    console.error(`Error: ${err.message}`);
    process.exit(1);
  }
}

main();
