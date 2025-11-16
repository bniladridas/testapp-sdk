#!/usr/bin/env node

import { readFileSync } from 'fs';
import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';
import chalk from 'chalk';
import { processQuery } from './commands/process-query.js';
import { runInteractive } from './commands/interactive.js';

const version = readFileSync('VERSION', 'utf8').trim();

async function main(args = process.argv) {
  const argv = yargs(hideBin(args))
    .option('help', {
      alias: 'h',
      type: 'boolean',
      description: 'Show help information',
    })
    .option('interactive', {
      alias: 'i',
      type: 'boolean',
      description: 'Start interactive mode for continuous queries',
    })
    .option('verbose', {
      type: 'boolean',
      description: 'Enable verbose output',
    })
    .option('json', {
      type: 'boolean',
      description: 'Output in JSON format',
    })
    .help(false)
    .version(version)
    .parse(hideBin(args));

  argv.version = version; // add version to argv

  if (argv.help) {
    console.log(
      chalk.cyan(`
TestApp CLI v${version} - Cross-platform AI assistant

Usage:
  npm run cli "Your prompt here" [options]
  npm run cli --interactive [options]

Options:
  -h, --help         Show help message
  -v, --version      Show version number
  -i, --interactive  Start interactive mode for continuous queries
  --verbose          Enable verbose output
  --json             Output in JSON format

Examples:
  npm run cli "Hello, how are you?"
  npm run cli -- --interactive --verbose
  npm run cli "Generate code" -- --json
`),
    );
    return;
  }

  if (argv.interactive) {
    runInteractive(argv);
  } else {
    const message = argv._.join(' ');
    if (!message) {
      console.error(chalk.red('Error: No prompt provided.'));
      console.log(chalk.yellow('Usage: npm run cli "Your prompt here"'));
      console.log(chalk.yellow('Run with --help for more information.'));
      process.exit(1);
    }

    await processQuery(message, argv);
  }
}

if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}

export { main };
