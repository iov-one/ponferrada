import { Address, ChainId, Token, TokenTicker, TransactionId } from "@iov/bcp";
import { storiesOf } from "@storybook/react";
import { Typography } from "medulas-react-components";
import * as React from "react";
import { ReadonlyDate } from "readonly-date";
import { DeepPartial } from "redux";
import { stringToAmount } from "ui-logic";

import { ProcessedSendTransaction } from "../../store/notifications";
import { RootState } from "../../store/reducers";
import DecoratedStorybook, { bierzoRoot } from "../../utils/storybook";
import PageMenu from "./index";

const iov: Pick<Token, "tokenTicker" | "fractionalDigits"> = {
  fractionalDigits: 9,
  tokenTicker: "IOV" as TokenTicker,
};

const chainIdIov = "local-iov-devnet" as ChainId;
const chainIdLisk = "lisk-da3ed6a454" as ChainId;

const txs: readonly ProcessedSendTransaction[] = [
  {
    time: new ReadonlyDate("2018-12-24T10:51:33.763Z"),
    id: "tx1" as TransactionId,
    original: {
      kind: "bcp/send",
      chainId: chainIdLisk,
      amount: {
        quantity: "1050000000",
        fractionalDigits: 8,
        tokenTicker: "LSK" as TokenTicker,
      },
      sender: "1L" as Address,
      recipient: "2L" as Address,
    },
    incoming: true,
    outgoing: false,
  },
  {
    time: new ReadonlyDate("2018-12-24T10:51:33.763Z"),
    id: "tx2" as TransactionId,
    original: {
      kind: "bcp/send",
      chainId: chainIdIov,
      amount: stringToAmount("25.5", iov),
      sender: "tiov1dcg3fat5zrvw00xezzjk3jgedm7pg70y222af3" as Address,
      recipient: "tiov1k898u78hgs36uqw68dg7va5nfkgstu5z0fhz3f" as Address,
    },
    incoming: false,
    outgoing: true,
  },
];

const faultTx: ProcessedSendTransaction = {
  time: new ReadonlyDate("2018-12-24T10:51:33.763Z"),
  id: "tx3" as TransactionId,
  original: {
    kind: "bcp/send",
    chainId: chainIdIov,
    amount: stringToAmount("100.5", iov),
    sender: "tiov1dcg3fat5zrvw00xezzjk3jgedm7pg70y222af3" as Address,
    recipient: "tiov1k898u78hgs36uqw68dg7va5nfkgstu5z0fhz3f" as Address,
  },
  incoming: false,
  outgoing: true,
};

const incomingAndOutgoingSendTransaction: ProcessedSendTransaction = {
  time: new ReadonlyDate("2019-12-24T04:35:03.763Z"),
  id: "EDBBA9C7C558A60E09A589C2263CF5DDC7B25ED014E3EF5959C6B1C8E6DBAD4E" as TransactionId,
  original: {
    kind: "bcp/send",
    chainId: chainIdIov,
    sender: "tiov1xgm95mecmf3vkn7lnszfe9q4uy6nv0pwkr8wc3" as Address,
    recipient: "tiov1xgm95mecmf3vkn7lnszfe9q4uy6nv0pwkr8wc3" as Address,
    amount: stringToAmount("7.4", iov),
    memo: "Send money to myself for fun",
  },
  incoming: true,
  outgoing: true,
};

const fullStore = (): DeepPartial<RootState> => {
  const fullTxs = [faultTx, incomingAndOutgoingSendTransaction, ...txs];

  return {
    // REVIEW Type '{ transactions: readonly (ProcessedSendTransaction | ProcessedTx<LightTransaction>)[]; }'
    // is not assignable to type 'DeepPartial<NotificationState>'.
    // Type 'TransactionId' is not assignable to type 'undefined'
    notifications: {
      transactions: fullTxs as any,
    },
  };
};

storiesOf(`${bierzoRoot}/Components/PageMenu`, module)
  .addParameters({ viewport: { defaultViewport: "responsive" } })
  .add("Without padding", () => (
    <DecoratedStorybook storeProps={fullStore()}>
      <PageMenu padding={false}>
        <Typography variant="h5" color="primary">
          What is Lorem Ipsum?
        </Typography>
        <Typography variant="body1">
          <strong>Lorem Ipsum</strong> is simply dummy text of the printing and typesetting industry. Lorem
          Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took
          a galley of type and scrambled it to make a type specimen book. It has survived not only five
          centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was
          popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and
          more recently with desktop publishing software like Aldus PageMaker including versions of Lorem
          Ipsum.
        </Typography>
      </PageMenu>
    </DecoratedStorybook>
  ))
  .add("With padding", () => (
    <DecoratedStorybook storeProps={fullStore()}>
      <PageMenu>
        <Typography variant="h5" color="primary">
          What is Lorem Ipsum?
        </Typography>
        <Typography variant="body1">
          <strong>Lorem Ipsum</strong> is simply dummy text of the printing and typesetting industry. Lorem
          Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took
          a galley of type and scrambled it to make a type specimen book. It has survived not only five
          centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was
          popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and
          more recently with desktop publishing software like Aldus PageMaker including versions of Lorem
          Ipsum.
        </Typography>
      </PageMenu>
    </DecoratedStorybook>
  ));
