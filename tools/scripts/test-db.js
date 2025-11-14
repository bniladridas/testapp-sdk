#!/usr/bin/env node

/**
 * Database Test Script
 *
 * Tests database connectivity and basic operations.
 * Run this after setting up PostgreSQL and running migrations.
 *
 * Usage:
 *   node tools/scripts/test-db.js
 */

import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { pool, initDatabase } from '../lib/database.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables
dotenv.config({ path: join(__dirname, '..', '.env') });

async function testDatabase() {
  console.log('Testing database functionality...\n');

  try {
    // Test 1: Initialize database
    console.log('1. Testing database initialization...');
    await initDatabase();
    console.log('✓ Database initialized successfully\n');

    // Test 2: Basic connectivity
    console.log('2. Testing basic connectivity...');
    const result = await pool.query('SELECT NOW() as current_time');
    console.log(
      '✓ Connected to database at:',
      result.rows[0].current_time,
      '\n',
    );

    // Test 3: User operations
    console.log('3. Testing user operations...');

    // Create test user
    const testEmail = `test-${Date.now()}@example.com`;
    const testPassword = 'hashedpassword123';

    const insertResult = await pool.query(
      'INSERT INTO users (email, password_hash) VALUES ($1, $2) RETURNING id, email',
      [testEmail, testPassword],
    );
    const userId = insertResult.rows[0].id;
    console.log('✓ Created test user:', insertResult.rows[0]);

    // Find user
    const findResult = await pool.query(
      'SELECT id, email FROM users WHERE email = $1',
      [testEmail],
    );
    console.log('✓ Found user:', findResult.rows[0]);

    // Test duplicate prevention
    try {
      await pool.query(
        'INSERT INTO users (email, password_hash) VALUES ($1, $2)',
        [testEmail, 'anotherpassword'],
      );
      console.log('✗ Duplicate email prevention failed');
    } catch (error) {
      if (error.code === '23505') {
        // unique_violation
        console.log('✓ Duplicate email prevention working');
      } else {
        throw error;
      }
    }

    // Clean up
    await pool.query('DELETE FROM users WHERE id = $1', [userId]);
    console.log('✓ Cleaned up test user\n');

    // Test 4: Health check
    console.log('4. Testing health check...');
    await pool.query('SELECT 1');
    console.log('✓ Health check passed\n');

    console.log('🎉 All database tests passed!');
  } catch (error) {
    console.error('❌ Database test failed:', error);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

// Run tests if this script is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  testDatabase().catch((error) => {
    console.error('Test script failed:', error);
    process.exit(1);
  });
}

export { testDatabase };
