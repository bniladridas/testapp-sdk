#!/bin/bash

# Script to rewrite commit messages and force push all branches and tags

set -e

echo "WARNING: This script will rewrite all commit messages and force push to remote."
echo "This is destructive and can cause issues for collaborators."
read -p "Are you sure you want to proceed? (y/N): " confirm

if [[ ! "$confirm" =~ ^[Yy]$ ]]; then
  echo "Aborted."
  exit 1
fi

echo "Rewriting commit messages..."
git filter-repo --message-callback "
import subprocess
message_str = message.decode('utf-8') if isinstance(message, bytes) else message
result = subprocess.run(['python3', 'hooks/rewrite_msg.py'], input=message_str, capture_output=True, text=True)
return result.stdout.encode('utf-8')
" --preserve-remotes --force

echo "Force pushing all branches..."
git push --force --all origin

echo "Force pushing all tags..."
git push --force --tags origin

echo "Done!"