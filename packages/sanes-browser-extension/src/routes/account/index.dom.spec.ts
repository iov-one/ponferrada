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
import TestUtils from "react-dom/test-utils";
import { sleep } from "ui-logic";

import Backgroundscript, { IovWindowExtension } from "../../extension/background/model/backgroundscript";
import { Persona, PersonaAcccount, ProcessedTx } from "../../extension/background/model/persona";
import {
  mockClearDatabase,
  mockClearPersona,
  mockPersonaResponse,
} from "../../extension/background/model/persona/test/persona";
import {
  buildGetIdentitiesRequest,
  generateSignAndPostRequest,
  isArrayOfIdentity,
} from "../../extension/background/model/requestsHandler/test/requestBuilder";
import * as txsUpdater from "../../extension/background/updaters/appUpdater";
import { click } from "../../utils/test/dom";
import { travelToAccount, whenOnNavigatedToRoute } from "../../utils/test/navigation";
import { withChainsDescribe } from "../../utils/test/testExecutor";
import * as Drawer from "../account/test/drawer";
import { RECOVERY_PHRASE_ROUTE, REQUEST_ROUTE, TERMS_URL, WELCOME_ROUTE } from "../paths";
import { checkCreateAccount, getTransactionsCount } from "./test/operateAccount";

describe("DOM > Feature > Account Status", () => {
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
    time: "Sat May 25 10:10:00 2019 +0200",
    blockExplorerUrl: "www.blockexplorer.com",
    error: null,
    original: sendTx,
  };
  const usernameMock: ProcessedTx = {
    id: "112",
    signer: "Example Signer",
    time: "Sat May 25 10:10:00 2019 +0200",
    blockExplorerUrl: "www.blockexplorer.com",
    error: null,
    original: usernameTx,
  };
  const personaMock = mockPersonaResponse([accountMock], mnemonic, [txMock, usernameMock]);

  let accountStatusDom: React.Component;

  beforeEach(async () => {
    accountStatusDom = await travelToAccount(personaMock);
  }, 60000);

  it("redirects to the Recovery Phrase view when link clicked in Drawer menu", async () => {
    await Drawer.clickRecoveryPhrase(accountStatusDom);
    await whenOnNavigatedToRoute(RECOVERY_PHRASE_ROUTE);
  }, 60000);

  it("redirects to the Requests view when link clicked in Drawer menu", async () => {
    await Drawer.clickRequests(accountStatusDom);
    await whenOnNavigatedToRoute(REQUEST_ROUTE);
  }, 60000);

  it("redirects to the Welcome page when Delete wallet was clicked", async () => {
    const clearPersonaMock = mockClearPersona();
    const clearDatabaseMock = mockClearDatabase();
    await Drawer.clickDeleteWallet(accountStatusDom);
    await whenOnNavigatedToRoute(WELCOME_ROUTE);
    expect(clearPersonaMock).toHaveBeenCalledTimes(1);
    expect(clearDatabaseMock).toHaveBeenCalledTimes(1);
  }, 60000);

  it("redirects to the Terms and Conditions page", async () => {
    Object.defineProperty(window, "open", {
      configurable: true,
    });
    window.open = jest.fn();
    await Drawer.clickTerms(accountStatusDom);
    expect(window.open).toHaveBeenCalledWith(TERMS_URL, "_blank");
  }, 60000);

  it("has a select dropdown that enables the creation and selection of accounts", async () => {
    const accountInput = TestUtils.findRenderedDOMComponentWithTag(accountStatusDom, "input");
    expect(accountInput.getAttribute("value")).toBe(ACCOUNT);

    await click(accountInput);
    await checkCreateAccount(accountStatusDom);
  }, 60000);

  it("has a transactions box with two transactions", () => {
    expect(getTransactionsCount(accountStatusDom)).toBe(2);
  }, 60000);

  it("has a send transaction box", () => {
    const tx = TestUtils.scryRenderedDOMComponentsWithTag(accountStatusDom, "li")[1];
    const txTime = tx.children[1].children[1].textContent;
    expect(txTime).toBe(txMock.time);
  }, 60000);

  it("has a name registration transaction box", () => {
    const tx = TestUtils.scryRenderedDOMComponentsWithTag(accountStatusDom, "li")[2];
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const txUsername = tx.children[1].children[0].querySelector("p:nth-of-type(2)")!.textContent;
    expect(txUsername).toBe(username);
  }, 60000);
});

withChainsDescribe("DOM > Feature > Account Status", () => {
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
    const accountStatusDom = await travelToAccount(personaInfo);

    // Check for the link
    const links = TestUtils.scryRenderedDOMComponentsWithTag(accountStatusDom, "a");
    expect(links.length).toBe(1);

    // Clean everything
    persona.destroy();
    requestsHandler.shutdown();
    db.close();
    jest.spyOn(txsUpdater, "transactionsUpdater").mockReset();
    jest.spyOn(txsUpdater, "updateRequestProvider").mockReset();
  }, 60000);
});
