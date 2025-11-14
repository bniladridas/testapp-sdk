# Contributing to TestApp

Thank you for your interest in contributing to TestApp! We welcome contributions from the community.

## How to Contribute

1. **Fork the repository** on GitHub.
2. **Clone your fork** locally:
   ```sh
    git clone https://github.com/your-username/testapp.git
    cd testapp
   ```
3. **Create a feature branch**:
   ```sh
   git checkout -b feature/your-feature-name
   ```
4. **Make your changes** and ensure they follow our coding standards.
5. **Test your changes**:
   ```sh
   npm run lint
   npm run build
   ```
6. **Commit your changes**:
   ```sh
   git commit -m "Add your commit message"
   ```
7. **Push to your fork**:
   ```sh
   git push origin feature/your-feature-name
   ```
8. **Create a Pull Request** on GitHub.

## Pull Request Guidelines

- **Link to Issues**: Every PR must reference a related issue in the tracker for tracking and context.
- **Core Goals**: Focus on feature development and security enhancements. Ensure changes align with the project roadmap.
- **Security Checks**: Run `npm audit` and address any new vulnerabilities. For security-related PRs, include details on the vulnerability, fix, and testing.
- **Testing**: Include unit tests for new features. Run `npm run test` and ensure all pass.
- **Code Review**: PRs require review from maintainers. Address feedback promptly.
- **Documentation**: Update docs for new features or changes.

## Development Setup

1. Install dependencies:
   ```sh
   npm install
   ```
2. Start the development server:
   ```sh
   npm run dev
   ```
3. Open your browser to `http://localhost:5173`.

## Branch Naming Convention

Use descriptive branch names following this pattern:

- `feature/description-of-feature`
- `bugfix/issue-description`
- `hotfix/critical-fix`
- `docs/update-documentation`
- `refactor/code-improvement`

Examples:

- `feature/add-user-profile-page`
- `bugfix/fix-login-validation`
- `docs/update-api-documentation`

## Commit Message Guidelines

Follow conventional commit format:

```
type(scope): description

[optional body]

[optional footer]
```

Types:

- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, etc.)
- `refactor`: Code refactoring
- `test`: Adding or updating tests
- `chore`: Maintenance tasks

Examples:

```
feat(auth): add password reset functionality
fix(api): resolve rate limiting issue
docs(api): update authentication endpoints
```

## Development Workflow

### Feature Branch Development

This project uses a feature branch workflow with automated validation:

1. **Create Feature Branch**: Use descriptive names (see Branch Naming Convention)
2. **Develop**: Implement your feature with tests
3. **Validate**: Run `node tools/check-branches.js` to ensure branch meets requirements
4. **Test**: Run `npm run preflight` for comprehensive checks
5. **Push**: Push your branch and create a PR

### Branch Validation

The `tools/check-branches.js` script validates that each feature branch has:

- Required library files (`lib/feature.mjs`)
- Corresponding test files (`lib/feature.test.mjs`)
- Passing tests
- GitHub integration setup

Run this script before creating pull requests to ensure your branch is properly set up.

### Local Development

1. **Setup**: Follow the development setup in README.md
2. **Environment**: Copy `env.example` to `.env` and configure variables
3. **Testing**: Run `npm run preflight` before pushing changes

### Code Quality Checks

- **Linting**: `npm run lint` - ESLint for code quality
- **Type Checking**: `npm run build` - TypeScript compilation
- **Testing**: `npm run test` - Unit tests
- **Coverage**: `npm run test:coverage` - Test coverage report
- **Duplicates**: `npm run duplicate-check` - Code duplication detection
- **Branch Check**: `node tools/check-branches.js` - Feature branch validation

### Pre-commit Hooks

The project uses Husky for pre-commit hooks that automatically:

- Run linting and fix issues
- Format code with Prettier
- Run duplicate code checks

## Coding Standards

- **TypeScript**: Use TypeScript for all new code
- **ESLint**: Follow the configured ESLint rules
- **Prettier**: Code is automatically formatted
- **Imports**: Group imports (React, third-party, local)
- **Naming**: Use descriptive names, camelCase for variables/functions
- **Error Handling**: Use try/catch for async operations
- **Testing**: Write tests for new features and bug fixes

### File Structure

```
src/
├── components/     # React components
├── hooks/         # Custom React hooks
├── lib/           # Utility functions and modules
└── types/         # TypeScript type definitions (if needed)

lib/               # Server-side modules
├── feature.mjs    # Feature implementation
└── feature.test.mjs # Feature tests

docs/              # Documentation
test-unit/         # Integration tests
```

## Testing Requirements

- **Unit Tests**: Required for all new functions and components
- **Integration Tests**: Required for API endpoints
- **E2E Tests**: Required for critical user flows
- **Coverage**: Maintain >80% coverage
- **Test Naming**: `describe('ComponentName', () => { it('should do something', () => { ... }) })`

## Security Considerations

- Never commit secrets or API keys
- Use environment variables for configuration
- Validate all user inputs
- Follow OWASP guidelines for web security
- Report security issues privately to maintainers

## Reporting Issues

If you find a bug or have a feature request, please open an issue on GitHub with:

- A clear title and description
- Steps to reproduce (for bugs)
- Expected vs. actual behavior
- Your environment (OS, browser, Node version)

## License

By contributing to TestApp, you agree that your contributions will be licensed under the MIT License.
