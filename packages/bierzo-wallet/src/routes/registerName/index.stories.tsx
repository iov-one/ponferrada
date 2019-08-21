import { Address, ChainId, TransactionId } from "@iov/bcp";
import { ChainAddressPair } from "@iov/bns";
import { action } from "@storybook/addon-actions";
import { linkTo } from "@storybook/addon-links";
import { storiesOf } from "@storybook/react";
import React from "react";

import DecoratedStorybook, { WALLET_ROOT } from "../../utils/storybook";
import { BALANCE_STORY_PATH, BALANCE_STORY_VIEW_PATH } from "../balance/index.stories";
import { TRANSACTIONS_STORY_PATH, TRANSACTIONS_STORY_SHOW_PATH } from "../transactions/index.stories";
import ConfirmRegistration from "./components/ConfirmRegistration";
import Layout from "./components/index";

export const REGISTER_USERNAME_STORY_PATH = `${WALLET_ROOT}/Register Username`;
export const REGISTER_USERNAME_REGISTRATION_STORY_PATH = "Register Username";
const REGISTER_USERNAME_CONFIRMATION_STORY_PATH = "Registeration confirmation";

const addresses: ChainAddressPair[] = [
  {
    chainId: "local-iov-devnet" as ChainId,
    address: "tiov1dcg3fat5zrvw00xezzjk3jgedm7pg70y222af3" as Address,
  },
  {
    chainId: "lisk-198f2b61a8" as ChainId,
    address: "1349293588603668134L" as Address,
  },
  {
    chainId: "ethereum-eip155-5777" as ChainId,
    address: "0xD383382350F9f190Bd2608D6381B15b4e1cec0f3" as Address,
  },
];

async function onSubmit(_: object): Promise<void> {
  action("onSubmit")();
}

async function validate(_: object): Promise<object> {
  action("validate")();
  return {};
}

storiesOf(REGISTER_USERNAME_STORY_PATH, module)
  .addParameters({ viewport: { defaultViewport: "responsive" } })
  .add(
    REGISTER_USERNAME_REGISTRATION_STORY_PATH,
    (): JSX.Element => (
      <DecoratedStorybook>
        <Layout
          onCancel={linkTo(BALANCE_STORY_PATH, BALANCE_STORY_VIEW_PATH)}
          onSubmit={onSubmit}
          validate={validate}
          addresses={addresses}
        />
      </DecoratedStorybook>
    ),
  )
  .add(
    REGISTER_USERNAME_CONFIRMATION_STORY_PATH,
    (): JSX.Element => (
      <DecoratedStorybook>
        <ConfirmRegistration
          transactionId={
            "0x2be250c978013e0b3af09916c421511a07fac45bce16cdd891b7001a150cde0e" as TransactionId
          }
          onSeeTrasactions={linkTo(TRANSACTIONS_STORY_PATH, TRANSACTIONS_STORY_SHOW_PATH)}
          onReturnToBalance={linkTo(BALANCE_STORY_PATH, BALANCE_STORY_VIEW_PATH)}
        />
      </DecoratedStorybook>
    ),
  );
