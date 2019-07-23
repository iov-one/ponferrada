import { BlockchainConnection, Identity } from '@iov/bcp';

import { aNewStore } from '../store';
import * as transactionActions from '../store/notifications/actions';
import { createPubkeys } from '../utils/test/pubkeys';
import { withChainsDescribe } from '../utils/test/testExecutor';
import { sleep } from '../utils/timer';
import * as tokens from '../utils/tokens';
import { disconnect } from './connection';
import { drinkFaucetIfNeeded } from './faucet';
import { subscribeTransaction, unsubscribeTransactions } from './transactions';

withChainsDescribe('Logic :: transaction subscriptions', () => {
  beforeAll(() => {
    jest
      .spyOn(tokens, 'filterExistingTokens')
      .mockImplementation(
        (_connection: BlockchainConnection, _identity: Identity, tokensByChainId: ReadonlyArray<string>) =>
          Promise.resolve(tokensByChainId),
      );
  });

  afterAll(async () => {
    jest.spyOn(tokens, 'filterExistingTokens').mockReset();
    await disconnect();
  });

  it('fires transaction callback when account balance changes', async () => {
    const txsSpy = jest.spyOn(transactionActions, 'addConfirmedTransaction');

    const store = aNewStore();
    const keys = await createPubkeys();

    await drinkFaucetIfNeeded(keys);
    await subscribeTransaction(keys, store.dispatch);

    // Trick for forcing account to receive balance events updates
    await drinkFaucetIfNeeded(keys);

    // Give some time to open request to be finished
    await sleep(1000);

    // 2 (cash) + 2 (bash) + 2 eth
    expect(txsSpy).toHaveBeenCalledTimes(6);

    unsubscribeTransactions();
  }, 60000);
});
