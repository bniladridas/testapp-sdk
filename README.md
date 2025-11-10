# TestApp

A simple single-page web application with AI-powered chat functionality, built with React and Vite.

## Getting Started

To run locally:

```sh
npm install
npm run dev
```

Open `http://localhost:5173` in your browser.

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
- `npm run preflight`: Run lint, build, test, e2e
- `npm run cli`: Run CLI with AI prompts
- `npm start`: Start production server

## Files

- `package.json`: Dependencies and scripts
- `vite.config.ts`: Build configuration
- `server.cjs`: Backend API server
- `vercel.json`: Vercel deployment config
- `env.example`: Environment variables template

## Requirements

- Node.js 20 or later
- npm

## Conventional Commits

Uses conventional commit standards. See scripts for enforcement.

## Contributing

See CONTRIBUTING.md.

## License

MIT
