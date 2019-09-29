import TestUtils from "react-dom/test-utils";

import { click, submit } from "../../../utils/test/dom";
import { findRenderedDOMComponentWithId } from "../../../utils/test/reactElemFinder";
import { TX_REQUEST_REJECT } from "../components/RejectRequest";
import { TX_REQUEST_SHOW } from "../components/ShowRequest";

export const confirmAcceptButton = async (TXRequestDom: React.Component): Promise<void> => {
  const inputs = TestUtils.scryRenderedDOMComponentsWithTag(TXRequestDom, "button");

  expect(inputs.length).toBe(2);

  const acceptButton = inputs[0];
  await click(acceptButton);
};

export const clickOnRejectButton = async (TXRequestDom: React.Component): Promise<void> => {
  const inputs = TestUtils.scryRenderedDOMComponentsWithTag(TXRequestDom, "button");

  expect(inputs.length).toBe(2);

  const rejectButton = inputs[1];

  await click(rejectButton);

  await findRenderedDOMComponentWithId(TXRequestDom, TX_REQUEST_REJECT);
};

export const confirmRejectButton = async (TXRequestDom: React.Component): Promise<void> => {
  const form = TestUtils.findRenderedDOMComponentWithTag(TXRequestDom, "form");
  await submit(form);
};

export const checkPermanentRejection = (TXRequestDom: React.Component): void => {
  const inputs = TestUtils.scryRenderedDOMComponentsWithTag(TXRequestDom, "input");
  expect(inputs.length).toBe(1);

  const rejectPermanentlyCheckbox = inputs[0];
  TestUtils.act(() => {
    TestUtils.Simulate.change(rejectPermanentlyCheckbox, {
      target: { checked: true } as any,
    });
  });
};

export const clickOnBackButton = async (TXRequestDom: React.Component): Promise<void> => {
  const inputs = TestUtils.scryRenderedDOMComponentsWithTag(TXRequestDom, "button");

  expect(inputs.length).toBe(2);

  const backButton = inputs[1];
  expect(backButton.getAttribute("aria-label")).toBe("Go back");

  TestUtils.act(() => {
    TestUtils.Simulate.click(backButton);
  });

  await findRenderedDOMComponentWithId(TXRequestDom, TX_REQUEST_SHOW);
};

export const getProposalStartDate = (TXRequestDom: React.Component): string | null => {
  const values = TestUtils.scryRenderedDOMComponentsWithClass(TXRequestDom, "MuiListItemText-secondary");

  return values[2].textContent;
};
