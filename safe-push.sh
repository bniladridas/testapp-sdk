#!/bin/bash

# Stage all changes
git add .

# Check if there are changes
if git diff --cached --quiet; then
  echo "No changes to commit"
  exit 0
fi

# Generate commit message based on changed files
files=$(git diff --cached --name-only)
if [[ $files == *".md"* ]]; then
  msg="docs: update documentation"
elif [[ $files == *".js"* ]] || [[ $files == *".ts"* ]] || [[ $files == *".tsx"* ]]; then
  msg="feat: update code"
elif [[ $files == *".json"* ]] || [[ $files == *".yml"* ]]; then
  msg="chore: update config"
else
  msg="chore: update files"
fi

# Commit
git commit -m "$msg"

# Run rewrite commits
echo "y" | ./rewrite-commits.sh