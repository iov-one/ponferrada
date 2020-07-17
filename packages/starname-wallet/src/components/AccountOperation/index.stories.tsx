import { ChainId, Token, TokenTicker } from "@iov/bcp";
import { JsonRpcRequest } from "@iov/jsonrpc";
import { action } from "@storybook/addon-actions";
import { storiesOf } from "@storybook/react";
import { ledgerRpcEndpoint } from "communication/ledgerRpcEndpoint";
import { FormValues, Typography } from "medulas-react-components";
import React from "react";
import { stringToAmount } from "ui-logic";

import DecoratedStorybook, { bierzoRoot } from "../../utils/storybook";
import AccountOperation from ".";

const iov: Pick<Token, "tokenTicker" | "fractionalDigits"> = {
  fractionalDigits: 9,
  tokenTicker: "IOV" as TokenTicker,
};

const Header: React.FunctionComponent = (): React.ReactElement => (
  <React.Fragment>
    <Typography color="default" variant="h5" inline>
      You are makeing operation with{" "}
    </Typography>
    <Typography color="primary" variant="h5" inline>
      albert*iov
    </Typography>
    <Typography color="default" variant="h5" inline>
      {" "}
      account
    </Typography>
  </React.Fragment>
);

storiesOf(`${bierzoRoot}/Account Operation`, module)
  .addParameters({ viewport: { defaultViewport: "responsive" } })
  .add("Sample", () => (
    <DecoratedStorybook>
      <AccountOperation
        submitCaption="Operation"
        getRequest={async (formValues: FormValues): Promise<JsonRpcRequest> => {
          action("getRequest")(formValues);
          return {} as JsonRpcRequest;
        }}
        onCancel={action("Transfer cancel")}
        getFee={async newOwner => {
          action("get fee")(newOwner);
          return { tokens: stringToAmount("5", iov) };
        }}
        bnsChainId={"local-iov-devnet" as ChainId}
        rpcEndpoint={ledgerRpcEndpoint}
        setTransactionId={value => {
          action("setTransactionId")(value);
        }}
        header={<Header />}
      >
        <Typography>Some additional description</Typography>
      </AccountOperation>
    </DecoratedStorybook>
  ));
