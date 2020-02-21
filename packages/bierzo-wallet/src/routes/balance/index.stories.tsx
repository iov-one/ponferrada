import { TokenTicker } from "@iov/bcp";
import { linkTo } from "@storybook/addon-links";
import { storiesOf } from "@storybook/react";
import React from "react";

import PageMenu from "../../components/PageMenu";
import { BalanceState } from "../../store/balances";
import DecoratedStorybook, { bierzoRoot } from "../../utils/storybook";
import {
  REGISTER_IOVNAME_REGISTRATION_STORY_PATH,
  REGISTER_IOVNAME_STORY_PATH,
} from "../register/index.stories";
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
          onRegisterIovname={linkTo(REGISTER_IOVNAME_STORY_PATH, REGISTER_IOVNAME_REGISTRATION_STORY_PATH)}
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
          onRegisterIovname={linkTo(REGISTER_IOVNAME_STORY_PATH, REGISTER_IOVNAME_REGISTRATION_STORY_PATH)}
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
          onRegisterIovname={linkTo(REGISTER_IOVNAME_STORY_PATH, REGISTER_IOVNAME_REGISTRATION_STORY_PATH)}
        />
      </PageMenu>
    </DecoratedStorybook>
  ));
