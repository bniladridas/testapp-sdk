import { describe, it, expect, vi, beforeAll } from 'vitest';

// Mock the AI module
vi.mock('./ai.cjs', () => ({
  askAI: vi.fn(() => Promise.resolve('Mocked code review')),
}));

import { handleCodeReview } from './code-review.cjs';

beforeAll(() => {
  process.env.GEMINI_API_KEY = 'test';
});

describe('handleCodeReview', () => {
  it('should analyze PR diff and comment', async () => {
    const mockOctokit = {
      rest: {
        pulls: {
          get: vi.fn(() => Promise.resolve({ data: 'diff content' })),
        },
        issues: {
          createComment: vi.fn(),
        },
      },
    };

    const payload = {
      repository: { owner: { login: 'owner' }, name: 'repo' },
      pull_request: { number: 1 },
    };

    await handleCodeReview(mockOctokit, payload);

    expect(mockOctokit.rest.pulls.get).toHaveBeenCalledWith({
      owner: 'owner',
      repo: 'repo',
      pull_number: 1,
      mediaType: { format: 'diff' },
    });
    expect(mockOctokit.rest.issues.createComment).toHaveBeenCalledWith({
      owner: 'owner',
      repo: 'repo',
      issue_number: 1,
      body: expect.stringContaining('AI Code Review'),
    });
  });
});
