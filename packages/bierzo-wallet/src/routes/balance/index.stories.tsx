import { TokenTicker } from "@iov/bcp";
import { linkTo } from "@storybook/addon-links";
import { storiesOf } from "@storybook/react";
import React from "react";

import PageMenu from "../../components/PageMenu";
import { BalanceState } from "../../store/balances";
import DecoratedStorybook, { bierzoRoot } from "../../utils/storybook";
import { RECEIVE_PAYMENT_STORY_PATH } from "../addresses/index.stories";
import { PAYMENT_STORY_PATH, PAYMENT_STORY_PAYMENT_PATH } from "../payment/index.stories";
import {
  REGISTER_USERNAME_REGISTRATION_STORY_PATH,
  REGISTER_USERNAME_STORY_PATH,
} from "../registerName/index.stories";
import Layout from "./components/index";

export const BALANCE_STORY_PATH = `${bierzoRoot}/Balance`;
export const BALANCE_STORY_VIEW_PATH = "View";

const BALANCE: BalanceState = {
  BASH: {
    quantity: "82500",
    fractionalDigits: 4,
    tokenTicker: "BASH" as TokenTicker,
  },
  CASH: {
    quantity: "1226775",
    fractionalDigits: 5,
    tokenTicker: "CASH" as TokenTicker,
  },
};

const NO_BALANCE = {};

const ACCOUNT_NAME = "adolfo*iov";

storiesOf(BALANCE_STORY_PATH, module)
  .addParameters({ viewport: { defaultViewport: "responsive" } })
  .add(BALANCE_STORY_VIEW_PATH, () => (
    <DecoratedStorybook>
      <PageMenu>
        <Layout
          iovAddress={ACCOUNT_NAME}
          rpcEndpointType="extension"
          balances={BALANCE}
          onSendPayment={linkTo(PAYMENT_STORY_PATH, PAYMENT_STORY_PAYMENT_PATH)}
          onReceivePayment={linkTo(bierzoRoot, RECEIVE_PAYMENT_STORY_PATH)}
          onRegisterUsername={linkTo(REGISTER_USERNAME_STORY_PATH, REGISTER_USERNAME_REGISTRATION_STORY_PATH)}
        />
      </PageMenu>
    </DecoratedStorybook>
  ))
  .add("View without tokens and without name", () => (
    <DecoratedStorybook>
      <PageMenu>
        <Layout
          iovAddress={undefined}
          rpcEndpointType="extension"
          balances={NO_BALANCE}
          onSendPayment={linkTo(PAYMENT_STORY_PATH, PAYMENT_STORY_PAYMENT_PATH)}
          onReceivePayment={linkTo(bierzoRoot, RECEIVE_PAYMENT_STORY_PATH)}
          onRegisterUsername={linkTo(REGISTER_USERNAME_STORY_PATH, REGISTER_USERNAME_REGISTRATION_STORY_PATH)}
        />
      </PageMenu>
    </DecoratedStorybook>
  ))
  .add("View on ledger and without name", () => (
    <DecoratedStorybook>
      <PageMenu>
        <Layout
          iovAddress={undefined}
          rpcEndpointType="ledger"
          balances={NO_BALANCE}
          onSendPayment={linkTo(PAYMENT_STORY_PATH, PAYMENT_STORY_PAYMENT_PATH)}
          onReceivePayment={linkTo(bierzoRoot, RECEIVE_PAYMENT_STORY_PATH)}
          onRegisterUsername={linkTo(REGISTER_USERNAME_STORY_PATH, REGISTER_USERNAME_REGISTRATION_STORY_PATH)}
        />
      </PageMenu>
    </DecoratedStorybook>
  ));
