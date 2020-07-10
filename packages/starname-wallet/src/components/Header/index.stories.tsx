import { Address, ChainId, Token, TokenTicker, TransactionId } from "@iov/bcp";
import { storiesOf } from "@storybook/react";
import { Block, Hairline, Typography } from "medulas-react-components";
import * as React from "react";
import { ReadonlyDate } from "readonly-date";
import { DeepPartial } from "redux";
import { stringToAmount } from "ui-logic";

import { ProcessedTx } from "../../logic/transactions/types/BwParser";
import { ProcessedSendTransaction } from "../../store/notifications";
import { RootState } from "../../store/reducers";
import DecoratedStorybook, { bierzoRoot } from "../../utils/storybook";
import Header from "./index";

const iov: Pick<Token, "tokenTicker" | "fractionalDigits"> = {
  fractionalDigits: 9,
  tokenTicker: "IOV" as TokenTicker,
};

const lsk: Pick<Token, "tokenTicker" | "fractionalDigits"> = {
  fractionalDigits: 8,
  tokenTicker: "LSK" as TokenTicker,
};

const chainIdIov = "local-iov-devnet" as ChainId;
const chainIdLisk = "lisk-da3ed6a454" as ChainId;

const txs: readonly (ProcessedSendTransaction | ProcessedTx)[] = [
  {
    time: new ReadonlyDate("2018-12-24T10:51:33.763Z"),
    id: "tx0" as TransactionId,
    original: {
      kind: "bns/register_username",
      chainId: chainIdIov,
    },
  },
  {
    time: new ReadonlyDate("2018-12-24T10:51:33.763Z"),
    id: "tx1" as TransactionId,
    original: {
      kind: "bcp/send",
      chainId: chainIdLisk,
      sender: "123L" as Address,
      recipient: "456L" as Address,
      amount: stringToAmount("10.5", lsk),
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
      sender: "tiov1dcg3fat5zrvw00xezzjk3jgedm7pg70y222af3" as Address,
      recipient: "tiov1k898u78hgs36uqw68dg7va5nfkgstu5z0fhz3f" as Address,
      amount: stringToAmount("25.5", iov),
    },
    incoming: false,
    outgoing: true,
  },
];

const txStore: DeepPartial<RootState> = {
  // REVIEW Type '{ transactions: readonly (ProcessedSendTransaction | ProcessedTx<LightTransaction>)[]; }'
  // is not assignable to type 'DeepPartial<NotificationState>'.
  // Type 'TransactionId' is not assignable to type 'undefined'
  notifications: {
    transactions: txs as any,
  },
};

interface EnahncedHeaderProps {
  readonly text: string;
}

const EnhancedHeader = ({ text }: EnahncedHeaderProps): React.ReactElement => (
  <React.Fragment>
    <Typography variant="h6">{text}</Typography>
    <Header path="example" />
    <Hairline />
    <Block marginBottom={6} />
  </React.Fragment>
);

storiesOf(`${bierzoRoot}/Components`, module)
  .addParameters({ viewport: { defaultViewport: "responsive" } })
  .add("Header", () => (
    <div style={{ display: "flex", flexDirection: "column", width: "100%" }}>
      <DecoratedStorybook storeProps={txStore}>
        <EnhancedHeader text="Txs Header" />
      </DecoratedStorybook>
      <DecoratedStorybook>
        <EnhancedHeader text="Empty Header" />
      </DecoratedStorybook>
    </div>
  ));
