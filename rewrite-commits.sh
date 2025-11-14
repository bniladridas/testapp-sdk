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
import os
# Ensure we are in repo root
os.chdir('$(pwd)')
result = subprocess.run(['python3', 'hooks/rewrite_msg.py'], input=message, capture_output=True, text=True)
return result.stdout.strip()
" --force

echo "Force pushing all branches..."
git push --force --all origin

echo "Force pushing all tags..."
git push --force --tags origin

echo "Done!"