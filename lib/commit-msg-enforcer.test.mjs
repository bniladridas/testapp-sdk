import { describe, it, expect, vi } from 'vitest';

import { handleCommitCheck } from './commit-msg-enforcer.mjs';

describe('handleCommitCheck', () => {
  it('should be a function', () => {
    expect(typeof handleCommitCheck).toBe('function');
  });

  it('should not create comment for valid commit messages', async () => {
    const mockOctokit = {
      rest: {
        issues: {
          createComment: vi.fn(),
        },
      },
    };
    const payload = {
      commits: [
        { sha: 'abc123', message: 'feat: add new feature' },
        { sha: 'def456', message: 'fix: correct bug' },
      ],
      repository: { owner: { login: 'owner' }, name: 'repo' },
      pull_request: { number: 1 },
    };

    await handleCommitCheck(mockOctokit, payload);

    expect(mockOctokit.rest.issues.createComment).not.toHaveBeenCalled();
  });

  it('should create comment for invalid commit messages', async () => {
    const mockOctokit = {
      rest: {
        issues: {
          createComment: vi.fn(),
        },
      },
    };
    const payload = {
      commits: [
        { sha: 'abc123', message: 'INVALID MESSAGE' },
        {
          sha: 'def456',
          message:
            'feat: this is a very long commit message that exceeds forty characters',
        },
      ],
      repository: { owner: { login: 'owner' }, name: 'repo' },
      pull_request: { number: 1 },
    };

    await handleCommitCheck(mockOctokit, payload);

    expect(mockOctokit.rest.issues.createComment).toHaveBeenCalledTimes(1);
    const call = mockOctokit.rest.issues.createComment.mock.calls[0][0];
    expect(call.owner).toBe('owner');
    expect(call.repo).toBe('repo');
    expect(call.issue_number).toBe(1);
    expect(call.body).toContain('Commit Message Issues Found');
    expect(call.body).toContain('INVALID MESSAGE');
    expect(call.body).toContain('this is a very long commit message');
  });

  it('should handle multiple invalid commits', async () => {
    const mockOctokit = {
      rest: {
        issues: {
          createComment: vi.fn(),
        },
      },
    };
    const payload = {
      commits: [
        { sha: 'abc123', message: 'INVALID' },
        { sha: 'def456', message: 'also invalid' },
      ],
      repository: { owner: { login: 'owner' }, name: 'repo' },
      pull_request: { number: 1 },
    };

    await handleCommitCheck(mockOctokit, payload);

    expect(mockOctokit.rest.issues.createComment).toHaveBeenCalledTimes(1);
    const call = mockOctokit.rest.issues.createComment.mock.calls[0][0];
    expect(call.body).toContain('abc123');
    expect(call.body).toContain('def456');
  });
});
