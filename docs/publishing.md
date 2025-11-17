# Publishing the Package

This document outlines the steps to publish the `@harpertoken/testapp-sdk` package to npm.

## Automated Publishing (Recommended)

The package is published automatically via GitHub Actions when changes are pushed to the `main` branch.

### Prerequisites

- An npm account with access to the `@harpertoken` scope.
- `NPM_TOKEN` secret configured in GitHub repository settings (see [GitHub docs](https://docs.github.com/en/actions/security-guides/using-secrets-in-github-actions)).

### How It Works

1. On push to `main`, the workflow (`.github/workflows/publish.yml`) runs preflight checks (lint, build, test).
2. Analyzes commits since last tag to determine version bump (major/minor/patch based on conventional commits).
3. Updates `package.json`, commits, tags, and pushes changes.
4. Publishes to npm and creates a GitHub release.

### Commit Conventions

Use conventional commits to trigger version bumps:

- `feat:` → minor version bump
- `fix:` → patch version bump
- `feat:` with `BREAKING CHANGE` → major version bump

## Manual Publishing (Fallback)

If automated publishing fails, publish manually:

### Prerequisites

- An npm account with access to the `@harpertoken` scope.
- Node.js and npm installed.

### Steps

1. **Log in to npm**:

   ```
   npm login
   ```

   Follow the prompts to authenticate.

2. **Build the package**:

   ```
   npm run build
   ```

   This compiles TypeScript and builds the distribution files.

3. **Publish the package**:
   ```
   npm publish --access public
   ```
   Note: Scoped packages default to private visibility. The `--access public` flag is required to publish publicly.

## Verification

After publishing, verify the package is live on npm:

```
npm view @harpertoken/testapp-sdk
```

## Notes

- Version bumping is handled automatically; manual version updates are not needed.
- For private packages, omit `--access public` and ensure you have a paid npm plan.
