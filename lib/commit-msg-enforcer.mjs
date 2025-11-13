// Function to validate commit message
function validateCommitMessage(message) {
  const TYPES = 'feat|fix|docs|style|refactor|test|chore|perf|ci|build|revert';
  const errors = [];

  if (!message.match(new RegExp(`^(${TYPES}):`))) {
    errors.push('Must start with a type: ' + TYPES.replace(/\|/g, ', '));
  }
  if (message.match(/[A-Z]/)) {
    errors.push('First line must be lowercase');
  }
  if (message.length > 40) {
    errors.push('First line must be ≤40 characters');
  }

  return errors;
}

async function handleCommitCheck(octokit, payload) {
  let invalidCommits = [];
  for (const commit of payload.commits) {
    const msg = commit.message.split('\n')[0]; // First line
    const errors = validateCommitMessage(msg);
    if (errors.length > 0) {
      invalidCommits.push({ sha: commit.sha, message: msg, errors });
    }
  }

  if (invalidCommits.length > 0) {
    let body = '🚨 **Commit Message Issues Found:**\n\n';
    for (const commit of invalidCommits) {
      body += `**Commit ${commit.sha.slice(0, 7)}:** \`${commit.message}\`\n`;
      body +=
        'Issues:\n' + commit.errors.map((e) => `- ${e}`).join('\n') + '\n\n';
    }
    body +=
      'Please fix the commit messages to follow conventional commit standards.';

    await octokit.rest.issues.createComment({
      owner: payload.repository.owner.login,
      repo: payload.repository.name,
      issue_number: payload.pull_request.number,
      body,
    });
  }
}

export { handleCommitCheck };
