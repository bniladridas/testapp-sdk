#!/usr/bin/env node

import { execSync } from 'child_process';
import { writeFileSync } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
const backupFile = `backup-${timestamp}.sql`;
const backupPath = path.join(__dirname, '../../backups', backupFile);

// Ensure backups directory exists
execSync('mkdir -p ../../backups', { cwd: __dirname });

// Get database URL from environment
const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  console.error('DATABASE_URL environment variable is not set');
  process.exit(1);
}

try {
  console.log(`Creating database backup: ${backupFile}`);

  // Use pg_dump to create backup
  const pgDumpCommand = `pg_dump "${databaseUrl}" > "${backupPath}"`;

  execSync(pgDumpCommand, { stdio: 'inherit' });

  console.log(`Backup created successfully: ${backupPath}`);

  // Create a log entry
  const logEntry = `${new Date().toISOString()}: Backup created - ${backupFile}\n`;
  writeFileSync(path.join(__dirname, '../../backups/backup.log'), logEntry, {
    flag: 'a',
  });
} catch (error) {
  console.error('Backup failed:', error.message);
  process.exit(1);
}
