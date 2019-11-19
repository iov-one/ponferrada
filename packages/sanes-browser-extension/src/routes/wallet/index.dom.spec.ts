import {
  Address,
  Algorithm,
  ChainId,
  Identity,
  PubkeyBytes,
  SendTransaction,
  TokenTicker,
  WithCreator,
} from "@iov/bcp";
import { RegisterUsernameTx } from "@iov/bns";
import { Encoding, TransactionEncoder } from "@iov/encoding";
import { ethereumCodec } from "@iov/ethereum";
import { JsonRpcSuccessResponse, parseJsonRpcResponse } from "@iov/jsonrpc";
import TestUtils, {
  findRenderedDOMComponentWithTag,
  scryRenderedDOMComponentsWithTag,
} from "react-dom/test-utils";
import { randomString, sleep } from "ui-logic";

import Backgroundscript, { IovWindowExtension } from "../../extension/background/model/backgroundscript";
import { Persona, PersonaAcccount, ProcessedTx } from "../../extension/background/model/persona";
import {
  mockClearDatabase,
  mockClearPersona,
  mockClearPersonaWithException,
  mockPersonaResponse,
} from "../../extension/background/model/persona/test/persona";
import { Request } from "../../extension/background/model/requestsHandler/requestQueueManager";
import {
  buildGetIdentitiesRequest,
  generateSignAndPostRequest,
  isArrayOfIdentity,
} from "../../extension/background/model/requestsHandler/test/requestBuilder";
import * as txsUpdater from "../../extension/background/updaters/appUpdater";
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
  confirmAcceptButton as confirmAcceptButtonTx,
  confirmRejectButton as confirmRejectButtonTx,
  getCashTransaction,
  getCreateTextResolutionActionTransaction,
  getProposalStartDate,
  getUsernameTransaction,
} from "./test/operateTXRequest";
import { checkCreateAccount, getTransactionsCount } from "./test/operateWallet";

const ACCOUNT = "Account 0";
const accountMock: PersonaAcccount = { label: ACCOUNT };
const mnemonic = "badge cattle stool execute involve main mirror envelope brave scrap involve simple";

const defaultCreator: Identity = {
  chainId: "foobar" as ChainId,
  pubkey: {
    algo: Algorithm.Secp256k1,
    // Random Ethereum pubkey. Derived address: 0x7c15484EA11FD233AE566469af15d84335023c30
    data: Encoding.fromHex(
      "0434ce248a6a5979c04d75d1a75907b2bec1cb4d4f6e17b76521f0925e8b6b40e00711fe98e789cf5c8317cf1e731b3101e9dbfaba5e351e424e45c9a2f4dfb63c",
    ) as PubkeyBytes,
  },
};
const sendTx: SendTransaction & WithCreator = {
  kind: "bcp/send",
  amount: { quantity: "10", fractionalDigits: 3, tokenTicker: "ETH" as TokenTicker },
  creator: defaultCreator,
  sender: ethereumCodec.identityToAddress(defaultCreator),
  fee: {
    gasLimit: "12345678",
    gasPrice: { quantity: "20000000000", fractionalDigits: 18, tokenTicker: "ETH" as TokenTicker },
  },
  memo: "A little donation",
  recipient: "0x1212121212121212121212121212121212121212" as Address,
};

const username = "test*iov";
const usernameTx: RegisterUsernameTx & WithCreator = {
  kind: "bns/register_username",
  creator: defaultCreator,
  fee: {
    gasLimit: "12345678",
    gasPrice: { quantity: "20000000000", fractionalDigits: 18, tokenTicker: "ETH" as TokenTicker },
  },
  username,
  targets: [
    { chainId: "foobar" as ChainId, address: "tiov1k898u78hgs36uqw68dg7va5nfkgstu5z0fhz3f" as Address },
  ],
};

const txMock: ProcessedTx = {
  id: "111",
  signer: "Example Signer",
  creator: ethereumCodec.identityToAddress(defaultCreator),
  time: "Sat May 25 10:10:00 2019 +0200",
  blockExplorerUrl: "www.blockexplorer.com",
  error: null,
  original: sendTx,
};
const usernameMock: ProcessedTx = {
  id: "112",
  signer: "Example Signer",
  creator: ethereumCodec.identityToAddress(defaultCreator),
  time: "Sat May 25 10:10:00 2019 +0200",
  blockExplorerUrl: "www.blockexplorer.com",
  error: null,
  original: usernameTx,
};
const personaMock = mockPersonaResponse([accountMock], mnemonic, [txMock, usernameMock]);

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

describe("DOM > Feature > Wallet Status", () => {
  let walletStatusDom: React.Component;

  beforeEach(async () => {
    walletStatusDom = await travelToWallet(personaMock);
  }, 60000);

  it("has a select dropdown that enables the creation and selection of accounts", async () => {
    const accountInput = TestUtils.findRenderedDOMComponentWithTag(walletStatusDom, "input");
    expect(accountInput.getAttribute("value")).toBe(ACCOUNT);

    await click(accountInput);
    checkCreateAccount(walletStatusDom);
  }, 60000);

  it("has a transactions box with two transactions", () => {
    expect(getTransactionsCount(walletStatusDom)).toBe(2);
  }, 60000);

  it("has a send transaction box", () => {
    const tx = TestUtils.scryRenderedDOMComponentsWithTag(walletStatusDom, "li")[1];
    const txTime = tx.children[1].children[1].textContent;
    expect(txTime).toBe(txMock.time);
  }, 60000);

  it("has a name registration transaction box", () => {
    const tx = TestUtils.scryRenderedDOMComponentsWithTag(walletStatusDom, "li")[2];
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const txUsername = tx.children[1].children[0].querySelector("p:nth-of-type(2)")!.textContent;
    expect(txUsername).toBe(username);
  }, 60000);
});

withChainsDescribe("DOM > Feature > Wallet Status", () => {
  it("generates a link inside transaction box for an ethereum transaction", async () => {
    // Simulate we start background page
    jest.spyOn(txsUpdater, "transactionsUpdater").mockImplementation(() => {});
    jest.spyOn(txsUpdater, "updateRequestProvider").mockImplementation(() => {});
    const background = new Backgroundscript();
    background.registerActionsInBackground(window as IovWindowExtension);

    // Create a persona
    const requestsHandler = background["requestsHandler"];
    const db = background["db"].getDb();
    const mnemonic = "oxygen fall sure lava energy veteran enroll frown question detail include maximum";
    const password = "test-password";
    await background["createPersona"](password, mnemonic);
    const persona = background["persona"] as Persona;

    // Accept getIdentities request
    const sender = { url: "http://finnex.com" };
    const identitiesRequest = buildGetIdentitiesRequest("getIdentities");
    const responsePromise = requestsHandler.handleRequestMessage(identitiesRequest, sender);
    await sleep(10);
    requestsHandler["queueManager"].next().accept();

    // Accept signAndPost request
    const parsedResponse = parseJsonRpcResponse(await responsePromise);
    const parsedResult = TransactionEncoder.fromJson((parsedResponse as JsonRpcSuccessResponse).result);
    if (!isArrayOfIdentity(parsedResult)) {
      throw new Error();
    }
    const signRequest = await generateSignAndPostRequest(parsedResult[0]);
    const signResponse = requestsHandler.handleRequestMessage(signRequest, sender);
    requestsHandler["queueManager"].next().accept();
    await signResponse;

    // Launch react DOM with account status route
    const personaInfo = await (window as IovWindowExtension).getPersonaData();
    const walletStatusDom = await travelToWallet(personaInfo);

    // Check for the link
    const links = TestUtils.scryRenderedDOMComponentsWithTag(walletStatusDom, "a");
    expect(links.length).toBe(1);

    // Clean everything
    persona.destroy();
    requestsHandler.shutdown();
    db.close();
    jest.spyOn(txsUpdater, "transactionsUpdater").mockReset();
    jest.spyOn(txsUpdater, "updateRequestProvider").mockReset();
  }, 60000);
});

withChainsDescribe("DOM > Feature > Wallet Status Drawer", () => {
  let walletStatusDom: React.Component;

  beforeEach(async () => {
    walletStatusDom = await travelToWallet();
  }, 60000);

  it("lists networks", async () => {
    await goToNetworks(walletStatusDom);

    const liElements = scryRenderedDOMComponentsWithTag(walletStatusDom, "li");
    const ethereumNetwork = liElements[2];
    expect(ethereumNetwork.textContent).toBe("Ethereum Networkhttps://api.infura.io/v1/jsonrpc/kovan");
    const liskNetwork = liElements[3];
    expect(liskNetwork.textContent).toBe("Lisk Networkhttps://api.infura.io/v1/jsonrpc/rinkeby");
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
    requestsDom = await travelTo(WALLET_STATUS_ROUTE, [requestOne, requestTwo]);
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
    requestsDom = await travelTo(WALLET_STATUS_ROUTE, [requestTwo, requestOne]);
    const txRequest = getFirstRequest(requestsDom);

    click(txRequest);
    await findRenderedDOMComponentWithId(requestsDom, showTxHtmlId);
  }, 60000);
});

describe("DOM > Feature > Wallet Status Drawer > Show Share Identity", () => {
  let identityDOM: React.Component;
  let windowCloseCalled = false;

  beforeEach(async () => {
    requests.length = 0;
    requests.push(requestOne);
    windowCloseCalled = false;

    identityDOM = await travelTo(WALLET_STATUS_ROUTE, requests);
    await click(getFirstRequest(identityDOM));
    await findRenderedDOMComponentWithId(identityDOM, showIdentityHtmlId);

    jest.spyOn(window, "close").mockImplementation(() => {
      windowCloseCalled = true;
    });
  }, 60000);

  it("should accept incoming request and  close extension popup", async () => {
    await confirmAcceptButtonId(identityDOM);
    await findRenderedDOMComponentWithId(identityDOM, Views.Requests);
    expect(windowCloseCalled).toBeTruthy();
  }, 60000);

  it("should accept incoming request and redirect to the list of requests", async () => {
    requests.push(requestTwo);

    identityDOM = await travelTo(WALLET_STATUS_ROUTE, requests);
    await click(getFirstRequest(identityDOM));
    await findRenderedDOMComponentWithId(identityDOM, showIdentityHtmlId);

    await confirmAcceptButtonId(identityDOM);
    await findRenderedDOMComponentWithId(identityDOM, Views.Requests);
    expect(windowCloseCalled).toBeFalsy();
  }, 60000);

  it("should reject incoming request and close extension popup", async () => {
    await clickOnRejectButtonId(identityDOM);
    await confirmRejectButtonId(identityDOM);
    // TODO: Check here that share request rejection has been reject successfuly

    await findRenderedDOMComponentWithId(identityDOM, Views.Requests);
    expect(windowCloseCalled).toBeTruthy();
  }, 60000);

  it("should reject incoming request and redirect to the list of requests", async () => {
    requests.push(requestTwo);

    identityDOM = await travelTo(WALLET_STATUS_ROUTE, requests);
    await click(getFirstRequest(identityDOM));
    await findRenderedDOMComponentWithId(identityDOM, showIdentityHtmlId);

    await clickOnRejectButtonId(identityDOM);
    await confirmRejectButtonId(identityDOM);
    await findRenderedDOMComponentWithId(identityDOM, Views.Requests);
    expect(windowCloseCalled).toBeFalsy();
  }, 60000);

  it("should reject incoming request permanently and come back", async () => {
    await clickOnRejectButtonId(identityDOM);
    await checkPermanentRejectionId(identityDOM);
    await confirmRejectButtonId(identityDOM);
    await sleep(2000);
    // rejection flag has been set
  }, 60000);
});

describe("DOM > Feature > Wallet Status Drawer > Show TX", () => {
  let txRequestDOM: React.Component;
  let windowCloseCalled = false;

  beforeEach(async () => {
    requests.length = 0;
    requests.push(requestTwo);
    windowCloseCalled = false;

    txRequestDOM = await travelTo(WALLET_STATUS_ROUTE, requests);
    await click(getFirstRequest(txRequestDOM));
    await findRenderedDOMComponentWithId(txRequestDOM, showTxHtmlId);

    jest.spyOn(window, "close").mockImplementation(() => {
      windowCloseCalled = true;
    });
  }, 60000);

  it("should accept incoming request and close extension popup", async () => {
    await confirmAcceptButtonTx(txRequestDOM);
    await findRenderedDOMComponentWithId(txRequestDOM, Views.Requests);
    expect(windowCloseCalled).toBeTruthy();
  }, 60000);

  it("should accept incoming request and redirect to the list of requests", async () => {
    requests.push({ id: 3, ...requestOne });

    txRequestDOM = await travelTo(WALLET_STATUS_ROUTE, requests);
    await click(getFirstRequest(txRequestDOM));
    await findRenderedDOMComponentWithId(txRequestDOM, showTxHtmlId);

    await confirmAcceptButtonTx(txRequestDOM);
    await findRenderedDOMComponentWithId(txRequestDOM, Views.Requests);
    expect(windowCloseCalled).toBeFalsy();
  }, 60000);

  it("should reject incoming request and close extension popup", async () => {
    await clickOnRejectButtonTx(txRequestDOM);
    await confirmRejectButtonTx(txRequestDOM);
    // TODO: Check here that share request rejection has been reject successfuly

    await findRenderedDOMComponentWithId(txRequestDOM, Views.Requests);
    expect(windowCloseCalled).toBeTruthy();
  }, 60000);

  it("should reject incoming request and redirect to the list of requests", async () => {
    requests.push({ id: 3, ...requestOne });

    txRequestDOM = await travelTo(WALLET_STATUS_ROUTE, requests);
    await click(getFirstRequest(txRequestDOM));
    await findRenderedDOMComponentWithId(txRequestDOM, showTxHtmlId);

    await clickOnRejectButtonTx(txRequestDOM);
    await confirmRejectButtonTx(txRequestDOM);
    await findRenderedDOMComponentWithId(txRequestDOM, Views.Requests);
    expect(windowCloseCalled).toBeFalsy();
  }, 60000);

  it("should reject incoming request permanently and come back", async () => {
    await clickOnRejectButtonTx(txRequestDOM);
    await checkPermanentRejectionTx(txRequestDOM);
    await confirmRejectButtonTx(txRequestDOM);
    await sleep(2000);
    // rejection flag has been set
  }, 60000);
});

describe("DOM > Feature > Wallet Status Drawer > Send Transaction Request", () => {
  let txRequestDOM: React.Component;

  beforeEach(async () => {
    requests.length = 0;
    requests.push(requestTwo);
    txRequestDOM = await travelTo(WALLET_STATUS_ROUTE, requests);
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
    txRequestDOM = await travelTo(WALLET_STATUS_ROUTE, requests);
    await click(getFirstRequest(txRequestDOM));
  }, 60000);

  it("should show register username request accept view", async () => {
    await findRenderedDOMComponentWithId(txRequestDOM, REQ_REGISTER_USERNAME);
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
    txRequestDOM = await travelTo(WALLET_STATUS_ROUTE, requests);
    await click(getFirstRequest(txRequestDOM));
  }, 60000);

  it("should show proper propsal start date", () => {
    const proposalStartDate = getProposalStartDate(txRequestDOM);
    expect(proposalStartDate).toBe("8/21/2019, 10:28:21 AM");
  }, 60000);
});

withChainsDescribe("DOM > Feature > Wallet Status Drawer > Recovery Words", () => {
  it("shows the mnemonic for the current Persona", async () => {
    const personaMock = mockPersonaResponse([], mnemonic, []);
    const recoveryWordsDom = await travelToWallet(personaMock);
    await goToRecoveryWords(recoveryWordsDom);
    await submitPasswordForm(recoveryWordsDom);
    expect(getRenderedMnemonic(recoveryWordsDom).textContent).toBe(mnemonic);
  }, 60000);
});

withChainsDescribe("DOM > Feature > Wallet Status Drawer > Delete Wallet", () => {
  let deleteWalletDom: React.Component;
  let deleteButton: Element;
  let mnemonicInput: Element;
  let form: Element;
  const mnemonic = "badge cattle stool execute involve main mirror envelope brave scrap involve simple";
  const personaMock = mockPersonaResponse([], mnemonic, []);

  beforeEach(async () => {
    deleteWalletDom = await travelToWallet(personaMock);
    await goToDeleteWallet(deleteWalletDom);
    deleteButton = TestUtils.scryRenderedDOMComponentsWithTag(deleteWalletDom, "button")[3];
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

    expect(deleteButton.textContent).toBe("Delete Wallet");
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
