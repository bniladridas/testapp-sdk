const { askAI } = require('./ai.cjs');

async function handleSecurityScan(octokit, payload) {
  // Simple scan: check for common secrets in commit messages or files
  // In real, use tools like gitleaks, but here AI-based
  const commits = payload.commits;
  let alerts = [];

  for (const commit of commits) {
    const msg =
      commit.message +
      (commit.added ? commit.added.join(' ') : '') +
      (commit.modified ? commit.modified.join(' ') : '');
    if (msg.match(/(password|secret|key|token)/i)) {
      alerts.push(`Potential secret in commit ${commit.id}: ${commit.message}`);
    }
  }

  if (alerts.length > 0) {
    const body = `🚨 **Security Alert:**\n\n${alerts.join('\n')}\n\nPlease review and remove sensitive data.`;
    await octokit.rest.issues.createIssue({
      owner: payload.repository.owner.login,
      repo: payload.repository.name,
      title: 'Security Alert: Potential Secrets Detected',
      body,
    });
  }
}

export { handleSecurityScan };
