#!/bin/sh
#
# POSIX Commit Message Beautifier (Emoji only for shorthand)

read FIRST_LINE
REST=$(cat)

EMOJI=""

# ---------------------------------------------------------
# 1. Shorthand mappings (emoji only applied here)
# ---------------------------------------------------------
case "$FIRST_LINE" in
  "lbratui") FIRST_LINE="feat: initial project setup"; EMOJI=" 🌿" ;;
  "ldownloads") FIRST_LINE="feat: add download features"; EMOJI=" 🌿" ;;
  "lupdate") FIRST_LINE="feat: update project files"; EMOJI=" 🌿" ;;
  "ladd") FIRST_LINE="feat: add project files"; EMOJI=" 🌿" ;;
  "ladd cli") FIRST_LINE="feat: add cli functionality"; EMOJI=" 🌿" ;;
  "lswitch to gemini") FIRST_LINE="feat: integrate gemini ai"; EMOJI=" 🌿" ;;
  "lorganize cli modular") FIRST_LINE="refactor: modularize cli"; EMOJI=" 🌿" ;;
  "lfix server syntax") FIRST_LINE="fix: correct server syntax"; EMOJI=" 🌿" ;;
  "ladd unit and e2e tests") FIRST_LINE="test: add unit and e2e tests"; EMOJI=" 🌿" ;;
  "lsimplify app to single page, remove foo") FIRST_LINE="refactor: simplify to single page app"; EMOJI=" 🌿" ;;
  *) ;;
esac

# ---------------------------------------------------------
# 2. Lowercase
# ---------------------------------------------------------
FIRST_LINE=$(printf "%s" "$FIRST_LINE" | tr 'A-Z' 'a-z')

# ---------------------------------------------------------
# 3. Ensure commit type
# ---------------------------------------------------------
case "$FIRST_LINE" in
  feat:*|fix:*|docs:*|style:*|refactor:*|test:*|chore:*|perf:*|ci:*|build:*|revert:*)
    ;;
  *)
    FIRST_LINE="feat: $FIRST_LINE"
    ;;
esac

# ---------------------------------------------------------
# 4. Truncate at 40 chars
# ---------------------------------------------------------
MAX=40
LEN=$(printf "%s" "$FIRST_LINE" | wc -c | tr -d ' ')

if [ "$LEN" -gt "$MAX" ]; then
  TRUNC=$(printf "%s" "$FIRST_LINE" | cut -c1-$MAX)

  LAST_SPACE=$(printf "%s" "$TRUNC" | awk '{
      len=length($0);
      split($0,a," ");
      end=len-length(a[length(a)])-1;
      print end;
  }')

  if [ "$LAST_SPACE" -gt 0 ]; then
    FIRST_LINE=$(printf "%s" "$FIRST_LINE" | cut -c1-"$LAST_SPACE")
  else
    FIRST_LINE="$TRUNC"
  fi

  FIRST_LINE=$(printf "%s" "$FIRST_LINE" | sed 's/[[:space:]]*$//')
  FIRST_LINE="${FIRST_LINE}..."
fi

# ---------------------------------------------------------
# 5. Add emoji ONLY if shorthand triggered it
# ---------------------------------------------------------
FIRST_LINE="${FIRST_LINE}${EMOJI}"

# ---------------------------------------------------------
# 6. Output
# ---------------------------------------------------------
printf "%s\n" "$FIRST_LINE"
printf "%s\n" "$REST"
