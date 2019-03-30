import TestUtils from 'react-dom/test-utils';
import { Store } from 'redux';
import { RootState } from '../../store/reducers';
import { aNewStore } from '../../store';
import { mayTestChains } from '../../utils/testhelper';
import { travelToSignup } from './testUtils/travelSignup';

describe('DOM > Feature > Signup', () => {
  let store: Store<RootState>;

  beforeEach(async () => {
    store = aNewStore();
  });

  mayTestChains(
    `should redirect to show mnemonic step`,
    async () => {
      const signupDOM = await travelToSignup(store);
      const buttons = TestUtils.scryRenderedDOMComponentsWithTag(
        signupDOM,
        'input'
      );

      expect(buttons.length).toBe(3);
    },
    55000
  );
});
