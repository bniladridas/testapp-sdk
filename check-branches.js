#!/usr/bin/env node

import { execSync } from 'child_process';
import fs from 'fs';

const branches = [
  'commit-msg-enforcer',
  'code-review-assistant',
  'issue-manager',
  'docs-bot',
  'security-scanner',
  'release-helper',
  'workflow-automator',
];

console.log('Checking conditions for all feature branches...\n');

let allPass = true;

for (const branch of branches) {
  console.log(`Checking branch: ${branch}`);
  try {
    // Checkout branch
    execSync(`git checkout ${branch}`, { stdio: 'pipe' });

    // Check if lib/feature.js exists
    const fileMap = {
      'commit-msg-enforcer': 'commit-msg-enforcer',
      'code-review-assistant': 'code-review',
      'issue-manager': 'issue-manager',
      'docs-bot': 'docs-bot',
      'security-scanner': 'security-scanner',
      'release-helper': 'release-helper',
      'workflow-automator': 'workflow-automator',
    };
    const featureName = fileMap[branch] || branch.replace(/-/g, '');
    const featureFile = `lib/${featureName}.js`;
    if (!fs.existsSync(featureFile)) {
      console.log(`  ❌ Missing ${featureFile}`);
      allPass = false;
    } else {
      console.log(`  ✅ Has ${featureFile}`);
    }

    // Check if lib/feature.test.js exists
    const testFile = `lib/${featureName}.test.js`;
    if (!fs.existsSync(testFile)) {
      console.log(`  ❌ Missing ${testFile}`);
      allPass = false;
    } else {
      console.log(`  ✅ Has ${testFile}`);
    }

    // Run tests (lib tests for branches, all for main)
    const testCommand =
      branch === 'main' ? 'npm test -- --run' : 'npm test -- lib/ --run';
    try {
      execSync(testCommand, {
        stdio: 'pipe',
        env: { ...process.env, GEMINI_API_KEY: 'test' },
      });
      console.log(`  ✅ Tests pass`);
    } catch (error) {
      console.log(
        `  ❌ Tests fail: ${error.stderr?.toString() || error.message}`,
      );
      allPass = false;
    }

    // Check if server.cjs has GitHub setup
    const serverContent = fs.readFileSync('server.cjs', 'utf8');
    if (serverContent.includes('githubApp')) {
      console.log(`  ✅ Has GitHub setup`);
    } else {
      console.log(`  ❌ Missing GitHub setup`);
      allPass = false;
    }
  } catch (error) {
    console.log(`  ❌ Error checking branch: ${error.message}`);
    allPass = false;
  }
  console.log('');
}

// Switch back to main
execSync('git checkout main', { stdio: 'pipe' });

if (allPass) {
  console.log('🎉 All branches meet the conditions!');
} else {
  console.log('❌ Some branches do not meet the conditions.');
  process.exit(1);
}
