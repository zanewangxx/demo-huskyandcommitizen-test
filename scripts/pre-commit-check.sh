#!/bin/sh

# List of global files to monitor
GLOBAL_FILES="src/shared-components/Button.js config/env.js"

# Check if any global files are modified
CHANGED_FILES=$(git diff --name-only --cached)
WARNING_TRIGGERED=false

for file in $CHANGED_FILES; do
  if [[ " $GLOBAL_FILES " =~ " $file " ]]; then
    echo "⚠️  WARNING: You're modifying a global file: $file"
    WARNING_TRIGGERED=true
  fi
done

if [ "$WARNING_TRIGGERED" = true ]; then
  read -p "Are you sure you want to proceed? (yes/no): " RESPONSE
  if [ "$RESPONSE" != "yes" ]; then
    echo "Commit aborted."
    exit 1
  fi
fi