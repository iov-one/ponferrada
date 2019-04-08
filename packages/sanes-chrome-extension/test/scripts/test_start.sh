#!/bin/bash
set -o errexit -o nounset -o pipefail
command -v shellcheck > /dev/null && shellcheck "$0"

# This runs all the scripts to set up for a local bns testing environment
# (blockchains and faucets).
# Intended as a convenience script for developers.

# get this files directory regardless of pwd when we run it
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

echo
echo ">>> Starting bns chain and faucet..."
echo
bash "${SCRIPT_DIR}"/bnsd/start.sh
bash "${SCRIPT_DIR}"/faucet/bnsd_start.sh

echo
echo ">>> Starting bcpd (demo) chain and faucet..."
echo
bash "${SCRIPT_DIR}"/bcpd/start.sh
bash "${SCRIPT_DIR}"/faucet/bcpd_start.sh

echo
echo ">>> Starting lisk (test) chain and faucet..."
echo
bash "${SCRIPT_DIR}"/lisk/start.sh
bash "${SCRIPT_DIR}"/lisk/load_faucet.sh
bash "${SCRIPT_DIR}"/faucet/lisk_start.sh

echo
echo ">>> Starting ethereum (ganache) chain, scraper and faucet..."
echo
bash "${SCRIPT_DIR}"/ethereum/start.sh
sleep 5
bash "${SCRIPT_DIR}"/faucet/ethereum_start.sh
sleep 5
bash "${SCRIPT_DIR}"/ethereum/scraper_start.sh

echo
echo ">>> Waiting for faucets to load tokens..."
echo
sleep 5
echo "Done!"
