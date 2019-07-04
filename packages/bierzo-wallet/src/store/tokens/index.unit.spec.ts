import { aNewStore } from '../../store';
import { withChainsDescribe } from '../../utils/test/testExecutor';
import { addTickersAction, getTokens } from './actions';

withChainsDescribe('Tokens reducer', () => {
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

    const ethToken = {
      ETH: {
        chainId: 'ethereum-eip155-5777',
        token: {
          fractionalDigits: 18,
          tokenName: 'Ether',
          tokenTicker: 'ETH',
        },
      },
    };

    expect(tokens).toEqual(ethToken);
  });
});
