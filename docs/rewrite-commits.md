# Rewrite Commits Script

This script rewrites all commit messages in the repository using the `hooks/rewrite_msg.py` filter, then force pushes all branches and tags to the remote.

## Usage

Run the script from the repository root:

```bash
./rewrite-commits.sh
```

It will prompt for confirmation before proceeding.

## Warning

This script performs destructive operations:
- Rewrites all commit history
- Removes and re-adds the origin remote
- Force pushes to remote, which can overwrite remote branches and tags
- Use with caution, as it can cause issues for collaborators

Ensure you have a backup or are working on a fresh clone.

## What it does

1. Prompts for confirmation to proceed
2. Uses `git filter-repo` to apply `hooks/rewrite_msg.py` to all commit messages
3. Re-adds the origin remote
4. Force pushes all branches to origin
5. Force pushes all tags to origin

Note: Uses `git filter-repo` for modern, efficient rewriting.