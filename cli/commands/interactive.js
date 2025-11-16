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
      let spinner = null;

      try {
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

          spinner = ora({
            text: 'AI is thinking...',
            spinner: 'dots',
          }).start();

          const response = await processQuery(trimmed, argv, history);
          spinner.stop();

          if (response) {
            console.log(chalk.blue('AI: ') + response);
            history.push({ role: 'model', text: response });
            saveHistory(history);
          }
        }
        ask();
      } catch (error) {
        if (spinner) {
          spinner.fail('AI request failed');
        }

        // Provide more specific error messages
        if (
          error.message?.includes('API_KEY') ||
          error.message?.includes('auth')
        ) {
          console.error(
            chalk.red(
              'Authentication Error: Please check your GEMINI_API_KEY environment variable.',
            ),
          );
        } else if (
          error.message?.includes('network') ||
          error.message?.includes('ECONNREFUSED')
        ) {
          console.error(
            chalk.red(
              'Network Error: Unable to connect to AI service. Please check your internet connection.',
            ),
          );
        } else if (
          error.message?.includes('quota') ||
          error.message?.includes('429')
        ) {
          console.error(
            chalk.red(
              'Quota Error: AI service is busy. Please try again later.',
            ),
          );
        } else {
          console.error(chalk.red('AI Error:'), error.message);
        }

        // Remove the failed user message from history
        if (history.length > 0 && history[history.length - 1].role === 'user') {
          history.pop();
        }

        ask();
      } finally {
        // Ensure spinner is always cleaned up
        if (spinner && !spinner.isSpinning) {
          // Spinner already stopped/failed
        }
      }
    });
  };

  ask();

  rl.on('close', () => {
    // Graceful shutdown - readline interface handles cleanup
    process.exit(0);
  });

  // Handle unexpected errors to ensure cleanup
  process.on('uncaughtException', (error) => {
    console.error(chalk.red('Unexpected error:'), error.message);
    rl.close();
  });

  process.on('unhandledRejection', (reason, promise) => {
    console.error(chalk.red('Unhandled rejection:'), reason);
    rl.close();
  });
}
