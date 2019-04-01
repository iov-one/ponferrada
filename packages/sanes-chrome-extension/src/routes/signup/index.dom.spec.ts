import TestUtils from 'react-dom/test-utils';
import { Store } from 'redux';
import { RootState } from '../../store/reducers';
import { aNewStore } from '../../store';
import { mayTestChains } from '../../utils/test/testExecutor';
import { travelToSignup } from './test/travelToSignup';
import { submitAccountForm } from './test/fillSignupForm';

describe('DOM > Feature > Signup', () => {
  let store: Store<RootState>;

  beforeEach(() => {
    store = aNewStore();
  });

  mayTestChains(
    `should redirect to show mnemonic step and check buttons`,
    async () => {
      const signupDOM = await travelToSignup(store);
      await submitAccountForm(signupDOM);

      const buttons = TestUtils.scryRenderedDOMComponentsWithTag(
        signupDOM,
        'button'
      );
      expect(buttons.length).toBe(2);
    },
    55000
  );
});
