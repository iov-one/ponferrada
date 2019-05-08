import TestUtils from 'react-dom/test-utils';
import { findRenderedDOMComponentWithId } from '../../../utils/test/reactElemFinder';
import { SHARE_IDENTITY_ACCEPT } from '../components/AcceptRequest';
import { SHARE_IDENTITY_SHOW } from '../components/ShowRequest';
import { SHARE_IDENTITY_REJECT } from '../components/RejectRequest';

export const clickOnAcceptButton = async (ShareIdentityDom: React.Component): Promise<void> => {
  const inputs = TestUtils.scryRenderedDOMComponentsWithTag(ShareIdentityDom, 'button');

  expect(inputs.length).toBe(2);

  const acceptButton = inputs[0];

  TestUtils.act(
    (): void => {
      TestUtils.Simulate.click(acceptButton);
    }
  );

  await findRenderedDOMComponentWithId(ShareIdentityDom, SHARE_IDENTITY_ACCEPT);
};

export const clickOnRejectButton = async (ShareIdentityDom: React.Component): Promise<void> => {
  const inputs = TestUtils.scryRenderedDOMComponentsWithTag(ShareIdentityDom, 'button');

  expect(inputs.length).toBe(2);

  const rejectButton = inputs[1];

  TestUtils.act(
    (): void => {
      TestUtils.Simulate.click(rejectButton);
    }
  );

  await findRenderedDOMComponentWithId(ShareIdentityDom, SHARE_IDENTITY_REJECT);
};

export const confirmSelectionButton = async (ShareIdentityDom: React.Component): Promise<void> => {
  const inputs = TestUtils.scryRenderedDOMComponentsWithTag(ShareIdentityDom, 'button');

  expect(inputs.length).toBe(2);

  const confirmButton = inputs[0];

  TestUtils.act(
    (): void => {
      TestUtils.Simulate.click(confirmButton);
    }
  );
};

export const checkPermanentRejection = async (ShareIdentityDom: React.Component): Promise<void> => {
  const inputs = TestUtils.scryRenderedDOMComponentsWithTag(ShareIdentityDom, 'input');
  expect(inputs.length).toBe(1);

  const doNotShowAgainCheckbox = inputs[0];
  TestUtils.act(
    (): void => {
      TestUtils.Simulate.change(doNotShowAgainCheckbox, {
        target: { checked: true } as any, //eslint-disable-line @typescript-eslint/no-explicit-any
      });
    }
  );
};

export const clickOnBackButton = async (ShareIdentityDom: React.Component): Promise<void> => {
  const inputs = TestUtils.scryRenderedDOMComponentsWithTag(ShareIdentityDom, 'button');

  expect(inputs.length).toBe(2);

  const backButton = inputs[1];

  TestUtils.act(
    (): void => {
      TestUtils.Simulate.click(backButton);
    }
  );

  await findRenderedDOMComponentWithId(ShareIdentityDom, SHARE_IDENTITY_SHOW);
};
