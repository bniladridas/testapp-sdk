import { askAI } from './ai.mjs';

async function handleWorkflow(octokit, payload) {
  // Example: on issue labeled 'bug', assign to team
  if (payload.action === 'labeled' && payload.label.name === 'bug') {
    await octokit.rest.issues.addAssignees({
      owner: payload.repository.owner.login,
      repo: payload.repository.name,
      issue_number: payload.issue.number,
      assignees: ['bug-team-member'],
    });
  }
  // Add more automations as needed
}

export { handleWorkflow };
