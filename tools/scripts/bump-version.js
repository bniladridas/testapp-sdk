#!/usr/bin/env node

import { readFileSync, writeFileSync } from 'fs';
import { execSync } from 'child_process';

const packageJsonPath = 'package.json';

// Read current version
const packageJson = JSON.parse(readFileSync(packageJsonPath, 'utf8'));
const currentVersion = packageJson.version;

// Get last tag
let lastTag;
try {
  lastTag = execSync('git describe --tags --abbrev=0', {
    encoding: 'utf8',
  }).trim();
} catch (e) {
  lastTag = 'v0.0.0'; // If no tags, start from 0.0.0
}

// Get commits since last tag
const commits = execSync(`git log --oneline ${lastTag}..HEAD`, {
  encoding: 'utf8',
})
  .split('\n')
  .filter((line) => line.trim());

// Determine bump type
let bumpType = 'patch'; // default
let hasBreaking = false;
let hasFeat = false;
let hasFix = false;

for (const commit of commits) {
  const msg = commit.split(' ').slice(1).join(' ').toLowerCase();
  if (msg.includes('breaking change') || msg.startsWith('feat!:')) {
    hasBreaking = true;
  } else if (msg.startsWith('feat:')) {
    hasFeat = true;
  } else if (msg.startsWith('fix:')) {
    hasFix = true;
  }
}

if (hasBreaking) {
  bumpType = 'major';
} else if (hasFeat) {
  bumpType = 'minor';
} else if (hasFix) {
  bumpType = 'patch';
} else {
  console.log('No version bump needed');
  process.exit(0);
}

// Bump version
const [major, minor, patch] = currentVersion.split('.').map(Number);
let newVersion;
if (bumpType === 'major') {
  newVersion = `${major + 1}.0.0`;
} else if (bumpType === 'minor') {
  newVersion = `${major}.${minor + 1}.0`;
} else {
  newVersion = `${major}.${minor}.${patch + 1}`;
}

console.log(
  `Bumping version from ${currentVersion} to ${newVersion} (${bumpType})`,
);

// Update package.json
packageJson.version = newVersion;
writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2) + '\n');

// Commit and tag
execSync(`git add package.json`);
execSync(`git commit -m "chore: bump version to ${newVersion}"`);
execSync(`git tag v${newVersion}`);

// Push
execSync(`git push origin main`);
execSync(`git push origin v${newVersion}`);
