#!/bin/bash

# Script to rewrite commit messages and force push all branches and tags

set -e

echo "Rewriting commit messages..."
FILTER_BRANCH_SQUELCH_WARNING=1 git filter-branch -f --msg-filter "$(pwd)/hooks/rewrite_msg.sh" -- --all

echo "Force pushing all branches..."
git push --force --all origin

echo "Force pushing all tags..."
git push --force --tags origin

echo "Done!"