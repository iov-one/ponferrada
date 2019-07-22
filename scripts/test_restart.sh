#!/bin/bash
set -o errexit -o nounset -o pipefail
command -v shellcheck > /dev/null && shellcheck "$0"

# get this files directory regardless of pwd when we run it
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

"${SCRIPT_DIR}"/test_stop.sh

if [[ $(docker ps -q) ]]; then
  echo "Some docker containers are still running, which indicates some kind of problem. Please check manually."
  echo ""
  echo "$ docker ps"
  docker ps
  exit 1
fi

"${SCRIPT_DIR}"/test_start.sh
