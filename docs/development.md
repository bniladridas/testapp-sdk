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
- **Preflight**: `npm run preflight` (lint + duplicate-check + build + coverage)

## Scripts

- **Safe Push**: `./safe-push.sh` - Stages, auto-generates commit message using AI, commits, rewrites messages, pushes to GitHub
- **Rewrite Commits**: `./rewrite-commits.sh` - Rewrites commit messages, force pushes to remote
- **Generate Commit Message**: `node generate-commit-msg.js` - Uses AI to generate conventional commit message from diff
- **Commit Template**: `.gitmessage` - Template for conventional commits

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
