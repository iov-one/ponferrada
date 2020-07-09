import { TokenTicker } from "@iov/bcp";
import { linkTo } from "@storybook/addon-links";
import { storiesOf } from "@storybook/react";
import React from "react";

import { RpcEndpoint } from "communication/rpcEndpoint";
import PageMenu from "../../components/PageMenu";
import { BalanceState } from "store/balances";
import DecoratedStorybook, { bierzoRoot } from "../../utils/storybook";
import {
  REGISTER_IOVNAME_REGISTRATION_STORY_PATH,
  REGISTER_IOVNAME_STORY_PATH,
} from "../account/register/index.stories";
import Layout from "./components/index";
import { Target, Account, Task } from "logic/api";

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

const extensionRpcEndpoint: RpcEndpoint = {
  authorizeGetIdentitiesMessage: "test authorizeGetIdentitiesMessage",
  authorizeSignAndPostMessage: "test authorizeSignAndPostMessage",
  noMatchingIdentityMessage: "test noMatchingIdentityMessage",
  notAvailableMessage: "test notAvailableMessage",
  type: "extension",
  resolveStarname: (query: string): Task<Account> => ({
    run: () => Promise.resolve<Account>({} as Account),
    abort: () => null,
  }),
  executeRequest: async (request: any): Promise<string> => "",
  getTargets: async (): Promise<Target[]> => [],
};

const ledgerRpcEndpoint: RpcEndpoint = {
  authorizeGetIdentitiesMessage: "test authorizeGetIdentitiesMessage",
  authorizeSignAndPostMessage: "test authorizeSignAndPostMessage",
  noMatchingIdentityMessage: "test noMatchingIdentityMessage",
  notAvailableMessage: "test notAvailableMessage",
  type: "ledger",
  resolveStarname: (query: string): Task<Account> => ({
    run: () => Promise.resolve<Account>({} as Account),
    abort: () => null,
  }),
  executeRequest: async (request: any): Promise<string> => "",
  getTargets: async (): Promise<Target[]> => [],
};

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
  .add("View without tokens and without name", () => (
    <DecoratedStorybook storeProps={{ rpcEndpoint: extensionRpcEndpoint }}>
      <PageMenu>
        <Layout
          iovAddress={undefined}
          balances={NO_BALANCE}
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
