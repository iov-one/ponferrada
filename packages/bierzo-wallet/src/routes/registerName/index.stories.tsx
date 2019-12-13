import { Address, ChainId, Fee, Token, TokenTicker, TransactionId } from "@iov/bcp";
import { action } from "@storybook/addon-actions";
import { linkTo } from "@storybook/addon-links";
import { storiesOf } from "@storybook/react";
import { FormValues, ValidationError } from "medulas-react-components";
import React from "react";
import { stringToAmount } from "ui-logic";

import { ChainAddressPairWithName } from "../../components/AddressesTable";
import { isValidIov } from "../../logic/account";
import DecoratedStorybook, { bierzoRoot } from "../../utils/storybook";
import { BALANCE_STORY_PATH, BALANCE_STORY_VIEW_PATH } from "../balance/index.stories";
import { TRANSACTIONS_STORY_PATH, TRANSACTIONS_STORY_SHOW_PATH } from "../transactions/index.stories";
import ConfirmRegistration from "./components/ConfirmRegistration";
import Layout, { REGISTER_USERNAME_FIELD } from "./components/index";

export const REGISTER_USERNAME_STORY_PATH = `${bierzoRoot}/Register Username`;
export const REGISTER_USERNAME_REGISTRATION_STORY_PATH = "Register Username";
const REGISTER_USERNAME_REGISTRATION_STORY_ZERO_FEE_PATH = "Register Username without fee";
const REGISTER_USERNAME_CONFIRMATION_STORY_PATH = "Registration confirmation";

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

async function onSubmit(values: object): Promise<void> {
  const formValues = values as FormValues;
  // eslint-disable-next-line no-console
  console.log(formValues);
  action("onSubmit")();
}

async function validate(values: object): Promise<object> {
  const formValues = values as FormValues;
  const errors: ValidationError = {};

  const username = formValues[REGISTER_USERNAME_FIELD];
  if (!username) {
    errors[REGISTER_USERNAME_FIELD] = "Required";
    return errors;
  }
  const checkResult = isValidIov(username);

  switch (checkResult) {
    case "not_iov":
      errors[REGISTER_USERNAME_FIELD] = "IOV starname must include *iov";
      break;
    case "wrong_number_of_asterisks":
      errors[REGISTER_USERNAME_FIELD] = "IOV starname must include only one namespace";
      break;
    case "too_short":
      errors[REGISTER_USERNAME_FIELD] = "IOV starname should be at least 3 characters";
      break;
    case "too_long":
      errors[REGISTER_USERNAME_FIELD] = "IOV starname should be maximum 64 characters";
      break;
    case "wrong_chars":
      errors[REGISTER_USERNAME_FIELD] =
        "IOV starname should contain 'abcdefghijklmnopqrstuvwxyz0123456789-_.' characters only";
      break;
    case "valid":
      break;
    default:
      throw new Error(`"Unknown IOV starname validation error: ${checkResult}`);
  }
  return errors;
}

const iov: Pick<Token, "tokenTicker" | "fractionalDigits"> = {
  fractionalDigits: 9,
  tokenTicker: "IOV" as TokenTicker,
};

const fee: Fee = {
  tokens: stringToAmount("5", iov),
};

storiesOf(REGISTER_USERNAME_STORY_PATH, module)
  .addParameters({ viewport: { defaultViewport: "responsive" } })
  .add(REGISTER_USERNAME_REGISTRATION_STORY_ZERO_FEE_PATH, () => (
    <DecoratedStorybook>
      <Layout
        onCancel={linkTo(BALANCE_STORY_PATH, BALANCE_STORY_VIEW_PATH)}
        onSubmit={onSubmit}
        validate={validate}
        chainAddresses={addresses}
        transactionFee={undefined}
      />
    </DecoratedStorybook>
  ))
  .add(REGISTER_USERNAME_REGISTRATION_STORY_PATH, () => (
    <DecoratedStorybook>
      <Layout
        onCancel={linkTo(BALANCE_STORY_PATH, BALANCE_STORY_VIEW_PATH)}
        onSubmit={onSubmit}
        validate={validate}
        chainAddresses={addresses}
        transactionFee={fee}
      />
    </DecoratedStorybook>
  ))
  .add(REGISTER_USERNAME_CONFIRMATION_STORY_PATH, () => (
    <DecoratedStorybook>
      <ConfirmRegistration
        transactionId={"0x2be250c978013e0b3af09916c421511a07fac45bce16cdd891b7001a150cde0e" as TransactionId}
        onSeeTrasactions={linkTo(TRANSACTIONS_STORY_PATH, TRANSACTIONS_STORY_SHOW_PATH)}
        onReturnToBalance={linkTo(BALANCE_STORY_PATH, BALANCE_STORY_VIEW_PATH)}
      />
    </DecoratedStorybook>
  ));
