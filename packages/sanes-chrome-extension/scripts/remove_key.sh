#!/bin/bash
set -o errexit -o nounset -o pipefail
command -v shellcheck > /dev/null && shellcheck "$0"

SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
PACKAGE_ROOT="$SCRIPT_DIR/.."

ORIGINAL=$(< "$PACKAGE_ROOT/build/manifest.json")
echo "$ORIGINAL" \
  | jq "del(.key)" \
  > "$PACKAGE_ROOT/build/manifest.json"
