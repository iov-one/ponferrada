import { PublicIdentity } from '@iov/bcp';
import { TransactionEncoder, GetIdentitiesAuthorization, SignAndPostAuthorization } from '@iov/core';

import { withChainsDescribe } from '../../../utils/test/testExecutor';
import { handleExternalMessage } from './index';
import { Persona } from '../../../logic/persona';
import { SenderWhitelist } from './senderWhitelist';
import { RequestHandler } from './requestHandler';

const buildGetIdentitiesRequest = (method: string, customMessage?: string): object => ({
  jsonrpc: '2.0',
  id: 1,
  method,
  params: {
    reason: TransactionEncoder.toJson(
      customMessage ? customMessage : 'I would like to know who you are on Ethereum'
    ),
    chainIds: TransactionEncoder.toJson(['ethereum-eip155-5777']),
  },
});
const revealAllIdentities: GetIdentitiesAuthorization = async (
  reason,
  matchingIdentities
): Promise<ReadonlyArray<PublicIdentity>> => {
  return matchingIdentities;
};
const signEverything: SignAndPostAuthorization = async (): Promise<boolean> => {
  return true;
};

withChainsDescribe('External handler', () => {
  beforeEach(
    (): void => {
      localStorage.clear();
    }
  );

  function checkNextRequest(request: object): void {
    const req = RequestHandler.next();
    expect(req.accept).not.toBe(null);
    expect(req.accept).not.toBe(undefined);
    expect(req.reject).not.toBe(null);
    expect(req.reject).not.toBe(undefined);

    expect(req.request).toEqual(request);
  }

  it('resolves to error if sender is unknown', async () => {
    const persona = await Persona.create();

    const server = persona.startSigningServer(revealAllIdentities, signEverything);
    const request = buildGetIdentitiesRequest('getIdentities');
    //eslint-disable-next-line
    expect(handleExternalMessage(server, request, null as any)).resolves.toMatchObject({
      error: {
        message: 'Unkown sender, droped request',
      },
    });

    persona.destroy();
  });

  it('resolves to error if signing server is not ready', async () => {
    const request = buildGetIdentitiesRequest('getIdentities');
    const sender = 'http://finex.com';
    // eslint-disable-next-line
    expect(handleExternalMessage(null as any, request, sender)).resolves.toMatchObject({
      error: {
        message: 'Signing server not ready',
      },
    });
  });

  it('resolves to error if whitelist handler is not loaded', async () => {
    const persona = await Persona.create();

    const server = persona.startSigningServer(revealAllIdentities, signEverything);
    const request = buildGetIdentitiesRequest('getIdentities');
    const sender = 'http://finex.com';
    expect(handleExternalMessage(server, request, sender)).resolves.toMatchObject({
      error: {
        message: 'SenderWhitelist has not been initialised',
      },
    });

    persona.destroy();
  });

  it('resolves to error if request method is unknown', async () => {
    const persona = await Persona.create();
    SenderWhitelist.load();
    const wrongMethod = 'getIdentitiiies';

    const server = persona.startSigningServer(revealAllIdentities, signEverything);
    const request = buildGetIdentitiesRequest(wrongMethod);
    const sender = 'http://finex.com';
    expect(handleExternalMessage(server, request, sender)).resolves.toMatchObject({
      error: {
        message: 'Request method not allowed, use getIdentities or signAndPost',
      },
    });

    persona.destroy();
  });

  it('enqueues a request', async () => {
    const persona = await Persona.create();
    SenderWhitelist.load();
    RequestHandler.create();

    const server = persona.startSigningServer(revealAllIdentities, signEverything);
    const request = buildGetIdentitiesRequest('getIdentities');
    const sender = 'http://finex.com';
    handleExternalMessage(server, request, sender);

    expect(RequestHandler.requests().length).toBe(1);
    checkNextRequest(request);

    persona.destroy();
  });

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
