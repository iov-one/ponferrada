import {
  Address,
  Algorithm,
  ChainId,
  Identity,
  PubkeyBytes,
  Token,
  TokenTicker,
  TransactionId,
} from "@iov/bcp";
import { RegisterUsernameTx } from "@iov/bns";
import { Encoding } from "@iov/encoding";
import { storiesOf } from "@storybook/react";
import React from "react";
import { ReadonlyDate } from "readonly-date";
import { stringToAmount } from "ui-logic";

import { ProcessedTx } from "../../logic/transactions/types/BwParser";
import { BwUnknownProps } from "../../logic/transactions/types/BwUnkownTransaction";
import { ProcessedSendTransaction } from "../../store/notifications";
import { RootState } from "../../store/reducers";
import DecoratedStorybook, { WALLET_ROOT } from "../../utils/storybook";
import Transactions from "./index";

export const TRANSACTIONS_STORY_PATH = `${WALLET_ROOT}/Transactions`;
export const TRANSACTIONS_STORY_SHOW_PATH = "With transactions";

const iov: Pick<Token, "tokenTicker" | "fractionalDigits"> = {
  fractionalDigits: 9,
  tokenTicker: "IOV" as TokenTicker,
};

const lsk: Pick<Token, "tokenTicker" | "fractionalDigits"> = {
  fractionalDigits: 8,
  tokenTicker: "LSK" as TokenTicker,
};

function createIdentities(): { [chain: string]: Identity } {
  const identities: { [chain: string]: Identity } = {};

  // create ETH pub key
  const ethChain = "ethereum-eip155-5777";
  const ethIdentity: Identity = {
    chainId: ethChain as ChainId,
    pubkey: {
      algo: Algorithm.Secp256k1,
      data: Encoding.fromHex(
        "0423198f2fc45c5ec981cce3a0c91facf2055a210ea2f13301d40864ae6e184c91a522867325a86d14fa1566464926457d8402eb670b9827d644880a5b462db43d",
      ) as PubkeyBytes,
    },
  };

  // get BNS pubkey
  const bnsChain = "local-iov-devnet";
  const bnsIdentity: Identity = {
    chainId: bnsChain as ChainId,
    pubkey: {
      algo: Algorithm.Ed25519,
      data: Encoding.fromHex(
        "f7a11ebcfe22e0849da46145661ab4e111ab8fe931226ef2848abff9d180cd01",
      ) as PubkeyBytes,
    },
  };

  identities[ethChain] = ethIdentity;
  identities[bnsChain] = bnsIdentity;

  return identities;
}

const identities = createIdentities();
const address = "0x794d591840927890aC7C162C3B3e4665725f8f40" as Address;
const ownTx: ProcessedSendTransaction = {
  time: new ReadonlyDate("2019-12-25T05:35:03.763Z"),
  id: "ownTx1" as TransactionId,
  original: {
    kind: "bcp/send",
    sender: "george*iov" as Address,
    recipient: address,
    amount: stringToAmount("10.5", lsk),
    memo: "Sample note",
    fee: {
      tokens: stringToAmount("1.2", iov),
    },
  },
  incoming: true,
  outgoing: false,
};

const incomingAndOutgoingSendTransaction: ProcessedSendTransaction = {
  time: new ReadonlyDate("2019-12-24T04:35:03.763Z"),
  id: "EDBBA9C7C558A60E09A589C2263CF5DDC7B25ED014E3EF5959C6B1C8E6DBAD4E" as TransactionId,
  original: {
    kind: "bcp/send",
    sender: "tiov1xgm95mecmf3vkn7lnszfe9q4uy6nv0pwkr8wc3" as Address,
    recipient: "tiov1xgm95mecmf3vkn7lnszfe9q4uy6nv0pwkr8wc3" as Address,
    amount: stringToAmount("7.4", iov),
    memo: "Send money to myself for fun",
    fee: {
      tokens: stringToAmount("1.2", iov),
    },
  },
  incoming: true,
  outgoing: true,
};

const txs: readonly (ProcessedSendTransaction | ProcessedTx<RegisterUsernameTx> | BwUnknownProps)[] = [
  ownTx,
  {
    id: "DA9A61A3CA28C772E468D772D642978180332780ADB6410909E51487C0F61050" as TransactionId,
    time: new ReadonlyDate("2019-12-24T10:51:33.763Z"),
    original: {
      kind: "bns/register_username",
      username: "albert*iov",
      targets: [
        {
          chainId: "local-iov-devnet" as ChainId,
          address: "tiov1yeyyqj3zxgs500xvzp38vu3c336yj8q48a5jx0" as Address,
        },
        {
          chainId: "lisk-198f2b61a8" as ChainId,
          address: "13751834438426525516L" as Address,
        },
        {
          chainId: "ethereum-eip155-5777" as ChainId,
          address: "0x695874053fcB8D9cF038ee4E53b7b24fB0baFa4c" as Address,
        },
      ],
      fee: {
        tokens: stringToAmount("100", iov),
      },
    },
  },
  {
    time: new ReadonlyDate("2019-12-24T05:35:03.763Z"),
    id: "tx1" as TransactionId,
    original: {
      kind: "bcp/send",
      sender: "george*iov" as Address,
      recipient: "me" as Address,
      amount: stringToAmount("10.5", lsk),
      memo: "Sample note",
      fee: {
        tokens: stringToAmount("1.2", iov),
      },
    },
    incoming: true,
    outgoing: false,
  },
  incomingAndOutgoingSendTransaction,
  {
    time: new ReadonlyDate("2019-12-24T03:35:03.763Z"),
    id: "0xaaffBdjuhyu8898scchjsg" as TransactionId,
    original: {
      kind: "bns/register_username",
      fee: {
        tokens: stringToAmount("100", iov),
      },
    },
  },
  {
    time: new ReadonlyDate("2018-10-05T16:12:00.763Z"),
    id: "tx2" as TransactionId,
    original: {
      kind: "bcp/send",
      sender: "me" as Address,
      recipient: "alex*iov" as Address,
      amount: stringToAmount("25.5", iov),
      fee: {
        tokens: stringToAmount("1.2", iov),
      },
    },
    incoming: false,
    outgoing: true,
  },
  {
    time: new ReadonlyDate("2018-12-24T10:51:33.763Z"),
    id: "tx3" as TransactionId,
    original: {
      kind: "bcp/send",
      sender: "me" as Address,
      recipient: "alex*iov" as Address,
      amount: stringToAmount("100.5", iov),
      memo: "Another note",
      fee: {
        tokens: stringToAmount("1.2", iov),
      },
    },
    incoming: false,
    outgoing: true,
  },
  {
    time: new ReadonlyDate("2018-11-13T05:35:03.763Z"),
    id: "tx4" as TransactionId,
    original: {
      kind: "bcp/send",
      sender: "Lx9oa7re0894eopiahsdpf98as7y908" as Address,
      recipient: "me" as Address,
      amount: stringToAmount("10.5", lsk),
      memo: "And again note",
      fee: {
        tokens: stringToAmount("1.2", iov),
      },
    },
    incoming: true,
    outgoing: false,
  },
  {
    time: new ReadonlyDate("2018-10-05T16:12:00.763Z"),
    id: "tx5" as TransactionId,
    original: {
      kind: "bcp/send",
      sender: "me" as Address,
      recipient: "alex*iov" as Address,
      amount: stringToAmount("25.5", iov),
      fee: {
        tokens: stringToAmount("1.2", iov),
      },
    },
    incoming: false,
    outgoing: true,
  },
  {
    time: new ReadonlyDate("2018-12-24T10:51:33.763Z"),
    id: "tx6" as TransactionId,
    original: {
      kind: "bcp/send",
      sender: "me" as Address,
      recipient: "alex*iov" as Address,
      amount: stringToAmount("100.5", iov),
      fee: {
        tokens: stringToAmount("1.2", iov),
      },
    },
    incoming: false,
    outgoing: true,
  },
  {
    time: new ReadonlyDate("2018-11-13T05:35:03.763Z"),
    id: "tx7" as TransactionId,
    original: {
      kind: "bcp/send",
      sender: "george*iov" as Address,
      recipient: "me" as Address,
      amount: stringToAmount("10.5", lsk),
      fee: {
        tokens: stringToAmount("1.2", iov),
      },
    },
    incoming: true,
    outgoing: false,
  },
  {
    time: new ReadonlyDate("2018-10-05T16:12:00.763Z"),
    id: "tx8" as TransactionId,
    original: {
      kind: "bcp/send",
      sender: "me" as Address,
      recipient: "alex*iov" as Address,
      amount: stringToAmount("25.5", iov),
      fee: {
        tokens: stringToAmount("1.2", iov),
      },
    },
    incoming: false,
    outgoing: true,
  },
  {
    time: new ReadonlyDate("2018-12-24T10:51:33.763Z"),
    id: "tx9" as TransactionId,
    original: {
      kind: "bcp/send",
      sender: "me" as Address,
      recipient: "alex*iov" as Address,
      amount: stringToAmount("100.5", iov),
      fee: {
        tokens: stringToAmount("1.2", iov),
      },
    },
    incoming: false,
    outgoing: true,
  },
  {
    time: new ReadonlyDate("2018-11-13T05:35:03.763Z"),
    id: "tx10" as TransactionId,
    original: {
      kind: "bcp/send",
      sender: "george*iov" as Address,
      recipient: "me" as Address,
      amount: stringToAmount("10.5", lsk),
      fee: {
        tokens: stringToAmount("1.2", iov),
      },
    },
    incoming: true,
    outgoing: false,
  },
  {
    time: new ReadonlyDate("2018-10-05T16:12:00.763Z"),
    id: "tx11" as TransactionId,
    original: {
      kind: "bcp/send",
      sender: "me" as Address,
      recipient: "alex*iov" as Address,
      amount: stringToAmount("25.5", iov),
      fee: {
        tokens: stringToAmount("1.2", iov),
      },
    },
    incoming: false,
    outgoing: true,
  },
  {
    time: new ReadonlyDate("2018-12-24T10:51:33.763Z"),
    id: "tx12" as TransactionId,
    original: {
      kind: "bcp/send",
      sender: "me" as Address,
      recipient: "alex*iov" as Address,
      amount: stringToAmount("100.5", iov),
      fee: {
        tokens: stringToAmount("1.2", iov),
      },
    },
    incoming: false,
    outgoing: true,
  },
  {
    time: new ReadonlyDate("2018-11-13T05:35:03.763Z"),
    id: "tx13" as TransactionId,
    original: {
      kind: "bcp/send",
      sender: "george*iov" as Address,
      recipient: "me" as Address,
      amount: stringToAmount("10.5", lsk),
      fee: {
        tokens: stringToAmount("1.2", iov),
      },
    },
    incoming: true,
    outgoing: false,
  },
  {
    time: new ReadonlyDate("2018-10-05T16:12:00.763Z"),
    id: "tx14" as TransactionId,
    original: {
      kind: "bcp/send",
      sender: "Lxasdoiu9847ioasdpfuy098q23rui" as Address,
      recipient: "alex*iov" as Address,
      amount: stringToAmount("25.5", iov),
      fee: {
        tokens: stringToAmount("1.2", iov),
      },
    },
    incoming: false,
    outgoing: true,
  },
  {
    time: new ReadonlyDate("2018-12-24T10:51:33.763Z"),
    id: "tx15" as TransactionId,
    original: {
      kind: "bcp/send",
      sender: "me" as Address,
      recipient: "alex*iov" as Address,
      amount: stringToAmount("100.5", iov),
      fee: {
        tokens: stringToAmount("1.2", iov),
      },
    },
    incoming: false,
    outgoing: true,
  },
];

const txStore: Pick<RootState, "notifications" | "extension"> = {
  extension: {
    connected: true,
    installed: true,
    identities,
  },
  notifications: {
    transactions: txs,
  },
};

storiesOf(TRANSACTIONS_STORY_PATH, module)
  .addParameters({ viewport: { defaultViewport: "responsive" } })
  .add(
    "Without transactions",
    (): JSX.Element => (
      <DecoratedStorybook>
        <Transactions />
      </DecoratedStorybook>
    ),
  )
  .add(
    TRANSACTIONS_STORY_SHOW_PATH,
    (): JSX.Element => (
      <DecoratedStorybook storeProps={txStore}>
        <Transactions />
      </DecoratedStorybook>
    ),
  );
