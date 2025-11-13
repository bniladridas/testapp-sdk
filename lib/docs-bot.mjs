import { askAI } from './ai.mjs';

async function handleDocsCheck(octokit, payload) {
  const { data: files } = await octokit.rest.pulls.listFiles({
    owner: payload.repository.owner.login,
    repo: payload.repository.name,
    pull_number: payload.pull_request.number,
  });

  const codeFiles = files.filter((f) =>
    f.filename.match(/\.(js|ts|py|java|cpp)$/),
  );
  const docFiles = files.filter((f) =>
    f.filename.match(/(README|readme|\.md$)/),
  );

  let body = '';

  if (codeFiles.length > 0 && docFiles.length === 0) {
    const suggestion = await askAI(
      `Generate documentation suggestions for these code files: ${codeFiles.map((f) => f.filename).join(', ')}. Include JSDoc comments, README updates, and usage examples.`,
    );
    body += `📚 **Documentation Needed:** Code changes detected without doc updates.\n\n${suggestion}\n\n`;
  }

  if (docFiles.length > 0) {
    body += `✅ **Docs Updated:** ${docFiles.map((f) => f.filename).join(', ')}\n\n`;
  }

  if (body) {
    await octokit.rest.issues.createComment({
      owner: payload.repository.owner.login,
      repo: payload.repository.name,
      issue_number: payload.pull_request.number,
      body,
    });
  }
}

export { handleDocsCheck };
