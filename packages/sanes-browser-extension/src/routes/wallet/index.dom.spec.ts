import { Address, ChainId } from "@iov/bcp";
import TestUtils, {
  findRenderedDOMComponentWithTag,
  scryRenderedDOMComponentsWithTag,
} from "react-dom/test-utils";
import { randomString } from "ui-logic";

import { PersonaAcccount } from "../../extension/background/model/persona";
import {
  mockClearDatabase,
  mockClearPersona,
  mockClearPersonaWithException,
  mockPersonaResponse,
} from "../../extension/background/model/persona/test/persona";
import { Request } from "../../extension/background/model/requestsHandler/requestQueueManager";
import { resetHistory } from "../../utils/history";
import { click, input, submit } from "../../utils/test/dom";
import { travelTo, travelToWallet, whenOnNavigatedToRoute } from "../../utils/test/navigation";
import { findRenderedDOMComponentWithId } from "../../utils/test/reactElemFinder";
import { withChainsDescribe } from "../../utils/test/testExecutor";
import { SUPPORT_CENTER_URL, TERMS_URL, WALLET_STATUS_ROUTE, WELCOME_ROUTE } from "../paths";
import { Views } from "./components/SidePanel/PanelDrawer";
import { showIdentityHtmlId } from "./components/SidePanel/PanelDrawer/components/Requests/ShowRequest/ShareIdentity/ShowIdentity";
import { showTxHtmlId } from "./components/SidePanel/PanelDrawer/components/Requests/ShowRequest/SignAndPostTx/ShowTx";
import { REQ_REGISTER_USERNAME } from "./components/SidePanel/PanelDrawer/components/Requests/ShowRequest/SignAndPostTx/ShowTx/ReqRegisterUsernameTx";
import { REQ_SEND_TX } from "./components/SidePanel/PanelDrawer/components/Requests/ShowRequest/SignAndPostTx/ShowTx/ReqSendTransaction";
import { REQ_UPDATE_TARGETS_USERNAME } from "./components/SidePanel/PanelDrawer/components/Requests/ShowRequest/SignAndPostTx/ShowTx/ReqUpdateTargetsOfUsernameTx";
import { getMnemonicValidity, isButtonDisabled } from "./test/operateDeleteWallet";
import {
  goToAbout,
  goToDeleteWallet,
  goToNetworks,
  goToRecoveryWords,
  goToSettings,
  logOut,
} from "./test/operateDrawer";
import { getRenderedMnemonic, submitPasswordForm } from "./test/operateRecoveryWords";
import { getFirstRequest, getRequests } from "./test/operateRequests";
import {
  checkPermanentRejection as checkPermanentRejectionId,
  clickOnRejectButton as clickOnRejectButtonId,
  confirmAcceptButton as confirmAcceptButtonId,
  confirmRejectButton as confirmRejectButtonId,
} from "./test/operateShareIdentity";
import {
  checkPermanentRejection as checkPermanentRejectionTx,
  clickOnRejectButton as clickOnRejectButtonTx,
  confirmApproveButton as confirmAcceptButtonTx,
  confirmRejectButton as confirmRejectButtonTx,
  getCashTransaction,
  getCreateTextResolutionActionTransaction,
  getProposalStartDate,
  getUpdateUsernameTargetsTransaction,
  getUsernameTransaction,
} from "./test/operateTXRequest";

const mnemonic = "badge cattle stool execute involve main mirror envelope brave scrap involve simple";

const connectedChains = [
  "local-iov-devnet" as ChainId,
  "lisk-198f2b61a8" as ChainId,
  "ethereum-eip155-5777" as ChainId,
];

const ACCOUNT = "Account 0";
const accountMock: PersonaAcccount = {
  label: ACCOUNT,
  iovAddress: "tiov1dcg3fat5zrvw00xezzjk3jgedm7pg70y222af3" as Address,
};

const personaMock = mockPersonaResponse(mnemonic, connectedChains, [accountMock], [], []);

const requests: Request[] = [];

const requestOne: Request = {
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
  accept: () => requests.pop(),
  reject: () => requests.pop(),
};

const requestTwo: Request = {
  id: 2,
  senderUrl: "http://finnex.com",
  reason: "Test sign and post",
  responseData: {
    tx: getCashTransaction(),
  },
  accept: () => requests.pop(),
  reject: () => requests.pop(),
};

withChainsDescribe("DOM > Feature > Wallet Status Drawer", () => {
  let walletStatusDom: React.Component;

  beforeEach(async () => {
    walletStatusDom = await travelToWallet(personaMock);
  }, 60000);

  it("lists networks", async () => {
    await goToNetworks(walletStatusDom);

    const liElements = scryRenderedDOMComponentsWithTag(walletStatusDom, "li");
    const liskNetwork = liElements[4];
    expect(liskNetwork.textContent).toBe("Starname Networkhttp://localhost:23456/");
  }, 60000);

  it("settings view has link to support center", async () => {
    await goToSettings(walletStatusDom);

    const termsLink = findRenderedDOMComponentWithTag(walletStatusDom, "a");
    expect(termsLink.getAttribute("href")).toBe(TERMS_URL);
  }, 60000);

  it("about view has link to support center", async () => {
    await goToAbout(walletStatusDom);

    const supportLink = findRenderedDOMComponentWithTag(walletStatusDom, "a");
    expect(supportLink.getAttribute("href")).toBe(SUPPORT_CENTER_URL);
  }, 60000);

  it("can log out from the menu", async () => {
    mockClearPersona();
    await logOut(walletStatusDom);
  }, 60000);
});

describe("DOM > Feature > Wallet Status Drawer > Requests", () => {
  let requestsDom: React.Component;

  beforeEach(async () => {
    resetHistory();
    requestsDom = await travelTo(WALLET_STATUS_ROUTE, [requestOne, requestTwo], personaMock);
  }, 60000);

  it('has a "Requests" list that shows all pending requests', async () => {
    expect(getRequests(requestsDom).length).toBe(2);
  }, 60000);

  it('redirects to the Share Identity view when a Request of type "getIdentities" is clicked', async () => {
    const identityRequest = getFirstRequest(requestsDom);
    click(identityRequest);
    await findRenderedDOMComponentWithId(requestsDom, showIdentityHtmlId);
  }, 60000);

  it('redirects to the TX Request view when a Request of type "signAndPost" is clicked', async () => {
    resetHistory();
    requestsDom = await travelTo(WALLET_STATUS_ROUTE, [requestTwo, requestOne], personaMock);
    const txRequest = getFirstRequest(requestsDom);

    click(txRequest);
    await findRenderedDOMComponentWithId(requestsDom, showTxHtmlId);
  }, 60000);
});

describe("DOM > Feature > Wallet Status Drawer > Show Share Identity", () => {
  let identityDOM: React.Component;
  let windowClose: () => void;

  beforeEach(async () => {
    windowClose = window.close;
    requests.length = 0;
    requests.push(requestOne);

    identityDOM = await travelTo(WALLET_STATUS_ROUTE, requests, personaMock);
    await click(getFirstRequest(identityDOM));
    await findRenderedDOMComponentWithId(identityDOM, showIdentityHtmlId);

    jest.spyOn(window, "close").mockImplementation(() => {});
  }, 60000);

  afterEach(() => {
    window.close = windowClose;
  });

  it("should accept incoming request and close extension popup", async () => {
    await confirmAcceptButtonId(identityDOM);
    expect(window.close).toBeCalled();
  }, 60000);

  it("should accept incoming request and redirect to the list of requests", async () => {
    requests.push(requestTwo);

    identityDOM = await travelTo(WALLET_STATUS_ROUTE, requests, personaMock);
    await click(getFirstRequest(identityDOM));
    await findRenderedDOMComponentWithId(identityDOM, showIdentityHtmlId);

    await confirmAcceptButtonId(identityDOM);
    await findRenderedDOMComponentWithId(identityDOM, Views.Requests);
    expect(window.close).not.toBeCalled();
  }, 60000);

  it("should reject incoming request and close extension popup", async () => {
    await clickOnRejectButtonId(identityDOM);
    await confirmRejectButtonId(identityDOM);
    // TODO: Check here that share request rejection has been reject successfuly
    expect(window.close).toBeCalled();
  }, 60000);

  it("should reject incoming request and redirect to the list of requests", async () => {
    requests.push(requestTwo);

    identityDOM = await travelTo(WALLET_STATUS_ROUTE, requests, personaMock);
    await click(getFirstRequest(identityDOM));
    await findRenderedDOMComponentWithId(identityDOM, showIdentityHtmlId);

    await clickOnRejectButtonId(identityDOM);
    await confirmRejectButtonId(identityDOM);
    await findRenderedDOMComponentWithId(identityDOM, Views.Requests);
    expect(window.close).not.toBeCalled();
  }, 60000);

  it("should reject incoming request permanently and come back", async () => {
    requests.push(requestTwo);

    identityDOM = await travelTo(WALLET_STATUS_ROUTE, requests, personaMock);
    await click(getFirstRequest(identityDOM));
    await findRenderedDOMComponentWithId(identityDOM, showIdentityHtmlId);

    await clickOnRejectButtonId(identityDOM);
    await checkPermanentRejectionId(identityDOM);
    await confirmRejectButtonId(identityDOM);
    await findRenderedDOMComponentWithId(identityDOM, Views.Requests);
    expect(window.close).not.toBeCalled();
  }, 60000);
});

describe("DOM > Feature > Wallet Status Drawer > Show TX", () => {
  let txRequestDOM: React.Component;
  let windowClose: () => void;

  beforeEach(async () => {
    windowClose = window.close;
    requests.length = 0;
    requests.push(requestTwo);

    txRequestDOM = await travelTo(WALLET_STATUS_ROUTE, requests, personaMock);
    await click(getFirstRequest(txRequestDOM));
    await findRenderedDOMComponentWithId(txRequestDOM, showTxHtmlId);

    jest.spyOn(window, "close").mockImplementation(() => {});
  }, 60000);

  afterEach(() => {
    window.close = windowClose;
  });

  it("should accept incoming request and close extension popup", async () => {
    await confirmAcceptButtonTx(txRequestDOM);
    expect(window.close).toBeCalled();
  }, 60000);

  it("should accept incoming request and redirect to the list of requests", async () => {
    requests.push({ id: 3, ...requestOne });

    txRequestDOM = await travelTo(WALLET_STATUS_ROUTE, requests, personaMock);
    await click(getFirstRequest(txRequestDOM));
    await findRenderedDOMComponentWithId(txRequestDOM, showTxHtmlId);

    await confirmAcceptButtonTx(txRequestDOM);
    await findRenderedDOMComponentWithId(txRequestDOM, Views.Requests);
    expect(window.close).not.toBeCalled();
  }, 60000);

  it("should reject incoming request and close extension popup", async () => {
    await clickOnRejectButtonTx(txRequestDOM);
    await confirmRejectButtonTx(txRequestDOM);
    // TODO: Check here that share request rejection has been reject successfuly

    expect(window.close).toBeCalled();
  }, 60000);

  it("should reject incoming request and redirect to the list of requests", async () => {
    requests.push({ id: 3, ...requestOne });

    txRequestDOM = await travelTo(WALLET_STATUS_ROUTE, requests, personaMock);
    await click(getFirstRequest(txRequestDOM));
    await findRenderedDOMComponentWithId(txRequestDOM, showTxHtmlId);

    await clickOnRejectButtonTx(txRequestDOM);
    await confirmRejectButtonTx(txRequestDOM);
    await findRenderedDOMComponentWithId(txRequestDOM, Views.Requests);
    expect(window.close).not.toBeCalled();
  }, 60000);

  it("should reject incoming request permanently and come back", async () => {
    requests.push({ id: 3, ...requestOne });

    txRequestDOM = await travelTo(WALLET_STATUS_ROUTE, requests, personaMock);
    await click(getFirstRequest(txRequestDOM));
    await findRenderedDOMComponentWithId(txRequestDOM, showTxHtmlId);

    await clickOnRejectButtonTx(txRequestDOM);
    checkPermanentRejectionTx(txRequestDOM);
    await confirmRejectButtonTx(txRequestDOM);
    await findRenderedDOMComponentWithId(txRequestDOM, Views.Requests);
    expect(window.close).not.toBeCalled();
    // rejection flag has been set
  }, 60000);
});

describe("DOM > Feature > Wallet Status Drawer > Send Transaction Request", () => {
  let txRequestDOM: React.Component;

  beforeEach(async () => {
    requests.length = 0;
    requests.push(requestTwo);
    txRequestDOM = await travelTo(WALLET_STATUS_ROUTE, requests, personaMock);
    await click(getFirstRequest(txRequestDOM));
  }, 60000);

  it("should show send transaction request accept view", async () => {
    await findRenderedDOMComponentWithId(txRequestDOM, REQ_SEND_TX);
  }, 60000);
});

describe("DOM > Feature > Wallet Status Drawer > Username Registration Request", () => {
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
    txRequestDOM = await travelTo(WALLET_STATUS_ROUTE, requests, personaMock);
    await click(getFirstRequest(txRequestDOM));
  }, 60000);

  it("should show register username request accept view", async () => {
    await findRenderedDOMComponentWithId(txRequestDOM, REQ_REGISTER_USERNAME);
  }, 60000);
});

describe("DOM > Feature > Wallet Status Drawer > Username Targets Update Request", () => {
  const requests: readonly Request[] = [
    {
      id: 1,
      senderUrl: "http://finnex.com",
      reason: "Test username targets update",
      responseData: {
        tx: getUpdateUsernameTargetsTransaction(),
      },
      accept: jest.fn(),
      reject: jest.fn(),
    },
  ];

  let txRequestDOM: React.Component;

  beforeEach(async () => {
    txRequestDOM = await travelTo(WALLET_STATUS_ROUTE, requests, personaMock);
    await click(getFirstRequest(txRequestDOM));
  }, 60000);

  it("should show update username targets request accept view", async () => {
    await findRenderedDOMComponentWithId(txRequestDOM, REQ_UPDATE_TARGETS_USERNAME);
  }, 60000);
});

describe("DOM > Feature > Wallet Status Drawer > Create Proposal Request", () => {
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
    txRequestDOM = await travelTo(WALLET_STATUS_ROUTE, requests, personaMock);
    await click(getFirstRequest(txRequestDOM));
  }, 60000);

  it("should show proper propsal start date", () => {
    const proposalStartDate = getProposalStartDate(txRequestDOM);
    expect(proposalStartDate).toBe("8/21/2019, 10:28:21 AM");
  }, 60000);
});

withChainsDescribe("DOM > Feature > Wallet Status Drawer > Recovery Words", () => {
  it("shows the mnemonic for the current Persona", async () => {
    const recoveryWordsDom = await travelToWallet(personaMock);
    await goToRecoveryWords(recoveryWordsDom);
    await submitPasswordForm(recoveryWordsDom);
    expect(getRenderedMnemonic(recoveryWordsDom).textContent).toBe(mnemonic);
  }, 60000);
});

withChainsDescribe("DOM > Feature > Wallet Status Drawer > Delete Wallet", () => {
  let deleteWalletDom: React.Component;
  let buttons: Element[];
  let mnemonicInput: Element;
  let form: Element;
  const mnemonic = "badge cattle stool execute involve main mirror envelope brave scrap involve simple";

  beforeEach(async () => {
    deleteWalletDom = await travelToWallet(personaMock);
    await goToDeleteWallet(deleteWalletDom);
    buttons = TestUtils.scryRenderedDOMComponentsWithTag(deleteWalletDom, "button");
    mnemonicInput = TestUtils.findRenderedDOMComponentWithTag(deleteWalletDom, "textarea");
    form = TestUtils.findRenderedDOMComponentWithTag(deleteWalletDom, "form");
  }, 60000);

  it('has a valid "Recovery words" input', async () => {
    expect(mnemonicInput.getAttribute("placeholder")).toBe("Enter your recovery words here");

    await submit(form);
    expect(getMnemonicValidity(deleteWalletDom).textContent).toBe("Required");

    input(mnemonicInput, randomString(10));
    await submit(form);
    expect(getMnemonicValidity(deleteWalletDom).textContent).toBe(
      "Wrong mnemonic entered, please try again.",
    );

    input(mnemonicInput, mnemonic);
    expect(getMnemonicValidity(deleteWalletDom)).toBeUndefined();
  }, 60000);

  it('has a valid "Delete" button that redirects to the Wallet Status view if deleted successfuly when clicked', async () => {
    mockClearPersona();
    mockClearDatabase();

    const deleteButton = buttons.find(button => button.textContent === "Delete Wallet");
    if (!deleteButton) throw Error("Delete Wallet button not found");

    expect(isButtonDisabled(deleteButton)).toBeTruthy();

    input(mnemonicInput, randomString(10));
    expect(isButtonDisabled(deleteButton)).toBeTruthy();

    input(mnemonicInput, mnemonic);
    await submit(mnemonicInput);
    await whenOnNavigatedToRoute(WELCOME_ROUTE);
  }, 60000);

  it('shows "An error has occurred during deleting wallet" toast message if wallet deletion unsuccessful', async () => {
    mockClearPersonaWithException();
    input(mnemonicInput, mnemonic);
    await submit(form);
    const toast = (await findRenderedDOMComponentWithId(deleteWalletDom, "toast-provider")) as Element;
    expect(toast.textContent).toBe("An error has occurred during deleting wallet");
  }, 60000);
});
