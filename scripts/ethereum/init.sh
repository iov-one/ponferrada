#!/bin/bash
set -o errexit -o nounset -o pipefail
command -v shellcheck > /dev/null && shellcheck "$0"

export GANACHE_PORT="8545"

SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

# Don't pull before run. We can use whatever version of alpine is available locally.
DOCKER_HOST_IP=$(docker run --rm alpine ip route | awk 'NR==1 {print $3}')

echo "Initializing data on ws://$DOCKER_HOST_IP:$GANACHE_PORT/ws ..."
echo "Nothing to initialize yet but here we will deploy the smart contracts as soon as https://github.com/iov-one/iov-core/issues/979 is done."
