# Changelog

## 1.3.5

- Extension: Fix bug during migration

## 1.3.2

- Extension: Change Lisk node to main-02.liskapi.io

## 1.3.0

- Wallet: Support for starnames
- Starnames and iovnames are now available in the main header

## 1.2.1

- Wallet: Add support for e-Money chain
- Extension: support for future starname features

## 1.2.0

- Wallet: Get Neuma extension URL from config
- Wallet: Add IOV faucet for staging configuration
- Wallet: Assign arbitrary addresses of the supported blockchains to the iovnames
- Wallet: Improves "Amount" column of the transactions
- Wallet: Correctly displays transaction of type Update Username Targets
- Wallet: Adds number of fractional digits to the validation of a payment
- Wallet: Makes editing addresses of a username more reliable
- Wallet: Adds wip starnames tab and updates stories
- Wallet: Adds support for Terra Money, Cosmos Hub, IrisNet, kava, Bitcoin, and Litecoin addresses
- Extension: Improve UI
- Extension: Adds network status and correct url to Networks view
- Wallet and Extension: DAI stablecoin support
- Wallet and Extension: Add ability to update iovname
- Wallet and Extension: Displays currencies with locale separators
- Wallet, Governance and Extension: Adds ability to edit IOV RPC URL and name
- Upgrade IOV-Core to 2.0.2
- Connect to Exchangenet 📈

## 1.1.0

- Wallet and Extension: Improve UI
- Wallet: Rename to "Neuma Wallet"
- Governance: Allow inputting validator pubkeys in base64 format
- Governance: Improve test coverage
- Extension: Add `*.neuma.io` to whitelisted domains
- Wallet and Extension: Add ERC20 tokens to configuration
- Connect to Dancenet 💃

## 1.0.2

- Change Lisk node to `main-01.liskapi.io` due to expired certificate

## 1.0.1

- Upgrade and simplify material UI dependencies

## 1.0.0

- Wallet: Improve error handling when logging in with Ledger
- Wallet: Only connect to IOV when logging in with Ledger
- Governance: Improve checks on distribute funds CSV upload
- Governance: Add page showing committee members
- Extension: Show address of transaction creator in transactions list
- Set configuration for mainnet
- Upgrade IOV-Core to 1.0.0

## 0.7.0

- Connect to Clapnet 👏
- Upgrade IOV-Core to 1.0.0-alpha.1

## 0.6.2

- Governance: Fix amount interpretation in release guarantee funds proposal
- Governance: Fix order of UI components in create proposal screen
- Governance: Improve distribute funds CSV parsing
- Governance: Fix required field error message after processing CSV file
- Extension: Fix proposal start date display
- Extension: Close extension winder after handling last open request

## 0.6.1

- Wallet: Don't wait for block before confirming transaction signing with Ledger
- Wallet: Don't show register username message when logged in with Ledger
- Governance: Limit precision of participation display
- Governance: Improve proposal title validation
- Upgrade IOV-Core to 1.0.0-alpha.0

## 0.6.0

- Governance: Periodically update proposals
- Connect to Babynet 👶

## 0.5.0

- Governance: Improve cache settings for hosting
- Wallet: Improve cache settings for hosting
- Extension: Use term "recovery words" consistently
- Extension: Display create proposal transactions properly
- Connect to Catnet 🐈

## 0.4.10

- Governance: Calculate selectable rules for amanding threshold/quorum from the
  currently selected rule. All writeable rules can now be selected.
- Governance: Fix display of the user's vote
- Extension: Improve UI for vote transactions

## 0.4.9

- Governance: Show currect blockchain time in UI and calculate `hasStarted`
  based on blockchain time
- Governance: Sort proposals from new to old
- Governance: Rename "Submitted Elections" to "Authored Elections" and adapt
  logic accordingly

## 0.4.8

- Governance: Fix bug in staging configuration file

## 0.4.7

- Governance: Show governor address and committee memberships in header.
- Governance: Implement creation of proposal types
  `ReleaseGuaranteeFunds` and `DistributeFunds`.
- Governance: Improve input validation for proposal creation.
- Governance: Improve error handling when connecting to browser extension.
- Governance: Propagate blockchain error messages for create proposal
  and vote transactions to UI.
- Wallet: Fix error message when using the notifications menu.

## 0.4.6

- Governance: Add message for empty proposals list
- Governance: Add input validation for proposal creation
- Extension: Rename "Login" to "Unlock"
- Extension: Mnemonic must be typed-in to confirm wallet deletion
- Upgrade IOV-Core to 0.17.5

## 0.4.5

- Governance: Allow using `AddCommitteeMember`/`RemoveCommitteeMember` for
  committees the current user is not a member of. This allows the Governance
  Board to change other committees.
- Governance: Remove unused delete button on proposal
- Upgrade IOV-Core to 0.17.3
- Upgrade @iov/ledger-bns to 0.14.0

## 0.4.4

- Wallet: Add support for Ledger nano S
- Extension: Add expected chain IDs to config
- Upgrade IOV-Core to 0.17.2

## 0.4.3

- Wallet: Add overlay when interaction with extension is necessary
- Wallet: Improve CSV exports
- Wallet: Show "me" badge for senders in transaction list
- Wallet: Set target JavaScript level to es6
- Governance: Initial release
- Governance: Set target JavaScript level to es6

## 0.4.2

- Wallet: Show "me" badge for recipients in transaction list
- Extension: Remove unused account name
- Extension: Change wording from "account" to "wallet"
- Extension: Rename to Neuma; use Neuma logo and icons

## 0.4.1

- Wallet: Show transaction fee in list
- Extension: Improve show mnemonic screenq

## 0.4.0

- Add support for Boarnet (weave 0.21.x, IOV-Core 0.17.x)
- Rename browser extension to NEUMA

## 0.3.x

- Lovenet connectivity
