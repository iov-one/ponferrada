import { BlockchainConnection, Identity } from '@iov/bcp';

import { aNewStore } from '../store';
import * as balanceActions from '../store/balances/actions';
import { getTokens } from '../store/tokens';
import { createPubkeys } from '../utils/test/pubkeys';
import { withChainsDescribe } from '../utils/test/testExecutor';
import { sleep } from '../utils/timer';
import * as tokens from '../utils/tokens';
import { disconnect } from './connection';
import { drinkFaucetIfNeeded } from './faucet';
import { subscribeBalance, unsubscribeBalances } from './subscriptions';

withChainsDescribe('Logic :: balance subscriptions', () => {
  beforeAll(() => {
    jest
      .spyOn(tokens, 'filterExistingTokens')
      .mockImplementation(
        (_connection: BlockchainConnection, _identity: Identity, tokensByChainId: ReadonlyArray<string>) =>
          Promise.resolve(tokensByChainId),
      );
  });

  afterEach(async () => {
    await disconnect();
  });

  afterAll(() => {
    jest.spyOn(tokens, 'filterExistingTokens').mockReset();
  });

  it('fires subscription callback when account balance changes', async () => {
    const balanceSpy = jest.spyOn(balanceActions, 'addBalancesAction');

    const store = aNewStore();
    const keys = await createPubkeys();

    const chainTokens = await getTokens();
    await drinkFaucetIfNeeded(keys, chainTokens);
    await subscribeBalance(keys, store.dispatch);

    // Trick for forcing account to receive balance events updates
    await drinkFaucetIfNeeded(keys, chainTokens);

    // Give some time to open request to be finished
    await sleep(1000);
    await sleep(1000);
    await sleep(1000);
    await sleep(1000);

    expect(balanceSpy).toHaveBeenCalledTimes(5);

    unsubscribeBalances();
  }, 35000);
});
