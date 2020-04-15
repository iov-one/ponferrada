#!/bin/bash
set -o errexit -o nounset -o pipefail
command -v shellcheck > /dev/null && shellcheck "$0"

# This stops all the scripts to set up for a local bns testing environment
# (blockchains and faucets).
# Intended as a convenience script for developers, and counter to test_start.sh

# get this files directory regardless of pwd when we run it
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

echo
echo ">>> Stopping bns chain and faucet..."
echo
"${SCRIPT_DIR}"/faucet/bnsd_stop.sh || true
"${SCRIPT_DIR}"/bnsd/stop.sh || true

echo
echo ">>> Stopping lisk chain and faucet..."
echo
"${SCRIPT_DIR}"/faucet/lisk_stop.sh || true
"${SCRIPT_DIR}"/lisk/stop.sh || true

echo
echo ">>> Stopping ethereum chain, scraper and faucet..."
echo
"${SCRIPT_DIR}"/faucet/ethereum_stop.sh || true
"${SCRIPT_DIR}"/ethereum/scraper_stop.sh || true
"${SCRIPT_DIR}"/ethereum/stop.sh || true

echo
echo ">>> Stopping cosmos chain..."
echo
"${SCRIPT_DIR}"/wasmd/stop.sh || true

echo "Done!"
