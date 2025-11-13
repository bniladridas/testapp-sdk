# Test Coverage Enhancements

## Mocks for External Dependencies

To ensure full test coverage for server-side code that interacts with external APIs, we have added mocks for various libraries in `test-unit/server.test.js`.

### Why Mocks?

- **Isolation**: Tests run without requiring real API calls (Gemini AI, GitHub APIs), making them faster and more reliable.
- **Coverage**: Mocks allow testing of all code paths, including authentication, AI responses, GitHub webhooks, and error handling.
- **CI/CD**: Prevents external dependencies from causing test failures in automated environments.

### Mocked Libraries

- `@google/generative-ai`: Mocks the `GoogleGenerativeAI` class and its methods for AI interactions.
- `@octokit/app`: Mocks the `App` class with a `webhooks` object containing an `on` method.
- `@octokit/webhooks`: Mocks `createNodeMiddleware` to return a middleware function that calls `next()`.
- **bcryptjs**: Not mocked, but tests use in-memory data.
- **jsonwebtoken**: Not mocked, but tests verify token generation.

### Test Scenarios

- **Authentication**: Signup, login, and token validation.
- **AI Queries**: Successful responses, rate limit errors, and fallback messages.
- **GitHub Integration**: Webhook handling and code review automation.
- **Error Handling**: Invalid requests, missing data, and server errors.
- **E2E Tests**: Full user flows including signup, login, and AI chat.

### Usage

The mocks are automatically applied in the test environment via Vitest's mocking system. They provide minimal interfaces to simulate real API behaviors without external calls or side effects.

### Benefits

- **Full Coverage**: All server endpoints, GitHub features, and error paths are tested.
- **Reliability**: Tests are deterministic and don't depend on external services.
- **Performance**: Fast execution without network delays.
- **Maintainability**: Mocks are simple and focused on required behaviors.

This enhancement ensures robust testing of authentication, AI, and GitHub-integrated features while maintaining test performance and reliability.
