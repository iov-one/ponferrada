import { Address } from "@iov/bcp";
import { sleep } from "ui-logic";

import { Request } from "../../extension/background/model/requestsHandler/requestQueueManager";
import { travelToShareIdentity, whenOnNavigatedToRoute } from "../../utils/test/navigation";
import { REQUEST_ROUTE } from "../paths";
import {
  checkPermanentRejection,
  clickOnRejectButton,
  confirmAcceptButton,
  confirmRejectButton,
} from "./test/operateShareIdentity";

const request = {
  id: 1,
  senderUrl: "http://finnex.com",
  reason: "Test get Identities",
  responseData: {
    requestedIdentities: [
      {
        chainName: "Ganache",
        address: "0x873fAA4cdDd5b157e8E5a57e7a5479AFC5d3aaaa" as Address,
      },
    ],
  },
  accept: jest.fn(),
  reject: jest.fn(),
};

const requests: readonly Request[] = [request];

describe("DOM > Feature > Share Identity", (): void => {
  let identityDOM: React.Component;
  let windowCloseCall = false;

  beforeEach(async () => {
    identityDOM = await travelToShareIdentity(requests);
    jest.spyOn(window, "close").mockImplementation(() => {
      windowCloseCall = true;
    });
  }, 60000);

  it("should accept incoming request and  close extension popup", async (): Promise<void> => {
    await confirmAcceptButton(identityDOM);
    expect(windowCloseCall).toBeTruthy();
  }, 60000);

  it("should accept incoming request and redirect to the list of requests", async () => {
    const requests = [request, { id: 2, ...request }];
    identityDOM = await travelToShareIdentity(requests);
    await confirmAcceptButton(identityDOM);
    await whenOnNavigatedToRoute(REQUEST_ROUTE);
  }, 60000);

  it("should reject incoming request and close extension popup", async (): Promise<void> => {
    await clickOnRejectButton(identityDOM);
    await confirmRejectButton(identityDOM);
    // TODO: Check here that share request rejection has been reject successfuly

    expect(windowCloseCall).toBeTruthy();
  }, 60000);

  it("should reject incoming request and redirect to the list of requests", async () => {
    const requests = [request, { id: 2, ...request }];
    identityDOM = await travelToShareIdentity(requests);
    await clickOnRejectButton(identityDOM);
    await confirmRejectButton(identityDOM);
    await whenOnNavigatedToRoute(REQUEST_ROUTE);
  }, 60000);

  it("should reject incoming request permanently and come back", async (): Promise<void> => {
    await clickOnRejectButton(identityDOM);
    await checkPermanentRejection(identityDOM);
    await confirmRejectButton(identityDOM);
    await sleep(2000);
    // rejection flag has been set
  }, 60000);
});
