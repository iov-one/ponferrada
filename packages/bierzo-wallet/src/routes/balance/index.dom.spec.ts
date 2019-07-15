import { TokenTicker } from '@iov/bcp';
import TestUtils from 'react-dom/test-utils';
import { DeepPartial, Store } from 'redux';

import { aNewStore } from '../../store';
import { BalanceState } from '../../store/balances';
import { RootState } from '../../store/reducers';
import { expectRoute } from '../../utils/test/dom';
import { findRenderedDOMComponentWithId } from '../../utils/test/reactElemFinder';
import { PAYMENT_ROUTE, RECEIVE_FROM_IOV_USER } from '../paths';
import { travelToBalance } from './test/travelToBalance';

const balancesAmount: DeepPartial<BalanceState> = {
  CASH: {
    quantity: '10000',
    fractionalDigits: 9,
    tokenTicker: 'CASH' as TokenTicker,
  },
  IOV: {
    quantity: '12345',
    fractionalDigits: 9,
    tokenTicker: 'IOV' as TokenTicker,
  },
};

describe('The /balance route', () => {
  let store: Store<RootState>;
  let balanceDom: React.Component;

  beforeEach(
    async (): Promise<void> => {
      store = aNewStore({
        extension: {
          connected: true,
          installed: true,
        },
        balances: balancesAmount,
      });
      balanceDom = await travelToBalance(store);
    },
  );

  it('redirects to the /payment route when clicked', async () => {
    const paymentCard = (await findRenderedDOMComponentWithId(balanceDom, PAYMENT_ROUTE)) as Element;

    expect(paymentCard.textContent).toBe('Send payment');

    TestUtils.Simulate.click(paymentCard);
    expectRoute(PAYMENT_ROUTE);
  });

  it('redirects to the /receive-from-iov route when clicked', async () => {
    const receiveCard = (await findRenderedDOMComponentWithId(balanceDom, RECEIVE_FROM_IOV_USER)) as Element;

    expect(receiveCard.textContent).toBe('Receive Payment');

    TestUtils.Simulate.click(receiveCard);
    //TODO: check for new route after "Receive payment" component implementation
    //expectRoute(RECEIVE_FROM_IOV_USER);
  });
});
