# TestApp Documentation

TestApp is a simple single-page web application featuring AI-powered chat functionality. Built with React, Vite, and integrated with Google's Gemini AI.

## Features

- **AI Chat**: Interactive chat with Gemini 2.5 Flash model
- **Clean UI**: Minimalist design with dark mode support
- **CLI Tool**: Command-line interface for AI queries
- **Responsive**: Works on desktop and mobile

## Quick Start

1. Clone the repository
2. Install dependencies: `npm install`
3. Set up environment: Copy `env.example` to `.env` and add `GEMINI_API_KEY`
4. Run development: `npm run dev`
5. Open `http://localhost:5173`

## Architecture

- **Frontend**: React + TypeScript + Tailwind CSS
- **Backend**: Node.js server with Express
- **AI**: Google Generative AI (Gemini)
- **Deployment**: Vercel (static + serverless)

## Directory Structure

```
├── src/          # Frontend source
├── cli/          # CLI tool
├── lib/          # Shared utilities
├── test-unit/    # Unit tests
├── tests/        # E2E tests
├── docs/         # Documentation
└── scripts/      # Build and utility scripts
```