import { storiesOf } from "@storybook/react";
import { ACCOUNT_TRANSFER_STORY_PATH } from "components/AccountTransfer/index.stories";
import { Typography } from "medulas-react-components";
import React from "react";

import DecoratedStorybook from "../../../utils/storybook";

/* const iov: Pick<Token, "tokenTicker" | "fractionalDigits"> = {
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
