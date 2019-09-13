# Changelog

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
