# Rewrite Commits Script

This script rewrites all commit messages in the repository using the `hooks/rewrite_msg.sh` filter, then force pushes all branches and tags to the remote.

## Usage

Run the script from the repository root:

```bash
./rewrite-commits.sh
```

## Warning

This script performs destructive operations:
- Rewrites all commit history
- Force pushes to remote, which can overwrite remote branches and tags
- Use with caution, as it can cause issues for collaborators

Ensure you have a backup or are working on a fresh clone.

## What it does

1. Uses `git filter-branch` to apply `hooks/rewrite_msg.sh` to all commit messages
2. Force pushes all branches to origin
3. Force pushes all tags to origin

Note: `git filter-branch` is deprecated; consider using `git filter-repo` for new projects.