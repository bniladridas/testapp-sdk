# Development

## Setup

1. Clone the repo
2. Install dependencies: `npm install`
3. Copy `env.example` to `.env`
4. Add your `GEMINI_API_KEY`

## Running Locally

- **Frontend + Backend**: `npm run dev`
- **Frontend only**: `npm run dev` (Vite)
- **Backend only**: `npm run server`
- **CLI**: `npm run cli "prompt"`

## Testing

- **Unit tests**: `npm test`
- **E2E tests**: `npm run test:e2e`
- **Preflight**: `npm run preflight` (lint + build + tests)

## Code Quality

- **Linting**: `npm run lint`
- **Formatting**: Pre-commit hooks (Husky + lint-staged) handle formatting
- **Conventional Commits**: Enforced via Husky hooks

## Architecture

- **Frontend**: React with hooks, TypeScript
- **Styling**: Tailwind CSS
- **State**: Context API for authentication
- **Backend**: Express.js with ES modules
- **Auth**: JWT-based authentication
- **AI**: Backend integration with Gemini API
- **Build**: Vite for fast development
