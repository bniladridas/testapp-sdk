import { test, expect } from '@playwright/test';
import { spawn } from 'child_process';
import { join } from 'path';

test.describe('CLI E2E Tests', () => {
  test('should display help information', async () => {
    const cli = spawn('node', [join(process.cwd(), 'cli/index.js'), '--help'], {
      stdio: ['pipe', 'pipe', 'pipe'],
    });

    let stdout = '';
    let stderr = '';

    cli.stdout.on('data', (data) => {
      stdout += data.toString();
    });

    cli.stderr.on('data', (data) => {
      stderr += data.toString();
    });

    await new Promise((resolve) => {
      cli.on('close', resolve);
    });

    expect(stdout).toContain(
      'TestApp CLI v1.0.0 - Cross-platform AI assistant',
    );
    expect(stdout).toContain('Usage:');
    expect(stdout).toContain('--help');
    expect(stdout).toContain('--interactive');
  });

  test('should handle invalid prompt', async () => {
    const cli = spawn('node', [join(process.cwd(), 'cli/index.js')], {
      stdio: ['pipe', 'pipe', 'pipe'],
    });

    let stdout = '';
    let stderr = '';

    cli.stdout.on('data', (data) => {
      stdout += data.toString();
    });

    cli.stderr.on('data', (data) => {
      stderr += data.toString();
    });

    await new Promise((resolve) => {
      cli.on('close', resolve);
    });

    expect(stderr).toContain('Error: No prompt provided.');
  });

  test('should start interactive mode', async () => {
    const cli = spawn(
      'node',
      [join(process.cwd(), 'cli/index.js'), '--interactive'],
      {
        stdio: ['pipe', 'pipe', 'pipe'],
      },
    );

    let stdout = '';

    cli.stdout.on('data', (data) => {
      stdout += data.toString();
      if (stdout.includes('AI>')) {
        cli.kill('SIGTERM');
      }
    });

    await new Promise((resolve) => {
      cli.on('close', resolve);
    });

    expect(stdout).toContain('TestApp CLI v1.0.0 - Interactive Mode');
    expect(stdout).toContain('Type your questions and press Enter');
    expect(stdout).toContain('AI>');
  });

  // test('should handle commands in interactive mode', async () => {
  //   const cli = spawn('node', [join(process.cwd(), 'cli/index.js'), '--interactive'], {
  //     stdio: ['pipe', 'pipe', 'pipe'],
  //   });

  //   let stdout = '';

  //   const commands = ['/help\n', '/history\n', '/clear\n', '/exit\n'];
  //   let commandIndex = 0;

  //   cli.stdout.on('data', (data) => {
  //     stdout += data.toString();
  //     if (stdout.includes('AI>') && commandIndex < commands.length) {
  //       cli.stdin.write(commands[commandIndex]);
  //       commandIndex++;
  //     }
  //   });

  //   await new Promise((resolve) => {
  //     cli.on('close', resolve);
  //   });

  //   expect(stdout).toContain('Commands: /clear, /history, /help, /exit');
  //   expect(stdout).toContain('No history yet.');
  //   expect(stdout).toContain('History cleared.');
  //   expect(stdout).toContain('Goodbye!');
  // });
});
