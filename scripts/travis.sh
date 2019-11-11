#!/bin/bash
# shellcheck disable=SC1091
set -o errexit -o nounset -o pipefail
command -v shellcheck > /dev/null && shellcheck "$0"

#
# Config
#

# https://chrome.google.com/webstore/detail/neuma-staging/ililemcipflfijjbkniehikepfpdgail
export CHROME_WEBSTORE_EXTENSION_ID_STAGING="ililemcipflfijjbkniehikepfpdgail"
# https://chrome.google.com/webstore/detail/neuma/gegmganblgchemddleocdoadmljledcj
export CHROME_WEBSTORE_EXTENSION_ID_PRODUCTION="gegmganblgchemddleocdoadmljledcj"

#
# Travis helpers
#
function fold_start() {
  export CURRENT_FOLD_NAME="$1"

  if [[ "${TRAVIS_COMMIT:-}" != "" ]]; then
    travis_fold start "$CURRENT_FOLD_NAME"
    travis_time_start "$CURRENT_FOLD_NAME"
  else
    echo "Starting $CURRENT_FOLD_NAME"
  fi
}

function fold_end() {
  if [[ "${TRAVIS_COMMIT:-}" != "" ]]; then
    travis_time_finish "$CURRENT_FOLD_NAME"
    travis_fold end "$CURRENT_FOLD_NAME"
  else
    echo "Done with $CURRENT_FOLD_NAME"
  fi
}

source ./scripts/retry.sh

# Ensure no .pyc files are created in node_modules/node-gyp, which cause diffs in the node_modules cache
export PYTHONDONTWRITEBYTECODE=1

echo "Lerna default concurrency: $(node -e 'console.log(os.cpus().length)')"

#
# Install
#
fold_start "yarn-install"
retry 3 yarn install
fold_end

#
# Build
#

fold_start "yarn-dry-build"
# Finds compile errors that are not detected by the create-react-app production builds
yarn dry-build
fold_end

fold_start "yarn-lint"
yarn lint
fold_end

fold_start "yarn-build"
yarn build
fold_end

fold_start "yarn-build-storybook"
yarn build-storybook
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
DOCKER_BUILD_VERSION=$(echo "${TRAVIS_COMMIT}" | cut -c 1-10);
(
  cd packages/sanes-browser-extension
  yarn export-staging
  yarn export-production
)
(
  cd packages/bierzo-wallet
  yarn override-config-staging
  docker build -t "iov1/bierzo-wallet:$DOCKER_BUILD_VERSION" .
)
(
  cd packages/sil-governance
  yarn override-config-staging
  docker build -t "iov1/sil-governance:$DOCKER_BUILD_VERSION" .
)
fold_end

#
# Deployment
#

# Detects if a version tag is a prerelease according to the semver definition (https://semver.org/#spec-item-9)
# Example inputs: v1.0.0-alpha.1, v1.0.0
function is_prerelease() {
  # Bash uses the Extended Regular Expression (ERE) dialect
  if [[ $1 =~ '-' ]]; then
    return 0
  else
    return 1
  fi
}

if [[ "$TRAVIS_BRANCH" == "master" ]] && [[ "$TRAVIS_TAG" == "" ]] && [[ "$TRAVIS_PULL_REQUEST_BRANCH" == "" ]]; then
  echo "Running master deployments ..."

  (
    fold_start "deployment-dockerhub"
    docker login -u "$DOCKER_USERNAME" -p "$DOCKER_PASSWORD"

    docker tag "iov1/bierzo-wallet:$DOCKER_BUILD_VERSION" "iov1/bierzo-wallet:latest"
    docker push "iov1/bierzo-wallet:latest"

    docker tag "iov1/sil-governance:$DOCKER_BUILD_VERSION" "iov1/sil-governance:latest"
    docker push "iov1/sil-governance:latest"

    docker logout
    fold_end
  )

  (
    fold_start "deployment-firebase"
    (
      cd packages/valdueza-storybook
      yarn deploy-storybook --token "$FIREBASE_TOKEN"
    )
    fold_end
  )
elif [[ "$TRAVIS_TAG" != "" ]]; then
  echo "Running deployments for tag $TRAVIS_TAG ..."

  (
    fold_start "deployment-dockerhub"
    docker login -u "$DOCKER_USERNAME" -p "$DOCKER_PASSWORD"

    docker tag "iov1/bierzo-wallet:$DOCKER_BUILD_VERSION" "iov1/bierzo-wallet:$TRAVIS_TAG"
    docker push "iov1/bierzo-wallet:$TRAVIS_TAG"

    docker tag "iov1/sil-governance:$DOCKER_BUILD_VERSION" "iov1/sil-governance:$TRAVIS_TAG"
    docker push "iov1/sil-governance:$TRAVIS_TAG"

    docker logout
    fold_end
  )

  (
    fold_start "deployment-firebase"
    FIREBASE_MESSAGE="Travis build: Git tag $TRAVIS_TAG"
    (
      cd packages/bierzo-wallet
      yarn override-config-staging
      yarn deploy-staging --token "$FIREBASE_TOKEN" --message "$FIREBASE_MESSAGE"

      if ! is_prerelease "$TRAVIS_TAG" ; then
        yarn override-config-production
        yarn deploy-production --token "$FIREBASE_TOKEN" --message "$FIREBASE_MESSAGE"
      fi
    )
    (
      cd packages/sil-governance
      yarn override-config-staging
      yarn deploy-staging --token "$FIREBASE_TOKEN" --message "$FIREBASE_MESSAGE"

      if ! is_prerelease "$TRAVIS_TAG" ; then
        yarn override-config-production
        yarn deploy-production --token "$FIREBASE_TOKEN" --message "$FIREBASE_MESSAGE"
      fi
    )
    fold_end
  )

  (
    fold_start "deployment-chromewebstore"
    # Create CHROME_WEBSTORE_CLIENT_ID, CHROME_WEBSTORE_CLIENT_SECRET, CHROME_WEBSTORE_REFRESH_TOKEN
    # as described in https://developer.chrome.com/webstore/using_webstore_api#beforeyoubegin
    ACCESS_TOKEN=$(curl -sS \
      -X POST \
      -d "client_id=$CHROME_WEBSTORE_CLIENT_ID&client_secret=$CHROME_WEBSTORE_CLIENT_SECRET&refresh_token=$CHROME_WEBSTORE_REFRESH_TOKEN&grant_type=refresh_token" \
      https://www.googleapis.com/oauth2/v4/token | jq -r -e ".access_token")

    # https://developer.chrome.com/webstore/using_webstore_api#uploadnew
    # Note: this command fails with curl 7.54.0 from Mac but works with curl 7.65.0 from Homebrew
    curl --version
    curl -sS \
      -H "Authorization: Bearer $ACCESS_TOKEN" \
      -H "x-goog-api-version: 2" \
      -X PUT \
      -T packages/sanes-browser-extension/exports/staging/*.zip \
      "https://www.googleapis.com/upload/chromewebstore/v1.1/items/$CHROME_WEBSTORE_EXTENSION_ID_STAGING"
    echo # add missing newline

    if ! is_prerelease "$TRAVIS_TAG" ; then
      curl -sS \
        -H "Authorization: Bearer $ACCESS_TOKEN" \
        -H "x-goog-api-version: 2" \
        -X PUT \
        -T packages/sanes-browser-extension/exports/production/*.zip \
        "https://www.googleapis.com/upload/chromewebstore/v1.1/items/$CHROME_WEBSTORE_EXTENSION_ID_PRODUCTION"
      echo # add missing newline
    fi

    # Publish
    curl -sS \
      -H "Authorization: Bearer $ACCESS_TOKEN" \
      -H "x-goog-api-version: 2" \
      -H "Content-Length: 0" \
      -X POST \
      "https://www.googleapis.com/chromewebstore/v1.1/items/$CHROME_WEBSTORE_EXTENSION_ID_STAGING/publish"
    echo # add missing newline

    if ! is_prerelease "$TRAVIS_TAG" ; then
      curl -sS \
        -H "Authorization: Bearer $ACCESS_TOKEN" \
        -H "x-goog-api-version: 2" \
        -H "Content-Length: 0" \
        -X POST \
        "https://www.googleapis.com/chromewebstore/v1.1/items/$CHROME_WEBSTORE_EXTENSION_ID_PRODUCTION/publish"
      echo # add missing newline
    fi
    fold_end
  )
else
  echo "Not a mater or tag build, skipping deployment"
fi
