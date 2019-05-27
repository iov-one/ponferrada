import { TransactionEncoder } from '@iov/core';
import { jsonRpcCode, JsonRpcRequest } from '@iov/jsonrpc';
import { createMemDb, StringDb } from '../../../logic/db';
import { withChainsDescribe } from '../../../utils/test/testExecutor';
import { sleep } from '../../../utils/timer';
import * as createPersonaUtilities from '../actions/createPersona';
import * as txsUpdater from '../actions/createPersona/requestAppUpdater';
import { GetIdentitiesRequest, RequestHandler } from '../actions/createPersona/requestHandler';
import { generateErrorResponse } from '../errorResponseGenerator';
import { handleExternalMessage } from './externalHandler';

const { clearPersona, createPersona } = createPersonaUtilities;

const buildGetIdentitiesRequest = (method: string, customMessage?: string): JsonRpcRequest => ({
  jsonrpc: '2.0',
  id: 1,
  method,
  params: {
    reason: TransactionEncoder.toJson(
      customMessage ? customMessage : 'I would like to know who you are on Ethereum',
    ),
    chainIds: TransactionEncoder.toJson(['ethereum-eip155-5777']),
  },
});

withChainsDescribe('background script handler for website request', () => {
  let db: StringDb;

  beforeAll(() => {
    jest.spyOn(txsUpdater, 'transactionsUpdater').mockImplementation(() => {});
    jest.spyOn(txsUpdater, 'requestUpdater').mockImplementation(() => {});
  });
  beforeEach(async () => {
    localStorage.clear();
    db = createMemDb();
    await createPersona(db, 'test password', undefined);
  });
  afterEach(() => {
    clearPersona();
    db.close();
  });
  afterAll(() => {
    jest.spyOn(txsUpdater, 'transactionsUpdater').mockReset();
    jest.spyOn(txsUpdater, 'requestUpdater').mockReset();
  });

  function checkNextRequest(request: JsonRpcRequest, sender: string): void {
    const req = RequestHandler.next();
    expect(req.accept).toBeTruthy();
    expect(req.reject).toBeTruthy();
    expect(req.reason).toEqual(TransactionEncoder.fromJson(request.params).reason);
    expect(req.data.senderUrl).toEqual(sender);
    expect((req.data as GetIdentitiesRequest).requestedIdentities[0].name).toEqual('Ethereum Testnet');
  }

  it('resolves to error if sender is unknown', async () => {
    const request = buildGetIdentitiesRequest('getIdentities');
    const sender = {};
    const response = await handleExternalMessage(request, sender);
    expect(response).toEqual(generateErrorResponse(1, 'Got external message without sender URL'));
  });

  it('resolves to error if signing server is not ready', async () => {
    jest.spyOn(createPersonaUtilities, 'getSigningServer').mockImplementationOnce(() => undefined);
    const request = buildGetIdentitiesRequest('getIdentities');
    const sender = { url: 'http://finnex.com' };
    const response = await handleExternalMessage(request, sender);
    expect(response).toEqual(generateErrorResponse(1, 'Signing server not ready'));
  });

  it('loads automatically request handler', async () => {
    const request = buildGetIdentitiesRequest('getIdentities');
    const sender = { url: 'http://finnex.com' };

    // note: will not resolve due to missing user interaction
    handleExternalMessage(request, sender);
    await sleep(10);

    expect(RequestHandler.requests()).toBeInstanceOf(Array);
    expect(RequestHandler.requests()).not.toEqual([]);
  });

  it('resolves to error if request method is unknown', async () => {
    const wrongMethod = 'getIdentitiiies';

    const request = buildGetIdentitiesRequest(wrongMethod);
    const sender = { url: 'http://finnex.com' };

    const response = await handleExternalMessage(request, sender);
    expect(response).toEqual(
      generateErrorResponse(1, 'Error: Unknown method name', jsonRpcCode.methodNotFound),
    );
  });

  it('enqueues a request', async () => {
    const request = buildGetIdentitiesRequest('getIdentities');
    const sender = { url: 'http://finnex.com' };

    // note: will not resolve due to missing user interaction
    handleExternalMessage(request, sender);
    await sleep(10);

    expect(RequestHandler.requests().length).toBe(1);
    checkNextRequest(request, sender.url);
  });

  it('resolves to error when sender has been permanently blocked', async () => {
    const request = buildGetIdentitiesRequest('getIdentities');
    const sender = { url: 'http://finnex.com' };

    // note: does not resolve before the .reject() call below
    handleExternalMessage(request, sender);
    await sleep(10);

    expect(RequestHandler.requests().length).toBe(1);
    const rejectPermanently = true;
    RequestHandler.next().reject(rejectPermanently);
    expect(RequestHandler.requests().length).toBe(0);

    const response = await handleExternalMessage(request, sender);
    expect(response).toEqual(generateErrorResponse(1, 'Sender has been blocked by user'));
  }, 8000);

  it('resolves in order request queue', async () => {
    const sender = { url: 'http://finnex.com' };

    const requestFoo = buildGetIdentitiesRequest('getIdentities', 'Reason foo');
    // note: does not resolve before the .accept() call below
    handleExternalMessage(requestFoo, sender);

    const requestBar = buildGetIdentitiesRequest('getIdentities', 'Reason bar');
    // note: will not resolve due to missing user interaction
    handleExternalMessage(requestBar, sender);

    await sleep(10);

    expect(RequestHandler.requests().length).toBe(2);
    const chromeFooRequest = RequestHandler.next();
    chromeFooRequest.accept();
    expect(RequestHandler.requests().length).toBe(1);

    const chromeBarRequest = RequestHandler.next();
    expect(chromeFooRequest.reason).not.toEqual(chromeBarRequest.reason);
    expect(chromeBarRequest.reason).toBe('Reason bar');
  }, 8000);

  it('rejects automatically enqueued request if sender rejected permanently', async () => {
    const senderOne = { url: 'http://finnex.com' };
    const senderTwo = { url: 'http://example.com' };

    // enqueue 2 requests of sender one
    const requestFoo = buildGetIdentitiesRequest('getIdentities', 'Reason foo');
    handleExternalMessage(requestFoo, senderOne);
    const requestBar = buildGetIdentitiesRequest('getIdentities', 'Reason bar');
    handleExternalMessage(requestBar, senderOne);

    // enqueue 1 request of sender two
    const requestBaz = buildGetIdentitiesRequest('getIdentities', 'Reason baz');
    handleExternalMessage(requestBaz, senderTwo);

    // enqueue 2 requests of sender one
    const requestThird = buildGetIdentitiesRequest('getIdentities', 'Reason third');
    handleExternalMessage(requestThird, senderOne);
    const requestFourth = buildGetIdentitiesRequest('getIdentities', 'Reason fourth');
    handleExternalMessage(requestFourth, senderOne);

    await sleep(10);

    // check in total there are 5 requests in the queue
    expect(RequestHandler.requests().length).toBe(5);

    // reject permanently sender one
    const chromeFooRequest = RequestHandler.next();
    expect(chromeFooRequest.id).toBe(0);
    const permanently = true;
    chromeFooRequest.reject(permanently);

    // check the only request left is the sender two
    expect(RequestHandler.requests().length).toBe(1);
    const chromeBazRequest = RequestHandler.next();
    expect(chromeBazRequest.id).toBe(2);
    expect(chromeBazRequest.data.senderUrl).toBe('http://example.com');
  }, 8000);

  it('rejects correctly when permanently blocked is last one in the queue', async () => {
    const senderOne = { url: 'http://finnex.com' };
    const requestFoo = buildGetIdentitiesRequest('getIdentities', 'Reason foo');
    // note: does not resolve before the .accept() call below
    handleExternalMessage(requestFoo, senderOne);

    const senderTwo = { url: 'http://finnextwo.com' };
    const requestBar = buildGetIdentitiesRequest('getIdentities', 'Reason bar');
    // note: does not resolve before the .reject() call below
    handleExternalMessage(requestBar, senderTwo);

    await sleep(10);

    RequestHandler.next().accept();
    const chromeBarRequest = RequestHandler.next();
    expect(chromeBarRequest.id).toBe(1);
    expect(chromeBarRequest.data.senderUrl).toBe(senderTwo.url);
    chromeBarRequest.reject(true);
    expect(RequestHandler.requests().length).toBe(0);

    // Auto rejecting does not affect to counter id
    const senderThree = { url: 'http://finnexthree.com' };
    const requestBaz = buildGetIdentitiesRequest('getIdentities', 'Reason baz');
    // note: will not resolve due to missing user interaction
    handleExternalMessage(requestBaz, senderThree);
    await sleep(10);
    const chromeBazRequest = RequestHandler.next();
    expect(chromeBazRequest.id).toBe(2);
    expect(chromeBazRequest.reason).toBe('Reason baz');
  }, 8000);
});
