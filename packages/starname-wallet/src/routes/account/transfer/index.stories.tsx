import { storiesOf } from "@storybook/react";
import { Typography } from "medulas-react-components";
import React from "react";
import { BwUsernameWithChainName } from "../../../components/AccountManage";
import { ACCOUNT_TRANSFER_STORY_PATH } from "../../../components/AccountTransfer/index.stories";
import { ChainAddressPairWithName } from "../../../components/AddressesTable";
import DecoratedStorybook from "../../../utils/storybook";

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

const account: BwUsernameWithChainName = {
  username: "test2*iov",
  addresses: chainAddresses,
};

/*const iov: Pick<Token, "tokenTicker" | "fractionalDigits"> = {
  fractionalDigits: 9,
  tokenTicker: "IOV" as TokenTicker,
};

const bnsIdentity: Identity = {
  chainId: "local-iov-devnet" as string,
  pubkey: {
    algo: Algorithm.Ed25519,
    data: new Uint8Array([]) as PubkeyBytes,
  },
};*/

const TransferPrompt: React.FunctionComponent = (): JSX.Element => (
  <Typography color="default" variant="subtitle2">
    New owner blockchain address, iovname or starname
  </Typography>
);

export const ACCOUNT_TRANSFER_IOVNAMES_STORY_PATH = "Transfer iovname";

/*
<AccountTransfer
        account={account}
        getRequest={async (newOwner: Address): Promise<JsonRpcRequest> => {
          action("getRequest")(newOwner);
          return await generateTransferUsernameTxRequest(bnsIdentity, account.username, newOwner);
        }}
        onCancel={linkTo(ACCOUNT_MANAGE_STORY_PATH, ACCOUNT_MANAGE_IOVNAMES_STORY_PATH)}
        getFee={async newOwner => {
          action("get fee")(newOwner);
          return { tokens: stringToAmount("5", iov) };
        }}
        bnsstring={"local-iov-devnet" as ChainId}
        rpcEndpoint={extensionRpcEndpoint}
        setTransactionId={value => {
          action("setTransactionId")(value);
        }}
        transferPrompt={<TransferPrompt />}
      >
      </AccountTransfer>
      */

storiesOf(ACCOUNT_TRANSFER_STORY_PATH, module)
  .addParameters({ viewport: { defaultViewport: "responsive" } })
  .add(ACCOUNT_TRANSFER_IOVNAMES_STORY_PATH, () => (
    <DecoratedStorybook>
      <Typography>Some additional description</Typography>
    </DecoratedStorybook>
  ));
