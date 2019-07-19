import { TokenTicker } from '@iov/bcp';
import TestUtils from 'react-dom/test-utils';
import { DeepPartial, Store } from 'redux';

import { aNewStore } from '../../store';
import { BalanceState } from '../../store/balances';
import { RootState } from '../../store/reducers';
import { UsernamesState } from '../../store/usernames';
import { expectRoute } from '../../utils/test/dom';
import { findRenderedDOMComponentWithId } from '../../utils/test/reactElemFinder';
import { PAYMENT_ROUTE, RECEIVE_FROM_IOV_USER } from '../paths';
import { getIOVUsername, getNoFundsMessage } from './test/operateBalances';
import { travelToBalance } from './test/travelToBalance';

const balancesAmount: DeepPartial<BalanceState> = {
  BASH: {
    quantity: '82500',
    fractionalDigits: 4,
    tokenTicker: 'BASH' as TokenTicker,
  },
  CASH: {
    quantity: '1226775',
    fractionalDigits: 5,
    tokenTicker: 'CASH' as TokenTicker,
  },
};

const bnsChaingId = 'local-bns-devnet';
const usernames: DeepPartial<UsernamesState> = {
  [bnsChaingId]: {
    chainId: bnsChaingId,
    address: 'some_address',
    username: 'albert',
  },
};

describe('The /balance route', () => {
  let store: Store<RootState>;
  let balanceDom: React.Component;
  describe('with balance', () => {
    beforeEach(
      async (): Promise<void> => {
        store = aNewStore({
          extension: {
            connected: true,
            installed: true,
          },
          balances: balancesAmount,
          usernames,
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
      const receiveCard = (await findRenderedDOMComponentWithId(
        balanceDom,
        RECEIVE_FROM_IOV_USER,
      )) as Element;

      expect(receiveCard.textContent).toBe('Receive Payment');

      TestUtils.Simulate.click(receiveCard);
      //TODO: check for new route after "Receive payment" component implementation
      //expectRoute(RECEIVE_FROM_IOV_USER);
    });

    it('should check list of available balances', async () => {
      const balances = TestUtils.scryRenderedDOMComponentsWithClass(balanceDom, 'MuiTypography-colorPrimary');

      expect(balances.length).toBe(2);

      expect(balances[0].textContent).toBe('8.25 BASH');
      expect(balances[1].textContent).toBe('12.26775 CASH');
    });

    it('should show bns username', async () => {
      const noUsernameMessage = getIOVUsername(TestUtils.scryRenderedDOMComponentsWithTag(balanceDom, 'h5'));

      expect(noUsernameMessage).toBe('albert*iov');
    });
  });

  describe('without balance and username', () => {
    beforeEach(
      async (): Promise<void> => {
        store = aNewStore({
          extension: {
            connected: true,
            installed: true,
          },
        });
        balanceDom = await travelToBalance(store);
      },
    );

    it('should show that there is no balance available', async () => {
      const noFundsMessage = getNoFundsMessage(TestUtils.scryRenderedDOMComponentsWithTag(balanceDom, 'h6'));

      expect(noFundsMessage).toBe('No funds available');
    });

    it('should show that there is no bns username available', async () => {
      const noUsernameMessage = getIOVUsername(TestUtils.scryRenderedDOMComponentsWithTag(balanceDom, 'h5'));

      expect(noUsernameMessage).toBe('Get your human readable address.');
    });
  });
});
