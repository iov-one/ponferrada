import TestUtils from "react-dom/test-utils";

import { Request } from "../../extension/background/model/requestsHandler/requestQueueManager";
import { resetHistory } from "../../utils/history";
import { click } from "../../utils/test/dom";
import { travelToRequests, whenOnNavigatedToRoute } from "../../utils/test/navigation";
import { SHARE_IDENTITY, TX_REQUEST, WALLET_STATUS_ROUTE } from "../paths";
import { getCashTransaction } from "../tx-request/test";
import { getFirstRequest, getRequests } from "./test/operateRequests";

describe("DOM > Feature > Requests", () => {
  const REQUEST_ONE: Request = {
    id: 1,
    senderUrl: "www.sender1.com",
    reason: "Reason 1",
    responseData: { requestedIdentities: [] },
    accept: jest.fn(),
    reject: jest.fn(),
  };

  const REQUEST_TWO: Request = {
    id: 2,
    senderUrl: "www.sender2.com",
    reason: "Reason 2",
    responseData: {
      tx: getCashTransaction(),
    },
    accept: jest.fn(),
    reject: jest.fn(),
  };

  let requestsDom: React.Component;
  let backButton: Element;

  beforeEach(async () => {
    resetHistory();
    requestsDom = await travelToRequests([REQUEST_ONE, REQUEST_TWO]);
    backButton = TestUtils.findRenderedDOMComponentWithTag(requestsDom, "button");
  }, 60000);

  it("has a back arrow button that redirects to the Account Status view when clicked", async () => {
    expect(backButton.getAttribute("aria-label")).toBe("Go back");

    click(backButton);
    await whenOnNavigatedToRoute(WALLET_STATUS_ROUTE);
  }, 60000);

  it('has a "Requests" list that shows all pending requests', async () => {
    expect(getRequests(requestsDom).length).toBe(2);
  }, 60000);

  it('redirects to the Share Identity view when a Request of type "getIdentities" is clicked', async () => {
    const identityRequest = getFirstRequest(requestsDom);
    click(identityRequest);
    await whenOnNavigatedToRoute(SHARE_IDENTITY);
  }, 60000);

  it('redirects to the TX Request view when a Request of type "signAndPost" is clicked', async () => {
    resetHistory();
    requestsDom = await travelToRequests([REQUEST_TWO, REQUEST_ONE]);
    const txRequest = getFirstRequest(requestsDom);

    click(txRequest);
    await whenOnNavigatedToRoute(TX_REQUEST);
  }, 60000);
});
