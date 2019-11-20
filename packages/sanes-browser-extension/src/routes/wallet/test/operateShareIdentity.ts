import TestUtils from "react-dom/test-utils";

import { click, submit } from "../../../utils/test/dom";
import { findRenderedDOMComponentWithId } from "../../../utils/test/reactElemFinder";
import { rejectIdentityHtmlId } from "../components/SidePanel/PanelDrawer/components/Requests/ShowRequest/ShareIdentity/RejectIdentity";
import { showIdentityHtmlId } from "../components/SidePanel/PanelDrawer/components/Requests/ShowRequest/ShareIdentity/ShowIdentity";

export const confirmAcceptButton = async (ShareIdentityDom: React.Component): Promise<void> => {
  const inputs = TestUtils.scryRenderedDOMComponentsWithTag(ShareIdentityDom, "button");

  expect(inputs.length).toBe(5);

  const acceptButton = inputs[3];
  await click(acceptButton);
};

export const clickOnRejectButton = async (ShareIdentityDom: React.Component): Promise<void> => {
  const inputs = TestUtils.scryRenderedDOMComponentsWithTag(ShareIdentityDom, "button");

  expect(inputs.length).toBe(5);

  const rejectButton = inputs[4];

  await click(rejectButton);

  await findRenderedDOMComponentWithId(ShareIdentityDom, rejectIdentityHtmlId);
};

export const confirmRejectButton = async (ShareIdentityDom: React.Component): Promise<void> => {
  const form = TestUtils.findRenderedDOMComponentWithTag(ShareIdentityDom, "form");
  await submit(form);
};

export const checkPermanentRejection = async (ShareIdentityDom: React.Component): Promise<void> => {
  const inputs = TestUtils.scryRenderedDOMComponentsWithTag(ShareIdentityDom, "input");
  expect(inputs.length).toBe(1);

  const doNotShowAgainCheckbox = inputs[0];
  TestUtils.act(() => {
    TestUtils.Simulate.change(doNotShowAgainCheckbox, {
      target: { checked: true } as any,
    });
  });
};

export const clickOnBackButton = async (ShareIdentityDom: React.Component): Promise<void> => {
  const inputs = TestUtils.scryRenderedDOMComponentsWithTag(ShareIdentityDom, "button");

  expect(inputs.length).toBe(5);

  const backButton = inputs[1];

  TestUtils.act(() => {
    TestUtils.Simulate.click(backButton);
  });

  await findRenderedDOMComponentWithId(ShareIdentityDom, showIdentityHtmlId);
};
