# TestApp

A modern, developer-focused chat platform with AI and LLM support, built for productivity and creativity.

## Getting Started

TestApp is a web application built with React and Vite. To run it locally:

```sh
npm install
npm run dev
```

Then open your browser to `http://localhost:5173` to view the application.

### CLI Usage

You can also use the AI directly from the command line:

```sh
npm run cli "Your prompt here"
```

Make sure to set your `GEMINI_API_KEY` in a `.env` file.

## Scripts

- `npm run dev`: Start development servers
- `npm run build`: Build for production
- `npm run lint`: Run ESLint
- `npm run preview`: Preview production build
- `npm run predeploy`: Build before deployment
- `npm run deploy`: Deploy to GitHub Pages
- `npm run start:server`: Start server only
- `npm run vercel-build`: Build for Vercel
- `npm start`: Start production server
- `npm run cli`: Run the CLI tool with AI prompts

## Files

- `package.json`: Dependencies and scripts
- `vite.config.ts`: Build configuration
- `server.cjs`: Backend API and static file server
- `vercel.json`: Deployment configuration
- `env.example`: Environment variables template

## Requirements

- Node.js 18 or later
- npm or yarn

## Conventional Commits

This project uses conventional commit standards for commit messages.

### Setup

To enable the commit message hook:

```sh
cp scripts/commit-msg .git/hooks/
```

### Standards

- Commit messages must start with a type: `feat:`, `fix:`, `docs:`, `style:`, `refactor:`, `test:`, `chore:`, etc.
- First line must be lowercase and ≤40 characters.
- Use present tense: "add feature" not "added feature".

### Rewriting History

To clean up existing commit messages:

```sh
bash scripts/rewrite_msg.sh < commit_message.txt
```

Or for the entire history (use with caution):

```sh
git filter-branch --msg-filter 'bash scripts/rewrite_msg.sh' -- --all
```

## Contributing

Contributions are welcome! Please see [CONTRIBUTING.md](CONTRIBUTING.md) for details.

## License

MIT
