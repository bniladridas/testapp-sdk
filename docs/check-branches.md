# Check Branches Script

The `check-branches.js` script is a utility for validating the state of multiple feature branches in the TestApp repository.

## Overview

This script automates the process of checking that all feature branches meet certain development standards and requirements. It temporarily switches between branches, performs checks, and then returns to the original branch.

## Purpose

The script ensures that each feature branch has:

- Required library files (`lib/feature.mjs`)
- Corresponding test files (`lib/feature.test.mjs`)
- Passing tests
- Proper GitHub integration setup in the server

## Usage

Run the script from the repository root:

```bash
node check-branches.js
```

## What It Checks

For each feature branch in the predefined list:

1. **Library File**: Verifies `lib/{feature}.mjs` exists
2. **Test File**: Verifies `lib/{feature}.test.mjs` exists
3. **Tests**: Runs the full test suite (`npm test`) with test environment variables
4. **GitHub Setup**: Checks that `server.mjs` contains GitHub app configuration

## Feature Branches

The script checks the following branches:

- `commit-msg-enforcer`
- `code-review-assistant`
- `issue-manager`
- `docs-bot`
- `security-scanner`
- `release-helper`
- `workflow-automator`

## Behavior

- **Branch Switching**: Temporarily checks out each branch
- **Stashing**: Automatically stashes any uncommitted changes to avoid conflicts
- **Restoration**: Returns to the original branch and restores stashed changes
- **Exit Codes**: Exits with code 1 if any checks fail, 0 if all pass

## Environment Variables

When running tests, the script sets test values for:

- `GEMINI_API_KEY`
- `GITHUB_APP_ID`
- `GITHUB_PRIVATE_KEY`
- `GITHUB_WEBHOOK_SECRET`

## Output

The script provides detailed output for each branch:

```
Checking branch: feature-name
  ✅ Has lib/feature-name.mjs
  ✅ Has lib/feature-name.test.mjs
  ✅ Tests pass
  ✅ Has GitHub setup
```

## Error Handling

- Continues checking other branches even if one fails
- Reports specific failures for each check
- Provides error messages for checkout or test failures</content>
  <parameter name="filePath">docs/check-branches.md
