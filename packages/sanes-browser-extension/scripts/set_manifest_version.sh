#!/bin/bash
set -o errexit -o nounset -o pipefail
command -v shellcheck > /dev/null && shellcheck "$0"

SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
PACKAGE_ROOT="$SCRIPT_DIR/.."

LERNA_VERSION=$(jq -r '.version' "$PACKAGE_ROOT/../../lerna.json")

# Cut the prerelease part (1.2.3 or 1.2.3-alpha are both changed to 1.2.3)
PLAIN_VERSION=$(echo "$LERNA_VERSION" | cut -d '-' -f 1)

# Use $TRAVIS_BUILD_NUMBER on Travis and 0 locally
BUILD_NUMBER="${TRAVIS_BUILD_NUMBER:-0}"

# Extensions need a numeric version number of up to 4 digits for updating
# See https://developer.chrome.com/apps/manifest/version
EXTENSION_VERSION_NUMERIC="$PLAIN_VERSION.$BUILD_NUMBER"
EXTENSION_VERSION_NAME="$LERNA_VERSION"

ORIGINAL=$(< "$PACKAGE_ROOT/build/manifest.json")
echo "$ORIGINAL" \
  | jq ".version = \"$EXTENSION_VERSION_NUMERIC\"" \
  | jq ".version_name = \"$EXTENSION_VERSION_NAME\"" \
  > "$PACKAGE_ROOT/build/manifest.json"
