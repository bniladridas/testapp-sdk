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
git filter-repo --message-callback "
import subprocess
message_str = message.decode('utf-8') if isinstance(message, bytes) else message
result = subprocess.run(['python3', 'hooks/rewrite_msg.py'], input=message_str, capture_output=True, text=True)
return result.stdout.encode('utf-8')
" --force

echo "Syncing to remote..."
git remote add origin https://github.com/bniladridas/TestApp.git

git push --force --all --quiet origin

git push --force --tags --quiet origin

echo "Synced."