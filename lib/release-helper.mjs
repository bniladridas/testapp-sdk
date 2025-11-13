const { askAI } = require('./ai.cjs');

async function handleRelease(octokit, payload) {
  // Generate changelog from commits since last release
  const { data: commits } = await octokit.rest.repos.listCommits({
    owner: payload.repository.owner.login,
    repo: payload.repository.name,
    since: payload.release.created_at, // approximate
  });

  const changelog = await askAI(
    `Generate a changelog for this release from these commits: ${commits.map((c) => c.commit.message).join('; ')}`,
  );

  // Update release body
  await octokit.rest.repos.updateRelease({
    owner: payload.repository.owner.login,
    repo: payload.repository.name,
    release_id: payload.release.id,
    body: changelog,
  });
}

export { handleRelease };
