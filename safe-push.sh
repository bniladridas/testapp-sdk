#!/bin/bash

# Stage all changes
git add .

# Auto commit
git commit -m "Auto update"

# Run rewrite commits
echo "y" | ./rewrite-commits.sh