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
# Test
#
fold_start "yarn-tests"
bash ./packages/sanes-chrome-extension/test/scripts/test_start.sh
export CHAINS_ENABLED=1
yarn test
bash ./packages/sanes-chrome-extension/test/scripts/test_stop.sh
fold_end
