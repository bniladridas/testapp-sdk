import { describe, it, expect, vi } from 'vitest';

import { handleWorkflow } from './workflow-automator.mjs';

describe('handleWorkflow', () => {
  it('should be a function', () => {
    expect(typeof handleWorkflow).toBe('function');
  });

  it('should assign bug team when issue labeled bug', async () => {
    const mockOctokit = {
      rest: {
        issues: {
          addAssignees: vi.fn(),
        },
      },
    };
    const payload = {
      action: 'labeled',
      label: { name: 'bug' },
      issue: { number: 42 },
      repository: { owner: { login: 'owner' }, name: 'repo' },
    };

    await handleWorkflow(mockOctokit, payload);

    expect(mockOctokit.rest.issues.addAssignees).toHaveBeenCalledWith({
      owner: 'owner',
      repo: 'repo',
      issue_number: 42,
      assignees: ['bug-team-member'],
    });
  });

  it('should not assign when label is not bug', async () => {
    const mockOctokit = {
      rest: {
        issues: {
          addAssignees: vi.fn(),
        },
      },
    };
    const payload = {
      action: 'labeled',
      label: { name: 'enhancement' },
      issue: { number: 42 },
      repository: { owner: { login: 'owner' }, name: 'repo' },
    };

    await handleWorkflow(mockOctokit, payload);

    expect(mockOctokit.rest.issues.addAssignees).not.toHaveBeenCalled();
  });

  it('should not assign when action is not labeled', async () => {
    const mockOctokit = {
      rest: {
        issues: {
          addAssignees: vi.fn(),
        },
      },
    };
    const payload = {
      action: 'opened',
      label: { name: 'bug' },
      issue: { number: 42 },
      repository: { owner: { login: 'owner' }, name: 'repo' },
    };

    await handleWorkflow(mockOctokit, payload);

    expect(mockOctokit.rest.issues.addAssignees).not.toHaveBeenCalled();
  });
});
