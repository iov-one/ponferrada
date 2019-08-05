import { TokenTicker, TransactionId } from "@iov/bcp";
import { liskCodec } from "@iov/lisk";
import { action } from "@storybook/addon-actions";
import { linkTo } from "@storybook/addon-links";
import { storiesOf } from "@storybook/react";
import React from "react";
import { DeepPartial } from "redux";

import { BalanceState } from "../../store/balances";
import { RootState } from "../../store/reducers";
import DecoratedStorybook, { WALLET_ROOT } from "../../utils/storybook";
import { BALANCE_STORY_PATH, BALANCE_STORY_VIEW_PATH } from "../balance/index.stories";
import { TRANSACTIONS_STORY_PATH, TRANSACTIONS_STORY_SHOW_PATH } from "../transactions/index.stories";
import ConfirmPayment from "./components/ConfirmPayment";
import Layout from "./components/index";

export const PAYMENT_STORY_PATH = `${WALLET_ROOT}/Payment`;
export const PAYMENT_STORY_PAYMENT_PATH = "Payment";
const PAYMENT_STORY_CONFIRMATION_PATH = "Confirmation";

const BALANCES: BalanceState = {
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

const fullStore = (): DeepPartial<RootState> => {
  return {
    balances: BALANCES,
  };
};

async function onTokenSelectionChanged(ticker: TokenTicker): Promise<void> {
  action(`Tiker: ${ticker}`)();
}

async function onSubmit(_: object): Promise<void> {
  linkTo(PAYMENT_STORY_PATH, PAYMENT_STORY_CONFIRMATION_PATH)();
}

storiesOf(PAYMENT_STORY_PATH, module)
  .addParameters({ viewport: { defaultViewport: "responsive" } })
  .add(
    PAYMENT_STORY_PAYMENT_PATH,
    (): JSX.Element => (
      <DecoratedStorybook storeProps={fullStore()}>
        <Layout
          onCancelPayment={linkTo(BALANCE_STORY_PATH, BALANCE_STORY_VIEW_PATH)}
          onSubmit={onSubmit}
          onTokenSelectionChanged={onTokenSelectionChanged}
          selectedChainCodec={liskCodec}
        />
      </DecoratedStorybook>
    ),
  )
  .add(
    PAYMENT_STORY_CONFIRMATION_PATH,
    (): JSX.Element => (
      <DecoratedStorybook>
        <ConfirmPayment
          transactionId={
            "0x2be250c978013e0b3af09916c421511a07fac45bce16cdd891b7001a150cde0e" as TransactionId
          }
          onNewPayment={linkTo(PAYMENT_STORY_PATH, PAYMENT_STORY_PAYMENT_PATH)}
          onSeeTrasactions={linkTo(TRANSACTIONS_STORY_PATH, TRANSACTIONS_STORY_SHOW_PATH)}
          onReturnToBalance={linkTo(BALANCE_STORY_PATH, BALANCE_STORY_VIEW_PATH)}
        />
      </DecoratedStorybook>
    ),
  );
