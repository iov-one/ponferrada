import { TransactionId } from "@iov/bcp";
import { linkTo } from "@storybook/addon-links";
import { storiesOf } from "@storybook/react";
import React from "react";

import DecoratedStorybook, { bierzoRoot } from "../../utils/storybook";
import { TRANSACTIONS_STORY_PATH, TRANSACTIONS_STORY_SHOW_PATH } from "../transactions/index.stories";
import ConfirmRegistration from "./components/ConfirmRegistration";

export const REGISTER_USERNAME_STORY_PATH = `${bierzoRoot}/Register Username`;
export const REGISTER_USERNAME_REGISTRATION_STORY_PATH = "Register Username";
// const REGISTER_USERNAME_REGISTRATION_STORY_ZERO_FEE_PATH = "Register Username without fee";
const REGISTER_USERNAME_CONFIRMATION_STORY_PATH = "Registration confirmation";

/* const addresses: ChainAddressPairWithName[] = [
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
}; */

storiesOf(REGISTER_USERNAME_STORY_PATH, module)
  .addParameters({ viewport: { defaultViewport: "responsive" } })
  // TODO adapt this stories to new components
  /* .add(REGISTER_USERNAME_REGISTRATION_STORY_ZERO_FEE_PATH, () => (
    <DecoratedStorybook>
      <IovnameForm
        iovnameAddresses={undefined}
        onCancel={linkTo(BALANCE_STORY_PATH, BALANCE_STORY_VIEW_PATH)}
        chainAddresses={addresses}
        transactionFee={undefined}
      />
    </DecoratedStorybook>
  ))
  .add(REGISTER_USERNAME_REGISTRATION_STORY_PATH, () => (
    <DecoratedStorybook>
      <IovnameForm
        iovnameAddresses={undefined}
        onCancel={linkTo(BALANCE_STORY_PATH, BALANCE_STORY_VIEW_PATH)}
        chainAddresses={addresses}
        transactionFee={fee}
      />
    </DecoratedStorybook>
  )) */
  .add(REGISTER_USERNAME_CONFIRMATION_STORY_PATH, () => (
    <DecoratedStorybook>
      <ConfirmRegistration
        transactionId={"0x2be250c978013e0b3af09916c421511a07fac45bce16cdd891b7001a150cde0e" as TransactionId}
        onSeeTrasactions={linkTo(TRANSACTIONS_STORY_PATH, TRANSACTIONS_STORY_SHOW_PATH)}
      />
    </DecoratedStorybook>
  ));
