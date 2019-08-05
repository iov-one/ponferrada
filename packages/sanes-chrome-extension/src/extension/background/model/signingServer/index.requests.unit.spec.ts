import { TransactionEncoder } from "@iov/encoding";
import { jsonRpcCode, JsonRpcRequest, JsonRpcSuccessResponse, parseJsonRpcResponse2 } from "@iov/jsonrpc";

import { withChainsDescribe } from "../../../../utils/test/testExecutor";
import { sleep } from "../../../../utils/timer";
import { generateErrorResponse } from "../../errorResponseGenerator";
import * as txsUpdater from "../../updaters/appUpdater";
import { Db, StringDb } from "../backgroundscript/db";
import { Persona } from "../persona";
import SigningServer from "./index";
import { isGetIdentitiesRequest, isSignAndPostRequest } from "./requestQueueManager";
import {
  buildGetIdentitiesRequest,
  generateSignAndPostRequest,
  isArrayOfIdentity,
} from "./test/requestBuilder";

withChainsDescribe("background script handler for website request", () => {
  let db: StringDb;
  let persona: Persona;
  let signingServer: SigningServer;

  beforeAll(() => {
    jest.spyOn(txsUpdater, "transactionsUpdater").mockImplementation(() => {});
    jest.spyOn(txsUpdater, "updateRequestProvider").mockImplementation(() => {});
  });
  beforeEach(async () => {
    localStorage.clear();
    db = new Db().getDb();
    signingServer = new SigningServer();
    persona = await Persona.create(db, signingServer, "test-password", undefined);
    signingServer.start(persona.getCore());
  });
  afterEach(() => {
    persona.destroy();
    signingServer.shutdown();
    db.close();
  });
  afterAll(() => {
    jest.spyOn(txsUpdater, "transactionsUpdater").mockReset();
    jest.spyOn(txsUpdater, "updateRequestProvider").mockReset();
  });

  function checkNextRequest(request: JsonRpcRequest, sender: string): void {
    const req = signingServer["requestHandler"].next();
    expect(req.accept).toBeTruthy();
    expect(req.reject).toBeTruthy();
    expect(req.senderUrl).toEqual(sender);
    expect(req.reason).toEqual(TransactionEncoder.fromJson(request.params).reason);
    if (!isGetIdentitiesRequest(req)) throw new Error("Unexpected request type");
    expect(req.responseData.requestedIdentities[0].chainName).toEqual("Ganache");
  }

  it("resolves to error if sender is unknown", async () => {
    const request = buildGetIdentitiesRequest("getIdentities");
    const sender = {};
    const response = await signingServer.handleRequestMessage(request, sender);
    expect(response).toEqual(generateErrorResponse(1, "Got external message without sender URL"));
  });

  it("resolves to error if signing server is not ready", async () => {
    const ssRef = signingServer["signingServer"];
    signingServer["signingServer"] = undefined;
    const request = buildGetIdentitiesRequest("getIdentities");
    const sender = { url: "http://finnex.com" };
    const response = await signingServer.handleRequestMessage(request, sender);
    expect(response).toEqual(generateErrorResponse(1, "Signing server not ready"));
    signingServer["signingServer"] = ssRef;
  });

  it("loads automatically request handler", async () => {
    const request = buildGetIdentitiesRequest("getIdentities");
    const sender = { url: "http://finnex.com" };

    signingServer.handleRequestMessage(request, sender);
    await sleep(10);

    expect(signingServer["requestHandler"].requests()).toBeInstanceOf(Array);
    expect(signingServer["requestHandler"].requests()).not.toEqual([]);
  });

  it("resolves to error if request method is unknown", async () => {
    const wrongMethod = "getIdentitiiies";

    const request = buildGetIdentitiesRequest(wrongMethod);
    const sender = { url: "http://finnex.com" };
    const response = await signingServer.handleRequestMessage(request, sender);
    expect(response).toEqual(
      generateErrorResponse(1, "Error: Unknown method name", jsonRpcCode.methodNotFound),
    );
  });

  it("enqueues a request", async () => {
    const request = buildGetIdentitiesRequest("getIdentities");
    const sender = { url: "http://finnex.com" };
    signingServer.handleRequestMessage(request, sender);
    await sleep(10);

    expect(signingServer["requestHandler"].requests().length).toBe(1);
    checkNextRequest(request, sender.url);
  });

  it("resolves to error when sender has been permanently blocked", async () => {
    const request = buildGetIdentitiesRequest("getIdentities");
    const sender = { url: "http://finnex.com" };
    signingServer.handleRequestMessage(request, sender);
    await sleep(10);

    expect(signingServer["requestHandler"].requests().length).toBe(1);
    const rejectPermanently = true;
    signingServer["requestHandler"].next().reject(rejectPermanently);
    expect(signingServer["requestHandler"].requests().length).toBe(0);

    const response = await signingServer.handleRequestMessage(request, sender);
    expect(response).toEqual(generateErrorResponse(1, "Sender has been blocked by user"));
  }, 8000);

  it("resolves in order request queue", async () => {
    const sender = { url: "http://finnex.com" };

    const requestFoo = buildGetIdentitiesRequest("getIdentities", "Reason foo");
    signingServer.handleRequestMessage(requestFoo, sender);

    const requestBar = buildGetIdentitiesRequest("getIdentities", "Reason bar");
    signingServer.handleRequestMessage(requestBar, sender);

    await sleep(10);

    expect(signingServer["requestHandler"].requests().length).toBe(2);
    const chromeFooRequest = signingServer["requestHandler"].next();
    chromeFooRequest.accept();
    expect(signingServer["requestHandler"].requests().length).toBe(1);

    const chromeBarRequest = signingServer["requestHandler"].next();
    expect(chromeFooRequest.reason).not.toEqual(chromeBarRequest.reason);
    expect(chromeBarRequest.reason).toBe("Reason bar");
  }, 8000);

  it("rejects automatically enqueued request if sender rejected permanently", async () => {
    const senderOne = { url: "http://finnex.com" };
    const senderTwo = { url: "http://example.com" };

    // enqueue 2 requests of sender one
    const requestFoo = buildGetIdentitiesRequest("getIdentities", "Reason foo");
    signingServer.handleRequestMessage(requestFoo, senderOne);
    const requestBar = buildGetIdentitiesRequest("getIdentities", "Reason bar");
    signingServer.handleRequestMessage(requestBar, senderOne);

    // enqueue 1 request of sender two
    const requestBaz = buildGetIdentitiesRequest("getIdentities", "Reason baz");
    signingServer.handleRequestMessage(requestBaz, senderTwo);

    // enqueue 2 requests of sender one
    const requestThird = buildGetIdentitiesRequest("getIdentities", "Reason third");
    signingServer.handleRequestMessage(requestThird, senderOne);
    const requestFourth = buildGetIdentitiesRequest("getIdentities", "Reason fourth");
    signingServer.handleRequestMessage(requestFourth, senderOne);

    await sleep(10);

    // check in total there are 5 requests in the queue
    expect(signingServer["requestHandler"].requests().length).toBe(5);

    // reject permanently sender one
    const chromeFooRequest = signingServer["requestHandler"].next();
    expect(chromeFooRequest.id).toBe(0);
    const permanently = true;
    chromeFooRequest.reject(permanently);

    // check the only request left is the sender two
    expect(signingServer["requestHandler"].requests().length).toBe(1);
    const chromeBazRequest = signingServer["requestHandler"].next();
    expect(chromeBazRequest.id).toBe(2);
    expect(chromeBazRequest.senderUrl).toBe("http://example.com");
  }, 8000);

  it("rejects correctly when permanently blocked is last one in the queue", async () => {
    const senderOne = { url: "http://finnex.com" };
    const requestFoo = buildGetIdentitiesRequest("getIdentities", "Reason foo");
    signingServer.handleRequestMessage(requestFoo, senderOne);
    await sleep(10);

    const senderTwo = { url: "http://finnextwo.com" };
    const requestBar = buildGetIdentitiesRequest("getIdentities", "Reason bar");
    signingServer.handleRequestMessage(requestBar, senderTwo);
    await sleep(10);

    signingServer["requestHandler"].next().accept();
    const chromeBarRequest = signingServer["requestHandler"].next();
    expect(chromeBarRequest.id).toBe(1);
    expect(chromeBarRequest.senderUrl).toBe(senderTwo.url);
    chromeBarRequest.reject(true);
    expect(signingServer["requestHandler"].requests().length).toBe(0);

    // Auto rejecting does not affect to counter id
    const senderThree = { url: "http://finnexthree.com" };
    const requestBaz = buildGetIdentitiesRequest("getIdentities", "Reason baz");
    signingServer.handleRequestMessage(requestBaz, senderThree);
    await sleep(10);

    const chromeBazRequest = signingServer["requestHandler"].next();
    expect(chromeBazRequest.id).toBe(2);
    expect(chromeBazRequest.reason).toBe("Reason baz");
  }, 8000);

  it("generates a creator correctly when signAndPost", async () => {
    // get Identities
    const sender = { url: "http://finnex.com" };
    const identitiesRequest = buildGetIdentitiesRequest("getIdentities");
    const responsePromise = signingServer.handleRequestMessage(identitiesRequest, sender);
    await sleep(10);
    signingServer["requestHandler"].next().accept();

    const parsedResponse = parseJsonRpcResponse2(await responsePromise);
    const parsedResult = TransactionEncoder.fromJson((parsedResponse as JsonRpcSuccessResponse).result);
    if (!isArrayOfIdentity(parsedResult)) {
      throw new Error();
    }

    const signRequest = await generateSignAndPostRequest(parsedResult[0]);
    signingServer.handleRequestMessage(signRequest, sender);

    const request = signingServer["requestHandler"].next();
    if (!isSignAndPostRequest(request)) throw new Error("Unexpected request type");
  }, 8000);
});
