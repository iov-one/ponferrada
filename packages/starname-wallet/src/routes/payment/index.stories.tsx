import { TokenTicker, TransactionId } from "@iov/bcp";
import { liskCodec } from "@iov/lisk";
import { action } from "@storybook/addon-actions";
import { linkTo } from "@storybook/addon-links";
import { storiesOf } from "@storybook/react";
import { FormApi } from "final-form";
import React from "react";
import { DeepPartial } from "redux";

import { BalanceState } from "../../store/balances";
import { RootState } from "../../store/reducers";
import DecoratedStorybook, { bierzoRoot } from "../../utils/storybook";
import { BALANCE_STORY_PATH, BALANCE_STORY_VIEW_PATH } from "../balance/index.stories";
import { TRANSACTIONS_STORY_PATH, TRANSACTIONS_STORY_SHOW_PATH } from "../transactions/index.stories";
import ConfirmPayment from "./components/ConfirmPayment";
import Layout from "./components/index";
import ReceiverAddress from "./components/ReceiverAddress";

export const PAYMENT_STORY_PATH = `${bierzoRoot}/Payment`;
export const PAYMENT_STORY_PAYMENT_PATH = "Payment";
export const PAYMENT_STORY_PAYMENT_EMPTY_PATH = "No balance";
const PAYMENT_STORY_CONFIRMATION_PATH = "Confirmation";
const PAYMENT_STORY_UNVERIFIED_RECIPIENT = "Unverified Recipient";
const PAYMENT_STORY_VERIFIED_RECIPIENT = "Verified Recipient";

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
  // REVIEW Type 'BalanceState' is not assignable to type 'DeepPartial<BalanceState>'
  // Type 'TokenTicker' is not assignable to type 'undefined'
  return {
    balances: BALANCES as any,
  };
};

async function onTokenSelectionChanged(ticker: TokenTicker): Promise<void> {
  action(`Tiker: ${ticker}`)();
}

async function onSubmit(_: object): Promise<void> {
  linkTo(PAYMENT_STORY_PATH, PAYMENT_STORY_CONFIRMATION_PATH)();
}

const form: FormApi = {
  batch: () => {},
  blur: () => {},
  change: () => {},
  destroyOnUnregister: true,
  focus: () => {},
  initialize: () => {},
  isValidationPaused: () => false,
  getFieldState: () => undefined,
  getRegisteredFields: () => [],
  getState: () => {
    return {
      active: undefined,
      dirty: false,
      dirtyFields: {},
      dirtySinceLastSubmit: false,
      error: "",
      errors: [],
      hasSubmitErrors: false,
      hasValidationErrors: false,
      initialValues: {},
      invalid: false,
      modified: {},
      pristine: false,
      submitError: false,
      submitErrors: {},
      submitFailed: false,
      submitSucceeded: false,
      submitting: false,
      touched: {},
      valid: true,
      validating: true,
      values: {},
      visited: {},
    };
  },
  mutators: {},
  pauseValidation: () => {},
  registerField: () => () => {},
  reset: () => {},
  resetFieldState: () => {},
  resumeValidation: () => {},
  setConfig: () => {},
  submit: () => undefined,
  subscribe: () => () => {},
};

storiesOf(PAYMENT_STORY_PATH, module)
  .addParameters({ viewport: { defaultViewport: "responsive" } })
  .add(PAYMENT_STORY_PAYMENT_PATH, () => (
    <DecoratedStorybook storeProps={fullStore()}>
      <Layout
        onCancelPayment={linkTo(BALANCE_STORY_PATH, BALANCE_STORY_VIEW_PATH)}
        onSubmit={onSubmit}
        onTokenSelectionChanged={onTokenSelectionChanged}
        selectedChainCodec={liskCodec}
      />
    </DecoratedStorybook>
  ))
  .add(PAYMENT_STORY_PAYMENT_EMPTY_PATH, () => (
    <DecoratedStorybook>
      <Layout
        onCancelPayment={linkTo(BALANCE_STORY_PATH, BALANCE_STORY_VIEW_PATH)}
        onSubmit={onSubmit}
        onTokenSelectionChanged={onTokenSelectionChanged}
        selectedChainCodec={liskCodec}
      />
    </DecoratedStorybook>
  ))
  .add(PAYMENT_STORY_CONFIRMATION_PATH, () => (
    <DecoratedStorybook>
      <ConfirmPayment
        transactionId={"0x2be250c978013e0b3af09916c421511a07fac45bce16cdd891b7001a150cde0e" as TransactionId}
        onNewPayment={linkTo(PAYMENT_STORY_PATH, PAYMENT_STORY_PAYMENT_PATH)}
        onSeeTrasactions={linkTo(TRANSACTIONS_STORY_PATH, TRANSACTIONS_STORY_SHOW_PATH)}
        onReturnToBalance={linkTo(BALANCE_STORY_PATH, BALANCE_STORY_VIEW_PATH)}
      />
    </DecoratedStorybook>
  ))
  .add(PAYMENT_STORY_UNVERIFIED_RECIPIENT, () => (
    <DecoratedStorybook>
      <ReceiverAddress
        form={form}
        noBalance={false}
        selectedChainCodec={liskCodec}
        initialHasValidCert={false}
      />
    </DecoratedStorybook>
  ))
  .add(PAYMENT_STORY_VERIFIED_RECIPIENT, () => (
    <DecoratedStorybook>
      <ReceiverAddress
        form={form}
        noBalance={false}
        selectedChainCodec={liskCodec}
        initialHasValidCert={true}
      />
    </DecoratedStorybook>
  ));
