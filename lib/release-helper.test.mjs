import { describe, it, expect, vi } from 'vitest';

vi.mock('./ai.mjs', () => ({
  askAI: vi.fn(() => Promise.resolve('Mocked changelog')),
}));

import { handleRelease } from './release-helper.mjs';
import { askAI } from './ai.mjs';

describe('handleRelease', () => {
  it('should be a function', () => {
    expect(typeof handleRelease).toBe('function');
  });

  it('should generate changelog and update release', async () => {
    const mockOctokit = {
      rest: {
        repos: {
          listCommits: vi.fn(() =>
            Promise.resolve({
              data: [
                { commit: { message: 'feat: add login' } },
                { commit: { message: 'fix: correct typo' } },
              ],
            }),
          ),
          updateRelease: vi.fn(),
        },
      },
    };
    const payload = {
      release: {
        id: 123,
        created_at: '2023-01-01T00:00:00Z',
      },
      repository: { owner: { login: 'owner' }, name: 'repo' },
    };

    await handleRelease(mockOctokit, payload);

    expect(mockOctokit.rest.repos.listCommits).toHaveBeenCalledWith({
      owner: 'owner',
      repo: 'repo',
      since: '2023-01-01T00:00:00Z',
    });
    expect(askAI).toHaveBeenCalledWith(
      'Generate a changelog for this release from these commits: feat: add login; fix: correct typo',
    );
    expect(mockOctokit.rest.repos.updateRelease).toHaveBeenCalledWith({
      owner: 'owner',
      repo: 'repo',
      release_id: 123,
      body: 'Mocked changelog',
    });
  });
});
