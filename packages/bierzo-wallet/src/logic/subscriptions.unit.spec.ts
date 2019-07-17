import { BlockchainConnection, Identity } from '@iov/bcp';

import { aNewStore } from '../store';
import * as balanceActions from '../store/balances/actions';
import { getTokens } from '../store/tokens';
import { createPubkeys } from '../utils/test/pubkeys';
import { withChainsDescribe } from '../utils/test/testExecutor';
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
    await drinkFaucetIfNeeded(keys, chainTokens);

    expect(balanceSpy).toHaveBeenCalledTimes(5);

    unsubscribeBalances();
    await disconnect();
  }, 65000);
});
