#!/bin/bash

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null 2>&1 && pwd )"

cd "${DIR}/.."
rm -r node_modules/
rm yarn.lock
lerna clean -y

yarn install && yarn build

