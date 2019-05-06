import TestUtils from 'react-dom/test-utils';
import { Store } from 'redux';
import { configureStore } from '../../store';
import { RootState } from '../../store/reducers';
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
    }
  );

  describe('has a button that', () => {
    let button: React.ReactInstance;

    beforeEach(
      async (): Promise<void> => {
        button = await TestUtils.findRenderedDOMComponentWithTag(welcomeDom, 'button');
      }
    );

    it('exists', () => {
      expect(TestUtils.isDOMComponent(button)).toBeTruthy();
    });

    it('redirects to the /payment route when clicked', () => {
      TestUtils.Simulate.click(button);
      expectRoute(store, PAYMENT_ROUTE);
    });
  });
});
