import { readFileSync, writeFileSync, existsSync } from 'fs';
import { join } from 'path';

const HISTORY_FILE = join(process.cwd(), 'cli', 'history.json');

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
