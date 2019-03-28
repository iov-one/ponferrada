# Ponferrada

The most beautiful UI in Blockchain.

[![Build Status](https://travis-ci.com/iov-one/ponferrada.svg?token=mAzyz4hbUq3XZX1unzvx&branch=master)](https://travis-ci.com/iov-one/ponferrada)

## Packages

Ponferrada browser extension is split in 4 packages:

- **medulas-react-components**: All the react components that we use in the UI, based on material-ui v4.0.
- **oza-react-scripts**: Configuration and scripts for Create React App
- **sanes-chrome-extension**: Main application
- **valdueza-storybook**: Storybook configuration

## Tools

Ponferrada is based on React and Redux. Also uses the power of iov-core to handle the crypto and blockchain communication.

### IOV-Core

[iov-core](https://github.com/iov-one/iov-core) provides core functionality to all clients in a cross-platform typescript library.

In ponferrada, we use the following generic packages from iov-core:

- `@iov/keycontrol`: manages all private keys and keeps them safe. The public API from this package is `UserProfile`.
- `@iov/crypto`: contains low-level cryptographic functionality.
- `@iov/core`: the main entrypoint, exposing high-level functionality to easily build blockchain clients. It uses the keymanagement functionality of `UserProfile`, and the generic blockchain connection of `BcpConnection`, and pulls them together into one `MultiChainSigner`, which can query state and sign transactions on multiple blockchains.

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

## Contributing

We are more than happy to accept open source contributions. However, please try
to work on existing issues or create an issue and get feedback from one of the
[main contributors](https://github.com/iov-one/ponferrada/graphs/contributors)
before starting on a PR. If you don't know where to start, we try to tag
["good first issues"](https://github.com/iov-one/ponferrada/issues?q=is%3Aissue+is%3Aopen+label%3A%22good+first+issue%22)
that provide a nice way to get started with the ponferrada repo.

### Development Environment

To get started, please go to the root directory and run:

```
yarn install
yarn build
cd packages/sanes-chrome-extension/
yarn watch
```

Then open your chrome browser and add the new generated extension (the build folder)

1. open the following link chrome://extensions/
2. Turn on `Developer mode`
3. Click load unpacked and go to the `ponferrada/sanes-chrome-extension/build` folder
4. You have the iov-ponferrada extension in your browser!

### Testing

We take seriously the testing environment, performing three different types of tests:

- JEST Snapshots: Used mostly for identifying regression bugs in views (a.k.a frontend tests)
- DOM Testing: Used for covering react-redux (a.k.a logic test) and views' logic.
- e2e Testing: Used for testing the chrome extension in real browser, assuring all functionality and inter dependencies between all extensions part work together.

#### Storybook & Snapshot testing

Used for generating JEST Snapshot tests, and also for develoing components and fast prototype iteration when condig routes. From main folder, run following command:

```
yarn storybook
```

For updating snapshots after some changes in order to make everything to work read the [snapshot documentation](./docs/snapshots.md)

#### Jest

Main test stack. It is used to run DOM tests using react test-utils functionalities. From main folder, run following command:

```
yarn test
```

#### Puppeteer

Framework used for running e2e tests. It launches chrome instances with the extension installed and executes logic simulating human interaction.
From main folder, run following command:

```
yarn test
```

For installing automatically the extension on each chrome's instance we have had to generate a fixed extension's id. For more details [click here](./docs/extension).
