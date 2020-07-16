import { linkTo } from "@storybook/addon-links";
import { storiesOf } from "@storybook/react";
import { ledgerRpcEndpoint } from "communication/ledgerRpcEndpoint";
import React from "react";
import { BalanceState } from "store/balances";

import PageMenu from "../../components/PageMenu";
import DecoratedStorybook, { bierzoRoot } from "../../utils/storybook";
import {
  REGISTER_IOVNAME_REGISTRATION_STORY_PATH,
  REGISTER_IOVNAME_STORY_PATH,
} from "../account/register/index.stories";
import Layout from "./components/index";

export const BALANCE_STORY_PATH = `${bierzoRoot}/Balance`;
export const BALANCE_STORY_VIEW_PATH = "View";

const BALANCE: BalanceState = {
  IOV: 82500,
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
          balances={BALANCE}
          onRegisterIovname={linkTo(REGISTER_IOVNAME_STORY_PATH, REGISTER_IOVNAME_REGISTRATION_STORY_PATH)}
        />
      </PageMenu>
    </DecoratedStorybook>
  ))
  .add("View on ledger and without name", () => (
    <DecoratedStorybook storeProps={{ rpcEndpoint: ledgerRpcEndpoint }}>
      <PageMenu>
        <Layout
          iovAddress={undefined}
          balances={NO_BALANCE}
          onRegisterIovname={linkTo(REGISTER_IOVNAME_STORY_PATH, REGISTER_IOVNAME_REGISTRATION_STORY_PATH)}
        />
      </PageMenu>
    </DecoratedStorybook>
  ));
