import { PublicIdentity } from '@iov/bcp';
import { TransactionEncoder, GetIdentitiesAuthorization, SignAndPostAuthorization } from '@iov/core';

import { withChainsDescribe } from '../../utils/test/testExecutor';
import { handleExternalMessage } from './index';
import { Persona } from '../../logic/persona';

const buildGetIdentitiesRequest = (method: string): object => ({
  sonrpc: '2.0',
  id: 1,
  method,
  params: {
    reason: TransactionEncoder.toJson('I would like to know who you are on Ethereum'),
    chainIds: TransactionEncoder.toJson(['ethereum-eip155-5777']),
  },
});

withChainsDescribe('External handler', () => {
  const revealAllIdentities: GetIdentitiesAuthorization = async (
    reason,
    matchingIdentities
  ): Promise<ReadonlyArray<PublicIdentity>> => {
    return matchingIdentities;
  };
  const signEverything: SignAndPostAuthorization = async (): Promise<boolean> => {
    return true;
  };

  it('resolves to error if request method is unknown', async () => {
    const persona = await Persona.create();

    const wrongMethod = 'getIdentitiiies';
    const request = buildGetIdentitiesRequest(wrongMethod);
    const server = persona.startSigningServer(revealAllIdentities, signEverything);

    expect(handleExternalMessage(server, request)).resolves.toMatchObject({
      error: {
        message: 'Error: Unknown method name',
      },
    });

    persona.destroy();
  });

  it('resolves to error if signing server is not ready', async () => {
    const persona = await Persona.create();
    const request = buildGetIdentitiesRequest('getIdentities');
    // eslint-disable-next-line
    expect(handleExternalMessage(null as any, request)).resolves.toMatchObject({
      error: {
        message: 'Signing server not ready',
      },
    });

    persona.destroy();
  });
});
