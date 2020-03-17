import { Address, ChainId, Token, TokenTicker } from "@iov/bcp";
import { action } from "@storybook/addon-actions";
import { storiesOf } from "@storybook/react";
import React from "react";
import { stringToAmount } from "ui-logic";

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
  expiryDate: new Date(),
  addresses: [chainAddresses[0], chainAddresses[1]],
};

export const ACCOUNT_TRANSFER_STORY_PATH = `${bierzoRoot}/Account Transfer`;
export const ACCOUNT_TRANSFER_SAMPLE_STORY_PATH = "Transfer sample";

const iov: Pick<Token, "tokenTicker" | "fractionalDigits"> = {
  fractionalDigits: 9,
  tokenTicker: "IOV" as TokenTicker,
};

storiesOf(ACCOUNT_TRANSFER_STORY_PATH, module)
  .addParameters({ viewport: { defaultViewport: "responsive" } })
  .add(ACCOUNT_TRANSFER_SAMPLE_STORY_PATH, () => (
    <DecoratedStorybook>
      <AccountTransfer
        id="account-transfer-id"
        account={account}
        onTransfer={async (values: object): Promise<void> => {
          action("Transfer")(values);
        }}
        onCancel={action("Transfer cancel")}
        getFee={() => ({ tokens: stringToAmount("5", iov) })}
      />
    </DecoratedStorybook>
  ));
