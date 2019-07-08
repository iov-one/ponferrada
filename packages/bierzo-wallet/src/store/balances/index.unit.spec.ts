import { aNewStore } from '../../store';
import { withChainsDescribe } from '../../utils/test/testExecutor';
import { addBalancesAction, getBalances } from './actions';

withChainsDescribe('Tokens reducer', () => {
  it('has correct initial state', async () => {
    const store = aNewStore();
    const tokens = store.getState().tokens;
    expect(tokens).toEqual({});
  });

  it('dispatches correctly getTokens action', async () => {
    const store = aNewStore();
    const chainBalances = await getBalances();
    store.dispatch(addBalancesAction(chainBalances));
    const tokens = store.getState().tokens;
    expect(tokens).toEqual(chainBalances);
  });
});
