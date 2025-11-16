import { createInterface } from 'readline';
import chalk from 'chalk';
import ora from 'ora';
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
        } else if (command === 'exit' || command === 'quit') {
          console.log(chalk.yellow('Goodbye!'));
          rl.close();
          return;
        } else {
          console.log(chalk.red('Unknown command. Type /help for commands.'));
        }
      } else if (trimmed) {
        history.push({ role: 'user', text: trimmed });

        const spinner = ora({
          text: 'AI is thinking...',
          spinner: 'dots',
        }).start();

        try {
          const response = await processQuery(trimmed, argv, history);
          spinner.stop();

          if (response) {
            console.log(chalk.blue('AI: ') + response);
            history.push({ role: 'model', text: response });
            saveHistory(history);
          }
        } catch (error) {
          spinner.stop();
          console.error(chalk.red('Error processing query:'), error.message);
          // Remove the failed user message from history
          history.pop();
        }
      }
      ask();
    });
  };

  ask();

  rl.on('close', () => {
    // Graceful shutdown - readline interface handles cleanup
  });
}
