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

## Coding Standards

- Follow the existing code style.
- Use TypeScript for type safety.
- Run `npm run lint` before committing.
- Write clear, concise commit messages.

## Reporting Issues

If you find a bug or have a feature request, please open an issue on GitHub with:

- A clear title and description
- Steps to reproduce (for bugs)
- Expected vs. actual behavior
- Your environment (OS, browser, Node version)

## License

By contributing to TestApp, you agree that your contributions will be licensed under the MIT License.
