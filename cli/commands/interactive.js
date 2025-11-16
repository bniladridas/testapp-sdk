import { createInterface } from 'readline';
import chalk from 'chalk';
import { processQuery } from './process-query.js';
import { loadHistory, saveHistory } from '../history/index.js';

export async function runInteractive(argv) {
  console.log(chalk.cyan(`TestApp CLI v${argv.version} - Interactive Mode`));
  console.log(
    chalk.gray(
      'Type your questions and press Enter. Type "exit" or "quit" to leave.\n',
    ),
  );

  const rl = createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  let history = loadHistory();

  const ask = () => {
    rl.question('AI> ', async (input) => {
      const trimmed = input.trim();
      if (trimmed === 'exit' || trimmed === 'quit') {
        console.log(chalk.yellow('Goodbye!'));
        rl.close();
        process.exit(0);
        return;
      }
      if (trimmed.startsWith('/')) {
        // Handle commands
        const command = trimmed.slice(1).toLowerCase();
        if (command === 'clear') {
          history = [];
          saveHistory(history);
          console.log(chalk.green('History cleared.'));
        } else if (command === 'history') {
          if (history.length === 0) {
            console.log(chalk.gray('No history yet.'));
          } else {
            history.forEach((h, i) => {
              console.log(`${i + 1}. ${h.role}: ${h.text}`);
            });
          }
        } else if (command === 'help') {
          console.log(chalk.cyan('Commands: /clear, /history, /help, /exit'));
        } else {
          console.log(chalk.red('Unknown command. Type /help for commands.'));
        }
      } else if (trimmed) {
        history.push({ role: 'user', text: trimmed });
        const response = await processQuery(trimmed, argv, history);
        if (response) {
          history.push({ role: 'model', text: response });
          saveHistory(history);
        }
      }
      ask();
    });
  };

  ask();

  rl.on('close', () => {
    process.exit(0);
  });
}
