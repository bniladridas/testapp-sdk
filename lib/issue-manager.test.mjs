import { describe, it, expect, vi } from 'vitest';

vi.mock('./ai.mjs', () => ({
  askAI: vi.fn(() => Promise.resolve('Mocked response')),
}));

import { handleIssue } from './issue-manager.mjs';
import { askAI } from './ai.mjs';

describe('handleIssue', () => {
  it('should be a function', () => {
    expect(typeof handleIssue).toBe('function');
  });

  it('should create comment with AI suggestion', async () => {
    const mockOctokit = {
      rest: {
        issues: {
          createComment: vi.fn(),
        },
      },
    };
    const payload = {
      issue: {
        title: 'Bug in login',
        body: 'Cannot login with valid credentials',
        number: 42,
      },
      repository: { owner: { login: 'owner' }, name: 'repo' },
    };

    await handleIssue(mockOctokit, payload);

    expect(askAI).toHaveBeenCalledWith(
      'Classify and suggest response for this issue: Bug in login - Cannot login with valid credentials',
    );
    expect(mockOctokit.rest.issues.createComment).toHaveBeenCalledTimes(1);
    const call = mockOctokit.rest.issues.createComment.mock.calls[0][0];
    expect(call.owner).toBe('owner');
    expect(call.repo).toBe('repo');
    expect(call.issue_number).toBe(42);
    expect(call.body).toContain('AI Issue Analysis');
    expect(call.body).toContain('Mocked response');
  });
});
