import { Address, TokenTicker, TransactionId } from "@iov/bcp";
import { storiesOf } from "@storybook/react";
import Typography from "medulas-react-components/lib/components/Typography";
import * as React from "react";
import { ReadonlyDate } from "readonly-date";
import { DeepPartial } from "redux";

import { ProcessedSendTransaction } from "../../store/notifications";
import { RootState } from "../../store/reducers";
import DecoratedStorybook, { WALLET_ROOT } from "../../utils/storybook";
import PageMenu from "./index";

const txs: readonly ProcessedSendTransaction[] = [
  {
    received: true,
    time: new ReadonlyDate("2018-12-24T10:51:33.763Z"),
    id: "tx1" as TransactionId,
    original: {
      kind: "bcp/send",
      amount: {
        quantity: "1050000000",
        fractionalDigits: 8,
        tokenTicker: "LSK" as TokenTicker,
      },
      sender: "1L" as Address,
      recipient: "2L" as Address,
    },
  },
  {
    received: false,
    time: new ReadonlyDate("2018-12-24T10:51:33.763Z"),
    id: "tx2" as TransactionId,
    original: {
      kind: "bcp/send",
      amount: {
        quantity: "25500000000",
        fractionalDigits: 9,
        tokenTicker: "IOV" as TokenTicker,
      },
      sender: "tiov1dcg3fat5zrvw00xezzjk3jgedm7pg70y222af3" as Address,
      recipient: "tiov1k898u78hgs36uqw68dg7va5nfkgstu5z0fhz3f" as Address,
    },
  },
];

const faultTx: ProcessedSendTransaction = {
  received: false,
  time: new ReadonlyDate("2018-12-24T10:51:33.763Z"),
  id: "tx3" as TransactionId,
  original: {
    kind: "bcp/send",
    amount: {
      quantity: "100500000000",
      fractionalDigits: 9,
      tokenTicker: "IOV" as TokenTicker,
    },
    sender: "tiov1dcg3fat5zrvw00xezzjk3jgedm7pg70y222af3" as Address,
    recipient: "tiov1k898u78hgs36uqw68dg7va5nfkgstu5z0fhz3f" as Address,
  },
};

const fullStore = (): DeepPartial<RootState> => {
  const fullTxs = [faultTx, ...txs];

  return {
    notifications: {
      transactions: fullTxs,
    },
  };
};

storiesOf(`${WALLET_ROOT}/Components/PageMenu`, module)
  .addParameters({ viewport: { defaultViewport: "responsive" } })
  .add(
    "Without padding",
    (): JSX.Element => (
      <DecoratedStorybook storeProps={fullStore()}>
        <PageMenu padding={false}>
          <Typography variant="h5" color="primary">
            What is Lorem Ipsum?
          </Typography>
          <Typography variant="body1">
            <strong>Lorem Ipsum</strong> is simply dummy text of the printing and typesetting industry. Lorem
            Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer
            took a galley of type and scrambled it to make a type specimen book. It has survived not only five
            centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was
            popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and
            more recently with desktop publishing software like Aldus PageMaker including versions of Lorem
            Ipsum.
          </Typography>
        </PageMenu>
      </DecoratedStorybook>
    ),
  )
  .add(
    "With padding",
    (): JSX.Element => (
      <DecoratedStorybook storeProps={fullStore()}>
        <PageMenu>
          <Typography variant="h5" color="primary">
            What is Lorem Ipsum?
          </Typography>
          <Typography variant="body1">
            <strong>Lorem Ipsum</strong> is simply dummy text of the printing and typesetting industry. Lorem
            Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer
            took a galley of type and scrambled it to make a type specimen book. It has survived not only five
            centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was
            popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and
            more recently with desktop publishing software like Aldus PageMaker including versions of Lorem
            Ipsum.
          </Typography>
        </PageMenu>
      </DecoratedStorybook>
    ),
  );
