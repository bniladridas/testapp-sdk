# Publishing the Package

This document outlines the steps to publish the `@harpertoken/testapp-sdk` package to npm.

## Prerequisites

- An npm account with access to the `@harpertoken` scope.
- Node.js and npm installed.

## Steps

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

- Ensure the package version in `package.json` is updated for new releases.
- For private packages, omit `--access public` and ensure you have a paid npm plan.
