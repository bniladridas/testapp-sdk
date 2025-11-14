import { describe, it, expect, vi } from 'vitest';

vi.mock('./ai.mjs', () => ({
  askAI: vi.fn(() => Promise.resolve('Mocked docs suggestion')),
}));

import { handleDocsCheck } from './docs-bot.mjs';
import { askAI } from './ai.mjs';

describe('handleDocsCheck', () => {
  it('should be a function', () => {
    expect(typeof handleDocsCheck).toBe('function');
  });

  it('should create comment when code files added without docs', async () => {
    const mockOctokit = {
      rest: {
        pulls: {
          listFiles: vi.fn(() =>
            Promise.resolve({
              data: [
                { filename: 'src/new-feature.js' },
                { filename: 'lib/utils.ts' },
              ],
            }),
          ),
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

    await handleDocsCheck(mockOctokit, payload);

    expect(mockOctokit.rest.pulls.listFiles).toHaveBeenCalledWith({
      owner: 'owner',
      repo: 'repo',
      pull_number: 1,
    });
    expect(askAI).toHaveBeenCalledWith(
      'Generate documentation suggestions for these code files: src/new-feature.js, lib/utils.ts. Include JSDoc comments, README updates, and usage examples.',
    );
    expect(mockOctokit.rest.issues.createComment).toHaveBeenCalledTimes(1);
    const call = mockOctokit.rest.issues.createComment.mock.calls[0][0];
    expect(call.body).toContain('Documentation Needed');
    expect(call.body).toContain('Mocked docs suggestion');
  });

  it('should create comment when docs are updated', async () => {
    const mockOctokit = {
      rest: {
        pulls: {
          listFiles: vi.fn(() =>
            Promise.resolve({
              data: [{ filename: 'README.md' }, { filename: 'docs/api.md' }],
            }),
          ),
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

    await handleDocsCheck(mockOctokit, payload);

    expect(mockOctokit.rest.issues.createComment).toHaveBeenCalledTimes(1);
    const call = mockOctokit.rest.issues.createComment.mock.calls[0][0];
    expect(call.body).toContain('Docs Updated');
    expect(call.body).toContain('README.md');
    expect(call.body).toContain('docs/api.md');
  });

  it('should create comment for both code and docs changes', async () => {
    const mockOctokit = {
      rest: {
        pulls: {
          listFiles: vi.fn(() =>
            Promise.resolve({
              data: [
                { filename: 'src/new-feature.js' },
                { filename: 'README.md' },
              ],
            }),
          ),
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

    await handleDocsCheck(mockOctokit, payload);

    expect(mockOctokit.rest.issues.createComment).toHaveBeenCalledTimes(1);
    const call = mockOctokit.rest.issues.createComment.mock.calls[0][0];
    expect(call.body).toContain('Docs Updated');
  });

  it('should not create comment when no relevant files changed', async () => {
    const mockOctokit = {
      rest: {
        pulls: {
          listFiles: vi.fn(() =>
            Promise.resolve({
              data: [{ filename: 'package.json' }, { filename: '.gitignore' }],
            }),
          ),
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

    await handleDocsCheck(mockOctokit, payload);

    expect(mockOctokit.rest.issues.createComment).not.toHaveBeenCalled();
  });
});
