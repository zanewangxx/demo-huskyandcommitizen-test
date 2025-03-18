#!/bin/sh

# Add emoji if global files were modified
if grep -q "WARNING" $1; then
  echo -e "\n🚨 WARNING: Global files modified!" >> $1
fi