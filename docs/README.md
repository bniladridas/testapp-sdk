# TestApp Documentation

TestApp is a simple single-page web application featuring AI-powered chat functionality. Built with React, Vite, and integrated with Google's Gemini AI.

## Features

- **AI Chat**: Interactive chat with Gemini 2.5 Flash model
- **Clean UI**: Minimalist design with dark mode support
- **CLI Tool**: Command-line interface for AI queries
- **Responsive**: Works on desktop and mobile
- **Cross-Platform**: Runs on macOS, Linux, and Windows
- **Internationalization**: Multi-language support (English/Spanish)
- **Progressive Web App**: Offline support with service worker
- **Accessibility**: ARIA labels, skip links, semantic HTML
- **Error Boundaries**: Graceful error handling and fallbacks
- **Authentication**: Secure user signup/login with JWT

## Quick Start

1. Clone the repository
2. Install dependencies: `npm install`
3. Set up environment: Copy `env.example` to `.env` and add `GEMINI_API_KEY`
4. Run development: `npm run dev`
5. Open `http://localhost:5173`

## Architecture

- **Frontend**: React + TypeScript + Tailwind CSS + Vite
- **Backend**: Node.js server with Express (ES modules)
- **Database**: PostgreSQL with connection pooling
- **AI**: Google Generative AI (Gemini)
- **PWA**: Vite PWA plugin with service worker
- **i18n**: i18next for internationalization
- **Deployment**: Docker + Vercel (static + serverless)

## Directory Structure

```
├── src/              # Frontend source (React + TypeScript)
│   ├── locales/      # Internationalization files
│   ├── *.stories.tsx # Storybook component documentation
│   └── ErrorBoundary.tsx  # Error handling component
├── cli/              # CLI tool
├── lib/              # Shared ES modules (.mjs)
├── e2e/              # End-to-end tests (Playwright)
├── test-unit/        # Unit tests (Vitest)
├── docs/             # Documentation
├── docker/           # Docker configuration
├── .github/          # GitHub Actions workflows
├── .storybook/       # Storybook configuration
├── load-test.js      # Load testing script
├── testapp-api.postman_collection.json  # API testing collection
└── tools/            # Utility scripts and tools
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
- Review the specific documentation:
  - [API Reference](api.md) - Complete API documentation
  - [Authentication](authentication.md) - User authentication system
  - [Database](database.md) - Database setup and operations
  - [Deployment](deployment.md) - Production deployment
  - [Docker](docker.md) - Containerization
  - [Development](development.md) - Development setup
  - [Security](security.md) - Security measures
  - [Incident Response](incident-response.md) - Incident handling procedures

### Development Tools

- **Storybook**: Component documentation at `npm run storybook`
- **API Testing**: Postman collection in `testapp-api.postman_collection.json`
- **Load Testing**: Automated performance tests with k6
