import { askAI } from '../../lib/ai.mjs';
import chalk from 'chalk';
import ora from 'ora';
import boxen from 'boxen';

export async function processQuery(message, argv, history = []) {
  if (!message || !message.trim()) {
    console.error(chalk.red('Error: No prompt provided.'));
    return;
  }

  if (!argv.json) {
    console.log(
      chalk.blue(`TestApp CLI v${argv.version} - Cross-platform AI assistant`),
    );
  }

  const spinner = ora({
    text: 'Processing your query... (may take a few seconds for AI inference)',
    spinner: 'dots',
  }).start();

  try {
    const response = await askAI(message, history);
    spinner.stop();

    if (argv.json) {
      console.log(
        JSON.stringify(
          {
            success: true,
            response: response,
            timestamp: new Date().toISOString(),
          },
          null,
          2,
        ),
      );
    } else {
      console.log(
        chalk.green(
          boxen(response, {
            padding: 1,
            margin: 1,
            borderStyle: 'round',
            borderColor: 'green',
          }),
        ),
      );
      if (argv.verbose) {
        console.log(chalk.gray('Response generated cleanly without noise.'));
      }
      return response;
    }
  } catch (error) {
    spinner.stop();

    const errorText = error.message || error.toString();
    let errorType = 'unknown';
    let userMessage = '';
    let suggestions = '';

    if (
      errorText.includes('429') ||
      errorText.includes('Too Many Requests') ||
      errorText.includes('quota') ||
      errorText.includes('rate limit') ||
      error.status === 429
    ) {
      errorType = 'quota';
      userMessage =
        "I'm a bit busy right now with lots of questions! How's your day going? 😊";
      suggestions = 'Try again later or check your API usage.';
    } else if (
      error.code === 'ECONNREFUSED' ||
      error.code === 'ENOTFOUND' ||
      error.code === 'ETIMEDOUT' ||
      error.message?.includes('network') ||
      error.message?.includes('connection') ||
      error.message?.includes('fetch failed')
    ) {
      errorType = 'network';
      userMessage = 'Network error: Unable to connect to AI service.';
      suggestions = 'Please check your internet connection and try again.';
    } else if (error.message?.includes('GEMINI_API_KEY')) {
      errorType = 'auth';
      userMessage = 'Authentication error: API key not configured.';
      suggestions = 'Set the GEMINI_API_KEY environment variable.';
    } else {
      errorType = 'api';
      userMessage = `API error: ${error.message}`;
      suggestions = 'Check the API status or try a different prompt.';
    }

    if (argv.json) {
      console.log(
        JSON.stringify(
          {
            success: false,
            error: {
              type: errorType,
              message: userMessage,
              suggestions: suggestions,
            },
            timestamp: new Date().toISOString(),
          },
          null,
          2,
        ),
      );
    } else {
      console.log(
        chalk.red(
          boxen(userMessage, {
            padding: 1,
            margin: 1,
            borderStyle: 'round',
            borderColor: 'red',
          }),
        ),
      );
      if (argv.verbose) {
        console.log(chalk.yellow(`Suggestions: ${suggestions}`));
      }
    }

    // Exit only for non-recoverable errors
    if (errorType === 'auth' || errorType === 'api') {
      process.exit(1);
    }
  }
}
