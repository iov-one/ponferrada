import { Address, TokenTicker, TransactionId } from "@iov/bcp";
import { storiesOf } from "@storybook/react";
import Block from "medulas-react-components/lib/components/Block";
import Hairline from "medulas-react-components/lib/components/Hairline";
import Typography from "medulas-react-components/lib/components/Typography";
import * as React from "react";
import { ReadonlyDate } from "readonly-date";
import { DeepPartial } from "redux";

import { BwUnknownProps } from "../../logic/transactions/types/BwUnkownTransaction";
import { ProcessedSendTransaction } from "../../store/notifications";
import { RootState } from "../../store/reducers";
import { stringToAmount } from "../../utils/balances";
import DecoratedStorybook, { WALLET_ROOT } from "../../utils/storybook";
import Header from "./index";

const txs: ReadonlyArray<ProcessedSendTransaction | BwUnknownProps> = [
  {
    time: new ReadonlyDate("2018-12-24T10:51:33.763Z"),
    id: "tx0" as TransactionId,
    original: {
      kind: "bns/register_username",
    },
  },
  {
    received: true,
    time: new ReadonlyDate("2018-12-24T10:51:33.763Z"),
    id: "tx1" as TransactionId,
    original: {
      kind: "bcp/send",
      sender: "123L" as Address,
      recipient: "456L" as Address,
      amount: stringToAmount("10.5", "LSK" as TokenTicker),
    },
  },
  {
    received: false,
    time: new ReadonlyDate("2018-12-24T10:51:33.763Z"),
    id: "tx2" as TransactionId,
    original: {
      kind: "bcp/send",
      sender: "tiov1dcg3fat5zrvw00xezzjk3jgedm7pg70y222af3" as Address,
      recipient: "tiov1k898u78hgs36uqw68dg7va5nfkgstu5z0fhz3f" as Address,
      amount: stringToAmount("25.5", "IOV" as TokenTicker),
    },
  },
];

const txStore: DeepPartial<RootState> = {
  notifications: {
    transactions: txs,
  },
};

interface EnahncedHeaderProps {
  readonly text: string;
}

const EnhancedHeader = ({ text }: EnahncedHeaderProps): JSX.Element => (
  <React.Fragment>
    <Typography variant="h6">{text}</Typography>
    <Header path="example" />
    <Hairline />
    <Block marginBottom={6} />
  </React.Fragment>
);

storiesOf(`${WALLET_ROOT}/Components`, module)
  .addParameters({ viewport: { defaultViewport: "responsive" } })
  .add(
    "Header",
    (): JSX.Element => (
      <div style={{ display: "flex", flexDirection: "column", width: "100%" }}>
        <DecoratedStorybook storeProps={txStore}>
          <EnhancedHeader text="Txs Header" />
        </DecoratedStorybook>
        <DecoratedStorybook>
          <EnhancedHeader text="Empty Header" />
        </DecoratedStorybook>
      </div>
    ),
  );
