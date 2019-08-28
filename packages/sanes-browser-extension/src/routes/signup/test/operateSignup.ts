import { Page } from "puppeteer";
import TestUtils from "react-dom/test-utils";

import { getHintPhrase } from "../../../utils/localstorage/hint";
import { check, click, input, submit } from "../../../utils/test/dom";
import {
  findRenderedDOMComponentWithId,
  findRenderedE2EComponentWithId,
} from "../../../utils/test/reactElemFinder";
import { WALLET_STATUS_ROUTE } from "../../paths";
import {
  FIRST_STEP_SIGNUP_ROUTE,
  PASSWORD_CONFIRM_FIELD,
  PASSWORD_FIELD,
  TERMS_ACCEPT_FIELD,
  WALLET_NAME_FIELD,
} from "../components/NewWalletForm";
import { SECURITY_HINT, SECURITY_HINT_STEP_SIGNUP_ROUTE } from "../components/SecurityHintForm";
import { SECOND_STEP_SIGNUP_ROUTE } from "../components/ShowPhraseForm";

export const getNewWalletInputs = (signupDom: React.Component): Element[] => {
  return TestUtils.scryRenderedDOMComponentsWithTag(signupDom, "input");
};

export const checkWalletNameValidity = (signupDom: React.Component, error?: string): void => {
  const elements = TestUtils.scryRenderedDOMComponentsWithTag(signupDom, "p");

  if (elements.length === 0) {
    return;
  }

  expect(elements[0].textContent).toBe(error);
};

export const checkHintValidity = (signupDom: React.Component, error?: string): void => {
  const elements = TestUtils.scryRenderedDOMComponentsWithTag(signupDom, "p");

  if (elements.length === 0) {
    return;
  }

  expect(elements[0].textContent).toBe(error);
};

export const getPasswordValidity = (signupDom: React.Component): Element => {
  return TestUtils.scryRenderedDOMComponentsWithTag(signupDom, "p")[0];
};

export const getConfirmPasswordValidity = (signupDom: React.Component): Element => {
  return TestUtils.scryRenderedDOMComponentsWithTag(signupDom, "p")[1];
};

export const getTermsValidity = (signupDom: React.Component): Element => {
  return TestUtils.scryRenderedDOMComponentsWithTag(signupDom, "p")[0];
};

export const getConfirmPasswordMismatch = (signupDom: React.Component): Element => {
  return TestUtils.scryRenderedDOMComponentsWithTag(signupDom, "p")[0];
};

export const getNewAccountForm = (signupDom: React.Component): Element => {
  return TestUtils.findRenderedDOMComponentWithTag(signupDom, "form");
};

export const getSecurityHintForm = (signupDom: React.Component): Element => {
  return TestUtils.findRenderedDOMComponentWithTag(signupDom, "form");
};

export const getTermsCheckboxLabel = (termsCheckbox: Element): string | null => {
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const titleSpan = termsCheckbox.parentElement!.parentElement!.parentElement!.querySelector(
    "span:nth-of-type(2)",
  );
  if (titleSpan === null) return null;

  return titleSpan.textContent;
};

export const isButtonDisabled = (button: Element): boolean => {
  return button.classList.contains("Mui-disabled");
};

export const submitNewWalletE2E = async (page: Page, walletName: string, password: string): Promise<void> => {
  await page.type(`input[name="${WALLET_NAME_FIELD}"]`, walletName);
  await page.type(`input[name="${PASSWORD_FIELD}"]`, password);
  await page.type(`input[name="${PASSWORD_CONFIRM_FIELD}"]`, password);
  await page.click(`input[name="${TERMS_ACCEPT_FIELD}"]`);

  await page.click('button[type="submit"]');
  await findRenderedE2EComponentWithId(page, SECOND_STEP_SIGNUP_ROUTE);
};

export const submitNewWallet = async (
  newWalletDom: React.Component,
  walletName: string,
  password: string,
): Promise<void> => {
  const inputs = getNewWalletInputs(newWalletDom);

  const [walletNameField, passwordField, passwordConfirmField, termsAcceptField] = inputs;
  input(walletNameField, walletName);
  input(passwordField, password);
  input(passwordConfirmField, password);
  await check(termsAcceptField);

  const newWalletForm = TestUtils.findRenderedDOMComponentWithTag(newWalletDom, "form");
  const submitPasswordForm = async (): Promise<void> => {
    TestUtils.Simulate.submit(newWalletForm);
    await findRenderedDOMComponentWithId(newWalletDom, SECOND_STEP_SIGNUP_ROUTE);
  };

  await TestUtils.act(submitPasswordForm as any);
};

export const submitShowPhraseE2E = async (page: Page): Promise<void> => {
  const checkbox = await page.$('input[type="checkbox"]');
  expect(checkbox).not.toBeNull();

  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  await checkbox!.click();

  const mnemonic = await page.evaluate(() => {
    const element = document.querySelectorAll("p")[1];
    if (!element) throw new Error("Paragraph element not found");
    return element.textContent || "";
  });
  expect(mnemonic.split(" ").length).toBe(12);

  const buttons = await page.$$("button");
  await buttons[1].click();
  await findRenderedE2EComponentWithId(page, SECURITY_HINT_STEP_SIGNUP_ROUTE);
};

export const submitShowPhrase = async (showPhraseDom: React.Component): Promise<void> => {
  const continueButton = TestUtils.scryRenderedDOMComponentsWithTag(showPhraseDom, "button")[1];
  click(continueButton);
  await findRenderedDOMComponentWithId(showPhraseDom, SECURITY_HINT_STEP_SIGNUP_ROUTE);
};

export const submitSecurityHintE2E = async (page: Page, securityHint: string): Promise<void> => {
  await page.type(`input[name="${SECURITY_HINT}"]`, securityHint);

  await page.click('button[type="submit"]');

  await findRenderedE2EComponentWithId(page, WALLET_STATUS_ROUTE);
};

export const submitSecurityHint = async (
  securityHintDom: React.Component,
  walletName: string,
  hint: string,
): Promise<void> => {
  const hintInput = TestUtils.findRenderedDOMComponentWithTag(securityHintDom, "input");
  input(hintInput, hint);

  const form = TestUtils.findRenderedDOMComponentWithTag(securityHintDom, "form");
  submit(form);
  await findRenderedDOMComponentWithId(securityHintDom, WALLET_STATUS_ROUTE);
  expect(getHintPhrase(walletName)).toBe(hint);
};

export const travelToSignupNewAccountStep = async (page: Page): Promise<void> => {
  await page.click("button:nth-of-type(2)");

  await findRenderedE2EComponentWithId(page, FIRST_STEP_SIGNUP_ROUTE);
};
