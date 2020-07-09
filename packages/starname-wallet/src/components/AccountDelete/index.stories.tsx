import { action } from "@storybook/addon-actions";
import { storiesOf } from "@storybook/react";
import { extensionRpcEndpoint } from "communication/extensionRpcEndpoint";
import { ChainAddressPairWithName } from "components/AddressesTable";
import { Typography } from "medulas-react-components";
import React from "react";
import { stringToAmount, Token } from "ui-logic";

import DecoratedStorybook, { bierzoRoot } from "../../utils/storybook";
import { BwAccountWithChainName } from "../AccountManage";
import AccountDelete from ".";

const chainAddresses: ChainAddressPairWithName[] = [
  {
    chainId: "local-iov-devnet",
    address: "tiov1dcg3fat5zrvw00xezzjk3jgedm7pg70y222af3",
    chainName: "IOV Devnet",
  },
  {
    chainId: "lisk-198f2b61a8",
    address: "1349293588603668134L",
    chainName: "Lisk Devnet",
  },
  {
    chainId: "ethereum-eip155-5777",
    address: "0xD383382350F9f190Bd2608D6381B15b4e1cec0f3",
    chainName: "Ganache",
  },
];

const account: BwAccountWithChainName = {
  name: "albert",
  domain: "iov",
  expiryDate: new Date("June 5, 2120 03:00:00"),
  owner: "tiov1dcg3fat5zrvw00xezzjk3jgedm7pg70y222af3",
  addresses: chainAddresses,
};

export const ACCOUNT_DELETE_STORY_PATH = `${bierzoRoot}/Account Delete`;
export const ACCOUNT_DELETE_SAMPLE_STORY_PATH = "Delete sample";

const iov: Pick<Token, "tokenTicker" | "fractionalDigits"> = {
  fractionalDigits: 9,
  tokenTicker: "IOV",
};

storiesOf(ACCOUNT_DELETE_STORY_PATH, module)
  .addParameters({ viewport: { defaultViewport: "responsive" } })
  .add(ACCOUNT_DELETE_SAMPLE_STORY_PATH, () => (
    <DecoratedStorybook>
      <AccountDelete
        account={account}
        getRequest={async (): Promise<JsonRpcRequest> => {
          action("getRequest")();
          return {} as JsonRpcRequest;
        }}
        onCancel={action("Transfer cancel")}
        getFee={async () => {
          action("get fee")();
          return { tokens: stringToAmount("5", iov) };
        }}
        bnsChainId={"local-iov-devnet"}
        rpcEndpoint={extensionRpcEndpoint}
        setTransactionId={(value): void => {
          action("setTransactionId")(value);
        }}
      >
        <Typography>Some additional description</Typography>
      </AccountDelete>
    </DecoratedStorybook>
  ));
