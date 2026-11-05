#!/usr/bin/env bash
# Renders the project mock-ups into public/images with headless Chrome (macOS, Google Chrome installed).
# Usage: design/mocks/render.sh
set -euo pipefail
cd "$(dirname "$0")"
CHROME="${CHROME:-/Applications/Google Chrome.app/Contents/MacOS/Google Chrome}"
for name in finai-dashboard eshop-store; do
  "$CHROME" --headless=new --disable-gpu --hide-scrollbars --force-device-scale-factor=1 \
    --window-size=1920,1080 --screenshot="../../public/images/$name.png" "file://$PWD/$name.html" >/dev/null 2>&1
  echo "rendered $name.png"
done
