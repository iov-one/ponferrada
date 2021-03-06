# Ponferrada

The most beautiful UI in Blockchain.

[![Build Status](https://travis-ci.com/iov-one/ponferrada.svg?token=mAzyz4hbUq3XZX1unzvx&branch=master)](https://travis-ci.com/iov-one/ponferrada)

## Packages

The Ponferrada repo is split in 6 packages:

- **medulas-react-components**: Shared react components between the packages, based on Material-UI.
- **ui-logic**: Shared UI logic functions between the packages.
- **sanes-browser-extension**: Neuma browser extension.
- **bierzo-wallet**: Neuma wallet.
- **sil-governance**: Dashboard for the IOV governance committee.
- **valdueza-storybook**: Storybook configuration.

## Tools

Ponferrada is based on React and Redux. Also uses the power of iov-core to handle the crypto and blockchain communication.

### IOV-Core

[iov-core](https://github.com/iov-one/iov-core) provides core functionality to all clients in a cross-platform typescript library.

In ponferrada, we use the following generic packages from iov-core:

- `@iov/keycontrol`: manages all private keys and keeps them safe. The public API from this package is `UserProfile`.
- `@iov/crypto`: contains low-level cryptographic functionality.
- `@iov/multichain`: the high-level functionality to easily build clients that connect to multiple blockchains. It uses the keymanagement functionality of `UserProfile`, and the generic blockchain connection of `BcpConnection`, and pulls them together into one `MultiChainSigner`, which can query state and sign transactions on multiple blockchains.

And we use the following specific packages to connect to each blockchain:

- `@iov-tendermint-rpc`
- `@iov-ethereum`
- `@iov-lisk`
- `@iov-rise`

#### Key Terms (high level)

- UserProfile: contains user information(wallets, keyring) and access to disk. [See Diagram](https://raw.githubusercontent.com/iov-one/iov-core/master/docs/KeyBaseDiagram.png).
  - Keyring: stores known encryption keys, public keys, private keys.
  - Wallet: contains encryption logic to talk to different blockchains, each blockchains + mnemonic is a different wallet that is added to the profile (UserProfile instance).
- Identity: It is a `chainId` + `pubkey` (Public key). They are created from the profile and are associated to a wallet.
- KeyControl: manages private keys and keeps them safe (to access keyring).
- MultichainSigner: can interact with multiple blockchains, both for making requests and for signed transactions, so it handles private keys, codecs and connections.
- BcpConnection: is a high-level interface to a blockchain node following the [bcp specifications](https://github.com/iov-one/bcp-spec). It contains a set of functions that must be defined for each blockchain, in this way we ensure a unique api to getting account balances, sending tokens, and observing the blockchain state.

For more detail, check [keybase documentation](https://github.com/iov-one/iov-core/blob/master/docs/KeyBase.md) into iov-core folder.

## Interact with the extension

In case you want to make an app that interacts with the Neuma extension, here are some directions to do so.

### The chrome.runtime.sendMessage method

The communication between an app and the extension makes use of [the `sendMessage` method from the `chrome.runtime` API](https://developer.chrome.com/apps/runtime#method-sendMessage):

```typescript
function sendMessage(extensionId: string, message: any, responseCallback?: (response: any) => void): void;
```

- `extensionId`'s [value should vary](https://github.com/iov-one/ponferrada/wiki/Browser-Extension-IDs) according to the environment of the extension you are using.
- `message`'s value would be our request to the extension, that should comply with the [JSON RPC 2.0 specification](https://www.jsonrpc.org/specification). For this, you could input a message with the type of [@iov/jsonrpc's `JsonRpcRequest`](https://github.com/iov-one/iov-core/blob/master/packages/iov-jsonrpc/src/types.ts).

### Extension request types

- Get Identities: returns an array with the identities of the extension's user.
- Sign and Post Transaction: signs the transaction found in the request with the extension's user key, posts it to the chain, and then returns the transaction's ID. The transaction must be [one of the `SupportedTransaction`s](https://github.com/iov-one/ponferrada/blob/master/packages/sanes-browser-extension/src/extension/background/model/persona/index.ts).

### Further directions

There are a lot of helpers that you can set up in order to facilitate the interaction with the extension. You can check [the communications folder of the wallet](https://github.com/iov-one/ponferrada/tree/master/packages/bierzo-wallet/src/communication) for a complete setup.

## Contributing

We are more than happy to accept open source contributions. However, please try
to work on existing issues or create an issue and get feedback from one of the
[main contributors](https://github.com/iov-one/ponferrada/graphs/contributors)
before starting on a PR. If you don't know where to start, we try to tag
["good first issues"](https://github.com/iov-one/ponferrada/issues?q=is%3Aissue+is%3Aopen+label%3A%22good+first+issue%22)
that provide a nice way to get started with the ponferrada repo.

### Development Environment

To get started, please go to the root directory and run:

```shell
yarn install
yarn build
```

Then open your chrome browser and add the new generated extension (the build folder)

1. open the following link chrome://extensions/
2. Turn on `Developer mode`
3. Click load unpacked and go to the `ponferrada/build` folder
4. You have the iov-ponferrada extension in your browser!

With the extension fully working, you may want to enable hot reloading of the changes you make to the extension by running:

```shell
cd packages/sanes-browser-extension/
yarn start
```

### Testing

We take seriously the testing environment, performing three different types of tests:

- JEST Snapshots: Used mostly for identifying regression bugs in views (a.k.a frontend tests)
- DOM Testing: Used for covering react-redux (a.k.a logic test) and views' logic.
- e2e Testing: Used for testing the chrome extension in real browser, assuring all functionality and inter dependencies between all extensions part work together.

#### Storybook & Snapshot testing

Used for generating JEST Snapshot tests, and also for develoing components and fast prototype iteration when condig routes. From main folder, run following command:

```shell
yarn storybook
```

For updating snapshots after some changes in order to make everything to work read the [snapshot documentation](./docs/snapshots.md)

#### Jest

Main test stack. It is used to run DOM tests using react test-utils functionalities. From main folder, run following command:

```shell
yarn test
```

`yarn test` will run jest tests of the entire system. However, a number of tests do end-to-end integration and require a demo blockchain running locally to be completed. By default these are skipped, unless you set the `CHAINS_ENABLED=1` environmental variable to signal they should be run.

If you want to run these locally, make sure you are on a system that supports docker and that your local user has rights to connect to docker (I often use a Linux Virtualbox just for this). You must have `docker` and `docker-compose` installed.

In case you are running MAC_OS you should do:

```shell
ruby -e "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/install)" < /dev/null 2> /dev/null

brew install jq
brew install coreutils

# Add TMPDIR=/private/var/tmp before any bash script
# TMPDIR=/private/var/tmp bash ./scripts/test_start.sh
```

In such a case, you can run the full chain test suite from inside sanes-browser-extension package folder:

```shell
# start all blockchains and a local faucets that serves multiple tokens
./scripts/test_start.sh
export CHAINS_ENABLED=1

# you can run this a few times....
(cd packages/sanes-browser-extension/ && yarn test)

# stop them afterwards
unset CHAINS_ENABLED
./scripts/test_stop.sh
```

#### Puppeteer

Framework used for running e2e tests. It launches chrome instances with the extension installed and executes logic simulating human interaction.
From main folder, run following command:

```shell
yarn test
```

For installing automatically the extension on each chrome's instance we have had to generate a fixed extension's id. For more details [click here](./docs/extension).

## Internals

The extension package has been created using create-react-app extension, but we have had to modify some parts in order to allow Webpack's HMR while developing, and chrome extension's part integration. For more details [read this](./docs/extension.md).

## License

This repository is licensed under the Apache License 2.0 (see [NOTICE](./NOTICE) and [LICENSE](./LICENSE)).
