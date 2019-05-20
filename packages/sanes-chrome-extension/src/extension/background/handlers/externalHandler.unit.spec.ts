import { TransactionEncoder } from '@iov/core';
import { jsonRpcCode, JsonRpcRequest } from '@iov/jsonrpc';
import { withChainsDescribe } from '../../../utils/test/testExecutor';
import * as createPersonaUtilities from '../actions/createPersona';
import * as txsUpdater from '../actions/createPersona/requestAppUpdater';
import { RequestHandler } from '../actions/createPersona/requestHandler';
import { generateErrorResponse } from '../errorResponseGenerator';
import { handleExternalMessage } from './externalHandler';

const { createPersona, getCreatedPersona } = createPersonaUtilities;

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
  beforeEach(() => {
    localStorage.clear();
  });
  afterAll(() => {
    jest.spyOn(txsUpdater, 'transactionsUpdater').mockReset();
    jest.spyOn(txsUpdater, 'requestUpdater').mockReset();
  });

  function checkNextRequest(request: JsonRpcRequest, sender: string): void {
    const req = RequestHandler.next();
    expect(req.accept).not.toBe(null);
    expect(req.accept).not.toBe(undefined);
    expect(req.reject).not.toBe(null);
    expect(req.reject).not.toBe(undefined);

    const params: any = request.params; // eslint-disable-line
    expect(`string:${req.reason}`).toEqual(params.reason);
    expect(req.sender).toEqual(sender);
  }

  it('resolves to error if sender is unknown', async (done: () => void) => {
    await createPersona();

    const request = buildGetIdentitiesRequest('getIdentities');
    const sender = {};
    const sendResponse = (response: object): void => {
      expect(response).toEqual(generateErrorResponse(1, 'Got external message without sender URL'));
      getCreatedPersona().destroy();

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
    await createPersona();

    const request = buildGetIdentitiesRequest('getIdentities');
    const sender = { url: 'http://finnex.com' };
    handleExternalMessage(request, sender, jest.fn());

    expect(RequestHandler.requests).not.toBe(undefined);
    expect(RequestHandler.requests).not.toBe(null);
    expect(RequestHandler.requests).not.toBe([]);
    getCreatedPersona().destroy();
  });

  it('resolves to error if request method is unknown', async (done: () => void) => {
    await createPersona();
    const wrongMethod = 'getIdentitiiies';

    const request = buildGetIdentitiesRequest(wrongMethod);
    const sender = { url: 'http://finnex.com' };
    const sendResponse = (response: object): void => {
      expect(response).toEqual(
        generateErrorResponse(1, 'Error: Unknown method name', jsonRpcCode.methodNotFound),
      );
      getCreatedPersona().destroy();
      done();
    };

    handleExternalMessage(request, sender, sendResponse);
  });

  it('enqueues a request', async () => {
    await createPersona();

    const request = buildGetIdentitiesRequest('getIdentities');
    const sender = { url: 'http://finnex.com' };
    handleExternalMessage(request, sender, jest.fn());

    expect(RequestHandler.requests().length).toBe(1);
    checkNextRequest(request, sender.url);
    getCreatedPersona().destroy();
  });

  it('resolves to error when sender has been permanently blocked', async (done: () => void) => {
    await createPersona();

    const request = buildGetIdentitiesRequest('getIdentities');
    const sender = { url: 'http://finnex.com' };
    handleExternalMessage(request, sender, jest.fn());

    expect(RequestHandler.requests().length).toBe(1);
    const rejectPermanently = true;
    RequestHandler.next().reject(rejectPermanently);
    expect(RequestHandler.requests().length).toBe(0);

    const sendSecondResponse = (response: object): void => {
      expect(response).toEqual(generateErrorResponse(1, 'Sender has been blocked by user'));
      getCreatedPersona().destroy();
      done();
    };
    handleExternalMessage(request, sender, sendSecondResponse);
  }, 8000);

  it('resolves in order request queue', async () => {
    await createPersona();
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

    getCreatedPersona().destroy();
  }, 8000);
});
