import { Address, Algorithm, ChainId, Identity, PubkeyBytes, Token, TokenTicker } from "@iov/bcp";
import { JsonRpcRequest } from "@iov/jsonrpc";
import { action } from "@storybook/addon-actions";
import { storiesOf } from "@storybook/react";
import { Typography } from "medulas-react-components";
import React from "react";
import { stringToAmount } from "ui-logic";

import { extensionRpcEndpoint } from "../../communication/extensionRpcEndpoint";
import { generateTransferDomainTxRequest } from "../../communication/requestgenerators";
import { ChainAddressPairWithName } from "../../components/AddressesTable";
import DecoratedStorybook, { bierzoRoot } from "../../utils/storybook";
import { BwAccountWithChainName } from "../AccountManage";
import AccountTransfer from ".";

const chainAddresses: ChainAddressPairWithName[] = [
  {
    chainId: "local-iov-devnet" as ChainId,
    address: "tiov1dcg3fat5zrvw00xezzjk3jgedm7pg70y222af3" as Address,
    chainName: "IOV Devnet",
  },
  {
    chainId: "lisk-198f2b61a8" as ChainId,
    address: "1349293588603668134L" as Address,
    chainName: "Lisk Devnet",
  },
  {
    chainId: "ethereum-eip155-5777" as ChainId,
    address: "0xD383382350F9f190Bd2608D6381B15b4e1cec0f3" as Address,
    chainName: "Ganache",
  },
];

const account: BwAccountWithChainName = {
  name: "albert",
  domain: "iov",
  expiryDate: new Date("June 5, 2120 03:00:00"),
  owner: "tiov1dcg3fat5zrvw00xezzjk3jgedm7pg70y222af3" as Address,
  addresses: chainAddresses,
};

export const ACCOUNT_TRANSFER_STORY_PATH = `${bierzoRoot}/Account Transfer`;
export const ACCOUNT_TRANSFER_SAMPLE_STORY_PATH = "Transfer sample";

const iov: Pick<Token, "tokenTicker" | "fractionalDigits"> = {
  fractionalDigits: 9,
  tokenTicker: "IOV" as TokenTicker,
};

const bnsIdentity: Identity = {
  chainId: "local-iov-devnet" as ChainId,
  pubkey: {
    algo: Algorithm.Ed25519,
    data: new Uint8Array([]) as PubkeyBytes,
  },
};

const TransferPrompt: React.FunctionComponent = (): JSX.Element => (
  <Typography color="default" variant="subtitle2">
    New owner blockchain address, iovname or starname
  </Typography>
);

storiesOf(ACCOUNT_TRANSFER_STORY_PATH, module)
  .addParameters({ viewport: { defaultViewport: "responsive" } })
  .add(ACCOUNT_TRANSFER_SAMPLE_STORY_PATH, () => (
    <DecoratedStorybook>
      <AccountTransfer
        account={account}
        getRequest={async (newOwner: Address): Promise<JsonRpcRequest> => {
          action("getRequest")(newOwner);
          return await generateTransferDomainTxRequest(bnsIdentity, account.domain, newOwner);
        }}
        onCancel={action("Transfer cancel")}
        getFee={async newOwner => {
          action("get fee")(newOwner);
          return { tokens: stringToAmount("5", iov) };
        }}
        bnsChainId={"local-iov-devnet" as ChainId}
        rpcEndpoint={extensionRpcEndpoint}
        setTransactionId={value => {
          action("setTransactionId")(value);
        }}
        transferPrompt={<TransferPrompt />}
      >
        <Typography>Some additional description</Typography>
      </AccountTransfer>
    </DecoratedStorybook>
  ));
