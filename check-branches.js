#!/usr/bin/env node

import { execSync } from 'child_process';
import fs from 'fs';

// The script hardcodes checking out the main branch at the end. This could be unexpected if the script is run from a different branch. It's better practice to return to the original branch.
const originalBranch = execSync('git rev-parse --abbrev-ref HEAD')
  .toString()
  .trim();

// Stash any local changes to avoid conflicts when switching branches
try {
  execSync('git stash push -m "temp stash for branch check"', {
    stdio: 'pipe',
  });
} catch (error) {
  // No changes to stash, continue
}

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
    // The fileMap is quite verbose, with most keys mapping to identical values. The fallback logic branch.replace(/-/g, '') is also unused and would likely produce incorrect names if it were ever triggered. You can make this code more concise and maintainable by defining a map for only the exceptional cases and using the branch name as the default.
    const featureNameMap = {
      'code-review-assistant': 'code-review',
    };
    const featureName = featureNameMap[branch] || branch;
    const featureFile = `lib/${featureName}.mjs`;
    if (!fs.existsSync(featureFile)) {
      console.log(`  ❌ Missing ${featureFile}`);
      allPass = false;
    } else {
      console.log(`  ✅ Has ${featureFile}`);
    }

    // Check if lib/feature.test.mjs exists
    const testFile = `lib/${featureName}.test.mjs`;
    if (!fs.existsSync(testFile)) {
      console.log(`  ❌ Missing ${testFile}`);
      allPass = false;
    } else {
      console.log(`  ✅ Has ${testFile}`);
    }

    // Run tests (lib tests for branches, all for main)
    // The test command is currently configured to only run tests within the lib/ directory for feature branches. This means test-unit/server.test.js, where you've added new Octokit mocks, won't be executed. This seems to defeat the purpose of adding those mocks for full coverage on all branches. Additionally, the branch === 'main' check is currently dead code as 'main' is not in the branches array. To ensure all tests are run on all branches, you should use the general test command.
    const testCommand = 'npm test -- --run --include="lib/**/*.test.mjs"';
    try {
      execSync(testCommand, {
        stdio: 'pipe',
        env: {
          ...process.env,
          GEMINI_API_KEY: 'test',
          GITHUB_APP_ID: '123',
          GITHUB_PRIVATE_KEY: 'test',
          GITHUB_WEBHOOK_SECRET: 'test',
        },
      });
      console.log(`  ✅ Tests pass`);
    } catch (error) {
      console.log(
        `  ❌ Tests fail: ${error.stderr?.toString() || error.message}`,
      );
      allPass = false;
    }

    // Check if server.mjs has GitHub setup
    const serverContent = fs.readFileSync('server.mjs', 'utf8');
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

// Switch back to original branch
execSync(`git checkout ${originalBranch}`, { stdio: 'pipe' });

// Restore stashed changes
try {
  execSync('git stash pop', { stdio: 'pipe' });
} catch (error) {
  // No stash to pop, continue
}

if (allPass) {
  console.log('🎉 All branches meet the conditions!');
} else {
  console.log('❌ Some branches do not meet the conditions.');
  process.exit(1);
}
