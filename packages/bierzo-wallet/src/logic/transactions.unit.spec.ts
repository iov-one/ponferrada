import { BlockchainConnection, Identity } from '@iov/bcp';

import { aNewStore } from '../store';
import * as balanceActions from '../store/balances/actions';
import { createPubkeys } from '../utils/test/pubkeys';
import { withChainsDescribe } from '../utils/test/testExecutor';
import { sleep } from '../utils/timer';
import * as tokens from '../utils/tokens';
import { subscribeBalance, unsubscribeBalances } from './balances';
import { disconnect } from './connection';
import { drinkFaucetIfNeeded } from './faucet';

withChainsDescribe('Logic :: balance subscriptions', () => {
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

  it('fires subscription callback when account balance changes', async () => {
    const balanceSpy = jest.spyOn(balanceActions, 'addBalancesAction');

    const store = aNewStore();
    const keys = await createPubkeys();

    await drinkFaucetIfNeeded(keys);
    await subscribeBalance(keys, store.dispatch);

    // Trick for forcing account to receive balance events updates
    await drinkFaucetIfNeeded(keys);

    // Give some time to open request to be finished
    await sleep(1000);

    expect(balanceSpy).toHaveBeenCalledTimes(2);

    unsubscribeBalances();
  }, 35000);
});
