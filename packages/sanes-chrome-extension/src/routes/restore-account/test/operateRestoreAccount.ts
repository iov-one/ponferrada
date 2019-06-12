import { Page } from 'puppeteer';
import TestUtils from 'react-dom/test-utils';
import { input, submit } from '../../../utils/test/dom';
import {
  findRenderedDOMComponentWithId,
  findRenderedE2EComponentWithId,
} from '../../../utils/test/reactElemFinder';
import { ACCOUNT_STATUS_ROUTE, LOGIN_ROUTE, RESTORE_ACCOUNT } from '../../paths';
import { MNEMONIC_FIELD } from '../components/SetMnemonicForm';
import {
  PASSWORD_CONFIRM_FIELD,
  PASSWORD_FIELD,
  SET_PASSWORD_STEP_RESTORE_ACCOUNT_ROUTE,
} from '../components/SetPasswordForm';

export const getMnemonicTextarea = (restoreAccountDom: React.Component): Element => {
  return TestUtils.findRenderedDOMComponentWithTag(restoreAccountDom, 'textarea');
};

export const getMnemonicValidity = (restoreAccountDom: React.Component): Element => {
  return TestUtils.scryRenderedDOMComponentsWithTag(restoreAccountDom, 'p')[0];
};

export const getMnemonicForm = (restoreAccountDom: React.Component): Element => {
  return TestUtils.findRenderedDOMComponentWithTag(restoreAccountDom, 'form');
};

export const getPasswordInputs = (restoreAccountDom: React.Component): Element[] => {
  return TestUtils.scryRenderedDOMComponentsWithTag(restoreAccountDom, 'input');
};

export const getPasswordValidity = (restoreAccountDom: React.Component): Element => {
  return TestUtils.scryRenderedDOMComponentsWithTag(restoreAccountDom, 'p')[0];
};

export const getConfirmPasswordValidity = (restoreAccountDom: React.Component): Element => {
  return TestUtils.scryRenderedDOMComponentsWithTag(restoreAccountDom, 'p')[0];
};

export const getPasswordForm = (restoreAccountDom: React.Component): Element => {
  return TestUtils.findRenderedDOMComponentWithTag(restoreAccountDom, 'form');
};

export const isButtonDisabled = (button: Element): boolean => {
  return button.classList.contains('Mui-disabled');
};

export const submitMnemonicForm = async (
  restoreAccountDom: React.Component,
  mnemonic: string,
  password: string,
): Promise<void> => {
  input(getMnemonicTextarea(restoreAccountDom), mnemonic);
  submit(getMnemonicForm(restoreAccountDom));
  await findRenderedDOMComponentWithId(restoreAccountDom, SET_PASSWORD_STEP_RESTORE_ACCOUNT_ROUTE);
};

export const submitRecoveryPhraseE2E = async (
  page: Page,
  mnemonic: string,
  password: string,
): Promise<void> => {
  await page.type(`textarea[name="${MNEMONIC_FIELD}"]`, mnemonic);
  await page.click('button[type="submit"]');
  await findRenderedE2EComponentWithId(page, SET_PASSWORD_STEP_RESTORE_ACCOUNT_ROUTE);

  await page.type(`input[name="${PASSWORD_FIELD}"]`, password);
  await page.type(`input[name="${PASSWORD_CONFIRM_FIELD}"]`, password);
  await page.click('button[type="submit"]');
  await findRenderedE2EComponentWithId(page, ACCOUNT_STATUS_ROUTE);
};

export const travelToRestoreAccountStep = async (page: Page): Promise<void> => {
  await page.click('button:nth-of-type(1)');
  await findRenderedE2EComponentWithId(page, LOGIN_ROUTE);

  await page.click('a:nth-of-type(1)');
  await findRenderedE2EComponentWithId(page, RESTORE_ACCOUNT);
};
