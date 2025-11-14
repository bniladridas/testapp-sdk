#!/usr/bin/env python3

import sys

first_line = sys.stdin.readline().strip()
rest = sys.stdin.read()

emoji = ""

# Shorthand mappings
shorthands = {
    "lbratui": "feat: initial project setup",
    "ldownloads": "feat: add download features",
    "lupdate": "feat: update project files",
    "ladd": "feat: add project files",
    "ladd cli": "feat: add cli functionality",
    "lswitch to gemini": "feat: integrate gemini ai",
    "lorganize cli modular": "refactor: modularize cli",
    "lfix server syntax": "fix: correct server syntax",
    "ladd unit and e2e tests": "test: add unit and e2e tests",
    "lsimplify app to single page, remove foo": "refactor: simplify to single page app",
}

if first_line in shorthands:
    first_line = shorthands[first_line]
    emoji = " 🌿"

# Lowercase
first_line = first_line.lower()

# Ensure commit type
types = ['feat', 'fix', 'docs', 'style', 'refactor', 'test', 'chore', 'perf', 'ci', 'build', 'revert']
if not any(first_line.startswith(t + ':') for t in types):
    first_line = "feat: " + first_line

# Truncate at 40 chars
max_len = 40
if len(first_line) > max_len:
    truncated = first_line[:max_len]
    last_space = truncated.rfind(' ')
    if last_space > 0:
        first_line = first_line[:last_space]
    else:
        first_line = truncated
    first_line = first_line.rstrip() + "..."

# Add emoji
first_line += emoji

print(first_line)
print(rest, end='')