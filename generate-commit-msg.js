import { askAI } from './lib/ai.mjs';

const diff = process.argv[2];
if (!diff) {
  console.error('No diff provided');
  process.exit(1);
}

const prompt = `Generate a conventional commit message (type: description) for these git changes:\n\n${diff}\n\nKeep it under 50 characters, lowercase, no period.`;

askAI(prompt)
  .then((msg) => {
    console.log(msg.trim());
  })
  .catch((err) => {
    console.error('Error generating message:', err);
    process.exit(1);
  });
