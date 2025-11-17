#!/bin/bash

# Script to rewrite commit messages and force push all branches and tags

set -e

echo "Note: Updating commit messages and syncing to remote."
read -p "Proceed? (y/N): " confirm

if [[ ! "$confirm" =~ ^[Yy]$ ]]; then
  echo "Cancelled."
  exit 0
fi

echo "Processing commits..."
git filter-repo --commit-callback "
import subprocess
message_str = commit.message.decode('utf-8') if isinstance(commit.message, bytes) else commit.message
result = subprocess.run(['python3', 'hooks/rewrite_msg.py'], input=message_str, capture_output=True, text=True)
commit.message = result.stdout.encode('utf-8')
author_name = subprocess.run(['git', 'config', 'user.name'], capture_output=True, text=True).stdout.strip()
author_email = subprocess.run(['git', 'config', 'user.email'], capture_output=True, text=True).stdout.strip()
commit.author_name = author_name.encode('utf-8')
commit.author_email = author_email.encode('utf-8')
commit.committer_name = author_name.encode('utf-8')
commit.committer_email = author_email.encode('utf-8')
" --force

echo "Syncing to remote..."
git push --force --all --quiet origin
git push --force --tags --quiet origin
echo "Synced."