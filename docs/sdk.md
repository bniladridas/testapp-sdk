# SDK Documentation

The TestApp SDK provides reusable utilities for AI interactions, security scanning, database operations, and GitHub automation.

## Installation

```sh
npm install @harpertoken/testapp-sdk
```

## Environment Variables

Set these in your environment or `.env` file:

- `GEMINI_API_KEY`: Required for AI functions (get from Google AI Studio)
- `DATABASE_URL`: Required for database functions (PostgreSQL connection string)

## API Reference

### AI Functions

#### `askAI(message: string): Promise<string>`

Interacts with Google's Gemini AI.

```js
import { askAI } from '@harpertoken/testapp-sdk';

const response = await askAI('Explain quantum computing');
console.log(response);
```

#### `createAIModel(apiKey: string): GenerativeModel`

Creates a Gemini AI model instance.

```js
import { createAIModel } from '@harpertoken/testapp-sdk';

const model = createAIModel(process.env.GEMINI_API_KEY);
const result = await model.generateContent('Hello');
```

### Database Functions

#### `initDatabase(): Promise<void>`

Initializes database tables.

```js
import { initDatabase } from '@harpertoken/testapp-sdk';

await initDatabase();
```

#### `pool: Pool`

PostgreSQL connection pool instance.

```js
import { pool } from '@harpertoken/testapp-sdk';

const result = await pool.query('SELECT * FROM users');
```

### Security & Automation

#### `handleSecurityScan(octokit: Octokit, payload: WebhookPayload)`

Scans GitHub webhook payloads for security issues.

```js
import { handleSecurityScan } from '@harpertoken/testapp-sdk';
import { Octokit } from '@octokit/rest';

const octokit = new Octokit({ auth: process.env.GITHUB_TOKEN });
await handleSecurityScan(octokit, webhookPayload);
```

#### `handleCodeReview(octokit: Octokit, payload: WebhookPayload)`

Performs automated code review on pull requests.

```js
import { handleCodeReview } from '@harpertoken/testapp-sdk';

await handleCodeReview(octokit, prPayload);
```

#### `handleCommitCheck(octokit: Octokit, payload: WebhookPayload)`

Validates commit messages against conventional standards.

```js
import { handleCommitCheck } from '@harpertoken/testapp-sdk';

await handleCommitCheck(octokit, commitPayload);
```

#### `handleDocsCheck(octokit: Octokit, payload: WebhookPayload)`

Checks documentation in pull requests.

```js
import { handleDocsCheck } from '@harpertoken/testapp-sdk';

await handleDocsCheck(octokit, prPayload);
```

#### `handleIssue(octokit: Octokit, payload: WebhookPayload)`

Manages issue automation.

```js
import { handleIssue } from '@harpertoken/testapp-sdk';

await handleIssue(octokit, issuePayload);
```

#### `handleRelease(octokit: Octokit, payload: WebhookPayload)`

Handles release automation.

```js
import { handleRelease } from '@harpertoken/testapp-sdk';

await handleRelease(octokit, releasePayload);
```

#### `handleWorkflow(octokit: Octokit, payload: WebhookPayload)`

Manages workflow automation.

```js
import { handleWorkflow } from '@harpertoken/testapp-sdk';

await handleWorkflow(octokit, workflowPayload);
```

## Examples

See `examples/` folder for usage examples:

- `examples/simple-ai.js`: Basic AI interaction
- `examples/README.md`: Setup instructions

## Error Handling

All functions may throw errors. Wrap in try-catch:

```js
try {
  const response = await askAI('Hello');
} catch (error) {
  console.error('AI Error:', error.message);
}
```

## Contributing

SDK functions are in `lib/` directory. Add tests in corresponding `.test.mjs` files.
