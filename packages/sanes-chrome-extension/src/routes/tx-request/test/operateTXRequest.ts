import TestUtils from 'react-dom/test-utils';
import { findRenderedDOMComponentWithId } from '../../../utils/test/reactElemFinder';
import { TX_REQUEST_SHOW } from '../components/ShowRequest';
import { TX_REQUEST_REJECT } from '../components/RejectRequest';

export const clickOnRejectButton = async (TXRequestDom: React.Component): Promise<void> => {
  const inputs = TestUtils.scryRenderedDOMComponentsWithTag(TXRequestDom, 'button');

  expect(inputs.length).toBe(2);

  const rejectButton = inputs[1];

  TestUtils.act(() => {
    TestUtils.Simulate.click(rejectButton);
  });

  await findRenderedDOMComponentWithId(TXRequestDom, TX_REQUEST_REJECT);
};

export const confirmRejectButton = async (TXRequestDom: React.Component): Promise<void> => {
  const inputs = TestUtils.scryRenderedDOMComponentsWithTag(TXRequestDom, 'button');

  expect(inputs.length).toBe(2);

  const rejectButton = inputs[0];

  TestUtils.act(() => {
    TestUtils.Simulate.click(rejectButton);
  });
};

export const checkPermanentRejection = async (TXRequestDom: React.Component): Promise<void> => {
  const inputs = TestUtils.scryRenderedDOMComponentsWithTag(TXRequestDom, 'input');
  expect(inputs.length).toBe(1);

  const rejectPermanentlyCheckbox = inputs[0];
  TestUtils.act(() => {
    TestUtils.Simulate.change(rejectPermanentlyCheckbox, {
      target: { checked: true } as any, //eslint-disable-line @typescript-eslint/no-explicit-any
    });
  });
};

export const clickOnBackButton = async (TXRequestDom: React.Component): Promise<void> => {
  const inputs = TestUtils.scryRenderedDOMComponentsWithTag(TXRequestDom, 'button');

  expect(inputs.length).toBe(2);

  const backButton = inputs[1];
  expect(backButton.getAttribute('aria-label')).toBe('Go back');

  TestUtils.act(() => {
    TestUtils.Simulate.click(backButton);
  });

  await findRenderedDOMComponentWithId(TXRequestDom, TX_REQUEST_SHOW);
};
