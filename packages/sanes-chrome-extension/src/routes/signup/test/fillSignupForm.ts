import TestUtils from 'react-dom/test-utils';
import { randomString } from '../../../utils/test/random';
import {
  SECOND_STEP_SIGNUP_ROUTE,
  getMnemonic,
} from '../components/ShowPhraseForm';
import { findRenderedDOMComponentWithId } from '../../../utils/test/reactElemFinder';
import { SECURITY_HINT_STEP_SIGNUP_ROUTE } from '../components/SecurityHintForm';
import { sleep } from '../../../utils/timer';
import { getHintPhrase } from '../../../utils/localstorage/hint';

export const submitAccountForm = async (
  AccountSubmitDom: React.Component,
  accountName: string
): Promise<void> => {
  const inputs = TestUtils.scryRenderedDOMComponentsWithTag(
    AccountSubmitDom,
    'input'
  );

  expect(inputs.length).toBe(3);

  const password = randomString(10);
  const accountNameField = inputs[0];
  const passwordField = inputs[1];
  const passwordConfirmField = inputs[2];

  TestUtils.act(() => {
    TestUtils.Simulate.change(accountNameField, {
      target: {
        value: accountName,
      },
    } as any); //eslint-disable-line @typescript-eslint/no-explicit-any
  });

  TestUtils.act(() => {
    TestUtils.Simulate.change(passwordField, {
      target: { value: password },
    } as any); //eslint-disable-line @typescript-eslint/no-explicit-any
  });

  TestUtils.act(() => {
    TestUtils.Simulate.change(passwordConfirmField, {
      target: { value: password },
    } as any); //eslint-disable-line @typescript-eslint/no-explicit-any
  });

  const form = TestUtils.findRenderedDOMComponentWithTag(
    AccountSubmitDom,
    'form'
  );

  TestUtils.act(() => {
    TestUtils.Simulate.submit(form);
  });

  await findRenderedDOMComponentWithId(
    AccountSubmitDom,
    SECOND_STEP_SIGNUP_ROUTE
  );
};

export const handlePassPhrase = async (
  RecoveryPhraseDom: React.Component
): Promise<void> => {
  const inputs = TestUtils.scryRenderedDOMComponentsWithTag(
    RecoveryPhraseDom,
    'input'
  );
  expect(inputs.length).toBe(1);
  TestUtils.act(() => {
    TestUtils.Simulate.change(inputs[0], {
      target: { checked: true } as any, //eslint-disable-line @typescript-eslint/no-explicit-any
    });
  });

  await sleep(600);

  const paragraphs = TestUtils.scryRenderedDOMComponentsWithTag(
    RecoveryPhraseDom,
    'p'
  );
  expect(inputs.length).toBe(1);
  const phraseParagraph = paragraphs[0].innerHTML;
  expect(phraseParagraph).toBe(await getMnemonic());

  const buttons = TestUtils.scryRenderedDOMComponentsWithTag(
    RecoveryPhraseDom,
    'button'
  );
  expect(buttons.length).toBe(2);
  const nextButton = buttons[1];
  TestUtils.act(() => {
    TestUtils.Simulate.click(nextButton);
  });

  await findRenderedDOMComponentWithId(
    RecoveryPhraseDom,
    SECURITY_HINT_STEP_SIGNUP_ROUTE
  );
};

export const handleSecurityHint = async (
  SecurityHintDom: React.Component,
  accountName: string
): Promise<void> => {
  // Introduce my hint
  const inputs = TestUtils.scryRenderedDOMComponentsWithTag(
    SecurityHintDom,
    'input'
  );
  expect(inputs.length).toBe(1);
  TestUtils.act(() => {
    TestUtils.Simulate.change(inputs[0], {
      target: { value: 'Dummy Hint' },
    } as any); //eslint-disable-line @typescript-eslint/no-explicit-any
  });

  const form = TestUtils.findRenderedDOMComponentWithTag(
    SecurityHintDom,
    'form'
  );

  TestUtils.act(() => {
    TestUtils.Simulate.submit(form);
  });

  await sleep(400);
  const hint = getHintPhrase(accountName);
  expect(hint).not.toBe(null);
  expect(hint).toBe('Dummy Hint');
};
