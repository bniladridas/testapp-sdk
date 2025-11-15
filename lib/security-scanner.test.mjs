import { describe, it, expect, vi } from 'vitest';

import { handleSecurityScan } from './security-scanner.mjs';

describe('handleSecurityScan', () => {
  it('should be a function', () => {
    expect(typeof handleSecurityScan).toBe('function');
  });

  it('should create issue when secrets detected in commit message', async () => {
    const mockOctokit = {
      rest: {
        issues: {
          createIssue: vi.fn(),
        },
      },
    };
    const payload = {
      commits: [
        {
          id: 'abc123',
          message: 'Add password field',
          added: [],
          modified: [],
        },
      ],
      repository: { owner: { login: 'owner' }, name: 'repo' },
    };

    await handleSecurityScan(mockOctokit, payload);

    expect(mockOctokit.rest.issues.createIssue).toHaveBeenCalledTimes(1);
    const call = mockOctokit.rest.issues.createIssue.mock.calls[0][0];
    expect(call.title).toBe('Security Alert: Potential Secrets Detected');
    expect(call.body).toContain('Potential secret in commit abc123');
  });

  it('should create issue when secrets detected in added files', async () => {
    const mockOctokit = {
      rest: {
        issues: {
          createIssue: vi.fn(),
        },
      },
    };
    const payload = {
      commits: [
        {
          id: 'def456',
          message: 'Update config',
          added: ['secret.key'],
          modified: [],
        },
      ],
      repository: { owner: { login: 'owner' }, name: 'repo' },
    };

    await handleSecurityScan(mockOctokit, payload);

    expect(mockOctokit.rest.issues.createIssue).toHaveBeenCalledTimes(1);
  });

  it('should create issue when secrets detected in modified files', async () => {
    const mockOctokit = {
      rest: {
        issues: {
          createIssue: vi.fn(),
        },
      },
    };
    const payload = {
      commits: [
        {
          id: 'xyz789',
          message: 'Update config',
          added: [],
          modified: ['password.txt'],
        },
      ],
      repository: { owner: { login: 'owner' }, name: 'repo' },
    };

    await handleSecurityScan(mockOctokit, payload);

    expect(mockOctokit.rest.issues.createIssue).toHaveBeenCalledTimes(1);
  });

  it('should create issue when secrets detected in both added and modified files', async () => {
    const mockOctokit = {
      rest: {
        issues: {
          createIssue: vi.fn(),
        },
      },
    };
    const payload = {
      commits: [
        {
          id: 'abc999',
          message: 'Update config',
          added: ['newfile.txt'],
          modified: ['password.txt'],
        },
      ],
      repository: { owner: { login: 'owner' }, name: 'repo' },
    };

    await handleSecurityScan(mockOctokit, payload);

    expect(mockOctokit.rest.issues.createIssue).toHaveBeenCalledTimes(1);
  });

  it('should handle commits with no added or modified files', async () => {
    const mockOctokit = {
      rest: {
        issues: {
          createIssue: vi.fn(),
        },
      },
    };
    const payload = {
      commits: [
        {
          id: 'def000',
          message: 'password: secret123', // Contains secret in message
          // No added or modified arrays
        },
      ],
      repository: { owner: { login: 'owner' }, name: 'repo' },
    };

    await handleSecurityScan(mockOctokit, payload);

    expect(mockOctokit.rest.issues.createIssue).toHaveBeenCalledTimes(1);
  });

  it('should not create issue when no secrets detected', async () => {
    const mockOctokit = {
      rest: {
        issues: {
          createIssue: vi.fn(),
        },
      },
    };
    const payload = {
      commits: [{ id: 'ghi789', message: 'Fix bug', added: [], modified: [] }],
      repository: { owner: { login: 'owner' }, name: 'repo' },
    };

    await handleSecurityScan(mockOctokit, payload);

    expect(mockOctokit.rest.issues.createIssue).not.toHaveBeenCalled();
  });

  it('should handle multiple commits with secrets', async () => {
    const mockOctokit = {
      rest: {
        issues: {
          createIssue: vi.fn(),
        },
      },
    };
    const payload = {
      commits: [
        { id: 'abc123', message: 'Add password', added: [], modified: [] },
        { id: 'def456', message: 'Update token', added: [], modified: [] },
      ],
      repository: { owner: { login: 'owner' }, name: 'repo' },
    };

    await handleSecurityScan(mockOctokit, payload);

    expect(mockOctokit.rest.issues.createIssue).toHaveBeenCalledTimes(1);
    const call = mockOctokit.rest.issues.createIssue.mock.calls[0][0];
    expect(call.body).toContain('abc123');
    expect(call.body).toContain('def456');
  });
});
