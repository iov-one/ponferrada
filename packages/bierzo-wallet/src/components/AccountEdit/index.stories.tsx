import { Address, ChainId, Fee, Token, TokenTicker } from "@iov/bcp";
import { action } from "@storybook/addon-actions";
import { linkTo } from "@storybook/addon-links";
import { storiesOf } from "@storybook/react";
import React from "react";
import { stringToAmount } from "ui-logic";

import AccountEdit from "../../components/AccountEdit";
import {
  ACCOUNT_MANAGE_SAMPLE_STORY_PATH,
  ACCOUNT_MANAGE_STORY_PATH,
} from "../../components/AccountManage/index.stories";
import { ChainAddressPairWithName } from "../../components/AddressesTable";
import DecoratedStorybook, { bierzoRoot } from "../../utils/storybook";
import { BwUsernameWithChainName } from "../AccountManage";

const addresses: ChainAddressPairWithName[] = [
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

const iov: Pick<Token, "tokenTicker" | "fractionalDigits"> = {
  fractionalDigits: 9,
  tokenTicker: "IOV" as TokenTicker,
};

const fee: Fee = {
  tokens: stringToAmount("5", iov),
};

const account: BwUsernameWithChainName = {
  username: "test*iov",
  addresses: addresses,
};

export const UPDATE_ACCOUNT_STORY_PATH = `${bierzoRoot}/Update Account`;
export const UPDATE_ACCOUNT_SAMPLE_STORY_PATH = "Update sample";

storiesOf(UPDATE_ACCOUNT_STORY_PATH, module)
  .addParameters({ viewport: { defaultViewport: "responsive" } })
  .add(UPDATE_ACCOUNT_SAMPLE_STORY_PATH, () => (
    <DecoratedStorybook>
      <AccountEdit
        chainAddresses={addresses}
        account={account}
        onCancel={linkTo(ACCOUNT_MANAGE_STORY_PATH, ACCOUNT_MANAGE_SAMPLE_STORY_PATH)}
        transactionFee={fee}
        onSubmit={async (values: object): Promise<void> => action("Account update submit")(values)}
      />
    </DecoratedStorybook>
  ));
