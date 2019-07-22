#!/bin/bash
set -o errexit -o nounset -o pipefail
command -v shellcheck > /dev/null && shellcheck "$0"

echo "Killing Ethereum scraper container ..."
docker container kill "ethereum-scraper"
