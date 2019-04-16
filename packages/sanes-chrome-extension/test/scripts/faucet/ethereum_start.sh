#!/bin/bash
set -o errexit -o nounset -o pipefail
command -v shellcheck > /dev/null && shellcheck "$0"

# Choose from https://hub.docker.com/r/iov1/iov-faucet/tags/
FAUCET_VERSION="v0.5.2"

TMP_DIR=$(mktemp -d "${TMPDIR:-/tmp}/faucet_start_ethereum.XXXXXXXXX")
LOGFILE="$TMP_DIR/faucet_ethereum.log"

docker pull "alpine"
DOCKER_HOST_IP=$(docker run --rm alpine ip route | awk 'NR==1 {print $3}')

BLOCKCHAIN_URL="http://$DOCKER_HOST_IP:8545"
echo "Connecting to $BLOCKCHAIN_URL"

docker pull "iov1/iov-faucet:${FAUCET_VERSION}"

docker run --read-only \
  --name "ethereum_faucet" \
  --env "FAUCET_CONCURRENCY=3" \
  --env "FAUCET_MNEMONIC=oxygen fall sure lava energy veteran enroll frown question detail include maximum"  \
  --env "FAUCET_PORT=8003" \
  -p 8003:8003 \
  --rm "iov1/iov-faucet:${FAUCET_VERSION}" \
  start ethereum "$BLOCKCHAIN_URL" \
  > "$LOGFILE" &

echo "Faucet running and logging into $LOGFILE"
