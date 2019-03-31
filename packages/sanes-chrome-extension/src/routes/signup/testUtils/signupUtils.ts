import TestUtils from 'react-dom/test-utils';
import { Store } from 'redux';
import { SIGNUP_ROUTE } from '../../paths';
import { createDom } from '../../../utils/test/dom';
import { history } from '../../../store/reducers';
import { whenOnNavigatedToRoute } from '../../../utils/test/navigation';
import { randomString } from '../../../utils/testhelper';
import { sleep } from '../../../utils/timer';

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

  await sleep(1500);
};

export const travelToSignup = async (
  store: Store
): Promise<React.Component> => {
  const dom = createDom(store);
  TestUtils.act(() => {
    history.push(SIGNUP_ROUTE);
  });
  await whenOnNavigatedToRoute(store, SIGNUP_ROUTE);

  return dom;
};
