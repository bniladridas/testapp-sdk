#!/bin/bash

# Rewrite commit message: lowercase first line, truncate to 40 chars if needed, add "..." if truncated

read -r FIRST_LINE
REST=$(cat)

# Lowercase first line
FIRST_LINE=$(echo "$FIRST_LINE" | tr '[:upper:]' '[:lower:]')

# Check if longer than 40
ORIGINAL_LENGTH=${#FIRST_LINE}
FIRST_LINE=$(echo "$FIRST_LINE" | cut -c1-40)

if [ $ORIGINAL_LENGTH -gt 40 ]; then
  FIRST_LINE="${FIRST_LINE}..."
fi

echo "$FIRST_LINE"
echo "$REST"