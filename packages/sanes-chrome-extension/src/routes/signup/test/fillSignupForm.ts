import TestUtils from 'react-dom/test-utils';
import { randomString } from '../../../utils/test/random';
import { SECOND_STEP_SIGNUP_ROUTE } from '../components/ShowPhraseForm';
import {
  findRenderedDOMComponentWithId,
  findRenderedE2EComponentWithId,
} from '../../../utils/test/reactElemFinder';
import { SECURITY_HINT_STEP_SIGNUP_ROUTE, SECURITY_HINT } from '../components/SecurityHintForm';
import { sleep } from '../../../utils/timer';
import { getHintPhrase } from '../../../utils/localstorage/hint';
import { PersonaManager } from '../../../logic/persona';
import { Page } from 'puppeteer';
import { ACCOUNT_NAME_FIELD, PASSWORD_FIELD, PASSWORD_CONFIRM_FIELD } from '../components/NewAccountForm';

export const submitAccountFormE2E = async (
  page: Page,
  accountName: string,
  password: string
): Promise<void> => {
  await page.type(`input[name="${ACCOUNT_NAME_FIELD}"]`, accountName);
  await page.type(`input[name="${PASSWORD_FIELD}`, password);
  await page.type(`input[name="${PASSWORD_CONFIRM_FIELD}`, password);

  await sleep(2000);
  await page.click('button[type="submit"]');
  await findRenderedE2EComponentWithId(page, SECOND_STEP_SIGNUP_ROUTE);
};

export const submitAccountForm = async (
  AccountSubmitDom: React.Component,
  accountName: string
): Promise<void> => {
  const inputs = TestUtils.scryRenderedDOMComponentsWithTag(AccountSubmitDom, 'input');

  expect(inputs.length).toBe(3);

  const password = randomString(10);
  const accountNameField = inputs[0];
  const passwordField = inputs[1];
  const passwordConfirmField = inputs[2];

  TestUtils.act(
    (): void => {
      TestUtils.Simulate.change(accountNameField, {
        target: {
          value: accountName,
        },
      } as any); //eslint-disable-line @typescript-eslint/no-explicit-any
    }
  );

  TestUtils.act(
    (): void => {
      TestUtils.Simulate.change(passwordField, {
        target: { value: password },
      } as any); //eslint-disable-line @typescript-eslint/no-explicit-any
    }
  );

  TestUtils.act(
    (): void => {
      TestUtils.Simulate.change(passwordConfirmField, {
        target: { value: password },
      } as any); //eslint-disable-line @typescript-eslint/no-explicit-any
    }
  );

  const form = TestUtils.findRenderedDOMComponentWithTag(AccountSubmitDom, 'form');

  const submitForm = async (): Promise<void> => {
    TestUtils.Simulate.submit(form);
    await findRenderedDOMComponentWithId(AccountSubmitDom, SECOND_STEP_SIGNUP_ROUTE);
  };
  // FIXME  Once this is updated https://github.com/DefinitelyTyped/DefinitelyTyped/blob/master/types/react-dom/test-utils/index.d.ts#L296
  await TestUtils.act(submitForm as any); //eslint-disable-line @typescript-eslint/no-explicit-any
};

export const handlePassPhrase2E = async (page: Page): Promise<void> => {
  const checkbox = await page.$('input[type="checkbox"]');
  expect(checkbox).not.toBeNull();

  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  await checkbox!.click();

  //await sleep(2000);
  const mnemonic = await page.evaluate(
    async (): Promise<string | null> => {
      const element = document.querySelector('p');
      if (!element) {
        return '';
      }

      return element.textContent;
    }
  );

  expect(mnemonic).not.toBeNull();
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  expect(mnemonic!.split(' ').length).toBe(12);

  const buttons = await page.$$('button');
  await buttons[1].click();
  await findRenderedE2EComponentWithId(page, SECURITY_HINT_STEP_SIGNUP_ROUTE);
};

export const handlePassPhrase = async (RecoveryPhraseDom: React.Component): Promise<void> => {
  const inputs = TestUtils.scryRenderedDOMComponentsWithTag(RecoveryPhraseDom, 'input');
  expect(inputs.length).toBe(1);
  const showMnemonic = async (): Promise<void> => {
    TestUtils.Simulate.change(inputs[0], {
      target: { checked: true } as any, //eslint-disable-line @typescript-eslint/no-explicit-any
    });
    await sleep(600);

    const paragraphs = TestUtils.scryRenderedDOMComponentsWithTag(RecoveryPhraseDom, 'p');
    expect(paragraphs.length).toBe(1);
    const phraseParagraph = paragraphs[0].innerHTML;
    expect(phraseParagraph).toBe(PersonaManager.get().mnemonic);
  };
  // FIXME  Once this is updated https://github.com/DefinitelyTyped/DefinitelyTyped/blob/master/types/react-dom/test-utils/index.d.ts#L296
  await TestUtils.act(showMnemonic as any); //eslint-disable-line @typescript-eslint/no-explicit-any

  const buttons = TestUtils.scryRenderedDOMComponentsWithTag(RecoveryPhraseDom, 'button');
  expect(buttons.length).toBe(2);
  const nextButton = buttons[1];
  TestUtils.act(
    (): void => {
      TestUtils.Simulate.click(nextButton);
    }
  );

  await findRenderedDOMComponentWithId(RecoveryPhraseDom, SECURITY_HINT_STEP_SIGNUP_ROUTE);
};

export const handleSecurityHintE2E = async (page: Page, securityHint: string): Promise<void> => {
  await page.type(`input[name="${SECURITY_HINT}"]`, securityHint);

  await page.click('button[type="submit"]');

  //TODO: check for proper redirect here after logic will be implmeneted
  //await findRenderedE2EComponentWithId(page, SECOND_STEP_SIGNUP_ROUTE);
};

export const handleSecurityHint = async (
  SecurityHintDom: React.Component,
  accountName: string
): Promise<void> => {
  // Introduce my hint
  const inputs = TestUtils.scryRenderedDOMComponentsWithTag(SecurityHintDom, 'input');
  expect(inputs.length).toBe(1);
  TestUtils.act(
    (): void => {
      TestUtils.Simulate.change(inputs[0], {
        target: { value: 'Dummy Hint' },
      } as any); //eslint-disable-line @typescript-eslint/no-explicit-any
    }
  );

  const form = TestUtils.findRenderedDOMComponentWithTag(SecurityHintDom, 'form');

  const submitForm = async (): Promise<void> => {
    TestUtils.Simulate.submit(form);
    await sleep(400);
    const hint = getHintPhrase(accountName);
    expect(hint).not.toBe(null);
    expect(hint).toBe('Dummy Hint');
  };
  // FIXME  Once this is updated https://github.com/DefinitelyTyped/DefinitelyTyped/blob/master/types/react-dom/test-utils/index.d.ts#L296
  await TestUtils.act(submitForm as any); //eslint-disable-line @typescript-eslint/no-explicit-any
};
