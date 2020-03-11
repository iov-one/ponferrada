import { Address, ChainId, Fee, Token, TokenTicker, TransactionId } from "@iov/bcp";
import { linkTo } from "@storybook/addon-links";
import { storiesOf } from "@storybook/react";
import React from "react";
import { stringToAmount } from "ui-logic";

import { ChainAddressPairWithName } from "../../components/AddressesTable";
import DecoratedStorybook, { bierzoRoot } from "../../utils/storybook";
import { BALANCE_STORY_PATH, BALANCE_STORY_VIEW_PATH } from "../balance/index.stories";
import { TRANSACTIONS_STORY_PATH, TRANSACTIONS_STORY_SHOW_PATH } from "../transactions/index.stories";
import ConfirmRegistration from "./components/ConfirmRegistration";
import IovnameForm from "./components/IovnameForm";
import StarnameForm from "./components/StarnameForm";

export const REGISTER_IOVNAME_STORY_PATH = `${bierzoRoot}/Register Iovname`;
export const REGISTER_IOVNAME_REGISTRATION_STORY_PATH = "Register Iovname";
const REGISTER_IOVNAME_REGISTRATION_STORY_ZERO_FEE_PATH = "Register Iovname without fee";
export const REGISTER_STARNAME_STORY_PATH = `${bierzoRoot}/Register Starname`;
export const REGISTER_STARNAME_REGISTRATION_STORY_PATH = "Register Starname";
const REGISTER_STARNAME_REGISTRATION_STORY_ZERO_FEE_PATH = "Register Starname without fee";
const REGISTER_NAME_CONFIRMATION_STORY_PATH_ROOT = `${bierzoRoot}/Registration confirmation`;
const REGISTER_NAME_CONFIRMATION_STORY_PATH = "Registration confirmation";

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

storiesOf(REGISTER_IOVNAME_STORY_PATH, module)
  .addParameters({ viewport: { defaultViewport: "responsive" } })
  .add(REGISTER_IOVNAME_REGISTRATION_STORY_ZERO_FEE_PATH, () => (
    <DecoratedStorybook>
      <IovnameForm
        chainAddresses={addresses}
        iovnameAddresses={undefined}
        bnsIdentity={undefined}
        rpcEndpoint={undefined}
        onCancel={linkTo(BALANCE_STORY_PATH, BALANCE_STORY_VIEW_PATH)}
        transactionFee={undefined}
        setTransactionId={() => {}}
      />
    </DecoratedStorybook>
  ))
  .add(REGISTER_IOVNAME_REGISTRATION_STORY_PATH, () => (
    <DecoratedStorybook>
      <IovnameForm
        chainAddresses={addresses}
        iovnameAddresses={undefined}
        bnsIdentity={undefined}
        rpcEndpoint={undefined}
        onCancel={linkTo(BALANCE_STORY_PATH, BALANCE_STORY_VIEW_PATH)}
        transactionFee={fee}
        setTransactionId={() => {}}
      />
    </DecoratedStorybook>
  ));

storiesOf(REGISTER_STARNAME_STORY_PATH, module)
  .addParameters({ viewport: { defaultViewport: "responsive" } })
  .add(REGISTER_STARNAME_REGISTRATION_STORY_ZERO_FEE_PATH, () => (
    <DecoratedStorybook>
      <StarnameForm
        iovnameAddresses={undefined}
        bnsIdentity={undefined}
        rpcEndpoint={undefined}
        onCancel={linkTo(BALANCE_STORY_PATH, BALANCE_STORY_VIEW_PATH)}
        transactionFee={undefined}
        setTransactionId={() => {}}
      />
    </DecoratedStorybook>
  ))
  .add(REGISTER_STARNAME_REGISTRATION_STORY_PATH, () => (
    <DecoratedStorybook>
      <StarnameForm
        iovnameAddresses={undefined}
        bnsIdentity={undefined}
        rpcEndpoint={undefined}
        onCancel={linkTo(BALANCE_STORY_PATH, BALANCE_STORY_VIEW_PATH)}
        transactionFee={fee}
        setTransactionId={() => {}}
      />
    </DecoratedStorybook>
  ));

storiesOf(REGISTER_NAME_CONFIRMATION_STORY_PATH_ROOT, module)
  .addParameters({ viewport: { defaultViewport: "responsive" } })
  .add(REGISTER_NAME_CONFIRMATION_STORY_PATH, () => (
    <DecoratedStorybook>
      <ConfirmRegistration
        transactionId={"0x2be250c978013e0b3af09916c421511a07fac45bce16cdd891b7001a150cde0e" as TransactionId}
        onSeeTrasactions={linkTo(TRANSACTIONS_STORY_PATH, TRANSACTIONS_STORY_SHOW_PATH)}
      />
    </DecoratedStorybook>
  ));
