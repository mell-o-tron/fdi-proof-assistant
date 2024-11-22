#!/bin/bash

# Ensure the Node.js script is available
NODE_SCRIPT="separate.js"

if [[ ! -f "$NODE_SCRIPT" ]]; then
  echo "Error: Node.js script '$NODE_SCRIPT' not found."
  exit 1
fi

# Loop through all .json files in the current directory
for file in *.json; do
  # Skip the summary files (_new.json) to avoid reprocessing
  if [[ "$file" == *_new.json ]]; then
    echo "Skipping summary file: $file"
    continue
  fi

  echo "Processing $file..."
  node "$NODE_SCRIPT" "$file"

done

echo "All .json files have been processed."

