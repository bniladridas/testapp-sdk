# TestApp Documentation

TestApp is a simple single-page web application featuring AI-powered chat functionality. Built with React, Vite, and integrated with Google's Gemini AI.

## Features

- **AI Chat**: Interactive chat with Gemini 2.5 Flash model
- **Clean UI**: Minimalist design with dark mode support
- **CLI Tool**: Command-line interface for AI queries
- **Responsive**: Works on desktop and mobile
- **Cross-Platform**: Runs on macOS, Linux, and Windows

## Quick Start

1. Clone the repository
2. Install dependencies: `npm install`
3. Set up environment: Copy `env.example` to `.env` and add `GEMINI_API_KEY`
4. Run development: `npm run dev`
5. Open `http://localhost:5173`

## Architecture

- **Frontend**: React + TypeScript + Tailwind CSS
- **Backend**: Node.js server with Express (ES modules)
- **AI**: Google Generative AI (Gemini)
- **Deployment**: Vercel (static + serverless)

## Directory Structure

```
├── src/          # Frontend source
├── cli/          # CLI tool
├── lib/          # Shared ES modules (.mjs)
├── test-unit/    # Unit tests
├── tests/        # E2E tests
├── docs/         # Documentation
├── config/       # Configuration files
└── tools/        # Utility scripts and tools
```

## Troubleshooting

### Common Issues

- **API Key Error**: Ensure `GEMINI_API_KEY` is set in `.env` for local development or Vercel environment variables for deployment.
- **Build Fails**: Run `npm install` to ensure all dependencies are installed. Check Node.js version (20+ required).
- **Tests Fail**: For unit tests, ensure mocks are set up. For E2E, ensure the dev server is running.
- **CLI Not Working**: Verify the API key and internet connection. The CLI requires the same setup as the web app.
- **Deployment Issues**: Check Vercel logs for errors. Ensure `vercel.json` is configured correctly.

### Getting Help

- Check the [GitHub Issues](https://github.com/bniladridas/TestApp/issues) for known problems
- Review the specific documentation: [API](api.md), [CLI](cli.md), [Deployment](deployment.md), [Development](development.md)
