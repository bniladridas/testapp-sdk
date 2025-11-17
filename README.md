# TestApp

[![Node.js Version](https://img.shields.io/badge/node-%3E%3D20.0.0-brightgreen)](https://nodejs.org/)
[![Pipeline](https://gitlab.com/harpertoken/testapp-sdk/badges/main/pipeline.svg)](https://gitlab.com/harpertoken/testapp-sdk/-/pipelines)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

A modern single-page web application with AI-powered chat functionality, featuring internationalization, offline support, and accessibility enhancements. Built with React, Vite, and integrated with Google's Gemini AI.

This package also serves as an SDK for reusable AI and automation utilities.

## SDK Usage

Install via npm:

```sh
npm install @harpertoken/testapp-sdk
```

Import and use utilities:

```js
import { askAI, handleSecurityScan } from '@harpertoken/testapp-sdk';

// AI interaction
const response = await askAI('Explain quantum computing');

// Security scanning (requires octokit instance)
await handleSecurityScan(octokit, payload);
```

Available modules can be imported directly via subpaths (e.g., `@harpertoken/testapp-sdk/ai`). For a complete list, see the `exports` field in `package.json`. Key modules include:

- **ai**: Core AI interaction functions.
- **security-scanner**: Utilities for security scanning.
- **database**: Database initialization and connection pool management.
- **code-review**: Automated code review helpers.
- **docs-bot**: Documentation generation and checking utilities.
- **issue-manager**: Tools for managing GitHub issues.
- **release-helper**: Release automation utilities.
- **workflow-automator**: Helpers for automating GitHub workflows.

Set environment variables: `GEMINI_API_KEY`, `DATABASE_URL` as needed.

> [!IMPORTANT]
> Ensure `GEMINI_API_KEY` is set before using AI features to avoid errors.

The full API of this application can be found in [docs/api.md](docs/api.md).

SDK documentation: [docs/sdk.md](docs/sdk.md).

## Installation

### Quick Setup (Recommended)

Use the automated setup script for a complete environment setup:

```sh
git clone https://gitlab.com/harpertoken/testapp-sdk.git
cd testapp-sdk
./setup.sh
npm run dev
```

> [!NOTE]
> The setup script requires Docker for PostgreSQL. Ensure Docker Desktop is running.

This script installs dependencies, sets up PostgreSQL, creates the database, runs migrations, and starts the development server.

### Live Demo

A live demo is available at: **[https://ui-lib-fawn.vercel.app](https://ui-lib-fawn.vercel.app)**

- **Login Page**: [https://ui-lib-fawn.vercel.app/login](https://ui-lib-fawn.vercel.app/login)
- **Signup**: Create a new account to test the full functionality
- **Automated Deployment**: Changes to main branch deploy automatically via GitLab CI/CD

### Manual Setup

If you prefer manual setup:

```sh
npm install
cp env.example .env
# Edit .env with your GEMINI_API_KEY and database settings
npm run migrate
npm run dev
```

## Database Setup

TestApp uses PostgreSQL for data persistence. The setup script handles this automatically, but manual setup options are available below.

### Automated Setup (Recommended)

Use the `setup.sh` script for a complete environment setup:

```sh
./setup.sh
```

This automatically sets up a local PostgreSQL database using Docker and runs all necessary migrations.

> [!NOTE]
> The setup script requires Docker for PostgreSQL. Ensure Docker Desktop is running.

### Manual Local Setup

If you prefer manual setup:

1. **Install PostgreSQL** (if not already installed):
   - macOS: `brew install postgresql`
   - Ubuntu: `sudo apt install postgresql postgresql-contrib`

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

### Production Setup

For production deployment on Vercel, use a cloud PostgreSQL provider:

1. **Neon** (Recommended): Serverless PostgreSQL
   - Sign up at [neon.tech](https://neon.tech)
   - Create a project and copy the `DATABASE_URL`
   - Set it in Vercel's Environment Variables

2. **Other Providers**: Railway, Supabase, or any PostgreSQL host

The database tables are created automatically on first run.

See [Database Documentation](docs/database.md), [Database Queries](docs/database-queries.md), and [Deployment Guide](docs/deployment.md) for detailed production setup.

## Usage

### Authentication

The app requires user authentication. To test:

1. Go to the signup page and create an account (e.g., email: `test@example.com`, password: `password123`).
2. Login with the same credentials.
3. Access the AI chat features.

### AI Chat

Interact with the AI chat by clicking the floating chat button. The chat supports:

- Real-time responses from Gemini AI
- Message history
- Fullscreen mode
- Auto-scrolling

### CLI Usage

The CLI provides a powerful command-line interface for AI interaction with conversation memory and interactive mode.

#### Single Query

```sh
npm run cli "Your question here"
```

#### Interactive Mode (Recommended)

```sh
npm run cli -- --interactive
```

#### Features

- **Conversation Memory**: Remembers entire conversation history
- **Persistent Sessions**: History saved across CLI restarts
- **Built-in Commands**: `/help`, `/history`, `/clear`, `/exit`
- **Context-Aware**: AI uses full conversation context
- **Advanced Options**: JSON output, verbose mode

See [CLI Documentation](docs/cli.md) for complete usage guide.

Set `GEMINI_API_KEY` in `.env`.

### Request & Response Types

The application includes TypeScript definitions for all components and API interactions. You may import and use them like so:

```ts
import { User, ChatMessage } from './src/types';
```

## Handling Errors

When the application encounters errors, React Error Boundaries provide graceful fallbacks. For API errors, the app displays user-friendly messages.

### Common Issues

- **API Key Error**: Ensure `GEMINI_API_KEY` is set in `.env`
- **Database Connection**: Run `npm run migrate` to set up the database
- **Build Fails**: Run `npm install` and check Node.js version (20+ required)
- **Tests Fail**: Ensure database is running for e2e tests

## Advanced Usage

### Internationalization

The app supports multiple languages. To add a new language:

1. Add translation files in `src/locales/`
2. Update `src/i18n.ts` configuration

### Progressive Web App

The app includes PWA features for offline support. Service worker is configured via Vite PWA plugin.

### Customizing the Build

Modify `vite.config.ts` for custom build configurations, including PWA settings, bundle optimization, and more.

### Database Operations

For development, you can reset the database:

```sh
npm run rollback  # ⚠️  WARNING: Deletes all data!
npm run migrate   # Recreate schema
npm run test:db   # Test database connectivity
```

## Running Tests

### Unit Tests

```sh
npm run test
```

### E2E Tests

```sh
npm run test:e2e
```

The e2e tests automatically start the servers and test the full user flow.

## Scripts

- `npm run dev`: Start development servers
- `npm run build`: Build for production
- `npm run preview`: Preview production build
- `npm run lint`: Run ESLint
- `npm run test`: Run unit tests
- `npm run test:e2e`: Run e2e tests
- `npm run preflight`: Run full CI checks (lint, build, test)
- `npm run migrate`: Run database migrations
- `npm run rollback`: Rollback database (development only)
- `npm run test:db`: Test database connectivity
- `npm run cli`: Run AI CLI (single query or interactive mode)
- `npm run storybook`: Start Storybook component documentation
- `npm start`: Start production server

## Files

- `package.json`: Dependencies and scripts
- `vite.config.ts`: Build configuration
- `server.mjs`: Backend API server (ES modules)
- `lib/`: ES module library files (.mjs)
- `vercel.json`: Vercel deployment config
- `env.example`: Environment variables template

## CI/CD

The CI/CD pipeline runs automated tests, linting, security checks, and deployments using GitLab CI/CD and GitHub Actions. It includes:

- **Testing**: Unit tests, E2E tests with Playwright, linting, code coverage
- **Security**: Docker image vulnerability scanning with Trivy
- **Deployment**: Automated deployment to Vercel on main branch pushes
- **GitLab Sync**: Automated push to GitLab mirror on main branch pushes (via GitHub Actions)
- **Load Testing**: Weekly performance testing with k6

### Pipelines

- **Main Pipeline**: Runs lint, build, test, e2e on every push/MR
- **Docker Pipeline**: Builds and pushes Docker images on main branch
- **Load Test Pipeline**: Runs performance tests weekly
- **Deploy Pipeline**: Deploys to Vercel production (requires variables)

### Setting up Automated Deployment

To enable automated Vercel deployments, add these variables to your GitLab project:

1. Go to **Settings → CI/CD → Variables**
2. Add the following variables:
   - `VERCEL_TOKEN`: Your Vercel access token
   - `VERCEL_ORG_ID`: Your Vercel organization ID
   - `VERCEL_PROJECT_ID`: Your Vercel project ID

### Testing Pipelines Locally

Use [gitlab-ci-local](https://github.com/firecow/gitlab-ci-local) to test GitLab CI pipelines locally:

```sh
# Install gitlab-ci-local
npm install -g gitlab-ci-local

# Test pipeline
gitlab-ci-local --file .gitlab-ci.yml
```

## Requirements

- Node.js 20 LTS or later
- npm
- PostgreSQL database (local or cloud like Neon)

## Documentation

Detailed documentation is available in the [docs/](docs/) directory:

- [API Reference](docs/api.md) - Complete API documentation
- [Authentication](docs/authentication.md) - User authentication system
- [Database](docs/database.md) - Database setup and operations
- [Database Queries](docs/database-queries.md) - Useful SQL queries
- [Deployment](docs/deployment.md) - Production deployment
- [Docker](docs/docker.md) - Containerization
- [Development](docs/development.md) - Development setup
- [Publishing](docs/publishing.md) - Package publishing to npm
- [Security](docs/security.md) - Security measures
- [Incident Response](docs/incident-response.md) - Incident handling procedures

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for contribution guidelines.

## License

MIT
