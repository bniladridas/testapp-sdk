import { askAI } from './ai.mjs';

async function handleCodeReview(octokit, payload) {
  // Get PR diff
  const { data: diff } = await octokit.rest.pulls.get({
    owner: payload.repository.owner.login,
    repo: payload.repository.name,
    pull_number: payload.pull_request.number,
    mediaType: { format: 'diff' },
  });

  const analysis = await askAI(
    `Review this code diff for bugs, improvements, and suggestions:\n\n${diff}`,
  );
  await octokit.rest.issues.createComment({
    owner: payload.repository.owner.login,
    repo: payload.repository.name,
    issue_number: payload.pull_request.number,
    body: `🤖 **AI Code Review:**\n\n${analysis}`,
  });
}

export { handleCodeReview };
