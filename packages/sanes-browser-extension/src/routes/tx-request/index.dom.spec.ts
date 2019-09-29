import { sleep } from "ui-logic";

import { Request } from "../../extension/background/model/requestsHandler/requestQueueManager";
import { travelToTXRequest, whenOnNavigatedToRoute } from "../../utils/test/navigation";
import { findRenderedDOMComponentWithId } from "../../utils/test/reactElemFinder";
import { REQUEST_ROUTE } from "../paths";
import { REQ_REGISTER_USERNAME } from "./components/ShowRequest/ReqRegisterUsernameTx";
import { REQ_SEND_TX } from "./components/ShowRequest/ReqSendTransaction";
import { getCashTransaction, getCreateTextResolutionActionTransaction, getUsernameTransaction } from "./test";
import {
  checkPermanentRejection,
  clickOnRejectButton,
  confirmAcceptButton,
  confirmRejectButton,
  getProposalStartDate,
} from "./test/operateTXRequest";

const requests: Request[] = [];

const request = {
  id: 1,
  senderUrl: "http://finnex.com",
  reason: "Test get Identities",
  responseData: {
    tx: getCashTransaction(),
  },
  accept: () => requests.pop(),
  reject: () => requests.pop(),
};

describe("DOM > Feature > Transaction Request", () => {
  let txRequestDOM: React.Component;
  let windowCloseCall = false;

  beforeEach(async () => {
    requests.length = 0;
    requests.push(request);
    windowCloseCall = false;
    txRequestDOM = await travelToTXRequest(requests);
    jest.spyOn(window, "close").mockImplementation(() => {
      windowCloseCall = true;
    });
  }, 60000);

  it("should accept incoming request and close extension popup", async () => {
    await confirmAcceptButton(txRequestDOM);
    expect(windowCloseCall).toBeTruthy();
  }, 60000);

  it("should accept incoming request and redirect to the list of requests", async () => {
    requests.push({ id: 2, ...request });
    txRequestDOM = await travelToTXRequest(requests);
    await confirmAcceptButton(txRequestDOM);
    await whenOnNavigatedToRoute(REQUEST_ROUTE);
  }, 60000);

  it("should reject incoming request and close extension popup", async () => {
    await clickOnRejectButton(txRequestDOM);
    await confirmRejectButton(txRequestDOM);

    // TODO: Check here that share request rejection has been reject successfuly

    expect(windowCloseCall).toBeTruthy();
  }, 60000);

  it("should reject incoming request and redirect to the list of requests", async () => {
    requests.push({ id: 2, ...request });
    txRequestDOM = await travelToTXRequest(requests);
    await clickOnRejectButton(txRequestDOM);
    await confirmRejectButton(txRequestDOM);
    await whenOnNavigatedToRoute(REQUEST_ROUTE);
  }, 60000);

  it("should reject incoming request permanently and come back", async () => {
    await clickOnRejectButton(txRequestDOM);
    checkPermanentRejection(txRequestDOM);
    confirmRejectButton(txRequestDOM);
    await sleep(2000);
    // rejection flag has been set
  }, 60000);
});

describe("DOM > Feature > Send Transaction Request", () => {
  let txRequestDOM: React.Component;

  beforeEach(async () => {
    requests.length = 0;
    requests.push(request);
    txRequestDOM = await travelToTXRequest(requests);
  }, 60000);

  it("should show send transaction request accept view", async () => {
    await findRenderedDOMComponentWithId(txRequestDOM, REQ_SEND_TX);
  }, 60000);
});

describe("DOM > Feature > Username Registration Request", () => {
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

  let txRequestDOM: React.Component;

  beforeEach(async () => {
    txRequestDOM = await travelToTXRequest(requests);
  }, 60000);

  it("should show register username request accept view", async () => {
    await findRenderedDOMComponentWithId(txRequestDOM, REQ_REGISTER_USERNAME);
  }, 60000);
});

describe("DOM > Feature > Create Proposal Request", () => {
  const requests: readonly Request[] = [
    {
      id: 1,
      senderUrl: "http://finnex.com",
      reason: "Test Create Proposal Request",
      responseData: {
        tx: getCreateTextResolutionActionTransaction(),
      },
      accept: jest.fn(),
      reject: jest.fn(),
    },
  ];

  let txRequestDOM: React.Component;

  beforeEach(async () => {
    txRequestDOM = await travelToTXRequest(requests);
  }, 60000);

  it("should show proper propsal start date", () => {
    const proposalStartDate = getProposalStartDate(txRequestDOM);
    expect(proposalStartDate).toBe("8/21/2019, 10:28:21 AM");
  }, 60000);
});
