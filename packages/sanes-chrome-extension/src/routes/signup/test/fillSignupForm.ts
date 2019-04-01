import TestUtils from 'react-dom/test-utils';
import { randomString } from '../../../utils/test/random';
import { SECOND_STEP_SIGNUP_ROUTE } from '../components/ShowPhraseForm';
import { findRenderedDOMComponentWithId } from '../../../utils/test/reactElemFinder';
import { SECURITY_HINT_STEP_SIGNUP_ROUTE } from '../components/SecurityHintForm';

export const submitAccountForm = async (
  AccountSubmitDom: React.Component
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
        value: randomString(10),
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

export const continueToSecurityHintForm = async (
  RecoveryPhraseDom: React.Component
): Promise<void> => {
  const nextButton = await findRenderedDOMComponentWithId(
    RecoveryPhraseDom,
    'continue-to-hint-button'
  );

  TestUtils.act(() => {
    TestUtils.Simulate.click(nextButton);
  });

  await findRenderedDOMComponentWithId(
    RecoveryPhraseDom,
    SECURITY_HINT_STEP_SIGNUP_ROUTE
  );
};
