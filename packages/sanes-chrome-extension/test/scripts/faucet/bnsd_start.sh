#!/bin/bash
set -o errexit -o nounset -o pipefail
command -v shellcheck > /dev/null && shellcheck "$0"

# Choose from https://hub.docker.com/r/iov1/iov-faucet/tags/
FAUCET_VERSION="v0.5.2"

TMP_DIR=$(mktemp -d "${TMPDIR:-/tmp}/faucet_start.XXXXXXXXX")
LOGFILE="$TMP_DIR/faucet.log"

docker pull "alpine"
DOCKER_HOST_IP=$(docker run --rm alpine ip route | awk 'NR==1 {print $3}')

BLOCKCHAIN_URL="ws://$DOCKER_HOST_IP:23456"
echo "Connecting to $BLOCKCHAIN_URL"

docker pull "iov1/iov-faucet:${FAUCET_VERSION}"
docker run --read-only \
  --name "bnsd_faucet" \
  --env "FAUCET_CONCURRENCY=3" \
  --env "FAUCET_COIN_TYPE=1" \
  --env "FAUCET_MNEMONIC=lazy luxury exit tail ethics guide voice ribbon denial seat reopen runway"  \
  -p 8000:8000 \
  --rm "iov1/iov-faucet:${FAUCET_VERSION}" \
  start bns "$BLOCKCHAIN_URL" \
  > "$LOGFILE" &

echo "Faucet running and logging into $LOGFILE"
