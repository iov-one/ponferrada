#!/bin/bash

echo
echo ">>> Compiling content script..."
echo
echo $PWD
cp ./src/contentscript.ts ./src/index.tsx
yarn build
CONTENTSCRIPT=$(ls ./build/static/js | grep chunk.js$)
cp "./build/static/js/${CONTENTSCRIPT}" "./public/contentscript.js"

echo
echo ">>> Compiling background script..."
echo
cp ./src/backgroundscript.ts ./src/index.tsx
yarn build
ls ./build/static/js | grep chunk.js$

echo
echo ">>> Compiling app itself..."
echo
