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

source ./scripts/retry.sh

# Ensure no .pyc files are created in node_modules/node-gyp, which cause diffs in the node_modules cache
export PYTHONDONTWRITEBYTECODE=1

#
# Install
#
fold_start "yarn-install"
retry 3 yarn install
fold_end

#
# Build
#

fold_start "yarn-build"
yarn build
fold_end

fold_start "yarn-lint"
yarn lint
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

#
# Export
#
fold_start "export"
(
  cd packages/sanes-chrome-extension
  yarn export-staging
)
fold_end

#
# Deployment
#
if [[ "$TRAVIS_TAG" != "" ]]; then
  fold_start "deployment"
  echo "Uploading export for tag $TRAVIS_TAG"

  # Create CLIENT_ID, CLIENT_SECRET, REFRESH_TOKEN as described in https://developer.chrome.com/webstore/using_webstore_api#beforeyoubegin
  ACCESS_TOKEN=$(curl -sS \
    -X POST \
    -d "client_id=$CLIENT_ID&client_secret=$CLIENT_SECRET&refresh_token=$REFRESH_TOKEN&grant_type=refresh_token" \
    https://www.googleapis.com/oauth2/v4/token | jq -r ".access_token")

  # https://developer.chrome.com/webstore/using_webstore_api#uploadnew
  # Note: this command fails with curl 7.54.0 from Mac but works with curl 7.65.0 from Homebrew
  curl --version
  curl -sSv \
    -H "Authorization: Bearer $ACCESS_TOKEN" \
    -H "x-goog-api-version: 2" \
    -X PUT \
    -T packages/sanes-chrome-extension/exports/*.zip \
    "https://www.googleapis.com/upload/chromewebstore/v1.1/items/hkmeinfklhongiffbgkfaandidpmklen"
  curl -sSv \
    -H "Authorization: Bearer $ACCESS_TOKEN" \
    -H "x-goog-api-version: 2" \
    -H "Content-Length: 0" \
    -X POST \
    "https://www.googleapis.com/upload/chromewebstore/v1.1/items/hkmeinfklhongiffbgkfaandidpmklen/publish"
  fold_end
else
  echo "Not a tag build, skipping deployment"
fi
