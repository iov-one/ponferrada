import TestUtils from 'react-dom/test-utils';
import { Store } from 'redux';
import { configureStore, RootState } from '../../store';
import { expectRoute } from '../../utils/test/dom';
import { PAYMENT_ROUTE } from '../paths';
import { travelToWelcome } from './test/travelToWelcome';

describe('The /welcome route', () => {
  let store: Store<RootState>;
  let welcomeDom: React.Component;

  beforeEach(
    async (): Promise<void> => {
      store = configureStore();
      welcomeDom = await travelToWelcome(store);
    },
  );

  it('redirects to the /payment route when clicked', () => {
    const buttons = TestUtils.scryRenderedDOMComponentsWithTag(welcomeDom, 'button');
    const paymentButton = buttons[0];
    if (!paymentButton) {
      throw new Error('Payment button not found');
    }
    expect(paymentButton.textContent).toBe('SEND PAYMENT');

    TestUtils.Simulate.click(paymentButton);
    expectRoute(PAYMENT_ROUTE);
  });
});
