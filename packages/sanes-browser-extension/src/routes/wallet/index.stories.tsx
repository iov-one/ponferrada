import {
  Address,
  Algorithm,
  ChainId,
  Identity,
  PubkeyBytes,
  SendTransaction,
  TokenTicker,
  WithCreator,
} from "@iov/bcp";
import { ActionKind, CreateProposalTx, RegisterUsernameTx, VoteOption, VoteTx } from "@iov/bns";
import { Encoding } from "@iov/encoding";
import { ethereumCodec } from "@iov/ethereum";
import { storiesOf } from "@storybook/react";
import { Storybook, ToastProvider } from "medulas-react-components";
import React from "react";

import { PersonaProvider } from "../../context/PersonaProvider";
import { GetPersonaResponse } from "../../extension/background/model/backgroundscript";
import { ProcessedTx } from "../../extension/background/model/persona";
import { CHROME_EXTENSION_ROOT } from "../../utils/storybook";
import Layout from "./index";

export const WALLET_STATUS_PAGE = "Wallet Status page";

const defaultAddress = "0x1212121212121212121212121212121212121212" as Address;
const defaultCreator: Identity = {
  chainId: "foobar" as ChainId,
  pubkey: {
    algo: Algorithm.Secp256k1,
    // Random Ethereum pubkey. Derived address: 0x7c15484EA11FD233AE566469af15d84335023c30
    data: Encoding.fromHex(
      "0434ce248a6a5979c04d75d1a75907b2bec1cb4d4f6e17b76521f0925e8b6b40e00711fe98e789cf5c8317cf1e731b3101e9dbfaba5e351e424e45c9a2f4dfb63c",
    ) as PubkeyBytes,
  },
};

const defaultAmount = { quantity: "10", fractionalDigits: 3, tokenTicker: "ETH" as TokenTicker };
const ethereumFee = {
  gasLimit: "12345678",
  gasPrice: { quantity: "20000000000", fractionalDigits: 18, tokenTicker: "ETH" as TokenTicker },
};

const send: SendTransaction & WithCreator = {
  kind: "bcp/send",
  amount: defaultAmount,
  creator: defaultCreator,
  sender: ethereumCodec.identityToAddress(defaultCreator),
  fee: ethereumFee,
  memo: "A little donation",
  recipient: defaultAddress,
};

const usernameCreate: RegisterUsernameTx & WithCreator = {
  kind: "bns/register_username",
  creator: defaultCreator,
  fee: ethereumFee,
  username: "test*iov",
  targets: [
    { chainId: "foobar" as ChainId, address: "tiov1k898u78hgs36uqw68dg7va5nfkgstu5z0fhz3f" as Address },
  ],
};

const createProposal: CreateProposalTx & WithCreator = {
  kind: "bns/create_proposal",
  creator: defaultCreator,
  fee: {
    tokens: defaultAmount,
  },
  title: "Just an idea",
  description: "Try a centralized approach instead?",
  electionRuleId: 2,
  startTime: 1566383301091,
  author: defaultAddress,
  action: {
    kind: ActionKind.CreateTextResolution,
    resolution: "Stop all this blockchain stuff",
  },
};

const vote: VoteTx & WithCreator = {
  kind: "bns/vote",
  creator: defaultCreator,
  fee: {
    tokens: defaultAmount,
  },
  proposalId: 666,
  selection: VoteOption.Yes,
};

let txId = 111;
function newTxId(): string {
  return (txId++).toString();
}

const processedTx: ProcessedTx = {
  id: newTxId(),
  signer: "Example Signer",
  time: "Sat May 25 10:10:00 2019 +0200",
  error: null,
  blockExplorerUrl: null,
  original: send,
};

const blockExplorerProcessedTx: ProcessedTx = {
  id: newTxId(),
  signer: "Example Signer",
  time: "Sat May 25 10:10:00 2019 +0200",
  error: null,
  blockExplorerUrl: "https://iov.one",
  original: send,
};

const usernameCreatedTx: ProcessedTx = {
  id: newTxId(),
  signer: "Example Signer",
  time: "Sat May 25 10:10:00 2019 +0200",
  error: null,
  blockExplorerUrl: null,
  original: usernameCreate,
};

const errorUsernameCreatedTx: ProcessedTx = {
  id: newTxId(),
  signer: "Example Signer",
  time: "Sat May 25 10:10:00 2019 +0200",
  error: "This is an example of reported error",
  blockExplorerUrl: null,
  original: usernameCreate,
};

const errorProcessedTx: ProcessedTx = {
  id: newTxId(),
  signer: "Example Signer",
  time: "Sat May 25 10:10:00 2019 +0200",
  error: "This is an example of reported error",
  blockExplorerUrl: null,
  original: send,
};

const createProposalTx: ProcessedTx = {
  id: newTxId(),
  signer: "Example Signer",
  time: "Sat May 25 10:10:00 2019 +0200",
  error: null,
  blockExplorerUrl: null,
  original: createProposal,
};

const voteTx: ProcessedTx = {
  id: newTxId(),
  signer: "Example Signer",
  time: "Sat May 25 10:10:00 2019 +0200",
  error: null,
  blockExplorerUrl: null,
  original: vote,
};

storiesOf(`${CHROME_EXTENSION_ROOT}/${WALLET_STATUS_PAGE}`, module)
  .add("Txs", () => {
    const processedTx2 = { ...processedTx, id: (txId++).toString() };
    const processedTx3 = { ...processedTx, id: (txId++).toString() };

    const persona: GetPersonaResponse = {
      mnemonic: "",
      accounts: [{ label: "Account 0" }],
      txs: [
        usernameCreatedTx,
        errorUsernameCreatedTx,
        blockExplorerProcessedTx,
        processedTx,
        errorProcessedTx,
        processedTx2,
        processedTx3,
        createProposalTx,
        voteTx,
      ],
    };

    return (
      <PersonaProvider persona={persona}>
        <Storybook>
          <ToastProvider>
            <Layout />
          </ToastProvider>
        </Storybook>
      </PersonaProvider>
    );
  })
  .add("Empty", () => {
    const persona: GetPersonaResponse = {
      mnemonic: "",
      accounts: [{ label: "Account 0" }],
      txs: [],
    };

    return (
      <PersonaProvider persona={persona}>
        <Storybook>
          <ToastProvider>
            <Layout />
          </ToastProvider>
        </Storybook>
      </PersonaProvider>
    );
  });
