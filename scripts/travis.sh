#!/bin/bash
# shellcheck disable=SC1091
set -o errexit -o nounset -o pipefail
command -v shellcheck > /dev/null && shellcheck "$0"

#
# Config
#

function fold_start() {
  export CURRENT_FOLD_NAME="$1"
  travis_fold start "$CURRENT_FOLD_NAME"
  travis_time_start
}

function fold_end() {
  travis_time_finish
  travis_fold end "$CURRENT_FOLD_NAME"
}

#
# Install
#

source ./scripts/retry.sh
retry 3 yarn install

#
# Build
#

fold_start "yarn-lint"
yarn lint
fold_end

fold_start "yarn-build"
yarn build
fold_end

#
# Sanity
#
fold_start "check-dirty"
# Ensure build step didn't modify source files to avoid unprettified repository state
SOURCE_CHANGES=$(git status --porcelain)
if [[ -n "$SOURCE_CHANGES" ]]; then
  echo "Error: repository contains changes."
  echo "Showing 'git status' and 'git diff' for debugging reasons now:"
  git status
  git diff
  exit 1
fi
fold_end

#
# Start chains
#
fold_start "chains-start"
./scripts/test_start.sh
export CHAINS_ENABLED=1
fold_end

#
# Test
#
fold_start "yarn-tests"
xvfb-run --auto-servernum yarn test
fold_end

#
# Stop chains
#
fold_start "chains-stop"
unset CHAINS_ENABLED
./scripts/test_stop.sh
fold_end
