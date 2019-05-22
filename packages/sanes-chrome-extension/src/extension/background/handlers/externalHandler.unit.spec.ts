import { TransactionEncoder } from '@iov/core';
import { jsonRpcCode, JsonRpcRequest } from '@iov/jsonrpc';
import { withChainsDescribe } from '../../../utils/test/testExecutor';
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
  beforeAll(() => {
    jest.spyOn(txsUpdater, 'transactionsUpdater').mockImplementation(() => {});
    jest.spyOn(txsUpdater, 'requestUpdater').mockImplementation(() => {});
  });
  beforeEach(async () => {
    localStorage.clear();
    await createPersona();
  });
  afterEach(() => {
    clearPersona();
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

  it('resolves to error if sender is unknown', async (done: () => void) => {
    const request = buildGetIdentitiesRequest('getIdentities');
    const sender = {};
    const sendResponse = (response: object): void => {
      expect(response).toEqual(generateErrorResponse(1, 'Got external message without sender URL'));
      done();
    };
    handleExternalMessage(request, sender, sendResponse);
  });

  it('resolves to error if signing server is not ready', async (done: () => void) => {
    jest.spyOn(createPersonaUtilities, 'getSigningServer').mockImplementationOnce(() => undefined);
    const request = buildGetIdentitiesRequest('getIdentities');
    const sender = { url: 'http://finnex.com' };
    const sendResponse = (response: object): void => {
      expect(response).toEqual(generateErrorResponse(1, 'Signing server not ready'));
      done();
    };
    handleExternalMessage(request, sender, sendResponse);
  });

  it('loads automatically request handler', async () => {
    const request = buildGetIdentitiesRequest('getIdentities');
    const sender = { url: 'http://finnex.com' };
    handleExternalMessage(request, sender, jest.fn());

    expect(RequestHandler.requests()).toBeInstanceOf(Array);
    expect(RequestHandler.requests()).not.toEqual([]);
  });

  it('resolves to error if request method is unknown', async (done: () => void) => {
    const wrongMethod = 'getIdentitiiies';

    const request = buildGetIdentitiesRequest(wrongMethod);
    const sender = { url: 'http://finnex.com' };
    const sendResponse = (response: object): void => {
      expect(response).toEqual(
        generateErrorResponse(1, 'Error: Unknown method name', jsonRpcCode.methodNotFound),
      );
      done();
    };
    handleExternalMessage(request, sender, sendResponse);
  });

  it('enqueues a request', async () => {
    const request = buildGetIdentitiesRequest('getIdentities');
    const sender = { url: 'http://finnex.com' };
    handleExternalMessage(request, sender, jest.fn());

    expect(RequestHandler.requests().length).toBe(1);
    checkNextRequest(request, sender.url);
  });

  it('resolves to error when sender has been permanently blocked', async (done: () => void) => {
    const request = buildGetIdentitiesRequest('getIdentities');
    const sender = { url: 'http://finnex.com' };
    handleExternalMessage(request, sender, jest.fn());

    expect(RequestHandler.requests().length).toBe(1);
    const rejectPermanently = true;
    RequestHandler.next().reject(rejectPermanently);
    expect(RequestHandler.requests().length).toBe(0);

    const sendSecondResponse = (response: object): void => {
      expect(response).toEqual(generateErrorResponse(1, 'Sender has been blocked by user'));
      done();
    };
    handleExternalMessage(request, sender, sendSecondResponse);
  }, 8000);

  it('resolves in order request queue', async () => {
    const sender = { url: 'http://finnex.com' };

    const requestFoo = buildGetIdentitiesRequest('getIdentities', 'Reason foo');
    handleExternalMessage(requestFoo, sender, jest.fn());

    const requestBar = buildGetIdentitiesRequest('getIdentities', 'Reason bar');
    handleExternalMessage(requestBar, sender, jest.fn());

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
    handleExternalMessage(requestFoo, senderOne, jest.fn());
    const requestBar = buildGetIdentitiesRequest('getIdentities', 'Reason bar');
    handleExternalMessage(requestBar, senderOne, jest.fn());

    // enqueue 1 request of sender two
    const requestBaz = buildGetIdentitiesRequest('getIdentities', 'Reason baz');
    handleExternalMessage(requestBaz, senderTwo, jest.fn());

    // enqueue 2 requests of sender one
    const requestThird = buildGetIdentitiesRequest('getIdentities', 'Reason third');
    handleExternalMessage(requestThird, senderOne, jest.fn());
    const requestFourth = buildGetIdentitiesRequest('getIdentities', 'Reason fourth');
    handleExternalMessage(requestFourth, senderOne, jest.fn());

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
    handleExternalMessage(requestFoo, senderOne, jest.fn());

    const senderTwo = { url: 'http://finnextwo.com' };
    const requestBar = buildGetIdentitiesRequest('getIdentities', 'Reason bar');
    handleExternalMessage(requestBar, senderTwo, jest.fn());

    RequestHandler.next().accept();
    const chromeBarRequest = RequestHandler.next();
    expect(chromeBarRequest.id).toBe(1);
    expect(chromeBarRequest.data.senderUrl).toBe(senderTwo.url);
    chromeBarRequest.reject(true);
    expect(RequestHandler.requests().length).toBe(0);

    // Auto rejecting does not affect to counter id
    const senderThree = { url: 'http://finnexthree.com' };
    const requestBaz = buildGetIdentitiesRequest('getIdentities', 'Reason baz');
    handleExternalMessage(requestBaz, senderThree, jest.fn());
    const chromeBazRequest = RequestHandler.next();
    expect(chromeBazRequest.id).toBe(2);
    expect(chromeBazRequest.reason).toBe('Reason baz');
  }, 8000);
});
