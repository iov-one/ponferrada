import { Page } from 'puppeteer';
import TestUtils from 'react-dom/test-utils';
import {
  findRenderedDOMComponentWithId,
  findRenderedE2EComponentWithId,
} from '../../../utils/test/reactElemFinder';
import { ACCOUNT_STATUS_ROUTE } from '../../paths';
import { MNEMONIC_FIELD } from '../components/SetMnemonicForm';
import {
  PASSWORD_CONFIRM_FIELD,
  PASSWORD_FIELD,
  SET_PASSWORD_STEP_RESTORE_ACCOUNT_ROUTE,
} from '../components/SetPasswordForm';

export const submitRecoveryPhrase = async (
  restoreAccountDom: React.Component,
  mnemonic: string,
  password: string,
): Promise<void> => {
  const mnemonicTextarea = TestUtils.findRenderedDOMComponentWithTag(restoreAccountDom, 'textarea');

  TestUtils.act(() => {
    TestUtils.Simulate.change(mnemonicTextarea, {
      target: {
        value: mnemonic,
      },
    } as any); //eslint-disable-line @typescript-eslint/no-explicit-any
  });

  const mnemonicForm = TestUtils.findRenderedDOMComponentWithTag(restoreAccountDom, 'form');

  const submitMnemonicForm = async (): Promise<void> => {
    TestUtils.Simulate.submit(mnemonicForm);
    await findRenderedDOMComponentWithId(restoreAccountDom, SET_PASSWORD_STEP_RESTORE_ACCOUNT_ROUTE);
  };
  // FIXME  Once this is updated https://github.com/DefinitelyTyped/DefinitelyTyped/blob/master/types/react-dom/test-utils/index.d.ts#L296
  await TestUtils.act(submitMnemonicForm as any); //eslint-disable-line @typescript-eslint/no-explicit-any

  const [passwordInput, passwordConfirmInput] = TestUtils.scryRenderedDOMComponentsWithTag(
    restoreAccountDom,
    'input',
  );

  TestUtils.act(() => {
    TestUtils.Simulate.change(passwordInput, {
      target: {
        value: password,
      },
    } as any); //eslint-disable-line @typescript-eslint/no-explicit-any
  });

  TestUtils.act(() => {
    TestUtils.Simulate.change(passwordConfirmInput, {
      target: {
        value: password,
      },
    } as any); //eslint-disable-line @typescript-eslint/no-explicit-any
  });

  const passwordForm = TestUtils.findRenderedDOMComponentWithTag(restoreAccountDom, 'form');

  const submitPasswordForm = async (): Promise<void> => {
    TestUtils.Simulate.submit(passwordForm);
  };
  // FIXME  Once this is updated https://github.com/DefinitelyTyped/DefinitelyTyped/blob/master/types/react-dom/test-utils/index.d.ts#L296
  await TestUtils.act(submitPasswordForm as any); //eslint-disable-line @typescript-eslint/no-explicit-any
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
