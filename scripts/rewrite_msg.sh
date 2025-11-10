#!/bin/bash

# Rewrite commit message: map unclear messages, lowercase, truncate at word boundary if needed, add "..." if truncated

read -r FIRST_LINE
REST=$(cat)

# Map unclear messages to better ones
case "$FIRST_LINE" in
  "lbratui") FIRST_LINE="feat: initial project setup" ;;
  "ldownloads") FIRST_LINE="feat: add download features" ;;
  "lupdate") FIRST_LINE="feat: update project files" ;;
  "ladd") FIRST_LINE="feat: add project files" ;;
  "ladd cli") FIRST_LINE="feat: add cli functionality" ;;
  "lswitch to gemini") FIRST_LINE="feat: integrate gemini ai" ;;
  "lorganize cli modular") FIRST_LINE="refactor: modularize cli" ;;
  "lfix server syntax") FIRST_LINE="fix: correct server syntax" ;;
  "ladd unit and e2e tests") FIRST_LINE="test: add unit and e2e tests" ;;
  "lsimplify app to single page, remove foo") FIRST_LINE="refactor: simplify to single page app" ;;
  *) ;;
esac

# Lowercase first line
FIRST_LINE=$(echo "$FIRST_LINE" | tr '[:upper:]' '[:lower:]')

# Ensure starts with type: if not
if ! echo "$FIRST_LINE" | grep -qE "^(feat|fix|docs|style|refactor|test|chore|perf|ci|build|revert):"; then
  FIRST_LINE="feat: $FIRST_LINE"
fi

# Check if longer than 40
if [ ${#FIRST_LINE} -gt 40 ]; then
  # Truncate at last space before 40
  TRUNCATED=$(echo "$FIRST_LINE" | cut -c1-40)
  LAST_SPACE=$(echo "$TRUNCATED" | awk '{print length($0) - length($NF)}')
  if [ $LAST_SPACE -gt 0 ]; then
    FIRST_LINE=$(echo "$FIRST_LINE" | cut -c1-$LAST_SPACE | sed 's/[[:space:]]*$//')
  else
    FIRST_LINE=$TRUNCATED
  fi
  FIRST_LINE="${FIRST_LINE}..."
fi

echo "$FIRST_LINE"
echo "$REST"