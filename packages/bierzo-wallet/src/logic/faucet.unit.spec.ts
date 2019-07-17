import { getBalances } from '../store/balances';
import { createPubkeys } from '../utils/test/pubkeys';
import { withChainsDescribe } from '../utils/test/testExecutor';
import { disconnect } from './connection';
import { drinkFaucetIfNeeded } from './faucet';

withChainsDescribe('Logic :: faucet', () => {
  afterAll(async () => {
    await disconnect();
  });

  it('works', async () => {
    // generate keys
    const keys = await createPubkeys();
    // check their balance are 0
    const initialBalances = await getBalances(keys);
    expect(initialBalances).toEqual({});
    // drink faucet
    await drinkFaucetIfNeeded(keys);
    // check their balances
    const balances = await getBalances(keys);
    expect(balances).toEqual({
      BASH: {
        fractionalDigits: 9,
        quantity: '10000000000',
        tokenTicker: 'BASH',
      },
      CASH: {
        fractionalDigits: 9,
        quantity: '10000000000',
        tokenTicker: 'CASH',
      },
      ETH: {
        fractionalDigits: 18,
        quantity: '10000000000000000000',
        tokenTicker: 'ETH',
      },
    });
  }, 45000);

  it('does not drink from faucet if tokens are already available', async () => {
    // generate keys
    const keys = await createPubkeys();
    // drink faucet twice
    await drinkFaucetIfNeeded(keys);
    await drinkFaucetIfNeeded(keys);
    // check their balances
    const balances = await getBalances(keys);
    expect(balances).toEqual({
      BASH: {
        fractionalDigits: 9,
        quantity: '10000000000',
        tokenTicker: 'BASH',
      },
      CASH: {
        fractionalDigits: 9,
        quantity: '10000000000',
        tokenTicker: 'CASH',
      },
      ETH: {
        fractionalDigits: 18,
        quantity: '10000000000000000000',
        tokenTicker: 'ETH',
      },
    });
  }, 45000);
});
