import { disconnect } from '../../logic/connection';
import { aNewStore } from '../../store';
import { withChainsDescribe } from '../../utils/test/testExecutor';
import { addTickersAction, getTokens } from './actions';

withChainsDescribe('Tokens reducer', () => {
  afterAll(async () => {
    await disconnect();
  });

  it('has correct initial state', async () => {
    const store = aNewStore();
    const tokens = store.getState().tokens;
    expect(tokens).toEqual({});
  });

  it('dispatches correctly getTokens action', async () => {
    const store = aNewStore();
    const chainTokens = await getTokens();
    store.dispatch(addTickersAction(chainTokens));
    const tokens = store.getState().tokens;
    expect(tokens).toEqual(chainTokens);
  });

  it('stores correctly tokens', async () => {
    const store = aNewStore();
    const chainTokens = await getTokens();
    store.dispatch(addTickersAction(chainTokens));
    const storedTokens = store.getState().tokens;

    const tokens = {
      ETH: {
        chainId: 'ethereum-eip155-5777',
        token: {
          fractionalDigits: 18,
          tokenName: 'Ether',
          tokenTicker: 'ETH',
        },
      },
      ASH: {
        chainId: 'local-iov-devnet',
        token: {
          fractionalDigits: 9,
          tokenName: 'Let the Phoenix arise',
          tokenTicker: 'ASH',
        },
      },
      BASH: {
        chainId: 'local-iov-devnet',
        token: {
          fractionalDigits: 9,
          tokenName: 'Another token of this chain',
          tokenTicker: 'BASH',
        },
      },
      CASH: {
        chainId: 'local-iov-devnet',
        token: {
          fractionalDigits: 9,
          tokenName: 'Main token of this chain',
          tokenTicker: 'CASH',
        },
      },
      LSK: {
        chainId: 'lisk-198f2b61a8',
        token: {
          fractionalDigits: 8,
          tokenName: 'Lisk',
          tokenTicker: 'LSK',
        },
      },
    };

    expect(storedTokens).toEqual(tokens);
  });
});
