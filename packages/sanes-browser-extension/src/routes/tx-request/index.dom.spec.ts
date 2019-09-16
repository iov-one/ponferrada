import TestUtils from "react-dom/test-utils";
import { sleep } from "ui-logic";

import { Request } from "../../extension/background/model/requestsHandler/requestQueueManager";
import { click } from "../../utils/test/dom";
import { travelToTXRequest, whenOnNavigatedToRoute } from "../../utils/test/navigation";
import { findRenderedDOMComponentWithId } from "../../utils/test/reactElemFinder";
import { REQUEST_ROUTE } from "../paths";
import { REQ_REGISTER_USERNAME } from "./components/ShowRequest/ReqRegisterUsernameTx";
import { REQ_SEND_TX } from "./components/ShowRequest/ReqSendTransaction";
import { getCashTransaction, getUsernameTransaction } from "./test";
import {
  checkPermanentRejection,
  clickOnBackButton,
  clickOnRejectButton,
  confirmRejectButton,
} from "./test/operateTXRequest";

const sendRequests: readonly Request[] = [
  {
    id: 1,
    senderUrl: "http://finnex.com",
    reason: "Test get Identities",
    responseData: {
      tx: getCashTransaction(),
    },
    accept: jest.fn(),
    reject: jest.fn(),
  },
];

describe("DOM > Feature > Transaction Request", (): void => {
  let identityDOM: React.Component;

  beforeEach(async () => {
    identityDOM = await travelToTXRequest(sendRequests);
  }, 60000);

  it("should accept incoming request and redirect to account status view", async (): Promise<void> => {
    const inputs = TestUtils.scryRenderedDOMComponentsWithTag(identityDOM, "button");

    expect(inputs.length).toBe(2);

    const acceptButton = inputs[0];
    click(acceptButton);

    await whenOnNavigatedToRoute(REQUEST_ROUTE);
  }, 60000);

  it("should reject incoming request and come back", async (): Promise<void> => {
    await clickOnRejectButton(identityDOM);
    await confirmRejectButton(identityDOM);
    // TODO: Check here that share request rejection has been reject successfuly

    /**
     * Remove this code if not required in case if there is another redirection
     * in confirmAcceptButton method. And apply this method in separate test method.
     */
    await clickOnBackButton(identityDOM);
  }, 60000);

  it("should reject incoming request permanently and come back", async (): Promise<void> => {
    await clickOnRejectButton(identityDOM);
    await checkPermanentRejection(identityDOM);
    await confirmRejectButton(identityDOM);
    await sleep(2000);
    // rejection flag has been set
  }, 60000);
});

describe("DOM > Feature > Send Transaction Request", (): void => {
  let identityDOM: React.Component;

  beforeEach(async () => {
    identityDOM = await travelToTXRequest(sendRequests);
  }, 60000);

  it("should show send transaction request accept view", async (): Promise<void> => {
    await findRenderedDOMComponentWithId(identityDOM, REQ_SEND_TX);
  }, 60000);
});

describe("DOM > Feature > Username Registration Request", (): void => {
  const requests: readonly Request[] = [
    {
      id: 1,
      senderUrl: "http://finnex.com",
      reason: "Test username registration",
      responseData: {
        tx: getUsernameTransaction(),
      },
      accept: jest.fn(),
      reject: jest.fn(),
    },
  ];

  let identityDOM: React.Component;

  beforeEach(async () => {
    identityDOM = await travelToTXRequest(requests);
  }, 60000);

  it("should show register username request accept view", async (): Promise<void> => {
    await findRenderedDOMComponentWithId(identityDOM, REQ_REGISTER_USERNAME);
  }, 60000);
});
