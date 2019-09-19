import { Page } from "puppeteer";
import TestUtils from "react-dom/test-utils";

import { input, submit } from "../../../utils/test/dom";
import {
  findRenderedDOMComponentWithId,
  findRenderedE2EComponentWithId,
} from "../../../utils/test/reactElemFinder";
import { RESTORE_WALLET, WALLET_STATUS_ROUTE } from "../../paths";
import { IMPORT_WALLET_ID } from "../../welcome";
import { MNEMONIC_FIELD } from "../components/SetMnemonicForm";
import {
  PASSWORD_CONFIRM_FIELD,
  PASSWORD_FIELD,
  SET_PASSWORD_STEP_RESTORE_WALLET_ROUTE,
} from "../components/SetPasswordForm";

export const getMnemonicTextarea = (restoreWalletDom: React.Component): Element => {
  return TestUtils.findRenderedDOMComponentWithTag(restoreWalletDom, "textarea");
};

export const getMnemonicValidity = (restoreWalletDom: React.Component): Element => {
  return TestUtils.scryRenderedDOMComponentsWithTag(restoreWalletDom, "p")[0];
};

export const getMnemonicForm = (restoreWalletDom: React.Component): Element => {
  return TestUtils.findRenderedDOMComponentWithTag(restoreWalletDom, "form");
};

export const getPasswordInputs = (restoreWalletDom: React.Component): Element[] => {
  return TestUtils.scryRenderedDOMComponentsWithTag(restoreWalletDom, "input");
};

export const getPasswordValidity = (restoreWalletDom: React.Component): Element => {
  return TestUtils.scryRenderedDOMComponentsWithTag(restoreWalletDom, "p")[0];
};

export const getConfirmPasswordValidity = (restoreWalletDom: React.Component): Element => {
  return TestUtils.scryRenderedDOMComponentsWithTag(restoreWalletDom, "p")[0];
};

export const getPasswordForm = (restoreWalletDom: React.Component): Element => {
  return TestUtils.findRenderedDOMComponentWithTag(restoreWalletDom, "form");
};

export const isButtonDisabled = (button: Element): boolean => {
  return button.classList.contains("Mui-disabled");
};

export const submitMnemonicForm = async (
  restoreWalletDom: React.Component,
  mnemonic: string,
): Promise<void> => {
  input(getMnemonicTextarea(restoreWalletDom), mnemonic);
  submit(getMnemonicForm(restoreWalletDom));
  await findRenderedDOMComponentWithId(restoreWalletDom, SET_PASSWORD_STEP_RESTORE_WALLET_ROUTE);
};

export const submitRecoveryWordsE2E = async (
  page: Page,
  mnemonic: string,
  password: string,
): Promise<void> => {
  await page.type(`textarea[name="${MNEMONIC_FIELD}"]`, mnemonic);
  await page.click('button[type="submit"]');
  await findRenderedE2EComponentWithId(page, SET_PASSWORD_STEP_RESTORE_WALLET_ROUTE);

  await page.type(`input[name="${PASSWORD_FIELD}"]`, password);
  await page.type(`input[name="${PASSWORD_CONFIRM_FIELD}"]`, password);
  await page.click('button[type="submit"]');
  await findRenderedE2EComponentWithId(page, WALLET_STATUS_ROUTE);
};

export const travelToRestoreWalletStep = async (page: Page): Promise<void> => {
  await page.click(`#${IMPORT_WALLET_ID}`);
  await findRenderedE2EComponentWithId(page, RESTORE_WALLET);
};
