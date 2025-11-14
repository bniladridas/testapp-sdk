#!/bin/bash

# Script to rewrite commit messages and force push all branches and tags

set -e

# Check if git-filter-repo is installed
if ! command -v git-filter-repo >/dev/null 2>&1; then
    echo "Installing git-filter-repo..."
    brew install git-filter-repo
fi

echo "Rewriting commit messages with git-filter-repo..."
git filter-repo --message-callback "
import subprocess
import os

def callback(message):
    script_path = os.path.join(os.getcwd(), 'hooks', 'rewrite_msg.sh')
    proc = subprocess.run([script_path], input=message.decode('utf-8'), capture_output=True, text=True)
    return proc.stdout.encode('utf-8')

return callback
" --force

echo "Force pushing all branches..."
git push --force --all origin

echo "Force pushing all tags..."
git push --force --tags origin

echo "Done!"