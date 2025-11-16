import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'fs';
import { join } from 'path';
import { homedir } from 'os';

// Use user config directory for cross-project persistence
const CONFIG_DIR = join(homedir(), '.config', 'testapp-cli');
const HISTORY_FILE = join(CONFIG_DIR, 'history.json');

// Ensure config directory exists
try {
  if (!existsSync(CONFIG_DIR)) {
    mkdirSync(CONFIG_DIR, { recursive: true });
  }
} catch (error) {
  // Fallback to project directory if config dir creation fails
  console.warn(
    'Could not create user config directory, using project directory for history',
  );
}

export function loadHistory() {
  if (existsSync(HISTORY_FILE)) {
    try {
      const data = readFileSync(HISTORY_FILE, 'utf8');
      return JSON.parse(data);
    } catch (error) {
      console.error('Error loading history:', error.message);
      return [];
    }
  }
  return [];
}

export function saveHistory(history) {
  try {
    writeFileSync(HISTORY_FILE, JSON.stringify(history, null, 2));
  } catch (error) {
    console.error('Error saving history:', error.message);
  }
}
