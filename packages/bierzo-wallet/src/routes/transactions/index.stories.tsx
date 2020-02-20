import { Address, ChainId, Token, TokenTicker, TransactionId } from "@iov/bcp";
import { RegisterDomainTx, RegisterUsernameTx, VoteOption, VoteTx } from "@iov/bns";
import { Sha256 } from "@iov/crypto";
import { Encoding, Uint64 } from "@iov/encoding";
import { action } from "@storybook/addon-actions";
import { storiesOf } from "@storybook/react";
import React from "react";
import { ReadonlyDate } from "readonly-date";
import { stringToAmount } from "ui-logic";

import { ProcessedTx } from "../../logic/transactions/types/BwParser";
import { BwParserFactory } from "../../logic/transactions/types/BwParserFactory";
import { ProcessedSendTransaction } from "../../store/notifications";
import DecoratedStorybook, { bierzoRoot } from "../../utils/storybook";
import Layout from "./components";
import { filterTxsBy, ORDER_DESC, SortOrder, TX_DATE_COLUMN, TxsOrder } from "./components/sorting";

export const TRANSACTIONS_STORY_PATH = `${bierzoRoot}/Transactions`;
export const TRANSACTIONS_STORY_SHOW_PATH = "With transactions";

const iov: Pick<Token, "tokenTicker" | "fractionalDigits"> = {
  fractionalDigits: 9,
  tokenTicker: "IOV" as TokenTicker,
};

const lsk: Pick<Token, "tokenTicker" | "fractionalDigits"> = {
  fractionalDigits: 8,
  tokenTicker: "LSK" as TokenTicker,
};

const eth: Pick<Token, "tokenTicker" | "fractionalDigits"> = {
  fractionalDigits: 18,
  tokenTicker: "ETH" as TokenTicker,
};

const currentUsersIovAddress = "tiov16cmjakgflq4ru6n6dm5egrztn6gc0l7af7r2tc" as Address;
const currentUsersEthAddress = "0x794d591840927890aC7C162C3B3e4665725f8f40" as Address;
const currentUsersLiskAddress = "16376202734673246431L" as Address;

const chainIdIov = "local-iov-devnet" as ChainId;
const chainIdLisk = "lisk-da3ed6a454" as ChainId;

const currentUsersAddresses = [
  currentUsersIovAddress,
  currentUsersEthAddress,
  currentUsersLiskAddress,
] as const;

let txCount = 0;

function makeExampleEthTransactionId(): TransactionId {
  // The generated hash is deterministic but arbitrary and has the correct format (see https://etherscan.io/txs)
  const data = Uint64.fromNumber(txCount++).toBytesBigEndian();
  return `0x${Encoding.toHex(new Sha256(data).digest())}` as TransactionId;
}

function makeExampleIovTransactionId(): TransactionId {
  // The generated hash is deterministic but arbitrary and has the correct format
  const data = Uint64.fromNumber(txCount++).toBytesBigEndian();
  return Encoding.toHex(new Sha256(data).digest()).toUpperCase() as TransactionId;
}

function makeExampleLiskTransactionId(): TransactionId {
  // The generated hash is deterministic but arbitrary and has the correct format (see https://explorer.lisk.io/txs/)
  return Uint64.fromNumber(2347199254740991 + txCount++).toString() as TransactionId;
}

const incomingNewDomainTransaction: ProcessedTx<RegisterDomainTx> = {
  id: makeExampleIovTransactionId(),
  time: new ReadonlyDate("2019-12-01T03:02:01.763Z"),
  original: {
    kind: "bns/register_domain",
    chainId: chainIdIov,
    domain: "test",
    admin: "tiov1yeyyqj3zxgs500xvzp38vu3c336yj8q48a5jx0" as Address,
    hasSuperuser: true,
    msgFees: [],
    accountRenew: 2 * 3600,
    fee: {
      tokens: stringToAmount("100", iov),
    },
  },
};

const incomingSendTransaction: ProcessedSendTransaction = {
  time: new ReadonlyDate("2018-01-01T03:02:01.763Z"),
  id: makeExampleEthTransactionId(),
  original: {
    kind: "bcp/send",
    chainId: chainIdIov,
    sender: "0x979a731650b6F5cbE0dB2966e9b43e9a6a931bdA" as Address,
    recipient: currentUsersEthAddress,
    amount: stringToAmount("10.5", eth),
    memo: "Sample note",
    fee: { tokens: stringToAmount("0.001", eth) },
  },
  incoming: true,
  outgoing: false,
};

const incomingAndOutgoingSendTransaction: ProcessedSendTransaction = {
  time: new ReadonlyDate("2018-02-03T04:03:02.763Z"),
  id: makeExampleIovTransactionId(),
  original: {
    kind: "bcp/send",
    chainId: chainIdIov,
    sender: currentUsersIovAddress,
    recipient: currentUsersIovAddress,
    amount: stringToAmount("7.4", iov),
    memo: "Send money to myself for fun",
    fee: { tokens: stringToAmount("1.2", iov) },
  },
  incoming: true,
  outgoing: true,
};

const voteTx: ProcessedTx<VoteTx> = {
  id: makeExampleIovTransactionId(),
  time: new ReadonlyDate("2018-03-05T05:04:03.763Z"),
  original: {
    kind: "bns/vote",
    chainId: chainIdIov,
    voter: currentUsersIovAddress,
    fee: { tokens: stringToAmount("0.5", iov) },
    proposalId: 55,
    selection: VoteOption.Abstain,
  },
};

const parsedTxs: readonly (
  | ProcessedSendTransaction
  | ProcessedTx<RegisterUsernameTx>
  | ProcessedTx<VoteTx>
  | ProcessedTx<RegisterDomainTx>
)[] = [
  incomingNewDomainTransaction,
  incomingSendTransaction,
  voteTx,
  {
    id: makeExampleIovTransactionId(),
    time: new ReadonlyDate("2018-04-07T06:05:04.763Z"),
    original: {
      kind: "bns/register_username",
      chainId: chainIdIov,
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
  incomingAndOutgoingSendTransaction,
  {
    time: new ReadonlyDate("2018-05-09T07:06:05.763Z"),
    id: makeExampleIovTransactionId(),
    original: {
      kind: "bns/register_username",
      chainId: chainIdIov,
      username: "bob*iov",
      targets: [],
      fee: {
        tokens: stringToAmount("100", iov),
      },
    },
  },
  {
    time: new ReadonlyDate("2018-06-10T08:07:06.763Z"),
    id: makeExampleIovTransactionId(),
    original: {
      kind: "bcp/send",
      chainId: chainIdIov,
      sender: "me" as Address,
      recipient: "tiov18c8a0mn8hr5geyq4s9dmqajzep07uml724cl27" as Address,
      amount: stringToAmount("25.5", iov),
      fee: {
        tokens: stringToAmount("1.2", iov),
      },
    },
    incoming: false,
    outgoing: true,
  },
  {
    time: new ReadonlyDate("2019-07-12T13:12:11.763Z"),
    id: makeExampleIovTransactionId(),
    original: {
      kind: "bcp/send",
      chainId: chainIdIov,
      sender: "me" as Address,
      recipient: "tiov18c8a0mn8hr5geyq4s9dmqajzep07uml724cl27" as Address,
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
    time: new ReadonlyDate("2019-08-14T14:13:12.763Z"),
    id: makeExampleLiskTransactionId(),
    original: {
      kind: "bcp/send",
      chainId: chainIdLisk,
      sender: "4652772502274938600L" as Address,
      recipient: currentUsersLiskAddress,
      amount: stringToAmount("10.5", lsk),
      memo: "And again note",
      fee: { tokens: stringToAmount("0.1", lsk) },
    },
    incoming: true,
    outgoing: false,
  },
  {
    time: new ReadonlyDate("2019-09-16T15:14:13.763Z"),
    id: makeExampleIovTransactionId(),
    original: {
      kind: "bcp/send",
      chainId: chainIdIov,
      sender: currentUsersIovAddress,
      recipient: "tiov18c8a0mn8hr5geyq4s9dmqajzep07uml724cl27" as Address,
      amount: stringToAmount("25.5", iov),
      fee: { tokens: stringToAmount("1.2", iov) },
    },
    incoming: false,
    outgoing: true,
  },
  {
    time: new ReadonlyDate("2019-10-18T16:15:14.763Z"),
    id: makeExampleIovTransactionId(),
    original: {
      kind: "bcp/send",
      chainId: chainIdIov,
      sender: currentUsersIovAddress,
      recipient: "tiov18c8a0mn8hr5geyq4s9dmqajzep07uml724cl27" as Address,
      amount: stringToAmount("100.5", iov),
      fee: { tokens: stringToAmount("1.2", iov) },
    },
    incoming: false,
    outgoing: true,
  },
  {
    time: new ReadonlyDate("2019-11-20T17:16:15.763Z"),
    id: makeExampleIovTransactionId(),
    original: {
      kind: "bcp/send",
      chainId: chainIdIov,
      sender: currentUsersIovAddress,
      recipient: "tiov18c8a0mn8hr5geyq4s9dmqajzep07uml724cl27" as Address,
      amount: stringToAmount("25.5", iov),
      fee: { tokens: stringToAmount("1.2", iov) },
    },
    incoming: false,
    outgoing: true,
  },
];

function onChangeRows(): void {
  action("onChangeRows action")();
}
function onPrevPage(): void {
  action("onPrevPage action")();
}
function onNextPage(): void {
  action("onNextPage action")();
}
function onSort(receivedOrderBy: TxsOrder, receivedOrder: SortOrder): () => void {
  return () => {
    action(`onSort action. receivedOrderBy: ${receivedOrderBy}, receivedOrder: ${receivedOrder}`)();
  };
}

storiesOf(TRANSACTIONS_STORY_PATH, module)
  .addParameters({ viewport: { defaultViewport: "responsive" } })
  .add("Without transactions", () => (
    <DecoratedStorybook>
      <Layout
        rows={[]}
        onChangeRows={onChangeRows}
        onPrevPage={onPrevPage}
        onNextPage={onNextPage}
        onSort={onSort}
        orderBy={TX_DATE_COLUMN}
        order={ORDER_DESC}
      />
    </DecoratedStorybook>
  ))
  .add(TRANSACTIONS_STORY_SHOW_PATH, () => {
    const orderedTxs = filterTxsBy(parsedTxs, 20, 0, TX_DATE_COLUMN, ORDER_DESC);
    const txs = orderedTxs.map(tx => BwParserFactory.getReactComponent(tx, currentUsersAddresses));
    return (
      <DecoratedStorybook>
        <Layout
          rows={txs}
          onChangeRows={onChangeRows}
          onPrevPage={onPrevPage}
          onNextPage={onNextPage}
          onSort={onSort}
          orderBy={TX_DATE_COLUMN}
          order={ORDER_DESC}
        />
      </DecoratedStorybook>
    );
  });
