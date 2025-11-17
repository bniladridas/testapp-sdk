#!/bin/bash

# Stage all changes
git add .

# Check if there are changes
if git diff --cached --quiet; then
  echo "No changes to commit"
  exit 0
fi

# Generate commit message using AI
diff=$(git diff --cached)
msg=$(node generate-commit-msg.js "$diff")
if [ $? -ne 0 ]; then
  echo "Failed to generate commit message, using fallback"
  msg="chore: update files"
fi

# Commit
git commit -m "$msg"

# Run rewrite commits
echo "y" | ./rewrite-commits.sh