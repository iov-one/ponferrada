import { EthereumConnection } from '@iov/ethereum';

import { getConfig } from '../config';
import { withChainsDescribe } from '../utils/test/testExecutor';
import { disconnect, getConnectionFor } from './connection';

withChainsDescribe('Logic :: connection', () => {
  afterAll(async () => {
    await disconnect();
  });

  it('calls connections only once', async () => {
    const config = getConfig();
    const firstChain = config.chains[2];

    const ethereumConnectionSpy = jest.spyOn(EthereumConnection, 'establish');

    expect(firstChain.chainSpec.codecType).toBe('eth');
    await getConnectionFor(firstChain.chainSpec);
    await getConnectionFor(firstChain.chainSpec);
    await getConnectionFor(firstChain.chainSpec);

    expect(ethereumConnectionSpy).toHaveBeenCalledTimes(1);
  });

  it('reset connections correctly when disconnecting', async () => {
    // GIVEN
    const config = getConfig();
    const firstChain = config.chains[2];
    expect(firstChain.chainSpec.codecType).toBe('eth');

    const ethereumConnectionSpy = jest.spyOn(EthereumConnection, 'establish');
    await getConnectionFor(firstChain.chainSpec);
    await getConnectionFor(firstChain.chainSpec);
    await getConnectionFor(firstChain.chainSpec);

    // WHEN
    await disconnect();

    // THEN
    expect(ethereumConnectionSpy).toHaveBeenCalledTimes(1);
    await getConnectionFor(firstChain.chainSpec);
    await getConnectionFor(firstChain.chainSpec);
    await getConnectionFor(firstChain.chainSpec);
    expect(ethereumConnectionSpy).toHaveBeenCalledTimes(2);
  });
});
