# TestApp

A simple single-page web application with AI-powered chat functionality, built with React and Vite.

## Clone

```sh
git clone https://github.com/bniladridas/TestApp.git
cd testapp
```

## Development Environment

### With Nix (recommended)

If you have Nix installed with flakes enabled:

```sh
nix develop
```

If flakes are not enabled, enable them permanently by adding to `~/.config/nix/nix.conf` or `/etc/nix/nix.conf`:

```
experimental-features = nix-command flakes
```

Then restart your shell or run:

```sh
nix develop
```

Alternatively, use flags each time:

```sh
nix develop --extra-experimental-features nix-command --extra-experimental-features flakes
```

This provides a reproducible environment with Node.js 20, npm, and git.

### Without Nix

Ensure you have Node.js 20+ installed.

## Getting Started

To run locally:

```sh
npm install
npm run dev
```

Open `http://localhost:5173` in your browser.

### Authentication

The app requires user authentication. To test:

1. Go to the signup page and create an account (e.g., email: `test@example.com`, password: `password123`).
2. Login with the same credentials.
3. Access the AI chat features.

Note: User data is stored in-memory, so restarting the server will clear all users.

### Running E2E Tests

To run end-to-end tests locally:

1. Start the backend server: `npm run server`
2. In another terminal, run: `npm run test:e2e`

The tests will automatically start the frontend server and test signup, login, and AI chat flows.

### CLI Usage

Use the AI from command line:

```sh
npm run cli "Your prompt here"
```

Set `GEMINI_API_KEY` in `.env`.

## Scripts

- `npm run dev`: Start dev servers
- `npm run build`: Build for production
- `npm run lint`: Run ESLint
- `npm run preview`: Preview build
- `npm run test`: Run unit tests
- `npm run test:e2e`: Run e2e tests
- `npm run preflight`: Run lint, duplicate-check, build, test:coverage
- `npm run cli`: Run CLI with AI prompts
- `npm start`: Start production server

## Files

- `package.json`: Dependencies and scripts
- `vite.config.ts`: Build configuration
- `server.mjs`: Backend API server (ES modules)
- `lib/`: ES module library files (.mjs)
- `vercel.json`: Vercel deployment config
- `env.example`: Environment variables template

## Requirements

- Node.js 20 or later
- npm

## Documentation

Detailed documentation is available in the [docs/](docs/) directory:

- [Test Coverage](docs/test-coverage.md) - Testing enhancements and coverage details
- [Bundle Size Monitoring](docs/bundle-size.md) - Bundle size optimization and monitoring

## Versioning

This project uses semantic versioning with version stored in `VERSION` file.

## Dependencies

This project uses:

- `package.json` - dependencies and devDependencies
- `package-lock.json` - exact versions for reproducibility

## CI Workflow

The CI workflow runs automated tests, linting, duplicate code checks, and coverage on every push and pull request to the main branch using GitHub Actions. It includes:

- Unit tests with coverage thresholds
- ESLint linting
- Duplicate code detection with jscpd
- E2E tests with Playwright
- Build checks

## Conventional Commits

Uses conventional commit standards. See scripts for enforcement.

## Contributing

See CONTRIBUTING.md.

## License

MIT
