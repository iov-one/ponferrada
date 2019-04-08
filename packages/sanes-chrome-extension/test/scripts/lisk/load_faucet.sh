#!/bin/bash
set -o errexit -o nounset -o pipefail
command -v shellcheck > /dev/null && shellcheck "$0"

# Wait lisk node to be ready
timeout 50 bash -c "until curl http://localhost:4000/api/node/status; do sleep 2; done"

curl -sS -X POST \
  -H "Content-type: application/json" \
  -d '{"amount":"1000000000000","recipientId":"9061425315350165588L","senderPublicKey":"c094ebee7ec0c50ebee32918655e089f6e1a604b83bcaa760293c61e0f18ab6f","timestamp":83967732,"type":0,"fee":"10000000","asset":{},"signature":"92e5e8eb9ad9bd09b952c5dea6274b29554960c30b043e700c0366b6202b615f67c1b10bc9b31e0d5c30844eb7430a58b034f3924e653a18442c6a76ca3a9c00","id":"1924379852824665212"}' \
  http://localhost:4000/api/transactions
echo # add line break

# Wait until block is forged and processed
sleep 10
echo "Lisk Faucet loaded with 10000 LSK"
