# TestApp

[![Node.js Version](https://img.shields.io/badge/node-%3E%3D20.0.0-brightgreen)](https://nodejs.org/)
[![E2E Tests](https://github.com/bniladridas/TestApp/actions/workflows/e2e.yml/badge.svg)](https://github.com/bniladridas/TestApp/actions/workflows/e2e.yml)
[![Build and Push Docker Image](https://github.com/bniladridas/TestApp/actions/workflows/docker.yml/badge.svg)](https://github.com/bniladridas/TestApp/actions/workflows/docker.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

A modern single-page web application with AI-powered chat functionality, featuring internationalization, offline support, and accessibility enhancements. Built with React, Vite, and integrated with Google's Gemini AI.

The full API of this application can be found in [docs/api.md](docs/api.md).

## Installation

### Quick Setup (Recommended)

Use the automated setup script for a complete environment setup:

```sh
git clone https://github.com/bniladridas/TestApp.git
cd testapp
./setup.sh
npm run dev
```

This script installs dependencies, sets up PostgreSQL, creates the database, runs migrations, and starts the development server.

### Live Demo

A live demo is available at: **[https://ui-lib-fawn.vercel.app](https://ui-lib-fawn.vercel.app)**

- **Login Page**: [https://ui-lib-fawn.vercel.app/login](https://ui-lib-fawn.vercel.app/login)
- **Signup**: Create a new account to test the full functionality
- **Automated Deployment**: Changes to main branch deploy automatically via GitHub Actions

### Manual Setup

If you prefer manual setup:

```sh
npm install
cp env.example .env
# Edit .env with your GEMINI_API_KEY and database settings
npm run migrate
npm run dev
```

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

Use the AI from command line:

```sh
npm run cli "Your prompt here"
```

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

## Database Setup

TestApp uses PostgreSQL for data persistence. The setup script handles this automatically, but for manual setup:

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
- `npm run cli`: Run CLI with AI prompts
- `npm start`: Start production server

## Files

- `package.json`: Dependencies and scripts
- `vite.config.ts`: Build configuration
- `server.mjs`: Backend API server (ES modules)
- `lib/`: ES module library files (.mjs)
- `vercel.json`: Vercel deployment config
- `env.example`: Environment variables template

## CI/CD

The CI/CD pipeline runs automated tests, linting, security checks, and deployments using GitHub Actions. It includes:

- **Testing**: Unit tests, E2E tests with Playwright, linting, code coverage
- **Security**: Docker image vulnerability scanning with Trivy
- **Deployment**: Automated deployment to Vercel on main branch pushes
- **Load Testing**: Weekly performance testing with k6

### Workflows

- **`e2e.yml`**: Runs tests on every push/PR (unit, e2e, docker build)
- **`docker.yml`**: Builds and pushes Docker images on main branch
- **`load-test.yml`**: Runs performance tests weekly
- **`deploy.yml`**: Deploys to Vercel production (requires secrets)

### Setting up Automated Deployment

To enable automated Vercel deployments, add these secrets to your GitHub repository:

1. Go to **Settings → Secrets and variables → Actions**
2. Add the following secrets:
   - `VERCEL_TOKEN`: Your Vercel access token
   - `VERCEL_ORG_ID`: Your Vercel organization ID
   - `VERCEL_PROJECT_ID`: Your Vercel project ID

### Testing Workflows Locally

Use [act](https://github.com/nektos/act) to test GitHub Actions workflows locally:

```sh
# Test e2e workflow
act -j e2e -P ubuntu-latest=catthehacker/ubuntu:act-latest --container-architecture linux/amd64 --secret GEMINI_API_KEY=your_key

# Test docker workflow
act -j docker -P ubuntu-latest=catthehacker/ubuntu:act-latest --container-architecture linux/amd64 --secret DOCKER_USERNAME=your_username --secret DOCKER_PASSWORD=your_password
```

## Requirements

- Node.js 20 LTS or later
- npm
- PostgreSQL (for database)

## Documentation

Detailed documentation is available in the [docs/](docs/) directory:

- [API Reference](docs/api.md) - Complete API documentation
- [Authentication](docs/authentication.md) - User authentication system
- [Database](docs/database.md) - Database setup and operations
- [Deployment](docs/deployment.md) - Production deployment
- [Docker](docs/docker.md) - Containerization
- [Development](docs/development.md) - Development setup
- [Security](docs/security.md) - Security measures

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for contribution guidelines.

## License

MIT
