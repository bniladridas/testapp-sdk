import { askAI } from './ai.mjs';

async function handleIssue(octokit, payload) {
  const suggestion = await askAI(
    `Classify and suggest response for this issue: ${payload.issue.title} - ${payload.issue.body}`,
  );
  await octokit.rest.issues.createComment({
    owner: payload.repository.owner.login,
    repo: payload.repository.name,
    issue_number: payload.issue.number,
    body: `🤖 **AI Issue Analysis:**\n\n${suggestion}`,
  });
}

export { handleIssue };
