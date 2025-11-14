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

### Quick Setup (Recommended)

Use the automated setup script for a complete environment setup:

```sh
./setup.sh
npm run dev
```

This script installs dependencies, sets up the environment, configures PostgreSQL, creates the database, and runs migrations.

### Manual Setup

If you prefer manual setup:

```sh
npm install
npm run dev
```

Open `http://localhost:5173` in your browser.

### Database Setup

TestApp uses PostgreSQL for data persistence. Before running the application:

1. **Install PostgreSQL** (if not already installed):
   - macOS: `brew install postgresql`
   - Ubuntu: `sudo apt install postgresql postgresql-contrib`
   - Or use a cloud provider like Supabase, Neon, or Railway

2. **Create a database**:

   ```sql
   CREATE DATABASE testapp;
   ```

3. **Configure environment variables**:
   Copy `.env.example` to `.env` and set:

   ```env
   DATABASE_URL=postgresql://username:password@localhost:5432/testapp
   ```

4. **Run database migrations**:
   ```sh
   npm run migrate
   ```

For development, you can also reset the database:

```sh
npm run rollback  # ⚠️  WARNING: Deletes all data!
npm run migrate   # Recreate schema
npm run test:db   # Test database connectivity and operations
```

### Authentication

The app requires user authentication. To test:

1. Go to the signup page and create an account (e.g., email: `test@example.com`, password: `password123`).
2. Login with the same credentials.
3. Access the AI chat features.

User data is stored in PostgreSQL database. See [Database Setup](#database-setup) below.

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
- `npm run migrate`: Run database migrations
- `npm run rollback`: Rollback database (development only)
- `npm run test:db`: Test database connectivity and operations
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

- [API Reference](docs/api.md) - Complete API documentation
- [Authentication](docs/authentication.md) - User authentication system
- [Database](docs/database.md) - Database setup and operations
- [Docker](docs/docker.md) - Containerization and deployment
- [Check Branches](docs/check-branches.md) - Branch validation script
- [Husky](docs/husky.md) - Pre-commit hooks and code quality
- [Rewrite Commits](docs/rewrite-commits.md) - Script to rewrite commit messages
- [Security](docs/security.md) - Security measures and best practices
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

### Testing Workflows Locally

Use [act](https://github.com/nektos/act) to test GitHub Actions workflows locally:

```sh
# Test e2e workflow
act -j e2e -P ubuntu-latest=catthehacker/ubuntu:act-latest --container-architecture linux/amd64 --secret GEMINI_API_KEY=your_key

# Test docker workflow (requires Docker Hub and GHCR secrets)
act -j build-and-push -P ubuntu-latest=catthehacker/ubuntu:act-latest --container-architecture linux/amd64 --secret DOCKER_USERNAME=your_username --secret DOCKER_PASSWORD=your_password --secret GH_PAT=your_github_pat
```

## Docker

TestApp supports Docker for containerized deployment. Images are automatically built and pushed to Docker Hub and GitHub Container Registry on main branch pushes and releases.

To build locally: `docker build -t testapp:latest docker/`

See [Docker documentation](docs/docker.md) for complete details.

## Conventional Commits

Uses conventional commit standards. See scripts for enforcement.

## Contributing

See CONTRIBUTING.md.

## License

MIT
