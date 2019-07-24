import { ChainId } from '@iov/bcp';

import { withChainsDescribe } from '../utils/test/testExecutor';
import { lookupRecipientAddressByName } from './account';
import { disconnect } from './connection';

withChainsDescribe('Logic :: account', () => {
  afterAll(async () => {
    await disconnect();
  });

  it('should return undefined in case if bns username was not found', async () => {
    const address = await lookupRecipientAddressByName('test1*iov', 'ethereum-eip155-5777' as ChainId);

    expect(address).toBeUndefined();
  });
});
