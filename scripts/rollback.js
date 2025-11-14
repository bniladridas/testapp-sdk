#!/usr/bin/env node

/**
 * Database Rollback Script
 *
 * This script removes all TestApp database tables.
 * USE WITH CAUTION - This will delete all data!
 *
 * Usage:
 *   node scripts/rollback.js
 *
 * Environment Variables:
 *   DATABASE_URL - PostgreSQL connection string
 */

import pkg from 'pg';
const { Pool } = pkg;
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { createInterface } from 'readline';
import { stdin, stdout } from 'process';
const readline = require('readline');

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables
dotenv.config({ path: join(__dirname, '..', '.env') });

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl:
    process.env.NODE_ENV === 'production'
      ? { rejectUnauthorized: false }
      : false,
});

async function confirmRollback() {
  return new Promise((resolve) => {
    const rl = createInterface({
      input: stdin,
      output: stdout,
    });

    rl.question(
      '⚠️  WARNING: This will delete ALL TestApp data. Are you sure? (type "yes" to confirm): ',
      (answer) => {
        rl.close();
        resolve(answer.toLowerCase() === 'yes');
      },
    );
  });
}

async function rollbackDatabase() {
  const client = await pool.connect();

  try {
    console.log('Starting database rollback...');

    // Check if we're in production
    if (process.env.NODE_ENV === 'production') {
      console.error('❌ Rollback not allowed in production environment');
      process.exit(1);
    }

    // Confirm rollback
    const confirmed = await confirmRollback();
    if (!confirmed) {
      console.log('Rollback cancelled.');
      return;
    }

    // Drop tables in reverse order
    await client.query('DROP TABLE IF EXISTS schema_migrations CASCADE');
    console.log('✓ Dropped schema_migrations table');

    await client.query('DROP TABLE IF EXISTS users CASCADE');
    console.log('✓ Dropped users table');

    console.log('Database rollback completed successfully!');
  } catch (error) {
    console.error('Rollback failed:', error);
    process.exit(1);
  } finally {
    client.release();
    await pool.end();
  }
}

// Run rollback if this script is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  rollbackDatabase().catch((error) => {
    console.error('Rollback script failed:', error);
    process.exit(1);
  });
}

export { rollbackDatabase };
