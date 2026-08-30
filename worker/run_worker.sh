#!/bin/bash
# ==============================================================================
# The Port — Mac Worker Runner (with Caffeinate)
# Prevents Mac from sleeping while processing document conversion jobs
# ==============================================================================

DIR="$(cd "$(dirname "$0")" && pwd)"
ROOT_DIR="$(cd "$DIR/.." && pwd)"

echo "==> Starting The Port Mac Worker Daemon with sleep prevention (caffeinate)..."
echo "    Working Directory: $ROOT_DIR"
echo "    Backend Target: ${BACKEND_URL:-http://localhost:3001}"

# caffeinate -s: Prevents system sleep when on AC power
exec caffeinate -s node "$DIR/worker.js"
