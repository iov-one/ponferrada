import { Address, TokenTicker, TransactionId } from "@iov/bcp";
import { storiesOf } from "@storybook/react";
import React from "react";
import { ReadonlyDate } from "readonly-date";

import { BwUnknownProps } from "../../logic/transactions/types/BwUnkownTransaction";
import { ProcessedSendTransaction } from "../../store/notifications";
import { RootState } from "../../store/reducers";
import { stringToAmount } from "../../utils/balances";
import DecoratedStorybook, { WALLET_ROOT } from "../../utils/storybook";
import Payment from "./index";

export const TRANSACTIONS_STORY_PATH = `${WALLET_ROOT}/Transactions`;
export const TRANSACTIONS_STORY_SHOW_PATH = "With transactions";

const txs: readonly (ProcessedSendTransaction | BwUnknownProps)[] = [
  {
    id: "DA9A61A3CA28C772E468D772D642978180332780ADB6410909E51487C0F61050" as TransactionId,
    time: new ReadonlyDate("2019-12-24T10:51:33.763Z"),
    original: {
      kind: "bns/register_username",
    },
  },
  {
    received: true,
    time: new ReadonlyDate("2019-12-24T05:35:03.763Z"),
    id: "tx1" as TransactionId,
    original: {
      kind: "bcp/send",
      sender: "george*iov" as Address,
      recipient: "me" as Address,
      amount: stringToAmount("10.5", "LSK" as TokenTicker),
      memo: "Sample note",
    },
  },
  {
    time: new ReadonlyDate("2019-12-24T03:35:03.763Z"),
    id: "0xaaffBdjuhyu8898scchjsg" as TransactionId,
    original: {
      kind: "bns/register_username",
    },
  },
  {
    received: false,
    time: new ReadonlyDate("2018-10-05T16:12:00.763Z"),
    id: "tx2" as TransactionId,
    original: {
      kind: "bcp/send",
      sender: "me" as Address,
      recipient: "alex*iov" as Address,
      amount: stringToAmount("25.5", "IOV" as TokenTicker),
    },
  },
  {
    received: false,
    time: new ReadonlyDate("2018-12-24T10:51:33.763Z"),
    id: "tx3" as TransactionId,
    original: {
      kind: "bcp/send",
      sender: "me" as Address,
      recipient: "alex*iov" as Address,
      amount: stringToAmount("100.5", "IOV" as TokenTicker),
      memo: "Another note",
    },
  },
  {
    received: true,
    time: new ReadonlyDate("2018-11-13T05:35:03.763Z"),
    id: "tx4" as TransactionId,
    original: {
      kind: "bcp/send",
      sender: "Lx9oa7re0894eopiahsdpf98as7y908" as Address,
      recipient: "me" as Address,
      amount: stringToAmount("10.5", "LSK" as TokenTicker),
      memo: "And again note",
    },
  },
  {
    received: false,
    time: new ReadonlyDate("2018-10-05T16:12:00.763Z"),
    id: "tx5" as TransactionId,
    original: {
      kind: "bcp/send",
      sender: "me" as Address,
      recipient: "alex*iov" as Address,
      amount: stringToAmount("25.5", "IOV" as TokenTicker),
    },
  },
  {
    received: false,
    time: new ReadonlyDate("2018-12-24T10:51:33.763Z"),
    id: "tx6" as TransactionId,
    original: {
      kind: "bcp/send",
      sender: "me" as Address,
      recipient: "alex*iov" as Address,
      amount: stringToAmount("100.5", "IOV" as TokenTicker),
    },
  },
  {
    received: true,
    time: new ReadonlyDate("2018-11-13T05:35:03.763Z"),
    id: "tx7" as TransactionId,
    original: {
      kind: "bcp/send",
      sender: "george*iov" as Address,
      recipient: "me" as Address,
      amount: stringToAmount("10.5", "LSK" as TokenTicker),
    },
  },
  {
    received: false,
    time: new ReadonlyDate("2018-10-05T16:12:00.763Z"),
    id: "tx8" as TransactionId,
    original: {
      kind: "bcp/send",
      sender: "me" as Address,
      recipient: "alex*iov" as Address,
      amount: stringToAmount("25.5", "IOV" as TokenTicker),
    },
  },
  {
    received: false,
    time: new ReadonlyDate("2018-12-24T10:51:33.763Z"),
    id: "tx9" as TransactionId,
    original: {
      kind: "bcp/send",
      sender: "me" as Address,
      recipient: "alex*iov" as Address,
      amount: stringToAmount("100.5", "IOV" as TokenTicker),
    },
  },
  {
    received: true,
    time: new ReadonlyDate("2018-11-13T05:35:03.763Z"),
    id: "tx10" as TransactionId,
    original: {
      kind: "bcp/send",
      sender: "george*iov" as Address,
      recipient: "me" as Address,
      amount: stringToAmount("10.5", "LSK" as TokenTicker),
    },
  },
  {
    received: false,
    time: new ReadonlyDate("2018-10-05T16:12:00.763Z"),
    id: "tx11" as TransactionId,
    original: {
      kind: "bcp/send",
      sender: "me" as Address,
      recipient: "alex*iov" as Address,
      amount: stringToAmount("25.5", "IOV" as TokenTicker),
    },
  },
  {
    received: false,
    time: new ReadonlyDate("2018-12-24T10:51:33.763Z"),
    id: "tx12" as TransactionId,
    original: {
      kind: "bcp/send",
      sender: "me" as Address,
      recipient: "alex*iov" as Address,
      amount: stringToAmount("100.5", "IOV" as TokenTicker),
    },
  },
  {
    received: true,
    time: new ReadonlyDate("2018-11-13T05:35:03.763Z"),
    id: "tx13" as TransactionId,
    original: {
      kind: "bcp/send",
      sender: "george*iov" as Address,
      recipient: "me" as Address,
      amount: stringToAmount("10.5", "LSK" as TokenTicker),
    },
  },
  {
    received: false,
    time: new ReadonlyDate("2018-10-05T16:12:00.763Z"),
    id: "tx14" as TransactionId,
    original: {
      kind: "bcp/send",
      sender: "Lxasdoiu9847ioasdpfuy098q23rui" as Address,
      recipient: "alex*iov" as Address,
      amount: stringToAmount("25.5", "IOV" as TokenTicker),
    },
  },
  {
    received: false,
    time: new ReadonlyDate("2018-12-24T10:51:33.763Z"),
    id: "tx15" as TransactionId,
    original: {
      kind: "bcp/send",
      sender: "me" as Address,
      recipient: "alex*iov" as Address,
      amount: stringToAmount("100.5", "IOV" as TokenTicker),
    },
  },
];

const txStore: Pick<RootState, "notifications"> = {
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
        <Payment />
      </DecoratedStorybook>
    ),
  )
  .add(
    TRANSACTIONS_STORY_SHOW_PATH,
    (): JSX.Element => (
      <DecoratedStorybook storeProps={txStore}>
        <Payment />
      </DecoratedStorybook>
    ),
  );
