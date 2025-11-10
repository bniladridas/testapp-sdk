#!/bin/bash

# Rewrite commit message: lowercase first line, truncate to 40 chars if needed

read -r FIRST_LINE
REST=$(cat)

# Lowercase first line
FIRST_LINE=$(echo "$FIRST_LINE" | tr '[:upper:]' '[:lower:]')

# Truncate to 40 chars
FIRST_LINE=$(echo "$FIRST_LINE" | cut -c1-40)

echo "$FIRST_LINE"
echo "$REST"