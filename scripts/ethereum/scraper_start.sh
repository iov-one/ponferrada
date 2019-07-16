#!/bin/bash
set -o errexit -o nounset -o pipefail
command -v shellcheck > /dev/null && shellcheck "$0"

# Choose from https://hub.docker.com/r/iov1/iov-scraper-ethereum/tags
SCRAPER_VERSION="v0.3.0"

TMP_DIR=$(mktemp -d "${TMPDIR:-/tmp}/scraper_start_ethereum.XXXXXXXXX")
LOGFILE="$TMP_DIR/scraper_ethereum.log"

DOCKER_HOST_IP=$(docker run --rm alpine ip route | awk 'NR==1 {print $3}')

BLOCKCHAIN_URL="http://$DOCKER_HOST_IP:8545"
echo "Connecting to $BLOCKCHAIN_URL"

docker run --read-only \
  --name "ethereum-scraper" \
  -p 8546:8546 \
  --rm "iov1/iov-scraper-ethereum:${SCRAPER_VERSION}" \
  start "$BLOCKCHAIN_URL" \
  > "$LOGFILE" &

echo "Ethereum Scraper running and logging into $LOGFILE"
