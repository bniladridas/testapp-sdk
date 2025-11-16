import { askAI } from '../../lib/ai.mjs';
import chalk from 'chalk';
import ora from 'ora';
import boxen from 'boxen';

const errorDefinitions = [
  {
    type: 'quota',
    keywords: ['429', 'Too Many Requests', 'quota', 'rate limit'],
    status: 429,
    message:
      "I'm a bit busy right now with lots of questions! How's your day going? 😊",
    suggestions: 'Try again later or check your API usage.',
  },
  {
    type: 'network',
    codes: ['ECONNREFUSED', 'ENOTFOUND', 'ETIMEDOUT'],
    keywords: ['network', 'connection', 'fetch failed'],
    message: 'Network error: Unable to connect to AI service.',
    suggestions: 'Please check your internet connection and try again.',
  },
  {
    type: 'auth',
    keywords: ['GEMINI_API_KEY'],
    message: 'Authentication error: API key not configured.',
    suggestions: 'Set the GEMINI_API_KEY environment variable.',
  },
  {
    type: 'api',
    message: null, // Dynamic message
    suggestions: 'Check the API status or try a different prompt.',
  },
];

function classifyError(error) {
  const errorText = error.message || error.toString();

  for (const definition of errorDefinitions) {
    // Check keywords in error text
    if (
      definition.keywords &&
      definition.keywords.some((keyword) => errorText.includes(keyword))
    ) {
      return {
        type: definition.type,
        message: definition.message || `API error: ${error.message}`,
        suggestions: definition.suggestions,
      };
    }

    // Check error codes
    if (definition.codes && definition.codes.includes(error.code)) {
      return {
        type: definition.type,
        message: definition.message,
        suggestions: definition.suggestions,
      };
    }

    // Check status codes
    if (definition.status && error.status === definition.status) {
      return {
        type: definition.type,
        message: definition.message,
        suggestions: definition.suggestions,
      };
    }
  }

  // Default to API error
  return {
    type: 'api',
    message: `API error: ${error.message}`,
    suggestions: 'Check the API status or try a different prompt.',
  };
}

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

    const errorClassification = classifyError(error);
    const {
      type: errorType,
      message: userMessage,
      suggestions,
    } = errorClassification;

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
