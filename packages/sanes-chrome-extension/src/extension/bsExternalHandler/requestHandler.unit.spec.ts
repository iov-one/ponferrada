import { PublicIdentity } from '@iov/bcp';
import { TransactionEncoder, GetIdentitiesAuthorization, SignAndPostAuthorization } from '@iov/core';

import { withChainsDescribe } from '../../utils/test/testExecutor';
import { handleExternalMessage } from './index';
import { Persona } from '../../logic/persona';
import { SenderWhitelist } from './senderWhitelist';

const buildGetIdentitiesRequest = (method: string): object => ({
  jsonrpc: '2.0',
  id: 1,
  method,
  params: {
    reason: TransactionEncoder.toJson('I would like to know who you are on Ethereum'),
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
    const persona = await Persona.create();

    const request = buildGetIdentitiesRequest('getIdentities');
    const sender = 'http://finex.com';
    // eslint-disable-next-line
    expect(handleExternalMessage(null as any, request, sender)).resolves.toMatchObject({
      error: {
        message: 'Signing server not ready',
      },
    });

    persona.destroy();
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
        message: 'Error: Unknown method name',
      },
    });

    persona.destroy();
  });

  it('resolves to error if sender is blocked', async () => {});
});
