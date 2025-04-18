#!/bin/bash

# Get the directory of the script and the current directory
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
CURRENT_DIR="$(pwd)"

# If we're not already in the project root directory, navigate there
if [[ "$(basename "$CURRENT_DIR")" == ".scripts" ]]; then
  cd ..
elif [[ "$CURRENT_DIR" != "$(dirname "$SCRIPT_DIR")" ]]; then
  cd "$(dirname "$SCRIPT_DIR")"
fi

# Build the full Docker image
echo "=== Building Docker image ==="
docker build --no-cache -t nestjs-final .

# Show image size
echo "=== Docker image details ==="
docker images nestjs-final

# Analyze image layers
echo "=== Analyzing Docker image layers ==="
docker history --human --format "{{.CreatedBy}}: {{.Size}}" nestjs-final | sort -hr -k2

echo "=== Analyzing Docker image with dive (if installed) ==="
if command -v dive &> /dev/null; then
  dive nestjs-final
else
  echo "dive is not installed. Install it to analyze the Docker image layers in detail."
  echo "Instructions: https://github.com/wagoodman/dive#installation"
  
  # Alternative analysis without dive
  echo "=== Alternative layer analysis ==="
  docker inspect nestjs-final --format='{{json .RootFS.Layers}}' | jq -r '. | length'
  echo "Number of layers: $(docker inspect nestjs-final --format='{{json .RootFS.Layers}}' | jq -r '. | length')"
fi

echo "=== Done! ==="