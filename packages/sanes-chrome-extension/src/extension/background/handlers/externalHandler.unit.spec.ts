import { TransactionEncoder } from '@iov/core';
import { jsonRpcCode, JsonRpcRequest } from '@iov/jsonrpc';
import { PersonaManager } from '../../../logic/persona';
import { withChainsDescribe } from '../../../utils/test/testExecutor';
import { createPersona } from '../actions/createPersona';
import * as txsUpdater from '../actions/createPersona/requestAppUpdater';
import { RequestHandler } from '../actions/createPersona/requestHandler';
import { generateErrorResponse } from '../errorResponseGenerator';
import { handleExternalMessage } from './externalHandler';

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
  });
  beforeEach(() => {
    localStorage.clear();
  });
  afterAll(() => {
    jest.spyOn(txsUpdater, 'transactionsUpdater').mockReset();
  });

  function checkNextRequest(request: JsonRpcRequest, sender: string): void {
    const req = RequestHandler.next();
    expect(req.accept).not.toBe(null);
    expect(req.accept).not.toBe(undefined);
    expect(req.reject).not.toBe(null);
    expect(req.reject).not.toBe(undefined);

    const params: any = request.params; // eslint-disable-line
    expect(req.reason).toEqual(params.reason);
    expect(req.sender).toEqual(sender);
  }

  it('resolves to error if sender is unknown', async () => {
    await createPersona();

    const request = buildGetIdentitiesRequest('getIdentities');
    const sender = {};
    const sendResponse = (response: object): void => {
      expect(response).toEqual(generateErrorResponse(1, 'Got external message without sender URL'));
    };
    handleExternalMessage(request, sender, sendResponse);

    PersonaManager.destroy();
  });

  it('resolves to error if signing server is not ready', async () => {
    const request = buildGetIdentitiesRequest('getIdentities');
    const sender = { url: 'http://finnex.com' };
    const sendResponse = (response: object): void => {
      expect(response).toEqual(generateErrorResponse(1, 'Signing server not ready'));
    };

    handleExternalMessage(request, sender, sendResponse);
  });

  it('loads automatically request handler', async () => {
    await createPersona();

    const request = buildGetIdentitiesRequest('getIdentities');
    const sender = { url: 'http://finnex.com' };
    const sendResponse = (response: object): void => {
      expect(RequestHandler.requests).not.toBe(undefined);
      expect(RequestHandler.requests).not.toBe(null);
      expect(RequestHandler.requests).not.toBe([]);
    };

    handleExternalMessage(request, sender, sendResponse);

    PersonaManager.destroy();
  });

  it('resolves to error if request method is unknown', async () => {
    await createPersona();
    const wrongMethod = 'getIdentitiiies';

    const request = buildGetIdentitiesRequest(wrongMethod);
    const sender = { url: 'http://finnex.com' };
    const sendResponse = (response: object): void => {
      expect(response).toEqual(
        generateErrorResponse(1, 'Error: Unknown method name', jsonRpcCode.methodNotFound),
      );
    };

    handleExternalMessage(request, sender, sendResponse);

    PersonaManager.destroy();
  });

  it('enqueues a request', async () => {
    await createPersona();

    const request = buildGetIdentitiesRequest('getIdentities');
    const sender = { url: 'http://finnex.com' };
    const sendResponse = (response: object): void => {
      expect(RequestHandler.requests().length).toBe(1);
      checkNextRequest(request, sender.url);
    };

    handleExternalMessage(request, sender, sendResponse);

    PersonaManager.destroy();
  });

  it.only('resolves to error when sender has been permanently blocked', async (done: () => void) => {
    await createPersona();

    const request = buildGetIdentitiesRequest('getIdentities');
    const sender = { url: 'http://finnex.com' };
    const sendSecondResponse = (response: object): void => {
      expect(response).toEqual(generateErrorResponse(1, 'Sender has been blocked by user'));
      PersonaManager.destroy();
      done();
    };

    const sendFirstResponse = (_response: object): void => {
      expect(RequestHandler.requests().length).toBe(1);
      const chromeRequest = RequestHandler.next();
      const rejectPermanently = true;
      chromeRequest.reject(rejectPermanently);
      expect(RequestHandler.requests().length).toBe(0);

      handleExternalMessage(request, sender, sendSecondResponse);
    };

    handleExternalMessage(request, sender, sendFirstResponse);
  }, 8000);
});

/*
  it('resolves to error when sender has been permanently blocked', async () => {
    const persona = await Persona.create();
    SenderWhitelist.load();
    RequestHandler.create();

    const server = persona.startSigningServer(revealAllIdentities, signEverything);
    const request = buildGetIdentitiesRequest('getIdentities');
    const sender = 'http://finex.com';
    handleExternalMessage(server, request, sender);
    expect(RequestHandler.requests().length).toBe(1);

    const chromeRequest = RequestHandler.next();
    const rejectPermanently = true;
    chromeRequest.reject(rejectPermanently);
    expect(RequestHandler.requests().length).toBe(0);

    expect(handleExternalMessage(server, request, sender)).resolves.toMatchObject({
      error: {
        message: 'Sender has been blocked by user',
      },
    });

    persona.destroy();
  });

  it('resolves in order request queue', async () => {
    const persona = await Persona.create();
    SenderWhitelist.load();
    RequestHandler.create();

    const server = persona.startSigningServer(revealAllIdentities, signEverything);
    const requestFoo = buildGetIdentitiesRequest('getIdentities', 'Reason foo');
    const requestBar = buildGetIdentitiesRequest('getIdentities', 'Reason bar');
    const sender = 'http://finex.com';
    handleExternalMessage(server, requestFoo, sender);
    handleExternalMessage(server, requestBar, sender);
    expect(RequestHandler.requests().length).toBe(2);

    const chromeFooRequest = RequestHandler.next();
    chromeFooRequest.accept();
    expect(RequestHandler.requests().length).toBe(1);
    const chromeBarRequest = RequestHandler.next();
    expect(chromeFooRequest.request).not.toEqual(chromeBarRequest.request);
    expect(chromeBarRequest.request.params).toMatchObject({
      reason: 'string:Reason bar',
    });

    persona.destroy();
  });
});
*/
